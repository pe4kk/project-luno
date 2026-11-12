"use client";

import { create } from "zustand";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase, synchroDisponible, useSynchro } from "./synchro";
import { useLuno } from "./store";
import type { ChapitrePublie, DocumentNote, ErreurNotee, Lecon } from "./types";

/**
 * Demandes envoyées à Claude depuis le site (table `demandes`, voir supabase/schema.sql).
 * Une tâche planifiée les traite à 6 h 07, 13 h 07, 18 h 07 et 20 h 07 (heure de Paris)
 * et dépose la réponse dans la ligne : une leçon (`Lecon`) ou un chapitre
 * (`ChapitrePublie`), que le site affiche ou reprend ici.
 */

export type TypeDemande = "lecon" | "cours" | "erreurs";

/** Réponse à une demande « erreurs » : les erreurs relevées sur l'évaluation envoyée. */
export type ReponseErreurs = {
  erreurs: (Omit<ErreurNotee, "id" | "matiereId" | "date"> & { matiere?: string })[];
  /** Bilan d'une interro blanche (demande « erreurs » avec `meta.bilan`). */
  bilan?: { resume: string; pointsForts: string[]; aRetravailler: string[]; conseils: string[] };
};
/**
 * Réponse à une demande « cours » avec `meta.note` : un texte manuscrit (photos) tapé
 * par Claude, rangé dans l'onglet « Notes » de la matière.
 */
export type ReponseNote = { note: { titre: string; texte: string } };

export type Demande = {
  id: string;
  type: TypeDemande;
  titre: string;
  /**
   * `bilan` : bilan d'une interro blanche. La table n'accepte que trois types : il passe
   * par le type « erreurs », ce qui évite de modifier la base.
   */
  meta: {
    matiere?: string;
    chapitre?: string;
    images?: string[];
    bilan?: boolean;
    matieres?: string[];
    /** Texte à taper pour l'onglet « Notes » (passe par le type « cours »). */
    note?: boolean;
  };
  statut: "en_attente" | "prete" | "erreur";
  reponse: (Lecon | ChapitrePublie | ReponseErreurs | ReponseNote) | null;
  erreur: string | null;
  cree: string;
  traite: string | null;
};

export const HEURES_PASSAGE = [
  [6, 7],
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

/**
 * Réduit une photo avant l'envoi : 1568 px au plus grand côté (au-delà, Claude la réduit
 * de toute façon), en JPEG. Une photo de téléphone passe de 3 à 5 Mo à 200 à 400 Ko.
 */
export async function compresser(fichier: File): Promise<Blob> {
  const image = await createImageBitmap(fichier);
  const echelle = Math.min(1, 1568 / Math.max(image.width, image.height));
  const toile = document.createElement("canvas");
  toile.width = Math.round(image.width * echelle);
  toile.height = Math.round(image.height * echelle);
  toile.getContext("2d")!.drawImage(image, 0, 0, toile.width, toile.height);
  image.close();
  return new Promise((ok, ko) =>
    toile.toBlob((b) => (b ? ok(b) : ko(new Error("compression"))), "image/jpeg", 0.82),
  );
}

export const MAX_IMAGES = 20;

/**
 * Envoie une demande. Les photos vont d'abord dans le stockage privé `demandes`, dans le
 * dossier du compte (`<compte>/<demande>/1.jpg`…), et leurs chemins dans `meta.images`.
 */
export async function envoyerDemande(
  type: TypeDemande,
  titre: string,
  texte: string,
  meta: Demande["meta"] = {},
  images: File[] = [],
  progression?: (fait: number, total: number) => void,
) {
  const compte = useSynchro.getState().session?.user.id;
  if (!compte) throw new Error("non connecté");
  const id = crypto.randomUUID();
  const chemins: string[] = [];
  for (const [i, f] of images.slice(0, MAX_IMAGES).entries()) {
    progression?.(i, images.length);
    // Les photos sont réduites en JPEG ; les PDF partent tels quels.
    const pdf = f.type === "application/pdf";
    const chemin = `${compte}/${id}/${i + 1}.${pdf ? "pdf" : "jpg"}`;
    const { error } = await supabase()
      .storage.from("demandes")
      .upload(chemin, pdf ? f : await compresser(f), {
        contentType: pdf ? "application/pdf" : "image/jpeg",
      });
    if (error) throw error;
    chemins.push(chemin);
  }
  progression?.(images.length, images.length);
  const { error } = await supabase()
    .from("demandes")
    .insert({ id, type, titre, texte, meta: { ...meta, images: chemins } });
  if (error) throw error;
  await chargerDemandes();
}

/**
 * Joint une photo (réduite en JPEG) ou un PDF à une note : rangé dans le stockage privé
 * du compte, `<compte>/notes/<note>/<horodatage>.jpg|pdf`.
 */
export async function envoyerDocumentNote(noteId: string, f: File): Promise<DocumentNote> {
  const compte = useSynchro.getState().session?.user.id;
  if (!compte) throw new Error("non connecté");
  const pdf = f.type === "application/pdf";
  const chemin = `${compte}/notes/${noteId}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${pdf ? "pdf" : "jpg"}`;
  const { error } = await supabase()
    .storage.from("demandes")
    .upload(chemin, pdf ? f : await compresser(f), {
      contentType: pdf ? "application/pdf" : "image/jpeg",
    });
  if (error) throw error;
  return { nom: f.name, chemin, type: pdf ? "pdf" : "image" };
}

/** Adresse temporaire (1 h) d'un document joint, ou `null` sans compte ou sans réseau. */
export async function lienDocumentNote(chemin: string): Promise<string | null> {
  if (!useSynchro.getState().session) return null;
  const { data } = await supabase().storage.from("demandes").createSignedUrl(chemin, 3600);
  return data?.signedUrl ?? null;
}

export async function retirerDocumentNote(chemin: string) {
  if (!useSynchro.getState().session) return;
  await supabase().storage.from("demandes").remove([chemin]);
}

export async function supprimerDemande(id: string) {
  await supabase().from("demandes").delete().eq("id", id);
  await chargerDemandes();
}

/** Identifiant sous lequel une réponse est reprise dans les données de l'utilisateur. */
export const idReponse = (d: Demande) => `dem-${d.id}`;

/** Les bilans d'interro blanche demandés à Claude, du plus récent au plus ancien. */
export const bilans = (liste: Demande[]) => liste.filter((d) => d.type === "erreurs" && d.meta.bilan);

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
    if (d.type === "erreurs" && d.statut === "prete" && d.reponse) {
      const id = idReponse(d);
      const s = useLuno.getState();
      if (s.publies[id]) continue;
      const r = d.reponse as ReponseErreurs;
      // Une erreur d'un bilan dit sa matière ; sinon, celle de la demande.
      const parMatiere = new Map<string, ReponseErreurs["erreurs"]>();
      for (const e of r.erreurs ?? []) {
        const nom = e.matiere ?? d.meta.matiere ?? d.meta.matieres?.[0];
        const m = s.matieres.find((x) => x.nom === nom);
        if (!m) continue;
        const { matiere: _ignore, ...reste } = e;
        void _ignore;
        parMatiere.set(m.id, [...(parMatiere.get(m.id) ?? []), reste]);
      }
      if (!d.meta.bilan && parMatiere.size === 0) continue;
      for (const [mid, l] of parMatiere) s.ajouterErreurs(mid, l, d.titre);
      useLuno.setState((x) => ({ publies: { ...x.publies, [id]: 1 } }));
      continue;
    }
    if (d.type === "cours" && d.meta.note) {
      if (d.statut !== "prete" || !d.reponse) continue;
      const id = idReponse(d);
      const s = useLuno.getState();
      const r = (d.reponse as ReponseNote).note;
      // L'identifiant de la note est celui de la demande : deux appareils qui la
      // reprennent en même temps n'en font qu'une à la synchronisation.
      if (s.publies[id] || !r?.texte || s.notes.some((n) => n.id === id)) continue;
      const nom = d.meta.matiere?.trim() || "Notes";
      const mid =
        s.matieres.find((x) => x.nom === nom)?.id ??
        s.ajouterMatiere({ nom, couleur: "#9a8f8a", emoji: "📝" });
      s.ajouterNote(mid, { id, titre: r.titre, texte: r.texte, documents: [] });
      useLuno.setState((x) => ({ publies: { ...x.publies, [id]: 1 } }));
      continue;
    }
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
