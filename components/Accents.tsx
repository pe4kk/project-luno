"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Barre de lettres françaises pour l'ordinateur (clavier QWERTY) : é è ê à ç ù œ « »…
 * Elle apparaît en bas de l'écran dès qu'un champ de texte a le focus, seulement avec
 * une souris (sur téléphone, le clavier les a déjà). Les touches gardent le focus dans le
 * champ et insèrent la lettre au curseur ; Maj, ou la touche Shift tenue, met en capitale.
 */

const NBSP = " ";
const LETTRES = ["é", "è", "ê", "ë", "à", "â", "ç", "ù", "û", "ü", "î", "ï", "ô", "œ", "æ"];
const SIGNES: [string, string][] = [
  ["«", `«${NBSP}`],
  ["»", `${NBSP}»`],
  ["’", "’"],
  ["…", "…"],
];

type Champ = HTMLInputElement | HTMLTextAreaElement;

const estChampTexte = (e: EventTarget | null): e is Champ =>
  (e instanceof HTMLTextAreaElement ||
    (e instanceof HTMLInputElement && ["text", "search", ""].includes(e.type))) &&
  !e.readOnly &&
  !e.disabled &&
  e.inputMode !== "decimal" &&
  e.inputMode !== "numeric";

function inserer(champ: Champ, texte: string) {
  champ.focus();
  // execCommand garde l'annulation (Ctrl+Z) et prévient React comme une vraie frappe.
  if (document.execCommand?.("insertText", false, texte)) return;
  const debut = champ.selectionStart ?? champ.value.length;
  const fin = champ.selectionEnd ?? debut;
  const valeur = champ.value.slice(0, debut) + texte + champ.value.slice(fin);
  const proto = champ instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(champ, valeur);
  champ.setSelectionRange(debut + texte.length, debut + texte.length);
  champ.dispatchEvent(new Event("input", { bubbles: true }));
}

export function Accents() {
  const [souris, setSouris] = useState(false);
  const [champ, setChamp] = useState<Champ | null>(null);
  const [maj, setMaj] = useState(false);
  const [shift, setShift] = useState(false);
  const quitte = useRef<number | undefined>(undefined);

  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine)");
    const maj = () => setSouris(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);

  useEffect(() => {
    if (!souris) return;
    const entree = (e: FocusEvent) => {
      clearTimeout(quitte.current);
      const c = estChampTexte(e.target) ? e.target : null;
      setChamp(c);
      // Le champ ne doit pas finir caché derrière la barre.
      if (c) {
        const bas = c.getBoundingClientRect().bottom;
        if (bas > innerHeight - 80) window.scrollBy({ top: bas - innerHeight + 96, behavior: "smooth" });
      }
    };
    // Petit délai : passer d'un champ à l'autre ne fait pas clignoter la barre.
    const sortie = () => {
      quitte.current = window.setTimeout(() => {
        if (!estChampTexte(document.activeElement)) setChamp(null);
      }, 120);
    };
    const touche = (e: KeyboardEvent) => setShift(e.shiftKey);
    document.addEventListener("focusin", entree);
    document.addEventListener("focusout", sortie);
    window.addEventListener("keydown", touche);
    window.addEventListener("keyup", touche);
    return () => {
      document.removeEventListener("focusin", entree);
      document.removeEventListener("focusout", sortie);
      window.removeEventListener("keydown", touche);
      window.removeEventListener("keyup", touche);
    };
  }, [souris]);

  const capitale = maj !== shift;

  return (
    <AnimatePresence>
      {souris && champ && (
        <motion.div
          key="accents"
          role="toolbar"
          aria-label="Lettres accentuées"
          initial={{ opacity: 0, transform: "translate3d(0, 12px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0, transform: "translate3d(0, 12px, 0)" }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          // Ne prend jamais le focus : le champ le garde, et la fenêtre ouverte aussi.
          onPointerDown={(e) => e.preventDefault()}
          className="fixed inset-x-0 bottom-4 z-[60] mx-auto flex w-fit max-w-[calc(100vw-32px)] flex-wrap items-center justify-center gap-1 rounded-2xl border border-line bg-surface p-1.5 shadow-pop"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-pressed={capitale}
            onClick={() => setMaj((m) => !m)}
            title="Majuscules (ou maintiens Shift)"
            className={`h-9 rounded-lg px-2.5 text-[13px] font-semibold transition-colors duration-150 ${
              capitale ? "bg-ink text-bg" : "text-muted hover:bg-ink/5 hover:text-ink"
            }`}
          >
            Maj
          </button>
          <span className="mx-0.5 h-5 w-px bg-line" aria-hidden />
          {LETTRES.map((l) => {
            const c = capitale ? l.toUpperCase() : l;
            return (
              <button
                key={l}
                type="button"
                tabIndex={-1}
                aria-label={`Insérer ${c}`}
                onClick={() => {
                  inserer(champ, c);
                  setMaj(false);
                }}
                className="h-9 min-w-9 rounded-lg text-[16px] transition-colors duration-150 hover:bg-accent-soft active:bg-accent active:text-on-accent"
              >
                {c}
              </button>
            );
          })}
          <span className="mx-0.5 h-5 w-px bg-line" aria-hidden />
          {SIGNES.map(([vu, mis]) => (
            <button
              key={vu}
              type="button"
              tabIndex={-1}
              aria-label={`Insérer ${vu}`}
              onClick={() => inserer(champ, mis)}
              className="h-9 min-w-9 rounded-lg text-[16px] transition-colors duration-150 hover:bg-accent-soft active:bg-accent active:text-on-accent"
            >
              {vu}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
