"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, RotateCcw, Target, X } from "lucide-react";
import { pastel, useLuno } from "@/lib/store";
import { genererQcm, MODE_IA } from "@/lib/ai";
import type { Qcm } from "@/lib/types";
import { BadgeDemo, Bouton, Carte, Chargement, EnTete, EtatVide } from "@/components/ui";

const MIN_CARTES = 4;

export default function Exercices() {
  const { matieres, chapitres } = useLuno();
  const [chapitreId, setChapitreId] = useState<string | null>(null);
  const [nombre, setNombre] = useState(5);
  const [chargement, setChargement] = useState(false);
  const [questions, setQuestions] = useState<Qcm[] | null>(null);
  const [index, setIndex] = useState(0);
  const [choisi, setChoisi] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const chapitre = chapitres.find((c) => c.id === chapitreId) ?? null;
  const max = chapitre ? Math.min(10, chapitre.flashcards.length) : 10;
  const n = Math.min(nombre, max);

  const lancer = async () => {
    if (!chapitre) return;
    setChargement(true);
    setQuestions(await genererQcm(chapitre, n));
    setIndex(0);
    setScore(0);
    setChoisi(null);
    setChargement(false);
  };
  const quitter = () => setQuestions(null);

  if (chargement) return <Chargement texte="Préparation des exercices…" />;

  // Séance en cours
  if (questions && index < questions.length) {
    const q = questions[index];
    return (
      <div className="mx-auto max-w-[640px]">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${(index / questions.length) * 100}%` }} />
          </div>
          <span className="text-[13px] font-semibold text-muted">
            {index + 1} / {questions.length}
          </span>
          <button onClick={quitter} aria-label="Quitter" className="rounded-full p-1.5 text-muted hover:bg-ink/5">
            <X size={18} />
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[13px] font-bold uppercase tracking-widest text-muted">À quel terme correspond…</p>
            <h2 className="mt-2 text-[24px] font-bold leading-snug">{q.question}</h2>
            <div className="mt-6 flex flex-col gap-2.5">
              {q.choix.map((c, i) => {
                const bon = i === q.bonneReponse;
                const etat =
                  choisi === null ? "neutre" : bon ? "bon" : i === choisi ? "faux" : "eteint";
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
                    }}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-[16px] font-semibold transition-colors ${
                      etat === "bon"
                        ? "border-ok bg-ok/10 text-ok"
                        : etat === "faux"
                          ? "border-bad bg-bad/10 text-bad"
                          : etat === "eteint"
                            ? "border-line bg-surface opacity-50"
                            : "border-line bg-surface hover:border-accent"
                    }`}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-[13px]">
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onAnimationComplete={() =>
                    document.getElementById("correction")?.scrollIntoView({ behavior: "smooth", block: "nearest" })
                  }
                  id="correction"
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
        className="mx-auto flex max-w-[460px] flex-col items-center rounded-[18px] border border-line bg-surface p-10 text-center shadow-card"
      >
        <div className="relative mb-5">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r={R} fill="none" stroke="var(--color-line)" strokeWidth="12" />
            <motion.circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={pct >= 0.5 ? "var(--color-ok)" : "var(--color-bad)"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - pct) }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-[32px] font-bold">
            {score}/{questions.length}
          </span>
        </div>
        <h2 className="text-[28px] font-bold">
          {pct === 1 ? "Sans faute !" : pct >= 0.7 ? "Bien joué" : pct >= 0.5 ? "Pas mal" : "À retravailler"}
        </h2>
        <p className="mt-1 text-[15px] text-muted">{chapitre?.titre}</p>
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
  const avecCartes = chapitres.filter((c) => c.flashcards.length >= MIN_CARTES);
  return (
    <div>
      <EnTete titre="S'exercer" sousTitre="Des exercices sur tes chapitres, corrigés tout de suite." />
      {MODE_IA === "demo" && (
        <div className="mb-6 flex flex-wrap items-center gap-2.5 rounded-2xl bg-accent-soft px-4 py-3 text-[14px]">
          <BadgeDemo />
          <span>
            Pour l&apos;instant, les exercices sont des QCM construits à partir de tes flashcards. Les exercices
            rédigés et corrigés par IA arriveront ensuite.
          </span>
        </div>
      )}
      {avecCartes.length === 0 ? (
        <EtatVide
          icone={<Target size={26} />}
          titre="Pas encore de quoi s'exercer"
          texte={`Il faut un chapitre avec au moins ${MIN_CARTES} flashcards. Ajoute un cours dans l'onglet Travail et génère ses flashcards.`}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="grid h-fit gap-3 sm:grid-cols-2">
            {avecCartes.map((c, i) => {
              const m = matieres.find((x) => x.id === c.matiereId);
              const actif = c.id === chapitreId;
              return (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  onClick={() => setChapitreId(c.id)}
                  className="rounded-2xl border-2 p-4 text-left shadow-card transition-colors"
                  style={{
                    borderColor: actif ? m?.couleur : "var(--color-line)",
                    background: actif ? pastel(m?.couleur ?? "#888", 12) : "var(--color-surface)",
                  }}
                >
                  <span className="text-[13px] font-semibold" style={{ color: m?.couleur }}>
                    {m?.emoji} {m?.nom}
                  </span>
                  <span className="mt-1 block text-[17px] font-bold">{c.titre}</span>
                  <span className="text-[13px] text-muted">{c.flashcards.length} flashcards</span>
                </motion.button>
              );
            })}
          </div>
          <Carte className="h-fit">
            <p className="text-[17px] font-bold">Nombre de questions</p>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-[36px] font-bold text-accent">{n}</span>
              <span className="text-[13px] text-muted">max. {max}</span>
            </div>
            <input
              type="range"
              min={Math.min(3, max)}
              max={max}
              value={n}
              aria-label="Nombre de questions"
              onChange={(e) => setNombre(Number(e.target.value))}
              className="luno-range mt-3"
              style={
                {
                  "--fill": `${max > Math.min(3, max) ? ((n - Math.min(3, max)) / (max - Math.min(3, max))) * 100 : 100}%`,
                } as React.CSSProperties
              }
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
