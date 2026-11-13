"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUp, Check, Eye, RotateCcw, Shuffle, X } from "lucide-react";
import { formule, texteBrut } from "@/components/Formule";
import { Bouton, BoutonIcone, pluriel } from "@/components/ui";
import { encre, pastel } from "@/lib/store";
import type { Chapitre, DateCle, Matiere } from "@/lib/types";

const melanger = <T,>(l: T[]) => {
  const a = [...l];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const chrono = (l: DateCle[]) => [...l].sort((a, b) => a.tri.localeCompare(b.tri));
const annee = (d: DateCle) => d.tri.slice(0, 4);

const choix = (actif: boolean) =>
  `min-h-9 rounded-full px-3.5 text-[13.5px] font-semibold transition-colors duration-200 ${
    actif ? "bg-ink text-bg" : "bg-ink/5 text-muted hover:text-ink"
  }`;

/**
 * Onglet « Dates » d'un chapitre (matières non scientifiques) : la frise des dates
 * utiles, puis un mode chronologique pour s'entraîner (remettre dans l'ordre, retrouver
 * la date d'un événement).
 */
export function OngletDates({ chapitre, matiere }: { chapitre: Chapitre; matiere: Matiere }) {
  const toutes = useMemo(() => chrono(chapitre.dates ?? []), [chapitre.dates]);
  const nbEssentielles = toutes.filter((d) => d.importance === 1).length;
  const [essentielles, setEssentielles] = useState(false);
  const [vue, setVue] = useState<"frise" | "ordre" | "date">("frise");
  const liste = essentielles ? toutes.filter((d) => d.importance === 1) : toutes;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Affichage">
          {[
            { id: "frise", label: "Frise" },
            { id: "ordre", label: "Remettre dans l'ordre" },
            { id: "date", label: "Quelle date ?" },
          ].map((o) => (
            <button
              key={o.id}
              role="radio"
              aria-checked={vue === o.id}
              onClick={() => setVue(o.id as typeof vue)}
              className={choix(vue === o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
        {nbEssentielles > 0 && nbEssentielles < toutes.length && (
          <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 text-[13.5px] font-semibold text-muted">
            <input
              type="checkbox"
              className="size-4 accent-[var(--accent)]"
              checked={essentielles}
              onChange={(e) => setEssentielles(e.target.checked)}
            />
            Seulement les {nbEssentielles} essentielles
          </label>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={vue + String(essentielles)}
          initial={{ opacity: 0, transform: "translate3d(0, 8px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {vue === "frise" && <Frise dates={liste} matiere={matiere} />}
          {vue === "ordre" && <RemettreDansLOrdre dates={liste} matiere={matiere} />}
          {vue === "date" && <QuelleDate dates={liste} matiere={matiere} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Frise({ dates, matiere }: { dates: DateCle[]; matiere: Matiere }) {
  const foncee = encre(matiere.couleur);
  const annees = [...new Set(dates.map(annee))];
  return (
    <div className="relative mx-auto max-w-[760px]">
      {annees.map((a) => (
        <section key={a} className="relative pb-2">
          <h3
            className="sticky top-16 z-[1] mb-2 inline-block rounded-full px-3 py-0.5 font-display text-[22px]"
            style={{ color: foncee, background: pastel(matiere.couleur, 14) }}
          >
            {a}
          </h3>
          <ol className="relative ml-[7px] border-l-2 pb-3" style={{ borderColor: pastel(matiere.couleur, 45) }}>
            {dates
              .filter((d) => annee(d) === a)
              .map((d, i) => (
                <motion.li
                  key={d.tri + d.evenement}
                  initial={{ opacity: 0, transform: "translate3d(0, 8px, 0)" }}
                  animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                  transition={{ delay: Math.min(i, 8) * 0.03 }}
                  className="relative py-2.5 pl-6"
                >
                  <span
                    aria-hidden
                    className="absolute -left-[8px] top-[18px] size-3.5 rounded-full border-2"
                    style={{
                      borderColor: matiere.couleur,
                      background: d.importance === 1 ? matiere.couleur : "var(--surface)",
                    }}
                  />
                  <p className="text-[13.5px] font-semibold" style={{ color: foncee }}>
                    {d.date}
                    {d.importance === 1 && (
                      <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                        essentielle
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 font-display text-[18px] leading-snug">{formule(d.evenement)}</p>
                  {d.precision && (
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink/75">{formule(d.precision)}</p>
                  )}
                </motion.li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

/** Tire `n` dates d'années ou de jours différents, pour qu'un seul ordre soit juste. */
function tirer(dates: DateCle[], n: number) {
  const vues = new Set<string>();
  const tirees: DateCle[] = [];
  for (const d of melanger(dates)) {
    if (vues.has(d.tri)) continue;
    vues.add(d.tri);
    tirees.push(d);
    if (tirees.length === n) break;
  }
  return tirees;
}

function RemettreDansLOrdre({ dates, matiere }: { dates: DateCle[]; matiere: Matiere }) {
  const taille = Math.min(5, new Set(dates.map((d) => d.tri)).size);
  const [serie, setSerie] = useState(() => tirer(dates, taille));
  const [ordre, setOrdre] = useState(() => melanger(serie));
  const [valide, setValide] = useState(false);
  const [score, setScore] = useState({ justes: 0, series: 0 });
  const juste = chrono(serie);
  const foncee = encre(matiere.couleur);

  const nouvelle = () => {
    const s = tirer(dates, taille);
    setSerie(s);
    let m = melanger(s);
    for (let k = 0; k < 5 && m.every((d, i) => d === chrono(s)[i]); k++) m = melanger(s);
    setOrdre(m);
    setValide(false);
  };
  const deplacer = (i: number, pas: number) =>
    setOrdre((o) => {
      const j = i + pas;
      if (j < 0 || j >= o.length) return o;
      const n = [...o];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  if (taille < 3) return <p className="text-[15px] text-muted">Il faut au moins trois dates différentes.</p>;
  const bonnes = ordre.filter((d, i) => d === juste[i]).length;

  return (
    <div className="mx-auto max-w-[640px]">
      <p className="text-[14px] text-muted">
        Range ces {taille} événements du plus ancien au plus récent.
        {score.series > 0 && ` · ${score.justes}/${score.series} séries sans faute`}
      </p>
      <ol className="mt-3 flex flex-col gap-2">
        {(valide ? juste : ordre).map((d, i) => {
          const place = valide ? ordre.indexOf(d) === i : null;
          return (
            <li
              key={d.tri + d.evenement}
              className={`flex items-center gap-2 rounded-2xl border-2 bg-surface py-1.5 pl-3 pr-1.5 transition-colors ${
                place === null ? "border-line" : place ? "border-ok" : "border-bad"
              }`}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-[13px] font-semibold">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 py-1.5">
                {valide && (
                  <span className="block text-[13px] font-semibold" style={{ color: foncee }}>
                    {d.date}
                  </span>
                )}
                <span className="block text-[15.5px] font-medium leading-snug">{formule(d.evenement)}</span>
              </span>
              {!valide && (
                <span className="flex shrink-0">
                  <BoutonIcone
                    label={`Monter : ${texteBrut(d.evenement)}`}
                    disabled={i === 0}
                    onClick={() => deplacer(i, -1)}
                    className="disabled:opacity-30"
                  >
                    <ArrowUp size={17} />
                  </BoutonIcone>
                  <BoutonIcone
                    label={`Descendre : ${texteBrut(d.evenement)}`}
                    disabled={i === ordre.length - 1}
                    onClick={() => deplacer(i, 1)}
                    className="disabled:opacity-30"
                  >
                    <ArrowDown size={17} />
                  </BoutonIcone>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {valide ? (
        <>
          <p className={`mt-4 text-[15px] font-semibold ${bonnes === taille ? "text-ok" : "text-bad"}`} role="status">
            {bonnes === taille
              ? "Tout est dans l'ordre !"
              : `${pluriel(bonnes, "événement")} à la bonne place sur ${taille}. Voici l'ordre juste, avec les dates.`}
          </p>
          <Bouton className="mt-3 w-full" onClick={nouvelle}>
            <Shuffle size={16} /> Nouvelle série
          </Bouton>
        </>
      ) : (
        <Bouton
          className="mt-4 w-full"
          onClick={() => {
            setValide(true);
            setScore((s) => ({ justes: s.justes + (bonnes === taille ? 1 : 0), series: s.series + 1 }));
          }}
        >
          Valider l&apos;ordre
        </Bouton>
      )}
    </div>
  );
}

function QuelleDate({ dates, matiere }: { dates: DateCle[]; matiere: Matiere }) {
  const [file, setFile] = useState(() => melanger(dates));
  const [vu, setVu] = useState(false);
  const [bilan, setBilan] = useState({ sues: 0, revues: 0 });
  const [aRevoir, setARevoir] = useState<Set<DateCle>>(new Set());
  const foncee = encre(matiere.couleur);
  const d = file[0];

  const suivante = (savait: boolean) => {
    setVu(false);
    setBilan((b) => (savait ? { ...b, sues: b.sues + 1 } : { ...b, revues: b.revues + 1 }));
    setFile((f) => {
      const [premiere, ...reste] = f;
      // Une date ratée revient une fois, trois cartes plus loin.
      if (!savait && !aRevoir.has(premiere)) {
        setARevoir((s) => new Set(s).add(premiere));
        return [...reste.slice(0, 3), premiere, ...reste.slice(3)];
      }
      return reste;
    });
  };

  if (!d) {
    return (
      <div className="mx-auto max-w-[560px] rounded-[22px] border border-line bg-surface p-6 text-center shadow-card">
        <p className="font-display text-[24px]">Série terminée</p>
        <p className="mt-1 text-[15px] text-muted">
          {pluriel(bilan.sues, "date sue", "dates sues")}
          {bilan.revues > 0 && `, ${pluriel(bilan.revues, "à revoir", "à revoir")}`}.
        </p>
        <Bouton
          className="mt-4"
          onClick={() => {
            setFile(melanger(dates));
            setBilan({ sues: 0, revues: 0 });
            setARevoir(new Set());
          }}
        >
          <RotateCcw size={16} /> Recommencer
        </Bouton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px]">
      <p className="text-[14px] text-muted">
        {pluriel(file.length, "carte restante", "cartes restantes")} · donne la date de tête, puis vérifie.
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={d.tri + d.evenement + file.length}
          initial={{ opacity: 0, transform: "translate3d(16px, 0, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0px, 0, 0)" }}
          exit={{ opacity: 0, transform: "translate3d(-16px, 0, 0)" }}
          transition={{ duration: 0.2 }}
          className="mt-3 rounded-[22px] border border-line bg-surface p-6 shadow-card"
          style={{ borderTop: `4px solid ${matiere.couleur}` }}
        >
          <p className="surtitre" style={{ color: foncee }}>
            Quand ?
          </p>
          <p className="mt-2 font-display text-[22px] leading-snug">{formule(d.evenement)}</p>
          {vu ? (
            <>
              <p className="mt-4 font-display text-[26px]" style={{ color: foncee }}>
                {d.date}
              </p>
              {d.precision && <p className="mt-1 text-[14.5px] leading-relaxed text-ink/75">{formule(d.precision)}</p>}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Bouton variante="contour" onClick={() => suivante(false)}>
                  <X size={16} /> À revoir
                </Bouton>
                <Bouton onClick={() => suivante(true)}>
                  <Check size={16} /> Je savais
                </Bouton>
              </div>
            </>
          ) : (
            <Bouton className="mt-5 w-full" onClick={() => setVu(true)}>
              <Eye size={16} /> Voir la date
            </Bouton>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
