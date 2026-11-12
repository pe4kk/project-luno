"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Calculator, Eraser, Highlighter, MoveUpRight, NotebookPen, PenLine, Pencil, Trash2, Undo2, X } from "lucide-react";
import { evaluer, ecrireAvecCs } from "@/lib/calcul";
import { classePastille, usePastille } from "@/lib/pastille";
import { formule, IconeFraction } from "@/components/Formule";
import { versNotation } from "@/lib/saisie";

/**
 * Brouillon pendant les exercices et les interros : une feuille à petits carreaux où
 * dessiner (doigt, souris, stylet), des notes, et une calculatrice. Sur téléphone, il
 * glisse du bas de l'écran ; sur ordinateur, il s'ouvre à côté de la question. Chaque
 * question a son brouillon (`cle`), gardé tant que la page reste ouverte ; il n'est
 * jamais noté.
 */

type Outil = "stylo" | "surligneur" | "gomme" | "fleche";
type Couleur = "ink" | "copper" | "accent" | "ok";
type Trait = { outil: Outil; couleur: Couleur; points: [number, number, number][] };
type Feuille = { traits: Trait[]; notes: string };

// En mémoire seulement : un brouillon ne sert que pendant l'exercice.
const feuilles = new Map<string, Feuille>();
const feuille = (cle: string) => {
  let f = feuilles.get(cle);
  if (!f) feuilles.set(cle, (f = { traits: [], notes: "" }));
  return f;
};
const historique: { expr: string; res: number }[] = [];

const COULEURS: { c: Couleur; nom: string }[] = [
  { c: "ink", nom: "Encre" },
  { c: "copper", nom: "Cuivre (forces)" },
  { c: "accent", nom: "Terracotta" },
  { c: "ok", nom: "Vert" },
];

/** `null` avant le premier rendu dans le navigateur (le portail attend `document`). */
const useGrandEcran = () => {
  const [grand, setGrand] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px)");
    const maj = () => setGrand(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);
  return grand;
};

/**
 * Enveloppe un lecteur d'exercice : bouton « Brouillon », et le brouillon lui-même.
 * `versAN` (calculs) permet d'envoyer le résultat de la calculatrice dans la réponse.
 */
export function AvecBrouillon({
  cle,
  children,
  cs,
  versAN,
}: {
  cle: string;
  children: ReactNode;
  cs?: number;
  versAN?: (texte: string) => void;
}) {
  const grand = useGrandEcran();
  const [ouvert, setOuvert] = useState(false);
  // Téléphone : la page derrière la feuille ne doit pas bouger pendant qu'on dessine.
  // Dans un navigateur ouvert depuis une appli (✕ en haut, boussole en bas), tirer vers
  // le bas quand la page est tout en haut ferme le navigateur : vu sur son iPhone le
  // 2026-11-12, chaque trait vertical faisait descendre toute la fenêtre. On garde donc
  // la page à au moins 1 px du haut, et le site refuse lui-même tout glissement de doigt
  // dans le brouillon (sauf dans les zones qui défilent : notes, calculatrice).
  useEffect(() => {
    if (!ouvert || grand !== false) return;
    const html = document.documentElement;
    const body = document.body;
    const avant = { marge: body.style.paddingBottom, rebond: html.style.overscrollBehavior, y: window.scrollY };
    body.style.paddingBottom = "100dvh";
    html.style.overscrollBehavior = "none";
    if (window.scrollY < 1) window.scrollTo(0, 1);
    const position = window.scrollY;
    const bloquer = (e: TouchEvent) => {
      const cible = e.target as HTMLElement | null;
      if (!cible?.closest?.("[data-brouillon]")) return;
      if (cible.closest("[data-defile]")) return;
      e.preventDefault();
    };
    // Si la page bouge quand même (barre d'adresse, clavier), on la remet en place.
    const recaler = () => {
      // Pendant la saisie au clavier (notes), iOS déplace la page pour montrer le champ.
      if (document.activeElement?.matches?.("textarea, input")) return;
      if (window.scrollY < 1) window.scrollTo(0, position);
    };
    document.addEventListener("touchmove", bloquer, { passive: false });
    window.addEventListener("scroll", recaler);
    return () => {
      document.removeEventListener("touchmove", bloquer);
      window.removeEventListener("scroll", recaler);
      body.style.paddingBottom = avant.marge;
      html.style.overscrollBehavior = avant.rebond;
      window.scrollTo(0, avant.y);
    };
  }, [ouvert, grand]);
  // Une séance = un jeu de brouillons : une nouvelle série repart d'une feuille blanche.
  const [seance] = useState(() => Math.random().toString(36).slice(2));
  const panneau = <Panneau cle={`${seance}:${cle}`} cs={cs} versAN={versAN} fermer={() => setOuvert(false)} />;

  return (
    <>
      <div
        className={
          ouvert && grand === true
            ? "grid grid-cols-[minmax(0,1fr)_minmax(380px,46%)] items-start gap-6"
            : ""
        }
      >
        {/* En bas, de la place pour le bouton rond : il ne cache pas la dernière ligne. */}
        <div className="min-w-0 pb-16 lg:pb-0">{children}</div>
        {ouvert && grand === true && (
          <motion.aside
            initial={{ opacity: 0, transform: "translate3d(24px, 0, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0px, 0, 0)" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-24 h-[calc(100dvh-8rem)] min-h-[480px] overflow-hidden rounded-[18px] border border-line bg-surface shadow-card"
          >
            {panneau}
          </motion.aside>
        )}
      </div>

      {grand !== null && createPortal(
      <>
      <AnimatePresence>
        {!ouvert && (
          <motion.button
            key="bouton"
            type="button"
            initial={{ opacity: 0, transform: "translate3d(0, 12px, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
            exit={{ opacity: 0, transform: "translate3d(0, 12px, 0)" }}
            onClick={() => setOuvert(true)}
            aria-label="Brouillon"
            title="Brouillon"
            // Rond et discret sur téléphone, pour ne rien cacher de la question.
            className="fixed bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+84px)] right-3 z-30 flex size-12 items-center justify-center gap-2 rounded-full bg-accent text-[14px] font-semibold text-on-accent shadow-pop lg:bottom-6 lg:right-6 lg:size-auto lg:min-h-11 lg:px-4"
          >
            <PenLine size={18} /> <span className="hidden lg:inline">Brouillon</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ouvert && grand === false && (
          <>
            <motion.div
              key="voile"
              data-brouillon
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOuvert(false)}
              className="fixed inset-0 z-[45] bg-night/20"
            />
            <motion.div
              key="feuille"
              data-brouillon
              role="dialog"
              aria-label="Brouillon"
              initial={{ transform: "translate3d(0, 100%, 0)" }}
              animate={{ transform: "translate3d(0, 0%, 0)" }}
              exit={{ transform: "translate3d(0, 100%, 0)" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-[46] flex h-[72dvh] touch-pan-y overflow-x-hidden overscroll-contain flex-col overflow-hidden rounded-t-[24px] bg-surface pb-[env(safe-area-inset-bottom)] shadow-pop"
            >
              <button
                type="button"
                aria-label="Fermer le brouillon"
                onClick={() => setOuvert(false)}
                className="mx-auto flex h-5 w-20 shrink-0 items-center justify-center"
              >
                <span className="h-1.5 w-10 rounded-full bg-line" />
              </button>
              {panneau}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </>,
      document.body,
      )}
    </>
  );
}

const ONGLETS = [
  { id: "dessin", label: "Dessin", icone: Pencil },
  { id: "notes", label: "Notes", icone: NotebookPen },
  { id: "calcul", label: "Calcul", icone: Calculator },
] as const;
type Onglet = (typeof ONGLETS)[number]["id"];

function Panneau({
  cle,
  cs,
  versAN,
  fermer,
}: {
  cle: string;
  cs?: number;
  versAN?: (texte: string) => void;
  fermer: () => void;
}) {
  const [onglet, setOnglet] = useState<Onglet>("dessin");
  const { conteneur, pastille } = usePastille(onglet);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-w-0 shrink-0 items-center gap-2 px-3 pb-2.5 pt-1 sm:px-4 lg:border-b lg:border-line lg:py-3">
        <p className="shrink-0 font-display text-[18px] leading-none sm:text-[20px] max-[340px]:sr-only">Brouillon</p>
        <div
          ref={conteneur}
          role="tablist"
          aria-label="Outil du brouillon"
          className="relative ml-auto flex min-w-0 rounded-full border border-line bg-bg/60 p-0.5"
        >
          <span ref={pastille} className={`${classePastille} rounded-full bg-ink`} />
          {ONGLETS.map((o) => {
            const actif = onglet === o.id;
            return (
              <button
                key={o.id}
                role="tab"
                aria-selected={actif}
                data-actif={actif}
                onClick={() => setOnglet(o.id)}
                className={`relative z-10 flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold transition-colors duration-200 sm:px-3 ${
                  actif ? "text-bg" : "text-muted hover:text-ink"
                }`}
              >
                <o.icone size={14} />
                {/* Sur un écran étroit (ou un texte agrandi), les icônes seules. */}
                <span className="max-[420px]:sr-only">{o.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={fermer}
          aria-label="Fermer le brouillon"
          className="-mr-1 flex size-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        {onglet === "dessin" ? (
          <Dessin key={cle} cle={cle} />
        ) : onglet === "notes" ? (
          <Notes key={cle} cle={cle} />
        ) : (
          <Calculatrice cs={cs} versAN={versAN} />
        )}
      </div>
    </div>
  );
}

// ———————————————————— Dessin ————————————————————

function Dessin({ cle }: { cle: string }) {
  const toile = useRef<HTMLCanvasElement>(null);
  // Sur iPhone, `touch-action: none` ne suffit pas toujours : un trait vertical faisait
  // défiler la page. On refuse donc le geste tactile à la source (écouteurs non passifs) ;
  // les événements « pointer » qui dessinent continuent d'arriver.
  useEffect(() => {
    const c = toile.current;
    if (!c) return;
    const bloquer = (e: TouchEvent) => e.preventDefault();
    c.addEventListener("touchstart", bloquer, { passive: false });
    c.addEventListener("touchmove", bloquer, { passive: false });
    return () => {
      c.removeEventListener("touchstart", bloquer);
      c.removeEventListener("touchmove", bloquer);
    };
  }, []);
  const base = useRef<HTMLCanvasElement | null>(null);
  const encours = useRef<Trait | null>(null);
  const image = useRef(0);
  const [outil, setOutil] = useState<Outil>("stylo");
  const [couleur, setCouleur] = useState<Couleur>("ink");
  const [nbTraits, setNbTraits] = useState(() => feuille(cle).traits.length);

  const couleurs = useCallback(() => {
    const st = getComputedStyle(document.documentElement);
    const v = (n: Couleur) => st.getPropertyValue(`--${n}`).trim();
    return { ink: v("ink"), copper: v("copper"), accent: v("accent"), ok: v("ok") } as Record<Couleur, string>;
  }, []);

  const tracer = useCallback((ctx: CanvasRenderingContext2D, t: Trait, palette: Record<Couleur, string>) => {
    const p = t.points;
    if (!p.length) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = palette[t.couleur];
    ctx.globalCompositeOperation = t.outil === "gomme" ? "destination-out" : "source-over";
    ctx.globalAlpha = t.outil === "surligneur" ? 0.3 : 1;
    const epaisseur = t.outil === "surligneur" ? 16 : t.outil === "gomme" ? 22 : 2.6;
    if (t.outil === "fleche") {
      const [x0, y0] = p[0];
      const [x1, y1] = p[p.length - 1];
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      const a = Math.atan2(y1 - y0, x1 - x0);
      const l = Math.min(14, Math.hypot(x1 - x0, y1 - y0) / 3);
      ctx.moveTo(x1 - l * Math.cos(a - 0.45), y1 - l * Math.sin(a - 0.45));
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1 - l * Math.cos(a + 0.45), y1 - l * Math.sin(a + 0.45));
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (p.length === 1) {
      ctx.fillStyle = palette[t.couleur];
      ctx.beginPath();
      ctx.arc(p[0][0], p[0][1], epaisseur / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }
    // Courbe lissée : on passe par le milieu de chaque segment. D'un seul tracé quand
    // l'épaisseur ne change pas (sinon le surligneur fait des pointillés aux jointures).
    if (t.outil !== "stylo" || p.every((x) => x[2] === p[0][2])) {
      ctx.lineWidth = t.outil === "stylo" ? epaisseur * (0.55 + p[0][2] * 0.9) : epaisseur;
      ctx.beginPath();
      ctx.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length - 1; i++)
        ctx.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2);
      ctx.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
      ctx.stroke();
      ctx.restore();
      return;
    }
    for (let i = 1; i < p.length; i++) {
      const [xa, ya, pa] = p[i - 1];
      const [xb, yb] = p[i];
      const [xc, yc] = p[i + 1] ?? p[i];
      ctx.lineWidth = t.outil === "stylo" ? epaisseur * (0.55 + pa * 0.9) : epaisseur;
      ctx.beginPath();
      ctx.moveTo(i === 1 ? xa : (xa + xb) / 2, i === 1 ? ya : (ya + yb) / 2);
      ctx.quadraticCurveTo(xb, yb, (xb + xc) / 2, (yb + yc) / 2);
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  /** Redessine les traits finis dans la toile de fond, puis l'affiche. */
  const toutRedessiner = useCallback(() => {
    const c = toile.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const b = (base.current ??= document.createElement("canvas"));
    b.width = c.width;
    b.height = c.height;
    const ctx = b.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const palette = couleurs();
    for (const t of feuille(cle).traits) tracer(ctx, t, palette);
    const vu = c.getContext("2d")!;
    vu.setTransform(1, 0, 0, 1, 0, 0);
    vu.clearRect(0, 0, c.width, c.height);
    vu.drawImage(b, 0, 0);
  }, [cle, couleurs, tracer]);

  // Taille de la toile (écran net), à chaque redimensionnement.
  useLayoutEffect(() => {
    const c = toile.current;
    if (!c) return;
    const ajuster = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = c.getBoundingClientRect();
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      toutRedessiner();
    };
    ajuster();
    const o = new ResizeObserver(ajuster);
    o.observe(c);
    // Changement de thème : les couleurs suivent.
    const m = new MutationObserver(toutRedessiner);
    m.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      o.disconnect();
      m.disconnect();
    };
  }, [toutRedessiner]);

  const afficherEnCours = () => {
    cancelAnimationFrame(image.current);
    image.current = requestAnimationFrame(() => {
      const c = toile.current;
      const t = encours.current;
      if (!c || !t) return;
      const ctx = c.getContext("2d")!;
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
      if (t.outil === "gomme") {
        // La gomme agit sur les traits déjà finis : on redessine fond + gomme.
        const b = base.current!;
        const bctx = b.getContext("2d")!;
        bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        bctx.clearRect(0, 0, c.width, c.height);
        const palette = couleurs();
        for (const x of feuille(cle).traits) tracer(bctx, x, palette);
        tracer(bctx, t, palette);
        ctx.drawImage(b, 0, 0);
        return;
      }
      ctx.drawImage(base.current!, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tracer(ctx, t, couleurs());
    });
  };

  const point = (e: React.PointerEvent | PointerEvent): [number, number, number] => {
    const r = toile.current!.getBoundingClientRect();
    // Souris et doigt n'ont pas de pression : on prend une valeur moyenne.
    const pression = e.pointerType === "pen" && e.pressure > 0 ? e.pressure : 0.5;
    return [e.clientX - r.left, e.clientY - r.top, pression];
  };

  return (
    <>
      <div className="relative mx-3 min-h-0 flex-1 overflow-hidden rounded-[14px] border border-line papier-carreaux lg:mx-0 lg:rounded-none lg:border-0">
        <canvas
          ref={toile}
          aria-label="Feuille de brouillon : dessine avec le doigt, la souris ou un stylet"
          className="absolute inset-0 size-full touch-none"
          style={{ cursor: outil === "gomme" ? "cell" : "crosshair" }}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            encours.current = { outil, couleur, points: [point(e)] };
            afficherEnCours();
          }}
          onPointerMove={(e) => {
            const t = encours.current;
            if (!t) return;
            const evenements = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
            if (t.outil === "fleche") t.points[1] = point(evenements[evenements.length - 1]);
            else for (const x of evenements) t.points.push(point(x));
            afficherEnCours();
          }}
          onPointerUp={() => {
            const t = encours.current;
            if (!t) return;
            encours.current = null;
            feuille(cle).traits.push(t);
            setNbTraits(feuille(cle).traits.length);
            toutRedessiner();
          }}
          onPointerCancel={() => {
            encours.current = null;
            toutRedessiner();
          }}
        />
        {nbTraits === 0 && (
          <p className="pointer-events-none absolute inset-x-0 top-[40%] text-center font-hand text-[22px] text-muted/70">
            Schéma, calculs, idées : rien n&apos;est noté.
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 px-3 py-2.5 lg:border-t lg:border-line">
        {(
          [
            ["stylo", Pencil, "Stylo"],
            ["surligneur", Highlighter, "Surligneur"],
            ["fleche", MoveUpRight, "Flèche droite"],
            ["gomme", Eraser, "Gomme"],
          ] as const
        ).map(([o, Icone, nom]) => (
          <button
            key={o}
            type="button"
            aria-label={nom}
            title={nom}
            aria-pressed={outil === o}
            onClick={() => setOutil(o)}
            className={`flex size-10 items-center justify-center rounded-[10px] border transition-colors duration-150 ${
              outil === o ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink hover:border-ink/30"
            }`}
          >
            <Icone size={17} />
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-line" aria-hidden />
        {COULEURS.map(({ c, nom }) => (
          <button
            key={c}
            type="button"
            aria-label={nom}
            title={nom}
            aria-pressed={couleur === c}
            onClick={() => {
              setCouleur(c);
              if (outil === "gomme") setOutil("stylo");
            }}
            className="flex size-8 items-center justify-center"
          >
            <span
              className={`size-5 rounded-full transition-transform duration-150 ${couleur === c ? "scale-110 ring-2 ring-accent ring-offset-2 ring-offset-surface" : ""}`}
              style={{ background: `var(--${c})` }}
            />
          </button>
        ))}
        <span className="ml-auto" />
        <button
          type="button"
          aria-label="Annuler le dernier trait"
          title="Annuler"
          disabled={nbTraits === 0}
          onClick={() => {
            feuille(cle).traits.pop();
            setNbTraits(feuille(cle).traits.length);
            toutRedessiner();
          }}
          className="flex size-10 items-center justify-center rounded-[10px] border border-line bg-surface hover:border-ink/30 disabled:opacity-40"
        >
          <Undo2 size={17} />
        </button>
        <button
          type="button"
          aria-label="Tout effacer"
          title="Tout effacer"
          disabled={nbTraits === 0}
          onClick={() => {
            feuille(cle).traits = [];
            setNbTraits(0);
            toutRedessiner();
          }}
          className="flex size-10 items-center justify-center rounded-[10px] border border-line bg-surface hover:border-ink/30 disabled:opacity-40"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </>
  );
}

// ———————————————————— Notes ————————————————————

function Notes({ cle }: { cle: string }) {
  const [texte, setTexte] = useState(() => feuille(cle).notes);
  return (
    <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 lg:p-4">
      <textarea
        aria-label="Notes de brouillon"
        data-defile
        value={texte}
        onChange={(e) => {
          setTexte(e.target.value);
          feuille(cle).notes = e.target.value;
        }}
        placeholder="Données, idées, plan de ta réponse…"
        className="papier-lignes min-h-0 flex-1 resize-none rounded-[14px] border border-line px-4 py-2 text-[16px] leading-[28px] outline-none focus:border-accent"
      />
    </div>
  );
}

// ———————————————————— Calculatrice ————————————————————

const TOUCHES_CALC: { vu: string; mis: string; style?: "op" | "egal" | "fonc"; nom?: string }[] = [
  { vu: "(", mis: "(", style: "fonc" },
  { vu: ")", mis: ")", style: "fonc" },
  { vu: "a/b", mis: "()÷()", style: "fonc", nom: "Fraction" },
  { vu: "x²", mis: "²", style: "fonc", nom: "Au carré" },
  { vu: "÷", mis: "÷", style: "op", nom: "Diviser" },
  { vu: "7", mis: "7" },
  { vu: "8", mis: "8" },
  { vu: "9", mis: "9" },
  { vu: "×10ⁿ", mis: "×10^", style: "fonc", nom: "Puissance de dix" },
  { vu: "×", mis: "×", style: "op", nom: "Multiplier" },
  { vu: "4", mis: "4" },
  { vu: "5", mis: "5" },
  { vu: "6", mis: "6" },
  { vu: "√", mis: "√(", style: "fonc", nom: "Racine" },
  { vu: "−", mis: "−", style: "op", nom: "Moins" },
  { vu: "1", mis: "1" },
  { vu: "2", mis: "2" },
  { vu: "3", mis: "3" },
  { vu: "Ans", mis: "Ans", style: "fonc", nom: "Résultat précédent" },
  { vu: "+", mis: "+", style: "op", nom: "Plus" },
  { vu: "0", mis: "0" },
  { vu: ",", mis: "," },
  { vu: "π", mis: "π", style: "fonc", nom: "Pi" },
  { vu: "⌫", mis: "⌫", style: "fonc", nom: "Effacer" },
  { vu: "=", mis: "=", style: "egal", nom: "Égal" },
];

/** « 1,2×10^3×25÷4 » → « 1.2*10^3*25/4 », lisible par `evaluer()`. */
function versExpression(s: string) {
  return s
    .replace(/\s/g, "")
    .replace(/,/g, ".")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/[−–]/g, "-")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/√/g, "sqrt")
    .replace(/π/g, "pi")
    .replace(/Ans/gi, "ans")
    .replace(/(\d|\))(?=pi|ans|sqrt|\()/g, "$1*")
    .replace(/(\))(?=\d)/g, "$1*");
}

/** Résultat lisible : « 4 595,955 », ou « 1,234 × 10⁻⁵ » pour les très petits et grands. */
function afficher(x: number) {
  if (!Number.isFinite(x)) return "Erreur";
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e9 || a < 1e-4)) return ecrireAvecCs(x, 6).replace(/,?0+ ×/, " ×");
  return Number(x.toPrecision(10)).toLocaleString("fr-FR", { maximumFractionDigits: 10 });
}

function Calculatrice({ cs, versAN }: { cs?: number; versAN?: (texte: string) => void }) {
  const [saisie, setSaisie] = useState("");
  const [res, setRes] = useState<number | null>(null);
  const [erreur, setErreur] = useState(false);
  const [n, setN] = useState(cs ?? 2);
  const [envoye, setEnvoye] = useState(false);
  const [, rafraichir] = useState(0);
  const champ = useRef<HTMLInputElement>(null);
  const ans = historique[0]?.res ?? 0;

  const calculer = () => {
    if (!saisie.trim()) return;
    try {
      const x = evaluer(versExpression(saisie), { pi: Math.PI, ans });
      if (!Number.isFinite(x)) throw new Error("infini");
      setRes(x);
      setErreur(false);
      historique.unshift({ expr: saisie, res: x });
      historique.splice(8);
      rafraichir((k) => k + 1);
    } catch {
      setErreur(true);
      setRes(null);
    }
  };

  // Position du curseur dans le calcul : les touches écrivent là où on a touché le
  // champ (par exemple pour ajouter une parenthèse au début), pas toujours à la fin.
  const selection = useRef<[number, number] | null>(null);
  const aPoser = useRef<number | null>(null);
  const noterCurseur = () => {
    const el = champ.current;
    if (el && document.activeElement === el) selection.current = [el.selectionStart ?? el.value.length, el.selectionEnd ?? el.value.length];
  };
  useLayoutEffect(() => {
    const el = champ.current;
    if (aPoser.current === null || !el) return;
    // Sans focus, on retient seulement la position (iOS ouvrirait le champ).
    if (document.activeElement === el) el.setSelectionRange(aPoser.current, aPoser.current);
    selection.current = [aPoser.current, aPoser.current];
    aPoser.current = null;
  });
  const ecrire = (texte: string, debut: number, fin: number) => {
    setSaisie(texte);
    aPoser.current = Math.max(0, Math.min(texte.length, debut));
    void fin;
  };

  const toucher = (mis: string) => {
    setEnvoye(false);
    if (mis === "=") return calculer();
    if (mis === "C") {
      setSaisie("");
      setRes(null);
      setErreur(false);
      selection.current = null;
      return;
    }
    const [debut, fin] = selection.current
      ? [Math.min(selection.current[0], saisie.length), Math.min(selection.current[1], saisie.length)]
      : [saisie.length, saisie.length];
    const avant = saisie.slice(0, debut);
    const apres = saisie.slice(fin);
    if (mis === "⌫") {
      if (fin > debut) return ecrire(avant + apres, debut, debut);
      const raccourci = avant.replace(/(Ans|×10\^|√\(|.)$/u, "");
      return ecrire(raccourci + apres, raccourci.length, raccourci.length);
    }
    // Après un résultat, un opérateur à la fin continue le calcul à partir de lui.
    if (res !== null && !apres && saisie && /^[+−×÷²]/.test(mis) && historique[0]?.expr === saisie) {
      setRes(null);
      return ecrire(`Ans${mis}`, 3 + mis.length, 3 + mis.length);
    }
    if (mis === "()÷()") {
      // Fraction : (numérateur)÷(dénominateur), le curseur dans le numérateur ; une
      // sélection devient le numérateur.
      const choisi = saisie.slice(debut, fin);
      const texte = `(${choisi})÷()`;
      const curseur = choisi ? debut + texte.length - 1 : debut + 1;
      return ecrire(avant + texte + apres, curseur, curseur);
    }
    ecrire(avant + mis + apres, debut + mis.length, debut + mis.length);
  };

  return (
    <div data-defile className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 pb-3 lg:p-4">
      <div className="relative rounded-[14px] bg-bg px-3.5 py-2.5 text-right">
        <button
          type="button"
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => toucher("C")}
          aria-label="Tout effacer"
          className="absolute left-2 top-2 rounded-full border border-line bg-surface px-2.5 py-0.5 text-[12.5px] font-semibold text-muted hover:text-ink"
        >
          C
        </button>
        <input
          ref={champ}
          aria-label="Calcul"
          inputMode="none"
          value={saisie}
          onChange={(e) => {
            setSaisie(e.target.value);
            setEnvoye(false);
            noterCurseur();
          }}
          onSelect={noterCurseur}
          onKeyUp={noterCurseur}
          onPointerUp={noterCurseur}
          onKeyDown={(e) => {
            if (e.key === "Enter") calculer();
          }}
          placeholder="1,2×10^3×25÷4,0"
          className="w-full bg-transparent pl-9 text-right text-[17px] text-ink caret-accent outline-none placeholder:text-muted/50"
        />
        {/(÷|\/)/.test(saisie) && (
          <p className="mt-1 text-[17px] leading-relaxed" aria-hidden>
            {formule(
              versNotation(saisie.replace(/÷/g, "/")).replace(/\^(-?\d+)/g, (_, e: string) =>
                e.replace("-", "⁻").replace(/\d/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(c)]),
              ),
            )}
          </p>
        )}
        <p className="mt-0.5 min-h-[44px] font-display text-[34px] leading-tight tabular-nums" aria-live="polite">
          {erreur ? <span className="text-[18px] text-bad">Calcul incomplet</span> : res === null ? "" : afficher(res)}
        </p>
        {res !== null && (
          <div className="mt-1 flex items-center justify-end gap-1.5 text-[13px] font-semibold text-accent">
            <span className="inline-flex items-center rounded-full border border-line bg-surface">
              <button
                type="button"
                aria-label="Moins de chiffres significatifs"
                onClick={() => setN((x) => Math.max(1, x - 1))}
                className="flex size-7 items-center justify-center rounded-full hover:bg-accent-soft"
              >
                −
              </button>
              <span className="px-0.5 tabular-nums">{n} c.s</span>
              <button
                type="button"
                aria-label="Plus de chiffres significatifs"
                onClick={() => setN((x) => Math.min(6, x + 1))}
                className="flex size-7 items-center justify-center rounded-full hover:bg-accent-soft"
              >
                +
              </button>
            </span>
            <span>→ {ecrireAvecCs(res, n)}</span>
          </div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {TOUCHES_CALC.map((t) => (
          <button
            key={t.vu}
            type="button"
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => toucher(t.mis)}
            aria-label={t.nom}
            className={`flex h-11 items-center justify-center rounded-[10px] text-[16px] transition-colors duration-100 lg:h-10 ${
              t.style === "egal"
                ? "bg-ink font-semibold text-bg active:bg-accent"
                : t.style === "op"
                  ? "bg-accent-soft font-semibold text-accent active:bg-accent active:text-on-accent"
                  : t.style === "fonc"
                    ? "border border-line bg-bg/60 text-[14px] active:bg-accent-soft"
                    : "border border-line bg-surface active:bg-accent-soft"
            }`}
          >
            {t.vu === "a/b" ? <IconeFraction /> : t.vu}
          </button>
        ))}
      </div>
      {versAN && res !== null && (
        <button
          type="button"
          onClick={() => {
            versAN(ecrireAvecCs(res, n).replace(/ × 10/, "×10"));
            setEnvoye(true);
          }}
          className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-ink px-4 text-[14.5px] font-medium text-bg"
        >
          {envoye ? "Mis dans ta réponse ✓" : `Mettre ${ecrireAvecCs(res, n)} dans l'A.N.`}
        </button>
      )}
      {historique.length > 0 && (
        <ul className="mt-3 flex flex-col gap-0.5 text-[13px] text-muted" aria-label="Calculs précédents">
          {historique.slice(0, 4).map((h, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  setSaisie(h.expr);
                  setRes(h.res);
                  setErreur(false);
                  selection.current = null;
                }}
                className="w-full truncate rounded-md px-1.5 py-1 text-right hover:bg-ink/5"
              >
                {h.expr} = <span className="text-ink">{afficher(h.res)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
