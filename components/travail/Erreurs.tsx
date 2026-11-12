"use client";

import { useState } from "react";
import { ZoneDictee } from "@/components/Dictee";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Clock, Pencil, Plus, Repeat2, Send, Trash2 } from "lucide-react";
import { formule } from "@/components/Formule";
import {
  Bouton,
  BoutonIcone,
  Carte,
  Champ,
  EnvoyerAClaude,
  EtatVide,
  Fenetre,
  PiecesJointes,
  classeSaisie,
  pluriel,
} from "@/components/ui";
import { demandeErreurs } from "@/lib/contenu";
import { prochainPassage, useDemandes } from "@/lib/demandes";
import { encre, pastel, useLuno } from "@/lib/store";
import type { ErreurNotee, Matiere } from "@/lib/types";

type Brouillon = Pick<ErreurNotee, "titre" | "erreur" | "correction" | "conseil" | "source" | "chapitre">;
const VIDE: Brouillon = { titre: "", erreur: "", correction: "", conseil: "", source: "", chapitre: "" };

/**
 * Onglet « Mes erreurs » d'une matière : ce qui a coûté des points dans les anciennes
 * évaluations, et comment faire juste. Alimenté à la main ou par Claude, à partir des
 * photos d'une évaluation corrigée ou de conseils du prof. À relire avant chaque
 * évaluation : les erreurs refaites remontent en tête.
 */
export function VueErreurs({ matiere }: { matiere: Matiere }) {
  const s = useLuno();
  const erreurs = s.erreurs
    .filter((e) => e.matiereId === matiere.id)
    .sort((a, b) => (b.repetee ?? 0) - (a.repetee ?? 0) || b.date.localeCompare(a.date));
  const enCours = useDemandes((x) => x.liste).filter(
    (d) => d.type === "erreurs" && d.meta.matiere === matiere.nom && d.statut !== "prete",
  );
  const [edition, setEdition] = useState<ErreurNotee | "nouvelle" | null>(null);
  const [brouillon, setBrouillon] = useState<Brouillon>(VIDE);
  const [notes, setNotes] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [pieces, setPieces] = useState<File[]>([]);
  const foncee = encre(matiere.couleur);

  const ouvrir = (e: ErreurNotee | "nouvelle") => {
    setEdition(e);
    setBrouillon(e === "nouvelle" ? VIDE : { ...VIDE, ...e });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="surtitre" style={{ color: foncee }}>
              À relire avant chaque évaluation
            </p>
            <h2 className="mt-1 text-[24px]">Mes erreurs en {matiere.nom}</h2>
            <p className="mt-0.5 text-[14px] text-muted">
              {erreurs.length
                ? `${pluriel(erreurs.length, "erreur")} à ne plus refaire.`
                : "Rien pour l'instant."}
            </p>
          </div>
          <Bouton variante="contour" onClick={() => ouvrir("nouvelle")}>
            <Plus size={16} /> Ajouter
          </Bouton>
        </div>

        {enCours.map((d) => (
          <p
            key={d.id}
            className={`mb-3 flex items-start gap-2 rounded-2xl border border-dashed border-line px-4 py-3 text-[14px] ${
              d.statut === "erreur" ? "text-bad" : "text-muted"
            }`}
          >
            <Clock size={16} className="mt-0.5 shrink-0" />
            {d.statut === "erreur"
              ? `Claude n'a pas pu lire ton évaluation${d.erreur ? ` : ${d.erreur}` : ""}`
              : `Évaluation envoyée (${pluriel(d.meta.images?.length ?? 0, "photo")}) : Claude passe ${prochainPassage()}.`}
          </p>
        ))}

        {erreurs.length === 0 ? (
          <EtatVide
            icone={<AlertCircle size={26} />}
            titre="Pas encore d'erreur notée"
            texte="Envoie les photos d'une évaluation corrigée à Claude, ou ajoute toi-même une erreur et sa correction. Tu relis la liste avant ton prochain DST."
          />
        ) : (
          <ol className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {erreurs.map((e) => (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
                  animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="rounded-[18px] border border-line bg-surface p-5 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-[19px] leading-snug">{formule(e.titre)}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
                        {(e.chapitre || e.source) && (
                          <span>{[e.chapitre, e.source].filter(Boolean).join(" · ")}</span>
                        )}
                        {(e.repetee ?? 0) > 0 && (
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent">
                            refaite {e.repetee}×
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="-mr-2 -mt-1 flex shrink-0">
                      <BoutonIcone label={`Modifier : ${e.titre}`} onClick={() => ouvrir(e)}>
                        <Pencil size={16} />
                      </BoutonIcone>
                      <BoutonIcone
                        label={`Retirer : ${e.titre}`}
                        className="hover:!text-bad"
                        onClick={() => s.supprimerErreur(e.id)}
                      >
                        <Trash2 size={16} />
                      </BoutonIcone>
                    </div>
                  </div>
                  {e.erreur && (
                    <p className="mt-3 flex gap-2 text-[15px] leading-relaxed">
                      <AlertCircle size={17} className="mt-[3px] shrink-0 text-bad" />
                      <span className="min-w-0">{formule(e.erreur)}</span>
                    </p>
                  )}
                  <p className="mt-2 flex gap-2 text-[15px] leading-relaxed">
                    <CheckCircle2 size={17} className="mt-[3px] shrink-0 text-ok" />
                    <span className="min-w-0">{formule(e.correction)}</span>
                  </p>
                  {e.conseil && (
                    <p
                      className="mt-3 rounded-xl px-3.5 py-2 font-hand text-[19px] leading-snug"
                      style={{ background: pastel(matiere.couleur, 12), color: foncee }}
                    >
                      {formule(e.conseil)}
                    </p>
                  )}
                  <button
                    onClick={() => s.modifierErreur(e.id, { repetee: (e.repetee ?? 0) + 1 })}
                    className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full px-2 text-[13px] font-semibold text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <Repeat2 size={14} /> Je l&apos;ai refaite
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>

      <Carte className="h-fit lg:sticky lg:top-24">
        <h3 className="text-[19px]">Envoyer une évaluation</h3>
        <p className="mt-1 text-[14px] text-muted">
          Prends en photo ta copie corrigée (ou écris les conseils du prof) : Claude relève tes
          erreurs et comment les corriger, et les ajoute ici.
        </p>
        <Champ label="Ce que tu veux préciser (facultatif)">
          <ZoneDictee
            rows={3}
            className={classeSaisie + " mt-0"}
            placeholder="Ex. DST du 24/09, j'ai eu 11. Le prof m'a dit de mieux justifier."
            value={notes}
            changer={setNotes}
          />
        </Champ>
        <PiecesJointes fichiers={pieces} setFichiers={setPieces} className="mt-3" />
        <Bouton className="mt-3 w-full" onClick={() => setEnvoi(true)}>
          <Send size={16} /> Envoyer à Claude
        </Bouton>
      </Carte>

      <EnvoyerAClaude
        ouverte={envoi}
        fermer={() => {
          setEnvoi(false);
          setNotes("");
        }}
        titre="Envoyer une évaluation"
        objet={`Évaluation : ${matiere.nom}`}
        texte={demandeErreurs(matiere.nom, notes)}
        resultat="la liste de tes erreurs et leurs corrections"
        demande={{ type: "erreurs", meta: { matiere: matiere.nom } }}
        pieces={pieces}
        setPieces={setPieces}
      />

      <Fenetre
        ouverte={edition !== null}
        fermer={() => setEdition(null)}
        titre={edition === "nouvelle" ? "Ajouter une erreur" : "Modifier l'erreur"}
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={(ev) => {
            ev.preventDefault();
            if (!brouillon.titre.trim() || !brouillon.correction.trim() || !edition) return;
            const propre = Object.fromEntries(
              Object.entries(brouillon).map(([k, v]) => [k, (v ?? "").trim()]),
            ) as Brouillon;
            if (edition === "nouvelle") s.ajouterErreurs(matiere.id, [propre]);
            else s.modifierErreur(edition.id, propre);
            setEdition(null);
          }}
        >
          <Champ label="L'erreur en quelques mots">
            <input
              required
              autoFocus
              className={classeSaisie}
              placeholder="Ex. Oublier l'ensemble de dérivabilité"
              value={brouillon.titre}
              onChange={(e) => setBrouillon({ ...brouillon, titre: e.target.value })}
            />
          </Champ>
          <Champ label="Ce que j'ai fait">
            <textarea
              rows={2}
              className={classeSaisie}
              value={brouillon.erreur}
              onChange={(e) => setBrouillon({ ...brouillon, erreur: e.target.value })}
            />
          </Champ>
          <Champ label="Comment faire juste">
            <textarea
              required
              rows={2}
              className={classeSaisie}
              value={brouillon.correction}
              onChange={(e) => setBrouillon({ ...brouillon, correction: e.target.value })}
            />
          </Champ>
          <Champ label="Astuce pour ne plus la refaire (facultatif)">
            <input
              className={classeSaisie}
              value={brouillon.conseil ?? ""}
              onChange={(e) => setBrouillon({ ...brouillon, conseil: e.target.value })}
            />
          </Champ>
          <div className="grid gap-3 sm:grid-cols-2">
            <Champ label="Chapitre (facultatif)">
              <input
                className={classeSaisie}
                value={brouillon.chapitre ?? ""}
                onChange={(e) => setBrouillon({ ...brouillon, chapitre: e.target.value })}
              />
            </Champ>
            <Champ label="D'où elle vient (facultatif)">
              <input
                className={classeSaisie}
                placeholder="Ex. DST du 24/09"
                value={brouillon.source ?? ""}
                onChange={(e) => setBrouillon({ ...brouillon, source: e.target.value })}
              />
            </Champ>
          </div>
          <Bouton type="submit" className="self-end">
            Enregistrer
          </Bouton>
        </form>
      </Fenetre>
    </div>
  );
}
