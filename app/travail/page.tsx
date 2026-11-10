"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, BookOpen, Check, ChevronRight, FileText, Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { COULEURS, EMOJIS, encre, estDue, pastel, useLuno } from "@/lib/store";
import type { Matiere } from "@/lib/types";
import { lienTravail } from "@/lib/liens";
import { Bouton, BoutonIcone, Champ, EnTete, EtatVide, Fenetre, classeSaisie, pluriel } from "@/components/ui";
import { VueChapitre } from "@/components/travail/VueChapitre";
import { Revision } from "@/components/travail/Revision";

const glisse = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Page() {
  return (
    <Suspense>
      <Travail />
    </Suspense>
  );
}

function Travail() {
  const s = useLuno();
  const router = useRouter();
  const params = useSearchParams();
  const { matieres, chapitres } = s;
  const matiere = matieres.find((m) => m.id === params.get("m")) ?? null;
  const chapitre = chapitres.find((c) => c.id === params.get("c") && c.matiereId === matiere?.id) ?? null;
  const revisionDuJour = params.get("r") === "tout";

  // Fenêtre de matière : `true` pour une création, la matière pour une modification.
  const [fenetre, setFenetre] = useState<Matiere | true | null>(null);
  const [titreChapitre, setTitreChapitre] = useState("");

  if (revisionDuJour) {
    const dues = chapitres.flatMap((c) =>
      c.flashcards.filter(estDue).map((f) => ({ chapitreId: c.id, carteId: f.id })),
    );
    return (
      <div>
        <EnTete titre="Révision du jour" sousTitre="Toutes tes cartes à revoir, toutes matières confondues." />
        {dues.length > 0 ? (
          <Revision cartes={dues} terminer={() => router.push("/")} />
        ) : (
          <EtatVide
            icone={<Check size={26} />}
            titre="Rien à revoir aujourd'hui"
            texte="Tes cartes reviendront d'elles-mêmes quand il sera temps de les revoir."
            action={<Bouton onClick={() => router.push("/travail")}>Voir mes matières</Bouton>}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {chapitre && matiere ? (
          <motion.div key={chapitre.id} {...glisse}>
            <VueChapitre matiere={matiere} chapitre={chapitre} onglet={params.get("o")} />
          </motion.div>
        ) : matiere ? (
          <motion.div key={matiere.id} {...glisse}>
            <Link
              href="/travail"
              className="-ml-1 mb-2 inline-flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} /> Toutes les matières
            </Link>
            <div
              className="mb-6 flex items-start justify-between gap-3 rounded-[18px] p-6 sm:p-8"
              style={{ background: pastel(matiere.couleur, 16) }}
            >
              <div className="min-w-0">
                <div className="text-[44px] leading-none">{matiere.emoji}</div>
                <h1 className="mt-3 text-[34px] leading-tight sm:text-[44px]" style={{ color: encre(matiere.couleur) }}>
                  {matiere.nom}
                </h1>
                <p className="mt-1 text-[15px] text-ink/70">
                  {pluriel(chapitres.filter((c) => c.matiereId === matiere.id).length, "chapitre")}
                </p>
              </div>
              <div className="flex shrink-0">
                <BoutonIcone label="Modifier la matière" className="!text-ink/70" onClick={() => setFenetre(matiere)}>
                  <Pencil size={17} />
                </BoutonIcone>
                <BoutonIcone
                  label="Supprimer la matière"
                  className="!text-ink/70 hover:!text-bad"
                  onClick={() => {
                    s.supprimerMatiere(matiere.id);
                    router.replace("/travail");
                  }}
                >
                  <Trash2 size={17} />
                </BoutonIcone>
              </div>
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
                aria-label="Titre du nouveau chapitre"
                className={classeSaisie + " !bg-surface"}
                placeholder="Titre du nouveau chapitre"
                value={titreChapitre}
                onChange={(e) => setTitreChapitre(e.target.value)}
              />
              <Bouton type="submit" className="shrink-0" disabled={!titreChapitre.trim()}>
                <Plus size={17} /> Ajouter
              </Bouton>
            </form>

            <div className="flex flex-col gap-3">
              {chapitres
                .filter((c) => c.matiereId === matiere.id)
                .map((c, i) => {
                  const dues = c.flashcards.filter(estDue).length;
                  return (
                    <motion.div key={c.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ x: 4 }}>
                      <Link
                        href={lienTravail({ m: matiere.id, c: c.id })}
                        className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5"
                      >
                        <span
                          className="flex size-11 shrink-0 items-center justify-center rounded-xl font-display text-[18px]"
                          style={{ background: pastel(matiere.couleur, 16), color: encre(matiere.couleur) }}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[17px] font-semibold">{c.titre}</span>
                          <span className="mt-0.5 flex flex-wrap gap-x-4 text-[13px] text-muted">
                            <span className="flex items-center gap-1">
                              <FileText size={13} /> {c.cours.trim() ? "Cours ajouté" : "Pas de cours"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers size={13} /> {pluriel(c.flashcards.length, "flashcard")}
                            </span>
                          </span>
                        </span>
                        {dues > 0 && (
                          <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">
                            {dues} à revoir
                          </span>
                        )}
                        <ChevronRight size={20} className="shrink-0 text-muted transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  );
                })}
              {chapitres.every((c) => c.matiereId !== matiere.id) && (
                <p className="rounded-2xl border border-dashed border-ink/20 p-6 text-center text-[14.5px] text-muted">
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
                <Bouton onClick={() => setFenetre(true)}>
                  <Plus size={17} /> Nouvelle matière
                </Bouton>
              }
            />
            {matieres.length === 0 ? (
              <EtatVide
                icone={<BookOpen size={26} />}
                titre="Aucune matière"
                texte="Crée ta première matière, ou charge l'exemple pour découvrir le site : tu pourras l'effacer en un geste."
                action={
                  <>
                    <Bouton onClick={() => setFenetre(true)}>Créer une matière</Bouton>
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
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={lienTravail({ m: m.id })}
                        className="relative block overflow-hidden rounded-[18px] p-6 shadow-card transition-shadow hover:shadow-pop"
                        style={{ background: pastel(m.couleur, 15) }}
                      >
                        <span
                          className="absolute -right-8 -top-8 size-32 rounded-full opacity-25"
                          style={{ background: m.couleur }}
                        />
                        <span className="relative block text-[38px] leading-none">{m.emoji}</span>
                        <span
                          className="relative mt-10 block font-display text-[24px] leading-tight"
                          style={{ color: encre(m.couleur) }}
                        >
                          {m.nom}
                        </span>
                        <span className="relative mt-1 block text-[13.5px] text-ink/70">
                          {pluriel(chaps.length, "chapitre")} · {pluriel(nbCartes, "flashcard")}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {fenetre && (
        <FenetreMatiere
          key={fenetre === true ? "nouvelle" : fenetre.id}
          matiere={fenetre === true ? null : fenetre}
          fermer={() => setFenetre(null)}
        />
      )}
    </>
  );
}

function FenetreMatiere({ matiere, fermer }: { matiere: Matiere | null; fermer: () => void }) {
  const ajouter = useLuno((s) => s.ajouterMatiere);
  const modifier = useLuno((s) => s.modifierMatiere);
  const [nom, setNom] = useState(matiere?.nom ?? "");
  const [couleur, setCouleur] = useState(matiere?.couleur ?? COULEURS[0]);
  const [emoji, setEmoji] = useState(matiere?.emoji ?? EMOJIS[0]);

  return (
    <Fenetre ouverte fermer={fermer} titre={matiere ? "Modifier la matière" : "Nouvelle matière"}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!nom.trim()) return;
          const m = { nom: nom.trim(), couleur, emoji };
          if (matiere) modifier(matiere.id, m);
          else ajouter(m);
          fermer();
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
        <div>
          <span className="mb-1.5 block text-[13px] font-semibold text-muted">Couleur</span>
          <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Couleur">
            {COULEURS.map((c, i) => (
              <button
                type="button"
                key={c}
                role="radio"
                aria-checked={couleur === c}
                aria-label={`Couleur ${i + 1}`}
                onClick={() => setCouleur(c)}
                className="flex size-11 items-center justify-center rounded-full"
              >
                <span
                  className="size-8 rounded-full transition-transform"
                  style={{
                    background: c,
                    boxShadow: couleur === c ? `0 0 0 3px var(--surface), 0 0 0 5px ${c}` : undefined,
                    transform: couleur === c ? "scale(1.05)" : undefined,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-[13px] font-semibold text-muted">Symbole</span>
          <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Symbole">
            {EMOJIS.map((e) => (
              <button
                type="button"
                key={e}
                role="radio"
                aria-checked={emoji === e}
                aria-label={`Symbole ${e}`}
                onClick={() => setEmoji(e)}
                className={`size-11 rounded-xl text-[20px] transition-all ${
                  emoji === e ? "bg-accent-soft ring-2 ring-accent" : "hover:bg-ink/5"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <Bouton type="submit" className="mt-1 self-end">
          {matiere ? "Enregistrer" : "Créer"}
        </Bouton>
      </form>
    </Fenetre>
  );
}
