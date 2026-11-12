"use client";

import { useRef, useState } from "react";
import { ZoneDictee } from "@/components/Dictee";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  BookMarked,
  FileDown,
  FileText,
  Layers,
  Pencil,
  Play,
  Plus,
  ScrollText,
  Search,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import type { Chapitre, Flashcard, Matiere } from "@/lib/types";
import { encre, estDue, pastel, useLuno } from "@/lib/store";
import { demandeCours, repererDefinitions } from "@/lib/contenu";
import { joursAvant } from "@/lib/dates";
import { lienFichier, lienTravail } from "@/lib/liens";
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
import { classePastille, usePastille } from "@/lib/pastille";
import { Emoji } from "@/components/Emoji";

const ONGLETS = [
  { id: "cours", label: "Cours", icone: FileText },
  { id: "defs", label: "Déf", icone: BookMarked },
  { id: "flashcards", label: "Flashcards", icone: Layers },
  { id: "fiche", label: "Fiche", icone: ScrollText },
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
  const onglet: Onglet = ONGLETS.some((o) => o.id === ongletDemande)
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
    const i = ONGLETS.findIndex((o) => o.id === onglet);
    const pas = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const suivant = ONGLETS[(i + pas + ONGLETS.length) % ONGLETS.length].id;
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
        <h1 className="min-w-0 text-[32px] leading-tight sm:text-[40px]">
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
        {ONGLETS.map(({ id, label, icone: Icone }) => (
          <button
            key={id}
            id={`onglet-${id}`}
            role="tab"
            aria-selected={onglet === id}
            data-actif={onglet === id}
            aria-controls="panneau-chapitre"
            tabIndex={onglet === id ? 0 : -1}
            onClick={() => setOnglet(id)}
            className="relative flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-[14.5px] font-semibold transition-colors duration-300 sm:px-5"
            style={{ color: onglet === id ? foncee : "var(--muted)" }}
          >
            <Icone size={16} className="relative hidden sm:block" />
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
          {onglet === "defs" && (
            <OngletDefinitions
              chapitre={chapitre}
              matiere={matiere}
              envoyer={() => setEnvoi(true)}
            />
          )}
          {onglet === "flashcards" && (
            <OngletFlashcards
              chapitre={chapitre}
              envoyer={() => setEnvoi(true)}
              versCours={() => setOnglet("cours")}
            />
          )}
          {onglet === "fiche" && (
            <OngletFiche
              chapitre={chapitre}
              matiere={matiere}
              envoyer={() => setEnvoi(true)}
              versCours={() => setOnglet("cours")}
            />
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
            <a
              href={lienFichier(d.fichier)}
              target="_blank"
              rel="noreferrer"
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
            </a>
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

  return (
    <>
      <Documents chapitre={chapitre} />
      <Carte>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="min-w-0 flex-1 text-[14.5px] text-muted">
            {chapitre.documents.length > 0 ? "Tes notes sur ce chapitre. " : ""}
            Colle ton cours ici ou importe un fichier texte. Pour un PDF ou une
            photo, envoie-le directement à Claude dans votre conversation.
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

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-accent-soft p-4">
            <p className="text-[15px] font-semibold">
              Flashcards, fiche et exercices
            </p>
            <p className="mt-0.5 text-[13.5px] text-ink/75">
              Claude les rédige à partir de ton cours et les ajoute au site.
            </p>
            <Bouton className="mt-3" disabled={!mots} onClick={envoyer}>
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
              disabled={!mots}
              onClick={reperer}
            >
              <Search size={16} /> Repérer les définitions
            </Bouton>
          </div>
        </div>
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
                    ? `${pluriel(dues.length, "carte")} à revoir aujourd'hui`
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
  const fiche = chapitre.fiche;
  const taille = chapitre.tailleFiche;
  const foncee = encre(matiere.couleur);

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
  const sections = fiche.sections.map((sec) => {
    const visible = sec.points.some((p) => p.n <= taille);
    return { ...sec, visible, numero: visible ? ++rang : rang };
  });
  const nbPoints = fiche.sections.reduce(
    (n, sec) => n + sec.points.filter((p) => p.n <= taille).length,
    0,
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <Carte className="h-fit lg:sticky lg:top-24">
        <p className="text-[17px] font-semibold">Taille de la fiche</p>
        <div className="mt-4 flex items-baseline justify-between">
          <motion.span
            key={taille}
            initial={{ opacity: 0, transform: "translate3d(0, 6px, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
            className="font-display text-[28px] text-accent"
          >
            {TAILLES[taille - 1]}
          </motion.span>
          <span className="text-[13px] text-muted">
            {pluriel(nbPoints, "point")}
          </span>
        </div>
        <Curseur
          min={1}
          max={5}
          value={taille}
          onChange={(v) => majTaille(chapitre.id, v)}
          label="Taille de la fiche"
          valueText={TAILLES[taille - 1]}
          reperes
          className="mt-4"
        />
        <div className="mt-2 flex justify-between text-[12px] text-muted">
          <span>L&apos;essentiel</span>
          <span>Tout le cours</span>
        </div>
      </Carte>

      <article className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-card">
        <div
          className="px-6 py-5 sm:px-8"
          style={{ background: pastel(matiere.couleur, 16) }}
        >
          <p className="surtitre" style={{ color: foncee }}>
            Fiche de révision · {TAILLES[taille - 1]}
          </p>
          <h2 className="mt-1 text-[28px]" style={{ color: foncee }}>
            {chapitre.titre}
          </h2>
        </div>
        <div className="flex flex-col px-6 pb-6 pt-1 sm:px-8">
          {sections.map((sec) => (
            <section key={sec.titre} className="repli" data-ouvert={sec.visible}>
              <div>
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
              <ul className="flex flex-col pl-1">
                  {sec.points.map((p) => (
                    <li
                      key={p.t}
                      className="repli"
                      data-ouvert={p.n <= taille}
                      aria-hidden={p.n > taille || undefined}
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
