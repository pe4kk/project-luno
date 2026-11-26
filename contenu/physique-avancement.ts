import type { Calcul, ChapitrePublie, DefinitionCours, ElementSchema, Probleme, Schema } from "@/lib/types";

/**
 * Physique-Chimie Première, thème 1 « Le système chimique », chap. 3 : « Description de
 * l'évolution d'un système chimique » (tableau d'avancement). Repris le 2026-11-26 de quatre
 * photos du polycopié du prof (S.C. Assas) : cours, synthèse en images, capacités exigibles.
 * Formules chimiques en Unicode (S₂O₃²⁻, Al³⁺) ; x_max et x_f en notation d'indice.
 * Problèmes, calculs et exos types sur d'autres réactions que celles du cours ; chaque calcul
 * refait. Transformations limitées : seulement la définition (« étudiées plus tard »).
 */
const matiere = { nom: "Physique-Chimie", couleur: "#6f8fae", emoji: "⚗️" };

// ———————————————————— Le tableau d'avancement, dessiné ————————————————————

const c = (x: number, y: number, t: string, o: { taille?: number; ton?: "encre" | "accent" | "cuivre" | "doux" | "ok"; ancre?: "start" | "middle" } = {}): ElementSchema => ({
  f: "texte",
  en: [x, y],
  t,
  taille: o.taille ?? 10.5,
  ancre: o.ancre ?? "middle",
  ton: o.ton ?? "encre",
});
const ligne = (y: number, x1 = 4, x2 = 356): ElementSchema => ({ f: "trait", points: [[x1, y], [x2, y]], ton: "doux", fin: true });
const colonne = (x: number, y1: number, y2 = 168): ElementSchema => ({ f: "trait", points: [[x, y1], [x, y2]], ton: "doux", fin: true });

/** Bords des colonnes : état, avancement, puis les quatre espèces. */
const X = [4, 70, 116, 176, 236, 296, 356];
const milieu = (i: number) => (X[i] + X[i + 1]) / 2;

/** L'exemple du cours : I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻, n₀(I₂) = 1,0 mmol, n₀(S₂O₃²⁻) = 4,0 mmol. */
export const SCHEMA_TABLEAU: Schema = {
  l: 360,
  h: 172,
  legende:
    "Le tableau d'avancement de l'exemple du cours (quantités en mmol). Le signe « − » : les réactifs diminuent ; le signe « + » : les produits augmentent.",
  elements: [
    { f: "rect", de: [4, 4], a: [356, 168], ton: "doux", arrondi: 6 },
    { f: "rect", de: [4, 4], a: [356, 52], ton: "cuivre", plein: true, arrondi: 6 },
    c(60, 21, "Équation", { taille: 10 }),
    c(236, 21, "I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻", { taille: 12 }),
    ligne(30),
    c(37, 45, "État", { taille: 9.5 }),
    c(milieu(1), 45, "x", { taille: 10 }),
    c(milieu(2), 45, "n(I₂)", { taille: 10 }),
    c(milieu(3), 45, "n(S₂O₃²⁻)", { taille: 10 }),
    c(milieu(4), 45, "n(I⁻)", { taille: 10 }),
    c(milieu(5), 45, "n(S₄O₆²⁻)", { taille: 10 }),
    ligne(52),
    ...X.slice(1, -1).map((x) => colonne(x, 30)),
    colonne(116, 4, 30),
    // État initial
    c(37, 74, "initial", { taille: 9.5 }),
    c(milieu(1), 74, "0"),
    c(milieu(2), 74, "1,0"),
    c(milieu(3), 74, "4,0"),
    c(milieu(4), 74, "0"),
    c(milieu(5), 74, "0"),
    ligne(90),
    // En cours
    c(37, 112, "en cours", { taille: 9.5 }),
    c(milieu(1), 112, "x"),
    c(milieu(2), 112, "1,0 − x", { ton: "accent" }),
    c(milieu(3), 112, "4,0 − 2x", { ton: "accent" }),
    c(milieu(4), 112, "2x", { ton: "cuivre" }),
    c(milieu(5), 112, "x", { ton: "cuivre" }),
    ligne(128),
    // État final
    c(37, 152, "final", { taille: 9.5 }),
    c(milieu(1), 152, "x_f"),
    c(milieu(2), 152, "1,0 − x_f", { ton: "accent", taille: 10 }),
    c(milieu(3), 152, "4,0 − 2x_f", { ton: "accent", taille: 10 }),
    c(milieu(4), 152, "2x_f", { ton: "cuivre" }),
    c(milieu(5), 152, "x_f", { ton: "cuivre" }),
  ],
};

/** La recherche du réactif limitant, en deux hypothèses (synthèse en images du cours). */
export const SCHEMA_HYPOTHESES: Schema = {
  l: 340,
  h: 156,
  legende: "Trouver x_max : une hypothèse par réactif, puis garder la plus petite valeur.",
  elements: [
    { f: "rect", de: [8, 8], a: [160, 74], ton: "ok", arrondi: 10 },
    c(84, 28, "Hypothèse 1 : A limitant", { taille: 11 }),
    c(84, 50, "n₁ − a·x_max = 0", { taille: 12 }),
    c(84, 66, "x_max = n₁ / a", { taille: 11, ton: "doux" }),
    { f: "rect", de: [180, 8], a: [332, 74], ton: "encre", arrondi: 10 },
    c(256, 28, "Hypothèse 2 : B limitant", { taille: 11 }),
    c(256, 50, "n₂ − b·x_max = 0", { taille: 12 }),
    c(256, 66, "x_max = n₂ / b", { taille: 11, ton: "doux" }),
    { f: "fleche", de: [84, 78], a: [150, 106], ton: "doux" },
    { f: "fleche", de: [256, 78], a: [190, 106], ton: "doux" },
    { f: "rect", de: [40, 110], a: [300, 148], ton: "accent", arrondi: 10 },
    c(170, 126, "La plus petite valeur est x_max :", { taille: 11, ton: "accent" }),
    c(170, 142, "son réactif est le réactif limitant", { taille: 11, ton: "accent" }),
  ],
};

// ———————————————————— Définitions ————————————————————

const d = (terme: string, texte: string, precision?: string): DefinitionCours => ({
  type: "definition",
  terme,
  texte,
  ...(precision ? { precision } : {}),
});

/** Recopiées du cours, dans l'ordre. */
const DEFINITIONS: DefinitionCours[] = [
  d(
    "Système chimique",
    "Un système chimique est l'ensemble des espèces chimiques susceptibles de réagir entre elles.",
    "La transformation chimique qui a lieu est modélisée par une réaction chimique dont l'équation doit être ajustée par les coefficients stœchiométriques.",
  ),
  d(
    "Avancement x d'une réaction",
    "Grandeur, exprimée en mole (mol), qui caractérise l'évolution d'un système chimique : elle permet de décrire l'évolution des quantités de matière présentes dans le système au cours de la transformation. ==Il correspond à la quantité de matière consommée pour un réactif ou formée pour un produit si leur coefficient stœchiométrique valait 1.==",
    "À l'état initial, l'avancement est nul ; il atteint sa valeur maximale x_max à l'état final quand la réaction est terminée.",
  ),
  {
    type: "definition",
    terme: "Tableau d'avancement",
    texte:
      "Il donne l'évolution des quantités de matière des réactifs et des produits de l'état initial à l'état final de la transformation chimique, en fonction de l'avancement x.\na) La première ligne présente l'équation ajustée de la réaction.\nb) Les autres lignes donnent les quantités de matière pour l'état initial (t = 0, avancement nul), l'état en cours de transformation (avancement x) et l'état final (avancement final x_f).",
    precision:
      "Espèce en excès : si une espèce est en très large excès devant les autres, on écrit « excès » dans ses cases (c'est le cas de l'eau quand les réactifs sont en solution aqueuse). Le tableau permet de dresser un bilan de matière à tout instant.",
    schema: SCHEMA_TABLEAU,
  },
  d("Avancement final x_f", "L'avancement mesuré lorsqu'il n'y a plus aucune évolution du système."),
  d(
    "Réactif limitant",
    "Quand l'un des réactifs a été entièrement consommé à l'état final, on parle de réactif limitant. ==C'est celui pour lequel la valeur de l'avancement maximal est la plus petite.==",
  ),
  d(
    "Avancement maximal x_max",
    "La plus petite valeur de l'avancement pour laquelle la quantité finale de l'un des réactifs est nulle, compte tenu des coefficients stœchiométriques.",
  ),
  d(
    "Transformation totale",
    "Une transformation est dite totale si elle s'arrête quand l'un des réactifs (le réactif limitant) est entièrement consommé. On a alors x_f = x_max. L'équation s'écrit avec une flèche : réactifs → produits.",
  ),
  d(
    "Transformation limitée",
    "Transformation qui s'arrête avant que les réactifs ne soient entièrement consommés : on observe expérimentalement x_f < x_max. On ne peut pas définir de réactif limitant ; le bilan de matière à l'état final nécessite de connaître la valeur expérimentale de x_f. L'équation s'écrit avec une double flèche : réactifs ⇄ produits.",
    "Étudiée plus tard dans l'année.",
  ),
  {
    type: "formule",
    terme: "Mélange stœchiométrique",
    texte:
      "Pour la réaction a A + b B → c C + d D, un mélange initial est dit stœchiométrique si les quantités initiales des réactifs sont dans les mêmes proportions que leurs coefficients stœchiométriques :\n{{n₀(A) // a}} = {{n₀(B) // b}}",
    precision: "Dans ce cas, les deux réactifs sont limitants : à l'état final, ils sont tous les deux entièrement consommés (n_f(A) = n_f(B) = 0 mol). Utile au chap. 5 pour les titrages.",
  },
];

// ———————————————————— Problèmes (S'exercer → Problèmes) ————————————————————

export const PROBLEMES_AVANCEMENT: Probleme[] = [
  {
    id: "pb-avancement-propane",
    titre: "La combustion du propane",
    duree: "10 min",
    enonce:
      "Dans un réchaud, le propane C₃H₈(g) brûle dans le dioxygène O₂(g). Il se forme du dioxyde de carbone et de l'eau :\nC₃H₈(g) + 5 O₂(g) → 3 CO₂(g) + 4 H₂O(g)\nÀ l'état initial : n₀(C₃H₈) = 2,0 mol et n₀(O₂) = 8,0 mol. La transformation est totale.",
    question: "Dresser le tableau d'avancement, déterminer le réactif limitant et faire le bilan de matière à l'état final.",
    etapes: [
      {
        titre: "Le tableau d'avancement",
        consigne: "Écris les lignes « état initial » et « en cours » (avancement x, en mol).",
        attendu:
          "État initial (x = 0) : n(C₃H₈) = 2,0 ; n(O₂) = 8,0 ; n(CO₂) = 0 ; n(H₂O) = 0.\nEn cours (x) : 2,0 − x ; 8,0 − 5x ; 3x ; 4x.",
        criteres: ["Quantités initiales justes, produits à 0", "Coefficients 5, 3 et 4 devant x", "Signe − pour les réactifs, + pour les produits"],
        points: 2,
      },
      {
        titre: "Le réactif limitant",
        consigne: "Fais une hypothèse par réactif, puis conclus.",
        attendu:
          "Hypothèse 1 : si C₃H₈ est limitant, 2,0 − x_max = 0, soit x_max = 2,0 mol.\nHypothèse 2 : si O₂ est limitant, 8,0 − 5x_max = 0, soit x_max = {{8,0 // 5}} = 1,6 mol.\nLa plus petite valeur est l'avancement maximal : [[x_max = 1,6 mol]] ; ==le réactif limitant est le dioxygène.==",
        criteres: ["Deux hypothèses écrites", "x_max = 1,6 mol (la plus petite)", "O₂ désigné comme réactif limitant"],
        encadrer: true,
        points: 3,
      },
      {
        titre: "Le bilan de matière",
        consigne: "La transformation est totale : x_f = x_max. Calcule les quantités finales.",
        attendu:
          "n_f(C₃H₈) = 2,0 − 1,6 = 0,4 mol (en excès)\nn_f(O₂) = 8,0 − 5 × 1,6 = 0 mol\nn_f(CO₂) = 3 × 1,6 = 4,8 mol\nn_f(H₂O) = 4 × 1,6 = 6,4 mol",
        criteres: ["x_f = x_max utilisé", "Quatre quantités justes avec unité", "Le réactif limitant à 0 mol"],
        points: 2,
      },
    ],
  },
  {
    id: "pb-avancement-zinc",
    titre: "Le zinc dans l'acide",
    duree: "12 min",
    enonce:
      "On plonge m = 0,654 g de zinc Zn(s) dans V = 50,0 mL d'acide chlorhydrique de concentration en ions H⁺(aq) C = 0,100 mol·L⁻¹. Il se forme du dihydrogène :\nZn(s) + 2 H⁺(aq) → Zn²⁺(aq) + H₂(g)\nDonnée : M(Zn) = 65,4 g·mol⁻¹. La transformation est totale.",
    question: "Déterminer le réactif limitant, la quantité de dihydrogène formée, puis le volume d'acide qu'il faudrait pour un mélange stœchiométrique.",
    etapes: [
      {
        titre: "Les quantités initiales",
        consigne: "Calcule n₀(Zn) et n₀(H⁺), en convertissant chaque unité.",
        attendu:
          "Par définition, [[n = {{m // M}}]], avec m = 0,654 g et M = 65,4 g·mol⁻¹.\nA.N. : n₀(Zn) = {{0,654 // 65,4}} = __1,00 × 10⁻² mol__\nPar définition, [[n = C × V]], avec C = 0,100 mol·L⁻¹ et V = 50,0 mL = 50,0 × 10⁻³ L.\nA.N. : n₀(H⁺) = 0,100 × 50,0 × 10⁻³ = __5,00 × 10⁻³ mol__",
        criteres: ["n = m / M pour le zinc", "V converti en litres", "Deux résultats justes, 3 c.s."],
        encadrer: true,
        points: 2,
      },
      {
        titre: "Le réactif limitant",
        consigne: "Une hypothèse par réactif.",
        attendu:
          "Hypothèse 1 : si Zn est limitant, 1,00 × 10⁻² − x_max = 0, soit x_max = 1,00 × 10⁻² mol.\nHypothèse 2 : si H⁺ est limitant, 5,00 × 10⁻³ − 2x_max = 0, soit x_max = {{5,00 × 10⁻³ // 2}} = 2,50 × 10⁻³ mol.\n[[x_max = 2,50 × 10⁻³ mol]] : ==les ions H⁺ sont le réactif limitant.==",
        criteres: ["Le coefficient 2 de H⁺ pris en compte", "x_max = 2,50 × 10⁻³ mol", "H⁺ limitant"],
        encadrer: true,
        points: 3,
      },
      {
        titre: "Le bilan de matière",
        consigne: "Calcule n_f(Zn) et n_f(H₂).",
        attendu:
          "n_f(Zn) = 1,00 × 10⁻² − 2,50 × 10⁻³ = 7,50 × 10⁻³ mol (le zinc est en excès, il en reste)\nn_f(H₂) = x_max = 2,50 × 10⁻³ mol",
        criteres: ["n_f(Zn) = 7,50 × 10⁻³ mol", "n_f(H₂) = 2,50 × 10⁻³ mol"],
        points: 2,
      },
      {
        titre: "Le mélange stœchiométrique",
        consigne: "Quel volume d'acide faudrait-il pour que le mélange initial soit stœchiométrique ?",
        attendu:
          "Mélange stœchiométrique : {{n₀(Zn) // 1}} = {{n₀(H⁺) // 2}}, donc n₀(H⁺) = 2 × n₀(Zn) = 2,00 × 10⁻² mol.\nOr n = C × V, donc [[V = {{n₀(H⁺) // C}}]].\nA.N. : V = {{2,00 × 10⁻² // 0,100}} = 0,200 L = __200 mL__",
        criteres: ["Égalité des rapports n₀ / coefficient", "n₀(H⁺) = 2,00 × 10⁻² mol", "V = 200 mL"],
        encadrer: true,
        points: 3,
      },
    ],
  },
];

// ———————————————————— Calculs à valeurs changeantes ————————————————————

export const CALCULS_AVANCEMENT: Calcul[] = [
  {
    id: "calc-avancement-aluminium",
    titre: "Dihydrogène formé par l'aluminium",
    enonce:
      "L'aluminium réagit avec les ions H⁺ (équation de la synthèse du cours) :\n2 Al(s) + 6 H⁺(aq) → 2 Al³⁺(aq) + 3 H₂(g)\nÀ l'état initial : n₀(Al) = {nA} mmol et n₀(H⁺) = {nH} mmol. La transformation est totale.",
    question: "Trouve le réactif limitant, puis calcule la quantité de dihydrogène formée n_f(H₂), en mmol.",
    variables: [
      { nom: "nA", min: 2.0, max: 4.0, pas: 0.1 },
      { nom: "nH", min: 30, max: 40, pas: 1 },
    ],
    litterale: "n_f(H₂) = 3 x_max = 3 × {{n₀(Al) // 2}}",
    formule: "3 * nA / 2",
    inconnue: "n_f(H₂)",
    unite: "mmol",
    unitesProposees: ["mmol", "mol", "g", "mol·L⁻¹"],
    methode:
      "Hypothèse 1 : si Al est limitant, {nA} − 2x_max = 0, soit x_max = {{{nA} // 2}} mmol.\nHypothèse 2 : si H⁺ est limitant, {nH} − 6x_max = 0, soit x_max = {{{nH} // 6}} mmol.\nLa plus petite valeur est la première : l'aluminium est le réactif limitant.\nD'après le tableau, n_f(H₂) = 3x_max = 3 × {{n₀(Al) // 2}}.\nA.N. : n_f(H₂) = {resultat} mmol.",
  },
  {
    id: "calc-avancement-stoechio",
    titre: "Volume d'acide pour un mélange stœchiométrique",
    enonce:
      "On veut faire réagir m = {m} g de zinc avec de l'acide chlorhydrique de concentration en ions H⁺ C = {C} mol·L⁻¹ :\nZn(s) + 2 H⁺(aq) → Zn²⁺(aq) + H₂(g)\nDonnée : M(Zn) = 65,4 g·mol⁻¹.",
    question: "Calcule le volume V d'acide, en mL, pour que le mélange initial soit stœchiométrique.",
    variables: [
      { nom: "m", min: 0.300, max: 0.900, pas: 0.005 },
      { nom: "C", min: 0.100, max: 0.500, pas: 0.005 },
    ],
    constantes: { M: 65.4 },
    litterale: "V = {{2 m // M × C}}",
    formule: "2 * m / (M * C) * 1000",
    inconnue: "V",
    unite: "mL",
    unitesProposees: ["mL", "L", "mol", "g"],
    methode:
      "Mélange stœchiométrique : {{n₀(Zn) // 1}} = {{n₀(H⁺) // 2}}, donc n₀(H⁺) = 2 × n₀(Zn).\nOr n₀(Zn) = {{m // M}} et n₀(H⁺) = C × V, donc C × V = {{2m // M}}, d'où V = {{2m // M × C}}.\nA.N. : V = {{2 × {m} // 65,4 × {C}}} L, à convertir en mL (× 10³) : V = {resultat} mL.",
  },
];

// ———————————————————— Le chapitre ————————————————————

export const PHYSIQUE_AVANCEMENT: ChapitrePublie = {
  id: "pc-1re-chap3-avancement",
  version: 1,
  matiere,
  titre: "Chap. 3 · Description de l'évolution d'un système chimique",
  documents: [],
  definitions: DEFINITIONS,
  problemes: PROBLEMES_AVANCEMENT,
  calculs: CALCULS_AVANCEMENT,
  flashcards: [
    { recto: "Système chimique", verso: "L'ensemble des espèces chimiques susceptibles de réagir entre elles." },
    { recto: "Avancement x d'une réaction", verso: "Grandeur en mol qui décrit l'évolution des quantités de matière : c'est la quantité de matière consommée (réactif) ou formée (produit) si son coefficient stœchiométrique valait 1. Nul à l'état initial." },
    { recto: "Tableau d'avancement", verso: "Il donne l'évolution des quantités de matière des réactifs et des produits, de l'état initial à l'état final, en fonction de l'avancement x. Première ligne : l'équation ajustée.", schema: SCHEMA_TABLEAU },
    { recto: "Quelles sont les trois lignes d'état d'un tableau d'avancement ?", verso: "L'état initial (x = 0), l'état en cours de transformation (x), l'état final (x = x_f)." },
    { recto: "Dans un tableau d'avancement, que signifient les signes « − » et « + » ?", verso: "« − » : les quantités des réactifs diminuent (n₀ − a·x) ; « + » : celles des produits augmentent (0 + c·x)." },
    { recto: "Quand écrit-on « excès » dans un tableau d'avancement ?", verso: "Quand une espèce est en très large excès devant les autres, comme l'eau quand les réactifs sont en solution aqueuse." },
    { recto: "Avancement final x_f", verso: "L'avancement mesuré lorsqu'il n'y a plus aucune évolution du système." },
    { recto: "Réactif limitant", verso: "Le réactif entièrement consommé à l'état final : celui pour lequel la valeur de l'avancement maximal est la plus petite." },
    { recto: "Avancement maximal x_max", verso: "La plus petite valeur de l'avancement pour laquelle la quantité finale de l'un des réactifs est nulle, compte tenu des coefficients stœchiométriques." },
    { recto: "Comment trouve-t-on le réactif limitant et x_max ?", verso: "Une hypothèse par réactif : si A est limitant, n₀(A) − a·x_max = 0, soit x_max = n₀(A)/a ; idem pour B. La plus petite valeur est x_max, et son réactif est le réactif limitant.", schema: SCHEMA_HYPOTHESES, horsQuiz: true },
    { recto: "Transformation totale", verso: "Elle s'arrête quand le réactif limitant est entièrement consommé : x_f = x_max. Équation écrite avec une flèche →." },
    { recto: "Transformation limitée", verso: "Elle s'arrête avant que les réactifs soient entièrement consommés : x_f < x_max, pas de réactif limitant. Équation écrite avec une double flèche ⇄." },
    { recto: "Comment savoir si une transformation est totale ou limitée ?", verso: "On compare l'avancement final mesuré x_f à l'avancement maximal x_max : x_f = x_max, totale ; x_f < x_max, limitée." },
    { recto: "Mélange stœchiométrique", verso: "Les quantités initiales des réactifs sont dans les mêmes proportions que leurs coefficients stœchiométriques : n₀(A)/a = n₀(B)/b. Les deux réactifs sont limitants." },
    { recto: "Dans un mélange stœchiométrique, que reste-t-il des réactifs à l'état final ?", verso: "Rien : les deux réactifs sont entièrement consommés, n_f(A) = n_f(B) = 0 mol." },
  ],
  fiche: {
    sections: [
      {
        titre: "I. L'avancement d'une transformation chimique",
        points: [
          { t: "Un système chimique est l'ensemble des espèces chimiques susceptibles de réagir entre elles ; la transformation est modélisée par une réaction dont l'équation est ajustée par les coefficients stœchiométriques.", n: 2 },
          { t: "==L'avancement x (en mol) correspond à la quantité de matière consommée pour un réactif ou formée pour un produit si son coefficient stœchiométrique valait 1.==", n: 1 },
          { t: "À l'état initial, x = 0 ; il augmente au cours du temps et atteint sa valeur maximale x_max à l'état final, quand la réaction est terminée (courbe croissante qui tend vers x_max).", n: 2 },
        ],
      },
      {
        titre: "II. Le tableau d'avancement",
        points: [
          { t: "==Le tableau d'avancement donne l'évolution des quantités de matière des réactifs et des produits, de l'état initial à l'état final, en fonction de x.==", n: 1, schema: SCHEMA_TABLEAU },
          { t: "Première ligne : l'équation ajustée. Puis trois lignes : état initial (x = 0), en cours (x), état final (x_f). Réactif : n₀ − a·x ; produit : 0 + c·x (le coefficient devant x est le coefficient stœchiométrique).", n: 1 },
          { t: "Une espèce en très large excès (l'eau des solutions aqueuses) : on écrit « excès » dans ses cases.", n: 3 },
          { t: "Il permet un bilan de matière à tout instant : la composition du système à l'état initial, en cours ou à l'état final.", n: 2 },
          { t: "Le nombre 1 devant une espèce n'est généralement pas écrit dans l'équation.", n: 4 },
        ],
      },
      {
        titre: "III. Le réactif limitant",
        points: [
          { t: "Le réactif limitant est entièrement consommé à l'état final. ==Le réactif limitant est celui pour lequel la valeur de l'avancement maximal est la plus petite.==", n: 1 },
          { t: "Méthode : une hypothèse par réactif. Si A est limitant, n₀(A) − a·x_max = 0, soit x_max = {{n₀(A) // a}} ; si B est limitant, x_max = {{n₀(B) // b}}. ==La plus petite des deux valeurs est x_max.==", n: 1, schema: SCHEMA_HYPOTHESES },
          { t: "Exemple du cours : avec 1,0 mmol de I₂ et 4,0 mmol de S₂O₃²⁻, hypothèse 1 : x_max = 1,0 mmol ; hypothèse 2 : 4,0 − 2x_max = 0, x_max = 2,0 mmol. Donc x_max = 1,0 mmol et le diiode est le réactif limitant.", n: 2 },
          { t: "Connaître x_max permet de faire le bilan de matière : on remplace x par x_max dans la dernière ligne.", n: 2 },
          { t: "Piège : ne pas comparer directement les quantités initiales. Il faut tenir compte des coefficients (diviser par a et b).", n: 3 },
        ],
      },
      {
        titre: "IV. Transformations totales et limitées",
        points: [
          { t: "==Totale : elle s'arrête quand le réactif limitant est entièrement consommé, x_f = x_max==, équation avec une flèche →.", n: 1 },
          { t: "Limitée : on observe x_f < x_max ; elle s'arrête avant que les réactifs soient entièrement consommés, il n'y a pas de réactif limitant ; équation avec une double flèche ⇄. Le bilan final demande la valeur expérimentale de x_f.", n: 2 },
          { t: "Étudiées plus tard dans l'année : savoir les distinguer à partir de la valeur de x_max.", n: 4 },
        ],
      },
      {
        titre: "V. Le mélange stœchiométrique",
        points: [
          { t: "==Pour a A + b B → c C + d D, le mélange initial est stœchiométrique si {{n₀(A) // a}} = {{n₀(B) // b}}== : les quantités initiales sont dans les mêmes proportions que les coefficients.", n: 1 },
          { t: "Les deux réactifs sont alors limitants : à l'état final, n_f(A) = n_f(B) = 0 mol.", n: 1 },
          { t: "Les mélanges stœchiométriques serviront au chap. 5 pour les titrages.", n: 4 },
        ],
      },
    ],
    aRetenir: ["avancement x (mol)", "tableau d'avancement", "x_f", "réactif limitant", "x_max", "transformation totale", "transformation limitée", "mélange stœchiométrique"],
  },
  exercices: [
    { question: "Pour la réaction 2 H₂ + O₂ → 2 H₂O, quelle est la quantité de H₂ en cours de transformation, si n₀(H₂) = 3,0 mol ?", choix: ["3,0 − x", "3,0 − 2x", "3,0 + 2x", "2x"], bonneReponse: 1, explication: "Le coefficient stœchiométrique de H₂ est 2, et c'est un réactif : sa quantité diminue de 2x." },
    { question: "Pour la même réaction, quelle est la quantité d'eau formée en cours de transformation ?", choix: ["0 + x", "0 + 2x", "2,0 − 2x", "0 − 2x"], bonneReponse: 1, explication: "L'eau est un produit de coefficient 2 : 0 + 2x." },
    { question: "N₂ + 3 H₂ → 2 NH₃ avec n₀(N₂) = 2,0 mol et n₀(H₂) = 4,5 mol. Que vaut x_max ?", choix: ["1,5 mol", "2,0 mol", "4,5 mol", "3,0 mol"], bonneReponse: 0, explication: "Hypothèse 1 : 2,0 − x_max = 0, x_max = 2,0 mol. Hypothèse 2 : 4,5 − 3x_max = 0, x_max = 1,5 mol. La plus petite : 1,5 mol, H₂ est limitant." },
    { question: "Dans cette même réaction, quel est le réactif limitant ?", choix: ["N₂", "H₂", "NH₃", "Aucun"], bonneReponse: 1, explication: "H₂ donne la plus petite valeur de x_max (1,5 mol), alors qu'il y en a plus au départ : il faut tenir compte du coefficient 3." },
    { question: "Pour a A + b B → c C + d D, quelle égalité définit un mélange stœchiométrique ?", choix: ["n₀(A) = n₀(B)", "n₀(A)/a = n₀(B)/b", "a·n₀(A) = b·n₀(B)", "n₀(A) + n₀(B) = a + b"], bonneReponse: 1, explication: "Les quantités initiales sont dans les mêmes proportions que les coefficients stœchiométriques." },
    { question: "On mesure x_f = 0,67 mol alors que x_max = 1,0 mol. La transformation est :", choix: ["totale", "limitée", "stœchiométrique", "impossible"], bonneReponse: 1, explication: "x_f < x_max : la transformation est limitée, elle s'arrête avant que les réactifs soient entièrement consommés." },
    { type: "vraiFaux", affirmation: "Le réactif limitant est toujours celui dont la quantité initiale est la plus petite.", vrai: false, explication: "Il faut tenir compte des coefficients : c'est celui qui donne la plus petite valeur de x_max = n₀ / coefficient." },
    { type: "vraiFaux", affirmation: "À l'état initial, l'avancement est nul.", vrai: true, explication: "x = 0 à t = 0." },
    { type: "vraiFaux", affirmation: "Dans un mélange stœchiométrique, les deux réactifs sont limitants.", vrai: true, explication: "Ils sont tous les deux entièrement consommés à l'état final." },
    { type: "vraiFaux", affirmation: "L'avancement s'exprime en mol·L⁻¹.", vrai: false, explication: "L'avancement est une quantité de matière : il s'exprime en mole (mol), ou en mmol." },
    { type: "vraiFaux", affirmation: "L'équation d'une transformation limitée s'écrit avec une double flèche.", vrai: true, explication: "Réactifs ⇄ produits ; une transformation totale s'écrit avec une seule flèche." },
    { type: "trou", texte: "Une transformation est totale si l'avancement final est égal à l'avancement ___.", reponses: ["maximal"], explication: "x_f = x_max." },
    { type: "trou", texte: "Le réactif entièrement consommé à l'état final s'appelle le réactif ___.", reponses: ["limitant"], explication: "C'est celui qui donne la plus petite valeur de x_max." },
    { type: "trou", texte: "Quand l'eau est en très large excès, on écrit « ___ » dans ses cases du tableau d'avancement.", reponses: ["excès", "exces"], explication: "C'est le cas des réactions en solution aqueuse." },
    { type: "ordre", consigne: "Remets dans l'ordre les étapes pour faire un bilan de matière.", elements: ["Écrire l'équation ajustée", "Remplir l'état initial", "Écrire l'état en cours en fonction de x", "Faire une hypothèse par réactif", "Garder la plus petite valeur : x_max", "Remplacer x par x_max dans l'état final"], explication: "Le tableau d'abord, puis le réactif limitant, puis le bilan." },
    { type: "ouverte", question: "CH₄ + 2 O₂ → CO₂ + 2 H₂O, avec n₀(CH₄) = 1,5 mol et n₀(O₂) = 2,0 mol. Trouve le réactif limitant et fais le bilan de matière (transformation totale).", corrige: "Hypothèse 1 : 1,5 − x_max = 0, x_max = 1,5 mol. Hypothèse 2 : 2,0 − 2x_max = 0, x_max = 1,0 mol. Donc x_max = 1,0 mol, le dioxygène est limitant. Bilan : n_f(CH₄) = 1,5 − 1,0 = 0,5 mol ; n_f(O₂) = 0 mol ; n_f(CO₂) = 1,0 mol ; n_f(H₂O) = 2 × 1,0 = 2,0 mol." },
    { type: "ouverte", question: "Fe + 2 H⁺ → Fe²⁺ + H₂ avec n₀(Fe) = 0,20 mol. Quelle quantité d'ions H⁺ faut-il pour un mélange stœchiométrique ?", corrige: "Mélange stœchiométrique : n₀(Fe)/1 = n₀(H⁺)/2, donc n₀(H⁺) = 2 × 0,20 = 0,40 mol." },
  ],
};
