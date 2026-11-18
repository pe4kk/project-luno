"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { formule } from "@/components/Formule";
import { Bouton, EnTete, pluriel } from "@/components/ui";
import { useDemandes } from "@/lib/demandes";
import { NOMS_GENRE, NOMS_TYPE, historiqueDecouvertes, type ElementDecouverte } from "@/lib/decouverte";
import { useLuno } from "@/lib/store";
import { synchroDisponible, useSynchro } from "@/lib/synchro";

/** Historique de la découverte du jour : tout ce que Claude a proposé, et ce que tu connaissais déjà. */

const FILTRES = [
  ["tout", "Toutes"],
  ["fait", "Faits"],
  ["oeuvre", "Œuvres"],
  ["actu", "Actualités"],
] as const;

const jourCourt = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit" });

export default function Decouvertes() {
  const connecte = useSynchro((s) => s.session !== null);
  const actif = useLuno((s) => s.reglages?.decouverte === true);
  const majReglages = useLuno((s) => s.majReglages);
  const connues = useLuno((s) => s.connues ?? []);
  const tout = historiqueDecouvertes(useDemandes((d) => d.liste));
  const [filtre, setFiltre] = useState<(typeof FILTRES)[number][0]>("tout");
  const liste = filtre === "tout" ? tout : tout.filter((e) => e.type === filtre);

  return (
    <div className="mx-auto max-w-[760px]">
      <EnTete
        titre="Mes découvertes"
        sousTitre={
          tout.length
            ? `${pluriel(tout.length, "découverte")} depuis le ${jourCourt(tout[tout.length - 1].jour)}. Claude relit cette liste pour ne jamais te redonner la même chose.`
            : "Chaque matin, un fait, une œuvre et une actualité, choisis par Claude."
        }
      />

      {!synchroDisponible() || !connecte ? (
        <p className="text-[15px]">
          Connecte-toi dans « Mes données » (la roue dentée en haut) : la découverte du jour est déposée dans ton compte.
        </p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2" data-aligne-panneau>
            {FILTRES.map(([v, nom]) => (
              <button
                key={v}
                type="button"
                onClick={() => setFiltre(v)}
                aria-pressed={filtre === v}
                className={`min-h-10 rounded-full border px-3.5 text-[13.5px] font-semibold transition-colors ${
                  filtre === v ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink hover:border-ink/30"
                }`}
              >
                {nom}
              </button>
            ))}
          </div>
          {liste.length === 0 ? (
            <p className="text-[14.5px] text-muted">Rien pour l&apos;instant.</p>
          ) : (
            <ul className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-card">
              {liste.map((e) => (
                <Ligne key={e.id} e={e} connue={connues.includes(e.id)} />
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[14px] text-muted">
            {actif ? (
              <>
                La découverte du jour est activée.
                <Bouton variante="fantome" onClick={() => majReglages({ decouverte: false })}>
                  La désactiver
                </Bouton>
              </>
            ) : (
              <>
                La découverte du jour est désactivée.
                <Bouton variante="doux" onClick={() => majReglages({ decouverte: true })}>
                  L&apos;activer
                </Bouton>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Ligne({ e, connue }: { e: ElementDecouverte & { jour: string }; connue: boolean }) {
  const [ouvert, setOuvert] = useState(false);
  const sous =
    e.type === "oeuvre"
      ? `${NOMS_GENRE[e.genre] ?? "Œuvre"} · ${e.auteur}, ${e.date}`
      : e.type === "fait"
        ? `Fait · ${e.matiere ?? "HGGSP"}`
        : `Actualité · ${new Date(e.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
  return (
    <li className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        className="grid w-full grid-cols-[50px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-[12px] leading-tight text-muted tabular-nums">{jourCourt(e.jour)}</span>
        <span className="min-w-0">
          <span className="block text-[14.5px] font-semibold [overflow-wrap:anywhere]">{formule(e.titre)}</span>
          <span className="block text-[12.5px] text-muted">{sous}</span>
        </span>
        <span className="flex items-center gap-2">
          {connue && (
            <span className="hidden rounded-full bg-blush px-2 py-0.5 text-[11.5px] font-semibold text-muted min-[380px]:inline">
              Déjà connue
            </span>
          )}
          <ChevronDown size={16} className={`text-muted transition-transform ${ouvert ? "rotate-180" : ""}`} />
        </span>
      </button>
      {ouvert && (
        <div className="grid gap-2 px-4 pb-4 text-[14.5px] leading-relaxed sm:pl-[78px]">
          {e.type === "oeuvre" && e.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={e.image.url}
              alt={e.titre}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="max-h-72 w-auto max-w-full justify-self-start rounded-xl"
            />
          )}
          {e.type === "oeuvre" ? (
            <>
              {e.extrait && <blockquote className="border-l-[3px] border-accent pl-3 italic">{formule(e.extrait)}</blockquote>}
              <ul className="grid gap-1">
                {e.points.map((p, i) => (
                  <li key={i}>› {formule(p)}</li>
                ))}
              </ul>
              {e.aPlacer && <p className="text-muted">À placer en copie : {formule(e.aPlacer)}</p>}
            </>
          ) : (
            <p className="whitespace-pre-line">{formule(e.texte)}</p>
          )}
          {"suite" in e && e.suite && <p className="whitespace-pre-line">{formule(e.suite)}</p>}
          {e.type === "actu" && (
            <p className="text-[12.5px] text-muted">
              {e.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && " · "}
                  <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
                    {s.nom} <ExternalLink size={11} />
                  </a>
                </span>
              ))}
            </p>
          )}
          <p className="text-[12px] text-muted">{NOMS_TYPE[e.type]}</p>
        </div>
      )}
    </li>
  );
}
