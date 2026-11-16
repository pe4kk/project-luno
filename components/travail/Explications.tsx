"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Clock, HelpCircle, Send, Trash2 } from "lucide-react";
import { formule } from "@/components/Formule";
import { ZoneDictee } from "@/components/Dictee";
import { Bouton, BoutonIcone, Fenetre, classeSaisie, pluriel } from "@/components/ui";
import {
  envoyerDemande,
  explicationsDe,
  prochainPassage,
  supprimerDemande,
  useDemandes,
  type Demande,
  type ReponseExplication,
} from "@/lib/demandes";
import { synchroDisponible, useSynchro } from "@/lib/synchro";
import type { Chapitre } from "@/lib/types";

/**
 * « Demander une explication » (option A des maquettes, choisie le 2026-11-16) : on
 * sélectionne un passage du cours qui bloque (fiche, Déf, cartes, dates), une bulle
 * « Expliquer » apparaît sous la sélection ; on dit ce qui coince (écrit ou dicté) et la
 * demande part à Claude (type « lecon » avec `meta.explication`). La tâche planifiée y
 * répond à son prochain passage ; la réponse s'affiche en haut de l'onglet, sous le
 * passage cité.
 */

type Selection = { texte: string; x: number; y: number };

/** Sélection en cours dans `zone` (au moins 3 caractères), avec la place de la bulle. */
function useSelectionDans(zone: React.RefObject<HTMLElement | null>, actif: boolean) {
  const [sel, setSel] = useState<Selection | null>(null);
  useEffect(() => {
    if (!actif) return;
    let attente = 0;
    const lire = () => {
      window.clearTimeout(attente);
      // Laisse l'iPhone finir d'ajuster la sélection (poignées) avant de placer la bulle.
      attente = window.setTimeout(() => {
        const s = window.getSelection();
        const el = zone.current;
        if (!s || s.isCollapsed || !el || s.rangeCount === 0) return setSel(null);
        const r = s.getRangeAt(0);
        if (!el.contains(r.commonAncestorContainer)) return setSel(null);
        // On ne propose pas d'expliquer ce qu'on tape dans un champ.
        const noeud = r.commonAncestorContainer instanceof Element ? r.commonAncestorContainer : r.commonAncestorContainer.parentElement;
        if (noeud?.closest("input, textarea, [contenteditable]")) return setSel(null);
        const texte = s.toString().replace(/\s+/g, " ").trim();
        if (texte.length < 3) return setSel(null);
        const rect = r.getBoundingClientRect();
        setSel({
          texte: texte.slice(0, 800),
          x: Math.min(window.innerWidth - 90, Math.max(90, rect.left + rect.width / 2)),
          y: rect.bottom + window.scrollY + 10,
        });
      }, 180);
    };
    document.addEventListener("selectionchange", lire);
    return () => {
      window.clearTimeout(attente);
      document.removeEventListener("selectionchange", lire);
    };
  }, [zone, actif]);
  return [sel, setSel] as const;
}

export function ZoneExplicable({
  chapitre,
  matiere,
  onglet,
  children,
}: {
  chapitre: Chapitre;
  matiere: string;
  onglet: string;
  children: ReactNode;
}) {
  const zone = useRef<HTMLDivElement>(null);
  const [passage, setPassage] = useState<string | null>(null);
  const [sel, setSel] = useSelectionDans(zone, passage === null);
  const liste = explicationsDe(useDemandes((d) => d.liste), chapitre.id, chapitre.publieId).filter(
    (d) => !d.meta.onglet || d.meta.onglet === onglet,
  );

  return (
    <div>
      {liste.length > 0 && <ListeExplications liste={liste} />}
      <div ref={zone}>{children}</div>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {sel && (
              <motion.button
                key="bulle"
                type="button"
                initial={{ opacity: 0, transform: "translate3d(-50%, 6px, 0)" }}
                animate={{ opacity: 1, transform: "translate3d(-50%, 0px, 0)" }}
                exit={{ opacity: 0, transform: "translate3d(-50%, 6px, 0)" }}
                transition={{ duration: 0.16 }}
                // Garder la sélection : le bouton ne prend pas le focus au toucher.
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => {
                  setPassage(sel.texte);
                  setSel(null);
                }}
                style={{ position: "absolute", left: sel.x, top: sel.y }}
                className="z-40 inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-ink px-3.5 text-[14px] font-semibold text-bg shadow-pop"
              >
                <HelpCircle size={16} /> Expliquer
              </motion.button>
            )}
          </AnimatePresence>,
          document.body,
        )}
      <FenetreExplication
        passage={passage}
        fermer={() => {
          setPassage(null);
          window.getSelection()?.removeAllRanges();
        }}
        chapitre={chapitre}
        matiere={matiere}
        onglet={onglet}
      />
    </div>
  );
}

function FenetreExplication({
  passage,
  fermer,
  chapitre,
  matiere,
  onglet,
}: {
  passage: string | null;
  fermer: () => void;
  chapitre: Chapitre;
  matiere: string;
  onglet: string;
}) {
  const connecte = useSynchro((s) => s.session !== null);
  const [blocage, setBlocage] = useState("");
  const [etat, setEtat] = useState<"saisie" | "envoi" | "envoye" | "erreur">("saisie");
  const [vu, setVu] = useState<string | null>(null);
  // Nouvelle sélection : la fenêtre repart vide (état réinitialisé pendant le rendu).
  if (passage !== vu) {
    setVu(passage);
    setBlocage("");
    setEtat("saisie");
  }

  const envoyer = async () => {
    if (!passage) return;
    setEtat("envoi");
    try {
      await envoyerDemande(
        "lecon",
        `Explication · ${chapitre.titre}`,
        [
          "[Luno] Explication d'un passage du cours",
          `Matière : ${matiere}`,
          `Chapitre : ${chapitre.titre}`,
          `Onglet : ${onglet}`,
          "",
          `Passage : « ${passage} »`,
          "",
          blocage.trim() ? `Ce qui me bloque : ${blocage.trim()}` : "Ce qui me bloque : (rien de précisé, explique plus simplement)",
          "",
          "Réponse attendue : { explication: { texte, exemple?, piege? } }. Explique plus simplement, comme mon prof, avec un exemple concret et le piège à éviter ; mêmes notations que les contenus de Luno.",
        ].join("\n"),
        {
          explication: true,
          passage,
          matiere,
          chapitre: chapitre.titre,
          chapitreId: chapitre.id,
          ...(chapitre.publieId ? { publieId: chapitre.publieId } : {}),
          onglet,
        },
      );
      setEtat("envoye");
    } catch {
      setEtat("erreur");
    }
  };

  return (
    <Fenetre ouverte={passage !== null} fermer={fermer} titre="Demander une explication">
      {passage && (
        <div className="grid gap-3">
          <blockquote className="rounded-xl border-l-4 border-accent bg-ink/5 px-3.5 py-2.5 text-[14.5px] leading-relaxed">
            {formule(passage)}
          </blockquote>
          {etat === "envoye" ? (
            <p className="flex items-start gap-1.5 text-[14px] text-ok" role="status">
              <Check size={16} className="mt-0.5 shrink-0" />
              Demande envoyée. Claude passe {prochainPassage()} : l&apos;explication s&apos;affichera en haut de cet
              onglet, sous le passage.
            </p>
          ) : !synchroDisponible() || !connecte ? (
            <p className="text-[14px] leading-relaxed">
              <strong>Il faut un compte pour demander une explication.</strong> Ouvre « Mes données » (la roue
              dentée en haut), connecte-toi, puis sélectionne de nouveau le passage.
            </p>
          ) : (
            <>
              <label className="text-[14px] font-semibold" htmlFor="blocage-explication">
                Qu&apos;est-ce qui te bloque ? <span className="font-normal text-muted">(facultatif)</span>
              </label>
              <ZoneDictee
                id="blocage-explication"
                value={blocage}
                changer={setBlocage}
                rows={3}
                placeholder="Ex. Pourquoi « même sens » ? La balle monte alors que le poids va vers le bas…"
                className={classeSaisie}
              />
              <p className="flex items-center gap-1.5 text-[13px] text-muted">
                <Clock size={14} /> Claude passe quatre fois par jour. Prochain passage : {prochainPassage()}.
              </p>
              <Bouton onClick={() => void envoyer()} disabled={etat === "envoi"}>
                <Send size={16} /> {etat === "envoi" ? "Envoi…" : "Envoyer à Claude"}
              </Bouton>
              {etat === "erreur" && (
                <p className="text-[13.5px] text-bad" role="alert">
                  L&apos;envoi a échoué. Vérifie ta connexion et réessaie.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </Fenetre>
  );
}

/** Les explications demandées dans cet onglet : prêtes, ou en attente du passage de Claude. */
function ListeExplications({ liste }: { liste: Demande[] }) {
  const [ouvert, setOuvert] = useState(true);
  const pretes = liste.filter((d) => d.statut === "prete").length;
  return (
    <section className="mb-5 rounded-[18px] border border-line bg-surface p-4 shadow-card sm:p-5">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-[15px] font-semibold">
          Tes explications{" "}
          <span className="font-normal text-muted">
            · {pluriel(pretes, "prête", "prêtes")}
            {liste.length > pretes ? `, ${liste.length - pretes} en attente` : ""}
          </span>
        </span>
        <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${ouvert ? "rotate-180" : ""}`} />
      </button>
      {ouvert && (
        <ul className="mt-3 grid gap-3">
          {liste.map((d) => (
            <Explication key={d.id} d={d} />
          ))}
        </ul>
      )}
    </section>
  );
}

function Explication({ d }: { d: Demande }) {
  const r = d.statut === "prete" ? (d.reponse as ReponseExplication | null)?.explication : null;
  return (
    <li className="grid gap-2 border-t border-line pt-3 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-2">
        <blockquote className="min-w-0 flex-1 border-l-[3px] border-accent pl-3 text-[13.5px] italic leading-relaxed text-muted">
          {formule(d.meta.passage ?? "")}
        </blockquote>
        <BoutonIcone label="Retirer cette explication" onClick={() => void supprimerDemande(d.id)} className="-mr-2 -mt-2">
          <Trash2 size={16} />
        </BoutonIcone>
      </div>
      {r ? (
        <div className="grid gap-2 text-[14.5px] leading-relaxed">
          <p className="whitespace-pre-line">{formule(r.texte)}</p>
          {r.exemple && (
            <p>
              <span className="surtitre mr-1.5 text-accent">Exemple</span>
              {formule(r.exemple)}
            </p>
          )}
          {r.piege && (
            <p>
              <span className="surtitre mr-1.5 text-bad">Le piège</span>
              {formule(r.piege)}
            </p>
          )}
        </div>
      ) : d.statut === "erreur" ? (
        <p className="text-[13.5px] text-bad">Claude n&apos;a pas pu répondre : {d.erreur ?? "réessaie plus tard"}.</p>
      ) : (
        <p className="flex items-center gap-1.5 rounded-lg bg-accent-soft px-3 py-2 text-[13px] text-ink">
          <Clock size={14} className="shrink-0" /> Réponse au prochain passage de Claude, {prochainPassage()}.
        </p>
      )}
    </li>
  );
}
