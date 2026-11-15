"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { cleCarte, encre, pastel, prochaineRevision, useLuno, type NoteCarte } from "@/lib/store";
import { Bouton, BoutonIcone, ZoneAction, pluriel } from "@/components/ui";
import { formule } from "@/components/Formule";
import { DessinSchema } from "@/components/Schema";
import { Emoji } from "@/components/Emoji";

/** Mélange de Fisher-Yates : chaque ordre a la même chance. */
function melanger<T>(liste: T[]): T[] {
  const l = [...liste];
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [l[i], l[j]] = [l[j], l[i]];
  }
  return l;
}

const NOTES: { note: NoteCarte; label: string; classe: string }[] = [
  { note: 0, label: "À revoir", classe: "!border-bad/40 !text-bad hover:!bg-bad/10" },
  { note: 1, label: "Difficile", classe: "!bg-ink/10 !text-ink hover:!bg-ink/15" },
  { note: 2, label: "Su", classe: "!bg-accent !text-on-accent hover:!opacity-90" },
  { note: 3, label: "Facile", classe: "!bg-ok/15 !text-ok hover:!bg-ok/25" },
];
const delai = (j: number) => (j === 0 ? "tout à l'heure" : j === 1 ? "demain" : j < 30 ? `${j} j` : `${Math.round(j / 30)} mois`);

export type CarteARevoir = { chapitreId: string; carteId: string };
/** `retour` : carte ratée qui repasse une fois, quelques cartes plus loin, dans la même séance. */
type Passage = CarteARevoir & { retour?: boolean };

export function Revision({
  cartes,
  terminer,
}: {
  cartes: CarteARevoir[];
  terminer: () => void;
}) {
  const { chapitres, matieres, noterFlashcard } = useLuno();
  // Le paquet est mélangé, puis figé, au début de chaque séance (demandé le 2026-11-14) :
  // les cartes ne reviennent jamais dans le même ordre.
  // Une carte publiée dans deux chapitres (« Référentiel ») ne passe qu'une fois.
  const [paquet, setPaquet] = useState<Passage[]>(() => {
    const vues = new Set<string>();
    return melanger(
      cartes.filter((x) => {
        const f = chapitres.find((c) => c.id === x.chapitreId)?.flashcards.find((k) => k.id === x.carteId);
        if (!f) return true;
        const cle = cleCarte(f);
        if (vues.has(cle)) return false;
        vues.add(cle);
        return true;
      }),
    );
  });
  const [index, setIndex] = useState(0);
  const [retournee, setRetournee] = useState(false);
  const [sues, setSues] = useState(0);
  // Nombre de cartes de la séance, sans les retours.
  const [total] = useState(() => paquet.length);

  const courant = paquet[index];
  const chapitre =
    courant && chapitres.find((c) => c.id === courant.chapitreId);
  const carte = chapitre?.flashcards.find((f) => f.id === courant.carteId);
  const matiere = chapitre && matieres.find((m) => m.id === chapitre.matiereId);
  const couleur = matiere?.couleur ?? "#b5573d";
  const fini = index >= paquet.length;

  const repondre = useCallback(
    (note: NoteCarte) => {
      if (!courant) return;
      const su = note > 0;
      // Le retour ne compte pas une deuxième fois dans la répétition espacée : il sert
      // seulement à revoir la carte tant qu'elle est fraîche.
      if (!courant.retour) {
        noterFlashcard(courant.chapitreId, courant.carteId, note);
        if (su) setSues((n) => n + 1);
        else
          setPaquet((l) => {
            const ou = Math.min(index + 4, l.length);
            return [...l.slice(0, ou), { ...courant, retour: true }, ...l.slice(ou)];
          });
      }
      setRetournee(false);
      setIndex((i) => i + 1);
    },
    [courant, index, noterFlashcard],
  );

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (fini) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setRetournee((r) => !r);
      } else if (retournee && e.key === "ArrowRight") repondre(2);
      else if (retournee && e.key === "ArrowLeft") repondre(0);
      else if (retournee && ["1", "2", "3", "4"].includes(e.key)) repondre((Number(e.key) - 1) as NoteCarte);
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [fini, retournee, repondre]);

  if (fini) {
    const aRevoir = total - sues;
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
          {pluriel(sues, "carte sue", "cartes sues")} du premier coup sur {total}.
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
        <Emoji e={matiere?.emoji} /> {matiere?.nom} · {chapitre?.titre}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={carte.id}
          initial={{ opacity: 0, transform: "translate3d(60px, 0, 0) rotate(2deg)" }}
          animate={{ opacity: 1, transform: "translate3d(0px, 0, 0) rotate(0deg)" }}
          exit={{ opacity: 0, transform: "translate3d(-60px, 0, 0) rotate(-2deg)" }}
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
              {courant.retour && (
                <span className="absolute top-4 rounded-full bg-surface/80 px-2.5 py-0.5 text-[12px] font-semibold text-muted">
                  Elle revient : tu l&apos;avais ratée
                </span>
              )}
              <span className="absolute bottom-4 text-[13px] text-muted">
                Touche la carte pour la retourner
              </span>
            </span>
            <span
              className="flip-face absolute inset-0 flex flex-col items-center gap-4 overflow-y-auto [&>:first-child]:mt-auto [&>:last-child]:mb-auto rounded-[18px] border-[1.5px] border-ink bg-surface p-6 shadow-[6px_6px_0_var(--blush)]"
              style={{ transform: "rotateY(180deg)" }}
            >
              {/* La question reste visible au dos : on sait à quoi on répondait. */}
              <span className="text-[13px] font-semibold leading-snug text-muted">{formule(carte.recto)}</span>
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

      {/* Quatre réponses, comme Anki : le délai affiché sous chaque bouton dit quand la
          carte reviendra. « Difficile » la ramène plus tôt, « Facile » l'espace plus vite. */}
      <ZoneAction cle={retournee ? carte.id + "r" : carte.id} className="mt-6 grid grid-cols-4 gap-2">
        {NOTES.map(({ note, label, classe }) => (
          <Bouton
            key={note}
            variante={note === 0 ? "contour" : "plein"}
            className={`!flex-col !gap-0.5 !px-1 !py-2.5 ${classe}`}
            disabled={!retournee}
            onClick={() => repondre(note)}
          >
            <span className="text-[14px] font-semibold leading-tight">{label}</span>
            <span className="text-[11.5px] font-normal leading-tight opacity-80">
              {delai(prochaineRevision(carte, note).intervalle)}
            </span>
          </Bouton>
        ))}
      </ZoneAction>
      <p className="mt-3 text-center text-[12.5px] text-muted">
        Retourne la carte, puis dis honnêtement si tu la savais : c&apos;est ce qui règle quand elle revient.
      </p>
    </div>
  );
}
