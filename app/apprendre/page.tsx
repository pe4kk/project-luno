"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Eye,
  GraduationCap,
  Send,
} from "lucide-react";
import { LECONS } from "@/contenu/lecons";
import { formule } from "@/components/Formule";
import type { Lecon } from "@/lib/types";
import { demandeLecon } from "@/lib/contenu";
import {
  Bouton,
  Carte,
  Champ,
  EnTete,
  EnvoyerAClaude,
  EtatVide,
  classeSaisie,
  pluriel,
} from "@/components/ui";

const NIVEAUX = ["Seconde", "Première", "Terminale"];

export default function Page() {
  return (
    <Suspense>
      <Apprendre />
    </Suspense>
  );
}

function Apprendre() {
  const params = useSearchParams();
  const lecon = LECONS.find((l) => l.id === params.get("l"));
  const [sujet, setSujet] = useState("");
  const [niveau, setNiveau] = useState("Première");
  const [precision, setPrecision] = useState("");
  const [envoi, setEnvoi] = useState(false);

  if (lecon) return <Lecteur key={lecon.id} lecon={lecon} />;

  return (
    <div>
      <EnTete
        titre="Apprendre"
        sousTitre="Des leçons pas à pas, rédigées pour toi sur le sujet de ton choix."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-3 text-[20px]">Tes leçons</h2>
          {LECONS.length === 0 ? (
            <EtatVide
              icone={<GraduationCap size={26} />}
              titre="Pas encore de leçon"
              texte="Demande un sujet à Claude : la leçon apparaîtra ici une fois rédigée."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {LECONS.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <Link
                    href={`/apprendre?l=${l.id}`}
                    className="block h-full rounded-[18px] border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-pop"
                  >
                    <p className="surtitre text-accent">
                      {l.matiere} · {l.niveau}
                    </p>
                    <p className="mt-2 font-display text-[22px] leading-tight">
                      {l.titre}
                    </p>
                    <p className="mt-3 flex items-center gap-3 text-[13px] text-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {l.duree}
                      </span>
                      <span>{pluriel(l.etapes.length, "étape")}</span>
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <Carte className="h-fit">
          <h2 className="text-[20px]">Demander une leçon</h2>
          <p className="mt-1 text-[14px] text-muted">
            Claude la rédige et l&apos;ajoute ici. Pour apprendre en discutant,
            pose-lui directement tes questions dans votre conversation.
          </p>
          <form
            className="mt-4 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (sujet.trim()) setEnvoi(true);
            }}
          >
            <Champ label="Sujet">
              <input
                required
                className={classeSaisie}
                placeholder="Ex. Les suites arithmétiques"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
              />
            </Champ>
            <div>
              <span className="mb-1.5 block text-[13px] font-semibold text-muted">
                Niveau
              </span>
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Niveau"
              >
                {NIVEAUX.map((n) => (
                  <button
                    type="button"
                    key={n}
                    role="radio"
                    aria-checked={niveau === n}
                    onClick={() => setNiveau(n)}
                    className={`min-h-11 rounded-full px-4 text-[14px] font-medium transition-colors ${
                      niveau === n
                        ? "bg-ink text-bg"
                        : "bg-ink/5 text-ink hover:bg-ink/10"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <Champ label="Ce qui te bloque (facultatif)">
              <textarea
                rows={2}
                className={classeSaisie}
                placeholder="Ex. Je confonds raison et premier terme"
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
              />
            </Champ>
            <Bouton type="submit" disabled={!sujet.trim()}>
              <Send size={16} /> Envoyer à Claude
            </Bouton>
          </form>
        </Carte>
      </div>

      <EnvoyerAClaude
        ouverte={envoi}
        fermer={() => setEnvoi(false)}
        titre="Demander une leçon"
        objet={`Leçon : ${sujet.trim()} (${niveau})`}
        texte={demandeLecon(sujet, niveau, precision)}
        resultat="la leçon"
      />
    </div>
  );
}

function Lecteur({ lecon }: { lecon: Lecon }) {
  const [etape, setEtape] = useState(0);
  const [reponseVue, setReponseVue] = useState(false);
  const total = lecon.etapes.length;
  const fini = etape >= total;
  const e = lecon.etapes[etape];
  const aller = (i: number) => {
    setEtape(i);
    setReponseVue(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-[720px]">
      <Link
        href="/apprendre"
        className="-ml-1 mb-2 inline-flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Toutes les leçons
      </Link>
      <p className="surtitre text-accent">
        {lecon.matiere} · {lecon.niveau}
      </p>
      <h1 className="mt-1 text-[34px] leading-tight sm:text-[44px]">
        {lecon.titre}
      </h1>

      {/* Progression */}
      <ol className="my-6 flex gap-2" aria-label="Étapes de la leçon">
        {lecon.etapes.map((x, i) => (
          <li key={x.titre} className="flex-1">
            <button
              onClick={() => aller(i)}
              aria-current={i === etape ? "step" : undefined}
              aria-label={`Étape ${i + 1} : ${x.titre}`}
              className="flex min-h-11 w-full flex-col justify-center gap-1.5"
            >
              <span
                className={`h-1.5 rounded-full transition-colors ${i < etape || fini ? "bg-ok" : i === etape ? "bg-accent" : "bg-line"}`}
              />
              <span
                className={`hidden truncate text-left text-[12.5px] sm:block ${i === etape ? "font-semibold" : "text-muted"}`}
              >
                {x.titre}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        {fini ? (
          <motion.div
            key="fin"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center rounded-[18px] border border-line bg-surface p-8 text-center shadow-card"
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-ok/15 text-ok">
              <Check size={30} />
            </div>
            <h2 className="text-[28px]">Leçon terminée</h2>
            <p className="mt-1 max-w-[380px] text-[15px] text-muted">
              Si un point reste flou, reprends l&apos;étape concernée ou pose ta
              question à Claude.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Bouton variante="contour" onClick={() => aller(0)}>
                Relire
              </Bouton>
              <Link
                href="/apprendre"
                className="inline-flex min-h-11 items-center rounded-[10px] bg-ink px-4 text-[14.5px] font-medium text-bg"
              >
                Terminer
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={etape}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {etape === 0 && (
              <p className="mb-5 text-[16px] leading-relaxed text-muted">
                {formule(lecon.intro)}
              </p>
            )}
            <Carte>
              <p className="surtitre text-muted">
                Étape {etape + 1} sur {total}
              </p>
              <h2 className="mt-1 text-[26px]">{e.titre}</h2>
              <div className="mt-3 flex flex-col gap-3 text-[16px] leading-relaxed">
                {e.texte.map((t) => (
                  <p key={t}>{formule(t)}</p>
                ))}
              </div>
              {e.exemple && (
                <div className="mt-4 rounded-xl bg-accent-soft p-4">
                  <p className="surtitre mb-1 text-accent">Exemple</p>
                  <p className="whitespace-pre-line text-[15px] leading-relaxed">
                    {formule(e.exemple)}
                  </p>
                </div>
              )}
              {e.question && (
                <div className="mt-4 rounded-xl border border-line p-4">
                  <p className="surtitre mb-1 text-muted">Vérifie-toi</p>
                  <p className="text-[15.5px] font-semibold">
                    {formule(e.question.q)}
                  </p>
                  {reponseVue ? (
                    <motion.p
                      role="status"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="whitespace-pre-line mt-2 text-[15px] leading-relaxed"
                    >
                      {formule(e.question.r)}
                    </motion.p>
                  ) : (
                    <Bouton
                      variante="contour"
                      className="mt-3"
                      onClick={() => setReponseVue(true)}
                    >
                      <Eye size={16} /> Voir la réponse
                    </Bouton>
                  )}
                </div>
              )}
            </Carte>
            <div className="mt-5 flex justify-between gap-2">
              <Bouton
                variante="fantome"
                disabled={etape === 0}
                onClick={() => aller(etape - 1)}
              >
                <ArrowLeft size={16} /> Précédent
              </Bouton>
              <Bouton onClick={() => aller(etape + 1)}>
                {etape + 1 === total ? "Terminer" : "Suivant"}{" "}
                <ArrowRight size={16} />
              </Bouton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
