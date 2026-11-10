"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, BookOpen, ChevronRight, FileText, Layers, Plus, Trash2 } from "lucide-react";
import { COULEURS, EMOJIS, pastel, useLuno } from "@/lib/store";
import { Bouton, Champ, EnTete, EtatVide, Fenetre, classeSaisie } from "@/components/ui";
import { VueChapitre } from "@/components/travail/VueChapitre";

const glisse = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Travail() {
  const s = useLuno();
  const { matieres, chapitres, selection, ouvrir } = s;
  const matiere = matieres.find((m) => m.id === selection.matiereId) ?? null;
  const chapitre = chapitres.find((c) => c.id === selection.chapitreId && c.matiereId === matiere?.id) ?? null;

  const [fenetreMatiere, setFenetreMatiere] = useState(false);
  const [nom, setNom] = useState("");
  const [couleur, setCouleur] = useState(COULEURS[0]);
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [titreChapitre, setTitreChapitre] = useState("");

  return (
    <AnimatePresence mode="wait" initial={false}>
      {chapitre && matiere ? (
        <motion.div key={chapitre.id} {...glisse}>
          <VueChapitre matiere={matiere} chapitre={chapitre} retour={() => ouvrir(matiere.id)} />
        </motion.div>
      ) : matiere ? (
        <motion.div key={matiere.id} {...glisse}>
          <button
            onClick={() => ouvrir(null)}
            className="mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} /> Toutes les matières
          </button>
          <div
            className="mb-8 flex flex-wrap items-end justify-between gap-4 rounded-[18px] p-6 sm:p-8"
            style={{ background: pastel(matiere.couleur, 16) }}
          >
            <div>
              <div className="text-[44px] leading-none">{matiere.emoji}</div>
              <h1
                className="mt-3 text-[36px] font-bold leading-tight sm:text-[44px]"
                style={{ color: `color-mix(in oklab, ${matiere.couleur} 65%, var(--mix-fg))` }}
              >
                {matiere.nom}
              </h1>
              <p className="mt-1 text-[15px] text-ink/60">
                {chapitres.filter((c) => c.matiereId === matiere.id).length} chapitre(s)
              </p>
            </div>
            <Bouton
              variante="fantome"
              className="!text-bad"
              onClick={() => {
                if (confirm(`Supprimer « ${matiere.nom} » avec ses chapitres et ses DST ?`)) {
                  s.supprimerMatiere(matiere.id);
                  ouvrir(null);
                }
              }}
            >
              <Trash2 size={16} /> Supprimer la matière
            </Bouton>
          </div>

          <form
            className="mb-5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!titreChapitre.trim()) return;
              s.ajouterChapitre(matiere.id, titreChapitre.trim());
              setTitreChapitre("");
            }}
          >
            <input
              className={classeSaisie + " !bg-surface"}
              placeholder="Titre du nouveau chapitre"
              value={titreChapitre}
              onChange={(e) => setTitreChapitre(e.target.value)}
            />
            <Bouton type="submit" className="shrink-0">
              <Plus size={17} /> Ajouter
            </Bouton>
          </form>

          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {chapitres
                .filter((c) => c.matiereId === matiere.id)
                .map((c, i) => (
                  <motion.button
                    layout
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    whileHover={{ x: 4 }}
                    onClick={() => ouvrir(matiere.id, c.id)}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 text-left shadow-card sm:p-5"
                  >
                    <span
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl font-display text-[18px] font-bold"
                      style={{ background: pastel(matiere.couleur, 16), color: matiere.couleur }}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[17px] font-bold">{c.titre}</span>
                      <span className="mt-0.5 flex flex-wrap gap-x-4 text-[13px] text-muted">
                        <span className="flex items-center gap-1">
                          <FileText size={13} /> {c.cours.trim() ? "Cours ajouté" : "Pas de cours"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers size={13} /> {c.flashcards.length} flashcard(s)
                        </span>
                      </span>
                    </span>
                    <ChevronRight size={20} className="text-muted transition-transform group-hover:translate-x-1" />
                  </motion.button>
                ))}
            </AnimatePresence>
            {chapitres.every((c) => c.matiereId !== matiere.id) && (
              <p className="rounded-2xl border border-dashed border-ink/15 p-6 text-center text-[14.5px] text-muted">
                Aucun chapitre pour l&apos;instant. Ajoute le premier ci-dessus.
              </p>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div key="matieres" {...glisse}>
          <EnTete
            titre="Travail"
            sousTitre="Tes matières, leurs chapitres, tes cours, flashcards et fiches."
            action={
              <Bouton onClick={() => setFenetreMatiere(true)}>
                <Plus size={17} /> Nouvelle matière
              </Bouton>
            }
          />
          {matieres.length === 0 ? (
            <EtatVide
              icone={<BookOpen size={26} />}
              titre="Aucune matière"
              texte="Crée ta première matière, ou charge l'exemple pour découvrir le site."
              action={
                <>
                  <Bouton onClick={() => setFenetreMatiere(true)}>Créer une matière</Bouton>
                  <Bouton variante="contour" onClick={s.chargerExemple}>
                    Charger l&apos;exemple
                  </Bouton>
                </>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matieres.map((m, i) => {
                const chaps = chapitres.filter((c) => c.matiereId === m.id);
                const nbCartes = chaps.reduce((n, c) => n + c.flashcards.length, 0);
                return (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => ouvrir(m.id)}
                    className="relative overflow-hidden rounded-[18px] p-6 text-left shadow-card transition-shadow hover:shadow-pop"
                    style={{ background: pastel(m.couleur, 15) }}
                  >
                    <span
                      className="absolute -right-8 -top-8 size-32 rounded-full opacity-25"
                      style={{ background: m.couleur }}
                    />
                    <span className="relative block text-[38px] leading-none">{m.emoji}</span>
                    <span
                      className="relative mt-12 block font-display text-[24px] font-bold leading-tight"
                      style={{ color: `color-mix(in oklab, ${m.couleur} 65%, var(--mix-fg))` }}
                    >
                      {m.nom}
                    </span>
                    <span className="relative mt-1 block text-[13.5px] text-ink/60">
                      {chaps.length} chapitre(s) · {nbCartes} flashcard(s)
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          <Fenetre ouverte={fenetreMatiere} fermer={() => setFenetreMatiere(false)} titre="Nouvelle matière">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!nom.trim()) return;
                s.ajouterMatiere({ nom: nom.trim(), couleur, emoji });
                setNom("");
                setFenetreMatiere(false);
              }}
            >
              <Champ label="Nom">
                <input
                  autoFocus
                  required
                  className={classeSaisie}
                  placeholder="Ex. Mathématiques"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </Champ>
              <Champ label="Couleur">
                <div className="flex flex-wrap gap-2.5">
                  {COULEURS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      aria-label={`Couleur ${c}`}
                      onClick={() => setCouleur(c)}
                      className="size-9 rounded-full transition-transform hover:scale-110"
                      style={{
                        background: c,
                        boxShadow: couleur === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : undefined,
                      }}
                    />
                  ))}
                </div>
              </Champ>
              <Champ label="Symbole">
                <div className="flex flex-wrap gap-1.5">
                  {EMOJIS.map((e) => (
                    <button
                      type="button"
                      key={e}
                      onClick={() => setEmoji(e)}
                      className={`size-10 rounded-xl text-[20px] transition-all ${
                        emoji === e ? "scale-110 bg-accent-soft ring-2 ring-accent" : "hover:bg-ink/5"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </Champ>
              <Bouton type="submit" className="mt-1 self-end">
                Créer
              </Bouton>
            </form>
          </Fenetre>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
