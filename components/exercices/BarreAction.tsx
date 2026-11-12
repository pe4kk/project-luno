"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Barre d'action collée au-dessus de la barre d'onglets, sur téléphone seulement : le
 * bouton principal reste sous le pouce quand le choix se fait dans une longue liste.
 */
export function BarreAction({ visible, children }: { visible: boolean; children: ReactNode }) {
  // Les pages ne s'affichent qu'après l'hydratation (AppShell) : `document` existe.
  if (typeof document === "undefined") return null;
  return (
    <>
    {/* Place réservée en bas de page : la barre ne cache pas la dernière carte. */}
    {visible && <div aria-hidden className="h-20 lg:hidden" />}
    {createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, transform: "translate3d(0, 16px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0, transform: "translate3d(0, 16px, 0)" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+80px)] z-30 flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 pl-4 shadow-pop lg:hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
    )}
    </>
  );
}
