"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RefreshCw } from "lucide-react";

const ICI = process.env.NEXT_PUBLIC_VERSION;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Le téléphone garde parfois l'ancienne version du site (cache de GitHub Pages, app de
 * l'écran d'accueil restée ouverte). On compare la version chargée à `version.json`, au
 * chargement, au retour sur l'onglet et toutes les dix minutes, et on propose de recharger.
 */
export function MiseAJour() {
  const [nouvelle, setNouvelle] = useState(false);

  useEffect(() => {
    if (!ICI || ICI === "local") return;
    let fini = false;
    const verifier = async () => {
      if (fini || document.visibilityState !== "visible") return;
      try {
        const r = await fetch(`${BASE}/version.json?t=${Date.now()}`, { cache: "no-store" });
        const { version } = (await r.json()) as { version?: string };
        if (version && version !== ICI) setNouvelle(true);
      } catch {
        // Hors connexion : on réessaiera.
      }
    };
    void verifier();
    const minuteur = setInterval(verifier, 10 * 60 * 1000);
    document.addEventListener("visibilitychange", verifier);
    return () => {
      fini = true;
      clearInterval(minuteur);
      document.removeEventListener("visibilitychange", verifier);
    };
  }, []);

  return (
    <AnimatePresence>
      {nouvelle && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed inset-x-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-50 mx-auto flex max-w-[440px] items-center justify-between gap-3 rounded-xl bg-night py-1.5 pl-4 pr-1.5 text-[14.5px] text-white shadow-pop"
        >
          <span className="min-w-0">Nouvelle version de Luno</span>
          <button
            onClick={() => location.reload()}
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg bg-white/15 px-3 font-semibold transition-colors hover:bg-white/25"
          >
            <RefreshCw size={15} /> Recharger
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
