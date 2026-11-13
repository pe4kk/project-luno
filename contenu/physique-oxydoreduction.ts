import type { Calcul, ChapitrePublie, DefinitionCours, Probleme, Schema } from "@/lib/types";

/**
 * Physique-Chimie Première, thème 1 « Le système chimique », chap. 4 : « Les réactions
 * d'oxydoréduction ». Repris le 2026-11-13 de trois photos du polycopié du prof
 * (S.C. Assas), complété à la main en classe. Les notations chimiques sont écrites en
 * Unicode (Cr₂O₇²⁻, MnO₄⁻, H⁺, e⁻) : pas de « _ », qui ferait un indice en lettres.
 * Les exercices et problèmes utilisent d'autres couples que ceux du cours (exemples
 * parallèles) ; la méthode est celle du prof, en trois ou quatre étapes.
 */
const matiere = { nom: "Physique-Chimie", couleur: "#6f8fae", emoji: "⚗️" };

/** La demi-équation et ses deux sens, comme dans la « synthèse en images » du cours. */
export const SCHEMA_COUPLE: Schema = {
  l: 320,
  h: 128,
  legende: "Un couple Ox/Red : la demi-équation se lit dans les deux sens",
  elements: [
    { f: "texte", en: [160, 22], t: "Oxydation (l'oxydant se forme)", ancre: "middle", ton: "accent", taille: 12.5 },
    { f: "fleche", de: [250, 34], a: [70, 34], ton: "accent" },
    { f: "texte", en: [160, 71], t: "Ox + n e⁻ ⇄ Red", ancre: "middle", taille: 21 },
    { f: "fleche", de: [70, 92], a: [250, 92], ton: "encre" },
    { f: "texte", en: [160, 116], t: "Réduction (le réducteur se forme)", ancre: "middle", ton: "encre", taille: 12.5 },
  ],
};

/** Le transfert d'électrons d'une réaction d'oxydoréduction. */
export const SCHEMA_TRANSFERT: Schema = {
  l: 320,
  h: 140,
  legende: "Le réducteur du couple 1 cède ses électrons à l'oxydant du couple 2",
  elements: [
    { f: "rect", de: [14, 34], a: [112, 82], arrondi: 12, ton: "doux" },
    { f: "texte", en: [63, 64], t: "Red₁", ancre: "middle", taille: 19 },
    { f: "rect", de: [208, 34], a: [306, 82], arrondi: 12, ton: "doux" },
    { f: "texte", en: [257, 64], t: "Ox₂", ancre: "middle", taille: 19 },
    { f: "fleche", de: [118, 58], a: [202, 58], ton: "cuivre", nom: "n e⁻", pos: [160, 46] },
    { f: "texte", en: [63, 108], t: "est oxydé → Ox₁", ancre: "middle", main: true, ton: "accent", taille: 17 },
    { f: "texte", en: [257, 108], t: "est réduit → Red₂", ancre: "middle", main: true, ton: "accent", taille: 17 },
  ],
};

const d = (terme: string, texte: string, precision?: string): DefinitionCours => ({
  type: "definition",
  terme,
  texte,
  ...(precision ? { precision } : {}),
});

/** Recopiées du cours, dans l'ordre. */
const DEFINITIONS: DefinitionCours[] = [
  d("Oxydant", "Un oxydant est une espèce chimique capable de capter un ou plusieurs électrons."),
  d("Réducteur", "Un réducteur est une espèce chimique capable de céder un ou plusieurs électrons."),
  d(
    "Couple oxydant/réducteur",
    "Un couple Oxydant/Réducteur, noté Ox/Red, est un couple formé par deux espèces chimiques susceptibles de se transformer l'une en l'autre par gain ou perte d'électrons selon la demi-équation électronique suivante :\nOx + n e⁻ ⇄ Red",
  ),
  {
    type: "propriete",
    terme: "Réduction et oxydation",
    texte:
      "Dans le sens direct (→), la demi-équation est une réaction de réduction, car elle conduit à la formation du réducteur.\nDans le sens indirect (←), la demi-équation est une réaction d'oxydation, car elle conduit à la formation de l'oxydant.",
    schema: SCHEMA_COUPLE,
  },
  {
    type: "methode",
    terme: "Établir une demi-équation électronique",
    texte:
      "1. Équilibrer les atomes autres que O et H.\n2. Équilibrer les atomes O en ajoutant H₂O(l).\n3. Équilibrer les atomes H en ajoutant H⁺(aq), l'ion hydrogène.\n4. Équilibrer les charges électriques en ajoutant les électrons du côté de l'oxydant.",
    precision:
      "Exemple du cours, couple Cr₂O₇²⁻(aq) / Cr³⁺(aq) (ion dichromate / ion chrome) : Cr₂O₇²⁻(aq) + 14 H⁺(aq) + 6 e⁻ ⇄ 2 Cr³⁺(aq) + 7 H₂O(l).",
  },
  d(
    "Réaction d'oxydoréduction",
    "Une réaction d'oxydoréduction met en jeu deux couples Ox/Red. Elle modélise la transformation chimique au cours de laquelle il y a transfert d'électrons du réducteur Red₁ du couple 1 (Ox₁/Red₁) vers l'oxydant Ox₂ du couple 2 (Ox₂/Red₂). L'équation d'oxydoréduction s'écrit :\nRed₁ + Ox₂ → Ox₁ + Red₂",
    "Le réducteur Red₁ est oxydé (il subit une oxydation) ; l'oxydant Ox₂ est réduit (il subit une réduction).",
  ),
  {
    type: "methode",
    terme: "Établir l'équation d'oxydoréduction",
    texte:
      "1. Identifier les deux réactifs mis en jeu (Red₁ et Ox₂).\n2. Écrire les deux demi-équations électroniques avec le réactif à gauche.\n3. Combiner les demi-équations : le nombre d'électrons cédés est égal au nombre d'électrons captés.",
    precision:
      "Exemple du cours : I⁻ oxydé par MnO₄⁻. 2 I⁻(aq) → I₂(aq) + 2 e⁻ (× 5) et MnO₄⁻(aq) + 8 H⁺(aq) + 5 e⁻ → Mn²⁺(aq) + 4 H₂O(l) (× 2), d'où 2 MnO₄⁻(aq) + 16 H⁺(aq) + 10 I⁻(aq) → 2 Mn²⁺(aq) + 8 H₂O(l) + 5 I₂(aq).",
  },
  {
    type: "propriete",
    terme: "Simplifier l'équation-bilan",
    texte:
      "Lorsqu'une même espèce chimique figure parmi les réactifs et les produits, il est nécessaire de simplifier l'équation-bilan, comme on le ferait avec une équation mathématique, afin que chaque espèce chimique figure exclusivement soit comme un réactif, soit comme un produit.\nIl arrive que tous les nombres stœchiométriques obtenus dans l'équation-bilan soient divisibles par un nombre entier. Il est d'usage de tous les diviser par ce nombre afin d'obtenir une équation-bilan la plus simple possible.",
  },
  {
    type: "propriete",
    terme: "Attention : demi-équation ou équation-bilan",
    texte:
      "Il ne faut pas confondre :\n– une demi-équation électronique qui lie l'oxydant et le réducteur d'un couple et qui fait apparaître les électrons échangés ;\n– avec une équation-bilan de réaction qui modélise une transformation chimique et qui ne fait PAS apparaître les électrons.",
  },
  {
    type: "formule",
    terme: "Synthèse : combiner deux demi-équations",
    texte:
      "Red₁ = Ox₁ + n₁ e⁻ (× n₂)\nOx₂ + n₂ e⁻ = Red₂ (× n₁)\nn₂ Red₁ + n₁ Ox₂ → n₂ Ox₁ + n₁ Red₂",
    schema: SCHEMA_TRANSFERT,
  },
];

export const PROBLEMES_OXYDOREDUCTION: Probleme[] = [
  {
    id: "pb-oxydo-fer-permanganate",
    titre: "Doser les ions fer(II)",
    duree: "10 min",
    enonce:
      "On verse une solution violette de permanganate de potassium dans une solution contenant des ions fer(II) Fe²⁺(aq), en milieu acide. Les ions permanganate MnO₄⁻(aq) réagissent avec les ions fer(II).\nCouples : MnO₄⁻(aq) / Mn²⁺(aq) et Fe³⁺(aq) / Fe²⁺(aq).",
    question: "Établir l'équation de la réaction d'oxydoréduction.",
    etapes: [
      {
        titre: "Les réactifs",
        consigne: "Identifie les deux réactifs, et le rôle de chacun (Red₁ et Ox₂).",
        attendu:
          "Réactifs : Fe²⁺(aq), le réducteur du couple Fe³⁺/Fe²⁺ (Red₁), et MnO₄⁻(aq), l'oxydant du couple MnO₄⁻/Mn²⁺ (Ox₂).",
        criteres: ["Fe²⁺ identifié comme réducteur (Red₁)", "MnO₄⁻ identifié comme oxydant (Ox₂)"],
      },
      {
        titre: "Demi-équation du couple MnO₄⁻/Mn²⁺",
        consigne: "Écris la demi-équation, réactif MnO₄⁻ à gauche, en suivant les quatre étapes.",
        attendu:
          "Mn est équilibré ; 4 O → + 4 H₂O à droite ; 8 H → + 8 H⁺ à gauche ; charges : 8 − 1 = +7 à gauche, +2 à droite → + 5 e⁻ à gauche.\n[[MnO₄⁻(aq) + 8 H⁺(aq) + 5 e⁻ → Mn²⁺(aq) + 4 H₂O(l)]]",
        criteres: ["4 H₂O pour les oxygènes", "8 H⁺ pour les hydrogènes", "5 e⁻ du côté de l'oxydant"],
        encadrer: true,
      },
      {
        titre: "Demi-équation du couple Fe³⁺/Fe²⁺",
        consigne: "Écris la demi-équation avec le réactif Fe²⁺ à gauche.",
        attendu: "[[Fe²⁺(aq) → Fe³⁺(aq) + e⁻]] (sens de l'oxydation : le réactif est à gauche)",
        criteres: ["Fe²⁺ à gauche", "Un électron, du côté de l'oxydant Fe³⁺"],
        encadrer: true,
      },
      {
        titre: "Combinaison",
        consigne: "Combine les deux demi-équations pour que les électrons cédés soient égaux aux électrons captés.",
        attendu:
          "On multiplie la demi-équation du fer par 5 (5 e⁻ cédés = 5 e⁻ captés) et on additionne :\n[[MnO₄⁻(aq) + 8 H⁺(aq) + 5 Fe²⁺(aq) → Mn²⁺(aq) + 4 H₂O(l) + 5 Fe³⁺(aq)]]\nAucun électron dans l'équation-bilan.",
        criteres: ["Demi-équation du fer multipliée par 5", "Les électrons ont disparu", "Coefficients et charges justes"],
        encadrer: true,
      },
    ],
  },
  {
    id: "pb-oxydo-zinc-cuivre",
    titre: "Une lame de zinc dans le sulfate de cuivre",
    duree: "6 min",
    enonce:
      "On plonge une lame de zinc Zn(s) dans une solution bleue de sulfate de cuivre(II). La lame se recouvre d'un dépôt rouge de cuivre Cu(s) et la solution se décolore.\nCouples : Cu²⁺(aq) / Cu(s) et Zn²⁺(aq) / Zn(s).",
    question: "Établir l'équation de la réaction et dire quelle espèce est oxydée et laquelle est réduite.",
    etapes: [
      {
        titre: "Les deux demi-équations",
        consigne: "Écris les deux demi-équations, chaque réactif à gauche.",
        attendu: "Zn(s) → Zn²⁺(aq) + 2 e⁻\nCu²⁺(aq) + 2 e⁻ → Cu(s)",
        criteres: ["Zn à gauche, électrons du côté de Zn²⁺", "Cu²⁺ à gauche, électrons du côté de Cu²⁺"],
      },
      {
        titre: "L'équation et les rôles",
        consigne: "Combine-les, puis dis qui est oxydé et qui est réduit.",
        attendu:
          "2 e⁻ cédés = 2 e⁻ captés, pas de multiplication :\n[[Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)]]\nLe zinc, réducteur, est oxydé ; les ions cuivre(II), oxydant, sont réduits.",
        criteres: ["Équation juste, sans électrons", "Zn oxydé (réducteur)", "Cu²⁺ réduit (oxydant)"],
        encadrer: true,
      },
    ],
  },
];

export const CALCULS_OXYDOREDUCTION: Calcul[] = [
  {
    id: "calc-oxydo-iodure",
    titre: "Ions iodure oxydés",
    enonce:
      "Les ions permanganate oxydent les ions iodure selon l'équation du cours : 2 MnO₄⁻(aq) + 16 H⁺(aq) + 10 I⁻(aq) → 2 Mn²⁺(aq) + 8 H₂O(l) + 5 I₂(aq).\nOn verse V = {V} mL d'une solution de permanganate de concentration C = {C} × 10⁻² mol·L⁻¹ ; tous les ions permanganate réagissent.",
    question: "Calcule la quantité de matière n(I⁻) d'ions iodure oxydés.",
    variables: [
      { nom: "V", min: 10.0, max: 20.0, pas: 0.5 },
      { nom: "C", min: 1.00, max: 3.00, pas: 0.05 },
    ],
    litterale: "n(I⁻) = 5 × C × V",
    formule: "5 * C * 0.01 * V * 0.001",
    inconnue: "n(I⁻)",
    unite: "mol",
    unitesProposees: ["mol", "mol·L⁻¹", "g", "L"],
    methode:
      "D'après l'équation, 2 MnO₄⁻ réagissent avec 10 I⁻ : {{n(I⁻) // 10}} = {{n(MnO₄⁻) // 2}}, donc n(I⁻) = 5 × n(MnO₄⁻).\nOr n(MnO₄⁻) = C × V, d'où n(I⁻) = 5 × C × V.\nConversions avant le calcul : C = {C} × 10⁻² mol·L⁻¹ ; V = {V} mL = {V} × 10⁻³ L.\nA.N. : n(I⁻) = {resultat} mol.",
  },
];

export const PHYSIQUE_OXYDOREDUCTION: ChapitrePublie = {
  id: "pc-1re-chap4-oxydoreduction",
  version: 1,
  matiere,
  titre: "Chap. 4 · Les réactions d'oxydoréduction",
  documents: [],
  definitions: DEFINITIONS,
  problemes: PROBLEMES_OXYDOREDUCTION,
  calculs: CALCULS_OXYDOREDUCTION,
  flashcards: [
    { recto: "Oxydant", verso: "Espèce chimique capable de capter un ou plusieurs électrons." },
    { recto: "Réducteur", verso: "Espèce chimique capable de céder un ou plusieurs électrons." },
    { recto: "Couple Ox/Red", verso: "Deux espèces qui se transforment l'une en l'autre par gain ou perte d'électrons : Ox + n e⁻ ⇄ Red.", schema: SCHEMA_COUPLE },
    { recto: "Réduction", verso: "Sens direct (→) de la demi-équation : elle conduit à la formation du réducteur. L'oxydant capte des électrons." },
    { recto: "Oxydation", verso: "Sens indirect (←) de la demi-équation : elle conduit à la formation de l'oxydant. Le réducteur cède des électrons." },
    { recto: "Qui est oxydé, qui est réduit ?", verso: "Le réducteur cède des électrons : il est oxydé. L'oxydant capte des électrons : il est réduit." },
    { recto: "Les 4 étapes d'une demi-équation", verso: "1. Atomes autres que O et H. 2. O avec H₂O. 3. H avec H⁺. 4. Charges avec des e⁻, du côté de l'oxydant." },
    { recto: "Demi-équation du couple Cr₂O₇²⁻/Cr³⁺", verso: "Cr₂O₇²⁻(aq) + 14 H⁺(aq) + 6 e⁻ ⇄ 2 Cr³⁺(aq) + 7 H₂O(l). Vérification des charges : 14 − 2 − 6 = +6 à gauche, 2 × 3 = +6 à droite." },
    { recto: "Demi-équation du couple MnO₄⁻/Mn²⁺", verso: "MnO₄⁻(aq) + 8 H⁺(aq) + 5 e⁻ ⇄ Mn²⁺(aq) + 4 H₂O(l)." },
    { recto: "Demi-équation du couple I₂/I⁻", verso: "I₂(aq) + 2 e⁻ ⇄ 2 I⁻(aq)." },
    { recto: "Réaction d'oxydoréduction", verso: "Transfert d'électrons du réducteur Red₁ d'un couple vers l'oxydant Ox₂ d'un autre couple : Red₁ + Ox₂ → Ox₁ + Red₂.", schema: SCHEMA_TRANSFERT },
    { recto: "Les 3 étapes d'une équation d'oxydoréduction", verso: "1. Identifier les réactifs Red₁ et Ox₂. 2. Écrire les deux demi-équations avec le réactif à gauche. 3. Combiner : électrons cédés = électrons captés." },
    { recto: "Combiner deux demi-équations", verso: "On multiplie chacune pour avoir le même nombre d'électrons (le plus petit multiple commun), puis on additionne : les électrons disparaissent." },
    { recto: "Équation I⁻ + MnO₄⁻", verso: "2 MnO₄⁻(aq) + 16 H⁺(aq) + 10 I⁻(aq) → 2 Mn²⁺(aq) + 8 H₂O(l) + 5 I₂(aq)." },
    { recto: "Simplifier une équation-bilan", verso: "Une espèce présente des deux côtés se simplifie (comme en maths) ; si tous les nombres stœchiométriques sont divisibles par un même entier, on les divise." },
    { recto: "Demi-équation ou équation-bilan ?", verso: "La demi-équation (un seul couple) fait apparaître les électrons ; l'équation-bilan (deux couples) ne les fait JAMAIS apparaître." },
  ],
  fiche: {
    sections: [
      {
        titre: "Oxydants et réducteurs",
        points: [
          { t: "==Un oxydant capte un ou plusieurs électrons ; un réducteur en cède.==", n: 1 },
          { t: "Un couple Ox/Red : deux espèces qui se transforment l'une en l'autre par gain ou perte d'électrons, selon la demi-équation Ox + n e⁻ ⇄ Red.", n: 1, schema: SCHEMA_COUPLE },
          { t: "==Sens direct (→) : réduction, le réducteur se forme. Sens indirect (←) : oxydation, l'oxydant se forme.==", n: 2 },
          { t: "On écrit toujours l'oxydant en premier dans le nom du couple : MnO₄⁻/Mn²⁺, I₂/I⁻, Cu²⁺/Cu.", n: 3 },
          { t: "Pour s'en souvenir : un oxydant est réduit (il gagne des électrons) ; un réducteur est oxydé (il en perd).", n: 4 },
        ],
      },
      {
        titre: "Écrire une demi-équation électronique",
        points: [
          { t: "==Quatre étapes, dans l'ordre : 1. les atomes autres que O et H ; 2. O avec H₂O(l) ; 3. H avec H⁺(aq) ; 4. les charges avec des e⁻, du côté de l'oxydant.==", n: 1 },
          { t: "Exemple du cours (Cr₂O₇²⁻/Cr³⁺) : 1. Cr₂O₇²⁻ ⇄ 2 Cr³⁺ ; 2. … ⇄ 2 Cr³⁺ + 7 H₂O ; 3. Cr₂O₇²⁻ + 14 H⁺ ⇄ 2 Cr³⁺ + 7 H₂O ; 4. + 6 e⁻ à gauche.", n: 2 },
          { t: "Vérifie les charges à la fin : à gauche 14 × (+1) + (−2) + 6 × (−1) = +6 ; à droite 2 × (+3) = +6. Les deux côtés doivent être égaux.", n: 3 },
          { t: "Les électrons se placent toujours du côté de l'oxydant : c'est lui qui les capte.", n: 3 },
          { t: "Pense aux états physiques : (aq) pour les ions et espèces dissoutes, (l) pour l'eau, (s) pour un solide comme Cu ou Zn.", n: 5 },
        ],
      },
      {
        titre: "L'équation d'oxydoréduction",
        points: [
          { t: "==Une réaction d'oxydoréduction est un transfert d'électrons du réducteur Red₁ d'un couple vers l'oxydant Ox₂ d'un autre couple : Red₁ + Ox₂ → Ox₁ + Red₂.==", n: 1, schema: SCHEMA_TRANSFERT },
          { t: "Le réducteur Red₁ est oxydé ; l'oxydant Ox₂ est réduit.", n: 2 },
          { t: "==Méthode : 1. identifier les réactifs (Red₁ et Ox₂) ; 2. écrire les deux demi-équations avec le réactif à gauche ; 3. combiner pour que les électrons cédés égalent les électrons captés.==", n: 1 },
          { t: "Exemple du cours : 2 I⁻ → I₂ + 2 e⁻ (× 5) et MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O (× 2) : 10 électrons de chaque côté (2 × 5 = 10).", n: 2 },
          { t: "On additionne : 2 MnO₄⁻(aq) + 16 H⁺(aq) + 10 I⁻(aq) → 2 Mn²⁺(aq) + 8 H₂O(l) + 5 I₂(aq). Les électrons ont disparu.", n: 2 },
          { t: "Pour avoir le réactif à gauche, il faut parfois écrire la demi-équation dans le sens de l'oxydation (2 I⁻ → I₂ + 2 e⁻).", n: 3 },
          { t: "Synthèse : avec n₁ et n₂ électrons échangés, n₂ Red₁ + n₁ Ox₂ → n₂ Ox₁ + n₁ Red₂.", n: 4 },
        ],
      },
      {
        titre: "Simplifier et vérifier",
        points: [
          { t: "==Une demi-équation fait apparaître les électrons ; une équation-bilan ne les fait JAMAIS apparaître.==", n: 1 },
          { t: "Une espèce présente parmi les réactifs et les produits (souvent H⁺ ou H₂O) se simplifie, comme dans une équation mathématique.", n: 2 },
          { t: "Si tous les nombres stœchiométriques sont divisibles par un même entier, on les divise pour avoir l'équation la plus simple.", n: 3 },
          { t: "Vérifie l'équation finale : mêmes atomes de chaque côté, et même charge totale.", n: 3 },
          { t: "L'équation sert ensuite aux calculs de quantité de matière : avec 2 MnO₄⁻ pour 10 I⁻, n(I⁻) = 5 × n(MnO₄⁻).", n: 4 },
        ],
      },
    ],
    aRetenir: [
      "oxydant capte",
      "réducteur cède",
      "Ox + n e⁻ ⇄ Red",
      "réduction →",
      "oxydation ←",
      "4 étapes : atomes, O, H, charges",
      "e⁻ côté oxydant",
      "Red₁ + Ox₂ → Ox₁ + Red₂",
      "électrons cédés = captés",
      "pas d'e⁻ dans l'équation-bilan",
    ],
  },
  exercices: [
    { question: "Qu'est-ce qu'un oxydant ?", choix: ["Une espèce qui cède des électrons", "Une espèce qui capte des électrons", "Une espèce qui capte des protons H⁺", "Une espèce qui contient de l'oxygène"], bonneReponse: 1, explication: "Un oxydant est une espèce chimique capable de capter un ou plusieurs électrons." },
    { question: "Dans la demi-équation Ox + n e⁻ ⇄ Red, le sens direct (→) est…", choix: ["une oxydation", "une réduction", "une dilution", "une neutralisation"], bonneReponse: 1, explication: "Le sens direct conduit à la formation du réducteur : c'est une réduction." },
    { question: "De quel côté place-t-on les électrons dans une demi-équation ?", choix: ["Du côté du réducteur", "Du côté de l'oxydant", "Des deux côtés", "Jamais"], bonneReponse: 1, explication: "C'est l'oxydant qui capte les électrons : ils sont de son côté (étape 4)." },
    { question: "Pour équilibrer les atomes d'oxygène d'une demi-équation, on ajoute…", choix: ["des H⁺(aq)", "des électrons", "des molécules H₂O(l)", "du dioxygène O₂"], bonneReponse: 2, explication: "Étape 2 : on équilibre les O avec H₂O(l), puis les H avec H⁺(aq) à l'étape 3." },
    { question: "Dans 2 I⁻(aq) + Cl₂(aq) → I₂(aq) + 2 Cl⁻(aq), quelle espèce est oxydée ?", choix: ["Cl₂", "I⁻", "Cl⁻", "I₂"], bonneReponse: 1, explication: "I⁻ cède des électrons (2 I⁻ → I₂ + 2 e⁻) : c'est le réducteur, il est oxydé." },
    { question: "Combien d'électrons dans la demi-équation du couple Fe³⁺(aq)/Fe²⁺(aq) ?", choix: ["1", "2", "3", "5"], bonneReponse: 0, explication: "Fe³⁺ + e⁻ ⇄ Fe²⁺ : la charge passe de +3 à +2, un seul électron." },
    { type: "vraiFaux", affirmation: "Un réducteur est une espèce chimique capable de céder un ou plusieurs électrons.", vrai: true, explication: "C'est la définition du cours." },
    { type: "vraiFaux", affirmation: "L'équation-bilan d'une réaction d'oxydoréduction fait apparaître les électrons échangés.", vrai: false, explication: "Seules les demi-équations font apparaître les électrons ; l'équation-bilan ne les fait jamais apparaître." },
    { type: "vraiFaux", affirmation: "Au cours d'une réaction d'oxydoréduction, l'oxydant Ox₂ est réduit.", vrai: true, explication: "Il capte les électrons cédés par le réducteur Red₁ : il subit une réduction." },
    { type: "vraiFaux", affirmation: "Dans MnO₄⁻ + 8 H⁺ + 5 e⁻ ⇄ Mn²⁺ + 4 H₂O, les charges sont équilibrées.", vrai: true, explication: "À gauche : −1 + 8 − 5 = +2 ; à droite : +2." },
    { type: "trou", texte: "Dans une réaction d'oxydoréduction, le nombre d'électrons cédés est ___ au nombre d'électrons captés.", reponses: ["égal"], explication: "C'est pour cela qu'on multiplie les demi-équations avant de les additionner." },
    { type: "trou", texte: "Cr₂O₇²⁻(aq) + 14 H⁺(aq) + ___ e⁻ ⇄ 2 Cr³⁺(aq) + 7 H₂O(l)", reponses: ["6", "six"], explication: "Charges : 14 − 2 = +12 à gauche contre +6 à droite, il faut 6 électrons à gauche." },
    { type: "trou", texte: "Le sens indirect (←) d'une demi-équation est une réaction d'___.", reponses: ["oxydation"], explication: "Il conduit à la formation de l'oxydant." },
    { type: "ordre", consigne: "Remets dans l'ordre les étapes pour établir une demi-équation électronique.", elements: ["Équilibrer les atomes autres que O et H", "Équilibrer les O en ajoutant H₂O(l)", "Équilibrer les H en ajoutant H⁺(aq)", "Équilibrer les charges en ajoutant des e⁻ du côté de l'oxydant"], explication: "Atomes, puis O, puis H, puis charges : c'est la méthode du cours." },
    { type: "ordre", consigne: "Remets dans l'ordre les étapes pour établir une équation d'oxydoréduction.", elements: ["Identifier les deux réactifs (Red₁ et Ox₂)", "Écrire les deux demi-équations avec le réactif à gauche", "Multiplier pour égaliser les électrons cédés et captés", "Additionner, puis simplifier si besoin"], explication: "La méthode du cours, en trois étapes, suivie de la simplification." },
    { type: "ouverte", question: "Établis la demi-équation électronique du couple SO₄²⁻(aq) / SO₂(aq).", corrige: "1. S équilibré. 2. 4 O à gauche, 2 à droite : + 2 H₂O à droite. 3. 4 H à droite : + 4 H⁺ à gauche. 4. Charges : −2 + 4 = +2 à gauche, 0 à droite : + 2 e⁻ à gauche.\nSO₄²⁻(aq) + 4 H⁺(aq) + 2 e⁻ ⇄ SO₂(aq) + 2 H₂O(l)." },
    { type: "ouverte", question: "Explique la différence entre une demi-équation électronique et une équation-bilan d'oxydoréduction.", corrige: "La demi-équation lie l'oxydant et le réducteur d'un même couple et fait apparaître les électrons échangés. L'équation-bilan met en jeu deux couples, modélise la transformation chimique et ne fait pas apparaître les électrons, car ceux cédés par le réducteur sont tous captés par l'oxydant." },
    { type: "ouverte", question: "Les ions argent Ag⁺(aq) (couple Ag⁺/Ag) réagissent avec le cuivre Cu(s) (couple Cu²⁺/Cu). Établis l'équation de la réaction.", corrige: "Cu(s) → Cu²⁺(aq) + 2 e⁻ et Ag⁺(aq) + e⁻ → Ag(s), à multiplier par 2.\nCu(s) + 2 Ag⁺(aq) → Cu²⁺(aq) + 2 Ag(s). Le cuivre est oxydé, les ions argent sont réduits." },
  ],
};
