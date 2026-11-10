export type Matiere = {
  id: string;
  nom: string;
  couleur: string;
  emoji: string;
};

/** 0 = nouvelle, 1 = à revoir, 2 = acquise */
export type NiveauCarte = 0 | 1 | 2;

export type Flashcard = {
  id: string;
  recto: string;
  verso: string;
  niveau: NiveauCarte;
};

export type FicheSection = { titre: string; points: string[] };

export type Fiche = {
  taille: number;
  sections: FicheSection[];
  aRetenir: string[];
};

export type Chapitre = {
  id: string;
  matiereId: string;
  titre: string;
  cours: string;
  flashcards: Flashcard[];
  fiche: Fiche | null;
};

export type Dst = {
  id: string;
  matiereId: string;
  titre: string;
  /** AAAA-MM-JJ */
  date: string;
  /** HH:MM */
  heure: string;
  dureeMin: number;
  salle: string;
  notes: string;
};

export type Qcm = {
  question: string;
  choix: string[];
  bonneReponse: number;
  explication: string;
};
