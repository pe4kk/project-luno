"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chapitre, ChapitrePublie, Donnees, Dst, Flashcard, Matiere } from "./types";
import { dansJours, todayISO } from "./dates";
import { EXEMPLE_DERIVATION } from "@/contenu/exemple";

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
/** Les données d'exemple portent ce préfixe, pour pouvoir les retirer. */
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
  /** Dernière suppression, tant qu'elle peut être annulée. */
  annulation: { message: string; avant: Donnees } | null;
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

  enregistrerDst: (d: Omit<Dst, "id"> & { id?: string }) => void;
  supprimerDst: (id: string) => void;

  importerPublie: (p: ChapitrePublie, prefixe?: string) => string;
  chargerExemple: () => void;
  effacerExemple: () => void;
  toutEffacer: () => void;
  remplacerTout: (d: Donnees) => void;
};

const majChapitre = (liste: Chapitre[], id: string, f: (c: Chapitre) => Chapitre) =>
  liste.map((c) => (c.id === id ? f(c) : c));

const photo = (s: Donnees): Donnees => ({ matieres: s.matieres, chapitres: s.chapitres, dsts: s.dsts });

export const useLuno = create<Etat>()(
  persist(
    (set, get) => ({
      matieres: [],
      chapitres: [],
      dsts: [],
      publies: {},
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
            { id, matiereId, titre, cours: "", flashcards: [], fiche: null, tailleFiche: 3, exercices: [] },
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

      chargerExemple: () => {
        if (get().matieres.some((m) => m.id.startsWith(EX))) return;
        const m = (nom: string, couleur: string, emoji: string): Matiere => ({ id: EX + uid(), nom, couleur, emoji });
        const pc = m("Physique-Chimie", "#6f8fae", "⚗️");
        const hg = m("Histoire-Géo", "#c98b6b", "🌍");
        const svt = m("SVT", "#7d9a84", "🧬");
        const vide = { cours: "", flashcards: [], fiche: null, tailleFiche: 3, exercices: [] };
        const chap = (matiereId: string, titre: string): Chapitre => ({ id: EX + uid(), matiereId, titre, ...vide });
        const meca = chap(pc.id, "Mouvement et forces");
        const gf = chap(hg.id, "La guerre froide");
        const adn = chap(svt.id, "ADN et division cellulaire");
        set((s) => ({ matieres: [...s.matieres, pc, hg, svt], chapitres: [...s.chapitres, meca, gf, adn] }));
        const derivId = get().importerPublie(EXEMPLE_DERIVATION, EX);
        const maths = get().chapitres.find((c) => c.id === derivId)!.matiereId;
        const dst = (matiereId: string, c: Chapitre | string, j: number, heure: string, dureeMin: number, salle: string, notes = ""): Dst => ({
          id: EX + uid(),
          matiereId,
          titre: typeof c === "string" ? "Dérivation" : c.titre,
          date: dansJours(j),
          heure,
          dureeMin,
          salle,
          notes,
          chapitreIds: [typeof c === "string" ? c : c.id],
        });
        set((s) => ({
          dsts: [
            ...s.dsts,
            dst(maths, derivId, 3, "08:00", 120, "B204", "Calculatrice autorisée"),
            dst(hg.id, gf, 8, "14:00", 120, "A012"),
            dst(pc.id, meca, 15, "10:00", 90, "Labo 2"),
            dst(svt.id, adn, 22, "08:00", 60, "C110"),
          ],
        }));
      },
      effacerExemple: () =>
        set((s) => {
          const ex = new Set(s.matieres.filter((m) => m.id.startsWith(EX)).map((m) => m.id));
          const publies = { ...s.publies };
          delete publies[EXEMPLE_DERIVATION.id];
          return {
            annulation: { message: "Données d'exemple effacées", avant: photo(s) },
            matieres: s.matieres.filter((m) => !ex.has(m.id)),
            chapitres: s.chapitres.filter((c) => !ex.has(c.matiereId) && !c.id.startsWith(EX)),
            dsts: s.dsts.filter((d) => !ex.has(d.matiereId) && !d.id.startsWith(EX)),
            publies,
          };
        }),
      toutEffacer: () =>
        set((s) => ({
          annulation: { message: "Toutes les données ont été effacées", avant: photo(s) },
          matieres: [],
          chapitres: [],
          dsts: [],
          publies: {},
        })),
      remplacerTout: (d) =>
        set((s) => ({
          annulation: { message: "Données importées", avant: photo(s) },
          ...d,
        })),
    }),
    {
      name: "luno-v1",
      version: 2,
      partialize: (s) => ({ matieres: s.matieres, chapitres: s.chapitres, dsts: s.dsts, publies: s.publies }),
      migrate: (ancien) => normaliser(ancien as Partial<Donnees>),
    },
  ),
);

/** Complète des données anciennes ou importées pour qu'elles suivent le format actuel. */
export function normaliser(d: Partial<Donnees> & { publies?: Record<string, number> }) {
  const aujourdhui = todayISO();
  return {
    matieres: d.matieres ?? [],
    chapitres: (d.chapitres ?? []).map((c) => ({
      ...c,
      tailleFiche: c.tailleFiche ?? 3,
      exercices: c.exercices ?? [],
      // Les fiches de l'ancien format (une seule taille) ne sont pas reprises.
      fiche: c.fiche && c.fiche.sections?.every((s) => s.points.every((p) => typeof p === "object")) ? c.fiche : null,
      flashcards: (c.flashcards ?? []).map((f) => ({
        ...f,
        intervalle: f.intervalle ?? 0,
        echeance: f.echeance ?? aujourdhui,
      })),
    })),
    dsts: (d.dsts ?? []).map((x) => ({ ...x, chapitreIds: x.chapitreIds ?? [] })),
    publies: d.publies ?? {},
  };
}

export const aExemple = (s: Donnees) => s.matieres.some((m) => m.id.startsWith(EX));

/** Fond pastel dérivé de la couleur d'une matière. */
export const pastel = (couleur: string, pct = 14) =>
  `color-mix(in oklab, ${couleur} ${pct}%, var(--surface))`;

/** Couleur de texte lisible dérivée de la couleur d'une matière. */
export const encre = (couleur: string, pct = 62) =>
  `color-mix(in oklab, ${couleur} ${pct}%, var(--mix-fg))`;
