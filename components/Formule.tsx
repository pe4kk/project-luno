import { Fragment, type ReactNode } from "react";

/**
 * Affiche un texte de contenu en dessinant les notations de physique et de maths.
 *
 * - Vecteurs : « v⃗ » s'écrit avec la flèche combinante U+20D7 après les caractères
 *   concernés (MM'⃗, MᵢMᵢ₊₁⃗, OM₃⃗, 0⃗). Les polices du site n'ont pas ce caractère : une
 *   vraie flèche (trait et pointe ouverte, en SVG) est tracée au-dessus. Le Δ, Σ ou signe
 *   moins qui précède et les indices qui suivent restent sur la même ligne.
 * - Fractions : « {{numérateur // dénominateur}} » s'affiche en fraction superposée, avec
 *   une barre fine. Numérateur et dénominateur peuvent contenir des vecteurs.
 * - Indices en lettres : « v_f » s'affiche avec f en indice (les indices ᵢ, ₀… s'écrivent
 *   directement).
 *
 * Pour un texte brut (recherche, aria-label, comparaison), utiliser `texteBrut()`.
 */
const FLECHE = String.fromCharCode(0x20d7);
const MORCEAU_INDICE = "[A-Za-z0-9À-ÿ→/]+(?:\\.[A-Za-z0-9À-ÿ→/]+)*";
const VECTEUR = new RegExp(
  `([ΔΣ−]?)([A-Za-z0-9'ᵢₓᵧ₀-₉₊₋ΠΣ]+)${FLECHE}([ᵢₓᵧ₀-₉₊₋]*)(?:_(${MORCEAU_INDICE}))?`,
  "g",
);
const FRACTION = /\{\{(.+?) \/\/ (.+?)\}\}/g;

function Fleche() {
  return (
    <svg className="vec-fleche" aria-hidden="true" focusable="false">
      <line x1="0.06em" x2="100%" y1="0.17em" y2="0.17em" />
      <svg x="100%" width="1em" height="1em" viewBox="0 0 100 100" overflow="visible">
        <polyline points="-21,3 0,17 -21,31" />
      </svg>
    </svg>
  );
}

const INDICE = new RegExp(`([A-Za-zΑ-ωΔ])_(${MORCEAU_INDICE})`, "g");

/** « v_f » : indice écrit en petit, sous la ligne. */
function indices(texte: string, cle: string): ReactNode {
  if (!texte.includes("_")) return texte;
  const morceaux: ReactNode[] = [];
  let fin = 0;
  for (const m of texte.matchAll(INDICE)) {
    morceaux.push(texte.slice(fin, m.index), m[1]);
    morceaux.push(<sub key={`${cle}i${m.index}`} className="indice">{m[2]}</sub>);
    fin = m.index! + m[0].length;
  }
  morceaux.push(texte.slice(fin));
  return morceaux.map((x, i) => <Fragment key={`${cle}j${i}`}>{x}</Fragment>);
}

function vecteurs(texte: string, cle: string): ReactNode {
  if (!texte.includes(FLECHE)) return indices(texte, cle);
  const morceaux: ReactNode[] = [];
  let fin = 0;
  for (const m of texte.matchAll(VECTEUR)) {
    morceaux.push(indices(texte.slice(fin, m.index), `${cle}p${m.index}`));
    morceaux.push(
      <span key={`${cle}v${m.index}`} className="whitespace-nowrap">
        {m[1]}
        <span className="vec">
          {m[2]}
          <Fleche />
        </span>
        {m[3]}
        {m[4] && <sub className="indice">{m[4]}</sub>}
      </span>,
    );
    fin = m.index! + m[0].length;
  }
  morceaux.push(indices(texte.slice(fin).replaceAll(FLECHE, ""), `${cle}q`));
  return morceaux.map((x, i) => <Fragment key={`${cle}${i}`}>{x}</Fragment>);
}

export function formule(texte: string): ReactNode {
  if (!texte.includes("{{")) return vecteurs(texte, "");
  const morceaux: ReactNode[] = [];
  let fin = 0;
  for (const m of texte.matchAll(FRACTION)) {
    morceaux.push(vecteurs(texte.slice(fin, m.index), `a${m.index}`));
    morceaux.push(
      <span key={`f${m.index}`} className="frac" role="math" aria-label={texteBrut(m[0])}>
        <span className="frac-haut">{vecteurs(m[1], `n${m.index}`)}</span>
        <span className="frac-bas">{vecteurs(m[2], `d${m.index}`)}</span>
      </span>,
    );
    fin = m.index! + m[0].length;
  }
  morceaux.push(vecteurs(texte.slice(fin), "z"));
  return morceaux.map((x, i) => <Fragment key={i}>{x}</Fragment>);
}

/** Le même texte sans balisage : « {{a − b // c}} » devient « (a − b) / c ». */
export function texteBrut(texte: string): string {
  const groupe = (s: string) => (/[ +−×·]/.test(s.trim()) ? `(${s.trim()})` : s.trim());
  return texte
    .replace(FRACTION, (_, h: string, b: string) => `${groupe(h)} / ${groupe(b)}`)
    .replaceAll(FLECHE, "")
    .replace(INDICE, "$1$2");
}
