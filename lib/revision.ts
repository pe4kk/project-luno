import { todayISO } from "./dates";
import { estDue } from "./store";
import type { Chapitre, Dst } from "./types";

/**
 * Révision du jour avec un quota de nouvelles cartes.
 *
 * Un chapitre publié arrive avec toutes ses cartes « nouvelles » : sans limite, l'accueil
 * affichait 208 cartes à revoir le premier jour, ce qui décourage. On garde toutes les
 * cartes déjà vues qui reviennent, et on ajoute au plus `QUOTA_NOUVELLES` cartes
 * nouvelles par jour, en commençant par les chapitres du prochain DST.
 */
export const QUOTA_NOUVELLES = 20;

export type CarteDuJour = { chapitreId: string; carteId: string };

export function revisionDuJour(
  chapitres: Chapitre[],
  dsts: Dst[],
  jour: { date: string; nouvelles: number },
) {
  const aujourdhui = todayISO();
  const ordonnes = trierParDst(chapitres, dsts);

  const revues: CarteDuJour[] = [];
  const nouvelles: CarteDuJour[] = [];
  for (const c of ordonnes)
    for (const f of c.flashcards) {
      if (!estDue(f)) continue;
      (f.niveau === 0 ? nouvelles : revues).push({ chapitreId: c.id, carteId: f.id });
    }

  const dejaVues = jour.date === aujourdhui ? jour.nouvelles : 0;
  const quota = Math.max(0, QUOTA_NOUVELLES - dejaVues);
  const cartes = [...revues, ...nouvelles.slice(0, quota)];
  return {
    cartes,
    /** Nouvelles cartes gardées pour les jours suivants. */
    plusTard: Math.max(0, nouvelles.length - quota),
    /** Nombre de cartes du jour, par chapitre. */
    parChapitre: cartes.reduce<Record<string, number>>((m, x) => {
      m[x.chapitreId] = (m[x.chapitreId] ?? 0) + 1;
      return m;
    }, {}),
  };
}

/** Les chapitres des DST les plus proches d'abord (ordre d'origine sinon). */
export function trierParDst<C extends { id: string }>(chapitres: C[], dsts: Dst[]): C[] {
  const aujourdhui = todayISO();
  const rang = new Map<string, number>();
  dsts
    .filter((d) => d.date >= aujourdhui)
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((d, i) => d.chapitreIds.forEach((id) => rang.has(id) || rang.set(id, i)));
  return [...chapitres].sort((a, b) => (rang.get(a.id) ?? Infinity) - (rang.get(b.id) ?? Infinity));
}

/** « Lundi : interro de PC » : le prochain DST d'un chapitre, pour l'afficher sur sa carte. */
export function prochainDstDe(chapitreId: string, dsts: Dst[]) {
  const aujourdhui = todayISO();
  return dsts
    .filter((d) => d.date >= aujourdhui && d.chapitreIds.includes(chapitreId))
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}
