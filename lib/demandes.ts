"use client";

import { create } from "zustand";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase, synchroDisponible, useSynchro } from "./synchro";
import { useLuno } from "./store";
import type { ChapitrePublie, Lecon } from "./types";

/**
 * Demandes envoyées à Claude depuis le site (table `demandes`, voir supabase/schema.sql).
 * Une tâche planifiée les traite à 8 h 07, 13 h 07, 18 h 07 et 20 h 07 (heure de Paris)
 * et dépose la réponse dans la ligne : une leçon (`Lecon`) ou un chapitre
 * (`ChapitrePublie`), que le site affiche ou reprend ici.
 */

export type TypeDemande = "lecon" | "cours";
export type Demande = {
  id: string;
  type: TypeDemande;
  titre: string;
  meta: { matiere?: string; chapitre?: string };
  statut: "en_attente" | "prete" | "erreur";
  reponse: (Lecon | ChapitrePublie) | null;
  erreur: string | null;
  cree: string;
  traite: string | null;
};

export const HEURES_PASSAGE = [
  [8, 7],
  [13, 7],
  [18, 7],
  [20, 7],
] as const;

/** « vers 13 h » : le prochain passage de la tâche planifiée, heure de Paris. */
export function prochainPassage(maintenant = new Date()) {
  const paris = new Date(maintenant.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const minutes = paris.getHours() * 60 + paris.getMinutes();
  const suivant = HEURES_PASSAGE.find(([h, m]) => h * 60 + m > minutes);
  const [h] = suivant ?? HEURES_PASSAGE[0];
  return `${suivant ? "vers" : "demain vers"} ${h}\u00a0h`;
}

export const useDemandes = create<{ liste: Demande[]; charge: boolean }>(() => ({
  liste: [],
  charge: false,
}));

const COLONNES = "id, type, titre, meta, statut, reponse, erreur, cree, traite";

export async function chargerDemandes() {
  const compte = useSynchro.getState().session?.user.id;
  if (!compte) {
    useDemandes.setState({ liste: [], charge: false });
    return;
  }
  const { data, error } = await supabase()
    .from("demandes")
    .select(COLONNES)
    .eq("user_id", compte)
    .order("cree", { ascending: false });
  if (error) return;
  useDemandes.setState({ liste: (data ?? []) as Demande[], charge: true });
  reprendreCours();
}

export async function envoyerDemande(
  type: TypeDemande,
  titre: string,
  texte: string,
  meta: Demande["meta"] = {},
) {
  const { error } = await supabase().from("demandes").insert({ type, titre, texte, meta });
  if (error) throw error;
  await chargerDemandes();
}

export async function supprimerDemande(id: string) {
  await supabase().from("demandes").delete().eq("id", id);
  await chargerDemandes();
}

/** Identifiant sous lequel une réponse est reprise dans les données de l'utilisateur. */
export const idReponse = (d: Demande) => `dem-${d.id}`;

/** Les leçons rédigées pour cet utilisateur. */
export function leconsPerso(liste: Demande[]): Lecon[] {
  return liste
    .filter((d) => d.type === "lecon" && d.statut === "prete" && d.reponse)
    .map((d) => ({ ...(d.reponse as Lecon), id: idReponse(d) }));
}

/**
 * Les cours traités sont repris dans le chapitre d'où vient la demande (même matière,
 * même titre) : flashcards, fiche et exercices, une seule fois par navigateur et par
 * version (`publies`, synchronisé avec le compte).
 */
function reprendreCours() {
  const { liste } = useDemandes.getState();
  for (const d of liste) {
    if (d.type !== "cours" || d.statut !== "prete" || !d.reponse) continue;
    const r = d.reponse as ChapitrePublie;
    const id = idReponse(d);
    const version = r.version ?? 1;
    const s = useLuno.getState();
    if (s.publies[id] === version) continue;
    const m = s.matieres.find((x) => x.nom === (d.meta.matiere ?? r.matiere?.nom));
    s.importerPublie({
      ...r,
      id,
      version,
      titre: d.meta.chapitre ?? r.titre,
      matiere: m
        ? { nom: m.nom, couleur: m.couleur, emoji: m.emoji }
        : (r.matiere ?? { nom: d.meta.matiere ?? "Autre", couleur: "#9a8f8a", emoji: "📘" }),
      flashcards: r.flashcards ?? [],
      exercices: r.exercices ?? [],
      fiche: r.fiche ?? null,
    });
  }
}

let canal: RealtimeChannel | null = null;
let lance = false;
/** Charge les demandes à la connexion, en direct, et à chaque retour sur l'onglet. */
export function demarrerDemandes() {
  if (!synchroDisponible() || lance) return;
  lance = true;
  let compte: string | undefined;
  const suivre = () => {
    const id = useSynchro.getState().session?.user.id;
    if (id === compte) return;
    compte = id;
    canal?.unsubscribe();
    canal = null;
    void chargerDemandes();
    if (id) {
      canal = supabase()
        .channel(`demandes-${id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "demandes", filter: `user_id=eq.${id}` },
          () => void chargerDemandes(),
        )
        .subscribe();
    }
  };
  suivre();
  useSynchro.subscribe(suivre);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void chargerDemandes();
  });
}
