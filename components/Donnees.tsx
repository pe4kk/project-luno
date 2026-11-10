"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Download, Eraser, Settings, Sparkles, Trash2, Undo2, Upload } from "lucide-react";
import { aExemple, normaliser, useLuno } from "@/lib/store";
import { BIBLIOTHEQUE } from "@/contenu/bibliotheque";
import { todayISO } from "@/lib/dates";
import { Bouton, Fenetre, pluriel } from "./ui";

/** Reprend les chapitres publiés que ce navigateur n'a pas encore (ou dans une version plus ancienne). */
export function SynchroBibliotheque() {
  useEffect(() => {
    const { publies, importerPublie } = useLuno.getState();
    for (const p of BIBLIOTHEQUE) {
      if (publies[p.id] !== p.version) importerPublie(p);
    }
  }, []);
  return null;
}

/** Message « Annuler » affiché quelques secondes après une suppression. */
export function Annulation() {
  const annulation = useLuno((s) => s.annulation);
  const annuler = useLuno((s) => s.annuler);
  const oublier = useLuno((s) => s.oublierAnnulation);

  const chemin = usePathname();

  useEffect(() => {
    if (!annulation) return;
    const t = setTimeout(oublier, 8000);
    return () => clearTimeout(t);
  }, [annulation, oublier]);

  // Le message disparaît quand on change d'onglet.
  useEffect(() => oublier, [chemin, oublier]);

  return (
    <AnimatePresence>
      {annulation && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-[440px] items-center justify-between gap-3 rounded-xl bg-night py-1.5 pl-4 pr-1.5 text-[14.5px] text-white shadow-pop lg:bottom-6"
        >
          <span className="min-w-0 truncate">{annulation.message}</span>
          <button
            onClick={annuler}
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg bg-white/15 px-3 font-semibold transition-colors hover:bg-white/25"
          >
            <Undo2 size={15} /> Annuler
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BoutonDonnees() {
  const s = useLuno();
  const [ouverte, setOuverte] = useState(false);
  const [erreur, setErreur] = useState("");
  const fichier = useRef<HTMLInputElement>(null);
  const nbCartes = s.chapitres.reduce((n, c) => n + c.flashcards.length, 0);
  const vide = s.matieres.length === 0 && s.dsts.length === 0 && s.taches.length === 0;

  const exporter = () => {
    const contenu = JSON.stringify(
      {
        application: "luno",
        version: 2,
        matieres: s.matieres,
        chapitres: s.chapitres,
        dsts: s.dsts,
        taches: s.taches,
        publies: s.publies,
        calendrier: s.calendrier,
      },
      null,
      2,
    );
    const url = URL.createObjectURL(new Blob([contenu], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `luno-sauvegarde-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importer = async (f: File) => {
    setErreur("");
    try {
      const d = JSON.parse(await f.text());
      if (d?.application !== "luno" || !Array.isArray(d.matieres)) throw new Error("format");
      s.remplacerTout(normaliser(d));
      setOuverte(false);
    } catch {
      setErreur("Ce fichier n'est pas une sauvegarde Luno. Choisis un fichier « luno-sauvegarde-….json ».");
    }
  };

  return (
    <>
      <button
        onClick={() => setOuverte(true)}
        aria-label="Mes données"
        title="Mes données"
        className="flex size-11 items-center justify-center rounded-[10px] border border-line bg-surface text-ink transition-colors hover:border-ink/40"
      >
        <Settings size={18} />
      </button>
      <Fenetre ouverte={ouverte} fermer={() => setOuverte(false)} titre="Mes données">
        <p className="text-[14.5px] leading-relaxed text-muted">
          Tes matières, tes DST, tes tâches et ta progression sont enregistrés dans ce navigateur uniquement (
          {pluriel(s.matieres.length, "matière")}, {pluriel(s.dsts.length, "DST", "DST")},{" "}
          {pluriel(nbCartes, "flashcard")}). Fais une sauvegarde de temps en temps, et pour passer sur un
          autre appareil.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Bouton onClick={exporter} disabled={vide}>
            <Download size={16} /> Enregistrer une sauvegarde
          </Bouton>
          <input
            ref={fichier}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importer(f);
              e.target.value = "";
            }}
          />
          <Bouton variante="contour" onClick={() => fichier.current?.click()}>
            <Upload size={16} /> Restaurer une sauvegarde
          </Bouton>
          {erreur && <p className="text-[13.5px] text-bad">{erreur}</p>}
          <p className="text-[13px] text-muted">
            Restaurer remplace les données actuelles. Tu peux annuler juste après.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4">
          {!aExemple(s) && (
            <Bouton
              variante="contour"
              onClick={() => {
                s.chargerExemple();
                setOuverte(false);
              }}
            >
              <Sparkles size={16} /> Charger des données d&apos;exemple
            </Bouton>
          )}
          {aExemple(s) && (
            <Bouton
              variante="contour"
              onClick={() => {
                s.effacerExemple();
                setOuverte(false);
              }}
            >
              <Eraser size={16} /> Effacer les données d&apos;exemple
            </Bouton>
          )}
          <Bouton
            variante="fantome"
            className="!text-bad"
            disabled={vide}
            onClick={() => {
              s.toutEffacer();
              setOuverte(false);
            }}
          >
            <Trash2 size={16} /> Tout effacer
          </Bouton>
        </div>
      </Fenetre>
    </>
  );
}
