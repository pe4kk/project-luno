import { toISO } from "./dates";

/**
 * Reconnaît une échéance écrite dans le texte d'une tâche (onglet « À faire ») :
 * « lundi », « pour vendredi », « jeu. », « demain », « après-demain », « ce soir »,
 * « aujourd'hui », ou une date « 20/11 ». Un jour de la semaine renvoie au prochain
 * jour de ce nom, aujourd'hui exclu (un samedi, « samedi » veut dire samedi prochain ;
 * « ce samedi » veut dire aujourd'hui).
 */

// Le nom entier, ou l'abréviation suivie d'un point ou d'un numéro (« jeu. », « jeu 19 ») :
// « un jeu », « la mer » ou « Samuel » ne sont pas des jours.
const JOURS: [string, number][] = [
  ["dimanche", 0],
  ["lundi", 1],
  ["mardi", 2],
  ["mercredi", 3],
  ["jeudi", 4],
  ["vendredi", 5],
  ["samedi", 6],
];
const motifJour = (nom: string) => `${nom}|${nom.slice(0, 3)}\\.|${nom.slice(0, 3)}(?=\\s*\\d)`;

export type DateReconnue = { iso: string; debut: number; fin: number };

const plusJours = (d: Date, n: number) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
};

/** Sans accents ni majuscules, même longueur que le texte d'origine (pour les positions). */
const simplifier = (t: string) =>
  t
    .toLowerCase()
    .split("")
    .map((c) => c.normalize("NFD").replace(/[̀-ͯ]/g, "")[0] ?? c)
    .join("");

export function reconnaitreDate(texte: string, aujourdhui = new Date()): DateReconnue | null {
  const t = simplifier(texte);
  const trouves: DateReconnue[] = [];
  const mot = (re: string) => new RegExp(`(?<![a-z])(?:${re})(?![a-z])`, "g");

  // Date écrite : 20/11, 20/11/2026.
  for (const m of t.matchAll(/(?<!\d)(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?(?!\d)/g)) {
    const jour = Number(m[1]);
    const mois = Number(m[2]);
    if (jour < 1 || jour > 31 || mois < 1 || mois > 12) continue;
    let annee = m[3] ? Number(m[3].length === 2 ? "20" + m[3] : m[3]) : aujourdhui.getFullYear();
    if (!m[3] && new Date(annee, mois - 1, jour).getTime() < aujourdhui.getTime() - 31 * 86_400_000) annee++;
    trouves.push({ iso: toISO(new Date(annee, mois - 1, jour)), debut: m.index!, fin: m.index! + m[0].length });
  }
  // Date en toutes lettres : « le 2 décembre », « 1er déc. », « 15 janvier 2027 ».
  const MOIS = ["janv", "fevr", "mars", "avr", "mai", "juin", "juil", "aout", "sept", "oct", "nov", "dec"];
  for (const m of t.matchAll(
    /(?<!\d)(\d{1,2})(?:er)?\s+(janvier|janv\.?|fevrier|fevr?\.?|mars|avril|avr\.?|mai|juin|juillet|juil\.?|aout|septembre|sept\.?|octobre|oct\.?|novembre|nov\.?|decembre|dec\.?)(?![a-z])(?:\s+(\d{4}))?/g,
  )) {
    const jour = Number(m[1]);
    const mois = MOIS.findIndex((x) => m[2].startsWith(x.slice(0, 3)) && (x !== "mars" || m[2].startsWith("mar")) && (x !== "mai" || m[2].startsWith("mai")));
    if (jour < 1 || jour > 31 || mois < 0) continue;
    let annee = m[3] ? Number(m[3]) : aujourdhui.getFullYear();
    if (!m[3] && new Date(annee, mois, jour).getTime() < aujourdhui.getTime() - 31 * 86_400_000) annee++;
    trouves.push({ iso: toISO(new Date(annee, mois, jour)), debut: m.index!, fin: m.index! + m[0].length });
  }
  // Mots relatifs.
  for (const [re, n] of [
    ["apres[- ]demain", 2],
    ["demain", 1],
    ["aujourd'hui|aujourd’hui|ce soir|ce matin|cet aprem|cet apres-midi", 0],
  ] as [string, number][]) {
    for (const m of t.matchAll(mot(re))) {
      if (re === "demain" && /apres[- ]$/.test(t.slice(0, m.index))) continue;
      trouves.push({ iso: toISO(plusJours(aujourdhui, n)), debut: m.index!, fin: m.index! + m[0].length });
    }
  }
  // Jours de la semaine.
  for (const [nom, jour] of JOURS) {
    for (const m of t.matchAll(mot(motifJour(nom)))) {
      const avant = t.slice(0, m.index);
      const ce = /(?<![a-z])ce\s+$/.test(avant);
      let ecart = (jour - aujourdhui.getDay() + 7) % 7;
      if (ecart === 0 && !ce) ecart = 7;
      trouves.push({ iso: toISO(plusJours(aujourdhui, ecart)), debut: m.index!, fin: m.index! + m[0].length });
    }
  }
  if (!trouves.length) return null;
  // La dernière mention l'emporte (« lundi, à rendre jeudi » → jeudi) : on garde la plus à droite.
  return trouves.sort((a, b) => b.debut - a.debut)[0];
}
