/**
 * Couche IA du site.
 *
 * MODE DÉMO : aucune IA n'est encore branchée. Les fonctions ci-dessous
 * analysent le texte du cours avec des règles simples pour que l'interface
 * soit utilisable. Quand la clé d'API sera disponible, seul ce fichier
 * change : chaque fonction appellera une route serveur qui interroge le
 * modèle, avec les mêmes signatures.
 */
import type { Chapitre, Fiche, FicheSection, Qcm } from "./types";

export const MODE_IA: "demo" | "reel" = "demo";

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

const nettoyer = (s: string) => s.replace(/\s+/g, " ").trim();
const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function phrases(texte: string): string[] {
  return texte
    .split(/\n+|(?<=[.!?])\s+(?=[A-ZÀ-Ý])/)
    .map(nettoyer)
    .filter((p) => p.length > 0);
}

const estTitre = (ligne: string) =>
  /^(#{1,4}\s+|[IVX]{1,4}[.)]\s+|\d{1,2}[.)]\s+|[A-Z][.)]\s+)/.test(ligne) ||
  (ligne.length < 50 && !/[.:;,]$/.test(ligne) && !ligne.includes(" : "));

const sansPrefixe = (ligne: string) =>
  ligne.replace(/^(#{1,4}\s+|[IVX]{1,4}[.)]\s+|\d{1,2}[.)]\s+|[A-Z][.)]\s+)/, "");

/** Repère les définitions de la forme « Terme : définition ». */
function definitions(cours: string): { terme: string; definition: string }[] {
  const trouvees: { terme: string; definition: string }[] = [];
  for (const brute of cours.split(/\n+/)) {
    const ligne = nettoyer(brute.replace(/^[-•*]\s*/, ""));
    const m = ligne.match(/^([^:]{2,60}?)\s+:\s+(.{12,})$/);
    if (m && m[1].split(" ").length <= 6) {
      trouvees.push({ terme: majuscule(m[1]), definition: majuscule(m[2]) });
    }
  }
  return trouvees;
}

export async function genererFlashcards(cours: string): Promise<{ recto: string; verso: string }[]> {
  await pause(1100);
  return definitions(cours).map((d) => ({ recto: d.terme, verso: d.definition }));
}

/** taille : 1 (express) à 5 (complète). */
export async function genererFiche(cours: string, taille: number): Promise<Fiche> {
  await pause(1300);
  const parSection = [1, 2, 3, 5, 99][taille - 1] ?? 3;
  const sections: FicheSection[] = [];
  let courante: FicheSection = { titre: "L'essentiel", points: [] };
  for (const brute of cours.split(/\n+/)) {
    const ligne = nettoyer(brute);
    if (!ligne) continue;
    if (estTitre(ligne)) {
      if (courante.points.length) sections.push(courante);
      courante = { titre: sansPrefixe(ligne), points: [] };
    } else {
      courante.points.push(...phrases(ligne));
    }
  }
  if (courante.points.length) sections.push(courante);

  const defs = definitions(cours);
  return {
    taille,
    sections: sections.map((s) => ({ titre: s.titre, points: s.points.slice(0, parSection) })),
    aRetenir: defs.slice(0, Math.max(2, taille + 1)).map((d) => d.terme),
  };
}

function melanger<T>(liste: T[]): T[] {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** En mode démo, les QCM sont construits à partir des flashcards du chapitre. */
export async function genererQcm(chapitre: Chapitre, nombre: number): Promise<Qcm[]> {
  await pause(1000);
  const cartes = chapitre.flashcards;
  return melanger(cartes)
    .slice(0, nombre)
    .map((carte) => {
      const leurres = melanger(cartes.filter((c) => c.id !== carte.id))
        .slice(0, 3)
        .map((c) => c.recto);
      const choix = melanger([carte.recto, ...leurres]);
      return {
        question: carte.verso,
        choix,
        bonneReponse: choix.indexOf(carte.recto),
        explication: `${carte.recto} : ${carte.verso}`,
      };
    });
}

export type EtapeParcours = { titre: string; description: string };

export async function genererParcours(sujet: string): Promise<EtapeParcours[]> {
  await pause(900);
  return [
    { titre: "Découvrir", description: `Ce que recouvre « ${sujet} » et pourquoi c'est au programme.` },
    { titre: "Comprendre", description: "Les notions clés, expliquées pas à pas avec des exemples." },
    { titre: "S'entraîner", description: "Des questions guidées pour manipuler les notions." },
    { titre: "Vérifier", description: "Un mini-bilan pour repérer ce qui reste fragile." },
  ];
}

export async function repondreTuteur(sujet: string, etape: number): Promise<string> {
  await pause(900);
  const reponses = [
    `Réponse d'exemple. Quand l'IA sera branchée, le tuteur commencera ici par te demander ce que tu sais déjà sur « ${sujet} », puis adaptera ses explications à ton niveau.`,
    "Réponse d'exemple. Le tuteur expliquera la notion suivante avec un exemple concret, puis te posera une question pour vérifier que tu as compris avant d'avancer.",
    "Réponse d'exemple. Le tuteur corrigera ta réponse, t'expliquera l'erreur éventuelle et te proposera un exercice un peu plus difficile.",
  ];
  return reponses[etape % reponses.length];
}
