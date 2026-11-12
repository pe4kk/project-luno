"use client";

import { useState, type ReactNode } from "react";
import { AvecBrouillon } from "@/components/Brouillon";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  RotateCcw,
  Target,
  X,
} from "lucide-react";
import { encre, pastel, useLuno } from "@/lib/store";
import {
  MIN_CARTES_QCM,
  maxQuestions,
  melangerAutrement,
  peutSExercer,
  preparerExercices,
  reponseJuste,
} from "@/lib/contenu";
import type {
  Exercice,
  Ordre,
  Ouverte,
  Qcm,
  Trou,
  VraiFaux,
} from "@/lib/types";
import {
  Bouton,
  BoutonIcone,
  Carte,
  EnTete,
  EtatVide,
  classeSaisie,
  pluriel,
} from "@/components/ui";
import { formule, texteBrut } from "@/components/Formule";
import { Curseur } from "@/components/Curseur";
import { Emoji } from "@/components/Emoji";
import { ModeCalculs, ModeProblemes } from "@/components/exercices/Modes";
import { ModeInterro } from "@/components/exercices/Interro";
import { classePastille, usePastille } from "@/lib/pastille";

function ModeSerie({ entete }: { entete: ReactNode }) {
  const { matieres, chapitres, noterFlashcard } = useLuno();
  const [chapitreId, setChapitreId] = useState<string | null>(null);
  const [nombre, setNombre] = useState(5);
  const [questions, setQuestions] = useState<Exercice[] | null>(null);
  const [index, setIndex] = useState(0);
  const [resultat, setResultat] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const disponibles = chapitres.filter(peutSExercer);
  const chapitre = disponibles.find((c) => c.id === chapitreId) ?? null;
  const max = chapitre ? maxQuestions(chapitre) : 10;
  const min = Math.min(3, max);
  const n = Math.max(min, Math.min(nombre, max));

  const lancer = () => {
    if (!chapitre) return;
    setQuestions(preparerExercices(chapitre, n));
    setIndex(0);
    setScore(0);
    setResultat(null);
  };
  const quitter = () => setQuestions(null);

  // Séance en cours
  if (questions && chapitre && index < questions.length) {
    const q = questions[index];
    const repondre = (juste: boolean) => {
      if (resultat !== null) return;
      setResultat(juste);
      if (juste) setScore((x) => x + 1);
      // Une erreur remet la flashcard d'origine dans les cartes à revoir.
      else if ("carteId" in q && q.carteId)
        noterFlashcard(chapitre.id, q.carteId, false);
    };
    const explication = "explication" in q ? q.explication : "";
    return (
      <AvecBrouillon cle={`serie-${chapitre.id}-${index}`}>
      <div className="mx-auto max-w-[640px]">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${(index / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-[13px] font-semibold text-muted">
            {index + 1} / {questions.length}
          </span>
          <BoutonIcone
            label="Quitter les exercices"
            onClick={quitter}
            className="-mr-2"
          >
            <X size={18} />
          </BoutonIcone>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, transform: "translate3d(40px, 0, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0px, 0, 0)" }}
            exit={{ opacity: 0, transform: "translate3d(-40px, 0, 0)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Enonce
              q={q}
              titre={chapitre.titre}
              resultat={resultat}
              repondre={repondre}
            />
            <AnimatePresence>
              {resultat !== null && (
                <motion.div
                  id="correction"
                  role="status"
                  initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
                  animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                  onAnimationComplete={() =>
                    document
                      .getElementById("correction")
                      ?.scrollIntoView({ behavior: "smooth", block: "nearest" })
                  }
                  className="mt-5 flex scroll-mb-28 flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink/5 p-4"
                >
                  <p className="min-w-0 flex-1 text-[14.5px]">
                    <strong>
                      {q.type === "ouverte"
                        ? resultat
                          ? "C'est noté."
                          : "À retravailler."
                        : resultat
                          ? "Bonne réponse."
                          : "Pas tout à fait."}
                    </strong>{" "}
                    {formule(explication)}
                  </p>
                  <Bouton
                    autoFocus
                    onClick={() => {
                      setResultat(null);
                      setIndex((i) => i + 1);
                    }}
                  >
                    {index + 1 === questions.length
                      ? "Voir le résultat"
                      : "Suivante"}
                  </Bouton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
      </AvecBrouillon>
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
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            className="-rotate-90"
            aria-hidden
          >
            <circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke="var(--line)"
              strokeWidth="12"
            />
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
          {pct === 1
            ? "Sans faute !"
            : pct >= 0.7
              ? "Bien joué"
              : pct >= 0.5
                ? "Pas mal"
                : "À retravailler"}
        </h2>
        <p className="mt-1 text-[15px] text-muted">{chapitre?.titre}</p>
        {score < questions.length &&
          questions.some((q) => "carteId" in q && q.carteId) && (
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
      {entete}
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
          <div
            className="grid h-fit gap-3 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Chapitre"
          >
            {disponibles.map((c, i) => {
              const m = matieres.find((x) => x.id === c.matiereId);
              const actif = c.id === chapitreId;
              return (
                <motion.button
                  key={c.id}
                  role="radio"
                  aria-checked={actif}
                  initial={{ opacity: 0, transform: "translate3d(0, 12px, 0)" }}
                  animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  onClick={() => setChapitreId(c.id)}
                  className="rounded-2xl border-2 p-4 text-left shadow-card transition-colors"
                  style={{
                    borderColor: actif ? m?.couleur : "var(--line)",
                    background: actif
                      ? pastel(m?.couleur ?? "#888", 12)
                      : "var(--surface)",
                  }}
                >
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: encre(m?.couleur ?? "#888") }}
                  >
                    <Emoji e={m?.emoji} /> {m?.nom}
                  </span>
                  <span className="mt-1 block text-[17px] font-semibold">
                    {c.titre}
                  </span>
                  <span className="text-[13px] text-muted">
                    {c.exercices.length > 0
                      ? pluriel(
                          c.exercices.length,
                          "exercice rédigé",
                          "exercices rédigés",
                        )
                      : `Exercices tirés de tes ${c.flashcards.length} flashcards`}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <Carte className="h-fit">
            <p className="text-[17px] font-semibold">Nombre de questions</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-[36px] text-accent">{n}</span>
              <span className="text-[13px] text-muted">
                {chapitre ? `max. ${max}` : ""}
              </span>
            </div>
            <Curseur
              min={min}
              max={max}
              value={n}
              disabled={!chapitre || max === min}
              label="Nombre de questions"
              onChange={setNombre}
              className="mt-3"
            />
            <Bouton
              className="mt-6 w-full"
              disabled={!chapitre}
              onClick={lancer}
            >
              {chapitre ? "Commencer" : "Choisis un chapitre"}
            </Bouton>
          </Carte>
        </div>
      )}
    </div>
  );
}

const TYPES: Record<string, string> = {
  qcm: "Question à choix",
  vraiFaux: "Vrai ou faux",
  trou: "Texte à trous",
  ordre: "Remise en ordre",
  ouverte: "Question ouverte",
};

type PropsEnonce<T> = {
  q: T;
  resultat: boolean | null;
  repondre: (juste: boolean) => void;
};

const classeChoix = (etat: "neutre" | "bon" | "faux" | "eteint") =>
  `flex min-h-[52px] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[16px] font-medium transition-colors ${
    etat === "bon"
      ? "border-ok bg-ok/10 text-ok"
      : etat === "faux"
        ? "border-bad bg-bad/10 text-bad"
        : etat === "eteint"
          ? "border-line bg-surface text-muted"
          : "border-line bg-surface hover:border-accent"
  }`;

function Enonce({ q, titre, ...p }: PropsEnonce<Exercice> & { titre: string }) {
  const type = q.type ?? "qcm";
  return (
    <>
      <p className="surtitre text-muted">
        {TYPES[type]} · {titre}
      </p>
      {type === "qcm" && <ExQcm q={q as Qcm} {...p} />}
      {type === "vraiFaux" && <ExVraiFaux q={q as VraiFaux} {...p} />}
      {type === "trou" && <ExTrou q={q as Trou} {...p} />}
      {type === "ordre" && <ExOrdre q={q as Ordre} {...p} />}
      {type === "ouverte" && <ExOuverte q={q as Ouverte} {...p} />}
    </>
  );
}

function ExQcm({ q, resultat, repondre }: PropsEnonce<Qcm>) {
  const [choisi, setChoisi] = useState<number | null>(null);
  return (
    <>
      {q.consigne && (
        <p className="mt-2 text-[14.5px] text-muted">{formule(q.consigne)}</p>
      )}
      <h2 className="mt-2 text-[22px] leading-snug sm:text-[24px]">
        {formule(q.question)}
      </h2>
      <div
        className="mt-5 flex flex-col gap-2.5"
        role="group"
        aria-label="Réponses"
      >
        {q.choix.map((c, i) => {
          const bon = i === q.bonneReponse;
          const etat =
            resultat === null
              ? "neutre"
              : bon
                ? "bon"
                : i === choisi
                  ? "faux"
                  : "eteint";
          return (
            <motion.button
              key={c}
              disabled={resultat !== null}
              whileHover={resultat === null ? { x: 4 } : undefined}
              animate={
                etat === "faux"
                  ? { x: [0, -8, 8, -5, 5, 0] }
                  : etat === "bon"
                    ? { scale: [1, 1.03, 1] }
                    : {}
              }
              transition={{ duration: 0.4 }}
              onClick={() => {
                setChoisi(i);
                repondre(bon);
              }}
              className={classeChoix(etat)}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-[13px] font-semibold">
                {etat === "bon" ? (
                  <Check size={15} />
                ) : etat === "faux" ? (
                  <X size={15} />
                ) : (
                  "ABCD"[i]
                )}
              </span>
              {formule(c)}
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

function ExVraiFaux({ q, resultat, repondre }: PropsEnonce<VraiFaux>) {
  const [choisi, setChoisi] = useState<boolean | null>(null);
  return (
    <>
      <h2 className="mt-2 text-[22px] leading-snug sm:text-[24px]">
        {formule(q.affirmation)}
      </h2>
      <div
        className="mt-5 grid grid-cols-2 gap-3"
        role="group"
        aria-label="Réponses"
      >
        {[true, false].map((v) => {
          const bon = v === q.vrai;
          const etat =
            resultat === null
              ? "neutre"
              : bon
                ? "bon"
                : v === choisi
                  ? "faux"
                  : "eteint";
          return (
            <button
              key={String(v)}
              disabled={resultat !== null}
              onClick={() => {
                setChoisi(v);
                repondre(bon);
              }}
              className={classeChoix(etat) + " justify-center !text-[17px]"}
            >
              {v ? "Vrai" : "Faux"}
            </button>
          );
        })}
      </div>
    </>
  );
}

function ExTrou({ q, resultat, repondre }: PropsEnonce<Trou>) {
  const [saisie, setSaisie] = useState("");
  const [avant, apres] = q.texte.split("___");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (saisie.trim()) repondre(reponseJuste(saisie, q.reponses));
      }}
    >
      <h2 className="mt-2 text-[22px] leading-snug sm:text-[24px]">
        {formule(avant)}
        <span
          className={`mx-1 inline-block min-w-[90px] rounded-lg border-b-2 px-2 text-center ${
            resultat === null
              ? "border-accent text-accent"
              : resultat
                ? "border-ok bg-ok/10 text-ok"
                : "border-bad bg-bad/10 text-bad"
          }`}
        >
          {resultat === null ? saisie || "…" : formule(q.reponses[0])}
        </span>
        {formule(apres ?? "")}
      </h2>
      <div className="mt-5 flex gap-2">
        <input
          autoFocus
          aria-label="Mot manquant"
          autoComplete="off"
          autoCapitalize="none"
          disabled={resultat !== null}
          className={classeSaisie + " !bg-surface"}
          placeholder="Écris le mot manquant"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
        />
        <Bouton
          type="submit"
          className="shrink-0"
          disabled={resultat !== null || !saisie.trim()}
        >
          Valider
        </Bouton>
      </div>
      {resultat === false && (
        <p className="mt-2 text-[13.5px] text-muted">
          Tu avais écrit « {saisie.trim()} ».
        </p>
      )}
    </form>
  );
}

function ExOrdre({ q, resultat, repondre }: PropsEnonce<Ordre>) {
  const [ordre, setOrdre] = useState(() => melangerAutrement(q.elements));
  const deplacer = (i: number, pas: number) =>
    setOrdre((o) => {
      const j = i + pas;
      if (j < 0 || j >= o.length) return o;
      const n = [...o];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const liste = resultat === null ? ordre : q.elements;
  return (
    <>
      <h2 className="mt-2 text-[22px] leading-snug sm:text-[24px]">
        {formule(q.consigne)}
      </h2>
      {resultat !== null && (
        <p className="mt-2 text-[14px] text-muted">Voici le bon ordre :</p>
      )}
      <ol className="mt-4 flex flex-col gap-2">
        {liste.map((el, i) => (
          <motion.li
            layout
            key={el}
            transition={{ type: "spring", stiffness: 500, damping: 38 }}
            className={`flex items-center gap-2 rounded-2xl border-2 bg-surface py-1.5 pl-3 pr-1.5 ${
              resultat === null
                ? "border-line"
                : ordre[i] === el
                  ? "border-ok"
                  : "border-bad"
            }`}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-[13px] font-semibold">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 py-1.5 text-[15.5px] font-medium">
              {formule(el)}
            </span>
            {resultat === null && (
              <span className="flex shrink-0">
                <BoutonIcone
                  label={`Monter : ${texteBrut(el)}`}
                  disabled={i === 0}
                  onClick={() => deplacer(i, -1)}
                  className="disabled:opacity-30"
                >
                  <ArrowUp size={17} />
                </BoutonIcone>
                <BoutonIcone
                  label={`Descendre : ${texteBrut(el)}`}
                  disabled={i === liste.length - 1}
                  onClick={() => deplacer(i, 1)}
                  className="disabled:opacity-30"
                >
                  <ArrowDown size={17} />
                </BoutonIcone>
              </span>
            )}
          </motion.li>
        ))}
      </ol>
      {resultat === null && (
        <Bouton
          className="mt-4 w-full"
          onClick={() => repondre(ordre.every((el, i) => el === q.elements[i]))}
        >
          Valider l&apos;ordre
        </Bouton>
      )}
    </>
  );
}

function ExOuverte({ q, resultat, repondre }: PropsEnonce<Ouverte>) {
  const [vu, setVu] = useState(false);
  return (
    <>
      <h2 className="mt-2 text-[22px] leading-snug sm:text-[24px]">
        {formule(q.question)}
      </h2>
      {!vu ? (
        <>
          <p className="mt-3 text-[14.5px] text-muted">
            Réponds de tête ou sur un brouillon, puis compare avec le corrigé.
          </p>
          <Bouton className="mt-4" onClick={() => setVu(true)}>
            <Eye size={16} /> Voir le corrigé
          </Bouton>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, transform: "translate3d(0, 8px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
        >
          <div className="mt-4 rounded-2xl bg-accent-soft p-4">
            <p className="surtitre mb-1 text-accent">Corrigé</p>
            <p className="text-[15.5px] leading-relaxed">
              {formule(q.corrige)}
            </p>
          </div>
          {resultat === null && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Bouton
                variante="contour"
                className="!border-bad/40 !text-bad"
                onClick={() => repondre(false)}
              >
                <X size={17} /> À revoir
              </Bouton>
              <Bouton
                className="!bg-accent !text-on-accent"
                onClick={() => repondre(true)}
              >
                <Check size={17} /> J&apos;avais l&apos;essentiel
              </Bouton>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}

const MODES = [
  { id: "serie", label: "Série", court: "Série" },
  { id: "problemes", label: "Problèmes", court: "Problèmes" },
  { id: "calculs", label: "Calculs", court: "Calculs" },
  { id: "interro", label: "Interro blanche", court: "Interro" },
] as const;
type Mode = (typeof MODES)[number]["id"];

export default function Exercices() {
  const [mode, setMode] = useState<Mode>("serie");
  const { conteneur, pastille } = usePastille(mode);
  const entete = (
    <>
      <EnTete
        titre="S'exercer"
        sousTitre={
          mode === "serie"
            ? "Des exercices sur tes chapitres, corrigés tout de suite."
            : mode === "problemes"
              ? "Des situations réelles, rédigées comme ton prof l'attend."
              : mode === "calculs"
                ? "Expression littérale, A.N., unité, chiffres significatifs."
                : "Comme le jour J : pas de correction avant de rendre la copie."
        }
      />
      <div
        ref={conteneur}
        role="tablist"
        aria-label="Mode"
        className="relative mb-5 flex w-full max-w-[520px] rounded-full border border-line bg-surface p-1 shadow-card sm:inline-flex sm:w-auto"
      >
        <span ref={pastille} className={`${classePastille} rounded-full bg-ink`} />
        {MODES.map((o) => {
          const actif = mode === o.id;
          return (
            <button
              key={o.id}
              role="tab"
              aria-selected={actif}
              data-actif={actif}
              onClick={() => setMode(o.id)}
              className={`relative z-10 min-h-10 flex-1 whitespace-nowrap rounded-full px-2.5 text-[13.5px] font-semibold transition-colors duration-200 sm:flex-none sm:px-4 sm:text-[14px] ${
                actif ? "text-bg" : "text-muted hover:text-ink"
              }`}
            >
              <span className="sm:hidden">{o.court}</span>
              <span className="hidden sm:inline">{o.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
  return mode === "serie" ? (
    <ModeSerie entete={entete} />
  ) : mode === "problemes" ? (
    <ModeProblemes entete={entete} />
  ) : mode === "calculs" ? (
    <ModeCalculs entete={entete} />
  ) : (
    <ModeInterro entete={entete} />
  );
}
