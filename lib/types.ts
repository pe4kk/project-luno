export type Matiere = {
  id: string;
  nom: string;
  couleur: string;
  emoji: string;
};

/** 0 = nouvelle, 1 = à revoir, 2 = sue la dernière fois */
export type NiveauCarte = 0 | 1 | 2;

export type Flashcard = {
  id: string;
  recto: string;
  verso: string;
  niveau: NiveauCarte;
  /** Nombre de jours avant la prochaine révision (répétition espacée). */
  intervalle: number;
  /** AAAA-MM-JJ : la carte est à revoir dès que cette date est atteinte. */
  echeance: string;
};

/** Un point de fiche. `n` est la plus petite taille (1 à 5) à laquelle il apparaît. */
export type PointFiche = { t: string; n: number };

export type Fiche = {
  sections: { titre: string; points: PointFiche[] }[];
  aRetenir: string[];
};

export type Qcm = {
  type?: "qcm";
  /** Petite consigne affichée au-dessus de la question. */
  consigne?: string;
  question: string;
  choix: string[];
  bonneReponse: number;
  explication: string;
  /** Flashcard d'origine, pour la remettre « à revoir » en cas d'erreur. */
  carteId?: string;
};

export type VraiFaux = {
  type: "vraiFaux";
  affirmation: string;
  vrai: boolean;
  explication: string;
  carteId?: string;
};

/** Texte à trous : `texte` contient « ___ » à l'endroit du mot à trouver. */
export type Trou = {
  type: "trou";
  texte: string;
  /** Réponses acceptées (casse, accents et petites fautes de frappe sont tolérés). */
  reponses: string[];
  explication: string;
};

/** Éléments à remettre dans l'ordre : `elements` est donné dans le bon ordre. */
export type Ordre = {
  type: "ordre";
  consigne: string;
  elements: string[];
  explication: string;
};

/** Question ouverte : l'élève répond de tête, lit le corrigé et s'évalue. */
export type Ouverte = {
  type: "ouverte";
  question: string;
  corrige: string;
};

export type Exercice = Qcm | VraiFaux | Trou | Ordre | Ouverte;

/** Document joint à un chapitre (PDF du professeur), publié dans `public/documents/`. */
export type Document = {
  titre: string;
  /** Chemin depuis `public/`, sans barre au début : `documents/…/fichier.pdf`. */
  fichier: string;
  /** Ex. « Cours du prof, 4 pages ». */
  detail?: string;
};

export type Chapitre = {
  id: string;
  matiereId: string;
  titre: string;
  cours: string;
  flashcards: Flashcard[];
  fiche: Fiche | null;
  tailleFiche: number;
  /** Exercices rédigés (sinon, ils sont tirés des flashcards). */
  exercices: Exercice[];
  /** Documents joints (PDF), repris des chapitres publiés. */
  documents: Document[];
  /** Identifiant du chapitre publié dans `contenu/bibliotheque.ts`, s'il en vient. */
  publieId?: string;
};

export type Dst = {
  id: string;
  matiereId: string;
  titre: string;
  /** AAAA-MM-JJ */
  date: string;
  /** HH:MM, ou vide si l'heure n'est pas connue. */
  heure: string;
  /** 0 si la durée n'est pas connue. */
  dureeMin: number;
  salle: string;
  notes: string;
  /** Chapitres à réviser pour ce devoir. */
  chapitreIds: string[];
};

/** Chapitre rédigé par Claude et publié dans le dépôt pour tous les utilisateurs. */
export type ChapitrePublie = {
  id: string;
  /** À augmenter quand le contenu change, pour que les navigateurs le reprennent. */
  version: number;
  matiere: { nom: string; couleur: string; emoji: string };
  titre: string;
  cours?: string;
  documents?: Document[];
  flashcards: { recto: string; verso: string }[];
  fiche: Fiche | null;
  exercices: Exercice[];
};

export type Lecon = {
  id: string;
  titre: string;
  matiere: string;
  niveau: string;
  duree: string;
  intro: string;
  etapes: {
    titre: string;
    texte: string[];
    exemple?: string;
    question?: { q: string; r: string };
  }[];
};

/** Une chose à faire (onglet « À faire »). */
export type Tache = {
  id: string;
  texte: string;
  fait: boolean;
  /** AAAA-MM-JJ, ou vide. */
  echeance: string;
};

export type Donnees = { matieres: Matiere[]; chapitres: Chapitre[]; dsts: Dst[]; taches: Tache[] };
