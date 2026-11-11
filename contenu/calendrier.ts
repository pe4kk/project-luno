/**
 * Calendrier des DST de Première 2026-2027, relevé sur le document du lycée
 * envoyé par l'utilisateur le 2026-11-10 (photo). Les heures ne figurent pas
 * sur le document. Chaque utilisateur choisit ses matières avant l'import.
 */
export type MatiereCalendrier = {
  nom: string;
  couleur: string;
  emoji: string;
  groupe: "Tronc commun" | "Spécialités et options" | "Autres";
  /** Cochée par défaut. */
  parDefaut: boolean;
};

export type EvenementCalendrier = {
  /** AAAA-MM-JJ */
  date: string;
  matiere: string;
  /** 0 quand la durée n'est pas indiquée. */
  dureeMin: number;
  titre?: string;
};

export const CALENDRIER_TITRE = "DST de Première 2026-2027";

export const CALENDRIER_MATIERES: MatiereCalendrier[] = [
  {
    nom: "Français",
    couleur: "#d98a8a",
    emoji: "📚",
    groupe: "Tronc commun",
    parDefaut: true,
  },
  {
    nom: "Histoire-Géo",
    couleur: "#c98b6b",
    emoji: "🌍",
    groupe: "Tronc commun",
    parDefaut: true,
  },
  {
    nom: "Enseignement scientifique",
    couleur: "#7d9a84",
    emoji: "🔬",
    groupe: "Tronc commun",
    parDefaut: true,
  },
  {
    nom: "LVA",
    couleur: "#c9a24a",
    emoji: "🗣️",
    groupe: "Tronc commun",
    parDefaut: true,
  },
  {
    nom: "LVB",
    couleur: "#6f8fae",
    emoji: "💬",
    groupe: "Tronc commun",
    parDefaut: true,
  },
  {
    nom: "Maths spécifiques",
    couleur: "#55555c",
    emoji: "➗",
    groupe: "Tronc commun",
    parDefaut: false,
  },
  {
    nom: "Mathématiques",
    couleur: "#b5573d",
    emoji: "📐",
    groupe: "Spécialités et options",
    parDefaut: false,
  },
  {
    nom: "HGGSP",
    couleur: "#8a5a78",
    emoji: "🏛️",
    groupe: "Spécialités et options",
    parDefaut: false,
  },
  {
    nom: "HLP",
    couleur: "#c98b6b",
    emoji: "🎭",
    groupe: "Spécialités et options",
    parDefaut: false,
  },
  {
    nom: "SES",
    couleur: "#c9a24a",
    emoji: "💶",
    groupe: "Spécialités et options",
    parDefaut: false,
  },
  {
    nom: "SVT",
    couleur: "#7d9a84",
    emoji: "🧬",
    groupe: "Spécialités et options",
    parDefaut: false,
  },
  {
    nom: "Physique-Chimie",
    couleur: "#6f8fae",
    emoji: "⚗️",
    groupe: "Spécialités et options",
    parDefaut: false,
  },
  {
    nom: "NSI",
    couleur: "#55555c",
    emoji: "💻",
    groupe: "Spécialités et options",
    parDefaut: false,
  },
  {
    nom: "LLCE",
    couleur: "#d98a8a",
    emoji: "📖",
    groupe: "Spécialités et options",
    parDefaut: false,
  },
  {
    nom: "LVC",
    couleur: "#8a5a78",
    emoji: "🌐",
    groupe: "Spécialités et options",
    parDefaut: false,
  },
  {
    nom: "Bac blanc",
    couleur: "#b5573d",
    emoji: "🎓",
    groupe: "Autres",
    parDefaut: true,
  },
  {
    nom: "Rattrapage",
    couleur: "#55555c",
    emoji: "🔁",
    groupe: "Autres",
    parDefaut: false,
  },
];

const e = (
  date: string,
  matiere: string,
  dureeMin: number,
  titre?: string,
): EvenementCalendrier => ({
  date,
  matiere,
  dureeMin,
  titre,
});

export const CALENDRIER_EVENEMENTS: EvenementCalendrier[] = [
  // 1er trimestre
  e("2026-09-24", "Mathématiques", 60),
  e("2026-10-01", "LVA", 60),
  e("2026-10-01", "HLP", 120),
  e("2026-10-01", "SVT", 90),
  e("2026-10-08", "Histoire-Géo", 90),
  e("2026-10-08", "LLCE", 90),
  e("2026-10-08", "NSI", 90),
  e("2026-10-15", "Français", 240),
  e("2026-11-05", "Enseignement scientifique", 90),
  e("2026-11-05", "Physique-Chimie", 90),
  e("2026-11-12", "Mathématiques", 60),
  e("2026-11-12", "Maths spécifiques", 60),
  e("2026-11-12", "SES", 120),
  e("2026-11-14", "Rattrapage", 0, "DST de rattrapage"),
  e("2026-11-19", "HGGSP", 120),
  e("2026-11-26", "LVB", 60),
  e("2026-11-26", "LVC", 60),
  // 2e trimestre
  e("2026-12-03", "Histoire-Géo", 90),
  e("2026-12-03", "Mathématiques", 120),
  e("2026-12-10", "Français", 240),
  e("2026-12-17", "LLCE", 120),
  e("2026-12-17", "NSI", 90),
  e("2027-01-07", "Enseignement scientifique", 90),
  e("2027-01-07", "SVT", 90),
  e("2027-01-14", "Maths spécifiques", 60),
  e("2027-01-14", "HGGSP", 120),
  e("2027-01-21", "LVA", 60),
  e("2027-01-21", "HLP", 120),
  e("2027-01-21", "Physique-Chimie", 120),
  e("2027-01-28", "LVB", 60),
  e("2027-01-28", "SES", 120),
  e("2027-02-04", "Français", 240, "Bac blanc écrit"),
  e("2027-02-24", "Français", 0, "Oraux blancs"),
  e("2027-02-27", "Français", 0, "Oraux blancs"),
  e("2027-02-27", "Rattrapage", 0, "DST de rattrapage"),
  e("2027-03-03", "Français", 0, "Oraux blancs"),
  // 3e trimestre
  e("2027-03-11", "HGGSP", 120),
  e("2027-03-18", "Enseignement scientifique", 90),
  e("2027-03-25", "Histoire-Géo", 90),
  e("2027-03-25", "LVC", 60),
  e("2027-04-01", "Maths spécifiques", 120),
  e("2027-04-19", "Bac blanc", 0, "Spécialités et français, du 19 au 23 avril"),
  e("2027-04-29", "LVA", 60),
  e("2027-04-29", "LVB", 60),
  e("2027-05-12", "Rattrapage", 0, "DST de rattrapage"),
  e("2027-05-18", "Français", 0, "Oraux blancs (à confirmer)"),
  e("2027-05-19", "Français", 0, "Oraux blancs (à confirmer)"),
];
