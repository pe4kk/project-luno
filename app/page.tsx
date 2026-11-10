"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, CalendarDays, Eraser, GraduationCap, Target } from "lucide-react";
import { aExemple, encre, estDue, pastel, useLuno } from "@/lib/store";
import { compteARebours, dateLongue, dureeLisible, joursAvant, todayISO } from "@/lib/dates";
import { lienTravail } from "@/lib/liens";
import { Bouton, Carte, pluriel } from "@/components/ui";

const RACCOURCIS = [
  { href: "/calendrier", titre: "Calendrier", texte: "Note tes DST", icone: CalendarDays, couleur: "#b5573d" },
  { href: "/travail", titre: "Travail", texte: "Cours, flashcards et fiches", icone: BookOpen, couleur: "#55555c" },
  { href: "/apprendre", titre: "Apprendre", texte: "Des leçons pas à pas", icone: GraduationCap, couleur: "#c98b6b" },
  { href: "/exercices", titre: "S'exercer", texte: "Des exercices corrigés", icone: Target, couleur: "#8a5a78" },
];

function salutation() {
  const h = new Date().getHours();
  return h < 5 || h >= 18 ? "Bonsoir" : "Bonjour";
}

const classeLien =
  "relative mt-6 inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-ink px-4 text-[14.5px] font-medium text-bg transition-colors hover:bg-accent hover:text-on-accent";

export default function Accueil() {
  const s = useLuno();
  const { matieres, chapitres, dsts } = s;
  const aVenir = dsts
    .filter((d) => joursAvant(d.date) >= 0)
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  const prochain = aVenir[0];
  const matiere = (id: string) => matieres.find((m) => m.id === id);
  const cartes = chapitres.flatMap((c) => c.flashcards);
  const dues = cartes.filter(estDue).length;
  const vide = matieres.length === 0 && dsts.length === 0;
  // Premier chapitre lié au prochain DST : c'est lui qu'on propose de réviser.
  const aReviser = prochain && chapitres.find((c) => prochain.chapitreIds.includes(c.id));

  return (
    <div>
      <p className="surtitre text-accent">{dateLongue(todayISO())}</p>
      <h1 className="mt-1 text-[42px] leading-[1.05] sm:text-[56px]">
        {salutation()} <span className="italic text-accent">!</span>
      </h1>

      {aExemple(s) && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent-soft px-4 py-3">
          <p className="min-w-0 flex-1 text-[14.5px]">
            <strong>Tu regardes des données d&apos;exemple.</strong> Efface-les quand tu veux commencer avec
            les tiennes.
          </p>
          <Bouton variante="contour" onClick={s.effacerExemple}>
            <Eraser size={16} /> Effacer l&apos;exemple
          </Bouton>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* Prochain DST */}
        <div className="relative overflow-hidden rounded-[18px] border border-line bg-surface p-6 shadow-pop sm:p-8">
          <div className="absolute inset-y-0 right-0 hidden w-[30%] bg-blush sm:block" />
          <div className="copper-bg absolute right-[30%] top-1/2 hidden size-[112px] -translate-y-1/2 translate-x-1/2 rounded-full shadow-[0_0_0_8px_var(--surface),0_0_60px_rgb(201_139_107_/_0.35)] sm:block" />
          {prochain && (
            <span className="font-hand absolute right-5 top-5 hidden rotate-[5deg] bg-surface px-3.5 py-1.5 text-[21px] font-bold text-accent shadow-[3px_4px_0_var(--ink)] sm:block">
              tu vas gérer
            </span>
          )}
          <div className="copper-bg absolute right-5 top-5 size-11 rounded-full shadow-[0_0_30px_rgb(201_139_107_/_0.4)] sm:hidden" />

          <p className="surtitre relative text-accent">Prochain DST</p>
          {prochain ? (
            <div className="relative sm:max-w-[62%]">
              <p className="mt-4 font-display text-[72px] leading-none sm:text-[104px]">
                {compteARebours(prochain.date)}
              </p>
              <p className="mt-4 text-[20px] font-light">
                <span className="font-semibold">
                  {matiere(prochain.matiereId)?.emoji} {matiere(prochain.matiereId)?.nom}
                </span>{" "}
                · {prochain.titre}
              </p>
              <p className="mt-1 text-[14.5px] text-muted">
                {dateLongue(prochain.date)} · {prochain.heure} · {dureeLisible(prochain.dureeMin)}
                {prochain.salle && ` · salle ${prochain.salle}`}
              </p>
              {aReviser ? (
                <Link href={lienTravail({ m: aReviser.matiereId, c: aReviser.id, o: "flashcards" })} className={classeLien}>
                  Réviser {aReviser.titre} <ArrowRight size={16} />
                </Link>
              ) : (
                <Link href="/calendrier" className={classeLien}>
                  Ouvrir le calendrier <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ) : (
            <div className="relative sm:max-w-[62%]">
              <p className="mt-5 font-display text-[40px] leading-tight">Rien de prévu</p>
              <p className="mt-2 max-w-[340px] text-[15px] text-muted">
                Ajoute tes DST dans le calendrier pour voir ici le compte à rebours.
              </p>
              <Link href="/calendrier" className={classeLien}>
                Ajouter un DST <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          {/* Révision du jour */}
          <Carte className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted">À revoir aujourd&apos;hui</p>
            <p className="mt-1 font-display text-[44px] leading-none">{dues}</p>
            <p className="mt-2 text-[13.5px] text-muted">
              {cartes.length === 0
                ? "Pas encore de flashcards"
                : dues === 0
                  ? `Tout est à jour (${pluriel(cartes.length, "carte")})`
                  : `sur ${pluriel(cartes.length, "carte")}`}
            </p>
            {dues > 0 && (
              <Link
                href={lienTravail({ r: "tout" })}
                className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-accent px-3 text-[14.5px] font-medium text-on-accent transition-opacity hover:opacity-90"
              >
                Réviser <ArrowRight size={16} />
              </Link>
            )}
          </Carte>
          <Carte>
            <p className="text-[13px] font-semibold text-muted">DST à venir</p>
            <p className="mt-1 font-display text-[44px] leading-none">{aVenir.length}</p>
            <div className="mt-3 flex flex-col gap-1.5">
              {aVenir.slice(1, 3).map((d) => (
                <div key={d.id} className="flex items-center gap-2 text-[13.5px]">
                  <span className="size-2 shrink-0 rounded-full" style={{ background: matiere(d.matiereId)?.couleur }} />
                  <span className="truncate">{matiere(d.matiereId)?.nom}</span>
                  <span className="ml-auto shrink-0 text-muted">{compteARebours(d.date)}</span>
                </div>
              ))}
            </div>
          </Carte>
        </div>
      </div>

      {vide ? (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent-soft px-4 py-3">
            <p className="min-w-0 flex-1 text-[14.5px]">
              <strong>Tout est vide pour l&apos;instant.</strong> Charge des données d&apos;exemple pour
              découvrir le site : tu pourras les effacer en un geste.
            </p>
            <Bouton onClick={s.chargerExemple}>Charger l&apos;exemple</Bouton>
          </div>
          <h2 className="mb-4 mt-10 text-[22px]">Par où commencer</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {RACCOURCIS.map(({ href, titre, texte, icone: Icone, couleur }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={href}
                  className="block h-full rounded-[18px] border border-line bg-surface p-4 shadow-card transition-shadow hover:shadow-pop sm:p-5"
                >
                  <div
                    className="mb-5 flex size-11 items-center justify-center rounded-2xl sm:mb-10"
                    style={{ background: pastel(couleur), color: encre(couleur) }}
                  >
                    <Icone size={21} />
                  </div>
                  <p className="text-[18px] font-semibold">{titre}</p>
                  <p className="mt-0.5 text-[14px] text-muted">{texte}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        matieres.length > 0 && (
          <>
            <h2 className="mb-4 mt-10 text-[22px]">Tes matières</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {matieres.map((m) => {
                const chaps = chapitres.filter((c) => c.matiereId === m.id);
                const aRevoir = chaps.reduce((n, c) => n + c.flashcards.filter(estDue).length, 0);
                return (
                  <Link
                    key={m.id}
                    href={lienTravail({ m: m.id })}
                    className="flex min-h-14 items-center gap-3 rounded-2xl px-4 py-3 transition-transform hover:-translate-y-0.5"
                    style={{ background: pastel(m.couleur, 16) }}
                  >
                    <span className="text-[24px]">{m.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15.5px] font-semibold" style={{ color: encre(m.couleur) }}>
                        {m.nom}
                      </span>
                      <span className="block text-[13px] text-ink/70">{pluriel(chaps.length, "chapitre")}</span>
                    </span>
                    {aRevoir > 0 && (
                      <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[12px] font-semibold text-accent">
                        {aRevoir} à revoir
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        )
      )}
    </div>
  );
}
