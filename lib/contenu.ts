/**
 * Contenus du site. Aucune IA n'est appelée depuis le site : les flashcards,
 * fiches, exercices et leçons sont rédigés par Claude dans une conversation,
 * puis publiés dans le dossier `contenu/`. Ce fichier ne contient que des
 * outils déterministes.
 */
import type { Chapitre, Qcm } from "./types";

export const DEPOT = "pe4kk/project-luno";

const nettoyer = (s: string) => s.replace(/\s+/g, " ").trim();
const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Repère les lignes « Terme : définition » (ou avec « = » ou un tiret long). */
export function repererDefinitions(cours: string): { recto: string; verso: string }[] {
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
  return Math.min(10, c.exercices.length > 0 ? c.exercices.length : c.flashcards.length);
}

/** Exercices rédigés s'il y en a, sinon QCM fabriqués à partir des flashcards. */
export function preparerQcm(chapitre: Chapitre, nombre: number): Qcm[] {
  if (chapitre.exercices.length > 0) {
    return melanger(chapitre.exercices)
      .slice(0, nombre)
      .map((q) => {
        const bonne = q.choix[q.bonneReponse];
        const choix = melanger(q.choix);
        return { ...q, choix, bonneReponse: choix.indexOf(bonne) };
      });
  }
  const cartes = chapitre.flashcards;
  return melanger(cartes)
    .slice(0, nombre)
    .map((carte) => {
      const leurres = melanger(cartes.filter((c) => c.id !== carte.id))
        .slice(0, 3)
        .map((c) => c.recto);
      const choix = melanger([carte.recto, ...leurres]);
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

/** Message à transmettre à Claude pour un cours. */
export function demandeCours(matiere: string, chapitre: string, cours: string): string {
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
export function demandeLecon(sujet: string, niveau: string, precision: string): string {
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
export function lienGithub(titre: string, corps: string): { url: string; tronque: boolean } {
  const base = `https://github.com/${DEPOT}/issues/new?title=${encodeURIComponent(titre)}&body=`;
  const complet = base + encodeURIComponent(corps);
  if (complet.length <= 6000) return { url: complet, tronque: false };
  const debut = corps.split("--- COURS ---")[0] + "--- COURS ---\n(Colle ton cours ici : il est déjà copié.)";
  return { url: base + encodeURIComponent(debut), tronque: true };
}
