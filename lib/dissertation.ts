/**
 * Préparation de la dissertation sur une œuvre du bac de français (onglet Bac › « Préparer la
 * dissertation ») : sujets avec plan détaillé, banque de citations, méthode, entraînement.
 * Données dans `contenu/dissertations.ts`, écran dans `components/travail/Dissertation.tsx`.
 */

/** Un argument : une idée, prouvée par une citation analysée (principe 13). */
export type ArgumentDiss = {
  idee: string;
  poeme: string;
  citation: string;
  /** Procédé, puis ce qu'il montre et le lien avec le sujet. */
  analyse: string;
};

export type PartieDiss = {
  titre: string;
  /** L'idée directrice de la partie, en une phrase. */
  idee: string;
  arguments: ArgumentDiss[];
};

export type SujetDiss = {
  id: string;
  sujet: string;
  /** Ce que le sujet demande (« Dans quelle mesure » → plan nuancé…). */
  type: string;
  motsCles: { mot: string; sens: string }[];
  problematique: string;
  plan: PartieDiss[];
  /** Une transition entre chaque partie. */
  transitions: string[];
  conclusion: string;
  ouverture: string;
  pieges: string[];
};

export type CitationDiss = {
  citation: string;
  poeme: string;
  procede: string;
  /** Ce que la citation permet de prouver dans une dissertation. */
  prouve: string;
  axe: string;
};

export type EtapeMethode = { titre: string; temps?: string; conseils: string[]; exemple?: string };

export type Dissertation = {
  id: string;
  oeuvre: string;
  auteur: string;
  parcours: string;
  /** Ce que le parcours veut dire et comment l'utiliser. */
  parcoursSens: string[];
  axes: { id: string; titre: string; resume: string }[];
  sujets: SujetDiss[];
  citations: CitationDiss[];
  methode: EtapeMethode[];
  /** Grille pour juger son propre plan. */
  criteres: string[];
};
