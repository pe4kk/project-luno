"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, RotateCcw, Target, X } from "lucide-react";
import { encre, pastel, useLuno } from "@/lib/store";
import { MIN_CARTES_QCM, maxQuestions, peutSExercer, preparerQcm } from "@/lib/contenu";
import type { Qcm } from "@/lib/types";
import { Bouton, BoutonIcone, Carte, EnTete, EtatVide, pluriel } from "@/components/ui";

export default function Exercices() {
  const { matieres, chapitres, noterFlashcard } = useLuno();
  const [chapitreId, setChapitreId] = useState<string | null>(null);
  const [nombre, setNombre] = useState(5);
  const [questions, setQuestions] = useState<Qcm[] | null>(null);
  const [index, setIndex] = useState(0);
  const [choisi, setChoisi] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const disponibles = chapitres.filter(peutSExercer);
  const chapitre = disponibles.find((c) => c.id === chapitreId) ?? null;
  const max = chapitre ? maxQuestions(chapitre) : 10;
  const min = Math.min(3, max);
  const n = Math.max(min, Math.min(nombre, max));

  const lancer = () => {
    if (!chapitre) return;
    setQuestions(preparerQcm(chapitre, n));
    setIndex(0);
    setScore(0);
    setChoisi(null);
  };
  const quitter = () => setQuestions(null);

  // Séance en cours
  if (questions && chapitre && index < questions.length) {
    const q = questions[index];
    return (
      <div className="mx-auto max-w-[640px]">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${(index / questions.length) * 100}%` }} />
          </div>
          <span className="text-[13px] font-semibold text-muted">
            {index + 1} / {questions.length}
          </span>
          <BoutonIcone label="Quitter les exercices" onClick={quitter} className="-mr-2">
            <X size={18} />
          </BoutonIcone>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="surtitre text-muted">{q.consigne ?? chapitre.titre}</p>
            <h2 className="mt-2 text-[22px] leading-snug sm:text-[24px]">{q.question}</h2>
            <div className="mt-5 flex flex-col gap-2.5" role="group" aria-label="Réponses">
              {q.choix.map((c, i) => {
                const bon = i === q.bonneReponse;
                const etat = choisi === null ? "neutre" : bon ? "bon" : i === choisi ? "faux" : "eteint";
                return (
                  <motion.button
                    key={c}
                    disabled={choisi !== null}
                    whileHover={choisi === null ? { x: 4 } : undefined}
                    animate={etat === "faux" ? { x: [0, -8, 8, -5, 5, 0] } : etat === "bon" ? { scale: [1, 1.03, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    onClick={() => {
                      setChoisi(i);
                      if (bon) setScore((s) => s + 1);
                      // Une erreur remet la flashcard d'origine dans les cartes à revoir.
                      else if (q.carteId) noterFlashcard(chapitre.id, q.carteId, false);
                    }}
                    className={`flex min-h-[52px] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[16px] font-medium transition-colors ${
                      etat === "bon"
                        ? "border-ok bg-ok/10 text-ok"
                        : etat === "faux"
                          ? "border-bad bg-bad/10 text-bad"
                          : etat === "eteint"
                            ? "border-line bg-surface text-muted"
                            : "border-line bg-surface hover:border-accent"
                    }`}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-[13px] font-semibold">
                      {etat === "bon" ? <Check size={15} /> : etat === "faux" ? <X size={15} /> : "ABCD"[i]}
                    </span>
                    {c}
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {choisi !== null && (
                <motion.div
                  id="correction"
                  role="status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onAnimationComplete={() =>
                    document.getElementById("correction")?.scrollIntoView({ behavior: "smooth", block: "nearest" })
                  }
                  className="mt-5 flex scroll-mb-28 flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink/5 p-4"
                >
                  <p className="min-w-0 flex-1 text-[14.5px]">
                    <strong>{choisi === q.bonneReponse ? "Bonne réponse." : "Pas tout à fait."}</strong>{" "}
                    {q.explication}
                  </p>
                  <Bouton
                    autoFocus
                    onClick={() => {
                      setChoisi(null);
                      setIndex((i) => i + 1);
                    }}
                  >
                    {index + 1 === questions.length ? "Voir le résultat" : "Suivante"}
                  </Bouton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Résultat
  if (questions) {
    const pct = questions.length ? score / questions.length : 0;
    const R = 54;
    const C = 2 * Math.PI * R;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto flex max-w-[460px] flex-col items-center rounded-[18px] border border-line bg-surface p-8 text-center shadow-card sm:p-10"
      >
        <div className="relative mb-5">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90" aria-hidden>
            <circle cx="70" cy="70" r={R} fill="none" stroke="var(--line)" strokeWidth="12" />
            <motion.circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={pct >= 0.5 ? "var(--ok)" : "var(--bad)"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - pct) }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-[32px]">
            {score}/{questions.length}
          </span>
        </div>
        <h2 className="text-[28px]">
          {pct === 1 ? "Sans faute !" : pct >= 0.7 ? "Bien joué" : pct >= 0.5 ? "Pas mal" : "À retravailler"}
        </h2>
        <p className="mt-1 text-[15px] text-muted">{chapitre?.titre}</p>
        {score < questions.length && questions.some((q) => q.carteId) && (
          <p className="mt-2 text-[13.5px] text-muted">
            Les notions ratées sont revenues dans tes flashcards à revoir.
          </p>
        )}
        <div className="mt-6 flex gap-2">
          <Bouton variante="contour" onClick={lancer}>
            <RotateCcw size={16} /> Rejouer
          </Bouton>
          <Bouton onClick={quitter}>Terminer</Bouton>
        </div>
      </motion.div>
    );
  }

  // Choix du chapitre
  return (
    <div>
      <EnTete titre="S'exercer" sousTitre="Des exercices sur tes chapitres, corrigés tout de suite." />
      {disponibles.length === 0 ? (
        <EtatVide
          icone={<Target size={26} />}
          titre="Pas encore de quoi s'exercer"
          texte={`Il faut un chapitre avec des exercices rédigés par Claude, ou au moins ${MIN_CARTES_QCM} flashcards. Tout part de ton cours, dans l'onglet Travail.`}
          action={
            <Link
              href="/travail"
              className="inline-flex min-h-11 items-center rounded-[10px] bg-ink px-4 text-[14.5px] font-medium text-bg"
            >
              Aller dans Travail
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="grid h-fit gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Chapitre">
            {disponibles.map((c, i) => {
              const m = matieres.find((x) => x.id === c.matiereId);
              const actif = c.id === chapitreId;
              return (
                <motion.button
                  key={c.id}
                  role="radio"
                  aria-checked={actif}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  onClick={() => setChapitreId(c.id)}
                  className="rounded-2xl border-2 p-4 text-left shadow-card transition-colors"
                  style={{
                    borderColor: actif ? m?.couleur : "var(--line)",
                    background: actif ? pastel(m?.couleur ?? "#888", 12) : "var(--surface)",
                  }}
                >
                  <span className="text-[13px] font-semibold" style={{ color: encre(m?.couleur ?? "#888") }}>
                    {m?.emoji} {m?.nom}
                  </span>
                  <span className="mt-1 block text-[17px] font-semibold">{c.titre}</span>
                  <span className="text-[13px] text-muted">
                    {c.exercices.length > 0
                      ? pluriel(c.exercices.length, "exercice rédigé", "exercices rédigés")
                      : `QCM tirés de tes ${c.flashcards.length} flashcards`}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <Carte className="h-fit">
            <p className="text-[17px] font-semibold">Nombre de questions</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-[36px] text-accent">{n}</span>
              <span className="text-[13px] text-muted">{chapitre ? `max. ${max}` : ""}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={n}
              disabled={!chapitre || max === min}
              aria-label="Nombre de questions"
              onChange={(e) => setNombre(Number(e.target.value))}
              className="luno-range mt-3 disabled:opacity-50"
              style={{ "--fill": `${max > min ? ((n - min) / (max - min)) * 100 : 100}%` } as React.CSSProperties}
            />
            <Bouton className="mt-6 w-full" disabled={!chapitre} onClick={lancer}>
              {chapitre ? "Commencer" : "Choisis un chapitre"}
            </Bouton>
          </Carte>
        </div>
      )}
    </div>
  );
}
