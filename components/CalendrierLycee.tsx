"use client";

import { useState } from "react";
import { CalendarPlus, Check } from "lucide-react";
import { useLuno } from "@/lib/store";
import { CALENDRIER_EVENEMENTS, CALENDRIER_MATIERES, CALENDRIER_TITRE } from "@/contenu/calendrier";
import { Bouton, Fenetre, pluriel } from "./ui";

const GROUPES = ["Tronc commun", "Spécialités et options", "Autres"] as const;

/** Propose de reprendre le calendrier des DST du lycée pour les matières de l'utilisateur. */
export function CalendrierLycee() {
  const calendrier = useLuno((s) => s.calendrier);
  const importer = useLuno((s) => s.importerCalendrier);
  const [ouverte, setOuverte] = useState(false);
  const [choix, setChoix] = useState<string[]>([]);

  const ouvrir = () => {
    setChoix(calendrier ?? CALENDRIER_MATIERES.filter((m) => m.parDefaut).map((m) => m.nom));
    setOuverte(true);
  };
  const basculer = (nom: string) =>
    setChoix((c) => (c.includes(nom) ? c.filter((x) => x !== nom) : [...c, nom]));
  const nb = CALENDRIER_EVENEMENTS.filter((e) => choix.includes(e.matiere)).length;

  return (
    <>
      {calendrier === null ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent-soft px-4 py-3">
          <p className="min-w-0 flex-1 text-[14.5px]">
            <strong>{CALENDRIER_TITRE}.</strong> Le calendrier du lycée est prêt : choisis tes matières et
            tous tes DST de l&apos;année s&apos;ajoutent d&apos;un coup.
          </p>
          <Bouton onClick={ouvrir}>
            <CalendarPlus size={16} /> Choisir mes matières
          </Bouton>
        </div>
      ) : (
        <p className="mb-5 text-[13.5px] text-muted">
          Calendrier du lycée repris pour {pluriel(calendrier.length, "matière")}.{" "}
          <button onClick={ouvrir} className="min-h-11 font-semibold text-accent underline underline-offset-2">
            Modifier mes matières
          </button>
        </p>
      )}

      <Fenetre ouverte={ouverte} fermer={() => setOuverte(false)} titre={CALENDRIER_TITRE}>
        <p className="text-[14.5px] text-muted">
          Coche les matières que tu suis. Les heures ne figurent pas sur le calendrier du lycée : tu
          pourras les ajouter sur chaque DST.
        </p>
        {GROUPES.map((g) => (
          <div key={g} className="mt-4">
            <p className="mb-2 text-[13px] font-semibold text-muted">{g}</p>
            <div className="flex flex-wrap gap-2">
              {CALENDRIER_MATIERES.filter((m) => m.groupe === g).map((m) => {
                const coche = choix.includes(m.nom);
                return (
                  <button
                    key={m.nom}
                    type="button"
                    aria-pressed={coche}
                    onClick={() => basculer(m.nom)}
                    className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-[13.5px] font-medium transition-colors ${
                      coche ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink"
                    }`}
                  >
                    {coche ? <Check size={14} /> : <span>{m.emoji}</span>}
                    {m.nom}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-[13.5px] text-muted">{pluriel(nb, "date")} à ajouter</span>
          <Bouton
            disabled={choix.length === 0}
            onClick={() => {
              importer(choix);
              setOuverte(false);
            }}
          >
            {calendrier === null ? "Ajouter au calendrier" : "Mettre à jour"}
          </Bouton>
        </div>
      </Fenetre>
    </>
  );
}
