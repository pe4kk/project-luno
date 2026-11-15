"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Flag, GraduationCap, X } from "lucide-react";
import { prochainDstDe, trierParDst } from "@/lib/revision";
import { compteARebours } from "@/lib/dates";
import { BarreAction } from "./BarreAction";
import { formule, sansMiseEnForme } from "@/components/Formule";
import { Emoji } from "@/components/Emoji";
import { SaisieFormule } from "@/components/SaisieFormule";
import { DessinSchema } from "@/components/Schema";
import { Bouton, BoutonIcone, Carte, EtatVide, ZoneAction, pluriel } from "@/components/ui";
import { reponseJuste, simplifier } from "@/lib/contenu";
import { estScientifique, versNotation } from "@/lib/saisie";
import { encre, pastel, useLuno } from "@/lib/store";
import {
  MAITRISEE,
  TAILLE_MANCHE,
  apresEchec,
  apresReussite,
  comparer,
  composerManche,
  dansLeQuiz,
  decouperTrous,
  estQuestion,
  preparerNotion,
  repartition,
  synonymes,
  type NotionManche,
} from "@/lib/apprendre";
import type { Chapitre, EntreeQuiz } from "@/lib/types";

const NOMS_PALIERS = { 1: "Reconnaître", 2: "Compléter", 3: "De tête" } as const;
const CONSIGNES = {
  1: "Choisis la bonne réponse.",
  2: "Complète le mot qui manque.",
  3: "Écris-la de tête, puis compare avec le cours.",
} as const;

type Resultat = { carteId: string; recto: string; palier: 1 | 2 | 3; reussi: boolean; maitrisee: boolean };

const aDesCartes = (c: Chapitre) => c.flashcards.some((f) => dansLeQuiz(c, f));

/**
 * Mode « Apprendre » : les notions des chapitres choisis montent par paliers
 * (reconnaître, compléter, écrire de tête) jusqu'à être maîtrisées, par manches de 7.
 * Une erreur fait revenir la notion trois questions plus loin, une fois.
 */
export function ModeApprendre({
  entete,
  occupe,
  initiaux = [],
}: {
  entete: ReactNode;
  occupe: (b: boolean) => void;
  initiaux?: string[];
}) {
  const { matieres, chapitres, dsts, majPalier, noterFlashcard, noterQuiz, signalerQuiz } = useLuno();
  const possibles = trierParDst(chapitres.filter(aDesCartes), dsts);
  const [choisis, setChoisis] = useState<string[]>(() => {
    const venus = initiaux.filter((id) => possibles.some((c) => c.id === id));
    return venus.length ? venus : possibles[0] ? [possibles[0].id] : [];
  });
  const [aide, setAide] = useState(false);
  const [file, setFile] = useState<NotionManche[] | null>(null);
  const [index, setIndex] = useState(0);
  const [resultats, setResultats] = useState<Resultat[]>([]);
  const [revenues, setRevenues] = useState<string[]>([]);
  useEffect(() => occupe(file !== null), [file, occupe]);

  const selection = possibles.filter((c) => choisis.includes(c.id));
  const r = repartition(selection);
  const restantes = r.total - r.maitrisees;
  const pret = selection.length > 0 && restantes > 0;

  const lancer = () => {
    if (!pret) return setAide(true);
    setFile(composerManche(selection));
    setIndex(0);
    setResultats([]);
    setRevenues([]);
  };

  // ———————— Choix des chapitres ————————
  if (!file) {
    if (possibles.length === 0)
      return (
        <div>
          {entete}
          <EtatVide
            icone={<GraduationCap size={26} />}
            titre="Pas encore de notions à apprendre"
            texte="Il faut un chapitre avec des flashcards."
          />
        </div>
      );
    return (
      <div>
        {entete}
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="mb-2 text-[14px] text-muted">
              Choisis ce que tu dois savoir. Chaque notion passe trois paliers : la reconnaître, la compléter, puis
              l&apos;écrire de tête.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2" role="group" aria-label="Chapitres à apprendre">
              {possibles.map((c) => {
                const m = matieres.find((x) => x.id === c.matiereId);
                const actif = choisis.includes(c.id);
                const rc = repartition([c]);
                const dst = prochainDstDe(c.id, dsts);
                return (
                  <button
                    key={c.id}
                    role="checkbox"
                    aria-checked={actif}
                    onClick={() => {
                      setChoisis(actif ? choisis.filter((x) => x !== c.id) : [...choisis, c.id]);
                      setAide(false);
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
                    <span className="min-w-0 flex-1">
                      <span
                        className="flex flex-wrap items-center gap-x-2 text-[12.5px] font-semibold"
                        style={{ color: encre(m?.couleur ?? "#888") }}
                      >
                        <span>
                          <Emoji e={m?.emoji} /> {m?.nom}
                        </span>
                        {dst && (
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">
                            DST {compteARebours(dst.date)}
                          </span>
                        )}
                      </span>
                      <span className="block text-[15.5px] font-semibold leading-snug">{c.titre}</span>
                      <Jauge r={rc} />
                      <span className="mt-1 block text-[12.5px] text-muted">
                        {rc.maitrisees} / {rc.total} notions maîtrisées
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <Carte className="h-fit lg:sticky lg:top-24">
            <p className="text-[17px] font-semibold">Où tu en es</p>
            <Jauge r={r} grande />
            <ul className="mt-3 grid gap-1.5 text-[13.5px]">
              <Ligne couleur="var(--ok)" label="Maîtrisées" n={r.maitrisees} />
              <Ligne couleur="var(--copper)" label="À écrire de tête" n={r.aEcrire} />
              <Ligne couleur="var(--blush)" label="À compléter" n={r.aCompleter} />
              <Ligne couleur="var(--line)" label="Pas encore vues" n={r.nouvelles} />
            </ul>
            <Bouton className="mt-5 w-full" onClick={lancer}>
              {r.maitrisees > 0 || r.aEcrire + r.aCompleter > 0 ? "Continuer" : "Commencer"}
            </Bouton>
            <p className={`mt-2 text-[12.5px] ${aide && !pret ? "text-accent" : "text-muted"}`} role="status">
              {aide && !pret
                ? selection.length === 0
                  ? "Coche d'abord au moins un chapitre."
                  : "Tout est maîtrisé ici : bravo !"
                : restantes > 0
                  ? `Encore ${pluriel(Math.ceil(restantes / TAILLE_MANCHE), "manche")} de ${TAILLE_MANCHE} environ.`
                  : "Tout est maîtrisé : revois-les dans la révision du jour."}
            </p>
          </Carte>
        </div>
        <BarreAction visible={pret}>
          <span className="min-w-0 flex-1 text-[14px] font-semibold leading-tight">
            {r.maitrisees} / {r.total} maîtrisées
            <span className="block text-[12.5px] font-normal text-muted">Manche de {Math.min(TAILLE_MANCHE, restantes)}</span>
          </span>
          <Bouton onClick={lancer}>{r.maitrisees > 0 ? "Continuer" : "Commencer"}</Bouton>
        </BarreAction>
      </div>
    );
  }

  // ———————— Bilan de la manche ————————
  if (index >= file.length) {
    // Le dernier essai de chaque notion : ratée puis réussie à son retour, elle est acquise.
    const derniers = new Map<string, Resultat>();
    for (const x of resultats) derniers.set(x.carteId, x);
    const montees = resultats.filter((x) => x.reussi).length;
    const maitrisees = resultats.filter((x) => x.maitrisee);
    const aRevoir = [...derniers.values()].filter((x) => !x.reussi);
    return (
      <div className="mx-auto max-w-[620px]">
        <Carte>
          <p className="surtitre">Manche terminée</p>
          <p className="mt-1 font-display text-[26px] leading-tight">
            {maitrisees.length > 0
              ? `${pluriel(maitrisees.length, "notion")} maîtrisée${maitrisees.length > 1 ? "s" : ""} !`
              : `${pluriel(montees, "palier")} franchi${montees > 1 ? "s" : ""}`}
          </p>
          <Jauge r={r} grande />
          <p className="mt-2 text-[13.5px] text-muted">
            {r.maitrisees} / {r.total} notions maîtrisées dans {selection.length > 1 ? "ces chapitres" : "ce chapitre"}.
          </p>
          {maitrisees.length > 0 && (
            <div className="mt-4">
              <p className="text-[13.5px] font-semibold text-ok">Maîtrisées</p>
              <ul className="mt-1 grid gap-1 text-[14px]">
                {maitrisees.map((x) => (
                  <li key={x.carteId} className="flex gap-2">
                    <Check size={15} className="mt-[3px] shrink-0 text-ok" />
                    <span>{formule(x.recto)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {aRevoir.length > 0 && (
            <div className="mt-4">
              <p className="text-[13.5px] font-semibold text-bad">Pas encore</p>
              <ul className="mt-1 grid gap-1 text-[14px]">
                {aRevoir.map((x) => (
                  <li key={x.carteId} className="flex gap-2">
                    <X size={15} className="mt-[3px] shrink-0 text-bad" />
                    <span>{formule(x.recto)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {restantes > 0 && <Bouton onClick={lancer}>Manche suivante</Bouton>}
            <Bouton variante="contour" onClick={() => setFile(null)}>
              Terminer
            </Bouton>
          </div>
        </Carte>
      </div>
    );
  }

  // ———————— Une question ————————
  const q = file[index];
  const chapitre = chapitres.find((c) => c.id === q.chapitreId);
  const matiere = matieres.find((m) => m.id === chapitre?.matiereId);
  const scientifique = estScientifique(matiere?.nom);

  /** Garde la réponse dans le journal (lu par Claude) ; renvoie son identifiant. */
  const repondre = (reussi: boolean, reponse: string): { id: string; etat: EtatReponse } => {
    const carte = q.carte;
    const idJournal = `${Date.now().toString(36)}-${carte.id.slice(0, 8)}`;
    noterQuiz({
      id: idJournal,
      date: new Date().toISOString(),
      chapitre: chapitre?.titre ?? "",
      ...(chapitre?.publieId ? { publieId: chapitre.publieId } : {}),
      recto: carte.recto,
      palier: q.palier,
      forme: q.inverse ? "inverse" : q.palier === 1 ? "qcm" : q.palier === 2 ? "trou" : "tete",
      reponse: reponse.slice(0, 500),
      ...(q.trous ? { attendu: q.trous.join(" | ") } : {}),
      juste: reussi,
    });
    // Pas de « maîtrisée » le jour même (illusion de maîtrise, tour 2 de l'élève testeur) :
    // - une notion ratée puis rattrapée dans la même manche ne monte pas ;
    // - le palier 3 réussi ne la rend maîtrisée que si le palier précédent date d'un autre jour.
    const rattrapage = revenues.includes(carte.id);
    const aujourdhui = new Date().toISOString().slice(0, 10);
    // Jamais travaillée avant aujourd'hui (même réussie du premier coup) : une seule réussite
    // sans délai ne prouve pas qu'on retiendra (tour 3, B1).
    const memeJour = !carte.apprendreJour || carte.apprendreJour === aujourdhui || (carte.apprendre ?? 0) === 0;
    let etat: EtatReponse = reussi ? "palier" : "echec";
    let nouveau = reussi ? apresReussite(carte, q.palier) : apresEchec(carte, q.palier);
    if (reussi && rattrapage) {
      nouveau = carte.apprendre ?? 0;
      etat = "rattrapee";
    } else if (reussi && nouveau >= MAITRISEE && memeJour) {
      nouveau = Math.max(carte.apprendre ?? 0, 2);
      etat = "attente";
    } else if (reussi && nouveau >= MAITRISEE) etat = "maitrisee";
    majPalier(q.chapitreId, carte.id, nouveau);
    // Écrire de tête, c'est savoir : la carte entre dans la répétition espacée.
    if (q.palier === 3 && !(reussi && rattrapage)) noterFlashcard(q.chapitreId, carte.id, reussi);
    setResultats((x) => [
      ...x,
      { carteId: carte.id, recto: carte.recto, palier: q.palier, reussi, maitrisee: reussi && nouveau >= MAITRISEE },
    ]);
    if (!reussi && !revenues.includes(carte.id)) {
      const retour = preparerNotion(
        q.chapitreId,
        { ...carte, apprendre: nouveau },
        chapitre?.flashcards ?? [],
        selection.flatMap((c) => (c.id === q.chapitreId ? [] : c.flashcards)),
      );
      setFile((f) => {
        if (!f) return f;
        const copie = [...f];
        copie.splice(Math.min(index + 4, copie.length), 0, retour);
        return copie;
      });
      setRevenues((x) => [...x, carte.id]);
    }
    return { id: idJournal, etat };
  };

  return (
    <div className="mx-auto max-w-[680px]">
      <div className="mb-4 flex items-center gap-3">
        <BoutonIcone label="Quitter la manche" onClick={() => setFile(null)}>
          <X size={20} />
        </BoutonIcone>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/8" role="progressbar" aria-valuemin={0} aria-valuemax={file.length} aria-valuenow={index}>
          <div
            className="h-full w-full origin-left rounded-full bg-accent transition-transform duration-500"
            style={{ transform: `scaleX(${index / file.length})` }}
          />
        </div>
        <span className="text-[13px] font-semibold tabular-nums text-muted">
          {index + 1}/{file.length}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${q.carte.id}`}
          initial={{ opacity: 0, transform: "translate3d(0, 12px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0, transform: "translate3d(0, -8px, 0)" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Question
            q={q}
            scientifique={scientifique}
            matiere={matiere ? `${matiere.nom}` : ""}
            chapitre={chapitre?.titre ?? ""}
            emoji={matiere?.emoji}
            couleur={matiere?.couleur ?? "#888"}
            repondre={repondre}
            signaler={signalerQuiz}
            suivant={() => setIndex((i) => i + 1)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Question({
  q,
  scientifique,
  matiere,
  chapitre,
  emoji,
  couleur,
  repondre,
  suivant,
  signaler,
}: {
  q: NotionManche;
  scientifique: boolean;
  matiere: string;
  chapitre: string;
  emoji?: string;
  couleur: string;
  repondre: (reussi: boolean, reponse: string) => { id: string; etat: EtatReponse };
  signaler: (id: string, signal: NonNullable<EntreeQuiz["signal"]>, remarque?: string) => void;
  suivant: () => void;
}) {
  const [choix, setChoix] = useState<string | null>(null);
  const [saisie, setSaisie] = useState("");
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const [compare, setCompare] = useState(false);
  const champs = useRef<(HTMLInputElement | null)[]>([]);
  const [mots, setMots] = useState<string[]>(() => (q.trous ?? []).map(() => ""));
  const [justes, setJustes] = useState<boolean[] | null>(null);
  // Trous faux : l'élève peut dire qu'il avait un mot de même sens avant que ça compte.
  const [aTrancher, setATrancher] = useState(false);
  const carte = q.carte;
  const resultat = useMemo(() => (compare ? comparer(saisie, carte.verso) : null), [compare, saisie, carte.verso]);
  useEffect(() => {
    if (q.palier === 2) champs.current[0]?.focus({ preventScroll: true });
  }, [q.palier]);

  const [idJournal, setIdJournal] = useState<string | null>(null);
  const [etat, setEtat] = useState<EtatReponse | null>(null);
  const [confirmer, setConfirmer] = useState(false);
  const decider = (reussi: boolean, reponse = saisie) => {
    if (verdict !== null) return;
    setVerdict(reussi);
    const r = repondre(reussi, reponse);
    setIdJournal(r.id);
    setEtat(r.etat);
  };

  // Palier 2 : le verso, chaque mot caché remplacé par un champ.
  const morceaux = useMemo(
    () => (q.palier === 2 && q.trous ? decouperTrous(carte.verso, q.trous) : null),
    [q.palier, q.trous, carte.verso],
  );
  /** Corrige chaque trou ; la notion passe le palier si tous sont justes. */
  const verifierTrous = (abandon = false) => {
    if (verdict !== null || !q.trous) return;
    const vides = mots.findIndex((m) => !m.trim());
    if (!abandon && vides >= 0) return champs.current[vides]?.focus();
    const j = q.trous.map(
      (t, i) => !abandon && (reponseJuste(mots[i] ?? "", [t]) || synonymes(simplifier(mots[i] ?? "").trim(), simplifier(t))),
    );
    setJustes(j);
    if (j.every(Boolean) || abandon) decider(j.every(Boolean), mots.join(" | "));
    else setATrancher(true);
  };

  return (
    <Carte>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12.5px] font-semibold" style={{ color: encre(couleur) }}>
          <Emoji e={emoji} /> {matiere}
        </span>
        <Paliers palier={q.palier} />
      </div>
      <p className="mt-0.5 text-[12.5px] text-muted">{chapitre}</p>
      <p className="mt-3 text-[13px] font-semibold text-muted">
        {q.inverse
          ? "Quelle notion correspond à cette définition ?"
          : q.palier === 1 && !estQuestion(carte.recto)
            ? "Choisis ce qui correspond à :"
            : q.palier === 2 && (q.trous?.length ?? 0) > 1
              ? `Complète les ${q.trous!.length} mots qui manquent.`
              : CONSIGNES[q.palier]}
      </p>
      {q.inverse ? (
        <p className="mt-2 rounded-xl border-l-4 border-accent bg-ink/5 px-4 py-3 text-[16px] leading-relaxed">
          {formule(q.inverse)}
        </p>
      ) : (
        <p className="mt-1 font-display text-[21px] leading-snug sm:text-[23px]">{formule(carte.recto)}</p>
      )}

      {q.palier === 1 && q.choix && (
        <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Propositions">
          {q.choix.map((c, i) => {
            const bon = c === (q.inverse ? carte.recto : carte.verso);
            const montre = verdict !== null;
            return (
              <button
                key={i}
                role="radio"
                aria-checked={choix === c}
                disabled={montre}
                onClick={() => {
                  setChoix(c);
                  decider(bon, c);
                }}
                className={`rounded-xl border-2 p-3 text-left text-[14.5px] leading-snug transition-colors duration-200 ${
                  montre && bon
                    ? "border-ok bg-ok/10"
                    : montre && choix === c
                      ? "border-bad bg-bad/10"
                      : montre
                        ? "border-line opacity-60"
                        : "border-line bg-surface hover:border-ink/30"
                }`}
              >
                {formule(c)}
              </button>
            );
          })}
        </div>
      )}

      {q.palier === 2 && morceaux && q.trous && (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            verifierTrous();
          }}
        >
          <p className="rounded-xl bg-ink/5 p-3.5 text-[15px] leading-[2.1]">
            {morceaux.map((m, k) => {
              if (typeof m === "string") return <span key={k}>{formule(m)}</span>;
              const i = m;
              if (justes)
                return (
                  <span
                    key={k}
                    className={`mx-0.5 rounded-md px-1.5 font-semibold ${justes[i] ? "bg-ok/15 text-ok" : "bg-bad/15 text-bad"}`}
                  >
                    {q.trous![i]}
                  </span>
                );
              return (
                <input
                  key={k}
                  ref={(el) => {
                    champs.current[i] = el;
                  }}
                  value={mots[i] ?? ""}
                  onChange={(e) => setMots((l) => l.map((x, j) => (j === i ? e.target.value : x)))}
                  onKeyDown={(e) => {
                    // Entrée : trou suivant, puis vérification au dernier.
                    if (e.key !== "Enter" || i === q.trous!.length - 1) return;
                    e.preventDefault();
                    champs.current[i + 1]?.focus();
                  }}
                  enterKeyHint={i === q.trous!.length - 1 ? "done" : "next"}
                  aria-label={`Mot qui manque ${i + 1}`}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="mx-0.5 inline-block h-[1.7em] w-[min(7.5em,42%)] rounded-md !border-0 !border-b-2 !border-solid !border-accent bg-surface px-1.5 py-0 align-baseline leading-none !shadow-none outline-none"
                  style={{ fontSize: 16 }}
                />
              );
            })}
          </p>
          {verdict === null && aTrancher && (
            <ZoneAction cle="trancher" className="mt-3 grid gap-2">
              <p className="text-[13.5px] text-muted">
                Tu as écrit :{" "}
                {mots
                  .map((m, i) => (justes && !justes[i] ? `« ${m.trim() || "rien"} »` : null))
                  .filter(Boolean)
                  .join(", ")}
                . Si c&apos;est un mot de même sens, compte-le juste.
              </p>
              <div className="flex flex-wrap gap-2">
                <Bouton type="button" onClick={() => decider(false, mots.join(" | "))}>
                  OK, à revoir
                </Bouton>
                <Bouton type="button" variante="contour" onClick={() => decider(true, mots.join(" | "))}>
                  <Check size={16} /> J&apos;avais juste
                </Bouton>
              </div>
            </ZoneAction>
          )}
          {verdict === null && !aTrancher && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Bouton type="submit">Vérifier</Bouton>
              <Bouton type="button" variante="fantome" onClick={() => verifierTrous(true)}>
                Je ne sais pas
              </Bouton>
            </div>
          )}
          {verdict !== null && justes && q.trous.length > 1 && (
            <p className="mt-2 text-[13.5px] text-muted">
              {justes.filter(Boolean).length} / {q.trous.length} mots justes
              {verdict ? "" : " : il faut les trouver tous pour passer au palier suivant"}.
            </p>
          )}
          {verdict === false && !aTrancher && mots.some((m, i) => m.trim() && justes && !justes[i]) && (
            <p className="mt-1 text-[13.5px] text-muted">
              Tu as écrit :{" "}
              {mots
                .map((m, i) => (m.trim() && justes && !justes[i] ? `« ${m.trim()} »` : null))
                .filter(Boolean)
                .join(", ")}
              .
            </p>
          )}
        </form>
      )}

      {q.palier === 3 && (
        <div className="mt-4">
          {!compare ? (
            <>
              <SaisieFormule
                valeur={saisie}
                changer={setSaisie}
                lignes={3}
                label="Ta réponse"
                placeholder="Écris ce que tu sais, même incomplet"
                scientifique={scientifique}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Bouton onClick={() => setCompare(true)}>
                  Comparer au cours
                </Bouton>
                <Bouton variante="fantome" onClick={() => decider(false)}>
                  Je ne sais pas
                </Bouton>
              </div>
            </>
          ) : (
            resultat && (
              <div className="grid gap-3">
                <div className="rounded-xl border border-line p-3.5">
                  <p className="surtitre">Ta réponse</p>
                  <p className="mt-1 whitespace-pre-line text-[14.5px]">{formule(scientifique ? versNotation(saisie) : saisie)}</p>
                </div>
                <div className="rounded-xl bg-ink/5 p-3.5">
                  <p className="surtitre">Le cours</p>
                  <p className="mt-1 text-[14.5px] leading-relaxed">{surligner(
                      carte.verso,
                      resultat.presents,
                      resultat.formules.length > 0 && resultat.formules.every((f) => f.trouvee),
                    )}</p>
                  {carte.schema && (
                    <div className="mt-3">
                      <DessinSchema schema={carte.schema} hauteurMax={160} className="max-w-[400px]" />
                    </div>
                  )}
                </div>
                {resultat.formules.length > 0 && (
                  <p className="text-[13.5px] text-muted">
                    {resultat.formules.every((f) => f.trouvee) ? (
                      <span className="font-semibold text-ok">
                        <Check size={14} className="mr-1 inline" />
                        Formule juste
                      </span>
                    ) : (
                      <>
                        {resultat.formules.some((f) => f.sansFleche)
                          ? "Formule juste, mais il manque les flèches de vecteur : "
                          : "Formule à retrouver : "}
                        <span className="font-semibold text-bad">
                          {resultat.formules.filter((f) => !f.trouvee).map((f, i) => (
                            <span key={i} className="mr-2 inline-block">{formule(f.f)}</span>
                          ))}
                        </span>
                      </>
                    )}
                  </p>
                )}
                {resultat.cles.length > 0 &&
                  (resultat.formules.length > 0 && resultat.formules.every((f) => f.trouvee) ? (
                    // La formule est l'essentiel : les mots qui l'expliquent sont un plus.
                    resultat.manquants.length > 0 && (
                      <p className="text-[13px] text-muted">
                        Pour l&apos;expliquer en mots : {resultat.manquants.slice(0, 6).join(", ")}
                      </p>
                    )
                  ) : (
                    <p className="text-[13.5px] text-muted">
                      Mots clés retrouvés : {resultat.presents.size} / {resultat.cles.length}
                      {resultat.manquants.length > 0 && (
                        <>
                          {" "}· il manque <span className="font-semibold text-bad">{resultat.manquants.slice(0, 6).join(", ")}</span>
                        </>
                      )}
                    </p>
                  ))}
                {verdict === null && (
                  <ZoneAction cle={resultat} className="flex flex-wrap items-center gap-2">
                    {confirmer && (
                      <p className="w-full text-[13.5px] font-semibold text-bad" role="alert">
                        Tu n&apos;as retrouvé que {resultat.presents.size} mot{resultat.presents.size > 1 ? "s" : ""} clé
                        {resultat.presents.size > 1 ? "s" : ""} sur {resultat.cles.length}. Ton prof compterait-il
                        vraiment juste ? Si oui, confirme.
                      </p>
                    )}
                    <Bouton
                      onClick={() => {
                        // Auto-validation encadrée : sous la moitié des mots clés et sans la
                        // formule, on demande une confirmation (l'élève se surnote facilement).
                        const formuleOk = resultat.formules.length > 0 && resultat.formules.every((f) => f.trouvee);
                        if (!confirmer && !formuleOk && resultat.cles.length >= 3 && resultat.part < 0.5) setConfirmer(true);
                        else decider(true);
                      }}
                    >
                      <Check size={17} /> {confirmer ? "Oui, c'était juste" : "C'était juste"}
                    </Bouton>
                    <Bouton variante="contour" onClick={() => decider(false)}>
                      Presque : à revoir
                    </Bouton>
                  </ZoneAction>
                )}
              </div>
            )
          )}
        </div>
      )}

      {verdict !== null && (
        <div className="mt-4">
          <p className={`text-[15px] font-semibold ${verdict ? "text-ok" : "text-bad"}`} role="status">
            {etat === "maitrisee"
              ? "Maîtrisée ! Elle reviendra de temps en temps pour ne pas l'oublier."
              : etat === "attente"
                ? "Juste ! Pour la maîtriser, réussis-la encore de tête un autre jour."
                : etat === "rattrapee"
                  ? "Rattrapée. Elle reste à retravailler un autre jour."
                  : verdict
                    ? "Bien vu, palier suivant."
                    : "Pas encore : elle revient un peu plus loin."}
          </p>
          {q.inverse && (
            <div className="mt-2 rounded-xl bg-ink/5 p-3.5 text-[14.5px] leading-relaxed">
              {formule(carte.verso)}
              {carte.schema && (
                <div className="mt-3">
                  <DessinSchema schema={carte.schema} hauteurMax={160} className="max-w-[400px]" />
                </div>
              )}
            </div>
          )}
          <ZoneAction cle={verdict} className="mt-3 flex flex-wrap items-center gap-2">
            <Bouton onClick={suivant} autoFocus>
              Continuer
            </Bouton>
            {idJournal && <Signaler id={idJournal} signaler={signaler} />}
          </ZoneAction>
        </div>
      )}
    </Carte>
  );
}

type EtatReponse = "maitrisee" | "attente" | "rattrapee" | "palier" | "echec";

const SIGNAUX: { id: NonNullable<EntreeQuiz["signal"]>; label: string }[] = [
  { id: "pas-claire", label: "Pas claire" },
  { id: "inutile", label: "Inutile" },
  { id: "trop-facile", label: "Trop facile" },
  { id: "corrige-faux", label: "Corrigé faux" },
  { id: "autre", label: "Autre" },
];

/**
 * « Signaler » : l'élève dit ce qui ne va pas dans la question. Le signalement part dans
 * le journal synchronisé ; Claude le lit à son prochain passage pour corriger la carte.
 */
function Signaler({
  id,
  signaler,
}: {
  id: string;
  signaler: (id: string, signal: NonNullable<EntreeQuiz["signal"]>, remarque?: string) => void;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [choisi, setChoisi] = useState<NonNullable<EntreeQuiz["signal"]> | null>(null);
  const [remarque, setRemarque] = useState("");
  const [envoye, setEnvoye] = useState(false);
  if (envoye)
    return (
      <span className="text-[13px] text-muted" role="status">
        Merci : Claude regardera cette question.
      </span>
    );
  if (!ouvert)
    return (
      <Bouton variante="fantome" onClick={() => setOuvert(true)} className="text-[13.5px]">
        <Flag size={15} /> Signaler
      </Bouton>
    );
  return (
    <div className="mt-1 w-full rounded-xl border border-line p-3">
      <p className="text-[13.5px] font-semibold">Qu&apos;est-ce qui ne va pas ?</p>
      <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Problème">
        {SIGNAUX.map((s) => (
          <button
            key={s.id}
            role="radio"
            aria-checked={choisi === s.id}
            onClick={() => setChoisi(s.id)}
            className={`min-h-9 rounded-full px-3 text-[13px] font-semibold transition-colors duration-200 ${
              choisi === s.id ? "bg-ink text-bg" : "bg-ink/5 text-muted hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <input
        value={remarque}
        onChange={(e) => setRemarque(e.target.value)}
        placeholder="Un mot de plus (facultatif)"
        aria-label="Remarque"
        className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2 text-[14px] outline-none focus:border-ink/30"
        style={{ fontSize: 16 }}
      />
      <div className="mt-2 flex gap-2">
        <Bouton
          onClick={() => {
            if (!choisi) return setChoisi("autre");
            signaler(id, choisi, remarque.trim() || undefined);
            setEnvoye(true);
          }}
        >
          Envoyer
        </Bouton>
        <Bouton variante="fantome" onClick={() => setOuvert(false)}>
          Annuler
        </Bouton>
      </div>
    </div>
  );
}

/** Le verso, avec les mots clés retrouvés en vert et les manquants soulignés. */
function surligner(verso: string, presents: Set<string>, formuleJuste = false) {
  const texte = sansMiseEnForme(verso);
  const cles = comparer("", verso).cles.sort((a, b) => b.length - a.length);
  if (!cles.length) return formule(texte);
  const motif = new RegExp(`(?<![A-Za-zÀ-ÿ])(${cles.join("|")})(?![A-Za-zÀ-ÿ])`);
  // Les fractions restent entières (dessinées d'un bloc) ; les mots clés sont pris ailleurs.
  return texte.split(/(\{\{[\s\S]*?\}\})/).flatMap((bloc, b) =>
    bloc.startsWith("{{")
      ? [<span key={`f${b}`}>{formule(bloc)}</span>]
      : bloc.split(motif).map((m, i) =>
          i % 2 ? (
            <span
              key={`${b}-${i}`}
              className={
                presents.has(m)
                  ? "font-semibold text-ok"
                  : formuleJuste
                    ? "font-semibold"
                    : "font-semibold text-bad underline decoration-dashed underline-offset-4"
              }
            >
              {m}
            </span>
          ) : (
            <span key={`${b}-${i}`}>{formule(m)}</span>
          ),
        ),
  );
}

function Paliers({ palier }: { palier: 1 | 2 | 3 }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Palier ${palier} sur 3 : ${NOMS_PALIERS[palier]}`}>
      {([1, 2, 3] as const).map((p) => (
        <span
          key={p}
          className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold ${
            p === palier ? "bg-accent text-on-accent" : p < palier ? "bg-accent-soft text-accent" : "bg-ink/5 text-muted"
          }`}
        >
          {NOMS_PALIERS[p]}
        </span>
      ))}
    </span>
  );
}

function Jauge({ r, grande = false }: { r: ReturnType<typeof repartition>; grande?: boolean }) {
  const t = Math.max(1, r.total);
  const parts = [
    { n: r.maitrisees, c: "var(--ok)" },
    { n: r.aEcrire, c: "var(--copper)" },
    { n: r.aCompleter, c: "var(--blush)" },
  ];
  return (
    <span className={`mt-2 flex w-full overflow-hidden rounded-full bg-ink/8 ${grande ? "h-3" : "h-1.5"}`} aria-hidden>
      {parts.map((p, i) => (
        <span key={i} style={{ width: `${(p.n / t) * 100}%`, background: p.c }} className="h-full" />
      ))}
    </span>
  );
}

function Ligne({ couleur, label, n }: { couleur: string; label: string; n: number }) {
  return (
    <li className="flex items-center gap-2">
      <span className="size-2.5 shrink-0 rounded-full" style={{ background: couleur }} />
      <span className="flex-1">{label}</span>
      <span className="font-semibold tabular-nums">{n}</span>
    </li>
  );
}
