"use client";

import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";

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
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
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
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[14.5px] font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${STYLES[variante]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Carte({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[18px] border border-line bg-surface p-5 shadow-card sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

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
  useEffect(() => {
    if (!ouverte) return;
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && fermer();
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouverte, fermer]);

  return (
    <AnimatePresence>
      {ouverte && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && fermer()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={titre}
            className="max-h-[90dvh] w-full max-w-[480px] overflow-y-auto rounded-[18px] bg-surface p-6 shadow-pop"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[22px] font-bold">{titre}</h2>
              <button
                onClick={fermer}
                aria-label="Fermer"
                className="rounded-full p-2 text-muted transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  "w-full rounded-xl border border-line bg-bg/60 px-3.5 py-2.5 text-[15px] outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:bg-surface";

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
    <div className="flex flex-col items-center rounded-[18px] border border-dashed border-ink/15 px-6 py-14 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        {icone}
      </div>
      <h3 className="text-[20px] font-bold">{titre}</h3>
      <p className="mt-1.5 max-w-[380px] text-[14.5px] text-muted">{texte}</p>
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}

export function BadgeDemo() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">
      <Sparkles size={12} /> Mode démo
    </span>
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
