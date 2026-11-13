/**
 * Bac de français (épreuve anticipée, onglet « Bac » de la matière Français) : les
 * textes de l'oral classés par genre (les quatre objets d'étude), chacun avec son texte
 * annoté, sa fiche et son entraînement « Je récite ».
 */

export type GenreBac = "poesie" | "theatre" | "roman" | "idees";

/** Une famille de remarques et sa couleur. Chaque genre a les siennes. */
export type CategorieBac = { id: string; nom: string; couleur: string };

/**
 * Le code couleur change selon le genre (demandé le 2026-11-13) : on ne regarde pas un
 * poème comme une scène de théâtre. Quatre familles par genre, quatre teintes distinctes.
 */
export const GENRES_BAC: Record<
  GenreBac,
  { nom: string; emoji: string; siecles: string; categories: CategorieBac[] }
> = {
  poesie: {
    nom: "La poésie",
    emoji: "🪶",
    siecles: "du XIXᵉ au XXIᵉ siècle",
    categories: [
      { id: "registre", nom: "Registre et ton", couleur: "#e3b62a" },
      { id: "figure", nom: "Figures de style", couleur: "#c9715a" },
      { id: "theme", nom: "Thème clé", couleur: "#6f8fc0" },
      { id: "vers", nom: "Vers et sonorités", couleur: "#4f9c85" },
    ],
  },
  theatre: {
    nom: "Le théâtre",
    emoji: "🎭",
    siecles: "du XVIIᵉ au XXIᵉ siècle",
    categories: [
      { id: "jeu", nom: "Jeu et didascalies", couleur: "#8a6fb0" },
      { id: "parole", nom: "Parole et échange", couleur: "#d08a3c" },
      { id: "registre", nom: "Comique ou tragique", couleur: "#c2504a" },
      { id: "figure", nom: "Figures de style", couleur: "#3f8f96" },
    ],
  },
  roman: {
    nom: "Le roman et le récit",
    emoji: "📖",
    siecles: "du Moyen Âge au XXIᵉ siècle",
    categories: [
      { id: "narration", nom: "Narration et point de vue", couleur: "#5b6fb5" },
      { id: "description", nom: "Description et portrait", couleur: "#7d9a4a" },
      { id: "temps", nom: "Temps et rythme", couleur: "#c99a2e" },
      { id: "figure", nom: "Figures de style", couleur: "#c0628a" },
    ],
  },
  idees: {
    nom: "La littérature d'idées",
    emoji: "💡",
    siecles: "du XVIᵉ au XVIIIᵉ siècle",
    categories: [
      { id: "these", nom: "Thèse et arguments", couleur: "#3f7fb5" },
      { id: "strategie", nom: "Persuader : les procédés", couleur: "#d0733c" },
      { id: "registre", nom: "Ton et registre", couleur: "#d9b02f" },
      { id: "figure", nom: "Figures de style", couleur: "#8f62b0" },
    ],
  },
};

/** Une remarque du prof sur un passage précis du texte. */
export type AnnotationBac = {
  /** Les mots du texte, exactement comme ils y sont écrits (surlignés). */
  extrait: string;
  /** Identifiant d'une catégorie du genre. */
  cat: string;
  /** Le procédé ou l'idée, en deux ou trois mots : « Hypallage ». */
  titre: string;
  /** L'interprétation, en une ou deux phrases. */
  texte: string;
  /** Formule courte à retenir, écrite à la main. */
  retenir?: string;
};

/** Une strophe, une réplique ou un paragraphe, avec ses remarques. */
export type PassageBac = {
  lignes: string[];
  annotations: AnnotationBac[];
  /** Passage du texte que le prof ne fait pas expliquer (affiché en italique, grisé). */
  nonEtudie?: boolean;
  /** Titre et sous-titre du texte : affichés centrés, sans numéro de strophe. */
  chapeau?: boolean;
};

export type MouvementBac = {
  titre: string;
  passages: PassageBac[];
  /** L'essentiel du mouvement pour la fiche (==surlignage== possible). */
  fiche: string[];
};

export type TexteBac = {
  id: string;
  genre: GenreBac;
  titre: string;
  auteur: string;
  date: string;
  /** « 9 quatrains d'alexandrins, rimes croisées ». */
  forme?: string;
  /** Texte du parcours associé (pas de l'œuvre intégrale). */
  parcours?: boolean;
  /** Nom d'une catégorie propre à ce texte : { theme: "Objets : la réification" }. */
  categories?: Record<string, string>;
  /** Conseil pour la lecture à voix haute (2 points). */
  lecture?: string;
  introduction: string[];
  problematique: string;
  mouvements: MouvementBac[];
  conclusion: string[];
  /** Question de grammaire travaillée en classe, si le prof en a donné une. */
  grammaire?: { question: string; reponse: string };
};

/** Une place du descriptif : un texte prêt, ou un texte attendu. */
export type PlaceBac = TexteBac | { titre: string; attente: string; parcours?: boolean };

export type ProgrammeGenre = {
  genre: GenreBac;
  oeuvre?: { titre: string; auteur: string; parcours: string; chapitrePublie?: string };
  places: PlaceBac[];
};

export const estTexte = (p: PlaceBac): p is TexteBac => "mouvements" in p;

/** Les catégories d'un texte : celles de son genre, renommées si le texte le demande. */
export const categoriesDe = (t: TexteBac): CategorieBac[] =>
  GENRES_BAC[t.genre].categories.map((c) => ({ ...c, nom: t.categories?.[c.id] ?? c.nom }));

/** Modalités de l'oral (session 2027, voie générale). */
export const ORAL_BAC = {
  periode: "du 21 juin au 9 juillet 2027",
  ecrit: "mardi 15 juin 2027",
  coefficient: 5,
  textes: 16,
  parties: [
    { nom: "Préparation", valeur: "30′" },
    { nom: "Lecture", valeur: "2 pts" },
    { nom: "Explication", valeur: "8 pts" },
    { nom: "Grammaire", valeur: "2 pts" },
    { nom: "Œuvre choisie", valeur: "8 pts" },
  ],
};
