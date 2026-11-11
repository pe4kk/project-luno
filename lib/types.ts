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
  /** Schéma affiché avec la réponse. */
  schema?: Schema;
};

/** Coordonnées dans un schéma : x vers la droite, y vers le bas. */
export type PointSchema = [number, number];

/** Couleur d'un élément de schéma, adaptée aux deux thèmes. */
export type TonSchema = "encre" | "accent" | "cuivre" | "doux" | "ok";

/**
 * Élément d'un schéma (voir `components/Schema.tsx`). Les noms (`nom`, `t`) suivent la
 * notation des contenus : « v⃗₂ » dessine une flèche au-dessus de v, « v_f » un indice.
 */
export type ElementSchema =
  /** Vecteur : flèche de `de` à `a`, avec son nom placé en `pos` (sinon à côté du milieu). */
  | { f: "fleche"; de: PointSchema; a: PointSchema; ton?: TonSchema; nom?: string; pos?: PointSchema; pointille?: boolean }
  /** Position : petit rond, ou croix comme sur une chronophotographie. */
  | { f: "point"; en: PointSchema; nom?: string; pos?: PointSchema; ton?: TonSchema; forme?: "rond" | "croix" }
  /** Ligne brisée, ou courbe lissée passant par les points (trajectoire). */
  | { f: "trait"; points: PointSchema[]; ton?: TonSchema; courbe?: boolean; pointille?: boolean; ferme?: boolean; plein?: boolean; fin?: boolean }
  | { f: "cercle"; centre: PointSchema; r: number; ton?: TonSchema; plein?: boolean; pointille?: boolean }
  | { f: "rect"; de: PointSchema; a: PointSchema; ton?: TonSchema; plein?: boolean; arrondi?: number }
  /** Texte ; `main` l'écrit à la main (Caveat), comme les annotations du prof. */
  | { f: "texte"; en: PointSchema; t: string; ton?: TonSchema; taille?: number; ancre?: "start" | "middle" | "end"; main?: boolean }
  /** Repère : axes de longueurs `x` et `y` depuis l'origine (vers la droite et vers le haut). */
  | { f: "axes"; origine: PointSchema; x: number; y: number; noms?: [string, string]; o?: string }
  /** Sol ou support hachuré. */
  | { f: "sol"; de: PointSchema; a: PointSchema }
  | { f: "ressort"; de: PointSchema; a: PointSchema; spires?: number; ton?: TonSchema };

/** Schéma explicatif dessiné en SVG ; `l` × `h` est la taille de la zone de dessin. */
export type Schema = { l: number; h: number; elements: ElementSchema[]; legende?: string };

/**
 * Un point de fiche. `n` est la plus petite taille (1 à 5) à laquelle il apparaît.
 * Un `schema` s'affiche sous le texte du point.
 */
export type PointFiche = { t: string; n: number; schema?: Schema };

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
  flashcards: { recto: string; verso: string; schema?: Schema }[];
  fiche: Fiche | null;
  exercices: Exercice[];
};

/** Date publiée par Claude dans le calendrier de l'utilisateur (`contenu/evenements.ts`). */
export type EvenementPublie = {
  /** Identifiant stable : le DST créé s'appelle `pub-<id>`. */
  id: string;
  /** À augmenter pour corriger un événement déjà publié. */
  version: number;
  matiere: { nom: string; couleur: string; emoji: string };
  titre: string;
  /** AAAA-MM-JJ */
  date: string;
  heure?: string;
  /** 0 si la durée n'est pas connue. */
  dureeMin: number;
  notes?: string;
  /** Identifiants `id` des chapitres publiés à réviser. */
  chapitres?: string[];
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
    schema?: Schema;
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

/**
 * Une erreur relevée dans une ancienne évaluation (ou un conseil du prof), avec sa
 * correction : la fiche « Mes erreurs » d'une matière, à relire avant chaque évaluation.
 */
export type ErreurNotee = {
  id: string;
  matiereId: string;
  /** Ex. « Oublier l'ensemble de dérivabilité ». */
  titre: string;
  /** Ce qui a été fait de travers (peut contenir la notation des formules). */
  erreur: string;
  /** Comment faire juste. */
  correction: string;
  /** Astuce pour ne plus la refaire, facultative. */
  conseil?: string;
  /** D'où elle vient : « DST du 24/09 », « conseil du prof »… */
  source?: string;
  /** Chapitre concerné, en texte libre. */
  chapitre?: string;
  /** AAAA-MM-JJ, date d'ajout. */
  date: string;
  /** Combien de fois elle a été refaite (affichée en priorité si > 0). */
  repetee?: number;
};

export type Donnees = {
  matieres: Matiere[];
  chapitres: Chapitre[];
  dsts: Dst[];
  taches: Tache[];
  erreurs: ErreurNotee[];
};
