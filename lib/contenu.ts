/**
 * Contenus du site. Aucune IA n'est appelée depuis le site : les flashcards,
 * fiches, exercices et leçons sont rédigés par Claude dans une conversation,
 * puis publiés dans le dossier `contenu/`. Ce fichier ne contient que des
 * outils déterministes.
 */
import type { Chapitre, Exercice } from "./types";

export const DEPOT = "pe4kk/project-luno";

const nettoyer = (s: string) => s.replace(/\s+/g, " ").trim();
const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Repère les lignes « Terme : définition » (ou avec « = » ou un tiret long). */
export function repererDefinitions(
  cours: string,
): { recto: string; verso: string }[] {
  const trouvees: { recto: string; verso: string }[] = [];
  for (const brute of cours.split(/\n+/)) {
    const ligne = nettoyer(brute.replace(/^[-•*]\s*/, ""));
    const m = ligne.match(/^([^:=–—]{2,60}?)\s+[:=–—]\s+(.{12,})$/);
    if (m && m[1].split(" ").length <= 6) {
      trouvees.push({ recto: majuscule(m[1]), verso: majuscule(m[2]) });
    }
  }
  return trouvees;
}

function melanger<T>(liste: T[]): T[] {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Nombre de flashcards nécessaires pour fabriquer des QCM à quatre choix. */
export const MIN_CARTES_QCM = 4;

export function peutSExercer(c: Chapitre): boolean {
  return c.exercices.length > 0 || c.flashcards.length >= MIN_CARTES_QCM;
}

export function maxQuestions(c: Chapitre): number {
  return Math.min(
    12,
    c.exercices.length > 0 ? c.exercices.length : c.flashcards.length,
  );
}

/** Exercices rédigés s'il y en a, sinon exercices fabriqués à partir des flashcards. */
export function preparerExercices(
  chapitre: Chapitre,
  nombre: number,
): Exercice[] {
  if (chapitre.exercices.length > 0) {
    // On pioche tour à tour dans chaque type d'exercice, pour qu'une série soit toujours variée.
    const parType = new Map<string, Exercice[]>();
    for (const q of melanger(chapitre.exercices)) {
      const t = q.type ?? "qcm";
      parType.set(t, [...(parType.get(t) ?? []), q]);
    }
    const piles = melanger([...parType.values()]);
    const choisis: Exercice[] = [];
    while (choisis.length < nombre && piles.some((pile) => pile.length > 0)) {
      for (const pile of piles) {
        const q = pile.shift();
        if (q && choisis.length < nombre) choisis.push(q);
      }
    }
    return melanger(choisis).map((q) => {
      if (q.type && q.type !== "qcm") return q;
      const bonne = q.choix[q.bonneReponse];
      const choix = melanger(q.choix);
      return { ...q, choix, bonneReponse: choix.indexOf(bonne) };
    });
  }
  const cartes = chapitre.flashcards;
  return melanger(cartes)
    .slice(0, nombre)
    .map((carte, i): Exercice => {
      const autres = melanger(cartes.filter((c) => c.id !== carte.id));
      // Un exercice sur trois est un vrai ou faux, pour varier.
      if (i % 3 === 2) {
        const vrai = Math.random() < 0.5;
        return {
          type: "vraiFaux",
          affirmation: `${carte.recto} : ${vrai ? carte.verso : autres[0].verso}`,
          vrai,
          explication: `${carte.recto} : ${carte.verso}`,
          carteId: carte.id,
        };
      }
      const choix = melanger([
        carte.recto,
        ...autres.slice(0, 3).map((c) => c.recto),
      ]);
      return {
        consigne: "À quoi correspond cette définition ?",
        question: carte.verso,
        choix,
        bonneReponse: choix.indexOf(carte.recto),
        explication: `${carte.recto} : ${carte.verso}`,
        carteId: carte.id,
      };
    });
}

/** Mélange une liste en garantissant un ordre différent de l'ordre d'origine. */
export function melangerAutrement<T>(liste: T[]): T[] {
  if (liste.length < 2) return [...liste];
  for (let essai = 0; essai < 20; essai++) {
    const m = melanger(liste);
    if (m.some((x, i) => x !== liste[i])) return m;
  }
  return [...liste].reverse();
}

/** Texte simplifié pour comparer ou chercher : sans casse, accents ni ponctuation. */
export function simplifier(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array(b.length).fill(0),
  ]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return d[a.length][b.length];
}

/** Réponse d'un texte à trous : une faute de frappe est tolérée sur les mots de cinq lettres et plus. */
export function reponseJuste(saisie: string, attendues: string[]): boolean {
  const s = simplifier(saisie).replace(/ /g, "");
  if (!s) return false;
  return attendues.some((r) => {
    const a = simplifier(r).replace(/ /g, "");
    return a === s || (a.length >= 5 && distance(a, s) <= 1);
  });
}

/** Message à transmettre à Claude pour un cours. */
export function demandeCours(
  matiere: string,
  chapitre: string,
  cours: string,
): string {
  return [
    "[Luno] Nouveau cours",
    `Matière : ${matiere}`,
    `Chapitre : ${chapitre}`,
    "Niveau : lycée",
    "Demande : flashcards, fiche de révision et exercices corrigés pour ce chapitre.",
    "",
    "--- COURS ---",
    cours.trim(),
  ].join("\n");
}

/** Message à transmettre à Claude pour une leçon de l'onglet Apprendre. */
export function demandeLecon(
  sujet: string,
  niveau: string,
  precision: string,
): string {
  return [
    "[Luno] Nouvelle leçon",
    `Sujet : ${sujet}`,
    `Niveau : ${niveau}`,
    precision.trim() ? `Précision : ${precision.trim()}` : "",
    "Demande : une leçon pas à pas pour l'onglet Apprendre.",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Lien qui ouvre un ticket GitHub prérempli. Les longs textes sont à coller à la main. */
export function lienGithub(
  titre: string,
  corps: string,
): { url: string; tronque: boolean } {
  const base = `https://github.com/${DEPOT}/issues/new?title=${encodeURIComponent(titre)}&body=`;
  const complet = base + encodeURIComponent(corps);
  if (complet.length <= 6000) return { url: complet, tronque: false };
  const debut =
    corps.split("--- COURS ---")[0] +
    "--- COURS ---\n(Colle ton cours ici : il est déjà copié.)";
  return { url: base + encodeURIComponent(debut), tronque: true };
}

/** Onglet « À faire » : une tâche par ligne ; puces, numéros et cases en début de ligne sont retirés. */
export function lireListe(texte: string): string[] {
  return texte
    .split(/\n+/)
    .map((l) =>
      l
        .replace(/^\s*(?:[-*•–—·▪◦]|\d+[.)])\s*/, "")
        .replace(/^\s*\[[ xX]?\]\s*/, "")
        .trim(),
    )
    .filter(Boolean);
}
