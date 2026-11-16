"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, Clock, Eye, PencilLine } from "lucide-react";
import { formule } from "@/components/Formule";
import { DessinSchema } from "@/components/Schema";
import { SaisieFormule } from "@/components/SaisieFormule";
import { Bouton, Carte, ZoneAction, pluriel } from "@/components/ui";
import { EXOS_TYPES } from "@/contenu/exos-types";
import { lienTravail } from "@/lib/liens";
import { estScientifique, versNotation } from "@/lib/saisie";
import { encre, pastel, useLuno } from "@/lib/store";
import type { Chapitre, ExoType, ExosTypes, Matiere, NoteQuestion, ProgresQuestion } from "@/lib/types";

/**
 * Onglet « Exos types » (maquettes A + B choisies le 2026-11-16) : la liste des types de
 * questions du chapitre sert de tableau de bord (A) ; chaque exo s'ouvre comme un vrai
 * sujet, avec « Ma copie » et une correction à part, cachée tant qu'on n'a pas fini (B).
 * Après la correction, on se note sur chaque question : un type est maîtrisé quand une
 * question de ce type a été réussie seul. Progression dans `exos` des données (synchronisée).
 */

export const exosTypesDe = (c: Chapitre): ExosTypes | undefined => (c.publieId ? EXOS_TYPES[c.publieId] : undefined);

type Etat = "seul" | "aide" | "rate" | null;

/** L'état de chaque type : réussi seul quelque part, avec aide, raté, ou pas encore fait. */
function etatsDesTypes(publieId: string, et: ExosTypes, exos: Record<string, ProgresQuestion>) {
  const etats = new Map<string, Etat>(et.types.map((t) => [t.id, null]));
  const rang = { rate: 1, aide: 2, seul: 3 } as const;
  for (const exo of et.exos)
    exo.questions.forEach((q, i) => {
      const note = exos[`${publieId}/${exo.id}/${i}`]?.note;
      if (!note) return;
      for (const t of q.types) {
        const avant = etats.get(t);
        if (!avant || rang[note] > rang[avant]) etats.set(t, note);
      }
    });
  return etats;
}

export function OngletExosTypes({ chapitre, matiere }: { chapitre: Chapitre; matiere: Matiere }) {
  const et = exosTypesDe(chapitre)!;
  const params = useSearchParams();
  const exo = et.exos.find((x) => x.id === params.get("e"));
  return exo ? (
    <VueExo chapitre={chapitre} matiere={matiere} et={et} exo={exo} />
  ) : (
    <Tableau chapitre={chapitre} matiere={matiere} et={et} />
  );
}

// ———————————————————————— A · Tableau de bord ————————————————————————

function Case({ etat }: { etat: Etat }) {
  return (
    <span
      aria-hidden
      className={`mt-0.5 flex size-[20px] shrink-0 items-center justify-center rounded-[7px] border-2 ${
        etat === "seul" ? "border-ok bg-ok text-bg" : etat === "aide" ? "border-copper bg-copper/20" : etat === "rate" ? "border-bad/60" : "border-line"
      }`}
    >
      {etat === "seul" && <Check size={13} strokeWidth={3} />}
    </span>
  );
}

function Tableau({ chapitre, matiere, et }: { chapitre: Chapitre; matiere: Matiere; et: ExosTypes }) {
  const exos = useLuno((s) => s.exos) ?? {};
  const publieId = chapitre.publieId!;
  const etats = etatsDesTypes(publieId, et, exos);
  const maitrises = [...etats.values()].filter((e) => e === "seul").length;
  const titreType = new Map(et.types.map((t) => [t.id, t.titre]));
  const courtType = new Map(et.types.map((t) => [t.id, t.court]));
  const lien = (e: string, v?: string) => lienTravail({ m: matiere.id, c: chapitre.id, o: "exos", e, v });
  // Le prochain exo conseillé : le premier qui couvre un type pas encore réussi seul.
  const conseille = et.exos.find((x) => x.questions.some((q) => q.types.some((t) => etats.get(t) !== "seul")));

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <Carte className="grid gap-3" >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[19px]">Types de questions</h2>
          <span className="shrink-0 text-[13px] font-semibold text-muted">
            {maitrises} / {et.types.length} maîtrisés
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={et.types.length} aria-valuenow={maitrises}>
          <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(maitrises / et.types.length) * 100}%` }} />
        </div>
        <ul className="grid gap-2.5">
          {et.types.map((t) => (
            <li key={t.id} className="flex items-start gap-3">
              <Case etat={etats.get(t.id) ?? null} />
              <span className="min-w-0 text-[14.5px] leading-snug">
                {formule(t.titre)}
                {t.rappel && <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{formule(t.rappel)}</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className="flex flex-wrap gap-x-3 gap-y-1 border-t border-line pt-2.5 text-[12.5px] text-muted">
          <span className="inline-flex items-center gap-1.5"><Case etat="seul" /> réussi seul</span>
          <span className="inline-flex items-center gap-1.5"><Case etat="aide" /> avec la correction</span>
          <span className="inline-flex items-center gap-1.5"><Case etat="rate" /> raté</span>
        </p>
      </Carte>

      <div className="grid gap-3">
        <p className="text-[14px] leading-relaxed text-muted">
          {pluriel(et.exos.length, "exercice entier", "exercices entiers")} qui couvrent tout le chapitre. Rédige ta copie,
          puis compare à la correction et note-toi : un type est maîtrisé quand tu l&apos;as réussi seul.
        </p>
        {et.exos.map((x, n) => {
          const corrigees = x.questions.filter((_, i) => exos[`${publieId}/${x.id}/${i}`]?.note).length;
          const types = [...new Set(x.questions.flatMap((q) => q.types))];
          return (
            <Carte key={x.id} className={`grid gap-2.5 ${x === conseille ? "!border-accent" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="surtitre text-muted">Exo {n + 1}{x === conseille && corrigees < x.questions.length ? " · conseillé" : ""}</p>
                  <h3 className="font-display text-[19px] leading-snug">{x.titre}</h3>
                </div>
                {x.duree && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-semibold text-accent">
                    <Clock size={12} /> {x.duree}
                  </span>
                )}
              </div>
              <p className="text-[13px] leading-snug text-muted">
                Couvre : {formule(types.map((t) => courtType.get(t) ?? titreType.get(t)).join(" · "))}
              </p>
              <p className="text-[13px] font-semibold" style={{ color: encre(matiere.couleur) }}>
                {corrigees === 0
                  ? pluriel(x.questions.length, "question")
                  : `${corrigees} / ${x.questions.length} questions corrigées`}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href={lien(x.id)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[10px] bg-ink px-4 text-[14.5px] font-medium text-bg transition-transform active:scale-[0.97]">
                  {corrigees ? "Reprendre" : "Ouvrir le sujet"} <ChevronRight size={16} />
                </Link>
                <Link href={lien(x.id, "correction")} className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-line bg-surface px-4 text-[14.5px] font-medium">
                  Correction
                </Link>
              </div>
            </Carte>
          );
        })}
        {et.exos.some((x) => x.source) && (
          <p className="text-[12px] leading-snug text-muted">
            Sujets inspirés de sujets type bac et de manuels de Première, corrigés comme ton prof l&apos;attend. Tu as des
            exercices de ton prof ? Envoie-les à Claude : ils remplaceront ceux-ci.
          </p>
        )}
      </div>
    </div>
  );
}

// ———————————————————————— B · Sujet, copie, correction ————————————————————————

const VUES = [
  { id: "sujet", label: "Sujet" },
  { id: "copie", label: "Ma copie" },
  { id: "correction", label: "Correction" },
] as const;
type Vue = (typeof VUES)[number]["id"];

function VueExo({ chapitre, matiere, et, exo }: { chapitre: Chapitre; matiere: Matiere; et: ExosTypes; exo: ExoType }) {
  const router = useRouter();
  const params = useSearchParams();
  const vue: Vue = (VUES.find((v) => v.id === params.get("v"))?.id ?? "sujet") as Vue;
  const lien = (v?: Vue) => lienTravail({ m: matiere.id, c: chapitre.id, o: "exos", e: exo.id, v: v === "sujet" ? undefined : v });
  const aller = (v: Vue) => {
    router.replace(lien(v), { scroll: false });
    window.scrollTo({ top: 0 });
  };
  const { exos = {}, majExo } = useLuno();
  const cle = (i: number) => `${chapitre.publieId}/${exo.id}/${i}`;
  const scientifique = estScientifique(matiere.nom);
  const titreType = new Map(et.types.map((t) => [t.id, t.titre]));
  // La correction reste cachée tant qu'on n'a pas fini (ou qu'on n'a pas choisi de la voir).
  const [devoile, setDevoile] = useState(() => exo.questions.some((_, i) => exos[cle(i)]?.note));
  const index = et.exos.indexOf(exo);
  const suivant = et.exos[index + 1];
  const foncee = encre(matiere.couleur);

  return (
    <div className="mx-auto max-w-[760px]">
      <Link
        href={lienTravail({ m: matiere.id, c: chapitre.id, o: "exos" })}
        className="-ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft size={16} /> Exos types
      </Link>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3">
        <h2 className="text-[23px] leading-tight sm:text-[28px]">
          <span className="text-muted">Exo {index + 1} · </span>
          {exo.titre}
        </h2>
        {exo.duree && <span className="text-[13px] text-muted">Environ {exo.duree}</span>}
      </div>

      <div className="mb-4 flex rounded-2xl border border-line bg-surface p-1 shadow-card" role="tablist" aria-label="Exercice">
        {VUES.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={vue === v.id}
            onClick={() => aller(v.id)}
            className="min-h-10 flex-1 rounded-xl px-2 text-[14px] font-semibold transition-colors"
            style={vue === v.id ? { background: pastel(matiere.couleur, 18), color: foncee } : { color: "var(--muted)" }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {vue === "sujet" && (
        <div className="grid gap-4">
          <Carte className="grid gap-3">
            <p className="whitespace-pre-line text-[15px] leading-relaxed">{formule(exo.enonce)}</p>
            {exo.schema && <DessinSchema schema={exo.schema} className="max-w-[520px]" />}
          </Carte>
          <ol className="grid gap-3">
            {exo.questions.map((q, i) => (
              <li key={i} className="grid grid-cols-[28px_1fr] gap-1 rounded-[16px] border border-line bg-surface p-4">
                <span className="font-semibold text-accent">{i + 1}.</span>
                <div className="min-w-0">
                  <p className="text-[15px] leading-relaxed">{formule(q.texte)}</p>
                  <p className="mt-1 text-[12px] italic text-muted">
                    Type : {formule(q.types.map((t) => titreType.get(t)).join(" · "))}
                    {q.points ? ` · ${q.points} pts` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <Bouton onClick={() => aller("copie")}>
            <PencilLine size={16} /> Rédiger ma copie
          </Bouton>
          {exo.source && <p className="text-[12px] text-muted">{exo.source}.</p>}
        </div>
      )}

      {vue === "copie" && (
        <div className="grid gap-4">
          <p className="text-[14px] leading-relaxed text-muted">
            Rédige comme sur ta copie. Tout est enregistré au fur et à mesure, sur tous tes appareils.
          </p>
          {exo.questions.map((q, i) => (
            <div key={i} className="grid gap-2 rounded-[16px] border border-line bg-surface p-4">
              <p className="text-[14.5px] leading-relaxed">
                <span className="mr-1.5 font-semibold text-accent">{i + 1}.</span>
                {formule(q.texte)}
              </p>
              <SaisieFormule
                valeur={exos[cle(i)]?.copie ?? ""}
                changer={(v) => majExo(cle(i), { copie: v })}
                lignes={4}
                label={`Ta réponse à la question ${i + 1}`}
                placeholder="Ta réponse…"
                scientifique={scientifique}
              />
            </div>
          ))}
          <ZoneAction cle="fin-copie">
            <Bouton
              className="w-full"
              onClick={() => {
                setDevoile(true);
                aller("correction");
              }}
            >
              <Check size={16} /> J&apos;ai fini, voir la correction
            </Bouton>
          </ZoneAction>
        </div>
      )}

      {vue === "correction" &&
        (!devoile ? (
          <Carte className="grid gap-3 text-center">
            <p className="font-display text-[20px]">Cherche d&apos;abord</p>
            <p className="text-[14.5px] leading-relaxed text-muted">
              La correction se lit après avoir rédigé : c&apos;est en cherchant seul qu&apos;on retient la méthode.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Bouton onClick={() => aller("copie")}>
                <PencilLine size={16} /> Rédiger ma copie
              </Bouton>
              <Bouton variante="contour" onClick={() => setDevoile(true)}>
                <Eye size={16} /> Voir quand même
              </Bouton>
            </div>
          </Carte>
        ) : (
          <div className="grid gap-4">
            {exo.questions.map((q, i) => {
              const p = exos[cle(i)];
              return (
                <div key={i} className="grid gap-3 rounded-[16px] border border-line bg-surface p-4">
                  <p className="text-[14.5px] leading-relaxed">
                    <span className="mr-1.5 font-semibold text-accent">{i + 1}.</span>
                    {formule(q.texte)}
                  </p>
                  {p?.copie?.trim() && (
                    <div className="rounded-xl border border-line px-3.5 py-2.5">
                      <p className="surtitre text-muted">Ta copie</p>
                      <p className="mt-1 whitespace-pre-line text-[14.5px] leading-relaxed">
                        {formule(scientifique ? versNotation(p.copie) : p.copie)}
                      </p>
                    </div>
                  )}
                  <div className="rounded-xl bg-accent-soft px-3.5 py-3">
                    <p className="surtitre text-accent">Correction{q.points ? ` · ${q.points} pts` : ""}</p>
                    <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed">{formule(q.correction)}</p>
                    {q.schema && <DessinSchema schema={q.schema} className="mt-3 max-w-[460px]" />}
                  </div>
                  <NoteurQuestion note={p?.note} noter={(n) => majExo(cle(i), { note: n })} />
                </div>
              );
            })}
            <ZoneAction cle="fin-correction" className="flex flex-wrap gap-2">
              {suivant ? (
                <Link
                  href={lienTravail({ m: matiere.id, c: chapitre.id, o: "exos", e: suivant.id })}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[10px] bg-ink px-4 text-[14.5px] font-medium text-bg"
                >
                  Exo suivant : {suivant.titre} <ChevronRight size={16} />
                </Link>
              ) : null}
              <Link
                href={lienTravail({ m: matiere.id, c: chapitre.id, o: "exos" })}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[10px] border border-line bg-surface px-4 text-[14.5px] font-medium"
              >
                Voir mes types de questions
              </Link>
            </ZoneAction>
          </div>
        ))}
    </div>
  );
}

const NOTES: { id: NoteQuestion; label: string; actif: string }[] = [
  { id: "seul", label: "Réussi seul", actif: "bg-ok text-bg" },
  { id: "aide", label: "Avec la correction", actif: "bg-copper text-bg" },
  { id: "rate", label: "Raté", actif: "bg-bad text-bg" },
];

function NoteurQuestion({ note, noter }: { note?: NoteQuestion; noter: (n: NoteQuestion) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-muted">Et toi ?</p>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Ta réussite">
        {NOTES.map((n) => (
          <button
            key={n.id}
            role="radio"
            aria-checked={note === n.id}
            onClick={() => noter(n.id)}
            className={`min-h-11 rounded-xl px-1.5 text-[13px] font-semibold leading-tight transition-colors ${note === n.id ? n.actif : "bg-ink/5 text-muted hover:bg-ink/10"}`}
          >
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
