"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  FileText,
  Layers,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { COULEURS, EMOJIS, encre, estDue, pastel, useLuno } from "@/lib/store";
import type { Matiere } from "@/lib/types";
import { lienTravail } from "@/lib/liens";
import { classePastille, usePastille } from "@/lib/pastille";
import {
  Bouton,
  BoutonIcone,
  Champ,
  EnTete,
  EtatVide,
  Fenetre,
  classeSaisie,
  pluriel,
} from "@/components/ui";
import { VueChapitre } from "@/components/travail/VueChapitre";
import { Revision } from "@/components/travail/Revision";
import { VueErreurs } from "@/components/travail/Erreurs";
import { Emoji } from "@/components/Emoji";

const glisse = {
  // En `transform` plutôt qu'en x : le navigateur l'anime seul, sans le fil principal.
  initial: { opacity: 0, transform: "translate3d(24px, 0, 0)" },
  animate: { opacity: 1, transform: "translate3d(0px, 0, 0)" },
  exit: { opacity: 0, transform: "translate3d(-24px, 0, 0)" },
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
  const chapitre =
    chapitres.find(
      (c) => c.id === params.get("c") && c.matiereId === matiere?.id,
    ) ?? null;
  const revisionDuJour = params.get("r") === "tout";
  const ongletMatiere = params.get("o") === "erreurs" ? "erreurs" : "chapitres";
  const { conteneur: ongletsMatiereConteneur, pastille: ongletsMatierePastille } = usePastille(`${matiere?.id}-${ongletMatiere}`);

  // Fenêtre de matière : `true` pour une création, la matière pour une modification.
  const [fenetre, setFenetre] = useState<Matiere | true | null>(null);
  const [titreChapitre, setTitreChapitre] = useState("");

  if (revisionDuJour) {
    const dues = chapitres.flatMap((c) =>
      c.flashcards
        .filter(estDue)
        .map((f) => ({ chapitreId: c.id, carteId: f.id })),
    );
    return (
      <div>
        <EnTete
          titre="Révision du jour"
          sousTitre="Toutes tes cartes à revoir, toutes matières confondues."
        />
        {dues.length > 0 ? (
          <Revision cartes={dues} terminer={() => router.push("/")} />
        ) : (
          <EtatVide
            icone={<Check size={26} />}
            titre="Rien à revoir aujourd'hui"
            texte="Tes cartes reviendront d'elles-mêmes quand il sera temps de les revoir."
            action={
              <Bouton onClick={() => router.push("/travail")}>
                Voir mes matières
              </Bouton>
            }
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
            <VueChapitre
              matiere={matiere}
              chapitre={chapitre}
              onglet={params.get("o")}
            />
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
              data-aligne-panneau
              className="mb-6 flex items-start justify-between gap-3 rounded-[18px] p-6 sm:p-8"
              style={{ background: pastel(matiere.couleur, 16) }}
            >
              <div className="min-w-0">
                <div className="text-[44px] leading-none"><Emoji e={matiere.emoji} /></div>
                <h1
                  className="mt-3 text-[34px] leading-tight sm:text-[44px]"
                  style={{ color: encre(matiere.couleur) }}
                >
                  {matiere.nom}
                </h1>
                <p className="mt-1 text-[15px] text-ink/70">
                  {pluriel(
                    chapitres.filter((c) => c.matiereId === matiere.id).length,
                    "chapitre",
                  )}
                </p>
              </div>
              <div className="flex shrink-0">
                <BoutonIcone
                  label="Modifier la matière"
                  className="!text-ink/70"
                  onClick={() => setFenetre(matiere)}
                >
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

            <div
              role="tablist"
              aria-label="Contenu de la matière"
              ref={ongletsMatiereConteneur}
              className="relative mb-5 inline-flex rounded-full border border-line bg-surface p-1 shadow-card"
            >
              <span ref={ongletsMatierePastille} className={`${classePastille} rounded-full bg-ink`} />
              {[
                { id: "chapitres", label: "Chapitres" },
                {
                  id: "erreurs",
                  label: `Mes erreurs${
                    s.erreurs.some((e) => e.matiereId === matiere.id)
                      ? ` (${s.erreurs.filter((e) => e.matiereId === matiere.id).length})`
                      : ""
                  }`,
                },
              ].map((o) => {
                const actif = ongletMatiere === o.id;
                return (
                  <button
                    key={o.id}
                    role="tab"
                    aria-selected={actif}
                    data-actif={actif}
                    onClick={() =>
                      router.replace(
                        lienTravail({ m: matiere.id, o: o.id === "erreurs" ? "erreurs" : undefined }),
                        { scroll: false },
                      )
                    }
                    className={`relative min-h-10 rounded-full px-4 text-[14.5px] font-semibold transition-colors duration-300 ${
                      actif ? "text-bg" : "text-muted hover:text-ink"
                    }`}
                  >
                    <span className="relative">{o.label}</span>
                  </button>
                );
              })}
            </div>

            {params.get("o") === "erreurs" ? (
              <VueErreurs matiere={matiere} />
            ) : (
            <>
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
              <Bouton
                type="submit"
                className="shrink-0"
                disabled={!titreChapitre.trim()}
              >
                <Plus size={17} /> Ajouter
              </Bouton>
            </form>

            <div className="flex flex-col gap-3">
              {chapitres
                .filter((c) => c.matiereId === matiere.id)
                .map((c, i) => {
                  const dues = c.flashcards.filter(estDue).length;
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
                      animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                      whileHover={{ x: 4 }}
                    >
                      <Link
                        href={lienTravail({ m: matiere.id, c: c.id })}
                        className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5"
                      >
                        <span
                          className="flex size-11 shrink-0 items-center justify-center rounded-xl font-display text-[18px]"
                          style={{
                            background: pastel(matiere.couleur, 16),
                            color: encre(matiere.couleur),
                          }}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[17px] font-semibold">
                            {c.titre}
                          </span>
                          <span className="mt-0.5 flex flex-wrap gap-x-4 text-[13px] text-muted">
                            <span className="flex items-center gap-1">
                              <FileText size={13} />{" "}
                              {c.documents.length > 0
                                ? pluriel(c.documents.length, "document")
                                : c.cours.trim()
                                  ? "Cours ajouté"
                                  : "Pas de cours"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers size={13} />{" "}
                              {pluriel(c.flashcards.length, "flashcard")}
                            </span>
                          </span>
                        </span>
                        {dues > 0 && (
                          <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">
                            {dues} à revoir
                          </span>
                        )}
                        <ChevronRight
                          size={20}
                          className="shrink-0 text-muted transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              {chapitres.every((c) => c.matiereId !== matiere.id) && (
                <p className="rounded-2xl border border-dashed border-ink/20 p-6 text-center text-[14.5px] text-muted">
                  Aucun chapitre pour l&apos;instant. Ajoute le premier
                  ci-dessus.
                </p>
              )}
            </div>
            </>
            )}
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
                texte="Crée ta première matière. Les chapitres publiés apparaissent aussi ici tout seuls."
                action={
                  <>
                    <Bouton onClick={() => setFenetre(true)}>
                      Créer une matière
                    </Bouton>
                  </>
                }
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {matieres.map((m, i) => {
                  const chaps = chapitres.filter((c) => c.matiereId === m.id);
                  const nbCartes = chaps.reduce(
                    (n, c) => n + c.flashcards.length,
                    0,
                  );
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, transform: "translate3d(0, 16px, 0)" }}
                      animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={lienTravail({ m: m.id })}
                        className="relative block h-full overflow-hidden rounded-[18px] p-4 shadow-card transition-shadow hover:shadow-pop sm:p-6"
                        style={{ background: pastel(m.couleur, 15) }}
                      >
                        <span
                          className="absolute -right-8 -top-8 size-24 rounded-full opacity-25 sm:size-32"
                          style={{ background: m.couleur }}
                        />
                        <span className="relative block text-[30px] leading-none sm:text-[38px]">
                          <Emoji e={m.emoji} />
                        </span>
                        <span
                          className="relative mt-6 block hyphens-auto break-words font-display text-[18px] leading-tight sm:mt-10 sm:text-[24px]"
                          style={{ color: encre(m.couleur) }}
                        >
                          {m.nom}
                        </span>
                        <span className="relative mt-1 block text-[12.5px] text-ink/70 sm:text-[13.5px]">
                          {pluriel(chaps.length, "chapitre")}
                          <span className="hidden sm:inline">
                            {" "}
                            · {pluriel(nbCartes, "flashcard")}
                          </span>
                          <span className="block sm:hidden">
                            {pluriel(nbCartes, "flashcard")}
                          </span>
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

function FenetreMatiere({
  matiere,
  fermer,
}: {
  matiere: Matiere | null;
  fermer: () => void;
}) {
  const ajouter = useLuno((s) => s.ajouterMatiere);
  const modifier = useLuno((s) => s.modifierMatiere);
  const [nom, setNom] = useState(matiere?.nom ?? "");
  const [couleur, setCouleur] = useState(matiere?.couleur ?? COULEURS[0]);
  const [emoji, setEmoji] = useState(matiere?.emoji ?? EMOJIS[0]);

  return (
    <Fenetre
      ouverte
      fermer={fermer}
      titre={matiere ? "Modifier la matière" : "Nouvelle matière"}
    >
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
          <span className="mb-1.5 block text-[13px] font-semibold text-muted">
            Couleur
          </span>
          <div
            className="flex flex-wrap gap-1"
            role="radiogroup"
            aria-label="Couleur"
          >
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
                    boxShadow:
                      couleur === c
                        ? `0 0 0 3px var(--surface), 0 0 0 5px ${c}`
                        : undefined,
                    transform: couleur === c ? "scale(1.05)" : undefined,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-[13px] font-semibold text-muted">
            Symbole
          </span>
          <div
            className="flex flex-wrap gap-1"
            role="radiogroup"
            aria-label="Symbole"
          >
            {EMOJIS.map((e) => (
              <button
                type="button"
                key={e}
                role="radio"
                aria-checked={emoji === e}
                aria-label={e === "🇬🇧" ? "Drapeau britannique" : e === "🇪🇸" ? "Drapeau espagnol" : `Symbole ${e}`}
                onClick={() => setEmoji(e)}
                className={`size-11 rounded-xl text-[20px] transition-all ${
                  emoji === e
                    ? "bg-accent-soft ring-2 ring-accent"
                    : "hover:bg-ink/5"
                }`}
              >
                <Emoji e={e} />
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
