import type { PointFiche, TextePoeme } from "@/lib/types";
import { TEXTES_RIMBAUD } from "./rimbaud-textes";
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
function ficheTexte(t: TexteBac): { titre: string; points: PointFiche[]; poeme?: TextePoeme } {
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
  const poeme: TextePoeme | undefined = t.extraits
    ? undefined
    : {
        titre: t.titre,
        source: "Ton polycopié (le texte annoté de l’onglet Bac)",
        strophes: t.mouvements.flatMap((m) => m.passages.filter((p) => !p.chapeau).map((p) => p.lignes)),
      };
  return { titre: `« ${t.titre.split(",")[0]} »`, points, poeme };
}

/**
 * Poèmes vus en cours, d'après les pages du cahier (photos du 2026-11-26) : partie « III. Lecture de
 * 4 poèmes dont l'interprétation est ouverte », plus « Ma Bohème » et « Sensation ».
 */
const COURS: { titre: string; points: PointFiche[] }[] = [
  {
    titre: "Le Bal des pendus",
    points: [
      { t: "==Rimbaud inverse le sens de « La Ballade des pendus » de Villon : il n'a pas de pitié pour les pendus, parce que ce sont ceux qui ont fait pendre.==", n: 1 },
      { t: "Intertextualité externe : chez Villon, un poème pathétique qui appelle la pitié et la compassion pour les pendus. Chez Rimbaud, on dirait un pastiche, mais un peu étrange : il ne nous fait pas éprouver de pitié.", n: 1 },
      { t: "Analyse superficielle puis seconde : à la première lecture un pastiche, à la seconde un renversement.", n: 2 },
      { t: "Le vocabulaire le montre : chez Villon, les pendus sont de pauvres hères (brigands, voleurs) ; chez Rimbaud, des « paladins », des seigneurs.", n: 2 },
      { t: "Le titre renvoie au château de Saint-Cloud : les journaux anti-napoléoniens accusaient la cour d'y faire des orgies. Rimbaud écrit pour un lecteur contemporain, qui comprend l'allusion.", n: 2 },
      { t: "==Un poème polémique et politique contre Napoléon III== : pendant que les riches se livrent à des orgies, le peuple a faim. La critique de Napoléon III est récurrente chez Rimbaud, ad hominem.", n: 1 },
      { t: "Intertextualité interne : le thème se dégage aussi grâce à « Rages de Césars » et « Morts de Quatre-vingt-douze ». Tonalité polémique : Rimbaud est contre la tyrannie.", n: 3 },
      { t: "La dimension sexuelle (une orgie prêtée à ceux qu'il critique) sert la satire : déconsidérer l'adversaire. Un poème de circonstance, qui nous touche moins aujourd'hui sans son contexte.", n: 4 },
    ],
  },
  {
    titre: "Le Châtiment de Tartufe",
    points: [
      { t: "==Deux lectures : anticléricale (le dévot de Molière cache ses désirs), puis politique (Tartufe = Napoléon III, accusé d'hypocrisie).==", n: 1 },
      { t: "Intertextualité externe : Tartuffe, de Molière (XVIIe siècle), le dévot hypocrite. Première lecture : une critique de l'hypocrisie religieuse, de la religion.", n: 2 },
      { t: "« Tisonnant » (remuer les braises, faire chauffer) : métaphore du désir qui s'allume. Le rejet « Sa chaste robe noire » désigne la soutane. Tartufe trahit le désir qu'il est censé réprimer.", n: 2 },
      { t: "Deuxième lecture : le « Châtiment » renvoie aux Châtiments, pamphlet anti-napoléonien de Victor Hugo.", n: 1 },
      { t: "Intertextualité interne avec « Rages de Césars », sur Napoléon III : l'écho de « pâle » / « pâleur » dans les deux poèmes fait de Saint Tartufe un double de Napoléon.", n: 2 },
      { t: "==Acrostiche : les initiales des vers 4 à 11 forment J-U-L-E-S C-E-S, et la signature de l'auteur, A. R. (Arthur Rimbaud), complète le nom : JULES CÉSAR.== Le César, c'est Napoléon III : l'acrostiche renvoie à « Rages de Césars ».", n: 1 },
    ],
  },
  {
    titre: "Les Reparties de Nina",
    points: [
      { t: "==Un dialogue déséquilibré entre « Lui » et « Elle » : un long discours amoureux, puis la chute « — Et mon bureau ? ».==", n: 1 },
      { t: "On peut penser que Nina est matérialiste, comme les petits bourgeois : une bourgeoisie obnubilée par les objets.", n: 2 },
      { t: "Sarcasme et tonalité comique : Rimbaud se moque de « Lui » et d'« Elle ».", n: 2 },
      { t: "==En embuscade se tient l'auteur, qui mine de l'intérieur le discours de « Lui » pour le rendre encore plus ridicule : Rimbaud critique la poésie romantique.==", n: 1 },
      { t: "Contrairement aux poètes qui épanchent leur « moi », Rimbaud met toujours une distance entre lui et ses sentiments. Ses poèmes ont une inspiration autobiographique, mais toujours sous le prisme d'une distance.", n: 2 },
      { t: "La leçon à retenir : il faut toujours se méfier des lectures strictement autobiographiques de Rimbaud.", n: 3 },
    ],
  },
  {
    titre: "Ma Bohème",
    points: [
      { t: "==La fugue devient une réflexion sur la poésie et la liberté : l'effort d'émancipation nourrit son écriture.==", n: 1 },
      { t: "Avec « Sensation », les deux poèmes évoquent une évasion et une reconnexion avec la nature ; « Ma Bohème » semble plus négatif.", n: 2 },
      { t: "Vers 2 : syllepse de sens, « Mon paletot aussi devenait idéal » : le paletot (manteau) devient parfait, mais n'est peut-être plus qu'une idée, tant il est usé.", n: 1 },
      { t: "« un pied » : syllepse de sens, le pied du marcheur et le pied du vers. « Comme des lyres » : la lyre du poète, et le délire.", n: 2 },
      { t: "Rimbaud alterne mots familiers et mots soutenus : en mêlant les niveaux de langue dans un sonnet, il s'inscrit dans une tradition pour mieux la détourner.", n: 2 },
      { t: "Vocabulaire : un féal est un fidèle serviteur (mot médiéval) ; une Muse est une inspiration, souvent une personne, et même une femme.", n: 4 },
    ],
  },
  {
    titre: "Sensation",
    points: [
      { t: "==Le rêve d'évasion : « J'irai loin, bien loin » dit l'envie d'ailleurs, une critique du milieu social, moral et familial, qui traduit l'émancipation.==", n: 1 },
      { t: "Comparé à « Ma Bohème » : thèmes communs (amour, nature, rêve et émancipation), la nature en commun, voix de la nature ; le bohémien, pauvre et nomade.", n: 2 },
      { t: "La différence : le futur de « Sensation » (un rêve) contre l'imparfait de « Ma Bohème » (du vécu).", n: 1 },
    ],
  },
  {
    titre: "Les Effarés",
    points: [
      { t: "==Lecture pathétique en apparence, détournée : niveau de langue plus bas par moments (« Leurs culs en rond »), critique indirecte de la religion, Rimbaud polisson sous des dehors de respectabilité bourgeoise.==", n: 1 },
      { t: "Le texte du cours est la troisième version (1871, peut-être avec Verlaine), légèrement différente de celle des Cahiers de Douai : approche génétique, comparer les versions.", n: 2 },
      { t: "Intertextualité externe et palimpseste : Rimbaud réécrit des poèmes sur le même sujet. Tout texte est pris dans un réseau intertextuel. Postulat : Rimbaud pastiche ; à la première lecture, l'intertextualité semble le confirmer.", n: 2 },
      { t: "Quelle originalité ? Des éléments détournent le message : le niveau de langue, des pauvres qui n'évoluent pas, une religion qui ne change rien (ils prient, mais rien ne se passe).", n: 2 },
      { t: "Hypallage : « Le Boulanger au gras sourire / Grogne un vieil air. » L'adjectif « gras » est associé au sourire alors qu'il qualifie le boulanger (et son pain).", n: 1 },
      { t: "Trois lectures possibles : réaliste ; critique de la religion ; critique de la bourgeoisie. Rimbaud est moderne : ses poèmes sont plus libres d'interprétation, le sens est équivoque.", n: 3 },
      { t: "La leçon du cours : le lecteur doit chercher le sens. L'auteur classique cherche à maîtriser la réception de son œuvre ; Rimbaud programme plusieurs réceptions du texte. Il faut se garder des lectures naïves et scolaires.", n: 3 },
    ],
  },
];

/** Les fiches par poème, dans l'ordre : textes du bac (analyse complète), puis poèmes du cours. */
/** Une ligne pour la carte du sommaire. */
export const RESUMES_POEMES: Record<string, string> = {
  "À la Musique": "Satire des bourgeois de Charleville",
  "Vénus Anadyomène": "Un contre-blason, deux lectures",
  "Au Cabaret-Vert": "Joie simple, sonnet malmené · provisoire",
  "Le Bal des pendus": "Villon inversé, contre Napoléon III",
  "Le Châtiment de Tartufe": "Deux lectures, l'acrostiche Jules César",
  "Les Reparties de Nina": "« — Et mon bureau ? »",
  "Ma Bohème": "La fugue, les syllepses",
  "Sensation": "Le rêve d'ailleurs, au futur",
  "Les Effarés": "Un pathétique détourné",
};

export const FICHES_POEMES: { titre: string; points: PointFiche[]; poeme?: TextePoeme; groupe: string }[] = [
  ...[A_LA_MUSIQUE, VENUS_ANADYOMENE, AU_CABARET_VERT].map((t) => ({ ...ficheTexte(t), groupe: "Textes du bac" })),
  ...COURS.map((p) => ({
    groupe: "Poèmes du cours",
    titre: `« ${p.titre} »`,
    points: [...p.points, ...pourLaDissertation(p.titre)],
    poeme: TEXTES_RIMBAUD[p.titre],
  })),
];
