import type { Schema } from "@/lib/types";

/**
 * Schémas explicatifs des chapitres de physique, redessinés d'après les schémas des
 * cours et des fiches méthode du prof. Coordonnées : x vers la droite, y vers le bas.
 * Conventions de couleur : vitesses en encre, variations de vitesse en terracotta
 * (accent), forces en cuivre, constructions et repères en gris doux.
 */

/** Relativité du mouvement : la balle lâchée dans un train (chap. 9). */
export const RELATIVITE: Schema = {
  l: 330,
  h: 160,
  legende: "La même chute, vue depuis deux référentiels différents.",
  elements: [
    { f: "rect", de: [15, 20], a: [145, 112], ton: "doux" },
    { f: "trait", points: [[80, 32], [80, 104]], pointille: true, fin: true },
    { f: "point", en: [80, 34], forme: "croix", ton: "accent" },
    { f: "point", en: [80, 46], forme: "croix", ton: "accent" },
    { f: "point", en: [80, 62], forme: "croix", ton: "accent" },
    { f: "point", en: [80, 81], forme: "croix", ton: "accent" },
    { f: "point", en: [80, 104], forme: "croix", ton: "accent" },
    { f: "sol", de: [10, 120], a: [150, 120] },
    { f: "texte", en: [80, 146], t: "vue du train : tout droit", main: true },
    { f: "trait", points: [[185, 34], [205, 37], [228, 47], [252, 65], [278, 104]], courbe: true, pointille: true, fin: true },
    { f: "point", en: [185, 34], forme: "croix", ton: "accent" },
    { f: "point", en: [205, 37], forme: "croix", ton: "accent" },
    { f: "point", en: [228, 47], forme: "croix", ton: "accent" },
    { f: "point", en: [252, 65], forme: "croix", ton: "accent" },
    { f: "point", en: [278, 104], forme: "croix", ton: "accent" },
    { f: "sol", de: [175, 120], a: [320, 120] },
    { f: "fleche", de: [190, 12], a: [245, 12], ton: "doux", nom: "sens du train", pos: [300, 16] },
    { f: "texte", en: [250, 146], t: "vue du quai : une courbe", main: true },
  ],
};

/** Coordonnées d'un point dans un repère (chap. 9). */
export const COORDONNEES: Schema = {
  l: 320,
  h: 180,
  elements: [
    { f: "axes", origine: [40, 155], x: 265, y: 140, noms: ["x (m)", "y (m)"] },
    { f: "trait", points: [[60, 128], [95, 101], [130, 83], [165, 75], [200, 77], [235, 90], [270, 113]], courbe: true, pointille: true, fin: true },
    { f: "trait", points: [[130, 83], [130, 155]], pointille: true, ton: "accent", fin: true },
    { f: "trait", points: [[40, 83], [130, 83]], pointille: true, ton: "accent", fin: true },
    { f: "point", en: [60, 128], forme: "croix", nom: "M(t₀)", pos: [62, 144] },
    { f: "point", en: [95, 101], forme: "croix" },
    { f: "point", en: [130, 83], forme: "croix", nom: "M(t₂)", ton: "accent", pos: [130, 70] },
    { f: "point", en: [165, 75], forme: "croix" },
    { f: "point", en: [200, 77], forme: "croix" },
    { f: "point", en: [235, 90], forme: "croix" },
    { f: "point", en: [270, 113], forme: "croix", nom: "M(t₆)", pos: [280, 130] },
    { f: "texte", en: [130, 170], t: "x₂", ton: "accent" },
    { f: "texte", en: [33, 87], t: "y₂", ton: "accent", ancre: "end" },
  ],
};

/** Les trois types de trajectoires (chap. 9). */
export const TRAJECTOIRES: Schema = {
  l: 330,
  h: 120,
  elements: [
    { f: "trait", points: [[12, 55], [96, 55]], fin: true },
    { f: "point", en: [14, 55] },
    { f: "point", en: [34, 55] },
    { f: "point", en: [54, 55] },
    { f: "point", en: [74, 55] },
    { f: "fleche", de: [78, 55], a: [100, 55], ton: "doux" },
    { f: "texte", en: [56, 108], t: "rectiligne", main: true },
    { f: "cercle", centre: [165, 55], r: 36, ton: "doux" },
    { f: "point", en: [165, 19] },
    { f: "point", en: [201, 55] },
    { f: "point", en: [165, 91] },
    { f: "point", en: [129, 55] },
    { f: "point", en: [190.5, 29.5] },
    { f: "point", en: [190.5, 80.5] },
    { f: "point", en: [139.5, 80.5] },
    { f: "point", en: [139.5, 29.5] },
    { f: "texte", en: [165, 108], t: "circulaire", main: true },
    { f: "trait", points: [[232, 82], [252, 50], [276, 42], [296, 56], [318, 40]], courbe: true, ton: "doux" },
    { f: "point", en: [232, 82] },
    { f: "point", en: [252, 50] },
    { f: "point", en: [276, 42] },
    { f: "point", en: [296, 56] },
    { f: "texte", en: [275, 108], t: "curviligne", main: true },
  ],
};

/** Vecteur vitesse moyenne et vecteur déplacement (chap. 9). */
export const VITESSE_MOYENNE: Schema = {
  l: 320,
  h: 140,
  elements: [
    { f: "trait", points: [[15, 105], [80, 62], [150, 55], [222, 88], [300, 70]], courbe: true, ton: "doux" },
    { f: "fleche", de: [80, 62], a: [222, 88], ton: "encre", nom: "MM'⃗", pos: [160, 99] },
    { f: "fleche", de: [80, 62], a: [134, 72], ton: "accent", nom: "v⃗", pos: [100, 90] },
    { f: "point", en: [80, 62], forme: "croix", nom: "M", pos: [74, 48] },
    { f: "point", en: [222, 88], forme: "croix", nom: "M'", pos: [234, 78] },
    { f: "trait", points: [[80, 118], [222, 118]], fin: true },
    { f: "texte", en: [151, 134], t: "parcouru en Δt", main: true },
  ],
};

/** Vecteur vitesse instantanée, porté par [MᵢMᵢ₊₁] (chap. 9). */
export const VITESSE_INSTANTANEE: Schema = {
  l: 320,
  h: 135,
  elements: [
    { f: "trait", points: [[25, 112], [95, 64], [165, 47], [235, 60], [298, 104]], courbe: true, ton: "doux" },
    { f: "trait", points: [[95, 64], [165, 47]], pointille: true, fin: true },
    { f: "fleche", de: [95, 64], a: [158, 48.7], ton: "accent", nom: "v⃗ᵢ", pos: [118, 40] },
    { f: "point", en: [25, 112], forme: "croix" },
    { f: "point", en: [95, 64], forme: "croix", nom: "Mᵢ", pos: [90, 84] },
    { f: "point", en: [165, 47], forme: "croix", nom: "Mᵢ₊₁", pos: [178, 36] },
    { f: "point", en: [235, 60], forme: "croix" },
    { f: "point", en: [298, 104], forme: "croix" },
    { f: "texte", en: [215, 120], t: "même direction que [MᵢMᵢ₊₁]", main: true },
  ],
};

/** Uniforme, ralenti, accéléré : espacement des points et longueur des vecteurs (chap. 9). */
export const CARACTERISER: Schema = {
  l: 330,
  h: 170,
  elements: [
    { f: "texte", en: [15, 16], t: "uniforme : v⃗ ne varie pas", ancre: "start", main: true, ton: "encre" },
    { f: "point", en: [20, 40] },
    { f: "point", en: [105, 40] },
    { f: "point", en: [190, 40] },
    { f: "point", en: [275, 40] },
    { f: "fleche", de: [20, 40], a: [75, 40], ton: "encre" },
    { f: "fleche", de: [105, 40], a: [160, 40], ton: "encre" },
    { f: "fleche", de: [190, 40], a: [245, 40], ton: "encre" },
    { f: "texte", en: [15, 72], t: "ralenti : v⃗ diminue, points de plus en plus serrés", ancre: "start", main: true, ton: "encre" },
    { f: "point", en: [20, 96] },
    { f: "point", en: [130, 96] },
    { f: "point", en: [210, 96] },
    { f: "point", en: [260, 96] },
    { f: "fleche", de: [20, 96], a: [90, 96], ton: "encre", nom: "v⃗₁", pos: [55, 116] },
    { f: "fleche", de: [130, 96], a: [178, 96], ton: "encre", nom: "v⃗₂", pos: [154, 116] },
    { f: "fleche", de: [210, 96], a: [238, 96], ton: "encre", nom: "v⃗₃", pos: [224, 116] },
    { f: "texte", en: [15, 136], t: "accéléré : v⃗ augmente, points de plus en plus espacés", ancre: "start", main: true, ton: "encre" },
    { f: "point", en: [20, 158] },
    { f: "point", en: [60, 158] },
    { f: "point", en: [130, 158] },
    { f: "point", en: [235, 158] },
    { f: "fleche", de: [20, 158], a: [46, 158], ton: "encre" },
    { f: "fleche", de: [60, 158], a: [104, 158], ton: "encre" },
    { f: "fleche", de: [130, 158], a: [198, 158], ton: "encre" },
  ],
};

/** Vitesse par encadrement : v⃗₂ parallèle à [M₁M₃] (chap. 11 et fiche Euler). */
export const ENCADREMENT: Schema = {
  l: 320,
  h: 140,
  elements: [
    { f: "trait", points: [[30, 110], [95, 62], [165, 45], [235, 60], [295, 105]], courbe: true, ton: "doux" },
    { f: "trait", points: [[30, 110], [165, 45]], pointille: true, fin: true },
    { f: "fleche", de: [95, 62], a: [158, 31.6], ton: "accent", nom: "v⃗₂", pos: [118, 30] },
    { f: "point", en: [30, 110], forme: "croix", nom: "M₁", pos: [26, 128] },
    { f: "point", en: [95, 62], forme: "croix", nom: "M₂", pos: [98, 82] },
    { f: "point", en: [165, 45], forme: "croix", nom: "M₃", pos: [178, 36] },
    { f: "point", en: [235, 60], forme: "croix", nom: "M₄", pos: [246, 52] },
    { f: "point", en: [295, 105], forme: "croix" },
    { f: "texte", en: [215, 128], t: "v⃗₂ parallèle à [M₁M₃]", main: true },
  ],
};

/** Méthode d'Euler : coordonnées de M₁ et M₃ pour calculer vₓ₂ et vᵧ₂. */
export const EULER: Schema = {
  l: 320,
  h: 180,
  elements: [
    { f: "axes", origine: [40, 155], x: 265, y: 140 },
    { f: "trait", points: [[70, 118], [140, 76], [235, 62], [290, 80]], courbe: true, ton: "doux" },
    { f: "trait", points: [[70, 118], [70, 155]], pointille: true, ton: "accent", fin: true },
    { f: "trait", points: [[235, 62], [235, 155]], pointille: true, ton: "accent", fin: true },
    { f: "trait", points: [[40, 118], [70, 118]], pointille: true, ton: "accent", fin: true },
    { f: "trait", points: [[40, 62], [235, 62]], pointille: true, ton: "accent", fin: true },
    { f: "trait", points: [[70, 118], [235, 62]], pointille: true, fin: true },
    { f: "fleche", de: [140, 76], a: [187.4, 60.2], ton: "encre", nom: "v⃗₂", pos: [158, 52] },
    { f: "point", en: [70, 118], forme: "croix", nom: "M₁", pos: [82, 134] },
    { f: "point", en: [140, 76], forme: "croix", nom: "M₂", pos: [134, 98] },
    { f: "point", en: [235, 62], forme: "croix", nom: "M₃", pos: [252, 54] },
    { f: "texte", en: [70, 170], t: "x₁", ton: "accent" },
    { f: "texte", en: [235, 170], t: "x₃", ton: "accent" },
    { f: "texte", en: [33, 122], t: "y₁", ton: "accent", ancre: "end" },
    { f: "texte", en: [33, 66], t: "y₃", ton: "accent", ancre: "end" },
  ],
};

/** Δv⃗ en mouvement rectiligne : accéléré ou ralenti (chap. 11). */
export const VARIATION_RECTILIGNE: Schema = {
  l: 330,
  h: 150,
  elements: [
    { f: "texte", en: [15, 16], t: "accéléré : Δv⃗ dans le sens du mouvement", ancre: "start", main: true, ton: "encre" },
    { f: "point", en: [25, 46], nom: "M₂", pos: [25, 66] },
    { f: "point", en: [135, 46], nom: "M₃", pos: [135, 66] },
    { f: "point", en: [215, 46], nom: "M₄", pos: [215, 66] },
    { f: "fleche", de: [25, 46], a: [70, 46], ton: "encre", nom: "v⃗₂", pos: [50, 36] },
    { f: "fleche", de: [215, 46], a: [300, 46], ton: "encre", nom: "v⃗₄", pos: [258, 36] },
    { f: "fleche", de: [135, 46], a: [175, 46], ton: "accent", nom: "Δv⃗₃", pos: [158, 36] },
    { f: "texte", en: [15, 92], t: "ralenti : Δv⃗ dans le sens opposé", ancre: "start", main: true, ton: "encre" },
    { f: "point", en: [25, 122], nom: "M₂", pos: [25, 142] },
    { f: "point", en: [155, 122], nom: "M₃", pos: [155, 142] },
    { f: "point", en: [230, 122], nom: "M₄", pos: [230, 142] },
    { f: "fleche", de: [25, 122], a: [105, 122], ton: "encre", nom: "v⃗₂", pos: [65, 112] },
    { f: "fleche", de: [230, 122], a: [272, 122], ton: "encre", nom: "v⃗₄", pos: [251, 112] },
    { f: "fleche", de: [155, 122], a: [118, 122], ton: "accent", nom: "Δv⃗₃", pos: [137, 112] },
  ],
};

/** Construire Δv⃗₃ = v⃗₄ − v⃗₂ : la Lune autour de la Terre (fiche méthode). */
export const CONSTRUCTION_DELTA_V: Schema = {
  l: 330,
  h: 190,
  legende: "On reporte v⃗₄ en M₃, on lui ajoute −v⃗₂, puis on relie M₃ à l'extrémité : c'est Δv⃗₃.",
  elements: [
    { f: "trait", points: [[69.7, 99], [110, 58.7], [165, 44], [220, 58.7], [260.3, 99]], courbe: true, ton: "doux" },
    { f: "cercle", centre: [165, 160], r: 13, ton: "cuivre", plein: true },
    { f: "texte", en: [165, 188], t: "Terre", ton: "doux" },
    { f: "fleche", de: [110, 58.7], a: [157.6, 31.2], ton: "encre", nom: "v⃗₂", pos: [124, 30] },
    { f: "fleche", de: [220, 58.7], a: [267.6, 86.2], ton: "encre", nom: "v⃗₄", pos: [256, 66] },
    { f: "fleche", de: [165, 44], a: [212.6, 71.5], ton: "encre", pointille: true },
    { f: "fleche", de: [212.6, 71.5], a: [165, 99], ton: "doux", nom: "−v⃗₂", pos: [204, 98] },
    { f: "fleche", de: [165, 44], a: [165, 99], ton: "accent", nom: "Δv⃗₃", pos: [143, 80] },
    { f: "point", en: [110, 58.7], forme: "croix", nom: "M₂", pos: [96, 76] },
    { f: "point", en: [165, 44], forme: "croix", nom: "M₃", pos: [182, 38] },
    { f: "point", en: [220, 58.7], forme: "croix", nom: "M₄", pos: [214, 44] },
    { f: "texte", en: [196, 150], t: "Δv⃗₃ pointe vers la Terre", ancre: "start", main: true },
  ],
};

/** 2e loi : ΣF⃗ et Δv⃗ ont même direction et même sens (chap. 11). */
export const DEUXIEME_LOI: Schema = {
  l: 320,
  h: 150,
  elements: [
    { f: "trait", points: [[30, 120], [90, 62], [160, 42], [230, 55], [295, 100]], courbe: true, ton: "doux" },
    { f: "fleche", de: [160, 42], a: [160, 128], ton: "cuivre", nom: "ΣF⃗", pos: [182, 116] },
    { f: "fleche", de: [160, 42], a: [160, 86], ton: "accent", nom: "Δv⃗", pos: [140, 74] },
    { f: "point", en: [90, 62], forme: "croix" },
    { f: "point", en: [160, 42], forme: "croix", nom: "M₃", pos: [160, 28] },
    { f: "point", en: [230, 55], forme: "croix" },
    { f: "texte", en: [235, 140], t: "même direction, même sens", main: true },
  ],
};

/** Forces sur le skieur tiré par un téléski, et leur somme (chap. 11). */
export const SKIEUR: Schema = {
  l: 320,
  h: 175,
  elements: [
    { f: "fleche", de: [95, 90], a: [95, 160], ton: "cuivre", nom: "P⃗", pos: [108, 150] },
    { f: "fleche", de: [95, 90], a: [80, 48], ton: "cuivre", nom: "R⃗", pos: [72, 46] },
    { f: "fleche", de: [95, 90], a: [155, 35], ton: "cuivre", nom: "T⃗", pos: [162, 34] },
    { f: "point", en: [95, 90], nom: "M", pos: [82, 100] },
    { f: "texte", en: [95, 174], t: "les forces sur le skieur", main: true },
    { f: "fleche", de: [225, 105], a: [225, 147], ton: "cuivre", pointille: true, nom: "P⃗", pos: [214, 132] },
    { f: "fleche", de: [225, 147], a: [216, 122], ton: "cuivre", pointille: true },
    { f: "fleche", de: [216, 122], a: [252, 89], ton: "cuivre", pointille: true, nom: "T⃗", pos: [226, 98] },
    { f: "fleche", de: [225, 105], a: [252, 89], ton: "accent", nom: "ΣF⃗", pos: [268, 90] },
    { f: "point", en: [225, 105] },
    { f: "texte", en: [240, 170], t: "bout à bout : leur somme", main: true },
  ],
};

/** 3e loi : la fusée et les gaz (chap. 11). */
export const FUSEE: Schema = {
  l: 320,
  h: 190,
  elements: [
    { f: "trait", points: [[150, 112], [150, 50], [160, 30], [170, 50], [170, 112]], ton: "encre", plein: true },
    { f: "cercle", centre: [152, 128], r: 9, ton: "doux", plein: true },
    { f: "cercle", centre: [168, 132], r: 10, ton: "doux", plein: true },
    { f: "cercle", centre: [160, 146], r: 11, ton: "doux", plein: true },
    { f: "fleche", de: [190, 92], a: [190, 22], ton: "cuivre", nom: "F⃗_gaz/fusée", pos: [234, 40] },
    { f: "fleche", de: [190, 118], a: [190, 182], ton: "accent", nom: "F⃗_fusée/gaz", pos: [234, 172] },
    { f: "texte", en: [118, 60], t: "même valeur,", ancre: "end", main: true },
    { f: "texte", en: [118, 80], t: "sens opposés", ancre: "end", main: true },
  ],
};

/** Réaction normale : bille posée sur une table (fiche des forces). */
export const REACTION: Schema = {
  l: 320,
  h: 170,
  elements: [
    { f: "sol", de: [70, 100], a: [250, 100] },
    { f: "cercle", centre: [160, 86], r: 14, ton: "doux", plein: true },
    { f: "fleche", de: [160, 86], a: [160, 30], ton: "cuivre", nom: "R⃗_N", pos: [180, 42] },
    { f: "fleche", de: [160, 86], a: [160, 142], ton: "cuivre", nom: "P⃗", pos: [175, 140] },
    { f: "point", en: [160, 86] },
    { f: "texte", en: [160, 164], t: "P⃗ + R⃗_N = 0⃗ : elles se compensent", main: true },
  ],
};

/** Tension d'un fil (fiche des forces). */
export const TENSION: Schema = {
  l: 320,
  h: 170,
  elements: [
    { f: "sol", de: [110, 18], a: [210, 18] },
    { f: "trait", points: [[160, 18], [160, 100]], ton: "encre" },
    { f: "cercle", centre: [160, 108], r: 9, ton: "doux", plein: true },
    { f: "fleche", de: [160, 108], a: [160, 58], ton: "cuivre", nom: "T⃗", pos: [174, 72] },
    { f: "fleche", de: [160, 108], a: [160, 158], ton: "cuivre", nom: "P⃗", pos: [174, 154] },
    { f: "point", en: [160, 108] },
    { f: "texte", en: [226, 48], t: "le long du fil,", ancre: "start", main: true },
    { f: "texte", en: [226, 66], t: "vers l'attache", ancre: "start", main: true },
  ],
};

/** Gravitation : la Lune attirée par la Terre (fiche des forces). */
export const GRAVITATION: Schema = {
  l: 320,
  h: 150,
  elements: [
    { f: "cercle", centre: [80, 85], r: 40, ton: "cuivre", plein: true },
    { f: "texte", en: [80, 90], t: "Terre", ton: "encre" },
    { f: "cercle", centre: [255, 62], r: 11, ton: "doux", plein: true },
    { f: "texte", en: [255, 40], t: "Lune", ton: "doux" },
    { f: "fleche", de: [255, 62], a: [180, 72], ton: "cuivre", nom: "F⃗_g", pos: [214, 56] },
    { f: "point", en: [255, 62] },
    { f: "texte", en: [222, 128], t: "dirigée vers le corps attracteur", main: true },
  ],
};

/** Poussée d'Archimède (fiche des forces). */
export const ARCHIMEDE: Schema = {
  l: 320,
  h: 180,
  elements: [
    { f: "rect", de: [40, 58], a: [280, 165], ton: "doux", plein: true, arrondi: 2 },
    { f: "rect", de: [135, 88], a: [185, 132], ton: "encre", plein: true, arrondi: 3 },
    { f: "fleche", de: [160, 110], a: [160, 46], ton: "accent", nom: "Π⃗_A", pos: [178, 52] },
    { f: "fleche", de: [160, 110], a: [160, 160], ton: "cuivre", nom: "P⃗", pos: [174, 156] },
    { f: "point", en: [160, 110] },
    { f: "texte", en: [270, 80], t: "fluide", ancre: "end", ton: "doux" },
    { f: "texte", en: [48, 30], t: "verticale, vers le haut", ancre: "start", main: true },
  ],
};

/** Frottement fluide pendant une chute (fiche des forces). */
export const FROTTEMENT: Schema = {
  l: 320,
  h: 175,
  elements: [
    { f: "trait", points: [[110, 12], [110, 60]], pointille: true, fin: true },
    { f: "cercle", centre: [110, 80], r: 10, ton: "doux", plein: true },
    { f: "fleche", de: [110, 80], a: [110, 40], ton: "accent", nom: "f⃗", pos: [124, 48] },
    { f: "fleche", de: [110, 80], a: [110, 150], ton: "cuivre", nom: "P⃗", pos: [124, 146] },
    { f: "point", en: [110, 80] },
    { f: "fleche", de: [60, 60], a: [60, 120], ton: "doux", nom: "chute", pos: [40, 140] },
    { f: "texte", en: [150, 82], t: "f⃗ s'oppose au mouvement ;", ancre: "start", main: true },
    { f: "texte", en: [150, 102], t: "si f = P, la vitesse", ancre: "start", main: true },
    { f: "texte", en: [150, 122], t: "devient constante (limite)", ancre: "start", main: true },
  ],
};

/** Force de rappel d'un ressort (fiche des forces). */
export const RESSORT: Schema = {
  l: 320,
  h: 165,
  elements: [
    { f: "trait", points: [[30, 20], [30, 140]], ton: "doux" },
    { f: "ressort", de: [30, 50], a: [150, 50], spires: 6 },
    { f: "rect", de: [150, 38], a: [174, 62], ton: "encre", plein: true },
    { f: "texte", en: [190, 55], t: "au repos", ancre: "start", main: true },
    { f: "ressort", de: [30, 110], a: [210, 110], spires: 6 },
    { f: "rect", de: [210, 98], a: [234, 122], ton: "encre", plein: true },
    { f: "fleche", de: [210, 88], a: [168, 88], ton: "cuivre", nom: "F⃗_r", pos: [189, 78] },
    { f: "trait", points: [[150, 30], [150, 140]], pointille: true, fin: true },
    { f: "trait", points: [[210, 70], [210, 140]], pointille: true, fin: true },
    { f: "trait", points: [[150, 136], [210, 136]], ton: "accent" },
    { f: "texte", en: [180, 156], t: "Δl", ton: "accent" },
    { f: "texte", en: [250, 115], t: "étiré", ancre: "start", main: true },
  ],
};

/** Force électrostatique de Coulomb (fiche des forces). */
export const COULOMB: Schema = {
  l: 330,
  h: 125,
  elements: [
    { f: "cercle", centre: [45, 60], r: 11, ton: "accent", plein: true },
    { f: "texte", en: [45, 65], t: "+", ton: "accent" },
    { f: "cercle", centre: [130, 60], r: 11, ton: "doux", plein: true },
    { f: "texte", en: [130, 65], t: "−", ton: "encre" },
    { f: "fleche", de: [57, 60], a: [86, 60], ton: "cuivre" },
    { f: "fleche", de: [118, 60], a: [89, 60], ton: "cuivre" },
    { f: "texte", en: [88, 110], t: "signes opposés : attraction", main: true },
    { f: "cercle", centre: [215, 60], r: 11, ton: "accent", plein: true },
    { f: "texte", en: [215, 65], t: "+", ton: "accent" },
    { f: "cercle", centre: [285, 60], r: 11, ton: "accent", plein: true },
    { f: "texte", en: [285, 65], t: "+", ton: "accent" },
    { f: "fleche", de: [203, 60], a: [176, 60], ton: "cuivre" },
    { f: "fleche", de: [297, 60], a: [324, 60], ton: "cuivre" },
    { f: "texte", en: [250, 110], t: "même signe : répulsion", main: true },
  ],
};

/** Homme-canon : bilan des forces et axe de projection (fiche « Rédiger comme ton prof »). */
export const HOMME_CANON: Schema = {
  l: 320,
  h: 180,
  elements: [
    { f: "fleche", de: [90, 165], a: [90, 18], ton: "doux", nom: "y", pos: [80, 26] },
    { f: "texte", en: [84, 158], t: "O", ancre: "end" },
    { f: "sol", de: [60, 165], a: [260, 165] },
    { f: "point", en: [180, 100], nom: "M", pos: [166, 104] },
    { f: "fleche", de: [180, 100], a: [180, 38], ton: "encre", nom: "v⃗₀", pos: [196, 50] },
    { f: "fleche", de: [180, 100], a: [180, 148], ton: "cuivre", nom: "P⃗", pos: [194, 146] },
    { f: "texte", en: [212, 90], t: "vertical,", ancre: "start", main: true },
    { f: "texte", en: [212, 108], t: "vers le bas", ancre: "start", main: true },
    { f: "texte", en: [104, 24], t: "on projette sur (Oy)", ancre: "start", main: true },
  ],
};
