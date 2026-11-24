"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ZoneDictee } from "@/components/Dictee";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  BookMarked,
  CalendarClock,
  FileDown,
  FileText,
  Layers,
  Pencil,
  Play,
  Plus,
  ScrollText,
  Search,
  ClipboardCheck,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import type { Chapitre, Flashcard, Matiere } from "@/lib/types";
import { encre, estDue, pastel, useLuno } from "@/lib/store";
import { demandeCours, repererDefinitions } from "@/lib/contenu";
import { joursAvant } from "@/lib/dates";
import { lienFichier, lienTravail } from "@/lib/liens";
import { LienPdf } from "@/components/LecteurPdf";
import {
  Bouton,
  BoutonIcone,
  Carte,
  Champ,
  EnvoyerAClaude,
  EtatVide,
  Fenetre,
  classeSaisie,
  pluriel,
} from "@/components/ui";
import { Revision, type CarteARevoir } from "./Revision";
import { formule } from "@/components/Formule";
import { DessinSchema } from "@/components/Schema";
import { Curseur } from "@/components/Curseur";
import { OngletDefinitions } from "./Definitions";
import { OngletDates } from "./Dates";
import { OngletExosTypes, exosTypesDe } from "./ExosTypes";
import { ZoneExplicable } from "./Explications";
import { Illustration } from "@/components/Illustration";
import { classePastille, usePastille } from "@/lib/pastille";
import { Emoji } from "@/components/Emoji";

const ONGLETS = [
  { id: "cours", label: "Cours", icone: FileText },
  { id: "defs", label: "Déf", icone: BookMarked },
  { id: "dates", label: "Dates", icone: CalendarClock },
  { id: "flashcards", label: "Flashcards", icone: Layers },
  { id: "fiche", label: "Fiche", icone: ScrollText },
  { id: "exos", label: "Exos types", icone: ClipboardCheck },
] as const;
type Onglet = (typeof ONGLETS)[number]["id"];

const TAILLES = ["Express", "Courte", "Standard", "Détaillée", "Complète"];

export function VueChapitre({
  matiere,
  chapitre,
  onglet: ongletDemande,
}: {
  matiere: Matiere;
  chapitre: Chapitre;
  onglet: string | null;
}) {
  const s = useLuno();
  const router = useRouter();
  // Pas de définitions dans ce chapitre : pas d'onglet Déf (demandé le 2026-11-12).
  // Onglet Dates : seulement si le chapitre en a (matières non scientifiques).
  const onglets = ONGLETS.filter(
    (o) =>
      (o.id !== "defs" || (chapitre.definitions?.length ?? 0) > 0) &&
      (o.id !== "dates" || (chapitre.dates?.length ?? 0) > 0) &&
      // Exos types : chapitres scientifiques qui en ont (contenu/exos-types.ts).
      (o.id !== "exos" || exosTypesDe(chapitre) !== undefined),
  );
  const onglet: Onglet = onglets.some((o) => o.id === ongletDemande)
    ? (ongletDemande as Onglet)
    : "cours";
  const setOnglet = (o: Onglet) =>
    router.replace(lienTravail({ m: matiere.id, c: chapitre.id, o }), {
      scroll: false,
    });
  const [renommer, setRenommer] = useState(false);
  const [titre, setTitre] = useState(chapitre.titre);
  const [envoi, setEnvoi] = useState(false);
  const foncee = encre(matiere.couleur);

  // Flèches gauche et droite pour passer d'un onglet à l'autre.
  const surTouche = (e: React.KeyboardEvent) => {
    const i = onglets.findIndex((o) => o.id === onglet);
    const pas = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const suivant = onglets[(i + pas + onglets.length) % onglets.length].id;
    setOnglet(suivant);
    document.getElementById(`onglet-${suivant}`)?.focus();
  };

  const { conteneur: sousOngletsConteneur, pastille: sousOngletsPastille } = usePastille(onglet);
  return (
    <div>
      <Link
        href={lienTravail({ m: matiere.id })}
        className="-ml-1 mb-2 inline-flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> <Emoji e={matiere.emoji} /> {matiere.nom}
      </Link>
      <div className="mb-5 flex items-start justify-between gap-2">
        <h1 className="min-w-0 text-balance text-[25px] leading-tight sm:text-[40px]">
          {chapitre.titre}
        </h1>
        <div className="flex shrink-0">
          <BoutonIcone
            label="Renommer le chapitre"
            onClick={() => {
              setTitre(chapitre.titre);
              setRenommer(true);
            }}
          >
            <Pencil size={17} />
          </BoutonIcone>
          <BoutonIcone
            label="Supprimer le chapitre"
            className="hover:!text-bad"
            onClick={() => {
              s.supprimerChapitre(chapitre.id);
              router.replace(lienTravail({ m: matiere.id }));
            }}
          >
            <Trash2 size={17} />
          </BoutonIcone>
        </div>
      </div>

      <div
        ref={sousOngletsConteneur}
        className="relative mb-6 inline-flex max-w-full rounded-2xl border border-line bg-surface p-1 shadow-card"
        role="tablist"
        data-aligne-panneau
        aria-label="Contenu du chapitre"
        onKeyDown={surTouche}
      >
        <span
          ref={sousOngletsPastille}
          className={`${classePastille} rounded-xl`}
          style={{ background: pastel(matiere.couleur, 18) }}
        />
        {onglets.map(({ id, label, icone: Icone }) => (
          <button
            key={id}
            id={`onglet-${id}`}
            role="tab"
            aria-selected={onglet === id}
            data-actif={onglet === id}
            aria-controls="panneau-chapitre"
            tabIndex={onglet === id ? 0 : -1}
            onClick={() => setOnglet(id)}
            // Cinq onglets doivent tenir à 320 px : moins de marge et pas de compteur sur petit écran.
            className="relative flex min-h-11 items-center gap-2 rounded-xl px-2.5 py-2 text-[14.5px] font-semibold transition-colors duration-300 max-[379px]:px-1.5 max-[379px]:text-[13.5px] sm:px-5"
            style={{ color: onglet === id ? foncee : "var(--muted)" }}
          >
            <Icone size={16} className="relative hidden sm:block" />
            {/* « Exos types » devient « Exos » sur petit écran : cinq onglets tiennent à 320 px. */}
            <span className="relative">
              {id === "exos" ? (
                <>
                  <span className="max-[419px]:hidden">{label}</span>
                  <span className="min-[420px]:hidden">Exos</span>
                </>
              ) : id === "fiche" && (chapitre.fiche?.decoupage?.length ?? 0) > 1 ? (
                "Fiches"
              ) : (
                label
              )}
            </span>
            {id === "flashcards" && chapitre.flashcards.length > 0 && (
              <span className="relative rounded-full bg-ink/10 px-1.5 text-[11.5px] max-[419px]:hidden">
                {chapitre.flashcards.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={onglet}
          id="panneau-chapitre"
          role="tabpanel"
          aria-labelledby={`onglet-${onglet}`}
          initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0, transform: "translate3d(0, -6px, 0)" }}
          transition={{ duration: 0.22 }}
        >
          {onglet === "cours" && (
            <OngletCours chapitre={chapitre} envoyer={() => setEnvoi(true)} />
          )}
          {/* Sélectionner un passage du cours propose « Expliquer » (demande à Claude). */}
          {onglet === "defs" && (
            <ZoneExplicable chapitre={chapitre} matiere={matiere.nom} onglet="defs">
              <OngletDefinitions
                chapitre={chapitre}
                matiere={matiere}
                envoyer={() => setEnvoi(true)}
              />
            </ZoneExplicable>
          )}
          {onglet === "dates" && (
            <ZoneExplicable chapitre={chapitre} matiere={matiere.nom} onglet="dates">
              <OngletDates chapitre={chapitre} matiere={matiere} />
            </ZoneExplicable>
          )}
          {onglet === "flashcards" && (
            <ZoneExplicable chapitre={chapitre} matiere={matiere.nom} onglet="flashcards">
              <OngletFlashcards
                chapitre={chapitre}
                envoyer={() => setEnvoi(true)}
                versCours={() => setOnglet("cours")}
              />
            </ZoneExplicable>
          )}
          {onglet === "fiche" && (
            <ZoneExplicable chapitre={chapitre} matiere={matiere.nom} onglet="fiche">
              <OngletFiche
                chapitre={chapitre}
                matiere={matiere}
                envoyer={() => setEnvoi(true)}
                versCours={() => setOnglet("cours")}
              />
            </ZoneExplicable>
          )}
          {onglet === "exos" && (
            <ZoneExplicable chapitre={chapitre} matiere={matiere.nom} onglet="exos">
              <OngletExosTypes chapitre={chapitre} matiere={matiere} />
            </ZoneExplicable>
          )}
        </motion.div>
      </AnimatePresence>

      <Fenetre
        ouverte={renommer}
        fermer={() => setRenommer(false)}
        titre="Renommer le chapitre"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!titre.trim()) return;
            s.renommerChapitre(chapitre.id, titre.trim());
            setRenommer(false);
          }}
        >
          <Champ label="Titre">
            <input
              autoFocus
              required
              className={classeSaisie}
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
            />
          </Champ>
          <Bouton type="submit" className="self-end">
            Enregistrer
          </Bouton>
        </form>
      </Fenetre>

      <EnvoyerAClaude
        ouverte={envoi}
        fermer={() => setEnvoi(false)}
        titre="Envoyer le cours à Claude"
        objet={`Cours : ${matiere.nom} · ${chapitre.titre}`}
        texte={demandeCours(matiere.nom, chapitre.titre, chapitre.cours)}
        resultat="les flashcards, la fiche de révision et les exercices"
        demande={{ type: "cours", meta: { matiere: matiere.nom, chapitre: chapitre.titre } }}
      />
    </div>
  );
}

function Documents({ chapitre }: { chapitre: Chapitre }) {
  if (chapitre.documents.length === 0) return null;
  return (
    <Carte className="mb-5">
      <p className="mb-3 text-[17px] font-semibold">Documents du prof</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {chapitre.documents.map((d) => (
          <li key={d.fichier}>
            <LienPdf
              href={lienFichier(d.fichier)}
              titre={d.titre}
              className="group flex min-h-14 items-center gap-3 rounded-xl border border-line bg-bg/50 px-3 py-2.5 transition-colors hover:border-ink/30"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <FileDown size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium leading-snug">
                  {d.titre}
                </span>
                <span className="block text-[12.5px] text-muted">
                  {d.detail ?? "PDF"}
                </span>
              </span>
            </LienPdf>
          </li>
        ))}
      </ul>
    </Carte>
  );
}

function OngletCours({
  chapitre,
  envoyer,
}: {
  chapitre: Chapitre;
  envoyer: () => void;
}) {
  const majCours = useLuno((s) => s.majCours);
  const ajouterFlashcards = useLuno((s) => s.ajouterFlashcards);
  const fichier = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const mots = chapitre.cours.trim()
    ? chapitre.cours.trim().split(/\s+/).length
    : 0;
  // Chapitre rédigé par Claude : le contenu existe déjà, les notes sont facultatives.
  const publie = Boolean(chapitre.publieId);
  const [notesOuvertes, setNotesOuvertes] = useState(!publie || mots > 0);

  const reperer = () => {
    const trouvees = repererDefinitions(chapitre.cours);
    const ajoutees = ajouterFlashcards(chapitre.id, trouvees);
    setMessage(
      ajoutees > 0
        ? `${pluriel(ajoutees, "flashcard ajoutée", "flashcards ajoutées")} dans l'onglet Flashcards.`
        : trouvees.length > 0
          ? "Ces définitions sont déjà dans tes flashcards."
          : "Aucune ligne « Terme : définition » trouvée dans ce cours.",
    );
  };

  if (!notesOuvertes)
    return (
      <>
        <Documents chapitre={chapitre} />
        <Carte className="flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-[200px] flex-1 text-[14.5px] text-muted">
            Flashcards, fiche, définitions et exercices sont déjà prêts. Tu peux ajouter tes
            propres notes sur ce chapitre.
          </p>
          <Bouton variante="contour" onClick={() => setNotesOuvertes(true)}>
            <Plus size={16} /> Ajouter mes notes
          </Bouton>
        </Carte>
      </>
    );

  return (
    <>
      <Documents chapitre={chapitre} />
      <Carte>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="min-w-[200px] flex-1 text-[14.5px] text-muted">
            {publie
              ? "Tes notes sur ce chapitre, en plus du contenu déjà prêt."
              : "Colle ton cours ici ou importe un fichier texte. Pour un PDF ou une photo, utilise le bouton « Envoyer à Claude » ci-dessous."}
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
        <ZoneDictee
          aria-label="Texte du cours"
          className={classeSaisie + " min-h-[320px] resize-y leading-relaxed"}
          placeholder={
            "Exemple :\n\nI. Nombre dérivé\nNombre dérivé : limite du taux de variation quand h tend vers 0.\n…"
          }
          value={chapitre.cours}
          changer={(v) => majCours(chapitre.id, v)}
        />
        <p className="mt-2 text-[13px] text-muted">
          {pluriel(mots, "mot")} · enregistré automatiquement
        </p>

        {!publie && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-accent-soft p-4">
            <p className="text-[15px] font-semibold">
              Flashcards, fiche et exercices
            </p>
            <p className="mt-0.5 text-[13.5px] text-ink/75">
              Claude les rédige à partir de ton cours et les ajoute au site.
            </p>
            <Bouton className="mt-3" onClick={envoyer}>
              <Send size={16} /> Envoyer à Claude
            </Bouton>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="text-[15px] font-semibold">Flashcards rapides</p>
            <p className="mt-0.5 text-[13.5px] text-muted">
              Transforme en flashcards les lignes écrites « Terme : définition
              ».
            </p>
            <Bouton
              variante="contour"
              className="mt-3"
              onClick={() => (mots ? reperer() : setMessage("Écris ou colle d'abord ton cours dans le champ ci-dessus."))}
            >
              <Search size={16} /> Repérer les définitions
            </Bouton>
          </div>
        </div>
        )}
        {message && (
          <p role="status" className="mt-3 text-[14px] text-ink">
            {message}
          </p>
        )}
      </Carte>
    </>
  );
}

function prochaineRevue(c: Flashcard): string {
  // Suspendue depuis une révision : réactivable dans les statistiques.
  if (c.suspendue) return "Suspendue";
  if (estDue(c)) return c.niveau === 0 ? "Nouvelle" : "À revoir";
  const j = joursAvant(c.echeance);
  return j === 1 ? "Revue demain" : `Revue dans ${j} j`;
}

function OngletFlashcards({
  chapitre,
  envoyer,
  versCours,
}: {
  chapitre: Chapitre;
  envoyer: () => void;
  versCours: () => void;
}) {
  const s = useLuno();
  const [seance, setSeance] = useState<CarteARevoir[] | null>(null);
  const [edition, setEdition] = useState<Flashcard | "nouvelle" | null>(null);
  const [recto, setRecto] = useState("");
  const [verso, setVerso] = useState("");
  const cartes = chapitre.flashcards;
  const dues = cartes.filter(estDue);

  const ouvrir = (c: Flashcard | "nouvelle") => {
    setRecto(c === "nouvelle" ? "" : c.recto);
    setVerso(c === "nouvelle" ? "" : c.verso);
    setEdition(c);
  };
  const lancer = (liste: Flashcard[]) =>
    setSeance(liste.map((c) => ({ chapitreId: chapitre.id, carteId: c.id })));

  if (seance)
    return <Revision cartes={seance} terminer={() => setSeance(null)} />;

  return (
    <div>
      {cartes.length === 0 ? (
        <EtatVide
          icone={<Layers size={26} />}
          titre="Pas encore de flashcards"
          texte="Envoie ton cours à Claude pour qu'il les rédige, ou ajoute-les toi-même."
          action={
            <>
              {chapitre.cours.trim() ? (
                <Bouton onClick={envoyer}>
                  <Send size={16} /> Envoyer le cours à Claude
                </Bouton>
              ) : (
                <Bouton onClick={versCours}>Ajouter le cours</Bouton>
              )}
              <Bouton variante="contour" onClick={() => ouvrir("nouvelle")}>
                <Plus size={16} /> Ajouter une carte
              </Bouton>
            </>
          }
        />
      ) : (
        <>
          <Carte className="mb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[17px] font-semibold">
                  {dues.length > 0
                    ? dues.every((c) => c.niveau === 0)
                      ? `${pluriel(dues.length, "carte nouvelle", "cartes nouvelles")} à découvrir`
                      : `${pluriel(dues.length, "carte")} à revoir`
                    : "Tout est à jour"}
                </p>
                <p className="mt-0.5 text-[14px] text-muted">
                  {pluriel(cartes.length, "flashcard")} dans ce chapitre. Touche
                  une carte pour la modifier.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Bouton variante="contour" onClick={() => ouvrir("nouvelle")}>
                  <Plus size={16} /> Ajouter
                </Bouton>
                {dues.length > 0 ? (
                  <Bouton onClick={() => lancer(dues)}>
                    <Play size={16} /> Réviser ({dues.length})
                  </Bouton>
                ) : (
                  <Bouton variante="doux" onClick={() => lancer(cartes)}>
                    <Play size={16} /> Tout revoir
                  </Bouton>
                )}
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full rounded-full bg-ok"
                animate={{
                  width: `${((cartes.length - dues.length) / cartes.length) * 100}%`,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </Carte>

          <div className="grid gap-3 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {cartes.map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, transform: "translate3d(0, 12px, 0) scale(0.97)" }}
                  animate={{ opacity: 1, transform: "translate3d(0, 0px, 0) scale(1)" }}
                  exit={{ opacity: 0, transform: "translate3d(0, 0px, 0) scale(0.95)" }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => ouvrir(c)}
                  className="rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-colors hover:border-ink/30"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-[15.5px] font-semibold">
                      {formule(c.recto)}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${
                        estDue(c)
                          ? "bg-accent-soft text-accent"
                          : "bg-ink/5 text-muted"
                      }`}
                    >
                      {prochaineRevue(c)}
                    </span>
                  </span>
                  <span className="mt-1 block text-[14px] leading-snug text-muted">
                    {formule(c.verso)}
                  </span>
                  {c.schema && (
                    <DessinSchema
                      schema={c.schema}
                      dansBouton
                      hauteurMax={150}
                      className="mt-3 !p-2.5"
                    />
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      <Fenetre
        ouverte={edition !== null}
        fermer={() => setEdition(null)}
        titre={
          edition === "nouvelle"
            ? "Nouvelle flashcard"
            : "Modifier la flashcard"
        }
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!recto.trim() || !verso.trim() || !edition) return;
            const k = { recto: recto.trim(), verso: verso.trim() };
            if (edition === "nouvelle") s.ajouterFlashcards(chapitre.id, [k]);
            else s.modifierFlashcard(chapitre.id, edition.id, k);
            setEdition(null);
          }}
        >
          <Champ label="Recto (terme ou question)">
            <input
              autoFocus
              required
              className={classeSaisie}
              value={recto}
              onChange={(e) => setRecto(e.target.value)}
            />
          </Champ>
          <Champ label="Verso (définition ou réponse)">
            <textarea
              required
              rows={4}
              className={classeSaisie}
              value={verso}
              onChange={(e) => setVerso(e.target.value)}
            />
          </Champ>
          <div className="flex items-center justify-between">
            {edition !== "nouvelle" && edition ? (
              <Bouton
                type="button"
                variante="fantome"
                className="!text-bad"
                onClick={() => {
                  s.supprimerFlashcard(chapitre.id, edition.id);
                  setEdition(null);
                }}
              >
                <Trash2 size={16} /> Supprimer
              </Bouton>
            ) : (
              <span />
            )}
            <Bouton type="submit">
              {edition === "nouvelle" ? "Ajouter" : "Enregistrer"}
            </Bouton>
          </div>
        </form>
      </Fenetre>
    </div>
  );
}

function OngletFiche({
  chapitre,
  matiere,
  envoyer,
  versCours,
}: {
  chapitre: Chapitre;
  matiere: Matiere;
  envoyer: () => void;
  versCours: () => void;
}) {
  const majTaille = useLuno((s) => s.majTailleFiche);
  const router = useRouter();
  const params = useSearchParams();
  const fiche = chapitre.fiche;
  const taille = chapitre.tailleFiche;
  const foncee = encre(matiere.couleur);
  // Plusieurs fiches dans le chapitre : celle qu'on lit est gardée dans l'adresse (`f`).
  const parties = fiche?.decoupage && fiche.decoupage.length > 1 ? fiche.decoupage : null;
  const iPartie = parties ? Math.min(parties.length - 1, Math.max(0, Number(params.get("f")) || 0)) : 0;
  const partie = parties?.[iPartie];
  const choisirPartie = (i: number) =>
    router.replace(lienTravail({ m: matiere.id, c: chapitre.id, o: "fiche", f: i ? String(i) : undefined }), { scroll: false });

  if (!fiche) {
    return (
      <EtatVide
        icone={<ScrollText size={26} />}
        titre="Pas encore de fiche"
        texte="Claude rédige la fiche à partir de ton cours. Tu pourras ensuite régler sa longueur avec un curseur, de l'essentiel au cours complet."
        action={
          chapitre.cours.trim() ? (
            <Bouton onClick={envoyer}>
              <Send size={16} /> Envoyer le cours à Claude
            </Bouton>
          ) : (
            <Bouton onClick={versCours}>Ajouter le cours</Bouton>
          )
        }
      />
    );
  }

  // Toutes les sections et tous les points restent dans la page : ceux qui dépassent la
  // taille choisie sont repliés en CSS (classe `repli`), ce qui garde le curseur fluide.
  let rang = 0;
  const choisies = partie ? partie.sections.map((i) => fiche.sections[i]).filter(Boolean) : fiche.sections;
  // Tailles qui changent vraiment quelque chose : une taille sans point nouveau (ex. aucun point
  // n = 5) est fondue dans la précédente (demandé le 2026-11-24 : « Détaillée » et « Complète »
  // identiques). La plus grande s'appelle toujours « Complète ».
  const niveaux = [...new Set(choisies.flatMap((sec) => sec.points.map((p) => Math.min(5, Math.max(1, p.n)))))].sort(
    (a, b) => a - b,
  );
  if (niveaux.length === 0) niveaux.push(1);
  const iNiveau = Math.max(0, niveaux.filter((n) => n <= taille).length - 1);
  const tailleVue = niveaux[iNiveau];
  const nomTaille = (i: number) => (i === niveaux.length - 1 ? TAILLES[4] : TAILLES[niveaux[i] - 1]);
  const sections = choisies.map((sec) => {
    const visible = sec.points.some((p) => p.n <= tailleVue);
    return { ...sec, visible, numero: visible ? ++rang : rang };
  });
  const nbPoints = choisies.reduce(
    (n, sec) => n + sec.points.filter((p) => p.n <= tailleVue).length,
    0,
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      {parties && partie && (
        <div className="min-w-0 lg:col-span-2">
          <RegleFiches titres={parties.map((x) => x.titre)} actif={iPartie} choisir={choisirPartie} couleur={foncee} />
          <p className="mt-1.5 text-[13.5px] text-muted">{partie.sujet}</p>
        </div>
      )}
      <Carte className="h-fit lg:sticky lg:top-24">
        <p className="text-[17px] font-semibold">Taille de la fiche</p>
        <div className="mt-4 flex items-baseline justify-between">
          <motion.span
            key={tailleVue}
            initial={{ opacity: 0, transform: "translate3d(0, 6px, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
            className="font-display text-[28px] text-accent"
          >
            {nomTaille(iNiveau)}
          </motion.span>
          <span className="text-[13px] text-muted">
            {pluriel(nbPoints, "point")}
          </span>
        </div>
        {niveaux.length > 1 ? (
          <>
            <Curseur
              min={0}
              max={niveaux.length - 1}
              value={iNiveau}
              onChange={(i) => majTaille(chapitre.id, niveaux[Math.min(i, niveaux.length - 1)])}
              label="Taille de la fiche"
              valueText={nomTaille(iNiveau)}
              reperes
              className="mt-4"
            />
            <div className="mt-2 flex justify-between text-[12px] text-muted">
              <span>L&apos;essentiel</span>
              <span>Tout le cours</span>
            </div>
          </>
        ) : (
          <p className="mt-2 text-[13px] text-muted">Une seule taille : cette fiche est déjà courte.</p>
        )}
      </Carte>

      <article className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-card">
        <div
          className="px-6 py-3.5 sm:px-8 sm:py-5"
          style={{ background: pastel(matiere.couleur, 16) }}
        >
          <p className="surtitre" style={{ color: foncee }}>
            {parties ? `Fiche ${iPartie + 1} sur ${parties.length}` : "Fiche de révision"} · {nomTaille(iNiveau)}
          </p>
          {/* Le titre du chapitre est déjà en haut de la page : répété seulement sur grand écran.
              Avec plusieurs fiches, c'est le titre de la fiche qui compte, partout. */}
          <h2 className={`mt-1 text-[24px] sm:text-[28px] ${partie ? "" : "hidden sm:block"}`} style={{ color: foncee }}>
            {partie ? partie.titre : chapitre.titre}
          </h2>
        </div>
        <div className="flex flex-col px-6 pb-6 pt-1 sm:px-8">
          {sections.map((sec) => (
            <section key={sec.titre} className="repli" data-ouvert={sec.visible}>
              <div>
              {/* Une fiche faite d'une seule section : son titre est déjà celui de la fiche. */}
              {!(partie && sections.length === 1) && (
              <h3 className="mb-2 mt-5 flex items-center gap-2.5 text-[18px]">
                <span
                  className="flex size-6 items-center justify-center rounded-md font-sans text-[12.5px] font-semibold"
                  style={{
                    background: pastel(matiere.couleur, 30),
                    color: foncee,
                  }}
                >
                  {sec.numero}
                </span>
                {formule(sec.titre)}
              </h3>
              )}
              <ul className="flex flex-col pl-1">
                  {sec.points.map((p) => (
                    <li
                      key={p.t}
                      className="repli"
                      data-ouvert={p.n <= tailleVue}
                      aria-hidden={p.n > tailleVue || undefined}
                    >
                      <div className="flex gap-2.5 py-[3px] text-[15px] leading-relaxed">
                      <span
                        className="mt-[10px] size-1.5 shrink-0 rounded-full"
                        style={{ background: matiere.couleur }}
                      />
                      <span className="min-w-0 flex-1">
                        {formule(p.t)}
                        {p.schema && (
                          <DessinSchema
                            schema={p.schema}
                            className="mb-2 mt-3 max-w-[520px]"
                          />
                        )}
                        {p.image && <Illustration image={p.image} className="mb-2 mt-3 max-w-[640px]" />}
                      </span>
                      </div>
                    </li>
                  ))}
              </ul>
              </div>
            </section>
          ))}
          {fiche.aRetenir.length > 0 && (
            <div className="mt-6 rounded-2xl bg-accent-soft p-4">
              <p className="surtitre mb-2 text-accent">Mots-clés à retenir</p>
              <div className="flex flex-wrap gap-2">
                {fiche.aRetenir.map((m) => (
                  <span
                    key={m}
                    className="rounded-full bg-surface px-3 py-1 text-[13.5px] font-semibold"
                  >
                    {formule(m)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

/**
 * Choix de la fiche quand un chapitre en a plusieurs (maquette C3 choisie le 2026-11-24) :
 * les titres en ligne, sans emoji, et un trait qui glisse sous la fiche ouverte. Le trait
 * bouge en `transform` seulement (fluide sur téléphone) ; la ligne défile si elle est longue.
 */
function RegleFiches({
  titres,
  actif,
  choisir,
  couleur,
}: {
  titres: string[];
  actif: number;
  choisir: (i: number) => void;
  couleur: string;
}) {
  const ligne = useRef<HTMLDivElement>(null);
  const trait = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ligne.current?.querySelector<HTMLElement>(`[data-i="${actif}"]`);
    const t = trait.current;
    if (!el || !t) return;
    t.style.transform = `translate3d(${el.offsetLeft}px, 0, 0) scaleX(${el.offsetWidth / 100})`;
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [actif, titres]);
  return (
    <div
      ref={ligne}
      role="tablist"
      aria-label="Fiches du chapitre"
      className="relative flex gap-5 overflow-x-auto pb-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      data-defile
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[3px] h-px bg-line" />
      {titres.map((t, i) => (
        <button
          key={t}
          data-i={i}
          role="tab"
          aria-selected={i === actif}
          onClick={() => choisir(i)}
          className={`min-h-10 shrink-0 whitespace-nowrap text-[15px] font-semibold transition-colors duration-200 ${
            i === actif ? "text-ink" : "text-muted hover:text-ink"
          }`}
        >
          {t}
        </button>
      ))}
      <span
        ref={trait}
        aria-hidden
        className="pointer-events-none absolute bottom-[2px] left-0 h-[3px] w-[100px] origin-left rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,0.8,0.24,1)]"
        style={{ background: couleur }}
      />
    </div>
  );
}
