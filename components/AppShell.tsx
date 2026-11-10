"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { BookOpen, CalendarDays, GraduationCap, Home, Target } from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";
import { MODE_IA } from "@/lib/ai";

const ONGLETS = [
  { href: "/", label: "Accueil", icone: Home },
  { href: "/calendrier", label: "Calendrier", icone: CalendarDays },
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
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
        <circle cx="16" cy="16" r="16" fill="#26264a" />
        <path d="M21.5 20.6A8 8 0 0 1 13 8.2a8.2 8.2 0 1 0 8.5 12.4Z" fill="#f5b841" />
        <circle cx="22.5" cy="10" r="1.2" fill="#fff" opacity=".85" />
      </svg>
      <span className="font-display text-[22px] font-bold text-white">Luno</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const chemin = usePathname();
  const monte = useMonte();
  const actif = (href: string) => (href === "/" ? chemin === "/" : chemin.startsWith(href));

  return (
    <div className="min-h-dvh lg:pl-[248px]">
      {/* Barre latérale (ordinateur) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-night px-4 py-6 lg:flex">
        <Logo />
        <nav className="mt-10 flex flex-col gap-1" aria-label="Navigation principale">
          {ONGLETS.map(({ href, label, icone: Icone }) => (
            <Link
              key={href}
              href={href}
              aria-current={actif(href) ? "page" : undefined}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                actif(href) ? "text-white" : "text-white/55 hover:text-white/90"
              }`}
            >
              {actif(href) && (
                <motion.span
                  layoutId="onglet-actif"
                  className="absolute inset-0 rounded-xl bg-white/10"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icone size={19} className="relative" strokeWidth={2} />
              <span className="relative">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3 text-[13px] leading-snug text-white/60">
          <div className="mb-1 flex items-center gap-2 font-medium text-white/90">
            <span className="size-2 rounded-full bg-moon" />
            {MODE_IA === "demo" ? "IA en mode démo" : "IA connectée"}
          </div>
          {MODE_IA === "demo"
            ? "Les contenus générés sont des exemples simplifiés."
            : "Les contenus sont générés par IA."}
        </div>
      </aside>

      {/* Contenu */}
      <main className="mx-auto w-full max-w-[1120px] px-4 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-10">
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

      {/* Barre du bas (téléphone) */}
      <nav
        className="fixed inset-x-3 bottom-3 z-30 flex justify-between rounded-2xl bg-night px-2 py-1.5 shadow-pop lg:hidden"
        aria-label="Navigation principale"
      >
        {ONGLETS.map(({ href, label, icone: Icone }) => (
          <Link
            key={href}
            href={href}
            aria-current={actif(href) ? "page" : undefined}
            className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10.5px] font-medium ${
              actif(href) ? "text-white" : "text-white/50"
            }`}
          >
            {actif(href) && (
              <motion.span
                layoutId="onglet-actif-mobile"
                className="absolute inset-0 rounded-xl bg-white/10"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icone size={20} className="relative" />
            <span className="relative truncate">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
