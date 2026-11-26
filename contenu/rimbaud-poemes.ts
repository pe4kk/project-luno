import type { PointFiche } from "@/lib/types";
import type { TexteBac } from "@/lib/bac";
import { A_LA_MUSIQUE, AU_CABARET_VERT, VENUS_ANADYOMENE } from "./bac-francais";
import { DISSERTATION_RIMBAUD, origineCitation } from "./dissertations";

/**
 * Une fiche par poème étudié en classe dans le chapitre « Rimbaud, Cahiers de Douai » (demandé le
 * 2026-11-26 : « les poèmes étudiés en cours séparément, avec l'analyse, les citations importantes
 * et comment les réutiliser »). Tout est tiré des données existantes, sans rien réécrire :
 * - les textes du bac (`bac-francais.ts`) : l'essentiel, la problématique, les mouvements et les
 *   remarques clés du prof ;
 * - la fiche du cours (`francais-rimbaud.ts`) pour les autres poèmes ;
 * - la préparation de la dissertation (`dissertations.ts`) : où et comment réutiliser le poème.
 * Les citations viennent du texte étudié (pour les textes du bac, les mots exacts du poème) ou des
 * notes de cours ; aucune n'est ajoutée ici.
 */

const NOMS_SUJETS: Record<string, string> = {
  emancipation: "« le recueil d’une émancipation ? »",
  revolte: "« seulement par la révolte ? »",
  jeunesse: "« On n’est pas sérieux… »",
  tradition: "« rompt-il avec la tradition ? »",
};
/** Une citation dite de mémoire porte la mention « à vérifier dans ton recueil ». */
const marque = (c: string) => (origineCitation(c) === "verifier" ? `${c} (à vérifier dans ton recueil)` : c);
const AXES = Object.fromEntries(DISSERTATION_RIMBAUD.axes.map((a) => [a.id, a.titre]));

/** Comparaison sans casse ni accents, pour retrouver un poème cité sous un titre un peu différent. */
const cle = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "'")
    .toLowerCase()
    .trim();

/** Où et comment réutiliser ce poème dans une dissertation (citations et arguments déjà rédigés). */
function pourLaDissertation(poeme: string): PointFiche[] {
  const k = cle(poeme);
  const points: PointFiche[] = [];
  for (const c of DISSERTATION_RIMBAUD.citations.filter((x) => cle(x.poeme) === k))
    points.push({
      t: `==Pour la dissertation== : ${marque(c.citation)} (${c.procede}) prouve : ${c.prouve} Axe « ${AXES[c.axe] ?? c.axe} ».`,
      n: 2,
    });
  for (const s of DISSERTATION_RIMBAUD.sujets)
    for (const partie of s.plan)
      for (const a of partie.arguments.filter((x) => cle(x.poeme) === k))
        points.push({
          t: `Sujet ${NOMS_SUJETS[s.id] ?? s.sujet}, ${partie.titre.split(".")[0]}. : « ${a.idee.replace(/\.$/, "")} », avec ${marque(a.citation)}. ${a.analyse}`,
          n: 4,
        });
  return points;
}

/** Fiche d'un texte du bac : sa propre analyse, réduite à ce qu'il faut savoir redire. */
function ficheTexte(t: TexteBac): { titre: string; points: PointFiche[] } {
  const points: PointFiche[] = [];
  if (t.provisoire) points.push({ t: `Attention : ${t.provisoire}`, n: 1 });
  (t.essentiel ?? []).forEach((e, i) => points.push({ t: e, n: i < 2 ? 1 : 2 }));
  points.push({ t: `Problématique : ${t.problematique}`, n: 1 });
  t.mouvements.forEach((m, i) => {
    points.push({ t: `Mouvement ${i + 1} : ${m.titre}.`, n: 2 });
    m.fiche.forEach((f) => points.push({ t: f, n: 3 }));
  });
  // Les remarques clés du prof (mode « L'essentiel » du texte annoté) : citation exacte + procédé.
  for (const m of t.mouvements)
    for (const p of m.passages)
      for (const a of p.annotations.filter((x) => x.cle))
        points.push({
          t: `Citation « ${a.extrait} » : ${a.titre.toLowerCase()}. ${a.texte}${a.retenir ? ` (à retenir : ${a.retenir})` : ""}`,
          n: 3,
        });
  points.push(...pourLaDissertation(t.titre.split(",")[0]));
  t.conclusion.slice(0, 1).forEach((c) => points.push({ t: `Conclusion : ${c}`, n: 4 }));
  return { titre: `« ${t.titre.split(",")[0]} »`, points };
}

/** Poèmes vus en cours, d'après la fiche du cours : chaque point de l'ancienne section « Les poèmes étudiés ». */
const COURS: { titre: string; points: PointFiche[] }[] = [
  {
    titre: "Le Bal des pendus",
    points: [
      { t: "==« Le Bal des pendus » : Villon inversé, sans pitié pour les pendus ; poème politique contre la cour de Napoléon III.==", n: 1 },
      { t: "Le titre renvoie aux fêtes du château de Saint-Cloud, que les journaux hostiles à l'Empire dénonçaient ; attaque ad hominem.", n: 3 },
      { t: "Méthode du cours : une première lecture simple, puis l'intertextualité (ici Villon) révèle un second sens, satirique.", n: 2 },
    ],
  },
  {
    titre: "Le Châtiment de Tartufe",
    points: [
      { t: "==Lecture anticléricale et lecture politique (Tartufe = Napoléon III).==", n: 1 },
      { t: "« Tisonnant » est une métaphore du désir ; « Sa chaste robe noire » désigne la soutane ; « Saint Tartufe était pâle » fait écho à « L'Homme pâle » de « Rages de Césars ».", n: 3 },
      { t: "Acrostiche : les initiales des vers 4 à 11 forment J-U-L-E-S C-E-S, « Jules Cés(ar) ».", n: 2 },
    ],
  },
  {
    titre: "Les Reparties de Nina",
    points: [
      { t: "==La chute « — Et mon bureau ? » ridiculise le discours amoureux ; critique de la poésie romantique.==", n: 1 },
      { t: "Rimbaud se moque des deux personnages ; contrairement aux romantiques, il met toujours une distance entre lui et ses sentiments.", n: 3 },
    ],
  },
  {
    titre: "Ma Bohème",
    points: [
      { t: "==La fugue vécue devient réflexion sur poésie et liberté ; syllepses (« idéal », « un pied », « lyres »).==", n: 1 },
      { t: "Avec « Sensation » : même rêve d'évasion, mais « Sensation » est au futur (un rêve) et « Ma Bohème » à l'imparfait (du vécu).", n: 2 },
      { t: "Mélange des registres familier et soutenu ; Rimbaud s'inscrit dans une tradition, le sonnet, pour mieux la détourner.", n: 3 },
      { t: "La Muse inspire le poète, le féal est un fidèle serviteur (vocabulaire médiéval).", n: 5 },
    ],
  },
  {
    titre: "Les Effarés",
    points: [
      { t: "==Lecture pathétique en apparence, détournée par le registre bas (« Leurs culs en rond »), l'hypallage du « gras sourire » et une critique indirecte de la religion.==", n: 1 },
      { t: "Approche génétique : comparer les versions du poème (le texte du cours est une version de 1871).", n: 5 },
    ],
  },
];

/** Les fiches par poème, dans l'ordre : textes du bac (analyse complète), puis poèmes du cours. */
export const FICHES_POEMES: { titre: string; points: PointFiche[] }[] = [
  ...[A_LA_MUSIQUE, VENUS_ANADYOMENE, AU_CABARET_VERT].map(ficheTexte),
  ...COURS.map((p) => ({ titre: `« ${p.titre} »`, points: [...p.points, ...pourLaDissertation(p.titre)] })),
];
