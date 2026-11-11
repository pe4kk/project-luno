"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { encre, pastel, useLuno } from "@/lib/store";
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
import { lienTravail } from "@/lib/liens";
import {
  Bouton,
  Carte,
  Champ,
  EnTete,
  EtatVide,
  Fenetre,
  classeSaisie,
  pluriel,
} from "@/components/ui";
import { CalendrierLycee } from "@/components/CalendrierLycee";
import { PanneauJour } from "@/components/PanneauJour";
import { Emoji } from "@/components/Emoji";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
type Brouillon = Omit<Dst, "id"> & { id?: string };

export default function Calendrier() {
  const { matieres, chapitres, dsts, enregistrerDst, supprimerDst } = useLuno();
  const aujourdhui = todayISO();
  const [vue, setVue] = useState(() => {
    const d = new Date();
    return { annee: d.getFullYear(), mois: d.getMonth() };
  });
  const [sens, setSens] = useState(1);
  const [jour, setJour] = useState<string | null>(null);
  const [brouillon, setBrouillon] = useState<Brouillon | null>(null);
  const [toutVoir, setToutVoir] = useState(false);

  const matiere = (id: string) => matieres.find((m) => m.id === id);
  const changerMois = (delta: number) => {
    setSens(delta);
    setVue((v) => {
      const d = new Date(v.annee, v.mois + delta, 1);
      return { annee: d.getFullYear(), mois: d.getMonth() };
    });
  };
  const nouveau = (date: string) => {
    setJour(null);
    setBrouillon({
      matiereId: matieres[0]?.id ?? "",
      titre: "",
      date,
      heure: "08:00",
      dureeMin: 120,
      salle: "",
      notes: "",
      chapitreIds: [],
    });
  };
  const modifier = (d: Dst) => {
    setJour(null);
    setBrouillon(d);
  };

  const parDate = (a: Dst, b: Dst) =>
    (a.date + a.heure).localeCompare(b.date + b.heure);
  const aVenir = dsts.filter((d) => joursAvant(d.date) >= 0).sort(parDate);
  const cases = grilleMois(vue.annee, vue.mois);
  const duJour = jour ? dsts.filter((d) => d.date === jour).sort(parDate) : [];

  if (matieres.length === 0) {
    return (
      <div>
        <EnTete
          titre="Calendrier"
          sousTitre="Tous tes devoirs sur table, au même endroit."
        />
        <CalendrierLycee />
        <EtatVide
          icone={<CalendarDays size={26} />}
          titre="Commence par créer une matière"
          texte="Chaque DST est rattaché à une matière. Reprends le calendrier du lycée ci-dessus, ou crée tes matières dans l'onglet Travail."
          action={
            <>
              <Link
                href="/travail"
                className="inline-flex min-h-11 items-center rounded-[10px] bg-ink px-4 text-[14.5px] font-medium text-bg"
              >
                Créer une matière
              </Link>
            </>
          }
        />
      </div>
    );
  }

  const chapitresDuBrouillon = brouillon
    ? chapitres.filter((c) => c.matiereId === brouillon.matiereId)
    : [];

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

      <CalendrierLycee />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_340px_340px] 2xl:gap-x-12">
        <Carte className="min-w-0 !p-3 sm:!p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="min-w-0 text-[20px] leading-tight sm:text-[24px]">
              {titreMois(vue.annee, vue.mois)}
            </h2>
            <div className="flex shrink-0 items-center gap-1">
              <Bouton
                variante="fantome"
                className="!px-2 sm:!px-3"
                onClick={() => {
                  const d = new Date();
                  setSens(1);
                  setVue({ annee: d.getFullYear(), mois: d.getMonth() });
                }}
              >
                Aujourd&apos;hui
              </Bouton>
              <Bouton
                variante="contour"
                className="!size-11 !p-0"
                aria-label="Mois précédent"
                onClick={() => changerMois(-1)}
              >
                <ChevronLeft size={18} />
              </Bouton>
              <Bouton
                variante="contour"
                className="!size-11 !p-0"
                aria-label="Mois suivant"
                onClick={() => changerMois(1)}
              >
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
                initial={{ opacity: 0, transform: `translate3d(${sens * 40}px, 0, 0)` }}
                animate={{ opacity: 1, transform: "translate3d(0px, 0, 0)" }}
                exit={{ opacity: 0, transform: `translate3d(${sens * -40}px, 0, 0)` }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-7 gap-1 sm:gap-1.5"
              >
                {cases.map(({ iso, dansMois }) => {
                  const ici = dsts.filter((d) => d.date === iso).sort(parDate);
                  const estAujourdhui = iso === aujourdhui;
                  return (
                    <button
                      key={iso}
                      onClick={() => setJour(iso)}
                      aria-label={`${dateLongue(iso)}${ici.length ? `, ${pluriel(ici.length, "DST", "DST")}` : ""}`}
                      className={`flex min-h-[62px] flex-col rounded-[10px] border p-1 text-left transition-colors sm:min-h-[96px] sm:p-2 2xl:min-h-[138px] ${
                        dansMois
                          ? "border-line bg-bg/40 hover:border-accent/50 hover:bg-accent-soft/40"
                          : "border-transparent opacity-40"
                      }`}
                    >
                      <span
                        className={`mb-1 flex size-6 items-center justify-center rounded-full text-[13px] font-semibold ${
                          estAujourdhui ? "bg-accent text-on-accent" : ""
                        }`}
                      >
                        {Number(iso.slice(8))}
                      </span>
                      <span className="flex w-full flex-col gap-1">
                        {ici.map((d) => {
                          const m = matiere(d.matiereId);
                          return (
                            <span
                              key={d.id}
                              className="rounded-md text-center text-[13px] leading-[20px] sm:truncate sm:px-1.5 sm:py-0.5 sm:text-left sm:text-[12px] sm:font-semibold sm:leading-normal"
                              style={{
                                background: pastel(m?.couleur ?? "#888", 26),
                                color: encre(m?.couleur ?? "#888", 55),
                              }}
                            >
                              <Emoji e={m?.emoji} />
                              <span className="hidden sm:inline">
                                {" "}
                                {m?.nom}
                              </span>
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
          <p className="mt-3 text-[13px] text-muted">
            Touche un jour pour voir ses DST ou en ajouter un.
          </p>
        </Carte>

        <div>
          <h2 className="mb-3 text-[18px]">À venir</h2>
          {aVenir.length === 0 && (
            <p className="rounded-2xl border border-dashed border-ink/20 p-5 text-[14.5px] text-muted">
              Aucun DST à venir. Touche un jour du calendrier pour en ajouter
              un.
            </p>
          )}
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {(toutVoir ? aVenir : aVenir.slice(0, 5)).map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                >
                  <CarteDst d={d} modifier={() => modifier(d)} />
                </motion.div>
              ))}
            </AnimatePresence>
            {aVenir.length > 5 && (
              <Bouton variante="contour" onClick={() => setToutVoir((v) => !v)}>
                {toutVoir
                  ? "Voir moins"
                  : `Voir les ${aVenir.length - 5} suivants`}
              </Bouton>
            )}
          </div>
        </div>
        <div className="hidden 2xl:block">
          <PanneauJour />
        </div>
      </div>

      {/* Détail d'un jour */}
      <Fenetre
        ouverte={jour !== null}
        fermer={() => setJour(null)}
        titre={jour ? dateLongue(jour) : ""}
      >
        <div className="flex flex-col gap-3">
          {duJour.length === 0 && (
            <p className="text-[14.5px] text-muted">Aucun DST ce jour-là.</p>
          )}
          {duJour.map((d) => (
            <CarteDst key={d.id} d={d} modifier={() => modifier(d)} />
          ))}
          <Bouton className="mt-1" onClick={() => jour && nouveau(jour)}>
            <Plus size={17} /> Ajouter un DST ce jour-là
          </Bouton>
        </div>
      </Fenetre>

      {/* Création ou modification */}
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
            <div>
              <span className="mb-1.5 block text-[13px] font-semibold text-muted">
                Matière
              </span>
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Matière"
              >
                {matieres.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    role="radio"
                    aria-checked={brouillon.matiereId === m.id}
                    onClick={() =>
                      setBrouillon({
                        ...brouillon,
                        matiereId: m.id,
                        chapitreIds: [],
                      })
                    }
                    className="min-h-11 rounded-full border-2 px-3 text-[13.5px] font-semibold transition-all"
                    style={{
                      borderColor:
                        brouillon.matiereId === m.id
                          ? m.couleur
                          : "transparent",
                      background: pastel(
                        m.couleur,
                        brouillon.matiereId === m.id ? 24 : 10,
                      ),
                      color: encre(m.couleur),
                    }}
                  >
                    <Emoji e={m.emoji} /> {m.nom}
                  </button>
                ))}
              </div>
            </div>
            <Champ label="Sujet du devoir">
              <input
                required
                autoFocus
                className={classeSaisie}
                placeholder="Ex. Dérivation et tangentes"
                value={brouillon.titre}
                onChange={(e) =>
                  setBrouillon({ ...brouillon, titre: e.target.value })
                }
              />
            </Champ>
            {chapitresDuBrouillon.length > 0 && (
              <div>
                <span className="mb-1.5 block text-[13px] font-semibold text-muted">
                  Chapitres à réviser
                </span>
                <div className="flex flex-wrap gap-2">
                  {chapitresDuBrouillon.map((c) => {
                    const coche = brouillon.chapitreIds.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        aria-pressed={coche}
                        onClick={() =>
                          setBrouillon({
                            ...brouillon,
                            titre: brouillon.titre || c.titre,
                            chapitreIds: coche
                              ? brouillon.chapitreIds.filter((x) => x !== c.id)
                              : [...brouillon.chapitreIds, c.id],
                          })
                        }
                        className={`min-h-11 rounded-full border px-3 text-[13.5px] font-medium transition-colors ${
                          coche
                            ? "border-ink bg-ink text-bg"
                            : "border-line bg-surface text-ink"
                        }`}
                      >
                        {coche ? "✓ " : ""}
                        {c.titre}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Date">
                <input
                  required
                  type="date"
                  className={classeSaisie}
                  value={brouillon.date}
                  onChange={(e) =>
                    setBrouillon({ ...brouillon, date: e.target.value })
                  }
                />
              </Champ>
              <Champ label="Heure (facultatif)">
                <input
                  type="time"
                  className={classeSaisie}
                  value={brouillon.heure}
                  onChange={(e) =>
                    setBrouillon({ ...brouillon, heure: e.target.value })
                  }
                />
              </Champ>
              <Champ label="Durée">
                <select
                  className={classeSaisie}
                  value={brouillon.dureeMin}
                  onChange={(e) =>
                    setBrouillon({
                      ...brouillon,
                      dureeMin: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>Non précisée</option>
                  {[30, 55, 60, 90, 120, 180, 240].map((d) => (
                    <option key={d} value={d}>
                      {dureeLisible(d)}
                    </option>
                  ))}
                </select>
              </Champ>
              <Champ label="Salle (facultatif)">
                <input
                  className={classeSaisie}
                  value={brouillon.salle}
                  onChange={(e) =>
                    setBrouillon({ ...brouillon, salle: e.target.value })
                  }
                />
              </Champ>
            </div>
            <Champ label="Notes (facultatif)">
              <textarea
                rows={2}
                className={classeSaisie}
                placeholder="Calculatrice, points à revoir…"
                value={brouillon.notes}
                onChange={(e) =>
                  setBrouillon({ ...brouillon, notes: e.target.value })
                }
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

function CarteDst({ d, modifier }: { d: Dst; modifier: () => void }) {
  const { matieres, chapitres } = useLuno();
  const m = matieres.find((x) => x.id === d.matiereId);
  const j = joursAvant(d.date);
  const lies = chapitres.filter((c) => d.chapitreIds.includes(c.id));

  return (
    <div className="flex gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <span
        className="w-1.5 shrink-0 rounded-full"
        style={{ background: m?.couleur }}
      />
      <div className="min-w-0 flex-1">
        <button
          onClick={modifier}
          className="block w-full text-left"
          aria-label={`Modifier le DST : ${m?.nom}, ${dateLongue(d.date)}`}
        >
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-[15.5px] font-semibold">
              <Emoji e={m?.emoji} /> {m?.nom}
            </span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-bold ${
                j >= 0 && j <= 3
                  ? "bg-accent-soft text-accent"
                  : "bg-ink/5 text-muted"
              }`}
            >
              {compteARebours(d.date)}
            </span>
          </span>
          <span className="block truncate text-[14px] text-muted">
            {d.titre}
          </span>
          <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-muted">
            <span>{dateLongue(d.date)}</span>
            {(d.heure || d.dureeMin > 0) && (
              <span className="flex items-center gap-1">
                <Clock size={12} />{" "}
                {[d.heure, d.dureeMin > 0 ? dureeLisible(d.dureeMin) : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            )}
            {d.salle && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {d.salle}
              </span>
            )}
          </span>
          {d.notes && (
            <span className="mt-1 block text-[12.5px] text-muted">
              {d.notes}
            </span>
          )}
        </button>
        {lies.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {lies.map((c) => (
              <Link
                key={c.id}
                href={lienTravail({ m: c.matiereId, c: c.id, o: "flashcards" })}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent-soft px-3 text-[13px] font-semibold text-accent transition-colors hover:bg-accent hover:text-on-accent"
              >
                <BookOpen size={13} /> Réviser {c.titre}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
