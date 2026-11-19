"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Eye, EyeOff, RotateCcw, Sparkles, Undo2 } from "lucide-react";
import { formule } from "@/components/Formule";
import { Curseur } from "@/components/Curseur";
import { Bouton, Carte, EnTete, pluriel } from "@/components/ui";
import { dansJours, joursAvant, todayISO } from "@/lib/dates";
import { MINIMUM_AJUSTEMENT, RETENTION, ajuster, delaiPour, historiques, nombreEvaluables } from "@/lib/fsrs";
import { lienTravail } from "@/lib/liens";
import { QUOTA_NOUVELLES, cartesEnAvance, cartesRateesAujourdhui, revisionDuJour } from "@/lib/revision";
import { cleCarte, estSangsue, useLuno } from "@/lib/store";
import type { Chapitre, Flashcard } from "@/lib/types";

/**
 * Statistiques et réglages de la répétition espacée (comme Anki), demandé le 2026-11-18
 * (« fais la totale ») : jours de révision, prévision, taux de réussite réel, cartes
 * sangsues et suspendues, révisions sur mesure, taux visé, nouvelles cartes par jour, et
 * ajustement de FSRS sur l'historique.
 */

const JOUR = 86_400_000;
const date = (iso: string) => iso.slice(0, 10);
const jourCourt = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

/** Chaque carte une seule fois (une carte publiée dans deux chapitres compte pour une). */
function cartesUniques(chapitres: Chapitre[]) {
  const vues = new Set<string>();
  const l: { f: Flashcard; c: Chapitre }[] = [];
  for (const c of chapitres)
    for (const f of c.flashcards) {
      const k = cleCarte(f);
      if (vues.has(k)) continue;
      vues.add(k);
      l.push({ f, c });
    }
  return l;
}

export default function Statistiques() {
  const { chapitres, matieres, dsts, jour, revisions = [], reglages = {}, suspendreCarte } = useLuno();
  const aujourdhui = todayISO();
  const cartes = useMemo(() => cartesUniques(chapitres), [chapitres]);

  // ——— Activité par jour ———
  const parJour = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of revisions) m.set(date(r.date), (m.get(date(r.date)) ?? 0) + 1);
    return m;
  }, [revisions]);
  const serie = (() => {
    let n = 0;
    // Une série continue tant qu'hier a été travaillé, même si aujourd'hui pas encore.
    let d = parJour.has(aujourdhui) ? 0 : 1;
    while (parJour.has(dansJours(-d))) {
      n++;
      d++;
    }
    return n;
  })();

  // Taux de réussite réel sur 30 jours : cartes déjà vues, réponse autre que « À revoir ».
  const depuis = dansJours(-30);
  const recentes = revisions.filter((r) => r.date >= depuis && !r.nouvelle);
  const reussite = recentes.length ? recentes.filter((r) => r.note > 0).length / recentes.length : null;

  // ——— État des cartes ———
  const etat = { nouvelles: 0, enCours: 0, solides: 0, suspendues: 0 };
  for (const { f } of cartes) {
    if (f.suspendue) etat.suspendues++;
    else if (f.niveau === 0) etat.nouvelles++;
    else if (f.intervalle >= 21) etat.solides++;
    else etat.enCours++;
  }

  // ——— Prévision sur 30 jours (les cartes en retard comptent aujourd'hui) ———
  const prevision = Array.from({ length: 30 }, (_, i) => ({ jour: dansJours(i), n: 0 }));
  for (const { f } of cartes) {
    if (f.suspendue || f.niveau === 0) continue;
    const i = Math.max(0, joursAvant(f.echeance));
    if (i < 30) prevision[i].n++;
  }
  // Aujourd'hui : exactement la révision du jour de l'accueil (cartes revenues, en retard, et
  // nouvelles du quota), pour que les deux écrans donnent le même nombre.
  const duJour = revisionDuJour(chapitres, dsts, jour, reglages.nouvellesParJour);
  const nouvellesDuJour = duJour.cartes.length - prevision[0].n;
  prevision[0].n = duJour.cartes.length;
  const maxPrev = Math.max(1, ...prevision.map((p) => p.n));
  const semaine = prevision.slice(0, 7).reduce((t, p) => t + p.n, 0);

  const ratees = cartesRateesAujourdhui(chapitres, revisions).length;
  const enAvance = cartesEnAvance(chapitres, 3).length;
  const sangsues = cartes.filter(({ f }) => estSangsue(f) && !f.suspendue);
  const suspendues = cartes.filter(({ f }) => f.suspendue);

  return (
    <div className="mx-auto max-w-[980px]">
      <EnTete titre="Statistiques" sousTitre="Tes révisions de flashcards, et les réglages de la répétition espacée." />

      {/* Résumé */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-aligne-panneau>
        <Tuile titre="Aujourd'hui" valeur={String(parJour.get(aujourdhui) ?? 0)} detail="cartes revues" />
        <Tuile titre="Série" valeur={String(serie)} detail={serie > 1 ? "jours d'affilée" : "jour d'affilée"} />
        <Tuile
          titre="Réussite réelle"
          valeur={reussite === null ? "—" : `${Math.round(reussite * 100)} %`}
          detail={reussite === null ? "pas encore assez de révisions" : `sur 30 jours · visé ${Math.round((reglages.retention ?? RETENTION) * 100)} %`}
        />
        <Tuile
          titre="À revoir aujourd'hui"
          valeur={String(prevision[0].n)}
          detail={`${nouvellesDuJour > 0 ? `dont ${pluriel(nouvellesDuJour, "nouvelle")} · ` : ""}${semaine} cette semaine`}
        />
      </div>

      {revisions.length === 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[18px] border border-dashed border-line bg-surface px-5 py-4">
          <p className="min-w-0 flex-1 text-[14.5px] leading-relaxed">
            <strong className="font-semibold">Pas encore de révision.</strong>{" "}
            <span className="text-muted">
              Fais ta première séance : tes jours de révision, ta série et ta réussite s&apos;afficheront ici.
            </span>
          </p>
          {prevision[0].n > 0 && (
            <Link
              href={lienTravail({ r: "tout" })}
              className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[14.5px] font-medium text-on-accent"
            >
              Réviser {pluriel(prevision[0].n, "carte")}
            </Link>
          )}
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Carte className="grid min-w-0 gap-3 [&>*]:min-w-0">
          <h2 className="text-[19px]">Tes jours de révision</h2>
          <Calendrier parJour={parJour} />
        </Carte>
        <Carte className="grid min-w-0 gap-3 [&>*]:min-w-0">
          <h2 className="text-[19px]">Les 30 prochains jours</h2>
          <Prevision prevision={prevision} max={maxPrev} />
        </Carte>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Carte className="grid min-w-0 gap-3 [&>*]:min-w-0">
          <h2 className="text-[19px]">Tes cartes</h2>
          <Repartition etat={etat} />
        </Carte>
        <Carte className="grid min-w-0 gap-3 [&>*]:min-w-0">
          <h2 className="text-[19px]">Révisions sur mesure</h2>
          <p className="text-[13.5px] leading-relaxed text-muted">
            En plus de la révision du jour, sans changer son programme.
          </p>
          <LienSurMesure href={lienTravail({ r: "ratees" })} icone={<Undo2 size={17} />} titre="Les cartes ratées aujourd'hui" n={ratees} />
          <LienSurMesure href={lienTravail({ r: "avance" })} icone={<CalendarClock size={17} />} titre="Réviser en avance (3 prochains jours)" n={enAvance} />
        </Carte>
      </div>

      {(sangsues.length > 0 || suspendues.length > 0) && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {sangsues.length > 0 && (
            <Carte className="grid min-w-0 gap-3 [&>*]:min-w-0">
              <h2 className="text-[19px]">Cartes sangsues · {sangsues.length}</h2>
              <p className="text-[13.5px] leading-relaxed text-muted">
                Oubliées encore et encore : la revoir ne suffit plus. Demande une explication (sélectionne le texte dans
                l&apos;onglet Flashcards), réécris-la avec tes mots, ou mets-la de côté.
              </p>
              <ul className="grid min-w-0 gap-2 [&>*]:min-w-0">
                {sangsues.map(({ f, c }) => (
                  <LigneCarte key={f.id} f={f} c={c} matiere={matieres.find((m) => m.id === c.matiereId)?.nom ?? ""} detail={`oubliée ${f.oublis} fois`}>
                    <Bouton variante="fantome" className="!min-h-10 !px-2.5" onClick={() => suspendreCarte(c.id, f.id, true)}>
                      <EyeOff size={15} /> Suspendre
                    </Bouton>
                  </LigneCarte>
                ))}
              </ul>
            </Carte>
          )}
          {suspendues.length > 0 && (
            <Carte className="grid min-w-0 gap-3 [&>*]:min-w-0">
              <h2 className="text-[19px]">Cartes suspendues · {suspendues.length}</h2>
              <p className="text-[13.5px] leading-relaxed text-muted">Elles ne reviennent plus en révision tant que tu ne les réactives pas.</p>
              <ul className="grid min-w-0 gap-2 [&>*]:min-w-0">
                {suspendues.map(({ f, c }) => (
                  <LigneCarte key={f.id} f={f} c={c} matiere={matieres.find((m) => m.id === c.matiereId)?.nom ?? ""}>
                    <Bouton variante="contour" className="!min-h-10 !px-2.5" onClick={() => suspendreCarte(c.id, f.id, false)}>
                      <Eye size={15} /> Réactiver
                    </Bouton>
                  </LigneCarte>
                ))}
              </ul>
            </Carte>
          )}
        </div>
      )}

      <Reglages />
    </div>
  );
}

function Tuile({ titre, valeur, detail }: { titre: string; valeur: string; detail: string }) {
  return (
    <div className="rounded-[18px] border border-line bg-surface p-4 shadow-card">
      <p className="text-[12.5px] font-semibold text-muted">{titre}</p>
      <p className="mt-0.5 font-display text-[30px] leading-none tabular-nums">{valeur}</p>
      <p className="mt-1.5 text-[12px] leading-snug text-muted">{detail}</p>
    </div>
  );
}

/** Calendrier des 18 dernières semaines : une case par jour, plus foncée quand on a beaucoup révisé. */
function Calendrier({ parJour }: { parJour: Map<string, number> }) {
  const semaines = 18;
  const fin = new Date(todayISO() + "T12:00:00");
  // On commence un lundi, 17 semaines avant la semaine en cours.
  const lundi = new Date(fin.getTime() - (((fin.getDay() + 6) % 7) + 7 * (semaines - 1)) * JOUR);
  const colonnes = Array.from({ length: semaines }, (_, s) =>
    Array.from({ length: 7 }, (_, j) => {
      const d = new Date(lundi.getTime() + (s * 7 + j) * JOUR).toISOString().slice(0, 10);
      return { d, n: parJour.get(d) ?? 0, futur: d > todayISO() };
    }),
  );
  // Quatre crans bien distincts du jour vide (gris très clair) : 1-4, 5-14, 15-29, 30 et plus.
  const niveau = (n: number) => (n === 0 ? 0 : n < 5 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4);
  const fond = ["", "45%", "65%", "85%", "100%"];
  const total = [...parJour.values()].reduce((a, b) => a + b, 0);
  const jours = parJour.size;
  return (
    <div>
      <div>
        {/* Colonnes élastiques : les 18 semaines tiennent même à 320 px. */}
        <div className="grid max-w-[340px] gap-[3px]" style={{ gridTemplateColumns: `repeat(${semaines}, minmax(0, 1fr))` }} role="img" aria-label={`${pluriel(total, "révision")} sur ${pluriel(jours, "jour")} ces 18 dernières semaines`}>
          {colonnes.map((col, i) => (
            <div key={i} className="grid gap-[3px]">
              {col.map(({ d, n, futur }) => (
                <span
                  key={d}
                  title={futur ? undefined : `${jourCourt(d)} : ${pluriel(n, "carte revue", "cartes revues")}`}
                  className="block aspect-square w-full rounded-[3px]"
                  style={{
                    background: futur ? "transparent" : n ? `color-mix(in srgb, var(--copper) ${fond[niveau(n)]}, var(--surface))` : "color-mix(in srgb, var(--ink) 6%, var(--surface))",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted">
        <span>
          {pluriel(total, "révision")} en {pluriel(jours, "jour")}
        </span>
        <span className="inline-flex items-center gap-1">
          moins
          {[0, 1, 2, 3, 4].map((k) => (
            <span
              key={k}
              className="inline-block size-[11px] rounded-[3px]"
              style={{ background: k ? `color-mix(in srgb, var(--copper) ${fond[k]}, var(--surface))` : "color-mix(in srgb, var(--ink) 6%, var(--surface))" }}
            />
          ))}
          plus
        </span>
      </div>
    </div>
  );
}

/** Barres : nombre de cartes prévues chaque jour (une seule série, une seule teinte). */
function Prevision({ prevision, max }: { prevision: { jour: string; n: number }[]; max: number }) {
  const [survol, setSurvol] = useState<number | null>(null);
  const actif = survol ?? 0;
  return (
    <div>
      <p className="text-[13.5px]" aria-live="polite">
        <strong className="tabular-nums">{pluriel(prevision[actif].n, "carte")}</strong>{" "}
        <span className="text-muted">{actif === 0 ? "aujourd'hui (nouvelles et retards compris)" : actif === 1 ? "demain" : `le ${jourCourt(prevision[actif].jour)}`}</span>
      </p>
      <div className="mt-2 flex h-[120px] items-end gap-[2px] border-b border-line" role="img" aria-label="Cartes prévues chaque jour pendant 30 jours">
        {prevision.map((p, i) => (
          <button
            key={p.jour}
            type="button"
            onPointerEnter={() => setSurvol(i)}
            onFocus={() => setSurvol(i)}
            onClick={() => setSurvol(i)}
            aria-label={`${jourCourt(p.jour)} : ${pluriel(p.n, "carte")}`}
            className="group flex h-full flex-1 items-end"
          >
            <span
              className="block w-full rounded-t-[4px] transition-opacity"
              style={{
                height: p.n ? `${Math.max(4, (p.n / max) * 100)}%` : "2px",
                background: p.n ? "var(--copper)" : "var(--line)",
                opacity: survol === null || survol === i ? 1 : 0.45,
              }}
            />
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11.5px] text-muted tabular-nums">
        <span>aujourd&apos;hui</span>
        <span>+1 sem.</span>
        <span>+2 sem.</span>
        <span>+3 sem.</span>
        <span>+4 sem.</span>
      </div>
    </div>
  );
}

function Repartition({ etat }: { etat: { nouvelles: number; enCours: number; solides: number; suspendues: number } }) {
  const lignes = [
    { label: "Solides", detail: "reviennent dans 3 semaines ou plus", n: etat.solides, fond: "var(--copper)" },
    { label: "En cours", detail: "déjà vues, encore fragiles", n: etat.enCours, fond: "color-mix(in srgb, var(--copper) 55%, var(--surface))" },
    { label: "Nouvelles", detail: "jamais vues", n: etat.nouvelles, fond: "var(--line)" },
  ];
  const total = Math.max(1, lignes.reduce((t, l) => t + l.n, 0));
  return (
    <div className="grid min-w-0 gap-3 [&>*]:min-w-0">
      <div className="flex h-3 gap-[2px] overflow-hidden rounded-full" role="img" aria-label={lignes.map((l) => `${l.label} : ${l.n}`).join(", ")}>
        {lignes.map((l) => l.n > 0 && <span key={l.label} style={{ flex: l.n, background: l.fond }} />)}
      </div>
      <ul className="grid gap-1.5">
        {lignes.map((l) => (
          <li key={l.label} className="flex items-center gap-2.5 text-[14px]">
            <span className="size-3 shrink-0 rounded-[3px]" style={{ background: l.fond }} />
            <span className="font-semibold">{l.label}</span>
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-muted max-[379px]:hidden">{l.detail}</span>
            <span className="ml-auto tabular-nums">{l.n}</span>
            <span className="w-10 text-right text-[12.5px] tabular-nums text-muted">{Math.round((l.n / total) * 100)} %</span>
          </li>
        ))}
      </ul>
      {etat.suspendues > 0 && <p className="text-[12.5px] text-muted">Et {pluriel(etat.suspendues, "carte suspendue", "cartes suspendues")}.</p>}
    </div>
  );
}

function LienSurMesure({ href, icone, titre, n }: { href: string; icone: React.ReactNode; titre: string; n: number }) {
  return n > 0 ? (
    <Link href={href} className="flex min-h-12 items-center gap-3 rounded-xl border border-line px-3.5 py-2 transition-colors hover:border-ink/30">
      <span className="text-accent">{icone}</span>
      <span className="min-w-0 flex-1 text-[14.5px] font-medium">{titre}</span>
      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[12.5px] font-semibold tabular-nums text-accent">{n}</span>
    </Link>
  ) : (
    <p className="flex min-h-12 items-center gap-3 rounded-xl border border-dashed border-line px-3.5 py-2 text-[14px] text-muted">
      {icone} {titre} : aucune carte
    </p>
  );
}

function LigneCarte({ f, c, matiere, detail, children }: { f: Flashcard; c: Chapitre; matiere: string; detail?: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 border-t border-line pt-2 first:border-t-0 first:pt-0">
      <Link href={lienTravail({ m: c.matiereId, c: c.id, o: "flashcards" })} className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium">{formule(f.recto)}</span>
        <span className="block truncate text-[12px] text-muted">
          {matiere} · {c.titre}
          {detail ? ` · ${detail}` : ""}
        </span>
      </Link>
      {children}
    </li>
  );
}

// ———————————————————— Réglages ————————————————————

function Reglages() {
  const { revisions = [], reglages = {}, majReglages } = useLuno();
  const retention = Math.round((reglages.retention ?? RETENTION) * 100);
  const quota = reglages.nouvellesParJour ?? QUOTA_NOUVELLES;
  const evaluables = useMemo(() => nombreEvaluables(historiques(revisions)), [revisions]);
  const [calcul, setCalcul] = useState<{ fait: number; total: number } | null>(null);
  const [resultat, setResultat] = useState<{ gain: number } | null>(null);
  const pret = evaluables >= MINIMUM_AJUSTEMENT;

  const lancer = async () => {
    setCalcul({ fait: 0, total: 1 });
    setResultat(null);
    const r = await ajuster(revisions, (fait, total) => setCalcul({ fait, total }));
    setCalcul(null);
    // On ne garde les nouveaux poids que s'ils prédisent mieux ton historique.
    if (r.apres < r.avant) {
      majReglages({ poids: r.poids, ajusteLe: todayISO(), ajusteSur: r.evaluables });
      setResultat({ gain: (r.avant - r.apres) / r.avant });
    } else setResultat({ gain: 0 });
  };

  return (
    <section className="mt-8">
      <h2 className="text-[24px]">Réglages</h2>
      <div className="mt-3 grid gap-5 lg:grid-cols-2">
        <Carte className="grid min-w-0 gap-3 [&>*]:min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[17px] font-semibold">Taux de réussite visé</h3>
            <span className="font-display text-[26px] tabular-nums text-accent">{retention} %</span>
          </div>
          <Curseur min={80} max={95} value={retention} onChange={(v) => majReglages({ retention: v / 100 })} label="Taux de réussite visé" valueText={`${retention} %`} />
          <p className="text-[13.5px] leading-relaxed text-muted">
            La chance de te souvenir d&apos;une carte quand elle revient. Plus il est haut, plus les cartes reviennent
            souvent. Exemple : une carte bien partie revient dans{" "}
            <strong className="text-ink">{delaiPour(10, retention / 100)} jours</strong> à {retention} % (10 jours à 90 %).
            Anki conseille entre 85 et 92 %.
          </p>
        </Carte>
        <Carte className="grid min-w-0 gap-3 [&>*]:min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[17px] font-semibold">Nouvelles cartes par jour</h3>
            <span className="font-display text-[26px] tabular-nums text-accent">{quota}</span>
          </div>
          <Curseur min={5} max={50} value={quota} onChange={(v) => majReglages({ nouvellesParJour: v })} label="Nouvelles cartes par jour" />
          <p className="text-[13.5px] leading-relaxed text-muted">
            Dans la révision du jour. Chaque nouvelle carte en ajoute quelques-unes à revoir les jours suivants : 20 par
            jour, c&apos;est environ 15 à 20 minutes. Avant un DST proche (3 jours ou moins), ses cartes passent toutes.
          </p>
        </Carte>
        <Carte className="grid min-w-0 gap-3 [&>*]:min-w-0 lg:col-span-2">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="mt-0.5 shrink-0 text-accent" />
            <div className="min-w-0">
              <h3 className="text-[17px] font-semibold">Ajuster l&apos;algorithme sur toi</h3>
              <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                Luno calcule tes délais avec FSRS, l&apos;algorithme d&apos;Anki, réglé au départ sur un élève « moyen ». Avec ton
                historique, il apprend à quelle vitesse <em>toi</em> tu oublies, et ajuste tes délais. Il faut au moins{" "}
                {MINIMUM_AJUSTEMENT} révisions de cartes déjà vues, faites des jours différents. Le calcul se fait sur ton
                appareil, en quelques secondes.
              </p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={MINIMUM_AJUSTEMENT} aria-valuenow={Math.min(evaluables, MINIMUM_AJUSTEMENT)}>
            <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, (evaluables / MINIMUM_AJUSTEMENT) * 100)}%` }} />
          </div>
          <p className="text-[13px] text-muted tabular-nums">
            {Math.min(evaluables, MINIMUM_AJUSTEMENT)} / {MINIMUM_AJUSTEMENT} révisions
            {reglages.ajusteLe
              ? ` · ajusté le ${new Date(reglages.ajusteLe + "T12:00:00").toLocaleDateString("fr-FR")} sur ${reglages.ajusteSur} révisions`
              : " · réglages par défaut"}
          </p>
          {calcul ? (
            <p className="text-[14px] font-semibold" role="status">
              Calcul… {Math.round((calcul.fait / calcul.total) * 100)} %
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Bouton onClick={() => void lancer()} disabled={!pret}>
                <Sparkles size={16} /> {reglages.poids ? "Réajuster sur mon historique" : "Ajuster sur mon historique"}
              </Bouton>
              {reglages.poids && (
                <Bouton variante="contour" onClick={() => majReglages({ poids: undefined, ajusteLe: undefined, ajusteSur: undefined })}>
                  <RotateCcw size={16} /> Revenir aux réglages par défaut
                </Bouton>
              )}
            </div>
          )}
          {!pret && !calcul && (
            <p className="text-[13px] text-muted">
              Encore {pluriel(MINIMUM_AJUSTEMENT - evaluables, "révision")} avant de pouvoir ajuster. Continue la révision du jour :
              chaque réponse compte.
            </p>
          )}
          {resultat && (
            <p className="text-[13.5px] font-semibold" role="status" style={{ color: resultat.gain > 0 ? "var(--ok)" : "var(--muted)" }}>
              {resultat.gain > 0
                ? `C'est fait : tes délais suivent maintenant ta mémoire (prédiction meilleure de ${Math.max(1, Math.round(resultat.gain * 100))} %).`
                : "Les réglages par défaut prédisent déjà bien ta mémoire : rien n'a changé."}
            </p>
          )}
        </Carte>
      </div>
    </section>
  );
}
