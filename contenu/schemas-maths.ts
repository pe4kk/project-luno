import type { ElementSchema, PointSchema, Schema, TonSchema } from "@/lib/types";

/**
 * Schémas du chapitre de dérivation, redessinés d'après les figures du cours.
 * Les courbes sont calculées à partir de leur fonction, dans un repère dont on choisit
 * l'origine et l'unité (en points du dessin) : elles sont donc exactes.
 * Couleurs : courbe en encre, sécantes en gris doux, tangente en terracotta (accent).
 */

type Repere = { ox: number; oy: number; u: number };
const pt = (r: Repere, x: number, y: number): PointSchema => [
  Math.round((r.ox + r.u * x) * 10) / 10,
  Math.round((r.oy - r.u * y) * 10) / 10,
];
const courbe = (
  r: Repere,
  f: (x: number) => number,
  de: number,
  a: number,
  n = 24,
): ElementSchema => ({
  f: "trait",
  courbe: true,
  ton: "encre",
  points: Array.from({ length: n + 1 }, (_, i) => {
    const x = de + ((a - de) * i) / n;
    return pt(r, x, f(x));
  }),
});
/** Droite passant par (x0 ; y0) de pente m, tracée de x = de à x = a. */
const droite = (
  r: Repere,
  x0: number,
  y0: number,
  m: number,
  de: number,
  a: number,
  ton: TonSchema,
  pointille = false,
): ElementSchema => ({
  f: "trait",
  ton,
  pointille,
  points: [pt(r, de, y0 + m * (de - x0)), pt(r, a, y0 + m * (a - x0))],
});

// Une courbe convexe, comme sur les figures du cours.
const R: Repere = { ox: 52, oy: 168, u: 46 };
const f = (x: number) => 0.13 * x * x + 0.35;
const fp = (x: number) => 0.26 * x;
const A = 1.4;
const M = 4.1;

/** Taux de variation : pente de la sécante (AM). */
export const SECANTE: Schema = {
  l: 330,
  h: 200,
  elements: [
    { f: "axes", origine: [R.ox, R.oy], x: 270, y: 160 },
    courbe(R, f, -0.6, 4.7),
    droite(R, A, f(A), (f(M) - f(A)) / (M - A), 0.4, 4.7, "accent"),
    { f: "trait", points: [pt(R, A, 0), pt(R, A, f(A)), pt(R, 0, f(A))], pointille: true, fin: true },
    { f: "trait", points: [pt(R, M, 0), pt(R, M, f(M)), pt(R, 0, f(M))], pointille: true, fin: true },
    { f: "point", en: pt(R, A, f(A)), nom: "A", pos: [pt(R, A, f(A))[0] - 4, pt(R, A, f(A))[1] - 10] },
    { f: "point", en: pt(R, M, f(M)), nom: "M", pos: [pt(R, M, f(M))[0] - 14, pt(R, M, f(M))[1] - 6] },
    { f: "texte", en: [pt(R, A, 0)[0], R.oy + 16], t: "a" },
    { f: "texte", en: [pt(R, M, 0)[0], R.oy + 16], t: "a + h" },
    { f: "texte", en: [R.ox - 6, pt(R, 0, f(A))[1] + 4], t: "f(a)", ancre: "end", taille: 12 },
    { f: "texte", en: [R.ox - 6, pt(R, 0, f(M))[1] + 4], t: "f(a + h)", ancre: "end", taille: 12 },
    { f: "texte", en: [318, 152], t: "pente de (AM) = t(h)", ancre: "end", main: true },
  ],
};

/** Quand h tend vers 0, M glisse vers A et la sécante devient la tangente. */
export const TANGENTE_LIMITE: Schema = {
  l: 330,
  h: 200,
  legende: "Les sécantes (AM) tournent autour de A et se rapprochent de la tangente, de pente f'(a).",
  elements: [
    { f: "axes", origine: [R.ox, R.oy], x: 270, y: 160 },
    courbe(R, f, -0.6, 4.8),
    ...[4.4, 3.5, 2.6].flatMap((m): ElementSchema[] => [
      droite(R, A, f(A), (f(m) - f(A)) / (m - A), 0, 4.8, "doux", true),
      { f: "point", en: pt(R, m, f(m)), ton: "doux" },
    ]),
    droite(R, A, f(A), fp(A), -0.3, 5.4, "accent"),
    { f: "point", en: pt(R, A, f(A)), nom: "A", pos: [pt(R, A, f(A))[0] - 4, pt(R, A, f(A))[1] - 10] },
    { f: "texte", en: [pt(R, 4.4, f(4.4))[0] - 10, pt(R, 4.4, f(4.4))[1] - 6], t: "M", ton: "doux", taille: 12 },
    { f: "texte", en: [300, 128], t: "tangente", ton: "accent", ancre: "end", taille: 12 },
    { f: "texte", en: [R.ox + 12, 26], t: "h → 0 : M glisse vers A", ancre: "start", main: true },
  ],
};

/** Lire f'(a) : coefficient directeur de la tangente, avec le petit triangle « 1 ; f'(a) ». */
const R2: Repere = { ox: 40, oy: 165, u: 44 };
const g = (x: number) => 0.22 * (x - 1.2) ** 3 - 0.6 * (x - 1.2) + 1.6;
const gp = (x: number) => 0.66 * (x - 1.2) ** 2 - 0.6;
const B = 2.4;
export const TANGENTE_EQUATION: Schema = {
  l: 330,
  h: 195,
  elements: [
    { f: "axes", origine: [R2.ox, R2.oy], x: 280, y: 155 },
    courbe(R2, g, -0.4, 3.65),
    droite(R2, B, g(B), gp(B), 0.3, 5.6, "accent"),
    { f: "trait", points: [pt(R2, B, g(B)), pt(R2, B + 1, g(B))], ton: "doux" },
    { f: "trait", points: [pt(R2, B + 1, g(B)), pt(R2, B + 1, g(B) + gp(B))], ton: "cuivre" },
    { f: "texte", en: [pt(R2, B + 0.5, 0)[0], pt(R2, 0, g(B))[1] + 15], t: "1", ton: "doux", taille: 12 },
    { f: "texte", en: [pt(R2, B + 1, 0)[0] + 6, pt(R2, 0, g(B) + gp(B) / 2)[1] + 4], t: "f'(a)", ton: "cuivre", ancre: "start", taille: 12 },
    { f: "texte", en: [300, pt(R2, 5.6, g(B) + gp(B) * (5.6 - B))[1] + 18], t: "T", ton: "accent", taille: 12 },
    { f: "trait", points: [pt(R2, B, 0), pt(R2, B, g(B)), pt(R2, 0, g(B))], pointille: true, fin: true },
    { f: "point", en: pt(R2, B, g(B)), nom: "A", pos: [pt(R2, B, g(B))[0] - 10, pt(R2, B, g(B))[1] - 8] },
    { f: "texte", en: [pt(R2, B, 0)[0], R2.oy + 16], t: "a" },
    { f: "texte", en: [R2.ox - 6, pt(R2, 0, g(B))[1] + 4], t: "f(a)", ancre: "end", taille: 12 },
    { f: "texte", en: [322, 152], t: "T : y = f(a) + f'(a)(x − a)", ancre: "end", main: true },
  ],
};

/** La racine carrée : tangente verticale en 0, donc pas de nombre dérivé. */
const R3: Repere = { ox: 50, oy: 160, u: 42 };
export const RACINE: Schema = {
  l: 330,
  h: 185,
  elements: [
    { f: "axes", origine: [R3.ox, R3.oy], x: 265, y: 148 },
    courbe(R3, (x) => Math.sqrt(x), 0, 6, 40),
    { f: "trait", points: [pt(R3, 0, -0.3), pt(R3, 0, 3.2)], ton: "accent", pointille: true },
    { f: "texte", en: [R3.ox + 10, 32], t: "en 0, la courbe part à la verticale :", ancre: "start", main: true },
    { f: "texte", en: [R3.ox + 10, 52], t: "t(h) = 1/√h grandit sans limite", ancre: "start", main: true },
    { f: "texte", en: [pt(R3, 5.3, 0)[0], pt(R3, 5.3, Math.sqrt(5.3))[1] + 20], t: "y = √x", taille: 12 },
  ],
};

/** Valeur absolue : deux demi-droites, et une pointe en 0 où elle n'est pas dérivable. */
const R4: Repere = { ox: 165, oy: 160, u: 42 };
export const VALEUR_ABSOLUE: Schema = {
  l: 330,
  h: 195,
  elements: [
    { f: "trait", points: [[25, R4.oy], [315, R4.oy]], ton: "doux", fin: true },
    { f: "trait", points: [[R4.ox, R4.oy + 6], [R4.ox, 18]], ton: "doux", fin: true },
    { f: "trait", points: [pt(R4, -3.2, 3.2), pt(R4, 0, 0), pt(R4, 3.2, 3.2)], ton: "encre" },
    { f: "point", en: pt(R4, 0, 0), ton: "accent" },
    { f: "texte", en: [R4.ox - 10, R4.oy + 14], t: "O", ton: "doux", taille: 12 },
    { f: "texte", en: [pt(R4, -2.4, 0)[0], pt(R4, 0, 1.2)[1]], t: "y = −x", taille: 12 },
    { f: "texte", en: [pt(R4, -2.4, 0)[0], pt(R4, 0, 1.2)[1] + 16], t: "f'(x) = −1", ton: "accent", taille: 12 },
    { f: "texte", en: [pt(R4, 2.4, 0)[0], pt(R4, 0, 1.2)[1]], t: "y = x", taille: 12 },
    { f: "texte", en: [pt(R4, 2.4, 0)[0], pt(R4, 0, 1.2)[1] + 16], t: "f'(x) = 1", ton: "accent", taille: 12 },
    { f: "texte", en: [R4.ox, 186], t: "une pointe en 0 : pas de tangente", main: true },
  ],
};
