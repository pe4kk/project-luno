"use client";

import {
  createClient,
  type RealtimeChannel,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { create } from "zustand";
import { BIBLIOTHEQUE, PUBLIES_RETIRES } from "@/contenu/bibliotheque";
import { alleger, fusionner, regonfler, type DonneesSynchro } from "./fusion";
import { normaliser, useLuno } from "./store";

/**
 * Synchronisation entre appareils avec Supabase (compte par adresse mail et mot de
 * passe). Chaque compte a une seule ligne dans la table `donnees` : toutes ses données,
 * allégées du contenu publié (voir `lib/fusion.ts`), et `maj`, l'heure du dernier envoi.
 *
 * - Chaque modification locale est envoyée une seconde plus tard.
 * - Les modifications des autres appareils arrivent en direct (Realtime), et à chaque
 *   retour sur l'onglet.
 * - Hors connexion, les modifications attendent (`sale`) et partent au retour du réseau.
 * - Si les deux côtés ont changé depuis la dernière synchro, ou à la première connexion
 *   d'un appareil, les données sont fusionnées plutôt qu'écrasées.
 *
 * L'adresse et la clé publique (« anon ») du projet ne sont pas secrètes : c'est la
 * sécurité au niveau des lignes (RLS) de la table qui protège les données.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jexdghinuyirmyebfxvp.supabase.co";
export const SUPABASE_CLE_PUBLIQUE =
  process.env.NEXT_PUBLIC_SUPABASE_CLE || "sb_publishable_covKE8ASO2F2pRFr5Kda6A_yfAviBhS";

export const synchroDisponible = () => Boolean(SUPABASE_URL && SUPABASE_CLE_PUBLIQUE);

let client: SupabaseClient | null = null;
export function supabase() {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_CLE_PUBLIQUE, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "luno-compte" },
    });
  }
  return client;
}

type EtatSynchro = {
  session: Session | null;
  statut: "hors-ligne" | "synchro" | "a-jour" | "erreur" | "deconnecte";
  derniere: number | null;
  erreur: string | null;
};
export const useSynchro = create<EtatSynchro>(() => ({
  session: null,
  statut: "deconnecte",
  derniere: null,
  erreur: null,
}));

/** Ce que ce navigateur sait de la ligne distante, gardé entre deux visites. */
type Repere = { compte: string; maj: number; sale: boolean };
const CLE_REPERE = "luno-synchro";
function lireRepere(): Repere | null {
  try {
    return JSON.parse(localStorage.getItem(CLE_REPERE) ?? "null");
  } catch {
    return null;
  }
}
function ecrireRepere(r: Repere | null) {
  try {
    if (r) localStorage.setItem(CLE_REPERE, JSON.stringify(r));
    else localStorage.removeItem(CLE_REPERE);
  } catch {}
}

function lesDonnees(): DonneesSynchro {
  const s = useLuno.getState();
  return {
    matieres: s.matieres,
    chapitres: s.chapitres,
    dsts: s.dsts,
    taches: s.taches,
    erreurs: s.erreurs,
    publies: s.publies,
    calendrier: s.calendrier,
  };
}

let applique = false;
/** Remplace les données locales par celles reçues, sans déclencher de nouvel envoi. */
function appliquer(d: DonneesSynchro) {
  applique = true;
  const n = normaliser(regonfler(d, BIBLIOTHEQUE, PUBLIES_RETIRES));
  useLuno.setState({ ...n, annulation: null });
  applique = false;
  // Le contenu publié depuis la dernière visite de l'autre appareil est repris ici.
  const { publies, importerPublie } = useLuno.getState();
  applique = true;
  for (const p of BIBLIOTHEQUE) if (publies[p.id] !== p.version) importerPublie(p);
  applique = false;
}

type Ligne = { contenu: DonneesSynchro; maj: number };

async function lireDistant(compte: string): Promise<Ligne | null> {
  const { data, error } = await supabase()
    .from("donnees")
    .select("contenu, maj")
    .eq("user_id", compte)
    .maybeSingle();
  if (error) throw error;
  return data as Ligne | null;
}

async function envoyer(compte: string, d: DonneesSynchro) {
  const maj = Date.now();
  const { error } = await supabase()
    .from("donnees")
    .upsert({ user_id: compte, contenu: alleger(d, BIBLIOTHEQUE), maj });
  if (error) throw error;
  ecrireRepere({ compte, maj, sale: false });
  useSynchro.setState({ statut: "a-jour", derniere: maj, erreur: null });
}

let enCours: Promise<void> | null = null;
/** Met en accord ce navigateur et la ligne distante. */
export function synchroniser(): Promise<void> {
  if (enCours) return enCours.then(() => synchroniser());
  enCours = (async () => {
    const compte = useSynchro.getState().session?.user.id;
    if (!compte) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      useSynchro.setState({ statut: "hors-ligne" });
      return;
    }
    useSynchro.setState({ statut: "synchro" });
    try {
      const repere = lireRepere();
      const connu = repere?.compte === compte ? repere : null;
      const distant = await lireDistant(compte);
      const local = lesDonnees();

      if (!distant) {
        await envoyer(compte, local);
      } else if (!connu) {
        // Premier passage de ce navigateur sur ce compte : on réunit les deux.
        const fusion = fusionner(regonfler(distant.contenu, BIBLIOTHEQUE, PUBLIES_RETIRES), local);
        appliquer(fusion);
        await envoyer(compte, lesDonnees());
      } else if (distant.maj > connu.maj) {
        if (connu.sale) {
          appliquer(fusionner(lesDonnees(), regonfler(distant.contenu, BIBLIOTHEQUE, PUBLIES_RETIRES)));
          await envoyer(compte, lesDonnees());
        } else {
          appliquer(distant.contenu);
          ecrireRepere({ compte, maj: distant.maj, sale: false });
          useSynchro.setState({ statut: "a-jour", derniere: distant.maj, erreur: null });
        }
      } else if (connu.sale) {
        await envoyer(compte, local);
      } else {
        useSynchro.setState({ statut: "a-jour", derniere: connu.maj, erreur: null });
      }
    } catch (e) {
      useSynchro.setState({
        statut: navigator.onLine ? "erreur" : "hors-ligne",
        erreur: e instanceof Error ? e.message : String(e),
      });
    }
  })().finally(() => {
    enCours = null;
  });
  return enCours;
}

let minuteur: ReturnType<typeof setTimeout> | null = null;
let canal: RealtimeChannel | null = null;
let arreter: (() => void) | null = null;

function ecouter(compte: string) {
  canal?.unsubscribe();
  canal = supabase()
    .channel(`donnees-${compte}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "donnees", filter: `user_id=eq.${compte}` },
      (charge) => {
        const maj = (charge.new as { maj?: number } | null)?.maj;
        if (maj && maj !== lireRepere()?.maj) void synchroniser();
      },
    )
    .subscribe();
}

/** Lance la synchronisation (une fois, au chargement du site). */
export function demarrerSynchro() {
  if (!synchroDisponible() || arreter) return;
  const sb = supabase();

  // Toute modification locale est notée, puis envoyée une seconde plus tard.
  const desabonner = useLuno.subscribe((s, avant) => {
    if (applique || !useSynchro.getState().session) return;
    if (
      s.matieres === avant.matieres &&
      s.chapitres === avant.chapitres &&
      s.dsts === avant.dsts &&
      s.taches === avant.taches &&
      s.erreurs === avant.erreurs &&
      s.calendrier === avant.calendrier &&
      s.publies === avant.publies
    )
      return;
    const compte = useSynchro.getState().session!.user.id;
    const r = lireRepere();
    if (r?.compte === compte) ecrireRepere({ ...r, sale: true });
    if (minuteur) clearTimeout(minuteur);
    minuteur = setTimeout(() => void synchroniser(), 1000);
  });

  const { data } = sb.auth.onAuthStateChange((_evt, session) => {
    const avant = useSynchro.getState().session?.user.id;
    useSynchro.setState({ session, statut: session ? "synchro" : "deconnecte" });
    if (session && session.user.id !== avant) {
      ecouter(session.user.id);
      void synchroniser();
    }
    if (!session) {
      canal?.unsubscribe();
      canal = null;
    }
  });

  const auRetour = () => {
    if (document.visibilityState === "visible") void synchroniser();
  };
  document.addEventListener("visibilitychange", auRetour);
  window.addEventListener("online", auRetour);

  arreter = () => {
    desabonner();
    data.subscription.unsubscribe();
    document.removeEventListener("visibilitychange", auRetour);
    window.removeEventListener("online", auRetour);
  };
}

export async function seConnecter(email: string, motDePasse: string, nouveau: boolean) {
  const sb = supabase();
  const { error } = nouveau
    ? await sb.auth.signUp({ email, password: motDePasse })
    : await sb.auth.signInWithPassword({ email, password: motDePasse });
  if (error) throw error;
}

/** Déconnecte ce navigateur ; ses données restent sur l'appareil. */
export async function seDeconnecter() {
  await supabase().auth.signOut();
  ecrireRepere(null);
}
