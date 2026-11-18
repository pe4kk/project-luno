import { joursAvant, todayISO } from "./dates";
import { cleCarte, estDue } from "./store";
import type { Chapitre, Dst, EntreeRevision } from "./types";

/**
 * Révisions sur mesure (comme les « paquets filtrés » d'Anki), sans toucher au programme
 * de la répétition espacée : les cartes ratées aujourd'hui, ou celles des prochains jours.
 */
export function cartesRateesAujourdhui(chapitres: Chapitre[], revisions: EntreeRevision[]): CarteDuJour[] {
  const aujourdhui = todayISO();
  const ratees = new Set(revisions.filter((r) => r.note === 0 && r.date.slice(0, 10) === aujourdhui).map((r) => r.carte));
  return uneFois(chapitres, (f) => !f.suspendue && ratees.has(cleCarte(f)));
}
export function cartesEnAvance(chapitres: Chapitre[], jours = 3): CarteDuJour[] {
  const aujourdhui = todayISO();
  return uneFois(chapitres, (f) => !f.suspendue && f.niveau > 0 && f.echeance > aujourdhui && joursAvant(f.echeance) <= jours);
}
/** Une seule fois chaque carte (une carte peut être publiée dans deux chapitres). */
function uneFois(chapitres: Chapitre[], garder: (f: Chapitre["flashcards"][number]) => boolean): CarteDuJour[] {
  const vues = new Set<string>();
  return chapitres.flatMap((c) =>
    c.flashcards.filter((f) => {
      const k = cleCarte(f);
      if (!garder(f) || vues.has(k)) return false;
      vues.add(k);
      return true;
    }).map((f) => ({ chapitreId: c.id, carteId: f.id })),
  );
}

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
  quotaNouvelles: number = QUOTA_NOUVELLES,
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

  // DST dans trois jours au plus : ses cartes nouvelles passent toutes, sans quota (la
  // veille d'une interro, « Rien à revoir aujourd'hui » n'avait pas de sens).
  const proches = new Set(
    dsts.filter((d) => d.date >= aujourdhui && joursAvant(d.date) <= 3).flatMap((d) => d.chapitreIds),
  );
  const urgentes = nouvelles.filter((x) => proches.has(x.chapitreId));
  const autres = nouvelles.filter((x) => !proches.has(x.chapitreId));
  const dejaVues = jour.date === aujourdhui ? jour.nouvelles : 0;
  const quota = Math.max(0, quotaNouvelles - dejaVues - urgentes.length);
  const cartes = [...revues, ...urgentes, ...autres.slice(0, quota)];
  return {
    cartes,
    /** Nouvelles cartes gardées pour les jours suivants. */
    plusTard: Math.max(0, autres.length - quota),
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
