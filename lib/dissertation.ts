import type { EtapeProbleme, Probleme } from "@/lib/types";

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
  /** Introduction rédigée : amorce, présentation de l'œuvre, termes du sujet, problématique, annonce du plan. */
  introduction?: string;
  /**
   * Copie développée : un texte par partie (paragraphes séparés par une ligne vide, la
   * transition en fin de partie), puis la conclusion rédigée avec son ouverture.
   */
  developpe?: { parties: string[]; conclusion: string };
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

const CRITERES_ANALYSE_DISS = [
  "Chaque terme du sujet défini",
  "Problématique qui fait apparaître la tension du sujet",
  "Type de plan adapté à la question",
];
const CRITERES_INTRO_DISS = [
  "Amorce liée au sujet",
  "Rimbaud et le recueil situés (1870, Douai)",
  "Sujet cité et ses termes expliqués",
  "Problématique",
  "Annonce du plan",
];
const CRITERES_PARTIE_DISS = [
  "Titre de partie qui répond au sujet",
  "Un argument = une idée prouvée par un poème",
  "Citations exactes, chacune analysée (procédé, effet)",
  "Lien avec le sujet à chaque argument",
];
const CRITERES_PARTIE_DISS_DEV = [
  "Phrase d’idée directrice au début de la partie",
  "Un paragraphe par argument : idée, citation intégrée, analyse, retour au sujet",
  "Citations exactes, chacune analysée (procédé, effet)",
  "Connecteurs logiques entre les paragraphes",
  "Transition en fin de partie",
];
const CRITERES_CONCLUSION_DISS = ["Bilan qui répond à la problématique", "Rappel du parcours d’ensemble", "Ouverture"];

/**
 * Un sujet de dissertation devient un problème de S'exercer › Rédiger, en deux modes :
 * plan détaillé (analyse, introduction, parties en plan, transitions, conclusion courte) ou
 * copie développée (parties rédigées avec leurs transitions, conclusion rédigée).
 */
export function problemeDeDissertation(diss: Dissertation, s: SujetDiss): Probleme {
  const romain = ["I", "II", "III", "IV"];
  const etapes: EtapeProbleme[] = [
    {
      titre: "Analyser le sujet",
      consigne: "Au brouillon : définis chaque terme du sujet, repère ce qu’il demande, puis écris ta problématique.",
      attendu: `${s.motsCles.map((m) => `${m.mot} : ${m.sens}`).join("\n")}\n\n${s.type}\n\nProblématique : ${s.problematique}`,
      criteres: CRITERES_ANALYSE_DISS,
      points: 2,
    },
  ];
  if (s.introduction)
    etapes.push({
      titre: "Rédiger l’introduction",
      consigne: "Amorce, présentation de l’œuvre, sujet et ses termes, problématique, annonce du plan.",
      attendu: s.introduction,
      criteres: CRITERES_INTRO_DISS,
      points: 4,
    });
  s.plan.forEach((p, i) => {
    etapes.push({
      titre: `Partie ${romain[i] ?? i + 1}`,
      consigne: "Plan détaillé : titre de la partie, puis pour chaque argument l’idée, le poème, la citation et son analyse.",
      attendu: `${p.titre}\n${p.idee}\n\n${p.arguments
        .map((a, k) => `${String.fromCharCode(97 + k)}) ${a.idee}\n« ${a.poeme} » : ${a.citation}\n${a.analyse}`)
        .join("\n\n")}`,
      criteres: CRITERES_PARTIE_DISS,
      points: 4,
      developpe: s.developpe?.parties[i]
        ? {
            consigne: "Rédige toute la partie : idée directrice, un paragraphe par argument, transition à la fin.",
            attendu: s.developpe.parties[i],
            criteres: CRITERES_PARTIE_DISS_DEV,
            points: 5,
          }
        : undefined,
    });
    if (s.transitions[i] && i < s.plan.length - 1)
      etapes.push({
        titre: `Transition vers la partie ${romain[i + 1] ?? i + 2}`,
        consigne: "Une phrase qui fait le bilan et annonce la suite.",
        attendu: s.transitions[i],
        criteres: ["Bilan de la partie", "Annonce de la partie suivante"],
        points: 1,
        seulement: s.developpe ? "plan" : undefined,
      });
  });
  etapes.push({
    titre: "Conclusion",
    consigne: "Bilan qui répond à la problématique, puis une ouverture.",
    attendu: `${s.conclusion}\n\nOuverture : ${s.ouverture}`,
    criteres: CRITERES_CONCLUSION_DISS,
    points: 2,
    developpe: s.developpe ? { consigne: "Rédige la conclusion : bilan, réponse à la problématique, ouverture.", attendu: s.developpe.conclusion } : undefined,
  });
  return {
    id: `${diss.id}-${s.id}`,
    titre: `Dissertation : ${s.sujet}`,
    enonce: `Sujet : ${s.sujet}`,
    question: `Œuvre : ${diss.auteur}, ${diss.oeuvre} · parcours « ${diss.parcours} ». Dissertation en 4 h au bac.`,
    duree: "4 h (bac)",
    etapes,
  };
}
