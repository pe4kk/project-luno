"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { useLuno, pastel } from "@/lib/store";
import type { Dst } from "@/lib/types";
import {
  compteARebours,
  dateLongue,
  dureeLisible,
  grilleMois,
  joursAvant,
  titreMois,
  todayISO,
} from "@/lib/dates";
import { Bouton, Carte, Champ, EnTete, EtatVide, Fenetre, classeSaisie } from "@/components/ui";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
type Brouillon = Omit<Dst, "id"> & { id?: string };

export default function Calendrier() {
  const { matieres, dsts, enregistrerDst, supprimerDst, chargerExemple } = useLuno();
  const aujourdhui = todayISO();
  const [vue, setVue] = useState(() => {
    const d = new Date();
    return { annee: d.getFullYear(), mois: d.getMonth() };
  });
  const [sens, setSens] = useState(1);
  const [brouillon, setBrouillon] = useState<Brouillon | null>(null);

  const matiere = (id: string) => matieres.find((m) => m.id === id);
  const changerMois = (delta: number) => {
    setSens(delta);
    setVue((v) => {
      const d = new Date(v.annee, v.mois + delta, 1);
      return { annee: d.getFullYear(), mois: d.getMonth() };
    });
  };
  const nouveau = (date: string) =>
    setBrouillon({
      matiereId: matieres[0]?.id ?? "",
      titre: "",
      date,
      heure: "08:00",
      dureeMin: 120,
      salle: "",
      notes: "",
    });

  const aVenir = dsts
    .filter((d) => joursAvant(d.date) >= 0)
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  const cases = grilleMois(vue.annee, vue.mois);

  if (matieres.length === 0) {
    return (
      <div>
        <EnTete titre="Calendrier" sousTitre="Tous tes devoirs sur table, au même endroit." />
        <EtatVide
          icone={<CalendarDays size={26} />}
          titre="Commence par créer une matière"
          texte="Chaque DST est rattaché à une matière. Crée tes matières dans l'onglet Travail, ou charge l'exemple pour essayer."
          action={<Bouton onClick={chargerExemple}>Charger l&apos;exemple</Bouton>}
        />
      </div>
    );
  }

  return (
    <div>
      <EnTete
        titre="Calendrier"
        sousTitre="Tous tes devoirs sur table, au même endroit."
        action={
          <Bouton onClick={() => nouveau(aujourdhui)}>
            <Plus size={17} /> Ajouter un DST
          </Bouton>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <Carte className="!p-4 sm:!p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[24px] font-bold">{titreMois(vue.annee, vue.mois)}</h2>
            <div className="flex items-center gap-1">
              <Bouton
                variante="fantome"
                className="!px-3"
                onClick={() => {
                  const d = new Date();
                  setSens(1);
                  setVue({ annee: d.getFullYear(), mois: d.getMonth() });
                }}
              >
                Aujourd&apos;hui
              </Bouton>
              <Bouton variante="contour" className="!p-2.5" aria-label="Mois précédent" onClick={() => changerMois(-1)}>
                <ChevronLeft size={18} />
              </Bouton>
              <Bouton variante="contour" className="!p-2.5" aria-label="Mois suivant" onClick={() => changerMois(1)}>
                <ChevronRight size={18} />
              </Bouton>
            </div>
          </div>

          <div className="grid grid-cols-7 pb-2 text-center text-[12px] font-semibold uppercase tracking-wide text-muted">
            {JOURS.map((j) => (
              <div key={j}>{j}</div>
            ))}
          </div>

          <div className="overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={sens}>
              <motion.div
                key={`${vue.annee}-${vue.mois}`}
                custom={sens}
                initial={{ opacity: 0, x: sens * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: sens * -40 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-7 gap-1 sm:gap-1.5"
              >
                {cases.map(({ iso, dansMois }) => {
                  const duJour = dsts.filter((d) => d.date === iso);
                  const estAujourdhui = iso === aujourdhui;
                  return (
                    <button
                      key={iso}
                      onClick={() => (duJour.length === 1 ? setBrouillon(duJour[0]) : nouveau(iso))}
                      className={`group flex min-h-[68px] flex-col rounded-xl border p-1.5 text-left transition-colors sm:min-h-[96px] sm:p-2 ${
                        dansMois ? "border-line bg-bg/40 hover:border-accent/50 hover:bg-accent-soft/40" : "border-transparent opacity-35"
                      }`}
                    >
                      <span
                        className={`mb-1 flex size-6 items-center justify-center rounded-full text-[13px] font-semibold ${
                          estAujourdhui ? "bg-accent text-white" : ""
                        }`}
                      >
                        {Number(iso.slice(8))}
                      </span>
                      <span className="flex w-full flex-col gap-1">
                        {duJour.map((d) => {
                          const m = matiere(d.matiereId);
                          return (
                            <span
                              key={d.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setBrouillon(d);
                              }}
                              className="truncate rounded-md px-1.5 py-0.5 text-[11px] font-semibold sm:text-[12px]"
                              style={{
                                background: pastel(m?.couleur ?? "#888", 20),
                                color: `color-mix(in oklab, ${m?.couleur ?? "#888"} 70%, black)`,
                              }}
                            >
                              <span className="hidden sm:inline">{m?.emoji} </span>
                              {m?.nom}
                            </span>
                          );
                        })}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </Carte>

        <div>
          <h2 className="mb-3 text-[18px] font-bold">À venir</h2>
          {aVenir.length === 0 && (
            <p className="rounded-2xl border border-dashed border-ink/15 p-5 text-[14.5px] text-muted">
              Aucun DST à venir. Clique sur un jour du calendrier pour en ajouter un.
            </p>
          )}
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {aVenir.map((d) => {
                const m = matiere(d.matiereId);
                const j = joursAvant(d.date);
                return (
                  <motion.button
                    layout
                    key={d.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ x: 3 }}
                    onClick={() => setBrouillon(d)}
                    className="flex gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-card"
                  >
                    <span className="w-1.5 shrink-0 rounded-full" style={{ background: m?.couleur }} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[15.5px] font-bold">
                          {m?.emoji} {m?.nom}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-bold ${
                            j <= 3 ? "bg-bad/15 text-bad" : "bg-ink/5 text-muted"
                          }`}
                        >
                          {compteARebours(d.date)}
                        </span>
                      </span>
                      <span className="block truncate text-[14px] text-muted">{d.titre}</span>
                      <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-muted">
                        <span >{dateLongue(d.date)}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {d.heure} · {dureeLisible(d.dureeMin)}
                        </span>
                        {d.salle && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {d.salle}
                          </span>
                        )}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Fenetre
        ouverte={brouillon !== null}
        fermer={() => setBrouillon(null)}
        titre={brouillon?.id ? "Modifier le DST" : "Nouveau DST"}
      >
        {brouillon && (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              enregistrerDst(brouillon);
              setBrouillon(null);
            }}
          >
            <Champ label="Matière">
              <div className="flex flex-wrap gap-2">
                {matieres.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setBrouillon({ ...brouillon, matiereId: m.id })}
                    className="rounded-full border-2 px-3 py-1.5 text-[13.5px] font-semibold transition-all"
                    style={{
                      borderColor: brouillon.matiereId === m.id ? m.couleur : "transparent",
                      background: pastel(m.couleur, brouillon.matiereId === m.id ? 22 : 10),
                      color: `color-mix(in oklab, ${m.couleur} 70%, black)`,
                    }}
                  >
                    {m.emoji} {m.nom}
                  </button>
                ))}
              </div>
            </Champ>
            <Champ label="Sujet du devoir">
              <input
                required
                autoFocus
                className={classeSaisie}
                placeholder="Ex. Dérivation, chapitres 3 et 4"
                value={brouillon.titre}
                onChange={(e) => setBrouillon({ ...brouillon, titre: e.target.value })}
              />
            </Champ>
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Date">
                <input
                  required
                  type="date"
                  className={classeSaisie}
                  value={brouillon.date}
                  onChange={(e) => setBrouillon({ ...brouillon, date: e.target.value })}
                />
              </Champ>
              <Champ label="Heure">
                <input
                  required
                  type="time"
                  className={classeSaisie}
                  value={brouillon.heure}
                  onChange={(e) => setBrouillon({ ...brouillon, heure: e.target.value })}
                />
              </Champ>
              <Champ label="Durée">
                <select
                  className={classeSaisie}
                  value={brouillon.dureeMin}
                  onChange={(e) => setBrouillon({ ...brouillon, dureeMin: Number(e.target.value) })}
                >
                  {[30, 55, 60, 90, 120, 180, 240].map((d) => (
                    <option key={d} value={d}>
                      {dureeLisible(d)}
                    </option>
                  ))}
                </select>
              </Champ>
              <Champ label="Salle">
                <input
                  className={classeSaisie}
                  placeholder="Facultatif"
                  value={brouillon.salle}
                  onChange={(e) => setBrouillon({ ...brouillon, salle: e.target.value })}
                />
              </Champ>
            </div>
            <Champ label="Notes">
              <textarea
                rows={2}
                className={classeSaisie}
                placeholder="Calculatrice, chapitres à réviser…"
                value={brouillon.notes}
                onChange={(e) => setBrouillon({ ...brouillon, notes: e.target.value })}
              />
            </Champ>
            <div className="mt-1 flex items-center justify-between">
              {brouillon.id ? (
                <Bouton
                  type="button"
                  variante="fantome"
                  className="!text-bad"
                  onClick={() => {
                    supprimerDst(brouillon.id!);
                    setBrouillon(null);
                  }}
                >
                  <Trash2 size={16} /> Supprimer
                </Bouton>
              ) : (
                <span />
              )}
              <Bouton type="submit" disabled={!brouillon.matiereId}>
                Enregistrer
              </Bouton>
            </div>
          </form>
        )}
      </Fenetre>
    </div>
  );
}
