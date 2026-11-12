"use client";

import { useLayoutEffect, useRef } from "react";
import { formule } from "@/components/Formule";
import { AIDE_RACCOURCIS, raccourcis, versNotation } from "@/lib/saisie";

const FLECHE = String.fromCharCode(0x20d7);

/** Touches au-dessus du clavier : [affiché, inséré, libellé]. */
const TOUCHES: [string, string, string][] = [
  ["Δ", "Δ", "Delta"],
  ["Σ", "Σ", "Somme"],
  ["v⃗", FLECHE, "Flèche de vecteur sur la lettre précédente"],
  ["a⁄b", "()/()", "Fraction"],
  ["²", "²", "Au carré"],
  ["⁻¹", "⁻¹", "Puissance moins un"],
  ["·", "·", "Multiplié"],
  ["×10", " × 10^", "Puissance de dix"],
  ["√", "√", "Racine"],
  ["⇒", " ⇒ ", "Donc"],
];

/**
 * Champ pour écrire une ligne de physique au téléphone : raccourcis tapés (« del » → Δ…),
 * touches Δ, Σ, vecteur, fraction…, et aperçu dessiné (fractions superposées, flèches).
 */
export function SaisieFormule({
  valeur,
  changer,
  lignes = 2,
  placeholder,
  desactive = false,
  label,
  scientifique = true,
}: {
  valeur: string;
  changer: (v: string) => void;
  lignes?: number;
  placeholder?: string;
  desactive?: boolean;
  label: string;
  /** Faux hors des matières scientifiques : texte simple, sans touches ni raccourcis. */
  scientifique?: boolean;
}) {
  const zone = useRef<HTMLTextAreaElement>(null);

  // Place le curseur après une modification faite par le code (raccourci, touche) :
  // juste après l'affichage, avant la touche suivante, sinon il saute quand on tape vite.
  const curseur = useRef<number | null>(null);
  const poserCurseur = (pos: number) => {
    curseur.current = pos;
  };
  useLayoutEffect(() => {
    if (curseur.current === null || !zone.current) return;
    zone.current.setSelectionRange(curseur.current, curseur.current);
    curseur.current = null;
  });

  const inserer = (texte: string) => {
    const el = zone.current;
    const debut = el?.selectionStart ?? valeur.length;
    const fin = el?.selectionEnd ?? valeur.length;
    const avant = valeur.slice(0, debut);
    const apres = valeur.slice(fin);
    if (texte === "()/()") {
      changer(`${avant}()/()${apres}`);
      return poserCurseur(debut + 1);
    }
    changer(avant + texte + apres);
    poserCurseur(debut + texte.length);
  };

  const apercu = versNotation(valeur);
  const utile = /[\/Δ Σ⃗²⁻√]|\{\{/.test(valeur);

  return (
    <div>
      {scientifique && (
      <div
        className="mb-1.5 flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none]"
        role="toolbar"
        aria-label="Symboles"
      >
        {TOUCHES.map(([vu, mis, nom]) => (
          <button
            key={nom}
            type="button"
            disabled={desactive}
            aria-label={nom}
            // Garde le clavier ouvert : la zone de texte ne perd pas le focus.
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => inserer(mis)}
            className="min-h-9 min-w-10 shrink-0 rounded-lg border border-line bg-surface px-2 text-[15px] font-medium transition-colors active:bg-accent-soft disabled:opacity-40"
          >
            {vu}
          </button>
        ))}
      </div>
      )}
      <textarea
        ref={zone}
        rows={lignes}
        disabled={desactive}
        aria-label={label}
        placeholder={placeholder}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={valeur}
        onChange={(e) => {
          const brut = e.target.value;
          const converti = scientifique ? raccourcis(brut) : brut;
          changer(converti);
          if (converti !== brut) {
            const pos = (e.target.selectionStart ?? brut.length) - (brut.length - converti.length);
            poserCurseur(Math.max(0, pos));
          }
        }}
        className="w-full rounded-xl border border-line bg-bg/60 px-3.5 py-2.5 text-[16px] leading-relaxed outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:bg-surface"
      />
      {!scientifique ? null : valeur.trim() && utile ? (
        <p className="mt-1.5 rounded-lg bg-ink/[0.04] px-3 py-1.5 text-[15px] leading-relaxed" aria-live="polite">
          <span className="mr-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-muted">
            Aperçu
          </span>
          {formule(apercu)}
        </p>
      ) : (
        <p className="mt-1 text-[12px] text-muted">{AIDE_RACCOURCIS}</p>
      )}
    </div>
  );
}
