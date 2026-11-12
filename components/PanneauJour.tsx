"use client";

import Link from "next/link";
import { revisionDuJour } from "@/lib/revision";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Layers,
  ListTodo,
} from "lucide-react";
import { encre, pastel, useLuno } from "@/lib/store";
import { compteARebours, dateLongue, joursAvant, todayISO } from "@/lib/dates";
import { lienTravail } from "@/lib/liens";
import { pluriel } from "./ui";
import { Emoji } from "@/components/Emoji";

/** Panneau « Aujourd'hui », visible à droite sur les grands écrans, sur toutes les pages. */
export function PanneauJour() {
  const s = useLuno();
  const aVenir = s.dsts
    .filter((d) => joursAvant(d.date) >= 0)
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  const semaine = aVenir.filter((d) => joursAvant(d.date) <= 7);
  const prochain = aVenir[0];
  const m = (id: string) => s.matieres.find((x) => x.id === id);
  const aFaire = s.taches
    .filter((t) => !t.fait)
    .sort((a, b) => (a.echeance || "9999").localeCompare(b.echeance || "9999"));
  const dues = revisionDuJour(s.chapitres, s.dsts, s.jour).cartes.length;

  return (
    <aside className="sticky top-24 flex max-h-[calc(100dvh-7rem)] flex-col gap-4 overflow-y-auto pb-6">
      <h2 className="-mb-1 text-[18px]">{dateLongue(todayISO())}</h2>

      {prochain && (
        <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
          <p className="text-[13px] font-semibold text-muted">Prochain DST</p>
          <p
            className={`mt-1 font-display leading-none ${
              compteARebours(prochain.date).length <= 4 ? "text-[44px]" : "text-[34px]"
            }`}
          >
            {compteARebours(prochain.date)}
          </p>
          <p className="mt-2 text-[14.5px] font-semibold">
            <Emoji e={m(prochain.matiereId)?.emoji} /> {m(prochain.matiereId)?.nom}
          </p>
          <p className="line-clamp-2 text-[13.5px] text-muted">
            {prochain.titre}
          </p>
        </div>
      )}

      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-muted">
          <CalendarDays size={15} /> Cette semaine
        </p>
        {semaine.length === 0 ? (
          <p className="text-[14px] text-muted">Aucun DST dans les 7 jours.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {semaine.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 rounded-xl px-2 py-1.5"
                style={{
                  background: pastel(m(d.matiereId)?.couleur ?? "#888", 12),
                }}
              >
                <span className="w-12 shrink-0 text-center">
                  <span className="block text-[11px] font-semibold uppercase text-muted">
                    {dateLongue(d.date).split(" ")[0].slice(0, 3)}
                  </span>
                  <span className="block font-display text-[20px] leading-none">
                    {Number(d.date.slice(8))}
                  </span>
                </span>
                <span className="min-w-0">
                  <span
                    className="block truncate text-[14px] font-semibold"
                    style={{ color: encre(m(d.matiereId)?.couleur ?? "#888") }}
                  >
                    {m(d.matiereId)?.nom}
                  </span>
                  <span className="block truncate text-[12.5px] text-muted">
                    {d.titre}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-muted">
            <ListTodo size={15} /> À faire · {aFaire.length}
          </p>
          <Link
            href="/taches"
            className="text-[13px] font-semibold text-accent"
          >
            Tout voir
          </Link>
        </div>
        {aFaire.length === 0 ? (
          <p className="text-[14px] text-muted">Rien en attente.</p>
        ) : (
          <ul className="flex flex-col">
            {aFaire.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-2 py-1">
                <button
                  role="checkbox"
                  aria-checked={false}
                  aria-label={`Marquer comme fait : ${t.texte}`}
                  onClick={() => s.modifierTache(t.id, { fait: true })}
                  className="group flex size-8 shrink-0 items-center justify-center"
                >
                  <span className="flex size-5 items-center justify-center rounded-full border-2 border-ink/35 text-transparent group-hover:border-ok group-hover:text-ok">
                    <Check size={12} strokeWidth={3} />
                  </span>
                </button>
                <span className="min-w-0 flex-1 truncate text-[14px]">
                  {t.texte}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-muted">
          <Layers size={15} /> À revoir aujourd&apos;hui
        </p>
        <p className="mt-1 font-display text-[36px] leading-none">{dues}</p>
        <p className="mt-1 text-[13px] text-muted">
          {pluriel(dues, "flashcard")}
        </p>
        {dues > 0 && (
          <Link
            href={lienTravail({ r: "tout" })}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-accent px-3 text-[14px] font-medium text-on-accent"
          >
            Réviser <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </aside>
  );
}
