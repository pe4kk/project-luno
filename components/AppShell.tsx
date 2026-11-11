"use client";

import Link from "next/link";
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

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="size-[30px] rounded-full bg-ink shadow-[inset_-9px_-3px_0_0_var(--blush)]" />
      <span className="text-[19px] font-medium uppercase tracking-[0.34em]">
        Luno
      </span>
    </Link>
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

function BoutonTheme() {
  const monte = useMonte();
  const sombre = useSyncExternalStore(
    observerTheme,
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );
  const basculer = () => {
    const suivant = sombre ? "light" : "dark";
    document.documentElement.dataset.theme = suivant;
    try {
      localStorage.setItem("luno-theme", suivant);
    } catch {}
  };
  return (
    <button
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
  const actif = (href: string) =>
    href === "/" ? chemin === "/" : chemin.startsWith(href);

  return (
    <div className="min-h-dvh">
      {/* Barre du haut */}
      <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1180px] 2xl:max-w-[1920px] items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
          <Logo />
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Navigation principale"
          >
            {ONGLETS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={actif(href) ? "page" : undefined}
                className={`relative rounded-[10px] px-3.5 py-2 text-[14px] tracking-[0.04em] transition-colors ${
                  actif(href) ? "text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {actif(href) && (
                  <motion.span
                    layoutId="onglet-actif"
                    className="absolute inset-0 rounded-[10px] bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
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
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </ColonnesAvecPanneau>
        )}
      </main>

      <SynchroBibliotheque />
      <Annulation />

      {/* Barre du bas (téléphone) : fond translucide, pastille cuivrée qui glisse sous l'onglet actif */}
      <nav
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 grid grid-cols-6 rounded-[26px] border border-line bg-surface/80 px-1 py-1.5 shadow-pop backdrop-blur-xl lg:hidden"
        aria-label="Navigation principale"
      >
        {ONGLETS.map(({ href, label, icone: Icone }) => {
          const ici = actif(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={ici ? "page" : undefined}
              className="group relative flex min-w-0 flex-col items-center gap-1 py-1"
            >
              <span className="relative flex h-8 w-12 items-center justify-center">
                {ici && (
                  <motion.span
                    layoutId="onglet-actif-mobile"
                    className="copper-bg absolute inset-0 rounded-full shadow-[0_6px_16px_-6px_rgb(201_139_107_/_0.9)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <motion.span
                  className={`relative ${ici ? "text-on-accent" : "text-muted group-active:text-ink"}`}
                  animate={{ scale: ici ? 1.08 : 1, y: ici ? -0.5 : 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                >
                  <Icone size={19} strokeWidth={ici ? 2.3 : 2} />
                </motion.span>
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
