"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, FileText, Layers, Play, Plus, ScrollText, Sparkles, Trash2, Upload } from "lucide-react";
import type { Chapitre, Matiere } from "@/lib/types";
import { pastel, useLuno } from "@/lib/store";
import { genererFiche, genererFlashcards, MODE_IA } from "@/lib/ai";
import { BadgeDemo, Bouton, Carte, Champ, Chargement, Fenetre, classeSaisie } from "@/components/ui";
import { Revision } from "./Revision";

const ONGLETS = [
  { id: "cours", label: "Cours", icone: FileText },
  { id: "flashcards", label: "Flashcards", icone: Layers },
  { id: "fiche", label: "Fiche", icone: ScrollText },
] as const;
type Onglet = (typeof ONGLETS)[number]["id"];

const TAILLES = ["Express", "Courte", "Standard", "Détaillée", "Complète"];

export function VueChapitre({
  matiere,
  chapitre,
  retour,
}: {
  matiere: Matiere;
  chapitre: Chapitre;
  retour: () => void;
}) {
  const s = useLuno();
  const [onglet, setOnglet] = useState<Onglet>("cours");
  const foncee = `color-mix(in oklab, ${matiere.couleur} 65%, black)`;

  return (
    <div>
      <button
        onClick={retour}
        className="mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> {matiere.emoji} {matiere.nom}
      </button>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-[34px] font-bold leading-tight sm:text-[40px]">{chapitre.titre}</h1>
        <Bouton
          variante="fantome"
          className="!text-bad"
          onClick={() => {
            if (confirm(`Supprimer le chapitre « ${chapitre.titre} » ?`)) {
              s.supprimerChapitre(chapitre.id);
              retour();
            }
          }}
        >
          <Trash2 size={16} /> Supprimer
        </Bouton>
      </div>

      <div className="mb-6 inline-flex rounded-2xl border border-line bg-surface p-1 shadow-card" role="tablist">
        {ONGLETS.map(({ id, label, icone: Icone }) => (
          <button
            key={id}
            role="tab"
            aria-selected={onglet === id}
            onClick={() => setOnglet(id)}
            className="relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-[14.5px] font-semibold sm:px-5"
            style={{ color: onglet === id ? foncee : "var(--color-muted)" }}
          >
            {onglet === id && (
              <motion.span
                layoutId="sous-onglet"
                className="absolute inset-0 rounded-xl"
                style={{ background: pastel(matiere.couleur, 18) }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icone size={16} className="relative" />
            <span className="relative">{label}</span>
            {id === "flashcards" && chapitre.flashcards.length > 0 && (
              <span className="relative rounded-full bg-ink/10 px-1.5 text-[11.5px]">
                {chapitre.flashcards.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={onglet}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {onglet === "cours" && <OngletCours chapitre={chapitre} suite={() => setOnglet("flashcards")} />}
          {onglet === "flashcards" && (
            <OngletFlashcards chapitre={chapitre} matiere={matiere} versCours={() => setOnglet("cours")} />
          )}
          {onglet === "fiche" && (
            <OngletFiche chapitre={chapitre} matiere={matiere} versCours={() => setOnglet("cours")} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OngletCours({ chapitre, suite }: { chapitre: Chapitre; suite: () => void }) {
  const majCours = useLuno((s) => s.majCours);
  const fichier = useRef<HTMLInputElement>(null);
  const mots = chapitre.cours.trim() ? chapitre.cours.trim().split(/\s+/).length : 0;

  return (
    <Carte>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14.5px] text-muted">
          Colle ton cours ici, ou importe un fichier texte. Il sert de base aux flashcards, à la fiche et
          aux exercices.
        </p>
        <input
          ref={fichier}
          type="file"
          accept=".txt,.md,text/plain"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) majCours(chapitre.id, await f.text());
            e.target.value = "";
          }}
        />
        <Bouton variante="contour" onClick={() => fichier.current?.click()}>
          <Upload size={16} /> Importer (.txt, .md)
        </Bouton>
      </div>
      <textarea
        className={classeSaisie + " min-h-[360px] resize-y font-[450] leading-relaxed"}
        placeholder={"Exemple :\n\nI. Nombre dérivé\nNombre dérivé : limite du taux de variation quand h tend vers 0.\n…"}
        value={chapitre.cours}
        onChange={(e) => majCours(chapitre.id, e.target.value)}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] text-muted">
          {mots} mot{mots > 1 ? "s" : ""} · enregistré automatiquement
        </span>
        <Bouton variante="doux" disabled={!mots} onClick={suite}>
          <Sparkles size={16} /> Créer des flashcards
        </Bouton>
      </div>
      <p className="mt-3 text-[12.5px] text-muted">
        L&apos;import de PDF et de photos de cours arrivera avec l&apos;IA.
      </p>
    </Carte>
  );
}

function OngletFlashcards({
  chapitre,
  matiere,
  versCours,
}: {
  chapitre: Chapitre;
  matiere: Matiere;
  versCours: () => void;
}) {
  const s = useLuno();
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState("");
  const [revision, setRevision] = useState(false);
  const [ajout, setAjout] = useState(false);
  const [recto, setRecto] = useState("");
  const [verso, setVerso] = useState("");
  const cartes = chapitre.flashcards;
  const acquises = cartes.filter((c) => c.niveau === 2).length;

  const generer = async () => {
    setEnCours(true);
    setMessage("");
    const avant = cartes.length;
    const nouvelles = await genererFlashcards(chapitre.cours);
    s.ajouterFlashcards(chapitre.id, nouvelles);
    const apres = useLuno.getState().chapitres.find((c) => c.id === chapitre.id)?.flashcards.length ?? avant;
    setMessage(
      apres > avant
        ? `${apres - avant} flashcard(s) ajoutée(s).`
        : MODE_IA === "demo"
          ? "Aucune nouvelle définition trouvée. En mode démo, seules les lignes « Terme : définition » sont repérées."
          : "Aucune nouvelle définition trouvée.",
    );
    setEnCours(false);
  };

  if (revision && cartes.length > 0) {
    return <Revision chapitre={chapitre} couleur={matiere.couleur} terminer={() => setRevision(false)} />;
  }

  return (
    <div>
      <Carte className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[17px] font-bold">
              Flashcards sur les définitions {MODE_IA === "demo" && <BadgeDemo />}
            </p>
            <p className="mt-0.5 text-[14px] text-muted">
              {cartes.length === 0
                ? "Génère des cartes à partir de ton cours, ou ajoute-les à la main."
                : `${acquises} acquise(s) sur ${cartes.length}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Bouton variante="contour" onClick={() => setAjout(true)}>
              <Plus size={16} /> Ajouter
            </Bouton>
            {chapitre.cours.trim() ? (
              <Bouton variante="doux" onClick={generer} disabled={enCours}>
                <Sparkles size={16} /> Générer depuis le cours
              </Bouton>
            ) : (
              <Bouton variante="doux" onClick={versCours}>
                Ajouter le cours d&apos;abord
              </Bouton>
            )}
            <Bouton onClick={() => setRevision(true)} disabled={cartes.length === 0}>
              <Play size={16} /> Réviser
            </Bouton>
          </div>
        </div>
        {cartes.length > 0 && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-ok"
              animate={{ width: `${(acquises / cartes.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        )}
        {message && <p className="mt-3 text-[13.5px] text-muted">{message}</p>}
      </Carte>

      {enCours ? (
        <Chargement texte="Lecture du cours et repérage des définitions…" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence initial={false}>
            {cartes.map((c, i) => (
              <motion.div
                layout
                key={c.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="group relative rounded-2xl border border-line bg-surface p-4 shadow-card"
              >
                <span
                  className="absolute left-0 top-4 h-6 w-1 rounded-r-full"
                  style={{ background: c.niveau === 2 ? "var(--color-ok)" : c.niveau === 1 ? "var(--color-bad)" : "var(--color-line)" }}
                />
                <p className="pr-8 text-[15.5px] font-bold">{c.recto}</p>
                <p className="mt-1 text-[14px] leading-snug text-muted">{c.verso}</p>
                <button
                  aria-label="Supprimer la carte"
                  onClick={() => s.supprimerFlashcard(chapitre.id, c.id)}
                  className="absolute right-3 top-3 rounded-lg p-1.5 text-muted opacity-0 transition-all hover:bg-bad/10 hover:text-bad focus:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Fenetre ouverte={ajout} fermer={() => setAjout(false)} titre="Nouvelle flashcard">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!recto.trim() || !verso.trim()) return;
            s.ajouterFlashcards(chapitre.id, [{ recto: recto.trim(), verso: verso.trim() }]);
            setRecto("");
            setVerso("");
            setAjout(false);
          }}
        >
          <Champ label="Recto (terme ou question)">
            <input autoFocus required className={classeSaisie} value={recto} onChange={(e) => setRecto(e.target.value)} />
          </Champ>
          <Champ label="Verso (définition ou réponse)">
            <textarea required rows={3} className={classeSaisie} value={verso} onChange={(e) => setVerso(e.target.value)} />
          </Champ>
          <Bouton type="submit" className="self-end">
            Ajouter
          </Bouton>
        </form>
      </Fenetre>
    </div>
  );
}

function OngletFiche({
  chapitre,
  matiere,
  versCours,
}: {
  chapitre: Chapitre;
  matiere: Matiere;
  versCours: () => void;
}) {
  const majFiche = useLuno((s) => s.majFiche);
  const [taille, setTaille] = useState(chapitre.fiche?.taille ?? 3);
  const [enCours, setEnCours] = useState(false);
  const fiche = chapitre.fiche;
  const foncee = `color-mix(in oklab, ${matiere.couleur} 65%, black)`;

  const generer = async () => {
    setEnCours(true);
    majFiche(chapitre.id, await genererFiche(chapitre.cours, taille));
    setEnCours(false);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <Carte className="h-fit">
        <p className="flex items-center gap-2 text-[17px] font-bold">
          Taille de la fiche {MODE_IA === "demo" && <BadgeDemo />}
        </p>
        <div className="mt-5 flex items-baseline justify-between">
          <motion.span
            key={taille}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-[28px] font-bold text-accent"
          >
            {TAILLES[taille - 1]}
          </motion.span>
          <span className="text-[13px] text-muted">{taille} / 5</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={taille}
          aria-label="Taille de la fiche"
          onChange={(e) => setTaille(Number(e.target.value))}
          className="luno-range mt-4"
          style={{ "--fill": `${((taille - 1) / 4) * 100}%` } as React.CSSProperties}
        />
        <div className="mt-2 flex justify-between text-[12px] text-muted">
          <span>L&apos;essentiel</span>
          <span>Tout le cours</span>
        </div>
        {chapitre.cours.trim() ? (
          <Bouton className="mt-6 w-full" onClick={generer} disabled={enCours}>
            <Sparkles size={16} /> {fiche ? "Régénérer la fiche" : "Générer la fiche"}
          </Bouton>
        ) : (
          <Bouton className="mt-6 w-full" variante="doux" onClick={versCours}>
            Ajouter le cours d&apos;abord
          </Bouton>
        )}
      </Carte>

      <div>
        {enCours ? (
          <Chargement texte="Rédaction de la fiche…" />
        ) : fiche ? (
          <motion.article
            key={fiche.taille + fiche.sections.length}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card"
          >
            <div className="px-6 py-5 sm:px-8" style={{ background: pastel(matiere.couleur, 16) }}>
              <p className="text-[12.5px] font-bold uppercase tracking-widest" style={{ color: foncee }}>
                Fiche de révision · {TAILLES[fiche.taille - 1]}
              </p>
              <h2 className="mt-1 text-[28px] font-bold" style={{ color: foncee }}>
                {chapitre.titre}
              </h2>
            </div>
            <div className="flex flex-col gap-6 px-6 py-6 sm:px-8">
              {fiche.sections.map((sec, i) => (
                <motion.section
                  key={sec.titre + i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <h3 className="mb-2 flex items-center gap-2.5 text-[18px] font-bold">
                    <span
                      className="flex size-6 items-center justify-center rounded-md text-[12.5px] text-white"
                      style={{ background: matiere.couleur }}
                    >
                      {i + 1}
                    </span>
                    {sec.titre}
                  </h3>
                  <ul className="flex flex-col gap-1.5 pl-1">
                    {sec.points.map((p, k) => (
                      <li key={k} className="flex gap-2.5 text-[15px] leading-relaxed">
                        <span className="mt-[10px] size-1.5 shrink-0 rounded-full" style={{ background: matiere.couleur }} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              ))}
              {fiche.aRetenir.length > 0 && (
                <div className="rounded-2xl bg-moon/15 p-4">
                  <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-[#8a5f00]">
                    Mots-clés à retenir
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {fiche.aRetenir.map((m) => (
                      <span key={m} className="rounded-full bg-surface px-3 py-1 text-[13.5px] font-semibold shadow-card">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.article>
        ) : (
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-ink/15 p-8 text-center">
            <ScrollText size={30} className="mb-3 text-muted" />
            <p className="text-[17px] font-bold">Pas encore de fiche</p>
            <p className="mt-1 max-w-[320px] text-[14.5px] text-muted">
              Choisis une taille avec le curseur, puis génère la fiche à partir de ton cours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
