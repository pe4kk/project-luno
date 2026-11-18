import type { Demande } from "./demandes";

/**
 * Découverte du jour (demandée le 2026-11-18) : chaque jour, la tâche planifiée dépose sur
 * l'accueil un **fait** de culture générale, une **œuvre** (peinture, texte littéraire ou
 * discours, avec la vraie image quand il y en a une) et une **actualité** vérifiée de moins
 * de 3 jours. HGGSP visée pour l'instant ; l'œuvre est liée au programme environ une fois
 * sur deux. « Je connais déjà » (`connues` des données) la fait remplacer au passage suivant.
 * Les lignes vivent dans la table `demandes` (type « lecon », `meta.decouverte`), écrites
 * par `node scripts/demandes.mjs decouverte`.
 */

export type FaitDuJour = {
  id: string;
  titre: string;
  /** Deux ou trois phrases, avec `==…==` sur l'essentiel. */
  texte: string;
  /** Pour aller plus loin (affiché par « Lire la suite »). */
  suite?: string;
  /** Où le réutiliser : « Thème 4 : un exemple d'avant 1789… ». */
  utile?: string;
  matiere?: string;
};

export type ImageOeuvre = {
  /** Image hébergée par Wikimedia (upload.wikimedia.org), en 800 px de large environ. */
  url: string;
  /** Page de l'image sur Wikimedia Commons (licence, auteur). */
  page: string;
  /** « Musée du Louvre · domaine public ». */
  credit: string;
};

export type OeuvreDuJour = {
  id: string;
  titre: string;
  auteur: string;
  /** « 1819 », « 18 juin 1940 ». */
  date: string;
  genre: "peinture" | "litterature" | "discours";
  /** Musée, recueil, lieu du discours. */
  lieu?: string;
  image?: ImageOeuvre;
  /** Court extrait (texte, discours) ou résumé. */
  extrait?: string;
  /** Trois choses à retenir. */
  points: string[];
  /** Comment la placer en copie. */
  aPlacer?: string;
  /** Liée au programme d'HGGSP (environ une fois sur deux). */
  programme?: boolean;
  suite?: string;
};

export type ActuDuJour = {
  id: string;
  titre: string;
  texte: string;
  /** Date de l'événement (AAAA-MM-JJ), 3 jours au plus avant la découverte. */
  date: string;
  /** Au moins deux sources indépendantes qui le confirment. */
  sources: { nom: string; url: string }[];
  suite?: string;
};

export type ElementDecouverte =
  | ({ type: "fait" } & FaitDuJour)
  | ({ type: "oeuvre" } & OeuvreDuJour)
  | ({ type: "actu" } & ActuDuJour);

export type ReponseDecouverte = {
  decouverte: {
    jour: string;
    fait: FaitDuJour;
    oeuvre: OeuvreDuJour;
    actu: ActuDuJour;
    /** Éléments remplacés après « Je connais déjà » (gardés pour l'historique). */
    anciens?: (ElementDecouverte & { remplaceLe?: string })[];
  };
};

/** Les découvertes reçues, de la plus récente à la plus ancienne. */
export function decouvertes(liste: Demande[]) {
  return liste
    .filter((d) => d.type === "lecon" && d.meta.decouverte && d.statut === "prete" && d.reponse)
    .map((d) => (d.reponse as ReponseDecouverte).decouverte)
    .filter((x) => x && x.fait && x.oeuvre && x.actu)
    .sort((a, b) => b.jour.localeCompare(a.jour));
}

/** Tout l'historique, éléments remplacés compris, du plus récent au plus ancien. */
export function historiqueDecouvertes(liste: Demande[]) {
  return decouvertes(liste).flatMap((d) => [
    { ...({ type: "fait", ...d.fait } as ElementDecouverte), jour: d.jour },
    { ...({ type: "oeuvre", ...d.oeuvre } as ElementDecouverte), jour: d.jour },
    { ...({ type: "actu", ...d.actu } as ElementDecouverte), jour: d.jour },
    ...(d.anciens ?? []).map((a) => ({ ...a, jour: d.jour })),
  ]);
}

export const NOMS_TYPE = { fait: "Fait", oeuvre: "Œuvre", actu: "Actualité" } as const;
export const NOMS_GENRE = { peinture: "Peinture", litterature: "Littérature", discours: "Discours" } as const;
