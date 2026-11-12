"use client";

import { useState } from "react";
import { AvecBrouillon } from "@/components/Brouillon";
import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCircle2, ChevronRight, Eye, RotateCcw, X } from "lucide-react";
import { aEncadre, formule } from "@/components/Formule";
import { DessinSchema } from "@/components/Schema";
import { SaisieFormule } from "@/components/SaisieFormule";
import { Bouton, BoutonIcone } from "@/components/ui";
import { estScientifique, versNotation } from "@/lib/saisie";
import { useLuno } from "@/lib/store";
import type { Probleme } from "@/lib/types";

const pointsEtape = (e: Probleme["etapes"][number]) => e.points ?? 1;

/** Un problème rédigé, étape par étape, avec le barème à cocher. */
export function LecteurProbleme({
  probleme,
  matiereId,
  quitter,
}: {
  probleme: Probleme;
  matiereId: string;
  quitter: () => void;
}) {
  const ajouterErreurs = useLuno((s) => s.ajouterErreurs);
  const scientifique = estScientifique(useLuno((s) => s.matieres.find((m) => m.id === matiereId)?.nom));
  const n = probleme.etapes.length;
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState<string[]>(() => probleme.etapes.map(() => ""));
  const [vu, setVu] = useState<boolean[]>(() => probleme.etapes.map(() => false));
  const [coches, setCoches] = useState<boolean[][]>(() =>
    probleme.etapes.map((e) => e.criteres.map(() => false)),
  );
  const [ajoute, setAjoute] = useState(false);
  const fini = etape >= n;

  const total = probleme.etapes.reduce((t, e) => t + pointsEtape(e), 0);
  const obtenu = probleme.etapes.reduce(
    (t, e, i) =>
      t + (e.criteres.length ? (pointsEtape(e) * coches[i].filter(Boolean).length) / e.criteres.length : 0),
    0,
  );
  // Réflexe des encadrés : vérifié pour l'habitude, jamais compté dans la note.
  const aEncadrer = probleme.etapes.map((e, i) => (e.encadrer ? aEncadre(reponses[i]) : null));
  const encadresAttendus = aEncadrer.filter((x) => x !== null).length;
  const encadresFaits = aEncadrer.filter((x) => x === true).length;
  const manques = probleme.etapes.flatMap((e, i) =>
    e.criteres.filter((_, k) => !coches[i][k]).map((c) => ({ critere: c, etape: e })),
  );

  const recommencer = () => {
    setEtape(0);
    setReponses(probleme.etapes.map(() => ""));
    setVu(probleme.etapes.map(() => false));
    setCoches(probleme.etapes.map((e) => e.criteres.map(() => false)));
    setAjoute(false);
  };

  return (
    <AvecBrouillon cle={`pb-${probleme.id}`}>
    <div className="mx-auto max-w-[680px]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex flex-1 gap-1.5" aria-hidden>
          {probleme.etapes.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < etape ? "bg-accent" : i === etape ? "bg-copper" : "bg-line"
              }`}
            />
          ))}
        </div>
        <span className="text-[13px] font-semibold text-muted">
          {fini ? "Terminé" : `Étape ${etape + 1} / ${n}`}
        </span>
        <BoutonIcone label="Quitter le problème" onClick={quitter} className="-mr-2">
          <X size={18} />
        </BoutonIcone>
      </div>

      <div className="rounded-[18px] border border-line border-l-4 bg-surface p-5 shadow-card" style={{ borderLeftColor: "var(--copper)" }}>
        <p className="surtitre text-accent">Énoncé</p>
        <h2 className="mt-1 text-[24px] leading-tight">{probleme.titre}</h2>
        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed">{formule(probleme.enonce)}</p>
        <p className="mt-2 text-[15px] font-semibold leading-relaxed">{formule(probleme.question)}</p>
        {probleme.schema && <DessinSchema schema={probleme.schema} className="mt-3 max-w-[460px]" />}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!fini ? (
          <motion.div
            key={etape}
            initial={{ opacity: 0, transform: "translate3d(30px, 0, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0px, 0, 0)" }}
            exit={{ opacity: 0, transform: "translate3d(-30px, 0, 0)" }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 rounded-[18px] border border-line bg-surface p-5 shadow-card"
          >
            {(() => {
              const e = probleme.etapes[etape];
              return (
                <>
                  <p className="surtitre text-muted">
                    {e.titre} · {String(pointsEtape(e)).replace(".", ",")} pt{pointsEtape(e) > 1 ? "s" : ""}
                  </p>
                  <p className="mt-1 text-[15.5px] font-semibold">{formule(e.consigne)}</p>
                  <div className="mt-3">
                    <SaisieFormule
                      scientifique={scientifique}
                      label={`Ta réponse : ${e.titre}`}
                      valeur={reponses[etape]}
                      changer={(v) => setReponses(reponses.map((r, i) => (i === etape ? v : r)))}
                      lignes={3}
                      placeholder="Écris la ligne que tu mettrais sur ta copie"
                      desactive={vu[etape]}
                    />
                  </div>
                  {!vu[etape] ? (
                    <Bouton className="mt-3 w-full" onClick={() => setVu(vu.map((x, i) => (i === etape ? true : x)))}>
                      <Eye size={16} /> Voir ce que ton prof attend
                    </Bouton>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, transform: "translate3d(0, 8px, 0)" }}
                      animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                    >
                      <div className="mt-3 rounded-2xl bg-accent-soft p-4">
                        <p className="surtitre text-accent">Ce que ton prof attend</p>
                        <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed">{formule(e.attendu)}</p>
                      </div>
                      {e.encadrer && (
                        <p
                          className={`mt-3 flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-[14px] ${
                            aEncadrer[etape] ? "bg-ok/10 text-ok" : "bg-ink/5 text-muted"
                          }`}
                        >
                          <span className="encadre !my-0 shrink-0 text-[12px] leading-[18px]">a</span>
                          {aEncadrer[etape]
                            ? "Résultat encadré : bon réflexe."
                            : "Ton prof attend ce résultat encadré : sélectionne-le puis touche « Encadrer ». Ça ne change pas ta note ici."}
                        </p>
                      )}
                      <p className="mt-4 text-[14px] font-semibold">Coche ce que tu as écrit :</p>
                      <ul className="mt-1.5 flex flex-col gap-1.5">
                        {e.criteres.map((c, k) => {
                          const ok = coches[etape][k];
                          return (
                            <li key={k}>
                              <button
                                role="checkbox"
                                aria-checked={ok}
                                onClick={() =>
                                  setCoches(coches.map((l, i) => (i === etape ? l.map((x, j) => (j === k ? !x : x)) : l)))
                                }
                                className={`flex min-h-11 w-full items-center gap-3 rounded-xl border px-3.5 text-left text-[14.5px] transition-colors duration-200 ${
                                  ok ? "border-ok/40 bg-ok/10" : "border-line bg-bg/50"
                                }`}
                              >
                                <span
                                  className={`flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                                    ok ? "border-ok bg-ok text-surface" : "border-muted/50"
                                  }`}
                                >
                                  {ok && <Check size={13} strokeWidth={3} />}
                                </span>
                                {formule(c)}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <Bouton className="mt-4 w-full" onClick={() => setEtape(etape + 1)}>
                        {etape + 1 < n ? (
                          <>
                            Étape suivante · {probleme.etapes[etape + 1].titre} <ChevronRight size={16} />
                          </>
                        ) : (
                          "Voir mon résultat"
                        )}
                      </Bouton>
                    </motion.div>
                  )}
                </>
              );
            })()}
          </motion.div>
        ) : (
          <motion.div
            key="fin"
            initial={{ opacity: 0, transform: "translate3d(0, 12px, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
            className="mt-4 rounded-[18px] border border-line bg-surface p-6 shadow-pop"
          >
            <p className="surtitre text-accent">Ta copie</p>
            <p className="mt-1 font-display text-[44px] leading-none text-accent">
              {String(Math.round(obtenu * 2) / 2).replace(".", ",")}
              <span className="text-[20px] text-ink"> / {String(total).replace(".", ",")}</span>
            </p>
            {manques.length === 0 ? (
              <p className="mt-3 flex items-center gap-2 text-[15px] text-ok">
                <CheckCircle2 size={18} /> Tout y est : c&apos;est la copie que ton prof attend.
              </p>
            ) : (
              <>
                <p className="mt-3 text-[14.5px]">À ne pas oublier la prochaine fois :</p>
                <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 text-[14.5px] text-muted">
                  {manques.map((m, i) => (
                    <li key={i}>{formule(m.critere)}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              {manques.length > 0 && (
                <Bouton
                  disabled={ajoute}
                  onClick={() => {
                    ajouterErreurs(
                      matiereId,
                      manques.map((m) => ({
                        titre: texteSansNotation(m.critere),
                        erreur: `Oublié dans « ${probleme.titre} » (${m.etape.titre.toLowerCase()}).`,
                        correction: m.etape.attendu,
                        source: `Problème « ${probleme.titre} »`,
                      })),
                    );
                    setAjoute(true);
                  }}
                >
                  {ajoute ? <Check size={16} /> : null}
                  {ajoute ? "Ajouté à Mes erreurs" : "Ajouter à Mes erreurs"}
                </Bouton>
              )}
              <Bouton variante="contour" onClick={recommencer}>
                <RotateCcw size={16} /> Recommencer
              </Bouton>
              <Bouton variante="contour" onClick={quitter}>
                Autre problème
              </Bouton>
            </div>
            {encadresAttendus > 0 && (
              <p className={`mt-3 text-[14px] ${encadresFaits === encadresAttendus ? "text-ok" : "text-muted"}`}>
                Réflexe : {encadresFaits} résultat{encadresFaits > 1 ? "s" : ""} encadré{encadresFaits > 1 ? "s" : ""} sur{" "}
                {encadresAttendus}
                {encadresFaits === encadresAttendus ? ", comme ton prof l'attend." : " (sans effet sur ta note)."}
              </p>
            )}
            {reponses.some(Boolean) && (
              <details className="mt-5 text-[14px]">
                <summary className="cursor-pointer font-semibold">Relire ta rédaction</summary>
                <ol className="mt-2 flex list-decimal flex-col gap-1.5 pl-5 text-muted">
                  {reponses.map((r, i) => (
                    <li key={i}>{r ? formule(scientifique ? versNotation(r) : r) : <em>(vide)</em>}</li>
                  ))}
                </ol>
              </details>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </AvecBrouillon>
  );
}

/** Titre d'erreur lisible : sans la notation des formules. */
function texteSansNotation(s: string) {
  return s.replace(/\{\{(.+?) \/\/ (.+?)\}\}/g, "$1/$2");
}
