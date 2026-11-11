import type { EvenementPublie } from "@/lib/types";

/**
 * Dates que Claude ajoute lui-même au calendrier, à partir de ce que l'utilisateur
 * transmet (mail d'un prof, consigne…). Elles apparaissent chez tous les utilisateurs
 * du site à leur prochaine visite, rattachées aux chapitres indiqués. Pour corriger une
 * date déjà publiée, modifier l'entrée et augmenter `version`.
 */
const physique = { nom: "Physique-Chimie", couleur: "#6f8fae", emoji: "⚗️" };

export const EVENEMENTS: EvenementPublie[] = [
  {
    id: "pc-interro-2026-11-16",
    version: 1,
    matiere: physique,
    titre: "Interrogation de cours : chap. 9, chap. 11 et fiches méthode",
    date: "2026-11-16",
    dureeMin: 60,
    notes:
      "Annoncée dans le mail du prof : dès la première séance du retour en classe.",
    chapitres: [
      "pc-1re-chap9-mouvement",
      "pc-1re-chap11-newton",
      "pc-1re-forces",
      "pc-1re-methode-redaction",
    ],
  },
  {
    id: "pc-dm-2026-11-16",
    version: 1,
    matiere: physique,
    titre: "DM à rendre : ex. 1 (cas 2 et 3) et ex. 4",
    date: "2026-11-16",
    dureeMin: 0,
    notes: "Fiche d'exercices du chap. 11, à rédiger sur feuille.",
    chapitres: ["pc-1re-chap11-exercices", "pc-1re-methode-redaction"],
  },
];
