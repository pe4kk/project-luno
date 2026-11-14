import { melanger, simplifier } from "./contenu";
import { sansMiseEnForme } from "@/components/Formule";
import type { Chapitre, Flashcard } from "./types";

/**
 * Mode « Apprendre » (S'exercer) : chaque notion (une flashcard) monte par paliers
 * jusqu'à être maîtrisée. 1 = la reconnaître (QCM), 2 = la compléter (texte à trous),
 * 3 = l'écrire de tête (comparée au cours, validée par l'élève). Une notion courte n'a
 * que deux paliers : QCM puis de tête. Le palier atteint est gardé dans la carte
 * (`apprendre` : 0 à 3, 3 = maîtrisée) et synchronisé.
 */

export type Palier = 1 | 2 | 3;
export const MAITRISEE = 3;
export const TAILLE_MANCHE = 7;

const VIDES = new Set(
  "alors aussi avec avoir avant cela celle celui cette dans depuis donc elle elles entre est être fait font leur leurs mais même nous pour plus quand quel quelle qu'il sans selon sont tout tous toute toutes très vers une des les par sur qui que dont ou où son ses aux ils lui cet ces sous peut ainsi comme auquel lequel laquelle lesquels duquel chaque autre autres celles ceux".split(
    " ",
  ),
);

/** Les mots qui comptent dans un texte (sans formules, mots vides ni petits mots). */
export function motsCles(texte: string): string[] {
  const brut = sansMiseEnForme(texte).replace(/\{\{[^}]*\}\}/g, " ");
  return [
    ...new Set(
      brut
        .split(/[\s,;:.!?()«»"'’/—–-]+/)
        .map((m) => m.trim())
        .filter((m) => m.length >= 4 && /^[A-Za-zÀ-ÿ]+$/.test(m) && !VIDES.has(simplifier(m))),
    ),
  ];
}

/** Une notion est courte si elle tient en peu de mots : pas de texte à trous. */
export const estCourte = (f: Flashcard) => motsCles(f.verso).length <= 4;

/** Le palier à travailler pour une carte (celui qu'elle n'a pas encore réussi). */
export function palierSuivant(f: Flashcard): Palier {
  const atteint = f.apprendre ?? 0;
  if (atteint >= 2) return 3;
  if (atteint === 1) return estCourte(f) ? 3 : 2;
  return 1;
}

/** Palier enregistré après une réussite au palier `p`. */
export const apresReussite = (f: Flashcard, p: Palier) => (p === 3 ? 3 : p === 1 && estCourte(f) ? 2 : p);

/** Palier enregistré après un échec : au palier 3, on redescend d'un cran. */
export const apresEchec = (f: Flashcard, p: Palier) => (p === 3 ? (estCourte(f) ? 1 : 2) : Math.max(0, p - 1));

export type NotionManche = {
  chapitreId: string;
  carte: Flashcard;
  palier: Palier;
  /** Palier 1 : quatre propositions, dont le verso. */
  choix?: string[];
  /** Palier 2 : le mot caché dans le verso. */
  trou?: string;
};

/** Les quatre propositions d'un QCM : le verso et trois versos voisins. */
function choixPour(carte: Flashcard, pool: Flashcard[]) {
  const autres = melanger(pool.filter((f) => f.id !== carte.id && f.verso !== carte.verso)).slice(0, 3);
  return melanger([carte.verso, ...autres.map((f) => f.verso)]);
}

/** Le mot caché au palier 2 : un des mots clés les plus longs du verso. */
function trouPour(carte: Flashcard) {
  const mots = motsCles(carte.verso).sort((a, b) => b.length - a.length).slice(0, 3);
  return mots[Math.floor(Math.random() * mots.length)];
}

export function preparerNotion(chapitreId: string, carte: Flashcard, pool: Flashcard[]): NotionManche {
  let palier = palierSuivant(carte);
  // Pas assez d'autres cartes pour un QCM : on passe au palier suivant.
  if (palier === 1 && pool.length < 4) palier = estCourte(carte) ? 3 : 2;
  return {
    chapitreId,
    carte,
    palier,
    choix: palier === 1 ? choixPour(carte, pool) : undefined,
    trou: palier === 2 ? trouPour(carte) : undefined,
  };
}

/**
 * Les notions d'une manche : d'abord celles déjà commencées (les plus avancées en
 * premier, pour les finir), puis des nouvelles, mélangées.
 */
/** Les cartes des chapitres, une seule fois chacune (une carte peut être dans deux chapitres). */
function sansDoublons(chapitres: Chapitre[]) {
  const vues = new Set<string>();
  return chapitres.flatMap((c) =>
    c.flashcards.flatMap((carte) => {
      const cle = `${carte.recto.trim().toLowerCase()}|${carte.verso.trim().toLowerCase()}`;
      if (vues.has(cle)) return [];
      vues.add(cle);
      return [{ chapitreId: c.id, carte }];
    }),
  );
}

export function composerManche(chapitres: Chapitre[], taille = TAILLE_MANCHE): NotionManche[] {
  const toutes = sansDoublons(chapitres);
  const pool = toutes.map((x) => x.carte);
  const enCours = melanger(toutes.filter((x) => (x.carte.apprendre ?? 0) > 0 && (x.carte.apprendre ?? 0) < MAITRISEE)).sort(
    (a, b) => (b.carte.apprendre ?? 0) - (a.carte.apprendre ?? 0),
  );
  const nouvelles = melanger(toutes.filter((x) => !x.carte.apprendre));
  return melanger([...enCours, ...nouvelles].slice(0, taille)).map((x) => preparerNotion(x.chapitreId, x.carte, pool));
}

/** Combien de notions à chaque palier. */
export function repartition(chapitres: Chapitre[]) {
  const r = { maitrisees: 0, aEcrire: 0, aCompleter: 0, nouvelles: 0, total: 0 };
  for (const { carte: f } of sansDoublons(chapitres)) {
      r.total++;
      const a = f.apprendre ?? 0;
      if (a >= MAITRISEE) r.maitrisees++;
      else if (a === 0) r.nouvelles++;
      else if (palierSuivant(f) === 3) r.aEcrire++;
      else r.aCompleter++;
    }
  return r;
}

/**
 * Compare une réponse écrite de tête au verso : chaque mot clé du verso est-il présent
 * (sans accents ni majuscules, en tolérant une faute de frappe) ?
 */
export function comparer(reponse: string, verso: string) {
  const dits = new Set(
    simplifier(reponse)
      .split(" ")
      .filter((m) => m.length >= 3),
  );
  const proche = (a: string, b: string) => {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1 || a.length < 5) return false;
    // Une seule lettre différente, ajoutée ou retirée.
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    return a.slice(i + 1) === b.slice(i + 1) || a.slice(i + 1) === b.slice(i) || a.slice(i) === b.slice(i + 1);
  };
  const cles = motsCles(verso);
  const presents = new Set(
    cles.filter((m) => {
      const s = simplifier(m);
      return [...dits].some((d) => proche(d, s) || (s.length >= 6 && (d.startsWith(s.slice(0, -1)) || s.startsWith(d.slice(0, -1)))));
    }),
  );
  return { cles, presents, manquants: cles.filter((m) => !presents.has(m)), part: cles.length ? presents.size / cles.length : 1 };
}
