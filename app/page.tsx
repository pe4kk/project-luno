"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, CalendarDays, GraduationCap, Target } from "lucide-react";
import { useLuno, pastel } from "@/lib/store";
import { compteARebours, dateLongue, dureeLisible, joursAvant, todayISO } from "@/lib/dates";
import { Bouton, Carte } from "@/components/ui";

const RACCOURCIS = [
  { href: "/calendrier", titre: "Calendrier", texte: "Tous tes DST d'un coup d'œil", icone: CalendarDays, couleur: "#5b4bdb" },
  { href: "/travail", titre: "Travail", texte: "Cours, flashcards et fiches", icone: BookOpen, couleur: "#e4572e" },
  { href: "/apprendre", titre: "Apprendre", texte: "Un tuteur pour n'importe quel sujet", icone: GraduationCap, couleur: "#2a9d8f" },
  { href: "/exercices", titre: "S'exercer", texte: "Des exercices corrigés", icone: Target, couleur: "#e9a100" },
];

function salutation() {
  const h = new Date().getHours();
  return h < 5 || h >= 18 ? "Bonsoir" : "Bonjour";
}

export default function Accueil() {
  const { matieres, chapitres, dsts, chargerExemple, ouvrir } = useLuno();
  const aVenir = dsts
    .filter((d) => joursAvant(d.date) >= 0)
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  const prochain = aVenir[0];
  const matiere = (id: string) => matieres.find((m) => m.id === id);
  const cartes = chapitres.flatMap((c) => c.flashcards);
  const aRevoir = cartes.filter((c) => c.niveau !== 2).length;
  const vide = matieres.length === 0 && dsts.length === 0;

  return (
    <div>
      <p className="text-[15px] text-muted">{dateLongue(todayISO())}</p>
      <h1 className="mt-1 text-[40px] font-bold leading-[1.05] sm:text-[52px]">
        {salutation()} <span className="text-accent">!</span>
      </h1>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* Prochain DST */}
        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden rounded-3xl bg-night p-6 text-white shadow-pop sm:p-8"
        >
          <div
            className="absolute -right-16 -top-20 size-64 rounded-full opacity-40 blur-3xl"
            style={{ background: prochain ? matiere(prochain.matiereId)?.couleur : "#5b4bdb" }}
          />
          <div className="absolute right-8 top-8 size-20 rounded-full bg-moon/90 opacity-90 shadow-[0_0_60px_rgba(245,184,65,.5)]" />
          <div className="absolute right-[22px] top-[26px] size-20 rounded-full bg-night" />
          <p className="relative text-[13px] font-semibold uppercase tracking-widest text-white/50">
            Prochain DST
          </p>
          {prochain ? (
            <div className="relative">
              <p className="mt-6 font-display text-[64px] font-bold leading-none text-moon sm:text-[80px]">
                {compteARebours(prochain.date)}
              </p>
              <p className="mt-4 text-[22px] font-semibold">
                {matiere(prochain.matiereId)?.emoji} {matiere(prochain.matiereId)?.nom}
                <span className="text-white/50"> · {prochain.titre}</span>
              </p>
              <p className="mt-1 text-[15px] text-white/60">
                {dateLongue(prochain.date)} · {prochain.heure} · {dureeLisible(prochain.dureeMin)}
                {prochain.salle && ` · salle ${prochain.salle}`}
              </p>
            </div>
          ) : (
            <div className="relative">
              <p className="mt-6 font-display text-[40px] font-bold leading-tight">Rien de prévu</p>
              <p className="mt-2 max-w-[340px] text-[15px] text-white/60">
                Ajoute tes DST dans le calendrier pour voir ici le compte à rebours.
              </p>
            </div>
          )}
          <Link
            href="/calendrier"
            className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-[14.5px] font-semibold transition-colors hover:bg-white/20"
          >
            Ouvrir le calendrier <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Chiffres */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <Carte>
            <p className="text-[13px] font-semibold text-muted">DST à venir</p>
            <p className="mt-1 font-display text-[44px] font-bold leading-none">{aVenir.length}</p>
            <div className="mt-3 flex flex-col gap-1.5">
              {aVenir.slice(1, 3).map((d) => (
                <div key={d.id} className="flex items-center gap-2 text-[13.5px]">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: matiere(d.matiereId)?.couleur }}
                  />
                  <span className="truncate">{matiere(d.matiereId)?.nom}</span>
                  <span className="ml-auto shrink-0 text-muted">{compteARebours(d.date)}</span>
                </div>
              ))}
            </div>
          </Carte>
          <Carte>
            <p className="text-[13px] font-semibold text-muted">Flashcards à revoir</p>
            <p className="mt-1 font-display text-[44px] font-bold leading-none">{aRevoir}</p>
            <p className="mt-3 text-[13.5px] text-muted">
              sur {cartes.length} carte{cartes.length > 1 ? "s" : ""} dans {chapitres.length} chapitre
              {chapitres.length > 1 ? "s" : ""}
            </p>
          </Carte>
        </div>
      </div>

      {vide && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/20 bg-accent-soft px-5 py-4"
        >
          <p className="text-[14.5px]">
            <strong>Tout est vide pour l&apos;instant.</strong> Tu peux charger des données d&apos;exemple
            pour découvrir le site, puis les effacer.
          </p>
          <Bouton onClick={chargerExemple}>Charger l&apos;exemple</Bouton>
        </motion.div>
      )}

      <h2 className="mb-4 mt-10 text-[22px] font-bold">Par où commencer</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              className="group block h-full rounded-3xl border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-pop"
            >
              <div
                className="mb-10 flex size-11 items-center justify-center rounded-2xl"
                style={{ background: pastel(couleur), color: couleur }}
              >
                <Icone size={21} />
              </div>
              <p className="flex items-center gap-1.5 text-[18px] font-bold">
                {titre}
                <ArrowRight
                  size={16}
                  className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                />
              </p>
              <p className="mt-0.5 text-[14px] text-muted">{texte}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {matieres.length > 0 && (
        <>
          <h2 className="mb-4 mt-10 text-[22px] font-bold">Tes matières</h2>
          <div className="flex flex-wrap gap-2.5">
            {matieres.map((m) => (
              <Link
                key={m.id}
                href="/travail"
                onClick={() => ouvrir(m.id)}
                className="rounded-full px-4 py-2 text-[14.5px] font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: pastel(m.couleur, 16), color: `color-mix(in oklab, ${m.couleur} 75%, black)` }}
              >
                {m.emoji} {m.nom}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
