"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { prochainDstDe, trierParDst } from "@/lib/revision";
import { compteARebours } from "@/lib/dates";
import { BarreAction } from "./BarreAction";
import { AvecBrouillon } from "@/components/Brouillon";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Clock, ScrollText, Send, X } from "lucide-react";
import { formule } from "@/components/Formule";
import { Emoji } from "@/components/Emoji";
import { SaisieFormule } from "@/components/SaisieFormule";
import { Bouton, BoutonIcone, Carte, EnvoyerAClaude, EtatVide, pluriel } from "@/components/ui";
import { Curseur } from "@/components/Curseur";
import { ecrireAvecCs, remplir, tirer, verifier, type Verdict, type Version } from "@/lib/calcul";
import { bilans, useDemandes, type Demande } from "@/lib/demandes";
import { melanger } from "@/lib/contenu";
import { estScientifique, versNotation } from "@/lib/saisie";
import { encre, pastel, useLuno } from "@/lib/store";
import type { Calcul, Chapitre, DefinitionCours } from "@/lib/types";
import { ChampAN, RetourAN } from "./Calcul";

type Question =
  | { type: "cours"; matiereId: string; chapitre: string; def: DefinitionCours; points: number; scientifique: boolean }
  | { type: "calcul"; matiereId: string; chapitre: string; calcul: Calcul; version: Version; points: number };

const DUREES = [
  { id: 0, label: "Sans chrono" },
  { id: 30, label: "30 min" },
  { id: 60, label: "1 h" },
];

const consigneCours = (d: DefinitionCours) =>
  d.type === "definition"
    ? `Donne la définition : ${d.terme}`
    : d.type === "formule"
      ? `Écris la formule et ce que représente chaque lettre : ${d.terme}`
      : d.type === "methode"
        ? `Explique la méthode : ${d.terme}`
        : `Énonce : ${d.terme}`;

/** Heure actuelle, lue seulement dans les gestionnaires et les minuteries. */
const horloge = () => Date.now();

const peutInterroger = (c: Chapitre) => (c.definitions?.length ?? 0) + (c.calculs?.length ?? 0) > 0;

/**
 * Interro blanche : questions de cours (à restituer mot pour mot, tirées de l'onglet Déf)
 * et calculs à valeurs changeantes, sans correction avant de rendre la copie, avec ou
 * sans chrono. L'élève note ses réponses de cours face au texte exact ; les calculs sont
 * corrigés tout seuls. Les erreurs peuvent partir dans « Mes erreurs ».
 */
export function ModeInterro({
  entete,
  occupe,
  initiaux = [],
}: {
  entete: ReactNode;
  occupe: (b: boolean) => void;
  initiaux?: string[];
}) {
  const { matieres, chapitres, dsts, ajouterErreurs } = useLuno();
  // Les chapitres des prochains DST en premier.
  const possibles = trierParDst(chapitres.filter(peutInterroger), dsts);
  // Venu de « Faire une interro blanche » (accueil) : les chapitres du DST sont cochés.
  const [choisis, setChoisis] = useState<string[]>(() => initiaux.filter((id) => possibles.some((c) => c.id === id)));
  const [aideChoix, setAideChoix] = useState(false);
  const [nbCours, setNbCours] = useState(6);
  const [nbCalculs, setNbCalculs] = useState(2);
  const [duree, setDuree] = useState(60);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  useEffect(() => occupe(questions !== null), [questions, occupe]);
  const [reponses, setReponses] = useState<{ texte: string; unite: string }[]>([]);
  const [index, setIndex] = useState(0);
  const [rendu, setRendu] = useState(false);
  const [notes, setNotes] = useState<(number | null)[]>([]);
  const [fin, setFin] = useState<number | null>(null);
  const [maintenant, setMaintenant] = useState(() => Date.now());
  const [ajoute, setAjoute] = useState(false);
  const [envoiBilan, setEnvoiBilan] = useState(false);
  const mesBilans = bilans(useDemandes((x) => x.liste));
  const [debut, setDebut] = useState(0);

  const selection = possibles.filter((c) => choisis.includes(c.id));
  const totalDefs = selection.reduce((n, c) => n + (c.definitions?.length ?? 0), 0);
  const totalCalculs = selection.reduce((n, c) => n + (c.calculs?.length ?? 0), 0);
  const pretACommencer = selection.length > 0 && Math.min(nbCours, totalDefs) + Math.min(nbCalculs, totalCalculs) > 0;

  // Chrono : une horloge qui avance chaque seconde, et la copie rendue à zéro.
  useEffect(() => {
    if (!questions || rendu || fin === null) return;
    const t = setInterval(() => {
      const n = horloge();
      setMaintenant(n);
      if (n >= fin) setRendu(true);
    }, 1000);
    return () => clearInterval(t);
  }, [questions, rendu, fin]);

  const commencer = () => {
    const cours = melanger(
      selection.flatMap((c) =>
        (c.definitions ?? []).map((def) => ({ c, def })),
      ),
    )
      .slice(0, nbCours)
      .map(({ c, def }): Question => ({
        type: "cours",
        matiereId: c.matiereId,
        chapitre: c.titre,
        def,
        points: 2,
        scientifique: estScientifique(matieres.find((m) => m.id === c.matiereId)?.nom),
      }));
    const calculs = melanger(selection.flatMap((c) => (c.calculs ?? []).map((calcul) => ({ c, calcul }))))
      .slice(0, nbCalculs)
      .map(({ c, calcul }): Question => ({
        type: "calcul",
        matiereId: c.matiereId,
        chapitre: c.titre,
        calcul,
        version: tirer(calcul),
        points: 3,
      }));
    const qs = [...cours, ...calculs];
    setQuestions(qs);
    setReponses(qs.map(() => ({ texte: "", unite: "" })));
    setNotes(qs.map(() => null));
    setIndex(0);
    setRendu(false);
    setAjoute(false);
    const t = horloge();
    setDebut(t);
    setMaintenant(t);
    setFin(duree ? t + duree * 60_000 : null);
  };

  const rendre = () => {
    setMaintenant(horloge());
    setRendu(true);
  };

  const verdicts = useMemo(
    () =>
      (questions ?? []).map((q, i): Verdict | null =>
        q.type === "calcul" ? verifier(q.calcul, q.version, reponses[i]?.texte ?? "", reponses[i]?.unite ?? "") : null,
      ),
    [questions, reponses],
  );

  // ———————— Choix de l'interro ————————
  if (!questions) {
    if (possibles.length === 0)
      return (
        <div>
          {entete}
          <EtatVide
          icone={<ScrollText size={26} />}
          titre="Pas encore de quoi faire une interro"
          texte="Il faut un chapitre avec des définitions (onglet Déf) ou des calculs."
          />
        </div>
      );
    return (
      <div>
      {entete}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="mb-2 text-[14px] text-muted">
            Choisis les chapitres au programme de ton interro, comme le prof te les a annoncés.
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2" role="group" aria-label="Chapitres de l'interro">
            {possibles.map((c) => {
              const m = matieres.find((x) => x.id === c.matiereId);
              const actif = choisis.includes(c.id);
              return (
                <button
                  key={c.id}
                  role="checkbox"
                  aria-checked={actif}
                  onClick={() => {
                    setChoisis(actif ? choisis.filter((x) => x !== c.id) : [...choisis, c.id]);
                    setAideChoix(false);
                  }}
                  className="flex items-start gap-3 rounded-2xl border-2 p-3.5 text-left shadow-card transition-colors duration-200"
                  style={{
                    borderColor: actif ? m?.couleur : "var(--line)",
                    background: actif ? pastel(m?.couleur ?? "#888", 12) : "var(--surface)",
                  }}
                >
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 ${
                      actif ? "border-transparent text-surface" : "border-muted/50"
                    }`}
                    style={actif ? { background: m?.couleur } : undefined}
                  >
                    {actif && <Check size={13} strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-2 text-[12.5px] font-semibold" style={{ color: encre(m?.couleur ?? "#888") }}>
                      <span><Emoji e={m?.emoji} /> {m?.nom}</span>
                      {prochainDstDe(c.id, dsts) && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">
                          DST {compteARebours(prochainDstDe(c.id, dsts)!.date)}
                        </span>
                      )}
                    </span>
                    <span className="block text-[15.5px] font-semibold leading-snug">{c.titre}</span>
                    <span className="text-[12.5px] text-muted">
                      {c.definitions?.length ?? 0} déf. · {c.calculs?.length ?? 0} calculs
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <Carte className="h-fit lg:sticky lg:top-24">
          <p className="text-[17px] font-semibold">Ton interro</p>
          <p className="mt-3 text-[14px] font-semibold">Questions de cours : {Math.min(nbCours, totalDefs)}</p>
          <Curseur min={0} max={Math.max(1, Math.min(12, totalDefs))} value={Math.min(nbCours, totalDefs)} onChange={setNbCours} label="Questions de cours" />
          <p className="mt-2 text-[14px] font-semibold">Calculs : {Math.min(nbCalculs, totalCalculs)}</p>
          <Curseur min={0} max={Math.max(1, Math.min(5, totalCalculs))} value={Math.min(nbCalculs, totalCalculs)} onChange={setNbCalculs} label="Calculs" />
          <p className="mt-3 text-[14px] font-semibold">Durée</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Durée">
            {DUREES.map((d) => (
              <button
                key={d.id}
                role="radio"
                aria-checked={duree === d.id}
                onClick={() => setDuree(d.id)}
                className={`min-h-10 rounded-full px-3.5 text-[13.5px] font-semibold transition-colors duration-200 ${
                  duree === d.id ? "bg-ink text-bg" : "bg-ink/5 text-muted"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <Bouton className="mt-5 w-full" onClick={() => (pretACommencer ? commencer() : setAideChoix(true))}>
            Commencer l&apos;interro
          </Bouton>
          <p className={`mt-2 text-[12.5px] ${aideChoix && !pretACommencer ? "text-accent" : "text-muted"}`} role="status">
            {aideChoix && !pretACommencer
              ? selection.length === 0
                ? "Coche d'abord au moins un chapitre."
                : "Mets au moins une question de cours ou un calcul."
              : "Pas de correction avant la fin, comme en vrai."}
          </p>
        </Carte>
      </div>
      <BarreAction visible={pretACommencer}>
        <span className="min-w-0 flex-1 text-[14px] font-semibold leading-tight">
          {pluriel(selection.length, "chapitre")}
          <span className="block text-[12.5px] font-normal text-muted">
            {DUREES.find((d) => d.id === duree)?.label} · {Math.min(nbCours, totalDefs) + Math.min(nbCalculs, totalCalculs)} questions
          </span>
        </span>
        <Bouton onClick={commencer}>Commencer</Bouton>
      </BarreAction>
      {mesBilans.length > 0 && <ListeBilans liste={mesBilans} />}
      </div>
    );
  }

  // ———————— Copie rendue : correction ————————
  if (rendu) {
    const points = questions.map((q, i) => {
      if (q.type === "cours") return notes[i] === null ? null : notes[i]! * q.points;
      const v = verdicts[i];
      return v ? (v.valeur ? 1.5 : 0) + (v.unite ? 0.75 : 0) + (v.cs ? 0.75 : 0) : 0;
    });
    const total = questions.reduce((t, q) => t + q.points, 0);
    const obtenu = points.reduce<number>((t, p) => t + (p ?? 0), 0);
    const enAttente = points.filter((p) => p === null).length;
    const sur20 = Math.round(((obtenu / total) * 20) * 2) / 2;
    const temps = Math.round((Math.min(maintenant, fin ?? maintenant) - debut) / 60_000);

    const erreurs = questions.flatMap((q, i) => {
      if (q.type === "cours") {
        if (notes[i] === null || notes[i] === 1) return [];
        return [{
          matiereId: q.matiereId,
          e: {
            titre: consigneCours(q.def),
            erreur: reponses[i].texte.trim()
              ? q.scientifique
                ? versNotation(reponses[i].texte)
                : reponses[i].texte
              : "Pas su le restituer.",
            correction: q.def.texte,
            chapitre: q.chapitre,
            source: "Interro blanche",
          },
        }];
      }
      const v = verdicts[i];
      if (v && v.valeur && v.unite && v.cs) return [];
      const quoi = !v || !v.valeur ? "Valeur fausse" : !v.unite ? "Unité oubliée ou fausse" : "Chiffres significatifs";
      return [{
        matiereId: q.matiereId,
        e: {
          titre: `${quoi} : ${q.calcul.titre}`,
          erreur: reponses[i].texte ? `${reponses[i].texte} ${reponses[i].unite}` : "Pas répondu.",
          correction: `${q.calcul.litterale}, puis ${v?.attendu ?? "l'A.N. avec son unité"}.`,
          chapitre: q.chapitre,
          source: "Interro blanche",
        },
      }];
    });

    const nomsMatieres = [...new Set(questions.map((q) => matieres.find((m) => m.id === q.matiereId)?.nom ?? ""))].filter(Boolean);
    const chapitresVus = [...new Set(questions.map((q) => q.chapitre))];
    const enteteBilan = [
      `[Luno] Bilan d'interro blanche`,
      `Matières : ${nomsMatieres.join(", ")}`,
      `Chapitres : ${chapitresVus.join(" ; ")}`,
      `Note : ${String(sur20).replace(".", ",")} / 20${enAttente ? ` (${enAttente} question${enAttente > 1 ? "s" : ""} de cours pas encore notée${enAttente > 1 ? "s" : ""})` : ""}${temps ? `, copie rendue en ${temps} min` : ""}${fin ? ` sur ${Math.round((fin - debut) / 60_000)} min` : " (sans chrono)"}`,
    ].join("\n");
    const texteBilan = [
      enteteBilan,
      ...questions.map((q, i) => {
        const r = reponses[i];
        const m = matieres.find((x) => x.id === q.matiereId)?.nom;
        if (q.type === "cours") {
          const note = notes[i] === null ? "pas notée" : notes[i] === 1 ? "juste" : notes[i] === 0.5 ? "à moitié" : "faux";
          return [
            `Question ${i + 1} (${m} · ${q.chapitre}, ${q.points} pts, auto-notée : ${note})`,
            `Consigne : ${consigneCours(q.def)}`,
            `Ma réponse : ${r.texte.trim() || "(rien)"}`,
            `Dans le cours : ${q.def.texte}`,
          ].join("\n");
        }
        const v = verdicts[i];
        return [
          `Question ${i + 1} (${m} · ${q.chapitre}, calcul, ${q.points} pts)`,
          `Énoncé : ${remplir(q.calcul.enonce, q.version)} ${remplir(q.calcul.question, q.version)}`,
          `Ma réponse : ${r.texte ? `${q.calcul.inconnue} = ${r.texte} ${r.unite}` : "(rien)"}`,
          `Attendu : ${q.calcul.litterale} ; ${q.calcul.inconnue} = ${ecrireAvecCs(q.version.resultat, q.version.cs)} ${q.calcul.unite}`,
          `Correction automatique : valeur ${v?.valeur ? "juste" : "fausse"}, unité ${v?.unite ? "juste" : "fausse"}, chiffres significatifs ${v?.cs ? "justes" : "faux"}`,
        ].join("\n");
      }),
    ].join("\n\n");

    return (
      <div className="mx-auto max-w-[720px]">
        <EnvoyerAClaude
          ouverte={envoiBilan}
          fermer={() => setEnvoiBilan(false)}
          titre="Demander un bilan à Claude"
          objet={`Bilan d'interro blanche : ${chapitresVus.join(", ")}`.slice(0, 120)}
          texte={texteBilan}
          resultat="un bilan de ton interro (points forts, ce qui reste à retravailler, conseils), avec tes erreurs dans « Mes erreurs »"
          demande={{ type: "erreurs", meta: { bilan: true, matieres: nomsMatieres } }}
        />
        <div className="rounded-[18px] border border-line bg-surface p-6 shadow-pop">
          <p className="surtitre text-accent">Interro blanche · copie rendue{temps ? ` en ${temps} min` : ""}</p>
          <p className="mt-1 font-display text-[54px] leading-none text-accent">
            {String(sur20).replace(".", ",")}
            <span className="text-[22px] text-ink"> / 20</span>
          </p>
          <p className="mt-2 text-[14px] text-muted">
            {enAttente
              ? `Corrige encore ${enAttente} question${enAttente > 1 ? "s" : ""} de cours ci-dessous : la note se met à jour.`
              : "Toutes tes réponses sont corrigées."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {erreurs.length > 0 && (
              <Bouton
                disabled={ajoute || enAttente > 0}
                onClick={() => {
                  const parMatiere = new Map<string, (typeof erreurs)[number]["e"][]>();
                  for (const x of erreurs) parMatiere.set(x.matiereId, [...(parMatiere.get(x.matiereId) ?? []), x.e]);
                  for (const [m, l] of parMatiere) ajouterErreurs(m, l);
                  setAjoute(true);
                }}
              >
                {ajoute ? <Check size={16} /> : null}
                {ajoute ? "Ajouté à Mes erreurs" : `Ajouter mes ${erreurs.length} erreurs à Mes erreurs`}
              </Bouton>
            )}
            <Bouton variante="doux" onClick={() => setEnvoiBilan(true)}>
              <Send size={16} /> Demander un bilan à Claude
            </Bouton>
            <Bouton variante="contour" onClick={() => setQuestions(null)}>
              Nouvelle interro
            </Bouton>
          </div>
        </div>

        <ol className="mt-4 flex flex-col gap-3">
          {questions.map((q, i) => (
            <li key={i} className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <p className="surtitre text-muted">
                  Question {i + 1} · {q.chapitre}
                </p>
                <span className="shrink-0 text-[13px] font-semibold text-accent">
                  {points[i] === null ? "à noter" : `${String(points[i]).replace(".", ",")} / ${String(q.points).replace(".", ",")}`}
                </span>
              </div>
              {q.type === "cours" ? (
                <>
                  <p className="mt-1 text-[15.5px] font-semibold">{formule(consigneCours(q.def))}</p>
                  <p className="mt-2 text-[12px] font-semibold uppercase tracking-wider text-muted">Ta réponse</p>
                  <p className="mt-0.5 whitespace-pre-line text-[15px] leading-relaxed">
                    {reponses[i].texte.trim() ? formule(q.scientifique ? versNotation(reponses[i].texte) : reponses[i].texte) : <em className="text-muted">Pas de réponse</em>}
                  </p>
                  <div className="mt-3 rounded-xl bg-accent-soft p-3.5">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-accent">Dans le cours</p>
                    <p className="mt-0.5 whitespace-pre-line text-[15px] leading-relaxed">{formule(q.def.texte)}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Ta note">
                    {[
                      { v: 1, l: "Juste" },
                      { v: 0.5, l: "À moitié" },
                      { v: 0, l: "Faux" },
                    ].map((o) => (
                      <button
                        key={o.v}
                        role="radio"
                        aria-checked={notes[i] === o.v}
                        onClick={() => setNotes(notes.map((n, j) => (j === i ? o.v : n)))}
                        className={`min-h-10 rounded-xl text-[14px] font-semibold transition-colors duration-200 ${
                          notes[i] === o.v
                            ? o.v === 1
                              ? "bg-ok text-surface"
                              : o.v === 0
                                ? "bg-bad text-surface"
                                : "bg-copper text-surface"
                            : "bg-ink/5 text-muted"
                        }`}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-1 text-[15.5px] font-semibold">{q.calcul.titre}</p>
                  <p className="mt-1 text-[14px] text-muted">
                    Ta réponse : {reponses[i].texte ? `${reponses[i].texte} ${reponses[i].unite}` : "pas de réponse"}
                  </p>
                  {verdicts[i] ? (
                    <RetourAN verdict={verdicts[i]!} version={q.version} />
                  ) : (
                    <p className="mt-2 text-[14px] text-bad">Pas de valeur lisible. Ton prof attendait : {formule(q.calcul.litterale)}.</p>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // ———————— Interro en cours ————————
  const q = questions[index];
  const restant = fin === null ? null : Math.max(0, fin - maintenant);
  const mm = restant === null ? "" : String(Math.floor(restant / 60_000)).padStart(2, "0");
  const ss = restant === null ? "" : String(Math.floor((restant % 60_000) / 1000)).padStart(2, "0");
  const changer = (r: { texte: string; unite: string }) => setReponses(reponses.map((x, i) => (i === index ? r : x)));

  return (
    <AvecBrouillon
      cle={`interro-${debut}-${index}`}
      cs={q.type === "calcul" ? q.version.cs : undefined}
      versAN={
        q.type === "calcul"
          ? (t) => setReponses((rs) => rs.map((x, i) => (i === index ? { ...x, texte: t } : x)))
          : undefined
      }
    >
    <div className="mx-auto max-w-[680px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        {restant !== null ? (
          <p className={`flex items-baseline gap-2 ${restant < 5 * 60_000 ? "text-bad" : "text-accent"}`} role="timer" aria-live="off">
            <Clock size={18} className="self-center" />
            <span className="font-display text-[30px] leading-none tabular-nums">
              {mm}:{ss}
            </span>
            <span className="text-[13px] text-muted">restantes</span>
          </p>
        ) : (
          <p className="text-[14px] font-semibold text-muted">Sans chrono</p>
        )}
        <BoutonIcone label="Abandonner l'interro" onClick={() => setQuestions(null)} className="-mr-2">
          <X size={18} />
        </BoutonIcone>
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Questions">
        {questions.map((x, i) => {
          const fait = reponses[i].texte.trim().length > 0;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Question ${i + 1}${fait ? ", répondue" : ""}`}
              onClick={() => setIndex(i)}
              className={`size-9 rounded-lg text-[13px] font-bold transition-colors duration-200 ${
                i === index ? "bg-ink text-bg" : fait ? "bg-accent-soft text-accent" : "bg-ink/5 text-muted"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, transform: "translate3d(24px, 0, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0px, 0, 0)" }}
          exit={{ opacity: 0, transform: "translate3d(-24px, 0, 0)" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[18px] border border-line bg-surface p-5 shadow-card"
        >
          <p className="surtitre text-muted">
            Question {index + 1} · {q.points} pts · {q.chapitre}
          </p>
          {q.type === "cours" ? (
            <>
              <p className="mt-1.5 text-[16px] font-semibold">{formule(consigneCours(q.def))}</p>
              <div className="mt-3">
                <SaisieFormule
                  scientifique={q.scientifique}
                  label="Ta réponse"
                  valeur={reponses[index].texte}
                  changer={(t) => changer({ texte: t, unite: "" })}
                  lignes={5}
                  placeholder="Écris-la comme dans le cours"
                />
              </div>
            </>
          ) : (
            <>
              <p className="mt-1.5 text-[16px] font-semibold">{q.calcul.titre}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed">
                {formule(q.calcul.enonce.replace(/\{(\w+)\}/g, (m, k) => q.version.textes[k] ?? m))}
              </p>
              <p className="mt-1.5 text-[15px] font-semibold leading-relaxed">
                {formule(q.calcul.question.replace(/\{(\w+)\}/g, (m, k) => q.version.textes[k] ?? m))}
              </p>
              <p className="mt-3 text-[13px] text-muted">Fais le calcul au brouillon, puis donne l&apos;A.N. :</p>
              <div className="mt-1.5">
                <ChampAN
                  calcul={q.calcul}
                  valeur={reponses[index].texte}
                  unite={reponses[index].unite}
                  changer={(t, u) => changer({ texte: t, unite: u })}
                />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Bouton variante="contour" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <ChevronLeft size={16} /> Précédente
        </Bouton>
        {index + 1 < questions.length ? (
          <Bouton variante="contour" onClick={() => setIndex(index + 1)}>
            Suivante <ChevronRight size={16} />
          </Bouton>
        ) : (
          <Bouton onClick={rendre}>Rendre la copie</Bouton>
        )}
      </div>
      {index + 1 < questions.length && (
        <Bouton variante="fantome" className="mt-2 w-full" onClick={rendre}>
          Rendre la copie maintenant
        </Bouton>
      )}
    </div>
    </AvecBrouillon>
  );
}

/** Les bilans demandés à Claude : en attente, ou rédigés (dépliables). */
function ListeBilans({ liste }: { liste: Demande[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-[22px]">Tes bilans</h2>
      <div className="mt-3 flex flex-col gap-2.5">
        {liste.map((d) => {
          const b = d.statut === "prete" ? (d.reponse as { bilan?: BilanClaude } | null)?.bilan : undefined;
          const date = new Date(d.cree).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
          return (
            <details key={d.id} className="group rounded-[18px] border border-line bg-surface p-4 shadow-card">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-[15.5px] font-semibold leading-snug">{d.titre.replace(/^Bilan d'interro blanche : /, "")}</span>
                  <span className="text-[13px] text-muted">{date}</span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                    b ? "bg-accent-soft text-accent" : d.statut === "erreur" ? "bg-bad/10 text-bad" : "bg-ink/5 text-muted"
                  }`}
                >
                  {b ? "Prêt" : d.statut === "erreur" ? "Problème" : "Claude passe bientôt"}
                </span>
              </summary>
              {b ? (
                <div className="mt-3 flex flex-col gap-3 text-[14.5px] leading-relaxed">
                  <p>{formule(b.resume)}</p>
                  {(
                    [
                      ["Tes points forts", b.pointsForts, "text-ok"],
                      ["À retravailler", b.aRetravailler, "text-bad"],
                      ["Conseils pour la prochaine fois", b.conseils, "text-accent"],
                    ] as const
                  ).map(([titre, l, ton]) => (
                    <div key={titre}>
                      <p className={`surtitre ${ton}`}>{titre}</p>
                      <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
                        {l.map((t, i) => (
                          <li key={i}>{formule(t)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <p className="text-[13px] text-muted">Les erreurs relevées sont dans « Mes erreurs » de chaque matière.</p>
                </div>
              ) : (
                <p className="mt-2 text-[14px] text-muted">
                  {d.statut === "erreur" ? d.erreur : "Ta copie est envoyée : le bilan apparaîtra ici après le prochain passage de Claude."}
                </p>
              )}
            </details>
          );
        })}
      </div>
    </section>
  );
}

type BilanClaude = { resume: string; pointsForts: string[]; aRetravailler: string[]; conseils: string[] };
