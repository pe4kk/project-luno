import { Fragment, type ReactNode } from "react";

/**
 * Affiche un texte en dessinant les flèches de vecteur : dans les contenus, « v⃗ » s'écrit
 * avec la flèche combinante U+20D7, que les polices du site n'ont pas. La flèche est
 * tracée en CSS (classe `vec` dans `app/globals.css`) au-dessus des caractères qui la
 * précèdent : lettres, chiffres, apostrophe et indices (MM'⃗, MᵢMᵢ₊₁⃗, OM₃⃗, 0⃗).
 */
const VECTEUR = /([A-Za-z0-9'ᵢₓᵧ₀-₉₊₋]+)⃗/g;

export function formule(texte: string): ReactNode {
  if (!texte.includes("⃗")) return texte;
  const morceaux: ReactNode[] = [];
  let fin = 0;
  for (const m of texte.matchAll(VECTEUR)) {
    morceaux.push(texte.slice(fin, m.index));
    morceaux.push(
      <span key={m.index} className="vec">
        {m[1]}
      </span>,
    );
    fin = m.index! + m[0].length;
  }
  morceaux.push(texte.slice(fin).replaceAll("⃗", ""));
  return morceaux.map((x, i) => <Fragment key={i}>{x}</Fragment>);
}
