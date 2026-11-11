"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Clock, Copy, ExternalLink, ImagePlus, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ButtonHTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lienGithub } from "@/lib/contenu";
import { MAX_IMAGES, envoyerDemande, prochainPassage, type Demande, type TypeDemande } from "@/lib/demandes";
import { synchroDisponible, useSynchro } from "@/lib/synchro";

/** « 1 chapitre », « 2 chapitres », « 0 chapitre ». */
export function pluriel(n: number, mot: string, auPluriel = mot + "s"): string {
  return `${n} ${n > 1 ? auPluriel : mot}`;
}

export function EnTete({
  titre,
  sousTitre,
  action,
}: {
  titre: ReactNode;
  sousTitre?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header data-entete className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[36px] leading-tight sm:text-[46px]">{titre}</h1>
        {sousTitre && <p className="mt-1 text-[15px] text-muted">{sousTitre}</p>}
      </div>
      {action}
    </header>
  );
}

type Variante = "plein" | "doux" | "contour" | "fantome";

const STYLES: Record<Variante, string> = {
  plein: "bg-ink text-bg hover:bg-accent hover:text-on-accent",
  doux: "bg-accent-soft text-accent hover:bg-accent hover:text-on-accent",
  contour: "border border-line bg-surface text-ink hover:border-ink/30",
  fantome: "text-muted hover:bg-ink/5 hover:text-ink",
};

export function Bouton({
  variante = "plein",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[14.5px] font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 ${STYLES[variante]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Bouton carré pour une icône seule, avec une cible tactile de 44 px. */
export function BoutonIcone({
  label,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-ink/5 hover:text-ink ${className}`}
    >
      {children}
    </button>
  );
}

export function Carte({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[18px] border border-line bg-surface p-5 shadow-card sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

const sansAbonnement = () => () => {};
const FOCALISABLES = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

export function Fenetre({
  ouverte,
  fermer,
  titre,
  children,
}: {
  ouverte: boolean;
  fermer: () => void;
  titre: string;
  children: ReactNode;
}) {
  const panneau = useRef<HTMLDivElement>(null);
  const monte = useSyncExternalStore(sansAbonnement, () => true, () => false);

  // Échap ferme la fenêtre ; Tab reste à l'intérieur ; le focus revient ensuite d'où il venait.
  useEffect(() => {
    if (!ouverte) return;
    const avant = document.activeElement as HTMLElement | null;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
      if (e.key !== "Tab" || !panneau.current) return;
      const els = Array.from(panneau.current.querySelectorAll<HTMLElement>(FOCALISABLES));
      if (els.length === 0) return;
      const premier = els[0];
      const dernier = els[els.length - 1];
      if (!panneau.current.contains(document.activeElement)) {
        e.preventDefault();
        premier.focus();
      } else if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault();
        premier.focus();
      }
    };
    window.addEventListener("keydown", surTouche);
    return () => {
      window.removeEventListener("keydown", surTouche);
      avant?.focus?.();
    };
  }, [ouverte, fermer]);

  // Rendue à la racine du document : un parent flouté ou transformé décalerait une fenêtre fixe.
  if (!monte) return null;
  return createPortal(
    <AnimatePresence>
      {ouverte && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-night/55 p-3 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && fermer()}
        >
          <motion.div
            ref={panneau}
            role="dialog"
            aria-modal="true"
            aria-label={titre}
            className="max-h-[88dvh] w-full max-w-[480px] overflow-y-auto rounded-[18px] bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-pop sm:p-6"
            initial={{ opacity: 0, transform: "translate3d(0, 28px, 0) scale(0.97)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0px, 0) scale(1)" }}
            exit={{ opacity: 0, transform: "translate3d(0, 16px, 0) scale(0.98)" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-[22px]">{titre}</h2>
              <BoutonIcone label="Fermer" onClick={fermer} className="-mr-2">
                <X size={18} />
              </BoutonIcone>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Champ({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}

export const classeSaisie =
  "w-full rounded-xl border border-line bg-bg/60 px-3.5 py-2.5 text-[16px] outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:bg-surface sm:text-[15px]";

export function EtatVide({
  icone,
  titre,
  texte,
  action,
}: {
  icone: ReactNode;
  titre: string;
  texte: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-[18px] border border-dashed border-ink/20 px-6 py-12 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        {icone}
      </div>
      <h3 className="text-[20px]">{titre}</h3>
      <p className="mt-1.5 max-w-[400px] text-[14.5px] text-muted">{texte}</p>
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}

/**
 * Fenêtre pour transmettre une demande à Claude : copier le texte pour le
 * coller dans la conversation, ou ouvrir un ticket GitHub prérempli.
 */
export function EnvoyerAClaude({
  ouverte,
  fermer,
  titre,
  objet,
  texte,
  resultat,
  demande,
}: {
  ouverte: boolean;
  fermer: () => void;
  titre: string;
  /** Titre du ticket GitHub. */
  objet: string;
  texte: string;
  /** Ce que l'utilisateur recevra, ex. « les flashcards, la fiche et les exercices ». */
  resultat: string;
  /** Si présent, la demande peut partir directement depuis Luno (compte connecté). */
  demande?: { type: TypeDemande; meta?: Demande["meta"] };
}) {
  const [copie, setCopie] = useState(false);
  const [etatEnvoi, setEtatEnvoi] = useState<"" | "envoi" | "ok" | "erreur">("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [avancement, setAvancement] = useState("");
  const connecte = useSynchro((x) => x.session !== null);
  const github = lienGithub(objet, texte);
  const direct = Boolean(demande && synchroDisponible());

  const envoyer = async () => {
    if (!demande) return;
    setEtatEnvoi("envoi");
    try {
      await envoyerDemande(demande.type, objet, texte, demande.meta, photos, (fait, total) =>
        setAvancement(total ? `Envoi des photos ${Math.min(fait + 1, total)}/${total}…` : ""),
      );
      setEtatEnvoi("ok");
      setPhotos([]);
    } catch {
      setEtatEnvoi("erreur");
    }
  };

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Fenetre
      ouverte={ouverte}
      fermer={() => {
        setEtatEnvoi("");
        fermer();
      }}
      titre={titre}
    >
      {direct && (
        <div className="mb-4 rounded-xl bg-accent-soft p-4">
          <p className="text-[15px] font-semibold">Envoyer depuis Luno</p>
          {etatEnvoi === "ok" ? (
            <p className="mt-1 flex items-start gap-1.5 text-[14px] text-ok" role="status">
              <Check size={16} className="mt-0.5 shrink-0" />
              Demande envoyée. Claude passe {prochainPassage()} pour la traiter : la réponse
              apparaîtra ici, sur tous tes appareils.
            </p>
          ) : connecte ? (
            <>
              <p className="mt-0.5 flex items-start gap-1.5 text-[13.5px] text-muted">
                <Clock size={14} className="mt-0.5 shrink-0" />
                Claude passe quatre fois par jour (8 h, 13 h, 18 h, 20 h). Prochain passage :{" "}
                {prochainPassage()}.
              </p>
              <Photos photos={photos} setPhotos={setPhotos} desactive={etatEnvoi === "envoi"} />
              <Bouton className="mt-3 w-full" disabled={etatEnvoi === "envoi"} onClick={() => void envoyer()}>
                <Send size={16} />{" "}
                {etatEnvoi === "envoi" ? avancement || "Envoi…" : "Envoyer la demande"}
              </Bouton>
              {etatEnvoi === "erreur" && (
                <p className="mt-2 text-[13.5px] text-bad" role="alert">
                  L&apos;envoi a échoué. Vérifie ta connexion et réessaie.
                </p>
              )}
            </>
          ) : (
            <p className="mt-0.5 text-[13.5px] text-muted">
              Connecte-toi dans « Mes données » (la roue dentée) pour envoyer ta demande
              directement : Claude la traite quatre fois par jour.
            </p>
          )}
        </div>
      )}
      <p className="text-[14.5px] leading-relaxed text-muted">
        {direct
          ? `Ou transmets-la toi-même, pour une réponse plus rapide : Claude rédige ${resultat}, et tout apparaît ici à ta prochaine visite.`
          : `Le site ne peut pas joindre Claude tout seul. Transmets-lui ta demande par l'un de ces deux moyens : il rédige ${resultat}, et tout apparaît ici à ta prochaine visite.`}
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <div className="rounded-xl border border-line p-4">
          <p className="text-[15px] font-semibold">1. Dans ta conversation avec Claude</p>
          <p className="mt-0.5 text-[13.5px] text-muted">Copie la demande, puis colle-la dans le chat.</p>
          <Bouton className="mt-3 w-full" onClick={copier}>
            {copie ? <Check size={16} /> : <Copy size={16} />}
            {copie ? "Copié" : "Copier la demande"}
          </Bouton>
        </div>
        <div className="rounded-xl border border-line p-4">
          <p className="text-[15px] font-semibold">2. Par GitHub</p>
          <p className="mt-0.5 text-[13.5px] text-muted">
            Ouvre une demande préremplie et valide-la. Il faut un compte GitHub, et la demande est
            publique.
            {github.tronque && " Ton cours est long : il sera copié, colle-le dans la page qui s'ouvre."}
          </p>
          <a
            href={github.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              if (github.tronque) void copier();
            }}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-line bg-surface px-4 py-2.5 text-[14.5px] font-medium transition-colors hover:border-ink/30"
          >
            <ExternalLink size={16} /> Ouvrir sur GitHub
          </a>
        </div>
      </div>
    </Fenetre>
  );
}

/** Photos jointes à une demande (cours, évaluation corrigée…), avec leurs vignettes. */
function Photos({
  photos,
  setPhotos,
  desactive,
}: {
  photos: File[];
  setPhotos: (f: File[]) => void;
  desactive: boolean;
}) {
  const entree = useRef<HTMLInputElement>(null);
  const vignettes = useMemo(() => photos.map((f) => URL.createObjectURL(f)), [photos]);
  useEffect(() => () => vignettes.forEach((u) => URL.revokeObjectURL(u)), [vignettes]);
  return (
    <div className="mt-3">
      <input
        ref={entree}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const ajout = [...(e.target.files ?? [])].filter((f) => f.type.startsWith("image/"));
          setPhotos([...photos, ...ajout].slice(0, MAX_IMAGES));
          e.target.value = "";
        }}
      />
      {vignettes.length > 0 && (
        <ul className="mb-2 grid grid-cols-4 gap-2" aria-label="Photos jointes">
          {vignettes.map((u, i) => (
            <li key={u} className="relative aspect-square overflow-hidden rounded-lg border border-line bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt={`Photo ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                disabled={desactive}
                onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                aria-label={`Retirer la photo ${i + 1}`}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card"
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Bouton
        variante="contour"
        className="w-full !py-2"
        disabled={desactive || photos.length >= MAX_IMAGES}
        onClick={() => entree.current?.click()}
      >
        <ImagePlus size={16} />
        {photos.length ? `Ajouter des photos (${photos.length}/${MAX_IMAGES})` : "Ajouter des photos"}
      </Bouton>
    </div>
  );
}

export function Chargement({ texte }: { texte: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-muted">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-2.5 rounded-full bg-accent"
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.14 }}
          />
        ))}
      </div>
      <p className="text-[14.5px]">{texte}</p>
    </div>
  );
}
