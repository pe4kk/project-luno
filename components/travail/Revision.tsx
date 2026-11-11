"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { encre, pastel, useLuno } from "@/lib/store";
import { Bouton, BoutonIcone, pluriel } from "@/components/ui";
import { formule } from "@/components/Formule";
import { DessinSchema } from "@/components/Schema";

export type CarteARevoir = { chapitreId: string; carteId: string };

export function Revision({
  cartes,
  terminer,
}: {
  cartes: CarteARevoir[];
  terminer: () => void;
}) {
  const { chapitres, matieres, noterFlashcard } = useLuno();
  // Le paquet est figé au début de la séance.
  const [paquet] = useState(cartes);
  const [index, setIndex] = useState(0);
  const [retournee, setRetournee] = useState(false);
  const [sues, setSues] = useState(0);

  const courant = paquet[index];
  const chapitre =
    courant && chapitres.find((c) => c.id === courant.chapitreId);
  const carte = chapitre?.flashcards.find((f) => f.id === courant.carteId);
  const matiere = chapitre && matieres.find((m) => m.id === chapitre.matiereId);
  const couleur = matiere?.couleur ?? "#b5573d";
  const fini = index >= paquet.length;

  const repondre = useCallback(
    (su: boolean) => {
      if (!courant) return;
      noterFlashcard(courant.chapitreId, courant.carteId, su);
      if (su) setSues((n) => n + 1);
      setRetournee(false);
      setIndex((i) => i + 1);
    },
    [courant, noterFlashcard],
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
    const aRevoir = paquet.length - sues;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto flex max-w-[460px] flex-col items-center rounded-[18px] border border-line bg-surface p-8 text-center shadow-card sm:p-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 14,
            delay: 0.1,
          }}
          className="mb-4 flex size-16 items-center justify-center rounded-full bg-ok/15 text-ok"
        >
          <Check size={30} />
        </motion.div>
        <h2 className="text-[28px]">Séance terminée</h2>
        <p className="mt-1 text-[15px] text-muted">
          {pluriel(sues, "carte sue", "cartes sues")} sur {paquet.length}.
        </p>
        <p className="mt-2 text-[13.5px] text-muted">
          {aRevoir > 0
            ? `${pluriel(aRevoir, "carte reste", "cartes restent")} à revoir aujourd'hui. Les autres reviendront plus tard, de plus en plus espacées.`
            : "Ces cartes reviendront plus tard, de plus en plus espacées."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {aRevoir > 0 && (
            <Bouton variante="contour" onClick={terminer}>
              <RotateCcw size={16} /> Plus tard
            </Bouton>
          )}
          <Bouton onClick={terminer}>Terminer</Bouton>
        </div>
      </motion.div>
    );
  }

  // Carte supprimée pendant la séance : on propose de passer à la suivante.
  if (!carte) {
    return (
      <div className="mx-auto max-w-[460px] text-center">
        <p className="text-[15px] text-muted">
          Cette carte n&apos;existe plus.
        </p>
        <Bouton className="mt-4" onClick={() => setIndex((i) => i + 1)}>
          Carte suivante
        </Bouton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="mb-2 flex items-center gap-3">
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
        <BoutonIcone
          label="Quitter la révision"
          onClick={terminer}
          className="-mr-2"
        >
          <X size={18} />
        </BoutonIcone>
      </div>
      <p className="mb-3 truncate text-[13px] text-muted">
        {matiere?.emoji} {matiere?.nom} · {chapitre?.titre}
      </p>

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
            className={`relative block w-full cursor-pointer text-center ${
              carte.schema
                ? "h-[min(400px,calc(100dvh-440px))] min-h-[300px]"
                : "h-[min(320px,calc(100dvh-530px))] min-h-[160px]"
            }`}
            aria-label={retournee ? "Voir le recto" : "Voir la réponse"}
          >
            <span
              className="flip-face absolute inset-0 flex flex-col items-center justify-center rounded-[18px] border-[1.5px] border-ink p-6 shadow-[6px_6px_0_var(--blush)]"
              style={{ background: pastel(couleur, 14) }}
            >
              <span
                className="font-display text-[26px] italic leading-tight sm:text-[32px]"
                style={{ color: encre(couleur) }}
              >
                {formule(carte.recto)}
              </span>
              <span className="absolute bottom-4 text-[13px] text-muted">
                Touche la carte pour la retourner
              </span>
            </span>
            <span
              className="flip-face absolute inset-0 flex flex-col items-center gap-4 overflow-y-auto [&>:first-child]:mt-auto [&>:last-child]:mb-auto rounded-[18px] border-[1.5px] border-ink bg-surface p-6 shadow-[6px_6px_0_var(--blush)]"
              style={{ transform: "rotateY(180deg)" }}
            >
              <span
                className={
                  carte.schema
                    ? "text-[15.5px] leading-snug sm:text-[18px]"
                    : "text-[17px] leading-relaxed sm:text-[19px]"
                }
              >
                {formule(carte.verso)}
              </span>
              {carte.schema && (
                <DessinSchema
                  schema={carte.schema}
                  dansBouton
                  hauteurMax={110}
                  className="w-full max-w-[400px] shrink-0 !px-3 !py-2.5"
                />
              )}
            </span>
          </motion.button>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Bouton
          variante="contour"
          className="!border-bad/40 !py-3.5 !text-bad hover:!bg-bad/10"
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
        Retourne la carte, puis indique si tu connaissais la réponse.
      </p>
    </div>
  );
}
