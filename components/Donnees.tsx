"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Download, Settings, Trash2, Undo2, Upload } from "lucide-react";
import { normaliser, useLuno } from "@/lib/store";
import { BIBLIOTHEQUE, PUBLIES_RETIRES } from "@/contenu/bibliotheque";
import { EVENEMENTS } from "@/contenu/evenements";
import { CALENDRIER_MATIERES } from "@/contenu/calendrier";
import { todayISO } from "@/lib/dates";
import { Bouton, Fenetre, pluriel } from "./ui";
import { CompteSynchro, PastilleSynchro } from "./Synchro";
import { useSynchro } from "@/lib/synchro";

/** Reprend les chapitres publiés que ce navigateur n'a pas encore (ou dans une version plus ancienne). */
export function SynchroBibliotheque() {
  useEffect(() => {
    const { publies, importerPublie } = useLuno.getState();
    for (const p of BIBLIOTHEQUE) {
      if (publies[p.id] !== p.version) importerPublie(p);
    }
    // Chapitres publiés puis retirés (devenus des leçons, par exemple).
    if (useLuno.getState().chapitres.some((c) => c.publieId && PUBLIES_RETIRES.includes(c.publieId)))
      useLuno.setState((s) => ({
        chapitres: s.chapitres.filter((c) => !c.publieId || !PUBLIES_RETIRES.includes(c.publieId)),
      }));
    // Le calendrier du lycée s'ajoute tout seul à la première visite, avec les matières
    // cochées par défaut ; on peut ensuite les changer depuis la page Calendrier.
    if (useLuno.getState().calendrier === null) {
      useLuno.getState().importerCalendrier(
        CALENDRIER_MATIERES.filter((m) => m.parDefaut).map((m) => m.nom),
        true,
      );
    }
    // LVA et LVB ont maintenant les drapeaux anglais et espagnol (2026-11-12) : on met à
    // jour les matières créées avec les anciens symboles, sans toucher à un choix perso.
    const anciens: Record<string, [string, string]> = { LVA: ["🗣️", "🇬🇧"], LVB: ["💬", "🇪🇸"] };
    for (const m of useLuno.getState().matieres) {
      const a = anciens[m.nom];
      if (a && m.emoji === a[0]) {
        useLuno.getState().modifierMatiere(m.id, { nom: m.nom, couleur: m.couleur, emoji: a[1] });
      }
    }
    // Les dates viennent après les chapitres, pour pouvoir s'y rattacher.
    const { importerEvenement } = useLuno.getState();
    for (const e of EVENEMENTS) {
      if (useLuno.getState().publies[`evt:${e.id}`] !== e.version)
        importerEvenement(e);
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
          initial={{ opacity: 0, transform: "translate3d(0, 20px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0, transform: "translate3d(0, 20px, 0)" }}
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
  const connecte = useSynchro((x) => x.session !== null);
  const [ouverte, setOuverte] = useState(false);
  const [erreur, setErreur] = useState("");
  const fichier = useRef<HTMLInputElement>(null);
  const nbCartes = s.chapitres.reduce((n, c) => n + c.flashcards.length, 0);
  const vide =
    s.matieres.length === 0 && s.dsts.length === 0 && s.taches.length === 0;

  const exporter = () => {
    const contenu = JSON.stringify(
      {
        application: "luno",
        version: 2,
        matieres: s.matieres,
        chapitres: s.chapitres,
        dsts: s.dsts,
        taches: s.taches,
        erreurs: s.erreurs,
        publies: s.publies,
        calendrier: s.calendrier,
      },
      null,
      2,
    );
    const url = URL.createObjectURL(
      new Blob([contenu], { type: "application/json" }),
    );
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
      if (d?.application !== "luno" || !Array.isArray(d.matieres))
        throw new Error("format");
      s.remplacerTout(normaliser(d));
      setOuverte(false);
    } catch {
      setErreur(
        "Ce fichier n'est pas une sauvegarde Luno. Choisis un fichier « luno-sauvegarde-….json ».",
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setOuverte(true)}
        aria-label="Mes données"
        title="Mes données"
        className="relative flex size-11 items-center justify-center rounded-[10px] border border-line bg-surface text-ink transition-colors hover:border-ink/40"
      >
        <Settings size={18} />
        <PastilleSynchro />
      </button>
      <Fenetre
        ouverte={ouverte}
        fermer={() => setOuverte(false)}
        titre="Mes données"
      >
        <CompteSynchro />
        <p className="text-[14.5px] leading-relaxed text-muted">
          {connecte
            ? "Sur cet appareil"
            : "Sans compte, tes matières, tes DST, tes tâches et ta progression restent dans ce navigateur uniquement"}{" "}
          ({pluriel(s.matieres.length, "matière")},{" "}
          {pluriel(s.dsts.length, "DST", "DST")},{" "}
          {pluriel(nbCartes, "flashcard")}).{" "}
          {connecte
            ? "Une sauvegarde reste utile de temps en temps."
            : "Fais une sauvegarde de temps en temps."}
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
            Restaurer remplace les données actuelles. Tu peux annuler juste
            après.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4">
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
          {connecte && (
            <p className="text-[13px] text-muted">
              Effacer vide aussi tes autres appareils connectés.
            </p>
          )}
        </div>
      </Fenetre>
    </>
  );
}
