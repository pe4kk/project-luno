export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const j = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${j}`;
}

export function fromISO(iso: string): Date {
  const [a, m, j] = iso.split("-").map(Number);
  return new Date(a, m - 1, j);
}

export function todayISO(): string {
  return toISO(new Date());
}

/** Date dans n jours (AAAA-MM-JJ). */
export function dansJours(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
}

/** Nombre de jours entre aujourd'hui et la date (négatif si passée). */
export function joursAvant(iso: string): number {
  const ms = fromISO(iso).getTime() - fromISO(todayISO()).getTime();
  return Math.round(ms / 86_400_000);
}

export function compteARebours(iso: string): string {
  const j = joursAvant(iso);
  if (j === 0) return "Aujourd'hui";
  if (j === 1) return "Demain";
  if (j > 1) return `J-${j}`;
  return j === -1 ? "Hier" : `Il y a ${-j} j`;
}

const fmtLong = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const fmtMois = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function dateLongue(iso: string): string {
  return majuscule(fmtLong.format(fromISO(iso)));
}

export function titreMois(annee: number, mois: number): string {
  return majuscule(fmtMois.format(new Date(annee, mois, 1)));
}

/** Grille de 6 semaines commençant un lundi. */
export function grilleMois(annee: number, mois: number): { iso: string; dansMois: boolean }[] {
  const premier = new Date(annee, mois, 1);
  const decalage = (premier.getDay() + 6) % 7;
  const cases: { iso: string; dansMois: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(annee, mois, 1 - decalage + i);
    cases.push({ iso: toISO(d), dansMois: d.getMonth() === mois });
  }
  // Retire la dernière semaine si elle est entièrement hors du mois.
  return cases.slice(35).some((c) => c.dansMois) ? cases : cases.slice(0, 35);
}

export function dureeLisible(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}
