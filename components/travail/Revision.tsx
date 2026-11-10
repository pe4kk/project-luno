"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import type { Chapitre } from "@/lib/types";
import { pastel, useLuno } from "@/lib/store";
import { Bouton } from "@/components/ui";

export function Revision({
  chapitre,
  couleur,
  terminer,
}: {
  chapitre: Chapitre;
  couleur: string;
  terminer: () => void;
}) {
  const noter = useLuno((s) => s.noterFlashcard);
  // L'ordre est figé au début de la séance : les cartes non acquises d'abord.
  const paquet = useMemo(
    () => [...chapitre.flashcards].sort((a, b) => a.niveau - b.niveau).map((c) => c.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapitre.id],
  );
  const [index, setIndex] = useState(0);
  const [retournee, setRetournee] = useState(false);
  const [sues, setSues] = useState(0);
  const carte = chapitre.flashcards.find((c) => c.id === paquet[index]);
  const fini = index >= paquet.length || !carte;

  const repondre = useCallback(
    (su: boolean) => {
      if (!carte) return;
      noter(chapitre.id, carte.id, su ? 2 : 1);
      if (su) setSues((n) => n + 1);
      setRetournee(false);
      setIndex((i) => i + 1);
    },
    [carte, chapitre.id, noter],
  );

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (fini) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setRetournee((r) => !r);
      } else if (retournee && e.key === "ArrowRight") repondre(true);
      else if (retournee && e.key === "ArrowLeft") repondre(false);
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [fini, retournee, repondre]);

  if (fini) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto flex max-w-[460px] flex-col items-center rounded-[18px] border border-line bg-surface p-10 text-center shadow-card"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
          className="mb-4 flex size-16 items-center justify-center rounded-full bg-ok/15 text-ok"
        >
          <Check size={30} />
        </motion.div>
        <h2 className="text-[28px] font-bold">Séance terminée</h2>
        <p className="mt-1 text-[15px] text-muted">
          {sues} carte(s) sue(s) sur {paquet.length}.
        </p>
        <div className="mt-6 flex gap-2">
          <Bouton
            variante="contour"
            onClick={() => {
              setIndex(0);
              setSues(0);
            }}
          >
            <RotateCcw size={16} /> Recommencer
          </Bouton>
          <Bouton onClick={terminer}>Terminer</Bouton>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full"
            style={{ background: couleur }}
            animate={{ width: `${(index / paquet.length) * 100}%` }}
          />
        </div>
        <span className="text-[13px] font-semibold text-muted">
          {index + 1} / {paquet.length}
        </span>
        <button onClick={terminer} aria-label="Quitter" className="rounded-full p-1.5 text-muted hover:bg-ink/5">
          <X size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={carte.id}
          initial={{ opacity: 0, x: 60, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -60, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="flip-scene"
        >
          <motion.button
            onClick={() => setRetournee((r) => !r)}
            animate={{ rotateY: retournee ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative block h-[320px] w-full cursor-pointer text-center"
            aria-label={retournee ? "Voir le recto" : "Voir la réponse"}
          >
            <span
              className="flip-face absolute inset-0 flex flex-col items-center justify-center rounded-[18px] border-[1.5px] border-ink p-8 shadow-[6px_6px_0_var(--blush)]"
              style={{ background: pastel(couleur, 14) }}
            >
              <span className="surtitre text-accent">Définition de</span>
              <span
                className="mt-3 font-display text-[34px] italic leading-tight"
                style={{ color: `color-mix(in oklab, ${couleur} 65%, var(--mix-fg))` }}
              >
                {carte.recto}
              </span>
              <span className="absolute bottom-5 text-[13px] text-ink/45">Clique ou appuie sur Espace</span>
            </span>
            <span
              className="flip-face absolute inset-0 flex items-center justify-center rounded-[18px] border-[1.5px] border-ink bg-surface p-8 shadow-[6px_6px_0_var(--blush)]"
              style={{ transform: "rotateY(180deg)" }}
            >
              <span className="text-[19px] leading-relaxed">{carte.verso}</span>
            </span>
          </motion.button>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Bouton
          variante="contour"
          className="!border-bad/30 !py-3.5 !text-bad hover:!bg-bad/10"
          disabled={!retournee}
          onClick={() => repondre(false)}
        >
          <X size={18} /> À revoir
        </Bouton>
        <Bouton
          className="!bg-accent !py-3.5 !text-on-accent hover:!opacity-90"
          disabled={!retournee}
          onClick={() => repondre(true)}
        >
          <Check size={18} /> Je savais
        </Bouton>
      </div>
      <p className="mt-3 text-center text-[12.5px] text-muted">
        Retourne la carte, puis indique si tu connaissais la réponse (flèches ← et →).
      </p>
    </div>
  );
}
