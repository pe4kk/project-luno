import type { ChapitrePublie } from "@/lib/types";
import { HGGSP_THEME_4 } from "./hggsp-theme4";
import { FRANCAIS_RIMBAUD } from "./francais-rimbaud";
import { PHYSIQUE_MOUVEMENT } from "./physique-mouvement";

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
];
