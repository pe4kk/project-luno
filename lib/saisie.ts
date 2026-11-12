/**
 * Saisie de formules au clavier du téléphone (S'exercer : problèmes, calculs, interro).
 *
 * Raccourcis remplacés pendant la frappe : « del » → Δ, « sig » → Σ, « -> » → →,
 * « => » → ⇒, « * » → ·, « ^2 » → ², « ^-1 » → ⁻¹, « sqrt » → √, « ~= » → ≈…
 * Les fractions s'écrivent avec « / » : « m·Δv/Δt », « (x3 - x1)/(t3 - t1) ». L'aperçu
 * les dessine superposées (voir `versNotation`).
 */

const LETTRE = "A-Za-zÀ-ÿ";

/** [motif, remplacement] appliqués à chaque frappe, dans cet ordre. */
const RACCOURCIS: [RegExp, string][] = [
  [new RegExp(`(^|[^${LETTRE}])del`, "gi"), "$1Δ"],
  [new RegExp(`(^|[^${LETTRE}])sig`, "gi"), "$1Σ"],
  [/<=>/g, "⟺"],
  [/=>/g, "⇒"],
  [/->/g, "→"],
  [/~=/g, "≈"],
  [/!=/g, "≠"],
  [/<=/g, "≤"],
  [/>=/g, "≥"],
  [/sqrt/gi, "√"],
  [/\^-1/g, "⁻¹"],
  [/\^-2/g, "⁻²"],
  [/\^2/g, "²"],
  [/\^3/g, "³"],
  [/\*/g, "·"],
  [new RegExp(`(^|[^${LETTRE}])pi(?=[^${LETTRE}])`, "g"), "$1π"],
  [new RegExp(`(^|[^${LETTRE}])rho(?=[^${LETTRE}])`, "g"), "$1ρ"],
];

/** Applique les raccourcis à un texte tapé. */
export function raccourcis(texte: string): string {
  let t = texte;
  for (const [motif, rempl] of RACCOURCIS) t = t.replace(motif, rempl);
  return t;
}

/** Aide affichée sous un champ. */
export const AIDE_RACCOURCIS = "del → Δ · sig → Σ · * → · · ^2 → ² · ^-1 → ⁻¹ · -> → → · a/b → fraction";

const UNITES = new Set(["m", "km", "cm", "mm", "s", "h", "min", "kg", "g", "N", "L", "mL", "J", "W"]);

/** Groupe entre parenthèses qui finit juste avant `fin` (exclu), ou null. */
function groupeAvant(t: string, fin: number): number | null {
  if (t[fin - 1] !== ")") return null;
  let prof = 0;
  for (let i = fin - 1; i >= 0; i--) {
    if (t[i] === ")") prof++;
    else if (t[i] === "(" && --prof === 0) return i;
  }
  return null;
}
function groupeApres(t: string, debut: number): number | null {
  if (t[debut] !== "(") return null;
  let prof = 0;
  for (let i = debut; i < t.length; i++) {
    if (t[i] === "(") prof++;
    else if (t[i] === ")" && --prof === 0) return i + 1;
  }
  return null;
}

/**
 * Texte tapé → notation des contenus de Luno (fractions `{{a // b}}`), pour l'aperçu.
 * Le numérateur est le groupe entre parenthèses ou le terme collé avant « / » (produit
 * compris : « m·Δv/Δt ») ; le dénominateur, le groupe ou le terme collé après. Les
 * unités (« m/s », « km/h ») restent en ligne.
 */
export function versNotation(texte: string): string {
  let t = texte;
  let i = t.indexOf("/");
  let garde = 0;
  while (i >= 0 && garde++ < 50) {
    let debutNum: number;
    let num: string;
    const g = groupeAvant(t, i);
    if (g !== null) {
      debutNum = g;
      num = t.slice(g + 1, i - 1);
    } else {
      debutNum = i;
      while (debutNum > 0 && !/[\s=+−\-,;:(⇒→≈<>]/.test(t[debutNum - 1])) debutNum--;
      num = t.slice(debutNum, i);
    }
    let finDen: number;
    let den: string;
    const h = groupeApres(t, i + 1);
    if (h !== null) {
      finDen = h;
      den = t.slice(i + 2, h - 1);
    } else {
      finDen = i + 1;
      while (finDen < t.length && !/[\s=+−\-,;:)·×⇒→≈<>/]/.test(t[finDen])) finDen++;
      den = t.slice(i + 1, finDen);
    }
    const unite = UNITES.has(num.trim()) && UNITES.has(den.trim());
    if (!num.trim() || !den.trim() || unite || num.includes("{{") || den.includes("{{")) {
      i = t.indexOf("/", i + 1);
      continue;
    }
    const frac = `{{${num.trim()} // ${den.trim()}}}`;
    t = t.slice(0, debutNum) + frac + t.slice(finDen);
    i = t.indexOf("/", debutNum + frac.length);
  }
  return t;
}
