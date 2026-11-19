"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, ExternalLink, Newspaper, Quote, Sparkles, Undo2 } from "lucide-react";
import { formule } from "@/components/Formule";
import { Bouton, Fenetre } from "@/components/ui";
import { compteARebours, joursAvant, todayISO } from "@/lib/dates";
import { lienDocumentNote, prochainPassage, useDemandes } from "@/lib/demandes";
import {
  NOMS_GENRE,
  decouvertes,
  type ActuDuJour,
  type FaitDuJour,
  type ImageOeuvre,
  type OeuvreDuJour,
} from "@/lib/decouverte";
import { useLuno } from "@/lib/store";
import { synchroDisponible, useSynchro } from "@/lib/synchro";

/**
 * Accueil : « La découverte du jour » (maquettes A pour le fait et l'actualité, B, le
 * cartel de musée, pour l'œuvre ; choisies le 2026-11-18). Compte connecté seulement : la
 * tâche planifiée écrit la découverte dans la table `demandes`.
 */
export function DecouverteDuJour() {
  const connecte = useSynchro((s) => s.session !== null);
  const actif = useLuno((s) => s.reglages?.decouverte === true);
  const majReglages = useLuno((s) => s.majReglages);
  const charge = useDemandes((d) => d.charge);
  const derniere = decouvertes(useDemandes((d) => d.liste))[0];

  if (!synchroDisponible() || !connecte) return null;

  if (!actif)
    return (
      <section className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[18px] border border-dashed border-line bg-surface px-5 py-4">
        <Sparkles size={20} className="shrink-0 text-accent" />
        <p className="min-w-0 flex-1 text-[14.5px]">
          <strong className="font-semibold">La découverte du jour</strong>
          <span className="text-muted"> · chaque matin, un fait, une œuvre et une actualité vérifiée, choisis par Claude.</span>
        </p>
        <Bouton variante="doux" onClick={() => majReglages({ decouverte: true })}>
          Activer
        </Bouton>
      </section>
    );

  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <p className="surtitre text-accent">
            {derniere ? (derniere.jour === todayISO() ? "Aujourd'hui" : compteARebours(derniere.jour)) : "Bientôt"}
          </p>
          <h2 className="text-[22px]">La découverte du jour</h2>
        </div>
        <Link
          href="/decouvertes"
          className="inline-flex min-h-11 items-center gap-1 text-[13.5px] font-semibold text-accent"
        >
          Historique <ArrowRight size={14} />
        </Link>
      </div>
      {derniere ? (
        <>
          {/* Téléphone et portable : une seule carte, trois onglets (l'accueil restait trop long). */}
          <div className="lg:hidden">
            <OngletsDecouverte d={derniere} />
          </div>
          <div className="hidden items-start gap-4 lg:grid lg:grid-cols-3">
            <CarteFait fait={derniere.fait} />
            <CarteOeuvre oeuvre={derniere.oeuvre} />
            <CarteActu actu={derniere.actu} />
          </div>
        </>
      ) : (
        <p className="flex items-center gap-2 rounded-[18px] border border-line bg-surface px-5 py-4 text-[14.5px] text-muted">
          <Clock size={16} className="shrink-0" />
          {charge ? `Ta première découverte arrive ${prochainPassage()}.` : "Chargement…"}
        </p>
      )}
    </section>
  );
}

const ONGLETS = [
  ["fait", "Le fait"],
  ["oeuvre", "L’œuvre"],
  ["actu", "L’actu"],
] as const;

function OngletsDecouverte({ d }: { d: ReturnType<typeof decouvertes>[number] }) {
  const connues = useLuno((s) => s.connues ?? []);
  // On ouvre le premier élément pas encore marqué « Je connais déjà ».
  const [choisi, setChoisi] = useState<(typeof ONGLETS)[number][0]>(
    () => ONGLETS.find(([k]) => !connues.includes(d[k].id))?.[0] ?? "fait",
  );
  return (
    <div className="grid gap-2.5">
      <div role="tablist" aria-label="La découverte du jour" className="flex gap-1.5">
        {ONGLETS.map(([k, nom]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={choisi === k}
            onClick={() => setChoisi(k)}
            className={`min-h-10 flex-1 rounded-full border px-3 text-[13.5px] font-semibold transition-colors ${
              choisi === k ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink hover:border-ink/30"
            }`}
          >
            {nom}
            {connues.includes(d[k].id) && <Check size={13} className="ml-1 inline align-[-1px]" aria-label="déjà connu" />}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {choisi === "fait" ? (
          <CarteFait fait={d.fait} />
        ) : choisi === "oeuvre" ? (
          <CarteOeuvre oeuvre={d.oeuvre} />
        ) : (
          <CarteActu actu={d.actu} />
        )}
      </div>
    </div>
  );
}

/** Cadre commun : étiquette, contenu, « Lire la suite » et « Je connais déjà ». */
function Cadre({
  id,
  etiquette,
  titre,
  suite,
  children,
}: {
  id: string;
  etiquette: ReactNode;
  titre: string;
  suite?: ReactNode;
  children: ReactNode;
}) {
  const connue = useLuno((s) => (s.connues ?? []).includes(id));
  const marquer = useLuno((s) => s.marquerConnue);
  const [ouvert, setOuvert] = useState(false);

  if (connue)
    return (
      <article className="grid gap-2 rounded-[18px] border border-line bg-surface p-5 text-[14px] shadow-card">
        <p className="flex items-start gap-2">
          <Check size={16} className="mt-0.5 shrink-0 text-ok" />
          <span>
            Tu connais déjà <strong className="font-semibold">{titre}</strong>. Claude la remplace {prochainPassage()}.
          </span>
        </p>
        <button
          type="button"
          onClick={() => marquer(id, false)}
          className="inline-flex min-h-10 items-center gap-1.5 justify-self-start text-[13.5px] font-semibold text-accent"
        >
          <Undo2 size={14} /> Annuler
        </button>
      </article>
    );

  return (
    <article className="grid min-w-0 gap-3 rounded-[18px] border border-line bg-surface p-5 shadow-card">
      <span className="inline-flex items-center gap-1.5 justify-self-start rounded-full bg-accent-soft px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.1em] text-accent">
        {etiquette}
      </span>
      {children}
      {ouvert && suite}
      <div className="flex flex-wrap gap-2">
        {suite && (
          <Bouton variante="contour" onClick={() => setOuvert((o) => !o)} aria-expanded={ouvert}>
            {ouvert ? "Replier" : "Lire la suite"}
          </Bouton>
        )}
        <Bouton variante="fantome" onClick={() => marquer(id, true)}>
          Je connais déjà
        </Bouton>
      </div>
    </article>
  );
}

const Titre = ({ children }: { children: ReactNode }) => (
  <h3 className="text-[19px] leading-tight [text-wrap:balance]">{children}</h3>
);
const Paragraphe = ({ texte, className = "" }: { texte: string; className?: string }) => (
  <p className={`whitespace-pre-line text-[14.5px] leading-relaxed ${className}`}>{formule(texte)}</p>
);
const Utile = ({ titre, texte }: { titre: string; texte: string }) => (
  <p className="rounded-[10px] bg-bg px-3 py-2 text-[13.5px] leading-snug">
    <strong className="font-semibold text-accent">{titre}</strong> · {formule(texte)}
  </p>
);

function CarteFait({ fait }: { fait: FaitDuJour }) {
  return (
    <Cadre
      id={fait.id}
      etiquette="Le savais-tu ?"
      titre={fait.titre}
      suite={fait.suite ? <Paragraphe texte={fait.suite} /> : undefined}
    >
      <Titre>{formule(fait.titre)}</Titre>
      <Paragraphe texte={fait.texte} />
      {fait.utile && <Utile titre={`Utile en ${fait.matiere ?? "HGGSP"}`} texte={fait.utile} />}
    </Cadre>
  );
}

/**
 * Adresse de l'image d'une œuvre : d'abord la copie du stockage privé (adresse signée d'une
 * heure), puis Wikimedia si elle manque ou ne charge pas, puis rien (vignette sans image).
 */
export function useImageOeuvre(image?: ImageOeuvre) {
  const [signee, setSignee] = useState<{ chemin: string; url: string | null } | null>(null);
  const [essai, setEssai] = useState(0);
  const chemin = image?.chemin;
  useEffect(() => {
    if (!chemin) return;
    let vivant = true;
    void lienDocumentNote(chemin).then((url) => vivant && setSignee({ chemin, url }));
    return () => {
      vivant = false;
    };
  }, [chemin]);
  if (!image || essai >= 2) return { src: undefined, attente: false, copie: false, rater: () => {} };
  const copie = Boolean(chemin) && essai === 0 && signee?.url !== null;
  const attente = copie && signee?.chemin !== chemin;
  const src = copie ? (signee?.url ?? undefined) : image.url;
  return { src, attente, copie, rater: () => setEssai(copie ? 1 : 2) };
}

function CarteOeuvre({ oeuvre }: { oeuvre: OeuvreDuJour }) {
  const [agrandie, setAgrandie] = useState(false);
  const img = useImageOeuvre(oeuvre.image);
  const image = oeuvre.image && (img.src || img.attente) ? oeuvre.image : undefined;
  const suite =
    oeuvre.extrait || oeuvre.suite ? (
      <div className="grid gap-2">
        {oeuvre.extrait && (
          <blockquote className="border-l-[3px] border-accent pl-3 text-[14.5px] italic leading-relaxed">
            {formule(oeuvre.extrait)}
          </blockquote>
        )}
        {oeuvre.suite && <Paragraphe texte={oeuvre.suite} />}
      </div>
    ) : undefined;
  return (
    <Cadre id={oeuvre.id} etiquette={`L'œuvre du jour · ${NOMS_GENRE[oeuvre.genre] ?? "Œuvre"}`} titre={oeuvre.titre} suite={suite}>
      <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3.5">
        {image ? (
          <button
            type="button"
            onClick={() => setAgrandie(true)}
            aria-label={`Agrandir : ${oeuvre.titre}`}
            className="overflow-hidden rounded-[10px] border border-line bg-blush"
          >
            {img.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.src}
                alt={oeuvre.titre}
                loading="lazy"
                onError={img.rater}
                className="aspect-[3/4] w-full object-cover"
              />
            ) : (
              <span className="block aspect-[3/4] w-full" />
            )}
          </button>
        ) : (
          <div
            aria-hidden
            className="copper-bg flex aspect-[3/4] items-center justify-center rounded-[10px] text-on-accent"
          >
            <Quote size={30} />
          </div>
        )}
        <div className="grid min-w-0 gap-1">
          <Titre>{formule(oeuvre.titre)}</Titre>
          <p className="text-[13.5px] text-muted">
            {oeuvre.auteur} · {oeuvre.date}
          </p>
          {oeuvre.lieu && <p className="text-[13.5px] text-muted">{oeuvre.lieu}</p>}
        </div>
      </div>
      <ul className="grid gap-1.5 text-[14px] leading-snug">
        {oeuvre.points.map((p, i) => (
          <li key={i} className="grid grid-cols-[14px_minmax(0,1fr)] gap-1.5">
            <span className="font-bold text-accent">›</span>
            <span>{formule(p)}</span>
          </li>
        ))}
      </ul>
      {oeuvre.aPlacer && <Utile titre="À placer en copie" texte={oeuvre.aPlacer} />}
      {image && (
        <ImageAgrandie
          image={image}
          src={img.src}
          copie={img.copie}
          titre={oeuvre.titre}
          ouverte={agrandie}
          fermer={() => setAgrandie(false)}
        />
      )}
    </Cadre>
  );
}

function ImageAgrandie({
  image,
  src,
  copie,
  titre,
  ouverte,
  fermer,
}: {
  image: ImageOeuvre;
  src?: string;
  copie: boolean;
  titre: string;
  ouverte: boolean;
  fermer: () => void;
}) {
  // La copie du stockage fait 960 px ; sinon Wikimedia sert aussi 1280, 1920 px…
  const grande = copie && src ? src : image.url.replace(/\/(\d+)px-/, "/1920px-");
  return (
    <Fenetre ouverte={ouverte} fermer={fermer} titre={titre}>
      <figure className="grid gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={grande}
          onError={(e) => {
            if (!copie && e.currentTarget.src !== image.url) e.currentTarget.src = image.url;
          }}
          alt={titre}
          className="max-h-[70dvh] w-full rounded-xl object-contain"
        />
        <figcaption className="text-[12.5px] text-muted">
          {image.credit} ·{" "}
          <a href={image.page} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
            Wikimedia Commons <ExternalLink size={12} />
          </a>
        </figcaption>
      </figure>
    </Fenetre>
  );
}

function CarteActu({ actu }: { actu: ActuDuJour }) {
  const j = -joursAvant(actu.date);
  const quand = j <= 0 ? "aujourd'hui" : j === 1 ? "hier" : `il y a ${j} jours`;
  return (
    <Cadre
      id={actu.id}
      etiquette={
        <>
          <Newspaper size={13} /> Actualité · {quand}
        </>
      }
      titre={actu.titre}
      suite={actu.suite ? <Paragraphe texte={actu.suite} /> : undefined}
    >
      <Titre>{formule(actu.titre)}</Titre>
      <Paragraphe texte={actu.texte} />
      <p className="text-[12.5px] text-muted">
        Vérifié dans :{" "}
        {actu.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
              {s.nom}
            </a>
          </span>
        ))}
      </p>
    </Cadre>
  );
}
