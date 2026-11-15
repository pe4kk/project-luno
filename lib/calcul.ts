import type { Calcul } from "./types";

/**
 * Exercices de calcul à valeurs changeantes (S'exercer → Calculs, interro blanche).
 * La formule est une expression simple (« m * dv / F ») évaluée ici, sans `eval`.
 */

// ———————————————————— Évaluation d'une expression ————————————————————

type Jeton = { t: "n"; v: number } | { t: "id"; v: string } | { t: "op"; v: string };

function decouper(expr: string): Jeton[] {
  const jetons: Jeton[] = [];
  const re = /\s*(?:(\d+(?:\.\d+)?(?:e[+-]?\d+)?)|([A-Za-z_]\w*)|(\*\*|[-+*/^(),]))/gy;
  let m: RegExpExecArray | null;
  while (re.lastIndex < expr.length && (m = re.exec(expr))) {
    if (m[1]) jetons.push({ t: "n", v: Number(m[1]) });
    else if (m[2]) jetons.push({ t: "id", v: m[2] });
    else if (m[3]) jetons.push({ t: "op", v: m[3] === "**" ? "^" : m[3] });
    if (!m[0]) break;
  }
  return jetons;
}

const FONCTIONS: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt,
  abs: Math.abs,
};

/** Évalue `expr` avec les valeurs données (descente récursive : + −, × ÷, ^, unaire). */
export function evaluer(expr: string, valeurs: Record<string, number>): number {
  const j = decouper(expr);
  let i = 0;
  const voir = () => j[i];
  const prendre = () => j[i++];
  const primaire = (): number => {
    const x = prendre();
    if (!x) throw new Error("expression incomplète");
    if (x.t === "n") return x.v;
    if (x.t === "id") {
      if (FONCTIONS[x.v] && voir()?.v === "(") {
        prendre();
        const v = somme();
        prendre();
        return FONCTIONS[x.v](v);
      }
      if (!(x.v in valeurs)) throw new Error(`valeur inconnue : ${x.v}`);
      return valeurs[x.v];
    }
    if (x.v === "(") {
      const v = somme();
      prendre();
      return v;
    }
    if (x.v === "-") return -puissance();
    if (x.v === "+") return puissance();
    throw new Error(`jeton inattendu : ${x.v}`);
  };
  const puissance = (): number => {
    const b = primaire();
    if (voir()?.v === "^") {
      prendre();
      return b ** puissance();
    }
    return b;
  };
  const produit = (): number => {
    let v = puissance();
    while (voir()?.v === "*" || voir()?.v === "/") {
      const op = prendre().v;
      const w = puissance();
      v = op === "*" ? v * w : v / w;
    }
    return v;
  };
  const somme = (): number => {
    let v = produit();
    while (voir()?.v === "+" || voir()?.v === "-") {
      const op = prendre().v;
      const w = produit();
      v = op === "+" ? v + w : v - w;
    }
    return v;
  };
  return somme();
}

// ———————————————————— Nombres et chiffres significatifs ————————————————————

const decimales = (pas: number) => (String(pas).split(".")[1] ?? "").length;

/** Écrit un nombre à la française : virgule décimale. */
export const enFrancais = (x: number, d?: number) =>
  (d === undefined ? String(x) : x.toFixed(d)).replace(".", ",");

/** Nombre de chiffres significatifs d'une écriture (« 0,040 » → 2, « 7500 » → 4). */
export function chiffresSignificatifs(ecriture: string): number {
  const mantisse = ecriture
    .replace(/\s/g, "")
    .replace(/[×x·*]10\^?[⁻\-+]?[\d⁰¹²³⁴⁵⁶⁷⁸⁹]+$/i, "")
    .replace(/e[+-]?\d+$/i, "")
    .replace(/^[+\-−]/, "")
    .replace(",", ".");
  const chiffres = mantisse.replace(".", "").replace(/^0+/, "");
  return chiffres.replace(/\D/g, "").length;
}

/** Arrondit à n chiffres significatifs et l'écrit comme ton prof (puissance de 10 au-delà de 10⁴). */
export function ecrireAvecCs(x: number, n: number): string {
  if (x === 0) return "0";
  const exp = Math.floor(Math.log10(Math.abs(x)));
  // Arrondi décimal exact : (0,082 / 0,040).toPrecision(2) donnait « 2,0 » au lieu de
  // 2,1, car 2,05 est stocké 2,0499999… On corrige l'erreur de représentation d'abord.
  const pas = 10 ** (exp - n + 1);
  const m0 = Math.abs(x) / pas;
  const arrondi = Math.sign(x) * Number((Math.round(m0 * (1 + 1e-12)) * pas).toPrecision(n));
  if (exp >= 4 || (exp >= n && exp >= 2) || exp < -3) {
    const m = arrondi / 10 ** exp;
    const exposant = String(exp)
      .replace("-", "⁻")
      .replace(/\d/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(c)]);
    return `${enFrancais(m, n - 1)} × 10${exposant}`;
  }
  return enFrancais(arrondi, Math.max(0, n - 1 - exp));
}

/** Lit un nombre tapé : « 2,9 », « 7,5×10^3 », « 7.5e3 », « 7,5·10³ ». */
export function lireNombre(saisie: string): number | null {
  const sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const t = saisie
    .trim()
    .replace(/\s/g, "")
    .replace(/−/g, "-")
    .replace(/[⁻]/g, "-")
    .replace(/[⁰-⁹¹²³]/g, (c) => String(sup.indexOf(c)))
    .replace(/,/g, ".")
    .replace(/[×x·*]10\^?(-?\d+)$/i, "e$1");
  if (!/^-?\d*\.?\d+(e-?\d+)?$/i.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

// ———————————————————— Tirage d'une version d'exercice ————————————————————

export type Version = {
  valeurs: Record<string, number>;
  /** Valeurs écrites pour l'énoncé : « 68,5 ». */
  textes: Record<string, string>;
  resultat: number;
  cs: number;
};

export function tirer(c: Calcul, alea = Math.random): Version {
  const valeurs: Record<string, number> = { ...(c.constantes ?? {}) };
  const textes: Record<string, string> = {};
  for (const [k, v] of Object.entries(c.constantes ?? {})) textes[k] = enFrancais(v);
  for (const v of c.variables) {
    const n = Math.round((v.max - v.min) / v.pas);
    const x = Number((v.min + v.pas * Math.floor(alea() * (n + 1))).toFixed(decimales(v.pas)));
    valeurs[v.nom] = x;
    textes[v.nom] = enFrancais(x, decimales(v.pas));
  }
  const resultat = evaluer(c.formule, valeurs);
  // Autant de c.s. que la donnée la moins précise (sauf si l'exercice l'impose).
  const cs =
    c.cs ??
    Math.min(...c.variables.map((v) => chiffresSignificatifs(textes[v.nom])), ...Object.keys(c.constantes ?? {}).map((k) => chiffresSignificatifs(textes[k])));
  return { valeurs, textes, resultat, cs: Math.max(1, cs) };
}

/** Remplace {nom} par la valeur écrite et {resultat} par le résultat attendu. */
export function remplir(texte: string, v: Version) {
  return texte
    .replace(/\{resultat\}/g, ecrireAvecCs(v.resultat, v.cs))
    .replace(/\{(\w+)\}/g, (m, k) => v.textes[k] ?? m);
}

/**
 * Unités d'une même grandeur, avec leur valeur en unité de base. Une réponse donnée
 * dans une unité équivalente (53 cm·s⁻¹ pour 0,53 m·s⁻¹) est convertie avant d'être
 * comparée : la valeur est juste, mais on rappelle l'unité que le prof attend.
 */
const FACTEURS: Record<string, [string, number]> = {
  "m·s⁻¹": ["vitesse", 1],
  "m/s": ["vitesse", 1],
  "cm·s⁻¹": ["vitesse", 0.01],
  "km/h": ["vitesse", 1000 / 3600],
  "km·h⁻¹": ["vitesse", 1000 / 3600],
  s: ["temps", 1],
  ms: ["temps", 1e-3],
  min: ["temps", 60],
  h: ["temps", 3600],
  m: ["longueur", 1],
  cm: ["longueur", 0.01],
  mm: ["longueur", 1e-3],
  km: ["longueur", 1000],
  kg: ["masse", 1],
  g: ["masse", 1e-3],
  L: ["volume", 1],
  mL: ["volume", 1e-3],
  mol: ["quantite", 1],
  mmol: ["quantite", 1e-3],
};

/** Coefficient pour passer de `de` à `vers`, ou null si ce n'est pas la même grandeur. */
export function conversion(de: string, vers: string): number | null {
  if (de === vers) return 1;
  const a = FACTEURS[de];
  const b = FACTEURS[vers];
  if (!a || !b || a[0] !== b[0]) return null;
  return a[1] / b[1];
}

export type Verdict = {
  valeur: boolean;
  unite: boolean;
  /** Unité différente mais de la même grandeur (cm·s⁻¹ au lieu de m·s⁻¹). */
  uniteEquivalente?: boolean;
  cs: boolean;
  csDonnes: number;
  attendu: string;
};

/** Corrige une A.N. : valeur à 1 % près, unité, nombre de chiffres significatifs. */
export function verifier(c: Calcul, v: Version, saisie: string, unite: string): Verdict | null {
  const x = lireNombre(saisie);
  if (x === null) return null;
  const csDonnes = chiffresSignificatifs(saisie);
  // Juste à 1 % près, ou à l'arrondi près du dernier chiffre écrit (3,1 pour 3,06).
  const dernier = x === 0 ? 0 : 10 ** (Math.floor(Math.log10(Math.abs(x))) - Math.max(1, csDonnes) + 1);
  // Valeur ramenée dans l'unité attendue : 0,53 km/h n'est pas 0,53 m·s⁻¹.
  const k = unite ? conversion(unite, c.unite) : 1;
  const valeur =
    k !== null &&
    Math.abs(x * k - v.resultat) <= Math.max(Math.abs(v.resultat) * 0.01, (dernier * k) / 2) + 1e-12;
  return {
    valeur,
    unite: unite === c.unite,
    uniteEquivalente: unite !== c.unite && k !== null,
    cs: csDonnes === v.cs,
    csDonnes,
    attendu: `${c.inconnue} = ${ecrireAvecCs(v.resultat, v.cs)} ${c.unite} (${v.cs} c.s)`,
  };
}
