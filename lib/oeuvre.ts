/**
 * Œuvre intégrale explorée dans l'onglet « Bac » (roman) : l'immeuble, les familles,
 * les personnages, les chapitres et un quiz « Qui est-ce ? ». Données dans
 * `contenu/<œuvre>.ts`, écran dans `components/travail/Oeuvre.tsx`.
 *
 * Tout ce qui dépend de l'avancée de la lecture porte un numéro de chapitre : on peut
 * arrêter l'œuvre à `luJusqua` sans rien dévoiler de la suite.
 */

/** Un logement (ou un lieu) de l'immeuble. */
export type Logement = {
  id: string;
  /** -1 = loge et sous-sol, 0 = rez-de-chaussée, 0.5 = entresol, 5 = étage des bonnes. */
  etage: number;
  cote: "rue" | "cour" | "tout";
  nom: string;
  /** Ce qu'il faut remarquer (le tapis rouge s'arrête au 3e…). */
  detail?: string;
  /** Objet qui résume l'appartement, vu par la fenêtre (emoji). */
  objet?: string;
  /** Volets toujours clos (les gens qu'on ne voit pas). */
  persiennes?: boolean;
};

/** Où vit un personnage, éventuellement entre deux chapitres (inclus). */
export type Adresse = { lieu: string; de?: number; a?: number; note?: string };

export type Personnage = {
  id: string;
  nom: string;
  /** Nom court pour les étiquettes (« Auguste », « Mme Josserand »). */
  court: string;
  famille: string;
  /** Qui il est, en une ligne. */
  role: string;
  /** 1 = indispensable, 2 = à connaître, 3 = détail. */
  importance: 1 | 2 | 3;
  sexe: "f" | "m";
  age?: string;
  metier?: string;
  adresses: Adresse[];
  /** Où le trouver s'il n'habite pas l'immeuble. */
  ailleurs?: string;
  traits: string[];
  /** Ce qu'il fait, chapitre par chapitre. */
  faits: { ch: number; t: string }[];
  citation?: { texte: string; ch: number; contexte?: string };
};

export type TypeLien = "mariage" | "famille" | "liaison" | "travail" | "autre";

/** Relation entre deux personnages, connue à partir du chapitre `ch`. */
export type Lien = { de: string; a: string; type: TypeLien; libelle: string; ch?: number };

/** Nœud d'un arbre généalogique : un personnage, son conjoint, ses enfants. */
export type Noeud = {
  id: string;
  conjoint?: string;
  note?: string;
  /** Lien plus lointain (neveu, cousine…) : trait en pointillé. */
  pointille?: boolean;
  enfants?: Noeud[];
};

export type Famille = {
  id: string;
  nom: string;
  couleur: string;
  /** Une phrase pour situer la famille. */
  resume: string;
  /** Un ou plusieurs arbres (côté du père, côté de la mère, belle-famille…). */
  arbres?: Noeud[];
};

export type ChapitreOeuvre = {
  n: number;
  titre: string;
  /** Moment de l'histoire (« Novembre, le soir de l'arrivée »). */
  moment: string;
  resume: string[];
  personnages: string[];
};

export type Oeuvre = {
  id: string;
  titre: string;
  auteur: string;
  date: string;
  /** Une phrase sur l'œuvre. */
  presentation: string;
  /** Le décor, en quelques lignes (l'escalier, la cour…). */
  decor: string[];
  /** Nombre total de chapitres et dernier chapitre lu par l'élève. */
  chapitres: number;
  luJusqua: number;
  logements: Logement[];
  familles: Famille[];
  personnages: Personnage[];
  liens: Lien[];
  resumes: ChapitreOeuvre[];
};

/** Logements d'un personnage au chapitre `ch`. */
export function adressesAu(p: Personnage, ch: number): Adresse[] {
  return p.adresses.filter((a) => (a.de ?? 1) <= ch && ch <= (a.a ?? 99));
}

/** Habitants d'un logement au chapitre `ch`, les plus importants d'abord. */
export function habitants(o: Oeuvre, lieu: string, ch: number): Personnage[] {
  return o.personnages
    .filter((p) => adressesAu(p, ch).some((a) => a.lieu === lieu))
    .sort((a, b) => a.importance - b.importance);
}

/** Liens d'un personnage connus au chapitre `ch`. */
export function liensDe(o: Oeuvre, id: string, ch: number): { lien: Lien; autre: string }[] {
  return o.liens
    .filter((l) => (l.ch ?? 1) <= ch && (l.de === id || l.a === id))
    .map((l) => ({ lien: l, autre: l.de === id ? l.a : l.de }));
}

export const ROMAINS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

/** « 1er étage, sur la rue ». */
export function nomLogement(l: Logement): string {
  return l.nom;
}

// ---------------------------------------------------------------------------
// Quiz « Qui est-ce ? » : questions tirées des données, jamais écrites à la main.
// ---------------------------------------------------------------------------

export type QuestionQuiz = {
  type: "qui" | "ou" | "lien" | "citation";
  question: string;
  /** Petite consigne au-dessus de la question. */
  consigne: string;
  choix: string[];
  bonne: number;
  explication: string;
  /** Personnage concerné, pour ouvrir sa fiche après la réponse. */
  personnage: string;
};

/** Générateur pseudo-aléatoire reproductible (mêmes exercices publiés à chaque build). */
export function hasard(graine: number) {
  let s = graine >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

function melange<T>(t: T[], r: () => number): T[] {
  const c = [...t];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

/** « Berthe Josserand » plutôt que « Mme Josserand (Éléonore) » : une réponse ne doit pas se reconnaître à sa forme. */
export function nomSimple(p: Personnage): string {
  return p.nom.replace(/ \(.*\)$/, "");
}

/** « de M. Vabre », « d’Achille Campardon ». */
function de(nom: string): string {
  return /^[aeiouyéèêâîôûhAEIOUYÉÈÊÂÎÔÛH]/.test(nom) ? `d’${nom}` : `de ${nom}`;
}

/** Article d'un lien (« la », « le », « l’ ») : les intrus gardent le même, sinon le genre trahit la réponse. */
const article = (libelle: string) => libelle.split(/[ ’]/)[0];

/** Place la bonne réponse parmi trois intrus, dans un ordre tiré. */
function avecIntrus(bonne: string, intrus: string[], r: () => number) {
  const uniques = [...new Set(intrus.filter((x) => x !== bonne))].slice(0, 3);
  const choix = melange([bonne, ...uniques], r);
  return { choix, bonne: choix.indexOf(bonne) };
}

/** Logement principal (le dernier connu à ce chapitre). */
export function logementAu(o: Oeuvre, p: Personnage, ch: number): Logement | undefined {
  const a = adressesAu(p, ch).at(-1);
  return a ? o.logements.find((l) => l.id === a.lieu) : undefined;
}

/**
 * Toutes les questions possibles sur l'œuvre, jusqu'au chapitre lu. `niveau` 1 garde
 * les personnages indispensables, 2 ajoute ceux à connaître, 3 tout le monde.
 */
export function questionsQuiz(o: Oeuvre, niveau: 1 | 2 | 3, graine = Date.now()): QuestionQuiz[] {
  const r = hasard(graine);
  const ch = o.luJusqua;
  const visibles = o.personnages.filter((p) => p.importance <= niveau);
  const tous = o.personnages.filter((p) => p.importance <= Math.max(2, niveau));
  const nomDe = (id: string) => {
    const p = o.personnages.find((x) => x.id === id);
    return p ? nomSimple(p) : id;
  };
  const qs: QuestionQuiz[] = [];

  for (const p of visibles) {
    // Qui est-ce ? : son rôle, des intrus du même sexe (sinon la réponse se devine).
    const memes = melange(tous.filter((x) => x.id !== p.id && x.sexe === p.sexe), r);
    const procheFamille = memes.filter((x) => x.famille === p.famille);
    const intrus = [...procheFamille, ...memes].map(nomSimple);
    qs.push({
      type: "qui",
      consigne: "Qui est-ce ?",
      question: `${p.role}${p.traits[0] ? `. ${p.traits[0]}` : ""}.`,
      ...avecIntrus(nomSimple(p), intrus, r),
      explication: `${p.nom} : ${p.role.charAt(0).toLowerCase()}${p.role.slice(1)}.`,
      personnage: p.id,
    });

    // Où habite-t-il ? : seulement pour les habitants de l'immeuble.
    const l = logementAu(o, p, ch);
    if (l && l.id !== "dehors") {
      const autres = melange(
        o.logements.filter((x) => x.id !== l.id && x.id !== "dehors"),
        r,
      ).map((x) => x.nom);
      qs.push({
        type: "ou",
        consigne: "Dans l'immeuble",
        question: `Où vit ${nomSimple(p)} au chapitre ${ROMAINS[ch]} ?`,
        ...avecIntrus(l.nom, autres, r),
        explication: `${p.nom} : ${l.nom.toLowerCase()}.${l.detail ? ` ${l.detail}` : ""}`,
        personnage: p.id,
      });
    }

    if (p.citation && p.citation.ch <= ch) {
      qs.push({
        type: "citation",
        consigne: "Qui parle ?",
        question: `« ${p.citation.texte} »`,
        ...avecIntrus(nomSimple(p), intrus, r),
        explication: `${p.nom}, chapitre ${ROMAINS[p.citation.ch]}${p.citation.contexte ? ` : ${p.citation.contexte}` : ""}.`,
        personnage: p.id,
      });
    }
  }

  // Quel lien entre A et B ? : intrus pris parmi les autres liens.
  const liens = o.liens.filter((l) => (l.ch ?? 1) <= ch);
  for (const l of liens) {
    const a = o.personnages.find((p) => p.id === l.de);
    const b = o.personnages.find((p) => p.id === l.a);
    if (!a || !b || a.importance > niveau || b.importance > Math.max(2, niveau)) continue;
    // Intrus : même article, et jamais un libellé qui contient l'autre (« la fille » / « la fille cadette »),
    // ni un autre lien vrai entre les deux mêmes personnages.
    const vrais = new Set(liens.filter((x) => x.de === l.de && x.a === l.a).map((x) => x.libelle));
    const intrus = melange(
      liens.filter(
        (x) =>
          x.type !== "autre" &&
          !vrais.has(x.libelle) &&
          article(x.libelle) === article(l.libelle) &&
          !x.libelle.startsWith(l.libelle) &&
          !l.libelle.startsWith(x.libelle),
      ),
      r,
    ).map((x) => x.libelle);
    if (new Set(intrus).size < 3) continue;
    qs.push({
      type: "lien",
      consigne: "Quel lien ?",
      question: `${nomSimple(a)} est… ${de(nomSimple(b))}`,
      ...avecIntrus(l.libelle, intrus, r),
      explication: `${nomDe(l.de)} est ${l.libelle} ${de(nomDe(l.a))}${l.ch && l.ch > 1 ? ` (chapitre ${ROMAINS[l.ch]})` : ""}.`,
      personnage: a.id,
    });
  }

  return melange(qs, r);
}
