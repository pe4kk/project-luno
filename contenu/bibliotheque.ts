import type { ChapitrePublie } from "@/lib/types";
import { HGGSP_THEME_4 } from "./hggsp-theme4";
import { FRANCAIS_RIMBAUD } from "./francais-rimbaud";
import { PHYSIQUE_MOUVEMENT } from "./physique-mouvement";
import { PHYSIQUE_METHODE } from "./physique-methode";
import { MATHS_DERIVATION } from "./maths-derivation";
import { PHYSIQUE_OXYDOREDUCTION } from "./physique-oxydoreduction";
import { FRANCAIS_POT_BOUILLE } from "./francais-pot-bouille";
import { HISTOIRE_REVOLUTION_EMPIRE } from "./histoire-revolution-empire";
import { PHYSIQUE_AVANCEMENT } from "./physique-avancement";

/**
 * Chapitres rédigés par Claude à partir des cours envoyés par l'utilisateur.
 *
 * Tout ce qui est ajouté ici arrive automatiquement chez tous les utilisateurs
 * à leur prochaine visite : la matière est créée si elle n'existe pas (on
 * compare les noms), puis le chapitre reçoit ses flashcards, sa fiche et ses
 * exercices. Pour corriger un chapitre déjà publié, modifier son contenu et
 * augmenter `version`. Format : voir `hggsp-theme4.ts`.
 */
export const BIBLIOTHEQUE: ChapitrePublie[] = [
  ...HGGSP_THEME_4,
  FRANCAIS_RIMBAUD,
  ...PHYSIQUE_MOUVEMENT,
  PHYSIQUE_METHODE,
  MATHS_DERIVATION,
  PHYSIQUE_OXYDOREDUCTION,
  FRANCAIS_POT_BOUILLE,
  HISTOIRE_REVOLUTION_EMPIRE,
  PHYSIQUE_AVANCEMENT,
];

/**
 * Chapitres publiés puis retirés : ils sont effacés des navigateurs qui les avaient
 * repris. Les méthodes d'HGGSP sont devenues des leçons d'Apprendre (2026-11-12).
 */
export const PUBLIES_RETIRES = [
  "hggsp-1re-methode-etude-critique",
  "hggsp-1re-methode-dissertation",
  "hg-1re-convention-terreur",
];

/**
 * Chapitres publiés fondus dans un autre (2026-11-26 : la Terreur rentre dans le H1 d'histoire).
 * Avant d'effacer l'ancien, la progression de ses cartes passe aux cartes de même recto du
 * nouveau, et les DST qui le citaient pointent vers le nouveau.
 */
export const PUBLIES_FUSIONNES: Record<string, string> = {
  "hg-1re-convention-terreur": "hg-1re-revolution-empire",
};
