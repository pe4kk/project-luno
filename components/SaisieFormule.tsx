"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formule, IconeFraction } from "@/components/Formule";
import { AIDE_RACCOURCIS, raccourcis, versNotation } from "@/lib/saisie";

const FLECHE = String.fromCharCode(0x20d7);

/** Touches au-dessus du clavier : [affiché, inséré, libellé]. */
const TOUCHES: [string, string, string][] = [
  ["Δ", "Δ", "Delta"],
  ["Σ", "Σ", "Somme"],
  ["v⃗", FLECHE, "Flèche de vecteur sur la lettre précédente"],
  ["a/b", "()/()", "Fraction"],
  ["²", "²", "Au carré"],
  ["⁻¹", "⁻¹", "Puissance moins un"],
  ["·", "·", "Multiplié"],
  ["×10", " × 10^", "Puissance de dix"],
  ["√", "√", "Racine"],
  ["⇒", " ⇒ ", "Donc"],
  ["▢", "[[]]", "Encadrer"],
];

/** Mise en forme d'une copie : [ouvrant, fermant]. */
const MARQUES = {
  encadrer: ["[[", "]]"],
  souligner: ["__", "__"],
  surligner: ["==", "=="],
} as const;
type Marque = keyof typeof MARQUES;

/**
 * Encadre, souligne ou surligne la sélection [debut, fin[ ; si elle l'est déjà, retire la
 * mise en forme. Renvoie le nouveau texte et la sélection à garder (le contenu seul).
 */
export function basculerMarque(texte: string, debut: number, fin: number, marque: Marque) {
  const [o, f] = MARQUES[marque];
  // Sans les espaces autour : « [[ f = m ]] » s'écrit « [[f = m]] ».
  while (debut < fin && /\s/.test(texte[debut])) debut++;
  while (fin > debut && /\s/.test(texte[fin - 1])) fin--;
  if (texte.slice(debut - o.length, debut) === o && texte.slice(fin, fin + f.length) === f)
    return {
      texte: texte.slice(0, debut - o.length) + texte.slice(debut, fin) + texte.slice(fin + f.length),
      debut: debut - o.length,
      fin: fin - o.length,
    };
  const choisi = texte.slice(debut, fin);
  if (choisi.startsWith(o) && choisi.endsWith(f) && choisi.length >= o.length + f.length)
    return {
      texte: texte.slice(0, debut) + choisi.slice(o.length, choisi.length - f.length) + texte.slice(fin),
      debut,
      fin: fin - o.length - f.length,
    };
  return {
    texte: texte.slice(0, debut) + o + choisi + f + texte.slice(fin),
    debut: debut + o.length,
    fin: fin + o.length,
  };
}

const BOUTONS_MARQUE: { m: Marque; vu: React.ReactNode; nom: string }[] = [
  { m: "encadrer", vu: <span className="rounded-[3px] border-[1.5px] border-current px-1 text-[11px] leading-[14px]">a</span>, nom: "Encadrer" },
  { m: "souligner", vu: <span className="underline decoration-2 underline-offset-2">U</span>, nom: "Souligner" },
  { m: "surligner", vu: <span className="font-bold">G</span>, nom: "Gras" },
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
  const curseur = useRef<[number, number] | null>(null);
  const poserCurseur = (pos: number, fin = pos) => {
    curseur.current = [pos, fin];
  };
  useLayoutEffect(() => {
    if (curseur.current === null || !zone.current) return;
    zone.current.setSelectionRange(curseur.current[0], curseur.current[1]);
    curseur.current = null;
  });

  // Une sélection non vide fait apparaître la bulle de mise en forme.
  const [selection, setSelection] = useState(false);
  const lireSelection = () => {
    const el = zone.current;
    setSelection(Boolean(el && document.activeElement === el && el.selectionEnd > el.selectionStart));
  };
  // Sur iPhone, les poignées de sélection ne passent que par `selectionchange`.
  useEffect(() => {
    document.addEventListener("selectionchange", lireSelection);
    return () => document.removeEventListener("selectionchange", lireSelection);
  }, []);
  const marquer = (m: Marque) => {
    const el = zone.current;
    if (!el) return;
    const r = basculerMarque(valeur, el.selectionStart, el.selectionEnd, m);
    changer(r.texte);
    poserCurseur(r.debut, r.fin);
  };

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
    if (texte === "[[]]") {
      // Avec une sélection, l'encadre ; sinon, ouvre un cadre vide où écrire.
      if (fin > debut) return marquer("encadrer");
      changer(`${avant}[[]]${apres}`);
      return poserCurseur(debut + 2);
    }
    changer(avant + texte + apres);
    poserCurseur(debut + texte.length);
  };

  const apercu = scientifique ? versNotation(valeur) : valeur;
  const misEnForme = /\[\[|__|==/.test(valeur);
  const utile = misEnForme || (scientifique && /[\/Δ Σ⃗²⁻√]|\{\{/.test(valeur));

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
            {vu === "a/b" ? <IconeFraction /> : formule(vu)}
          </button>
        ))}
      </div>
      )}
      <div className="relative">
      <textarea
        ref={zone}
        onSelect={lireSelection}
        onKeyUp={lireSelection}
        onPointerUp={lireSelection}
        onBlur={() => setSelection(false)}
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
        className="block w-full rounded-xl border border-line bg-bg/60 px-3.5 py-2.5 text-[16px] leading-relaxed outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:bg-surface"
      />
      <AnimatePresence>
        {selection && !desactive && (
          <motion.div
            role="toolbar"
            aria-label="Mise en forme"
            initial={{ opacity: 0, transform: "translate3d(0, -6px, 0) scale(0.96)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0px, 0) scale(1)" }}
            exit={{ opacity: 0, transform: "translate3d(0, -6px, 0) scale(0.96)" }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            // Sous le champ : au-dessus, le menu de l'iPhone (Copier, Coller…) la cacherait.
            className="absolute left-2 top-[calc(100%+6px)] z-20 flex origin-top-left gap-0.5 rounded-xl bg-ink p-1 text-bg shadow-pop"
          >
            <span aria-hidden className="absolute -top-1.5 left-6 size-3 rotate-45 rounded-[2px] bg-ink" />
            {BOUTONS_MARQUE.map((b) => (
              <button
                key={b.m}
                type="button"
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => marquer(b.m)}
                className="relative flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold transition-colors hover:bg-bg/15 active:bg-accent active:text-on-accent"
              >
                {b.vu} {b.nom}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      {valeur.trim() && utile ? (
        <p className="mt-1.5 rounded-lg bg-ink/[0.04] px-3 py-1.5 text-[15px] leading-relaxed" aria-live="polite">
          <span className="mr-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-muted">
            Aperçu
          </span>
          {formule(apercu)}
        </p>
      ) : (
        <p className="mt-1 text-[12px] text-muted">
          {scientifique ? `${AIDE_RACCOURCIS} · sélectionne pour encadrer ou souligner` : "Sélectionne un passage pour l'encadrer, le souligner ou le surligner."}
        </p>
      )}
    </div>
  );
}
