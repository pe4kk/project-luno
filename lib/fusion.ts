import type { Chapitre, ChapitrePublie, Donnees, Flashcard, Matiere } from "./types";

/** Ce qui est synchronisé entre les appareils d'un même compte. */
export type DonneesSynchro = Donnees & {
  publies: Record<string, number>;
  calendrier: string[] | null;
};

/**
 * Retire des chapitres publiés ce que le site sait reconstruire tout seul (fiche,
 * exercices, documents, schémas des cartes) : on ne synchronise que ce qui est propre à
 * l'utilisateur, ce qui garde les envois légers.
 */
export function alleger(d: DonneesSynchro, bibliotheque: ChapitrePublie[]): DonneesSynchro {
  const publies = new Set(bibliotheque.map((p) => p.id));
  return {
    ...d,
    chapitres: d.chapitres.map((c) =>
      c.publieId && publies.has(c.publieId)
        ? {
            ...c,
            fiche: null,
            exercices: [],
            documents: [],
            definitions: [],
            flashcards: c.flashcards.map((f) => ({ ...f, schema: undefined })),
          }
        : c,
    ),
  };
}

/** L'inverse d'`alleger()` : remet le contenu publié dans les chapitres qui en viennent. */
export function regonfler(d: DonneesSynchro, bibliotheque: ChapitrePublie[]): DonneesSynchro {
  const parId = new Map(bibliotheque.map((p) => [p.id, p]));
  return {
    ...d,
    chapitres: d.chapitres.map((c) => {
      const p = c.publieId ? parId.get(c.publieId) : undefined;
      if (!p) return c;
      const schemas = new Map(
        p.flashcards.filter((k) => k.schema).map((k) => [k.recto.toLowerCase(), k.schema]),
      );
      return {
        ...c,
        fiche: c.fiche ?? p.fiche,
        definitions: c.definitions?.length ? c.definitions : (p.definitions ?? []),
        exercices: c.exercices.length ? c.exercices : p.exercices,
        documents: c.documents.length ? c.documents : (p.documents ?? []),
        flashcards: c.flashcards.map((f) => {
          const s = schemas.get(f.recto.toLowerCase());
          return s && !f.schema ? { ...f, schema: s } : f;
        }),
      };
    }),
  };
}

/** De deux versions d'une même carte, garde celle qui a le plus progressé. */
function meilleureCarte(a: Flashcard, b: Flashcard) {
  if (b.intervalle !== a.intervalle) return b.intervalle > a.intervalle ? b : a;
  return b.echeance > a.echeance ? b : a;
}

/**
 * Réunit les données de deux appareils, la première (`a`) étant prioritaire en cas de
 * doublon. Sert quand un appareil se connecte pour la première fois avec des données à
 * lui, ou quand les deux ont changé chacun de leur côté : rien n'est perdu.
 *
 * Les appareils ont repris les mêmes contenus publiés chacun de leur côté, avec des
 * identifiants différents : les matières se reconnaissent à leur nom, les chapitres
 * publiés à `publieId` (sinon matière et titre), les cartes à leur recto.
 */
export function fusionner(a: DonneesSynchro, b: DonneesSynchro): DonneesSynchro {
  // Matières
  const matieres: Matiere[] = [...a.matieres];
  const idMatiere = new Map<string, string>();
  for (const m of b.matieres) {
    const meme =
      matieres.find((x) => x.id === m.id) ??
      matieres.find((x) => x.nom.trim().toLowerCase() === m.nom.trim().toLowerCase());
    if (meme) idMatiere.set(m.id, meme.id);
    else {
      matieres.push(m);
      idMatiere.set(m.id, m.id);
    }
  }
  const matiere = (id: string) => idMatiere.get(id) ?? id;

  // Chapitres
  const cle = (c: Chapitre, mid: string) =>
    c.publieId ? `p:${c.publieId}` : `t:${mid}:${c.titre.trim().toLowerCase()}`;
  const chapitres: Chapitre[] = a.chapitres.map((c) => ({ ...c }));
  const parCle = new Map(chapitres.map((c, i) => [cle(c, c.matiereId), i]));
  const parIdChap = new Map(chapitres.map((c, i) => [c.id, i]));
  const idChapitre = new Map<string, string>();
  for (const c of b.chapitres) {
    const mid = matiere(c.matiereId);
    const i = parIdChap.get(c.id) ?? parCle.get(cle(c, mid));
    if (i === undefined) {
      chapitres.push({ ...c, matiereId: mid });
      idChapitre.set(c.id, c.id);
      continue;
    }
    const x = chapitres[i];
    idChapitre.set(c.id, x.id);
    const cartes = new Map(x.flashcards.map((f) => [f.recto.trim().toLowerCase(), f]));
    for (const f of c.flashcards) {
      const k = f.recto.trim().toLowerCase();
      const deja = cartes.get(k);
      cartes.set(k, deja ? { ...meilleureCarte(deja, f), id: deja.id } : f);
    }
    chapitres[i] = {
      ...x,
      cours: x.cours.trim() ? x.cours : c.cours,
      flashcards: [...cartes.values()],
    };
  }
  const chapitre = (id: string) => idChapitre.get(id) ?? id;

  // DST : même identifiant (calendrier du lycée, dates publiées) ou même devoir.
  const dsts = [...a.dsts];
  for (const d of b.dsts) {
    const x = {
      ...d,
      matiereId: matiere(d.matiereId),
      chapitreIds: d.chapitreIds.map(chapitre),
    };
    const i = dsts.findIndex(
      (y) =>
        y.id === x.id ||
        (y.date === x.date &&
          y.matiereId === x.matiereId &&
          y.titre.trim().toLowerCase() === x.titre.trim().toLowerCase()),
    );
    if (i < 0) dsts.push(x);
    else
      dsts[i] = {
        ...dsts[i],
        heure: dsts[i].heure || x.heure,
        salle: dsts[i].salle || x.salle,
        notes: dsts[i].notes || x.notes,
        chapitreIds: [...new Set([...dsts[i].chapitreIds, ...x.chapitreIds])],
      };
  }

  // Tâches : même identifiant ou même texte.
  const taches = [...a.taches];
  for (const t of b.taches) {
    const i = taches.findIndex(
      (y) => y.id === t.id || y.texte.trim().toLowerCase() === t.texte.trim().toLowerCase(),
    );
    if (i < 0) taches.push(t);
    else if (t.fait && !taches[i].fait) taches[i] = { ...taches[i], fait: true };
  }

  // Erreurs notées : même identifiant ou même titre dans la même matière.
  const erreurs = [...(a.erreurs ?? [])];
  for (const e of b.erreurs ?? []) {
    const x = { ...e, matiereId: matiere(e.matiereId) };
    const meme = erreurs.some(
      (y) =>
        y.id === x.id ||
        (y.matiereId === x.matiereId &&
          y.titre.trim().toLowerCase() === x.titre.trim().toLowerCase()),
    );
    if (!meme) erreurs.push(x);
  }

  const publies = { ...b.publies };
  for (const [k, v] of Object.entries(a.publies)) publies[k] = Math.max(v, publies[k] ?? 0);

  return {
    matieres,
    chapitres,
    dsts,
    taches,
    erreurs,
    publies,
    calendrier: a.calendrier ?? b.calendrier,
  };
}
