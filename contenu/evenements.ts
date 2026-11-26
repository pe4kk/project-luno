import type { EvenementPublie } from "@/lib/types";

/**
 * Dates que Claude ajoute lui-même au calendrier, à partir de ce que l'utilisateur
 * transmet (mail d'un prof, consigne…). Elles apparaissent chez tous les utilisateurs
 * du site à leur prochaine visite, rattachées aux chapitres indiqués. Pour corriger une
 * date déjà publiée, modifier l'entrée et augmenter `version`.
 */
const physique = { nom: "Physique-Chimie", couleur: "#6f8fae", emoji: "⚗️" };
const francais = { nom: "Français", couleur: "#d98a8a", emoji: "📚" };
const histoire = { nom: "Histoire-Géo", couleur: "#c98b6b", emoji: "🌍" };

export const EVENEMENTS: EvenementPublie[] = [
  {
    id: "pc-interro-2026-11-16",
    version: 2,
    matiere: physique,
    titre: "Interrogation de cours : chap. 9, chap. 13 et fiches méthode",
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
    version: 2,
    matiere: physique,
    titre: "DM à rendre : ex. 1 (cas 2 et 3) et ex. 4",
    date: "2026-11-16",
    dureeMin: 0,
    notes: "Fiche d'exercices du chap. 13, à rédiger sur feuille.",
    chapitres: ["pc-1re-chap11-exercices", "pc-1re-methode-redaction"],
  },
  {
    id: "fr-pot-bouille-2026-11-25",
    version: 1,
    matiere: francais,
    titre: "Évaluation de lecture : Pot-Bouille (QCM)",
    date: "2026-11-25",
    dureeMin: 0,
    notes:
      "Le prof vérifie qu'on a lu le livre : surtout l'immeuble, qui habite à quel étage, les liens entre les personnages. Révise avec « Explorer l'œuvre » dans l'onglet Bac de Français.",
    chapitres: ["francais-1re-pot-bouille"],
  },
  {
    id: "pc-dst-newton-2026-12-04",
    version: 1,
    matiere: physique,
    titre: "DST : mouvement et 2e loi de Newton (chap. 9 et 13)",
    date: "2026-12-04",
    dureeMin: 0,
    notes: "Annoncé en classe. Revoir aussi la méthode de rédaction (lois de Newton).",
    chapitres: ["pc-1re-chap9-mouvement", "pc-1re-chap11-newton", "pc-1re-forces", "pc-1re-methode-redaction"],
  },
  {
    id: "pc-eval-avancement-2026-12-04",
    version: 2,
    matiere: physique,
    titre: "Éval : le tableau d'avancement (chap. 3)",
    date: "2026-12-04",
    dureeMin: 0,
    notes: "Chap. 3 : dresser un tableau d'avancement, trouver le réactif limitant et x_max, faire un bilan de matière, totale ou limitée, mélange stœchiométrique.",
    notesPrecedentes: ["Chapitre pas encore envoyé à Claude : il sera rattaché ici dès qu'il sera dans Luno."],
    chapitres: ["pc-1re-chap3-avancement"],
  },
  {
    id: "fr-dissertation-rimbaud-2026-12-10",
    version: 1,
    matiere: francais,
    titre: "Dissertation : Rimbaud, Cahiers de Douai",
    date: "2026-12-10",
    dureeMin: 0,
    notes:
      "Parcours « Émancipations créatrices ». Révise avec « Préparer la dissertation » dans l'onglet Bac de Français.",
    chapitres: ["francais-1re-rimbaud-douai"],
  },
  {
    id: "hg-dst-revolution-2026-12-03",
    version: 1,
    matiere: histoire,
    titre: "DST : question problématisée sur la Révolution et l'Empire",
    date: "2026-12-03",
    dureeMin: 90,
    notes:
      "Introduction rédigée et plan détaillé rédigé (partie, sous-partie, argument + exemple daté + idée, transitions). Jusqu'au Code civil, sans les conquêtes ni l'Europe. Entraîne-toi dans S'exercer → Problèmes.",
    chapitres: ["hg-1re-revolution-empire"],
    calendrier: true,
  },
];
