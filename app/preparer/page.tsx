"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Check, ChevronRight, PencilLine, Target } from "lucide-react";
import { Emoji } from "@/components/Emoji";
import { Bouton, EnTete, EtatVide, pluriel } from "@/components/ui";
import { compteARebours, dateLongue, dureeLisible, joursAvant } from "@/lib/dates";
import { etapes as listerEtapes, repartir } from "@/lib/preparation";
import { encre, pastel, useLuno } from "@/lib/store";
import type { Dst } from "@/lib/types";

export default function Page() {
  return (
    <Suspense>
      <Preparer />
    </Suspense>
  );
}

const TYPES = [
  {
    id: "cours" as const,
    titre: "Éval de cours",
    texte: "Le cours à connaître : fiche, définitions, dates, flashcards.",
    icone: BookOpen,
  },
  {
    id: "exos" as const,
    titre: "Éval avec exercices",
    texte: "Le cours, puis des exercices : séries, calculs, problèmes à rédiger.",
    icone: PencilLine,
  },
];

const jourLisible = (iso: string) => {
  const j = joursAvant(iso);
  return j === 0 ? "Aujourd'hui" : j === 1 ? "Demain" : dateLongue(iso);
};

/**
 * « Préparer une éval » : on choisit une évaluation du calendrier, on dit si c'est une
 * éval de cours ou avec exercices, et Luno répartit le travail sur les jours qui restent.
 */
function Preparer() {
  const s = useLuno();
  const params = useSearchParams();
  const dst = s.dsts.find((d) => d.id === params.get("d"));
  const aVenir = s.dsts
    .filter((d) => joursAvant(d.date) >= 0)
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  const matiere = (id: string) => s.matieres.find((m) => m.id === id);

  if (dst) return <Programme key={dst.id} dst={dst} />;

  return (
    <div className="mx-auto max-w-[860px]">
      <EnTete titre="Préparer une éval" sousTitre="Quelle éval veux-tu préparer ?" />
      {aVenir.length === 0 ? (
        <EtatVide
          icone={<CalendarDays size={26} />}
          titre="Aucune éval à venir"
          texte="Ajoute tes DST et tes interros dans le calendrier : tu pourras ensuite préparer chacune ici."
          action={
            <Link href="/calendrier">
              <Bouton>Ouvrir le calendrier</Bouton>
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {aVenir.map((d, i) => {
            const m = matiere(d.matiereId);
            const nb = s.chapitres.filter((c) => d.chapitreIds.includes(c.id)).length;
            const total = d.preparation ? listerEtapes(d, s.chapitres, s.erreurs, d.preparation.type) : [];
            const faites = total.filter((e) => d.preparation?.faits.includes(e.id)).length;
            const j = joursAvant(d.date);
            return (
              <motion.li
                key={d.id}
                initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
                animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                transition={{ delay: Math.min(i, 8) * 0.03 }}
              >
                <Link
                  href={`/preparer?d=${encodeURIComponent(d.id)}`}
                  className="group flex items-center gap-3 rounded-[18px] border border-line bg-surface p-4 shadow-card transition-colors hover:border-ink/25"
                >
                  <span className="w-1.5 shrink-0 self-stretch rounded-full" style={{ background: m?.couleur }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold leading-snug">
                      <Emoji e={m?.emoji} /> {m?.nom} <span className="font-normal text-muted">· {d.titre}</span>
                    </span>
                    <span className="mt-0.5 block text-[13px] text-muted">
                      {[
                        dateLongue(d.date),
                        d.dureeMin > 0 ? dureeLisible(d.dureeMin) : "",
                        d.preparation
                          ? `${faites}/${total.length} étapes faites`
                          : nb
                            ? pluriel(nb, "chapitre")
                            : "chapitres à choisir",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    {d.preparation && total.length > 0 && (
                      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-accent-soft">
                        <span className="copper-bg block h-full rounded-full" style={{ width: `${(faites / total.length) * 100}%` }} />
                      </span>
                    )}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-bold ${
                      j <= 3 ? "bg-accent-soft text-accent" : "bg-ink/5 text-muted"
                    }`}
                  >
                    {compteARebours(d.date)}
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Programme({ dst }: { dst: Dst }) {
  const s = useLuno();
  const m = s.matieres.find((x) => x.id === dst.matiereId);
  const couleur = m?.couleur ?? "var(--copper)";
  const foncee = encre(couleur);
  const deLaMatiere = s.chapitres.filter((c) => c.matiereId === dst.matiereId);
  const auProgramme = deLaMatiere.filter((c) => dst.chapitreIds.includes(c.id));
  const [choix, setChoix] = useState(auProgramme.length === 0);
  const type = dst.preparation?.type;
  const faits = dst.preparation?.faits ?? [];
  const liste = type ? listerEtapes(dst, s.chapitres, s.erreurs, type) : [];
  const jours = repartir(liste, dst.date);
  const nbFaites = liste.filter((e) => faits.includes(e.id)).length;
  const minutes = liste.filter((e) => !faits.includes(e.id)).reduce((n, e) => n + e.minutes, 0);

  const basculerChapitre = (id: string) =>
    s.majDst(dst.id, {
      chapitreIds: dst.chapitreIds.includes(id) ? dst.chapitreIds.filter((x) => x !== id) : [...dst.chapitreIds, id],
    });
  const cocher = (id: string) =>
    type &&
    s.majDst(dst.id, {
      preparation: { type, faits: faits.includes(id) ? faits.filter((x) => x !== id) : [...faits, id] },
    });

  const titre = (n: number, t: string) => (
    <h2 className="mb-2.5 mt-7 flex items-center gap-2.5 text-[21px]">
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-full font-sans text-[13px] font-semibold"
        style={{ background: pastel(couleur, 18), color: foncee }}
      >
        {n}
      </span>
      {t}
    </h2>
  );

  return (
    <div className="mx-auto max-w-[860px]">
      <Link
        href="/preparer"
        className="-ml-1 mb-2 inline-flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Toutes les évals
      </Link>
      <div data-aligne-panneau className="rounded-[18px] p-6 sm:p-7" style={{ background: pastel(couleur, 16) }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="surtitre" style={{ color: foncee }}>
              <Emoji e={m?.emoji} /> {m?.nom}
            </p>
            <h1 className="mt-1 text-[30px] leading-tight sm:text-[38px]" style={{ color: foncee }}>
              {dst.titre}
            </h1>
            <p className="mt-1 text-[14.5px] text-ink/70">
              {[dateLongue(dst.date), dst.heure, dst.dureeMin > 0 ? dureeLisible(dst.dureeMin) : ""].filter(Boolean).join(" · ")}
            </p>
          </div>
          <span className="rounded-full bg-surface px-3 py-1 font-display text-[20px]" style={{ color: foncee }}>
            {compteARebours(dst.date)}
          </span>
        </div>
        {type && liste.length > 0 && (
          <>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
              <div className="copper-bg h-full rounded-full transition-[width] duration-500" style={{ width: `${(nbFaites / liste.length) * 100}%` }} />
            </div>
            <p className="mt-1.5 text-[13px] text-ink/70">
              {nbFaites === liste.length
                ? "Programme terminé : tu es prêt."
                : `${nbFaites}/${liste.length} étapes faites · encore environ ${dureeLisible(minutes)}`}
            </p>
          </>
        )}
      </div>

      {titre(1, "Qu'est-ce qui est au programme ?")}
      {deLaMatiere.length === 0 ? (
        <p className="rounded-[18px] border border-dashed border-line px-5 py-4 text-[14.5px] text-muted">
          Il n&apos;y a pas encore de chapitre en {m?.nom}. Ajoute ton cours dans{" "}
          <Link href="/travail" className="font-semibold text-accent underline-offset-2 hover:underline">
            Travail
          </Link>{" "}
          (ou envoie-le à Claude), puis reviens ici.
        </p>
      ) : choix || auProgramme.length === 0 ? (
        <div className="rounded-[18px] border border-line bg-surface px-4 py-2 shadow-card">
          <ul>
            {deLaMatiere.map((c) => {
              const coche = dst.chapitreIds.includes(c.id);
              return (
                <li key={c.id} className="border-t border-line first:border-t-0">
                  <button role="checkbox" aria-checked={coche} onClick={() => basculerChapitre(c.id)} className="flex min-h-12 w-full items-center gap-3 py-2 text-left">
                    <Case coche={coche} />
                    <span className="min-w-0 text-[15px] font-medium leading-snug">{c.titre}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {auProgramme.length > 0 && (
            <Bouton variante="doux" className="mb-2 mt-1" onClick={() => setChoix(false)}>
              Valider {pluriel(auProgramme.length, "chapitre")}
            </Bouton>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {auProgramme.map((c) => (
            <span key={c.id} className="rounded-full px-3 py-1.5 text-[13.5px] font-semibold" style={{ background: pastel(couleur, 16), color: foncee }}>
              {c.titre}
            </span>
          ))}
          <button onClick={() => setChoix(true)} className="min-h-9 px-2 text-[13.5px] font-semibold text-muted underline-offset-2 hover:text-ink hover:underline">
            Modifier
          </button>
        </div>
      )}

      {auProgramme.length > 0 && (
        <>
          {titre(2, "C'est quel genre d'éval ?")}
          <div role="radiogroup" aria-label="Genre d'éval" className="grid gap-2.5 sm:grid-cols-2">
            {TYPES.map(({ id, titre: t, texte, icone: Icone }) => {
              const actif = type === id;
              return (
                <button
                  key={id}
                  role="radio"
                  aria-checked={actif}
                  onClick={() => s.majDst(dst.id, { preparation: { type: id, faits } })}
                  className={`flex items-start gap-3 rounded-[18px] border-2 bg-surface p-4 text-left shadow-card transition-colors ${
                    actif ? "border-ink" : "border-line hover:border-ink/25"
                  }`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ background: pastel(couleur, 16), color: foncee }}>
                    <Icone size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[18px] leading-snug">{t}</span>
                    <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{texte}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {type && auProgramme.length > 0 && (
        <>
          {titre(3, "Ton programme")}
          {liste.length === 0 ? (
            <p className="rounded-[18px] border border-dashed border-line px-5 py-4 text-[14.5px] text-muted">
              Ces chapitres n&apos;ont pas encore de fiche, de définitions ni de flashcards. Envoie le cours à Claude
              depuis le chapitre : le programme se remplira tout seul.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {joursAvant(dst.date) > 5 && (
                <p className="text-[13.5px] text-muted">
                  Tu as le temps : le programme tient sur les cinq jours avant l&apos;éval. Rien ne t&apos;empêche de
                  commencer plus tôt.
                </p>
              )}
              {jours.map((jour, i) => (
                <motion.section
                  key={jour.date}
                  initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
                  animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-[18px] border border-line bg-surface px-4 pb-1.5 pt-3.5 shadow-card sm:px-5"
                >
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[18px]" style={{ color: foncee }}>
                      {jourLisible(jour.date)}
                    </h3>
                    <span className="text-[12.5px] text-muted">
                      environ {dureeLisible(jour.etapes.reduce((n, e) => n + e.minutes, 0))}
                    </span>
                  </div>
                  <ul>
                    {jour.etapes.map((e) => {
                      const fait = faits.includes(e.id);
                      return (
                        <li key={e.id} className="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0">
                          <button
                            role="checkbox"
                            aria-checked={fait}
                            aria-label={`${e.titre} : ${fait ? "fait" : "à faire"}`}
                            onClick={() => cocher(e.id)}
                            className="flex size-11 shrink-0 items-center justify-center"
                          >
                            <Case coche={fait} />
                          </button>
                          <Link href={e.href} className="group flex min-w-0 flex-1 items-center gap-2">
                            <span className="min-w-0 flex-1">
                              <span className={`block text-[15px] font-medium leading-snug ${fait ? "text-muted line-through" : ""}`}>
                                {e.titre}
                              </span>
                              <span className="block text-[12.5px] leading-snug text-muted">
                                {e.detail} · {e.minutes} min
                              </span>
                            </span>
                            <ArrowRight size={16} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </motion.section>
              ))}
              <p className="flex items-start gap-2 text-[13px] text-muted">
                <Target size={15} className="mt-0.5 shrink-0" />
                Touche une étape pour l&apos;ouvrir, puis coche-la quand c&apos;est fait. Ton avancement est gardé sur tous
                tes appareils.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Case({ coche }: { coche: boolean }) {
  return (
    <span
      className={`flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border-2 transition-colors ${
        coche ? "border-ok bg-ok text-bg" : "border-line"
      }`}
    >
      {coche && <Check size={14} strokeWidth={3} />}
    </span>
  );
}
