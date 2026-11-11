"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { BookOpen, CalendarDays, GraduationCap, Home, ListTodo, Moon, Search, Sun, Target } from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";
import { Annulation, BoutonDonnees, SynchroBibliotheque } from "./Donnees";

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
  return useSyncExternalStore(rien, () => true, () => false);
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="size-[30px] rounded-full bg-ink shadow-[inset_-9px_-3px_0_0_var(--blush)]" />
      <span className="text-[19px] font-medium uppercase tracking-[0.34em]">Luno</span>
    </Link>
  );
}

const observerTheme = (cb: () => void) => {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
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

export function AppShell({ children }: { children: ReactNode }) {
  const chemin = usePathname();
  const monte = useMonte();
  const actif = (href: string) => (href === "/" ? chemin === "/" : chemin.startsWith(href));

  return (
    <div className="min-h-dvh">
      {/* Barre du haut */}
      <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
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
              aria-current={chemin.startsWith("/recherche") ? "page" : undefined}
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
      <main className="mx-auto w-full max-w-[1180px] px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2 sm:px-8 sm:pt-4 lg:pb-14 lg:pt-6">
        {monte && (
          <motion.div
            key={chemin}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
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
