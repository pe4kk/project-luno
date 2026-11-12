"use client";

import Link from "next/link";
import { Accents } from "@/components/Accents";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  ListTodo,
  Moon,
  Search,
  Sun,
  Target,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Annulation, BoutonDonnees, SynchroBibliotheque } from "./Donnees";
import { PanneauJour } from "./PanneauJour";
import { MoteurSynchro } from "./Synchro";
import { MiseAJour } from "./MiseAJour";
import { classePastille, usePastille } from "@/lib/pastille";

const ONGLETS = [
  { href: "/", label: "Accueil", icone: Home },
  { href: "/calendrier", label: "Calendrier", icone: CalendarDays },
  { href: "/taches", label: "À faire", icone: ListTodo },
  { href: "/travail", label: "Travail", icone: BookOpen },
  { href: "/apprendre", label: "Apprendre", icone: GraduationCap },
  { href: "/exercices", label: "S'exercer", icone: Target },
];

const rien = () => () => {};
/** Vrai uniquement dans le navigateur, après l'hydratation. */
export function useMonte() {
  return useSyncExternalStore(
    rien,
    () => true,
    () => false,
  );
}

const observerTheme = (cb: () => void) => {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => o.disconnect();
};

function useSombre() {
  return useSyncExternalStore(
    observerTheme,
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );
}

/**
 * Le croissant de Luno : un disque blush, et par-dessus un disque anthracite décalé.
 * Au changement de thème, la lune fait un tour en passant par la pleine lune.
 */
/** Téléphone ou tablette : on y préfère les animations que la carte graphique gère seule. */
const ecranTactile = () =>
  matchMedia("(pointer: coarse)").matches || innerWidth < 768;

function Logo() {
  const sombre = useSombre();
  const portee = useRef<HTMLAnchorElement>(null);
  const avant = useRef<boolean | null>(null);

  useEffect(() => {
    if (avant.current === null || avant.current === sombre) {
      avant.current = sombre;
      return;
    }
    avant.current = sombre;
    const racine = portee.current;
    if (!racine || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Animations natives du navigateur (transform et opacity seulement) : elles tournent
    // sur la carte graphique, même quand la page est occupée par le changement de thème.
    const duration = 900;
    const easing = "cubic-bezier(0.65, 0, 0.35, 1)";
    // Sur ordinateur, le nouveau thème s'ouvre en cercle depuis le bouton, à droite : la
    // lune attend que le cercle l'atteigne. Sur téléphone, c'est un fondu : elle part vite.
    const delay = "startViewTransition" in document ? (ecranTactile() ? 120 : 400) : 0;
    const options = { duration, easing, delay, fill: "backwards" } as const;
    racine.querySelector("[data-lune]")?.animate(
      [
        { transform: "rotate(0deg) scale(1)" },
        { transform: "rotate(180deg) scale(0.86)" },
        { transform: "rotate(360deg) scale(1)" },
      ],
      options,
    );
    racine.querySelector("[data-ombre]")?.animate(
      [
        { transform: "translate(-9px, -3px)" },
        { transform: "translate(1px, 0px)" },
        { transform: "translate(-9px, -3px)" },
      ],
      options,
    );
    racine.querySelector("[data-halo]")?.animate(
      [
        { opacity: 0, transform: "scale(0.7)" },
        { opacity: 0.55, transform: "scale(1.5)", offset: 0.45 },
        { opacity: 0, transform: "scale(1.8)" },
      ],
      { duration: duration * 1.1, easing: "ease-out", delay },
    );
  }, [sombre]);

  return (
    <Link href="/" className="flex items-center gap-2.5" ref={portee}>
      <span className="relative size-[30px]">
        <span
          data-halo
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0"
          style={{ background: "radial-gradient(circle, var(--copper) 0%, transparent 70%)" }}
        />
        <span
          data-lune
          className="relative block size-full overflow-hidden rounded-full bg-blush"
        >
          <span
            data-ombre
            className="absolute inset-0 rounded-full bg-ink"
            style={{ transform: "translate(-9px, -3px)" }}
          />
        </span>
      </span>
      <span className="text-[19px] font-medium uppercase tracking-[0.34em] max-[300px]:sr-only">
        Luno
      </span>
    </Link>
  );
}

/**
 * Change de thème en douceur : le nouveau thème s'ouvre en cercle depuis le bouton
 * (View Transitions). Sans cette API, toutes les couleurs glissent ensemble.
 */
function changerTheme(suivant: string, depuis?: HTMLElement | null) {
  const racine = document.documentElement;
  const appliquer = () => {
    racine.dataset.theme = suivant;
    try {
      localStorage.setItem("luno-theme", suivant);
    } catch {}
  };
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return appliquer();

  const vt = (
    document as Document & {
      startViewTransition?: (f: () => void) => { ready: Promise<void> };
    }
  ).startViewTransition;
  if (!vt) {
    racine.classList.add("theme-glisse");
    appliquer();
    window.setTimeout(() => racine.classList.remove("theme-glisse"), 600);
    return;
  }
  if (ecranTactile()) {
    // Sur téléphone, un cercle (clip-path) oblige à redessiner toute la page à chaque
    // image : saccadé sur iPhone. Le fondu (opacity, transform) reste fluide.
    vt.call(document, appliquer)
      .ready.then(() => {
        racine.animate(
          { opacity: [0, 1], transform: ["scale(1.015)", "scale(1)"] },
          {
            duration: 420,
            easing: "cubic-bezier(0.33, 1, 0.68, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
    return;
  }
  const r = depuis?.getBoundingClientRect();
  const x = r ? r.left + r.width / 2 : innerWidth;
  const y = r ? r.top + r.height / 2 : 0;
  const rayon = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = vt.call(document, appliquer);
  transition.ready
    .then(() => {
      racine.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${rayon}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
}

function BoutonTheme() {
  const monte = useMonte();
  const sombre = useSombre();
  const bouton = useRef<HTMLButtonElement>(null);
  const basculer = () => changerTheme(sombre ? "light" : "dark", bouton.current);
  return (
    <button
      ref={bouton}
      onClick={basculer}
      aria-label={sombre ? "Passer au thème clair" : "Passer au thème sombre"}
      title={sombre ? "Thème clair" : "Thème sombre"}
      className="flex size-11 items-center justify-center rounded-[10px] border border-line bg-surface text-ink transition-colors hover:border-ink/40"
    >
      {monte && (
        <motion.span
          key={String(sombre)}
          initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          {sombre ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      )}
    </button>
  );
}

/**
 * Sur grand écran (2xl), la page et le panneau « Aujourd'hui » côte à côte. Le titre du
 * panneau s'aligne sur le premier bloc de la page : celui marqué `data-aligne-panneau`, sinon
 * ce qui suit l'en-tête de page (`data-entete`). Sur le calendrier, le panneau fait partie
 * de la page (3e colonne) ; sur l'accueil, il n'apparaît pas (mêmes informations).
 */
function ColonnesAvecPanneau({
  chemin,
  children,
}: {
  chemin: string;
  children: ReactNode;
}) {
  const colonne = useRef<HTMLDivElement>(null);
  const [decalage, setDecalage] = useState(0);
  // Largeur maximale de la page quand elle est étroite (liste de tâches, leçon…), sinon null.
  const [etroite, setEtroite] = useState<number | null>(null);
  const avecPanneau = chemin !== "/" && !chemin.startsWith("/calendrier");

  useEffect(() => {
    if (!avecPanneau || !colonne.current) return;
    const el = colonne.current;
    const mesurer = () => {
      const racine = el.firstElementChild?.firstElementChild as
        | HTMLElement
        | null
        | undefined;
      const max = racine ? parseFloat(getComputedStyle(racine).maxWidth) : NaN;
      setEtroite(Number.isFinite(max) && max < 1000 ? max : null);
      const haut = el.getBoundingClientRect().top;
      const repere = el.querySelector<HTMLElement>("[data-aligne-panneau]");
      if (repere)
        return setDecalage(
          Math.max(0, repere.getBoundingClientRect().top - haut),
        );
      const entete = el.querySelector<HTMLElement>("[data-entete]");
      if (!entete) return setDecalage(0);
      const marge = parseFloat(getComputedStyle(entete).marginBottom) || 0;
      setDecalage(
        Math.max(0, entete.getBoundingClientRect().bottom + marge - haut),
      );
    };
    // Après la transition d'entrée de la page, puis à chaque changement de taille.
    const t = setTimeout(mesurer, 450);
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    const mo = new MutationObserver(mesurer);
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      clearTimeout(t);
      ro.disconnect();
      mo.disconnect();
    };
  }, [avecPanneau, chemin]);

  if (!avecPanneau) return <>{children}</>;
  return (
    <div
      className="2xl:mx-auto 2xl:grid 2xl:max-w-(--largeur-page,none) 2xl:grid-cols-[minmax(0,1fr)_340px] 2xl:gap-12"
      // Une page étroite et le panneau forment un bloc centré, au lieu d'un grand vide au milieu.
      style={
        etroite
          ? ({
              "--largeur-page": `${etroite + 48 + 340}px`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div ref={colonne} className="min-w-0">
        {children}
      </div>
      <div className="hidden 2xl:block" style={{ paddingTop: decalage }}>
        <PanneauJour />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const chemin = usePathname();
  const monte = useMonte();
  const { conteneur: navHautConteneur, pastille: navHautPastille } = usePastille<HTMLElement>(chemin);
  const { conteneur: navBasConteneur, pastille: navBasPastille } = usePastille<HTMLElement>(chemin);
  const actif = (href: string) =>
    href === "/" ? chemin === "/" : chemin.startsWith(href);

  return (
    <div className="min-h-dvh">
      {/* Barre du haut */}
      <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1180px] 2xl:max-w-[1920px] items-center justify-between gap-2 px-4 py-3.5 min-[360px]:gap-4 sm:px-8">
          <Logo />
          <nav
            ref={navHautConteneur}
            className="relative hidden items-center gap-1 lg:flex"
            aria-label="Navigation principale"
          >
            <span ref={navHautPastille} className={`${classePastille} rounded-[10px] bg-ink`} />
            {ONGLETS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={actif(href) ? "page" : undefined}
                data-actif={actif(href)}
                className={`relative rounded-[10px] px-3.5 py-2 text-[14px] tracking-[0.04em] transition-colors duration-300 ${
                  actif(href) ? "text-bg" : "text-muted hover:text-ink"
                }`}
              >
                <span className="relative">{label}</span>
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 min-[360px]:gap-2">
            <Link
              href="/recherche"
              aria-label="Rechercher"
              title="Rechercher"
              aria-current={
                chemin.startsWith("/recherche") ? "page" : undefined
              }
              className={`flex size-11 items-center justify-center rounded-[10px] border transition-colors ${
                chemin.startsWith("/recherche")
                  ? "border-ink bg-ink text-bg"
                  : "border-line bg-surface text-ink hover:border-ink/40"
              }`}
            >
              <Search size={18} />
            </Link>
            <BoutonDonnees />
            <BoutonTheme />
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="mx-auto w-full max-w-[1180px] 2xl:max-w-[1920px] px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2 sm:px-8 sm:pt-4 lg:pb-14 lg:pt-6">
        {monte && (
          <ColonnesAvecPanneau chemin={chemin}>
            <motion.div
              key={chemin}
              initial={{ opacity: 0, transform: "translate3d(0, 14px, 0)" }}
              animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </ColonnesAvecPanneau>
        )}
      </main>

      <SynchroBibliotheque />
      <MoteurSynchro />
      <MiseAJour />
      <Accents />
      <Annulation />

      {/* Barre du bas (téléphone) : fond translucide, pastille cuivrée qui glisse sous l'onglet actif */}
      <nav
        ref={navBasConteneur}
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 grid grid-cols-6 rounded-[26px] border border-line bg-surface/90 px-1 py-1.5 shadow-pop backdrop-blur-md lg:hidden"
        aria-label="Navigation principale"
      >
        <span
          ref={navBasPastille}
          className={`${classePastille} copper-bg rounded-full shadow-[0_6px_16px_-6px_rgb(201_139_107_/_0.9)]`}
        />
        {ONGLETS.map(({ href, label, icone: Icone }) => {
          const ici = actif(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={ici ? "page" : undefined}
              className="group relative flex min-w-0 flex-col items-center gap-1 py-1"
            >
              <span
                data-actif={ici}
                className="relative flex h-8 w-12 items-center justify-center"
              >
                <span
                  className={`relative transition-[transform,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    ici ? "-translate-y-px scale-[1.08] text-on-accent" : "text-muted group-active:text-ink"
                  }`}
                >
                  <Icone size={19} strokeWidth={ici ? 2.3 : 2} />
                </span>
              </span>
              <span
                className={`max-w-full truncate px-0.5 text-[10px] leading-none transition-colors ${
                  ici ? "font-semibold text-ink" : "font-medium text-muted"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
