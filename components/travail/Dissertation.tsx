"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, BookOpen, Check, ChevronDown, ChevronRight, Eye, ListChecks, PenLine, Quote, RotateCcw } from "lucide-react";
import { formule } from "@/components/Formule";
import { ZoneDictee } from "@/components/Dictee";
import { Bouton, ZoneAction, classeSaisie } from "@/components/ui";
import type { CitationDiss, Dissertation, SujetDiss } from "@/lib/dissertation";
import { origineCitation } from "@/contenu/dissertations";
import { lienTravail } from "@/lib/liens";
import { encre, pastel } from "@/lib/store";
import type { Matiere } from "@/lib/types";

type Vue = "sujets" | "citations" | "methode";
const VUES: { id: Vue; label: string; Icone: typeof BookOpen }[] = [
  { id: "sujets", label: "Sujets", Icone: PenLine },
  { id: "citations", label: "Citations", Icone: Quote },
  { id: "methode", label: "Méthode", Icone: ListChecks },
];

/** Lecture et écriture prudentes du stockage du navigateur (brouillons de plan, grille cochée). */
function lire<T>(cle: string, defaut: T): T {
  try {
    const v = localStorage.getItem(cle);
    return v ? (JSON.parse(v) as T) : defaut;
  } catch {
    return defaut;
  }
}
function ecrire(cle: string, v: unknown) {
  try {
    localStorage.setItem(cle, JSON.stringify(v));
  } catch {}
}

/**
 * Préparer la dissertation sur une œuvre (demandé le 2026-11-26 pour la dissertation du
 * 10/12 sur les Cahiers de Douai) : sujets d'entraînement (faire son plan, puis le comparer
 * au plan proposé), banque de citations avec un quiz « De quel poème ? », et la méthode.
 */
export function VueDissertation({
  matiere,
  diss,
  vue: vueBrute,
  sujetId,
}: {
  matiere: Matiere;
  diss: Dissertation;
  vue: string | null;
  sujetId: string | null;
}) {
  const router = useRouter();
  const vue: Vue = VUES.some((v) => v.id === vueBrute) ? (vueBrute as Vue) : "sujets";
  const foncee = encre(matiere.couleur);
  const lien = (v: Vue, s?: string) =>
    lienTravail({ m: matiere.id, o: "bac", t: diss.id, v: v === "sujets" ? undefined : v, s });
  const sujet = diss.sujets.find((s) => s.id === sujetId);

  return (
    <div>
      <Link
        href={sujet ? lien("sujets") : lienTravail({ m: matiere.id, o: "bac" })}
        scroll={false}
        className="-ml-1 mb-2 inline-flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> {sujet ? "Tous les sujets" : "Bac"}
      </Link>
      <div className="mb-4">
        <p className="surtitre" style={{ color: foncee }}>
          Dissertation · {diss.auteur}
        </p>
        <h2 className="mt-1 text-[28px] leading-tight sm:text-[36px]">{diss.oeuvre}</h2>
        <p className="mt-0.5 text-[13.5px] text-muted">Parcours : {diss.parcours}</p>
      </div>

      {!sujet && (
        <div role="tablist" aria-label="Préparer la dissertation" className="mb-5 grid grid-cols-3 gap-1 rounded-[18px] border border-line bg-surface p-1 shadow-card">
          {VUES.map(({ id, label, Icone }) => (
            <button
              key={id}
              role="tab"
              aria-selected={vue === id}
              onClick={() => router.replace(lien(id), { scroll: false })}
              className={`flex min-h-11 items-center justify-center gap-1.5 rounded-[14px] text-[13.5px] font-semibold transition-colors duration-200 sm:text-[14.5px] ${
                vue === id ? "bg-ink text-bg" : "text-muted hover:text-ink"
              }`}
            >
              <Icone size={16} /> {label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={sujet ? sujet.id : vue}
          initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {sujet ? (
            <VueSujet diss={diss} sujet={sujet} couleur={matiere.couleur} />
          ) : vue === "sujets" ? (
            <ListeSujets diss={diss} lien={(s) => lien("sujets", s)} couleur={matiere.couleur} />
          ) : vue === "citations" ? (
            <Citations diss={diss} couleur={matiere.couleur} />
          ) : (
            <Methode diss={diss} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ListeSujets({ diss, lien, couleur }: { diss: Dissertation; lien: (s: string) => string; couleur: string }) {
  return (
    <div className="mx-auto max-w-[820px] space-y-5">
      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <p className="surtitre text-accent">Le parcours</p>
        <h3 className="mt-1 text-[20px]">« {diss.parcours} »</h3>
        <ul className="mt-2 space-y-2">
          {diss.parcoursSens.map((t) => (
            <li key={t} className="flex gap-2.5 text-[14.5px] leading-relaxed">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{formule(t)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {diss.axes.map((a) => (
            <div key={a.id} className="rounded-[14px] p-3" style={{ background: pastel(couleur, 14) }}>
              <p className="text-[14px] font-semibold leading-snug">{a.titre}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{a.resume}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[13px] text-muted">
          Choisis un sujet, fais ton plan au brouillon, puis compare avec le plan proposé.
        </p>
        <ol className="space-y-2">
          {diss.sujets.map((s, i) => {
            const fait = lire<string>(`luno-diss-plan-${diss.id}-${s.id}`, "").trim().length > 0;
            return (
              <li key={s.id}>
                <Link
                  href={lien(s.id)}
                  scroll={false}
                  className="group flex items-center gap-3 rounded-[18px] border border-line bg-surface p-4 shadow-card transition-colors hover:border-accent/60"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-accent-soft font-display text-[15px] text-accent">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15.5px] font-medium leading-snug">{s.sujet}</span>
                    <span className="mt-0.5 block text-[12.5px] text-muted">
                      {s.plan.length} parties · {fait ? "ton plan est commencé" : "plan à faire"}
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function VueSujet({ diss, sujet, couleur }: { diss: Dissertation; sujet: SujetDiss; couleur: string }) {
  const clePlan = `luno-diss-plan-${diss.id}-${sujet.id}`;
  const cleGrille = `luno-diss-grille-${diss.id}-${sujet.id}`;
  const [plan, setPlan] = useState(() => lire<string>(clePlan, ""));
  const [voir, setVoir] = useState(false);
  const [grille, setGrille] = useState<number[]>(() => lire<number[]>(cleGrille, []));
  const [ouverte, setOuverte] = useState<number | null>(0);
  const [mode, setMode] = useState<"plan" | "developpe">("plan");
  const developpe = mode === "developpe" && sujet.developpe;
  const cocher = (i: number) => {
    const g = grille.includes(i) ? grille.filter((x) => x !== i) : [...grille, i];
    setGrille(g);
    ecrire(cleGrille, g);
  };

  return (
    <div className="mx-auto max-w-[860px] space-y-5">
      <div className="rounded-[18px] border border-line p-5 shadow-card" style={{ background: pastel(couleur, 12) }}>
        <p className="surtitre text-accent">Le sujet</p>
        <p className="mt-1 font-display text-[21px] leading-snug sm:text-[24px]">{sujet.sujet}</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{sujet.type}</p>
      </div>

      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <p className="surtitre text-accent">1. Ton plan d’abord</p>
        <p className="mt-1 text-[13.5px] text-muted">
          Problématique, puis tes parties et un poème par argument. Ce brouillon reste dans ce navigateur.
        </p>
        <ZoneDictee
          value={plan}
          changer={(v: string) => {
            setPlan(v);
            ecrire(clePlan, v);
          }}
          placeholder={"Problématique : …\nI. …\n  a) idée + poème + citation\nII. …"}
          rows={8}
          aria-label="Ton plan"
          className={`${classeSaisie} mt-3 min-h-[180px] leading-relaxed`}
        />
        {!voir && (
          <ZoneAction cle={`voir-${sujet.id}`} className="mt-4">
            <Bouton onClick={() => setVoir(true)} variante={plan.trim() ? "plein" : "contour"}>
              <Eye size={16} /> {plan.trim() ? "Comparer avec le plan proposé" : "Voir le plan proposé sans faire le mien"}
            </Bouton>
          </ZoneAction>
        )}
      </div>

      {voir && (
        <>
          <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
            <p className="surtitre text-accent">2. Analyser le sujet</p>
            <ul className="mt-2 space-y-1.5">
              {sujet.motsCles.map((m) => (
                <li key={m.mot} className="text-[14.5px] leading-snug">
                  <b className="font-semibold">{m.mot}</b> : {m.sens}
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-[12px] bg-accent-soft p-3 text-[14.5px] leading-snug">
              <span className="surtitre mb-1 block text-accent">Problématique</span>
              {sujet.problematique}
            </p>
          </div>

          {sujet.developpe && (
            <div role="radiogroup" aria-label="Corrigé" className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-surface p-1 shadow-card">
              {(
                [
                  ["plan", "Intro et plan détaillé"],
                  ["developpe", "Copie développée"],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className={`min-h-11 rounded-xl px-2 text-[14px] font-semibold leading-tight transition-colors duration-200 ${
                    mode === m ? "bg-accent-soft text-ink" : "text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {developpe ? (
            <CopieDeveloppee sujet={sujet} />
          ) : (
          <>
          {sujet.introduction && (
            <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
              <p className="surtitre text-accent">3. L’introduction rédigée</p>
              <TexteCopie texte={sujet.introduction} className="mt-2" />
            </div>
          )}
          <div className="space-y-2">
            <p className="surtitre px-1 text-accent">{sujet.introduction ? "4" : "3"}. Le plan proposé</p>
            {sujet.plan.map((p, i) => (
              <div key={p.titre}>
                <div className="rounded-[18px] border border-line bg-surface shadow-card">
                  <button
                    type="button"
                    aria-expanded={ouverte === i}
                    onClick={() => setOuverte(ouverte === i ? null : i)}
                    className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[17px] leading-snug">{p.titre}</span>
                      <span className="block text-[13px] leading-snug text-muted">{p.idee}</span>
                    </span>
                    <ChevronDown size={18} className={`shrink-0 text-muted transition-transform duration-200 ${ouverte === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className="repli" data-ouvert={ouverte === i}>
                    <div>
                      <ol className="space-y-2.5 px-4 pb-4">
                        {p.arguments.map((a, k) => (
                          <li key={a.idee} className="rounded-[14px] border border-line p-3">
                            <p className="text-[14.5px] font-semibold leading-snug">
                              {String.fromCharCode(97 + k)}) {a.idee}
                            </p>
                            <p className="mt-1 text-[12.5px] font-semibold text-accent">« {a.poeme} »</p>
                            <p className="mt-0.5 font-display text-[15px] italic leading-snug">{a.citation}</p>
                            <Origine citation={a.citation} />
                            <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{a.analyse}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
                {sujet.transitions[i] && (
                  <p className="px-4 py-2 text-[13px] italic leading-snug text-muted">Transition : {sujet.transitions[i]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
            <p className="surtitre text-accent">{sujet.introduction ? "5" : "4"}. Conclusion et ouverture</p>
            <p className="mt-1.5 text-[14.5px] leading-relaxed">{sujet.conclusion}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              <b className="font-semibold text-ink">Ouverture :</b> {sujet.ouverture}
            </p>
          </div>
          </>
          )}

          <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
            <p className="surtitre text-accent">Pièges</p>
            <ul className="mt-1 space-y-1">
              {sujet.pieges.map((t) => (
                <li key={t} className="text-[14px] leading-snug">· {t}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
            <p className="surtitre text-accent">Juge ton plan</p>
            <p className="mt-1 text-[13px] text-muted">Coche ce que ton plan respecte vraiment.</p>
            <ul className="mt-2 space-y-1.5">
              {diss.criteres.map((c, i) => {
                const ok = grille.includes(i);
                return (
                  <li key={c}>
                    <button type="button" onClick={() => cocher(i)} className="flex w-full items-start gap-2.5 text-left text-[14px] leading-snug">
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border ${ok ? "border-accent bg-accent text-on-accent" : "border-line"}`}
                      >
                        {ok && <Check size={13} strokeWidth={3} />}
                      </span>
                      <span>{c}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-[13px] font-semibold text-accent">
              {grille.length} / {diss.criteres.length}
              {grille.length === diss.criteres.length ? " · prêt pour le jour J" : ""}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/** Paragraphes d'une copie, séparés par une ligne vide. */
function TexteCopie({ texte, className = "" }: { texte: string; className?: string }) {
  return (
    <div className={`space-y-3 text-[15px] leading-relaxed ${className}`}>
      {texte.split(/\n\s*\n/).map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}

/** La copie entière, comme sur la feuille : introduction, parties, conclusion. */
function CopieDeveloppee({ sujet }: { sujet: SujetDiss }) {
  const d = sujet.developpe!;
  const romain = ["I", "II", "III", "IV"];
  return (
    <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card sm:p-7">
      <p className="surtitre text-accent">La copie développée</p>
      <p className="mt-1 text-[13px] leading-snug text-muted">
        Un modèle sur un sujet d’entraînement : lis comment chaque idée devient un paragraphe, puis rédige la tienne.
      </p>
      {sujet.introduction && (
        <section className="mt-5">
          <p className="surtitre mb-1.5 text-muted">Introduction</p>
          <TexteCopie texte={sujet.introduction} />
        </section>
      )}
      {d.parties.map((t, i) => (
        <section key={i} className="mt-6 border-t border-line pt-5">
          <p className="surtitre mb-1.5 text-muted">
            Partie {romain[i] ?? i + 1}
            {sujet.plan[i] ? ` · ${sujet.plan[i].titre.replace(/^[IVX]+\.\s*/, "")}` : ""}
          </p>
          <TexteCopie texte={t} />
        </section>
      ))}
      <section className="mt-6 border-t border-line pt-5">
        <p className="surtitre mb-1.5 text-muted">Conclusion</p>
        <TexteCopie texte={d.conclusion} />
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------

function melanger<T>(t: T[]): T[] {
  const c = [...t];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function Citations({ diss, couleur }: { diss: Dissertation; couleur: string }) {
  const [quiz, setQuiz] = useState(false);
  return (
    <div className="mx-auto max-w-[820px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13.5px] text-muted">{diss.citations.length} citations à savoir par cœur, classées par axe.</p>
        <Bouton variante={quiz ? "contour" : "plein"} onClick={() => setQuiz(!quiz)}>
          {quiz ? "Revoir la liste" : "Je m’entraîne"}
        </Bouton>
      </div>
      {quiz ? (
        <QuizCitations diss={diss} />
      ) : (
        diss.axes.map((a) => (
          <section key={a.id} className="mb-5">
            <h3 className="mb-2 text-[18px]">{a.titre}</h3>
            <div className="space-y-2">
              {diss.citations
                .filter((c) => c.axe === a.id)
                .map((c) => (
                  <div key={c.citation} className="rounded-[16px] border border-line bg-surface p-3.5 shadow-card">
                    <p className="font-display text-[15.5px] italic leading-snug">{c.citation}</p>
                    <p className="mt-1.5 text-[12.5px]">
                      <span className="rounded-full px-2 py-0.5 font-semibold" style={{ background: pastel(couleur, 22), color: encre(couleur, 75) }}>
                        {c.poeme}
                      </span>{" "}
                      <span className="text-muted">· {c.procede}</span>
                    </p>
                    <p className="mt-1 text-[13.5px] leading-snug">{c.prouve}</p>
                    <Origine citation={c.citation} />
                  </div>
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

/** « De quel poème ? » : la citation, quatre poèmes au choix ; une citation ratée revient. */
function QuizCitations({ diss }: { diss: Dissertation }) {
  const poemes = useMemo(() => [...new Set(diss.citations.map((c) => c.poeme))], [diss]);
  const nouvelle = () => melanger(diss.citations).slice(0, 10);
  const [file, setFile] = useState<CitationDiss[]>(nouvelle);
  const [i, setI] = useState(0);
  const [choix, setChoix] = useState<string | null>(null);
  const [justes, setJustes] = useState(0);
  const options = useMemo(() => {
    const c = file[i];
    if (!c) return [];
    return melanger([c.poeme, ...melanger(poemes.filter((p) => p !== c.poeme)).slice(0, 3)]);
  }, [file, i, poemes]);

  if (i >= file.length) {
    return (
      <div className="rounded-[18px] border border-line bg-surface p-6 text-center shadow-card">
        <p className="font-display text-[40px] leading-none">
          {justes}
          <span className="text-[20px] text-muted"> / {file.length}</span>
        </p>
        <p className="mt-2 text-[14px] text-muted">Une citation sue, c’est un argument prêt le jour J.</p>
        <ZoneAction cle="fin-citations" className="mt-4 flex justify-center">
          <Bouton
            onClick={() => {
              setFile(nouvelle());
              setI(0);
              setChoix(null);
              setJustes(0);
            }}
          >
            <RotateCcw size={16} /> Recommencer
          </Bouton>
        </ZoneAction>
      </div>
    );
  }
  const c = file[i];
  const repondu = choix !== null;
  return (
    <div>
      <p className="mb-2 text-[12.5px] font-semibold text-muted">
        {i + 1} / {file.length}
      </p>
      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <p className="surtitre text-accent">De quel poème ?</p>
        <p className="mt-2 font-display text-[19px] italic leading-snug">{c.citation}</p>
        <Origine citation={c.citation} />
        <div className="mt-4 grid gap-2">
          {options.map((p) => {
            const etat = !repondu ? "" : p === c.poeme ? "juste" : p === choix ? "faux" : "neutre";
            return (
              <button
                key={p}
                type="button"
                disabled={repondu}
                onClick={() => {
                  setChoix(p);
                  if (p === c.poeme) setJustes((j) => j + 1);
                  // Ratée : elle revient trois questions plus loin, une fois.
                  else if (!file.slice(i + 1).includes(c)) {
                    const f = [...file];
                    f.splice(Math.min(i + 4, f.length), 0, c);
                    setFile(f);
                  }
                }}
                className={`min-h-12 rounded-[14px] border px-4 py-2.5 text-left text-[15px] transition-colors ${
                  etat === "juste"
                    ? "border-ok bg-[color-mix(in_oklab,var(--ok)_14%,var(--surface))]"
                    : etat === "faux"
                      ? "border-bad bg-[color-mix(in_oklab,var(--bad)_12%,var(--surface))]"
                      : etat === "neutre"
                        ? "border-line opacity-60"
                        : "border-line hover:border-accent/60"
                }`}
              >
                « {p} »
              </button>
            );
          })}
        </div>
        {repondu && (
          <div className="mt-4 rounded-[14px] bg-accent-soft p-3.5 text-[14px] leading-snug">
            <b className="font-semibold">{c.procede}</b> : {c.prouve}
          </div>
        )}
      </div>
      {repondu && (
        <ZoneAction cle={`cit-${i}`} className="mt-4 flex justify-end">
          <Bouton
            onClick={() => {
              setChoix(null);
              setI(i + 1);
            }}
          >
            {i + 1 >= file.length ? "Voir le bilan" : "Suivante"}
          </Bouton>
        </ZoneAction>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function Methode({ diss }: { diss: Dissertation }) {
  return (
    <div className="mx-auto max-w-[820px] space-y-3">
      <p className="text-[13.5px] text-muted">Pour l’épreuve de 4 heures. En classe, réduis les temps dans les mêmes proportions.</p>
      {diss.methode.map((e) => (
        <div key={e.titre} className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[18px]">{e.titre}</h3>
            {e.temps && <span className="shrink-0 text-[12.5px] text-muted">{e.temps}</span>}
          </div>
          <ul className="mt-2 space-y-1.5">
            {e.conseils.map((t) => (
              <li key={t} className="flex gap-2.5 text-[14.5px] leading-relaxed">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{formule(t)}</span>
              </li>
            ))}
          </ul>
          {e.exemple && <p className="mt-2 rounded-[12px] bg-accent-soft p-3 text-[13.5px] italic leading-snug">{e.exemple}</p>}
        </div>
      ))}
    </div>
  );
}

/** D'où vient la citation : texte étudié, notes de cours, ou à vérifier dans le recueil. */
function Origine({ citation }: { citation: string }) {
  const o = origineCitation(citation);
  return (
    <p className={`mt-1 text-[11.5px] font-semibold ${o === "verifier" ? "text-accent" : "text-muted"}`}>
      {o === "texte"
        ? "✓ Vérifiée mot pour mot sur le texte du poème"
        : o === "cours"
          ? "✓ Citée dans tes notes de cours"
          : "À vérifier dans ton recueil avant de l’apprendre"}
    </p>
  );
}
