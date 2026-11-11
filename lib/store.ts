"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chapitre, ChapitrePublie, Donnees, Dst, Flashcard, Matiere, Tache } from "./types";
import { dansJours, todayISO } from "./dates";
import { CALENDRIER_EVENEMENTS, CALENDRIER_MATIERES } from "@/contenu/calendrier";

export const COULEURS = [
  "#b5573d",
  "#c98b6b",
  "#d98a8a",
  "#55555c",
  "#7d9a84",
  "#6f8fae",
  "#c9a24a",
  "#8a5a78",
];

export const EMOJIS = ["📐", "⚗️", "🧬", "🌍", "📚", "🗣️", "💶", "🏛️", "💻", "🎨", "🎵", "⚽"];

const uid = () => crypto.randomUUID();
/**
 * Les anciennes données d'exemple (retirées le 2026-11-11) portaient ce préfixe :
 * `normaliser()` les efface des navigateurs qui les avaient chargées.
 */
const EX = "ex-";

const nouvelleCarte = (c: { recto: string; verso: string }): Flashcard => ({
  ...c,
  id: uid(),
  niveau: 0,
  intervalle: 0,
  echeance: todayISO(),
});

export const estDue = (c: Flashcard) => c.echeance <= todayISO();

type Etat = Donnees & {
  /** Versions des chapitres publiés déjà repris dans ce navigateur. */
  publies: Record<string, number>;
  /** Matières choisies pour le calendrier du lycée, ou `null` s'il n'a pas été repris. */
  calendrier: string[] | null;
  importerCalendrier: (noms: string[]) => void;
  /** Dernière suppression, tant qu'elle peut être annulée. */
  annulation: { message: string; avant: Donnees & { calendrier: string[] | null } } | null;
  annuler: () => void;
  oublierAnnulation: () => void;

  ajouterMatiere: (m: Omit<Matiere, "id">) => string;
  modifierMatiere: (id: string, m: Omit<Matiere, "id">) => void;
  supprimerMatiere: (id: string) => void;

  ajouterChapitre: (matiereId: string, titre: string) => string;
  renommerChapitre: (id: string, titre: string) => void;
  supprimerChapitre: (id: string) => void;
  majCours: (chapitreId: string, cours: string) => void;
  majTailleFiche: (chapitreId: string, taille: number) => void;
  ajouterFlashcards: (chapitreId: string, cartes: { recto: string; verso: string }[]) => number;
  modifierFlashcard: (chapitreId: string, carteId: string, c: { recto: string; verso: string }) => void;
  supprimerFlashcard: (chapitreId: string, carteId: string) => void;
  noterFlashcard: (chapitreId: string, carteId: string, su: boolean) => void;

  ajouterTaches: (taches: (string | { texte: string; echeance: string })[]) => number;
  modifierTache: (id: string, t: Partial<Omit<Tache, "id">>) => void;
  supprimerTache: (id: string) => void;
  effacerTachesFaites: () => void;

  enregistrerDst: (d: Omit<Dst, "id"> & { id?: string }) => void;
  supprimerDst: (id: string) => void;

  importerPublie: (p: ChapitrePublie, prefixe?: string) => string;
  toutEffacer: () => void;
  remplacerTout: (d: Donnees) => void;
};

const majChapitre = (liste: Chapitre[], id: string, f: (c: Chapitre) => Chapitre) =>
  liste.map((c) => (c.id === id ? f(c) : c));

const photo = (s: Donnees & { calendrier: string[] | null }) => ({
  matieres: s.matieres,
  chapitres: s.chapitres,
  dsts: s.dsts,
  taches: s.taches,
  calendrier: s.calendrier,
});

export const useLuno = create<Etat>()(
  persist(
    (set, get) => ({
      matieres: [],
      chapitres: [],
      dsts: [],
      taches: [],
      ajouterTaches: (liste) => {
        const neuves: Tache[] = liste
          .map((t) => (typeof t === "string" ? { texte: t, echeance: "" } : t))
          .map((t) => ({ texte: t.texte.trim(), echeance: t.echeance }))
          .filter((t) => t.texte)
          .map((t) => ({ id: uid(), texte: t.texte, fait: false, echeance: t.echeance }));
        set((s) => ({ taches: [...s.taches, ...neuves] }));
        return neuves.length;
      },
      modifierTache: (id, t) =>
        set((s) => ({ taches: s.taches.map((x) => (x.id === id ? { ...x, ...t } : x)) })),
      supprimerTache: (id) =>
        set((s) => ({
          annulation: { message: "Tâche supprimée", avant: photo(s) },
          taches: s.taches.filter((x) => x.id !== id),
        })),
      effacerTachesFaites: () =>
        set((s) => ({
          annulation: { message: "Tâches terminées effacées", avant: photo(s) },
          taches: s.taches.filter((x) => !x.fait),
        })),
      publies: {},
      calendrier: null,
      // Reprend le calendrier du lycée pour les matières choisies. Les DST repris portent
      // un identifiant « cal-… » : un nouvel import les remplace en gardant ce que
      // l'utilisateur y a ajouté (heure, salle, notes, chapitres).
      importerCalendrier: (noms) =>
        set((s) => {
          const matieres = [...s.matieres];
          const idDe = (nom: string) => {
            let m = matieres.find((x) => x.nom.toLowerCase() === nom.toLowerCase());
            if (!m) {
              const c = CALENDRIER_MATIERES.find((x) => x.nom === nom)!;
              m = { id: uid(), nom: c.nom, couleur: c.couleur, emoji: c.emoji };
              matieres.push(m);
            }
            return m.id;
          };
          const anciens = new Map(s.dsts.filter((d) => d.id.startsWith("cal-")).map((d) => [d.id, d]));
          const repris: Dst[] = [];
          CALENDRIER_EVENEMENTS.forEach((ev, i) => {
            if (!noms.includes(ev.matiere)) return;
            const id = `cal-${i}`;
            const avant = anciens.get(id);
            repris.push({
              id,
              matiereId: idDe(ev.matiere),
              titre: ev.titre ?? "DST",
              date: ev.date,
              heure: avant?.heure ?? "",
              dureeMin: ev.dureeMin,
              salle: avant?.salle ?? "",
              notes: avant?.notes ?? "",
              chapitreIds: avant?.chapitreIds ?? [],
            });
          });
          return {
            annulation: { message: "Calendrier du lycée mis à jour", avant: photo(s) },
            matieres,
            dsts: [...s.dsts.filter((d) => !d.id.startsWith("cal-")), ...repris],
            calendrier: noms,
          };
        }),
      annulation: null,
      annuler: () => set((s) => (s.annulation ? { ...s.annulation.avant, annulation: null } : {})),
      oublierAnnulation: () => set({ annulation: null }),

      ajouterMatiere: (m) => {
        const id = uid();
        set((s) => ({ matieres: [...s.matieres, { ...m, id }] }));
        return id;
      },
      modifierMatiere: (id, m) =>
        set((s) => ({ matieres: s.matieres.map((x) => (x.id === id ? { ...m, id } : x)) })),
      supprimerMatiere: (id) =>
        set((s) => ({
          annulation: {
            message: `Matière « ${s.matieres.find((m) => m.id === id)?.nom ?? ""} » supprimée`,
            avant: photo(s),
          },
          matieres: s.matieres.filter((m) => m.id !== id),
          chapitres: s.chapitres.filter((c) => c.matiereId !== id),
          dsts: s.dsts.filter((d) => d.matiereId !== id),
        })),

      ajouterChapitre: (matiereId, titre) => {
        const id = uid();
        set((s) => ({
          chapitres: [
            ...s.chapitres,
            { id, matiereId, titre, cours: "", documents: [], flashcards: [], fiche: null, tailleFiche: 3, exercices: [] },
          ],
        }));
        return id;
      },
      renommerChapitre: (id, titre) =>
        set((s) => ({ chapitres: majChapitre(s.chapitres, id, (c) => ({ ...c, titre })) })),
      supprimerChapitre: (id) =>
        set((s) => ({
          annulation: {
            message: `Chapitre « ${s.chapitres.find((c) => c.id === id)?.titre ?? ""} » supprimé`,
            avant: photo(s),
          },
          chapitres: s.chapitres.filter((c) => c.id !== id),
          dsts: s.dsts.map((d) => ({ ...d, chapitreIds: d.chapitreIds.filter((x) => x !== id) })),
        })),
      majCours: (id, cours) =>
        set((s) => ({ chapitres: majChapitre(s.chapitres, id, (c) => ({ ...c, cours })) })),
      majTailleFiche: (id, tailleFiche) =>
        set((s) => ({ chapitres: majChapitre(s.chapitres, id, (c) => ({ ...c, tailleFiche })) })),
      ajouterFlashcards: (id, cartes) => {
        const chapitre = get().chapitres.find((c) => c.id === id);
        if (!chapitre) return 0;
        const deja = new Set(chapitre.flashcards.map((f) => f.recto.toLowerCase()));
        const neuves = cartes.filter((k) => !deja.has(k.recto.toLowerCase())).map(nouvelleCarte);
        set((s) => ({
          chapitres: majChapitre(s.chapitres, id, (c) => ({ ...c, flashcards: [...c.flashcards, ...neuves] })),
        }));
        return neuves.length;
      },
      modifierFlashcard: (id, carteId, k) =>
        set((s) => ({
          chapitres: majChapitre(s.chapitres, id, (c) => ({
            ...c,
            flashcards: c.flashcards.map((f) => (f.id === carteId ? { ...f, ...k } : f)),
          })),
        })),
      supprimerFlashcard: (id, carteId) =>
        set((s) => ({
          annulation: { message: "Flashcard supprimée", avant: photo(s) },
          chapitres: majChapitre(s.chapitres, id, (c) => ({
            ...c,
            flashcards: c.flashcards.filter((f) => f.id !== carteId),
          })),
        })),
      // Répétition espacée simple : l'intervalle double à chaque bonne réponse
      // (1, 2, 4, 8… jours) et repart de zéro à la moindre erreur.
      noterFlashcard: (id, carteId, su) =>
        set((s) => ({
          chapitres: majChapitre(s.chapitres, id, (c) => ({
            ...c,
            flashcards: c.flashcards.map((f) => {
              if (f.id !== carteId) return f;
              if (!su) return { ...f, niveau: 1, intervalle: 0, echeance: todayISO() };
              const intervalle = f.intervalle ? Math.min(f.intervalle * 2, 60) : 1;
              return { ...f, niveau: 2, intervalle, echeance: dansJours(intervalle) };
            }),
          })),
        })),

      enregistrerDst: (d) =>
        set((s) => {
          if (d.id) {
            return { dsts: s.dsts.map((x) => (x.id === d.id ? ({ ...d, id: d.id } as Dst) : x)) };
          }
          return { dsts: [...s.dsts, { ...d, id: uid() }] };
        }),
      supprimerDst: (id) =>
        set((s) => ({
          annulation: { message: "DST supprimé", avant: photo(s) },
          dsts: s.dsts.filter((d) => d.id !== id),
        })),

      // Reprend un chapitre publié : crée la matière et le chapitre au besoin,
      // ajoute les flashcards manquantes, remplace la fiche et les exercices.
      importerPublie: (p, prefixe = "") => {
        const s = get();
        let matiere = s.matieres.find((m) => m.nom.toLowerCase() === p.matiere.nom.toLowerCase());
        const matieres = [...s.matieres];
        if (!matiere) {
          matiere = { ...p.matiere, id: prefixe + uid() };
          matieres.push(matiere);
        }
        const existant = s.chapitres.find(
          (c) =>
            c.publieId === p.id ||
            (c.matiereId === matiere!.id && c.titre.toLowerCase() === p.titre.toLowerCase()),
        );
        const base: Chapitre = existant ?? {
          id: prefixe + uid(),
          matiereId: matiere.id,
          titre: p.titre,
          cours: "",
          documents: [],
          flashcards: [],
          fiche: null,
          tailleFiche: 3,
          exercices: [],
        };
        const deja = new Set(base.flashcards.map((f) => f.recto.toLowerCase()));
        const chapitre: Chapitre = {
          ...base,
          publieId: p.id,
          cours: base.cours.trim() ? base.cours : (p.cours ?? ""),
          documents: p.documents ?? base.documents ?? [],
          flashcards: [
            ...base.flashcards,
            ...p.flashcards.filter((k) => !deja.has(k.recto.toLowerCase())).map(nouvelleCarte),
          ],
          fiche: p.fiche ?? base.fiche,
          exercices: p.exercices.length ? p.exercices : base.exercices,
        };
        set({
          matieres,
          chapitres: existant
            ? s.chapitres.map((c) => (c.id === existant.id ? chapitre : c))
            : [...s.chapitres, chapitre],
          publies: { ...s.publies, [p.id]: p.version },
        });
        return chapitre.id;
      },

      toutEffacer: () =>
        set((s) => ({
          annulation: { message: "Toutes les données ont été effacées", avant: photo(s) },
          matieres: [],
          chapitres: [],
          dsts: [],
          taches: [],
          publies: {},
          calendrier: null,
        })),
      remplacerTout: (d) =>
        set((s) => ({
          annulation: { message: "Données importées", avant: photo(s) },
          ...d,
        })),
    }),
    {
      name: "luno-v1",
      version: 3,
      partialize: (s) => ({
        matieres: s.matieres,
        chapitres: s.chapitres,
        dsts: s.dsts,
        taches: s.taches,
        publies: s.publies,
        calendrier: s.calendrier,
      }),
      migrate: (ancien) => normaliser(ancien as Partial<Donnees>),
    },
  ),
);

/** Complète des données anciennes ou importées pour qu'elles suivent le format actuel. */
export function normaliser(
  d: Partial<Donnees> & { publies?: Record<string, number>; calendrier?: string[] | null },
) {
  const aujourdhui = todayISO();
  // Retire les chapitres et DST d'exemple. Une matière d'exemple n'est gardée que si un
  // vrai chapitre ou un vrai DST s'y rattache (par exemple un DST du calendrier du lycée).
  const chapitresGardes = (d.chapitres ?? []).filter((c) => !c.id.startsWith(EX));
  const dstsGardes = (d.dsts ?? []).filter((x) => !x.id.startsWith(EX));
  const utilisees = new Set([...chapitresGardes.map((c) => c.matiereId), ...dstsGardes.map((x) => x.matiereId)]);
  const publies = { ...(d.publies ?? {}) };
  delete publies["exemple-derivation"];
  return {
    matieres: (d.matieres ?? []).filter((m) => !m.id.startsWith(EX) || utilisees.has(m.id)),
    chapitres: chapitresGardes.map((c) => ({
      ...c,
      tailleFiche: c.tailleFiche ?? 3,
      documents: c.documents ?? [],
      exercices: c.exercices ?? [],
      // Les fiches de l'ancien format (une seule taille) ne sont pas reprises.
      fiche: c.fiche && c.fiche.sections?.every((s) => s.points.every((p) => typeof p === "object")) ? c.fiche : null,
      flashcards: (c.flashcards ?? []).map((f) => ({
        ...f,
        intervalle: f.intervalle ?? 0,
        echeance: f.echeance ?? aujourdhui,
      })),
    })),
    dsts: dstsGardes.map((x) => ({ ...x, chapitreIds: x.chapitreIds ?? [] })),
    taches: (d.taches ?? []).map((x) => ({ ...x, echeance: x.echeance ?? "" })),
    publies,
    calendrier: d.calendrier ?? null,
  };
}


/** Fond pastel dérivé de la couleur d'une matière. */
export const pastel = (couleur: string, pct = 14) =>
  `color-mix(in oklab, ${couleur} ${pct}%, var(--surface))`;

/** Couleur de texte lisible dérivée de la couleur d'une matière. */
export const encre = (couleur: string, pct = 62) =>
  `color-mix(in oklab, ${couleur} ${pct}%, var(--mix-fg))`;
