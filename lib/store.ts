"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chapitre, Dst, Fiche, Flashcard, Matiere, NiveauCarte } from "./types";
import { donneesExemple } from "./seed";

export const COULEURS = [
  "#5b4bdb",
  "#e4572e",
  "#2a9d8f",
  "#e9a100",
  "#d6457f",
  "#3b82c4",
  "#6a994e",
  "#8d5a97",
];

export const EMOJIS = ["📐", "⚗️", "🧬", "🌍", "📚", "🗣️", "💶", "🏛️", "💻", "🎨", "🎵", "⚽"];

const uid = () => crypto.randomUUID();

type Etat = {
  matieres: Matiere[];
  chapitres: Chapitre[];
  dsts: Dst[];
  /** Matière et chapitre ouverts dans l'onglet Travail. */
  selection: { matiereId: string | null; chapitreId: string | null };
  ouvrir: (matiereId: string | null, chapitreId?: string | null) => void;

  ajouterMatiere: (m: Omit<Matiere, "id">) => string;
  supprimerMatiere: (id: string) => void;

  ajouterChapitre: (matiereId: string, titre: string) => string;
  supprimerChapitre: (id: string) => void;
  majCours: (chapitreId: string, cours: string) => void;
  majFiche: (chapitreId: string, fiche: Fiche | null) => void;
  ajouterFlashcards: (chapitreId: string, cartes: { recto: string; verso: string }[]) => void;
  supprimerFlashcard: (chapitreId: string, carteId: string) => void;
  noterFlashcard: (chapitreId: string, carteId: string, niveau: NiveauCarte) => void;

  enregistrerDst: (d: Omit<Dst, "id"> & { id?: string }) => void;
  supprimerDst: (id: string) => void;

  chargerExemple: () => void;
  toutEffacer: () => void;
};

const majChapitre = (liste: Chapitre[], id: string, f: (c: Chapitre) => Chapitre) =>
  liste.map((c) => (c.id === id ? f(c) : c));

export const useLuno = create<Etat>()(
  persist(
    (set) => ({
      matieres: [],
      chapitres: [],
      dsts: [],
      selection: { matiereId: null, chapitreId: null },
      ouvrir: (matiereId, chapitreId = null) => set({ selection: { matiereId, chapitreId } }),

      ajouterMatiere: (m) => {
        const id = uid();
        set((s) => ({ matieres: [...s.matieres, { ...m, id }] }));
        return id;
      },
      supprimerMatiere: (id) =>
        set((s) => ({
          matieres: s.matieres.filter((m) => m.id !== id),
          chapitres: s.chapitres.filter((c) => c.matiereId !== id),
          dsts: s.dsts.filter((d) => d.matiereId !== id),
        })),

      ajouterChapitre: (matiereId, titre) => {
        const id = uid();
        set((s) => ({
          chapitres: [
            ...s.chapitres,
            { id, matiereId, titre, cours: "", flashcards: [], fiche: null },
          ],
        }));
        return id;
      },
      supprimerChapitre: (id) =>
        set((s) => ({ chapitres: s.chapitres.filter((c) => c.id !== id) })),
      majCours: (id, cours) =>
        set((s) => ({ chapitres: majChapitre(s.chapitres, id, (c) => ({ ...c, cours })) })),
      majFiche: (id, fiche) =>
        set((s) => ({ chapitres: majChapitre(s.chapitres, id, (c) => ({ ...c, fiche })) })),
      ajouterFlashcards: (id, cartes) =>
        set((s) => ({
          chapitres: majChapitre(s.chapitres, id, (c) => {
            const deja = new Set(c.flashcards.map((f) => f.recto.toLowerCase()));
            const neuves: Flashcard[] = cartes
              .filter((k) => !deja.has(k.recto.toLowerCase()))
              .map((k) => ({ ...k, id: uid(), niveau: 0 }));
            return { ...c, flashcards: [...c.flashcards, ...neuves] };
          }),
        })),
      supprimerFlashcard: (id, carteId) =>
        set((s) => ({
          chapitres: majChapitre(s.chapitres, id, (c) => ({
            ...c,
            flashcards: c.flashcards.filter((f) => f.id !== carteId),
          })),
        })),
      noterFlashcard: (id, carteId, niveau) =>
        set((s) => ({
          chapitres: majChapitre(s.chapitres, id, (c) => ({
            ...c,
            flashcards: c.flashcards.map((f) => (f.id === carteId ? { ...f, niveau } : f)),
          })),
        })),

      enregistrerDst: (d) =>
        set((s) => {
          if (d.id) {
            return { dsts: s.dsts.map((x) => (x.id === d.id ? ({ ...d, id: d.id } as Dst) : x)) };
          }
          return { dsts: [...s.dsts, { ...d, id: uid() }] };
        }),
      supprimerDst: (id) => set((s) => ({ dsts: s.dsts.filter((d) => d.id !== id) })),

      chargerExemple: () => set(() => donneesExemple()),
      toutEffacer: () =>
        set(() => ({
          matieres: [],
          chapitres: [],
          dsts: [],
          selection: { matiereId: null, chapitreId: null },
        })),
    }),
    { name: "luno-v1" },
  ),
);

/** Fond pastel dérivé de la couleur d'une matière. */
export const pastel = (couleur: string, pct = 14) =>
  `color-mix(in oklab, ${couleur} ${pct}%, white)`;
