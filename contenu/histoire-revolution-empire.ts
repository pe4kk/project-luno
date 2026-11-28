import { HISTOIRE_TERREUR as T } from "./histoire-terreur";
import type { ChapitrePublie, DateCle, DefinitionCours, ElementSchema, ImageCours, Lecon, Probleme, Schema } from "@/lib/types";

/**
 * Histoire-Géo Première, thème 1, H1 : « La Révolution française et l'Empire : une nouvelle
 * conception de la nation ». Repris le 2026-11-26 de 17 photos du cahier (notes de cours,
 * textes et documents de la prof, frise, carte mentale du Code civil, fiche méthode de la
 * question problématisée).
 *
 * DST du jeudi 3/12/2026 (1 h 30) : introduction rédigée + plan détaillé rédigé (titre de
 * partie, titre de sous-partie, puis « argument, exemple, idée », transitions) d'une question
 * problématisée. Au programme : jusqu'au Code civil en France ; pas les conquêtes ni la
 * diffusion du Code en Europe (barré « pas au DST » sur la carte mentale), pas la fin de
 * l'Empire. Partie II.A (1791-1794) : la Terreur, reprise du chapitre « La Convention et la Terreur »
 * (vidéo du 2026-11-13), fusionné ici le 2026-11-26 (« la Terreur rentre dans le H1 »).
 *
 * La prof tient à « Napoléon sacré par le pape » : c'est exact (Pie VII le sacre, c'est-à-dire
 * l'oint ; Napoléon pose lui-même la couronne sur sa tête), on écrit donc comme elle.
 */
const matiere = { nom: "Histoire-Géo", couleur: "#c98b6b", emoji: "🌍" };
const dossier = "documents/histoire-geo";

const PYRAMIDE: ImageCours = {
  fichier: `${dossier}/revolution-societe-ordres.jpg`,
  alt: "Pyramide de la société d'ordres : en haut les ordres privilégiés (clergé 0,5 %, noblesse 1,5 % de la population), au milieu la bourgeoisie (robe, finance, négoce), en bas le tiers état rural et urbain, et sous la pyramide les esclaves des plantations coloniales. Des flèches montrent l'ascension sociale possible.",
  legende: "La société d'ordres à la veille de 1789 (document de ton cours, complété en classe).",
  ratio: 1.989,
};

// ———————————————————— Les frises (d'après la frise de la prof) ————————————————————

const t = (x: number, y: number, s: string, o: Partial<{ taille: number; ancre: "start" | "middle" | "end"; main: boolean; ton: "encre" | "accent" | "cuivre" | "doux" | "ok" }> = {}): ElementSchema => ({
  f: "texte",
  en: [x, y],
  t: s,
  taille: o.taille ?? 11,
  ancre: o.ancre ?? "middle",
  ...(o.main ? { main: true } : {}),
  ton: o.ton ?? "encre",
});
const repere = (x: number, y1: number, y2: number): ElementSchema => ({ f: "trait", points: [[x, y1], [x, y2]], ton: "encre", fin: true });

/** Grande frise 1789-1815 : les régimes successifs. */
const FRISE: Schema = {
  l: 360,
  h: 214,
  legende: "La Révolution française et l'Empire : les régimes successifs, de 1789 à 1815 (frise du cours, sans échelle).",
  elements: [
    { f: "trait", points: [[6, 86], [326, 86], [326, 74], [354, 106], [326, 138], [326, 126], [6, 126]], ferme: true, plein: true, ton: "cuivre" },
    repere(54, 66, 126),
    repere(110, 66, 126),
    repere(236, 66, 126),
    repere(292, 66, 126),
    t(54, 60, "1789", { taille: 12 }),
    t(110, 60, "1792", { taille: 12 }),
    t(236, 60, "1799", { taille: 12 }),
    t(292, 60, "1804", { taille: 12 }),
    t(338, 60, "1815", { taille: 12 }),
    t(30, 103, "Ancien", { taille: 10 }),
    t(30, 116, "Régime", { taille: 10 }),
    t(82, 103, "Monarchie", { taille: 9.5 }),
    t(82, 116, "constit.", { taille: 9.5 }),
    t(173, 110, "Ire République", { taille: 11 }),
    t(264, 110, "Consulat", { taille: 10.5 }),
    t(312, 110, "Empire", { taille: 10.5 }),
    { f: "rect", de: [116, 134], a: [162, 154], ton: "accent", plein: true, arrondi: 3 },
    t(139, 148, "Terreur", { taille: 10, ton: "accent" }),
    t(139, 167, "1793-1794", { taille: 9, ton: "accent" }),
    { f: "rect", de: [180, 134], a: [234, 154], ton: "doux", plein: true, arrondi: 3 },
    t(207, 148, "Directoire", { taille: 10 }),
    t(207, 167, "1795-1799", { taille: 9, ton: "doux" }),
    t(110, 22, "21 janvier 1793 :", { main: true, taille: 13 }),
    t(110, 38, "exécution de Louis XVI", { main: true, taille: 13 }),
    repere(124, 42, 47),
    t(352, 22, "Sacre par le pape", { main: true, taille: 13, ancre: "end" }),
    t(352, 38, "2 décembre 1804", { main: true, taille: 12, ancre: "end" }),
    repere(292, 42, 48),
    repere(236, 126, 180),
    t(236, 194, "Coup d'État du 18 brumaire", { main: true, taille: 13 }),
  ],
};

/** Zoom sur 1789. */
const FRISE_1789: Schema = {
  l: 360,
  h: 200,
  legende: "Zoom sur 1789 : de la convocation des États généraux à la marche des femmes sur Versailles.",
  elements: [
    { f: "trait", points: [[6, 82], [330, 82], [330, 72], [354, 100], [330, 128], [330, 118], [6, 118]], ferme: true, plein: true, ton: "cuivre" },
    { f: "fleche", de: [142, 100], a: [236, 100], ton: "accent" },
    t(189, 95, "Grande Peur", { taille: 10, ton: "accent" }),
    // Au-dessus
    repere(32, 52, 82),
    t(32, 46, "Mai 1789", { taille: 10.5 }),
    t(32, 18, "États", { main: true, taille: 13 }),
    t(32, 32, "généraux", { main: true, taille: 13 }),
    repere(142, 52, 82),
    t(142, 46, "14 juillet", { taille: 10.5 }),
    t(142, 18, "Prise de", { main: true, taille: 13 }),
    t(142, 32, "la Bastille", { main: true, taille: 13 }),
    repere(250, 52, 82),
    t(250, 46, "26 août", { taille: 10.5 }),
    t(250, 30, "DDHC", { main: true, taille: 14 }),
    // En dessous
    repere(88, 118, 140),
    t(88, 152, "20 juin", { taille: 10.5 }),
    t(88, 170, "Serment du", { main: true, taille: 13 }),
    t(88, 184, "Jeu de paume", { main: true, taille: 13 }),
    repere(196, 118, 140),
    t(196, 152, "Nuit du 4 août", { taille: 10.5 }),
    t(196, 170, "Abolition", { main: true, taille: 13 }),
    t(196, 184, "des privilèges", { main: true, taille: 13 }),
    repere(316, 118, 140),
    t(316, 152, "5-6 octobre", { taille: 10.5 }),
    t(316, 170, "Marche des femmes", { main: true, taille: 13, ancre: "end" }),
    t(316, 184, "sur Versailles", { main: true, taille: 13, ancre: "end" }),
  ],
};

// ———————————————————— Définitions ————————————————————

const d = (terme: string, texte: string, precision?: string): DefinitionCours => ({
  type: "definition",
  terme,
  texte,
  ...(precision ? { precision } : {}),
});
const p = (terme: string, texte: string, precision?: string): DefinitionCours => ({
  type: "propriete",
  terme,
  texte,
  ...(precision ? { precision } : {}),
});

/** Les définitions du cahier (losanges), dans l'ordre du cours. */
const DEFINITIONS: DefinitionCours[] = [
  d(
    "Nation",
    "Ensemble des êtres humains vivant dans un même territoire, ayant une communauté d'origine, d'histoire, de culture, de traditions, parfois de langue, et constituant une communauté politique.",
    "Avec la Révolution : l'appartenance nationale fait des citoyens souverains.",
  ),
  p(
    "Les Lumières (XVIIIe siècle)",
    "Mouvement philosophique, littéraire, politique et scientifique. Il veut séparer les pouvoirs (exécutif, législatif, judiciaire : Montesquieu, De l'esprit des lois, 1748) et remet en cause la société d'ordres et la monarchie absolue, pour mettre fin à l'injustice et au fanatisme religieux, au nom de la souveraineté du peuple.",
  ),
  d(
    "Absolutisme",
    "Régime monarchique dans lequel le roi prétend gouverner sans limites et avoir tous les droits sur ses sujets ; il tend à assimiler sa volonté à la loi et concentre un pouvoir politique central.",
  ),
  d("Disette", "Manque de ce qui est nécessaire à la vie, et en particulier manque de vivres."),
  d(
    "Ancien Régime",
    "Système politique et social en place dans le royaume de France avant la Révolution française de 1789, caractérisé par une monarchie absolue de droit divin et une société divisée en trois ordres : le clergé, la noblesse et le tiers état.",
  ),
  d(
    "Cahier de doléances",
    "Document dans lequel les représentants élus aux États généraux consignent les vœux et les réclamations des Français.",
  ),
  d("Club", "Association dont les membres se réunissent régulièrement pour débattre de sujets politiques."),
  d(
    "Monarchie constitutionnelle",
    "Régime politique qui reconnaît un monarque héréditaire (ou parfois élu) comme chef de l'État et du pouvoir exécutif, mais qui limite ses pouvoirs pour laisser le pouvoir législatif au Parlement. Le peuple (suffrage censitaire, où seuls les riches peuvent voter) élit une assemblée législative qui propose et vote les lois en collaboration avec le roi.",
  ),
  d(
    "Constitution",
    "Texte qui définit et organise les pouvoirs au sein d'un régime politique.",
    "Pendant la Révolution, le projet de constitution naît au serment du Jeu de paume (juin 1789), mais elle n'est adoptée qu'en septembre 1791.",
  ),
  d(
    "Suffrage censitaire",
    "Seuls les citoyens qui paient un impôt (le cens), donc les plus riches, peuvent voter.",
    "Constitution de 1791 : la nation souveraine est formée des citoyens riches âgés d'au moins 25 ans.",
  ),
  ...(T.definitions ?? []),
  d(
    "Coup d'État",
    "Prise du pouvoir par la force avec l'aide de l'armée.",
    "Une prise de pouvoir à main armée, non souhaitée par le régime en place.",
  ),
];

// ———————————————————— Dates (la frise) ————————————————————

const DATES: DateCle[] = [
  { date: "1748", tri: "1748", evenement: "Montesquieu, De l'esprit des lois", precision: "Les Lumières : séparer les pouvoirs exécutif, législatif et judiciaire.", importance: 2 },
  { date: "1776", tri: "1776-07-04", evenement: "Déclaration d'indépendance des États-Unis", precision: "« Tous les hommes sont nés égaux » : les valeurs des Lumières appliquées, et une république. Un modèle pour les Français.", importance: 2 },
  { date: "Hiver 1788", tri: "1788-12", evenement: "Hiver très froid, peu de récoltes", precision: "La disette s'ajoute à la crise financière de la monarchie (plus de dépenses que de revenus).", importance: 2 },
  { date: "27 décembre 1788", tri: "1788-12-27", evenement: "Le roi accorde le doublement du tiers état", precision: "Autant de députés du tiers état que des deux autres ordres réunis aux États généraux (document du cours).", importance: 2 },
  { date: "Mai 1789", tri: "1789-05", evenement: "Ouverture des États généraux à Versailles", precision: "Les députés apportent les cahiers de doléances. Louis XVI refuse le vote par tête.", importance: 1 },
  { date: "20 juin 1789", tri: "1789-06-20", evenement: "Serment du Jeu de paume", precision: "Les députés du tiers état, devenus Assemblée nationale, jurent de donner une constitution à la France : la nation au centre.", importance: 1 },
  { date: "14 juillet 1789", tri: "1789-07-14", evenement: "Prise de la Bastille", precision: "Insurrection armée contre un symbole du pouvoir absolu du roi (prison).", importance: 1 },
  { date: "Juillet-août 1789", tri: "1789-07-20", evenement: "La Grande Peur dans les campagnes", precision: "Les paysans pillent les châteaux et brûlent les titres seigneuriaux.", importance: 1 },
  { date: "Nuit du 4 août 1789", tri: "1789-08-04", evenement: "Abolition des privilèges", precision: "Fin de la société d'ordres.", importance: 1 },
  { date: "26 août 1789", tri: "1789-08-26", evenement: "Déclaration des droits de l'homme et du citoyen (DDHC)", precision: "« Les hommes naissent et demeurent libres et égaux en droits » ; « la souveraineté réside essentiellement dans la nation ».", importance: 1 },
  { date: "5-6 octobre 1789", tri: "1789-10-05", evenement: "Marche des femmes sur Versailles", precision: "7 000 Parisiennes ramènent la famille royale à Paris ; le roi approuve la DDHC.", importance: 1 },
  { date: "14 juillet 1790", tri: "1790-07-14", evenement: "Fête de la Fédération", precision: "Serments du roi et de La Fayette à la nation et à la Constitution : unité nationale.", importance: 1 },
  { date: "Septembre 1791", tri: "1791-09", evenement: "Constitution de 1791 : monarchie constitutionnelle", precision: "Suffrage censitaire, assemblée législative, roi des Français.", importance: 1 },
  { date: "21 septembre 1792", tri: "1792-09-21", evenement: "Proclamation de la République (Ire République)", precision: "Par la Convention.", importance: 1 },
  { date: "21 janvier 1793", tri: "1793-01-21", evenement: "Exécution de Louis XVI", importance: 1 },
  { date: "26 octobre 1795 (4 brumaire an IV)", tri: "1795-10-26", evenement: "Début du Directoire (Constitution de l'an III)", importance: 1 },
  { date: "9 novembre 1799 (18 brumaire an VIII)", tri: "1799-11-09", evenement: "Coup d'État de Napoléon Bonaparte : fin du Directoire", precision: "À Saint-Cloud, avec l'armée, contre le Conseil des Cinq-Cents.", importance: 1 },
  { date: "Décembre 1799", tri: "1799-12", evenement: "Constitution de l'an VIII : le Consulat", precision: "Le Premier consul, Bonaparte, concentre le pouvoir.", importance: 1 },
  { date: "1802", tri: "1802-08", evenement: "Bonaparte consul à vie ; création de la Légion d'honneur et des lycées", importance: 2 },
  { date: "21 mars 1804", tri: "1804-03-21", evenement: "Promulgation du Code civil", precision: "Un droit unifié pour toute la France.", importance: 1 },
  { date: "18 mai 1804 (28 floréal an XII)", tri: "1804-05-18", evenement: "Sénatus-consulte : Napoléon empereur des Français", precision: "« Le gouvernement de la République est confié à un empereur. »", importance: 1 },
  { date: "2 décembre 1804", tri: "1804-12-02", evenement: "Sacre de Napoléon par le pape, à Notre-Dame de Paris", importance: 1 },
  { date: "1815", tri: "1815", evenement: "Fin de l'Empire", precision: "Hors DST.", importance: 2 },
];

// ———————————————————— Questions problématisées (DST : intro + plan détaillé) ————————————————————

/** Critères communs de l'introduction, tirés de la fiche méthode de la prof. */
const CRITERES_INTRO = [
  "Accroche (facultative) : un événement précis, un tableau, une citation",
  "Contexte présenté",
  "Mots-clés du sujet définis",
  "Bornes chronologiques et spatiales justifiées",
  "Problématique après un saut de ligne",
  "Annonce du plan",
];
const CRITERES_PARTIE = [
  "Titre de la partie qui reprend les mots du sujet",
  "Deux sous-parties titrées",
  "Chaque argument a un exemple précis, daté et localisé",
  "Chaque exemple est relié à l'idée (ce qu'il prouve pour le sujet)",
  "Phrases rédigées, pas de tirets ni d'abréviations",
];
const CRITERES_TRANSITION = ["Bilan de la partie en une phrase", "Question ou idée qui annonce la partie suivante"];
/** Copie développée (mode « developpe ») : la partie entièrement rédigée, d'après la fiche méthode de la prof. */
const CRITERES_PARTIE_DEVELOPPE = [
  "Titres de la partie et des sous-parties gardés, puis une phrase qui annonce l'idée directrice avec les mots du sujet",
  "Un paragraphe par argument, qui commence par l'idée",
  "Chaque exemple précis, daté et localisé, est expliqué : ce qu'il prouve pour le sujet",
  "Connecteurs logiques entre les arguments, sans spirale descriptive",
  "Retour au sujet en fin de paragraphe",
];
const CRITERES_CONCLUSION = [
  "Bilan qui répond clairement à la problématique",
  "Les idées de chaque partie reprises dans l'ordre du plan",
  "Aucun exemple nouveau dans le bilan",
  "Ouverture exacte vers la suite ou un sujet proche (facultative selon ta prof)",
];

const ANALYSE_CONSIGNE =
  "Au brouillon, comme le demande ta prof : entoure les mots-clés et définis-les (« Quoi ? »), trouve les bornes (« Où ? », « Quand ? »), puis choisis le type de plan (chronologique ou thématique).";
const PARTIE_CONSIGNE =
  "Plan détaillé rédigé : titre de la partie, titre de la sous-partie, puis pour chaque argument une phrase « argument, exemple, idée ». Deux arguments par sous-partie suffisent.";
const PARTIE_DEVELOPPE_CONSIGNE =
  "Copie développée : recopie le titre de la partie, puis une phrase qui annonce son idée directrice ; sous chaque titre de sous-partie, un paragraphe par argument (alinéa) : l'idée, un exemple précis daté et localisé, puis ce qu'il prouve pour le sujet. Enchaîne avec des connecteurs logiques et saute une ligne entre les parties.";
const CONCLUSION_CONSIGNE =
  "Un bilan rapide qui répond à la problématique en reprenant les points clés de chaque partie, puis, si tu as le temps, une ouverture vers une perspective plus vaste. Conseil de ta prof : prépare-la au brouillon avant le développement, pour être sûr de rendre une copie complète.";

export const PROBLEMES_REVOLUTION: Probleme[] = [
  {
    id: "hg-qp-nation",
    titre: "Question problématisée : la nation au cœur de la vie politique",
    duree: "1 h 30 (DST)",
    enonce:
      "Sujet : Comment la Révolution française et Napoléon Bonaparte transforment-ils la France en plaçant la nation au cœur de la vie politique (1789-1804) ?",
    question:
      "C'est la question de ton chapitre : le sujet le plus probable. Rédige l'introduction et le plan détaillé, comme au DST.",
    etapes: [
      {
        titre: "Analyser le sujet",
        consigne: ANALYSE_CONSIGNE,
        attendu:
          "Mots-clés : « nation » (une communauté politique de citoyens souverains), « vie politique » (qui gouverne, qui vote, qui fait la loi), « transforment » (le sujet attend un changement par rapport à l'Ancien Régime).\nBornes : 1789 (États généraux, début de la Révolution) à 1804 (Code civil et Empire) ; la France.\nPlan : chronologique, car la place de la nation change selon les régimes (une partie = une période).",
        criteres: ["Nation définie", "Bornes justifiées par des événements", "Plan chronologique justifié"],
        points: 2,
      },
      {
        titre: "Rédiger l'introduction",
        consigne: "Accroche, contexte, définitions et bornes, problématique, annonce du plan. Des phrases complètes.",
        attendu:
          "Le 20 juin 1789, dans la salle du Jeu de paume de Versailles, les députés du tiers état jurent de ne pas se séparer avant d'avoir donné une constitution à la France. Jusque-là, la France vivait sous l'Ancien Régime : une monarchie absolue de droit divin, où le roi concentre tous les pouvoirs, et une société divisée en trois ordres, dont deux privilégiés. La nation, c'est-à-dire une communauté de citoyens qui partagent une histoire et une culture et forment une communauté politique, n'avait pas de place dans le pouvoir. De 1789, début de la Révolution, à 1804, quand Napoléon devient empereur et promulgue le Code civil, la France change plusieurs fois de régime.\n\nComment la Révolution française et Napoléon Bonaparte transforment-ils la France en plaçant la nation au cœur de la vie politique ?\n\nNous verrons d'abord comment la nation devient souveraine entre 1789 et 1792, puis comment, de 1792 à 1799, elle se divise dans une République instable, enfin comment Napoléon, de 1799 à 1804, encadre la nation par un pouvoir personnel tout en consolidant certains acquis de la Révolution.",
        criteres: CRITERES_INTRO,
        points: 5,
      },
      {
        titre: "Partie I",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "I. 1789-1792 : la nation devient souveraine\n\nA. En 1789, la nation prend le pouvoir au roi\n– Les députés du tiers état se proclament représentants de la nation. Ainsi, le 20 juin 1789, par le serment du Jeu de paume à Versailles, ils jurent de donner une constitution à la France : la souveraineté passe du roi à la nation.\n– Le peuple intervient par la force pour défendre la nouvelle Assemblée. La prise de la Bastille à Paris, le 14 juillet 1789, attaque un symbole du pouvoir absolu, et la marche des femmes des 5 et 6 octobre 1789 ramène le roi à Paris : la nation ne se réduit pas aux députés, le peuple pèse sur le pouvoir.\n\nB. Une nation de citoyens égaux dans une monarchie constitutionnelle\n– La société d'ordres disparaît. Dans la nuit du 4 août 1789, l'Assemblée abolit les privilèges, puis la DDHC du 26 août 1789 affirme que « les hommes naissent et demeurent libres et égaux en droits » et que « la souveraineté réside essentiellement dans la nation » : tous les Français deviennent membres d'une même nation.\n– La Constitution de septembre 1791 organise une monarchie constitutionnelle : une assemblée législative élue vote les lois et l'impôt, le roi des Français les fait exécuter. Mais le suffrage est censitaire (citoyens riches d'au moins 25 ans) : la nation souveraine reste limitée aux plus riches.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "I. 1789-1792 : la nation devient souveraine\n\nEntre 1789 et 1792, la nation prend la place du roi comme source du pouvoir : elle devient souveraine.\n\nA. En 1789, la nation prend le pouvoir au roi\n\nEn 1789, les députés du tiers état affirment qu'ils représentent la nation tout entière et lui transfèrent la souveraineté, qui appartenait jusque-là au roi. Réunis à Versailles pour les États généraux, ils se heurtent au refus de Louis XVI de voter par tête ; ils se proclament alors Assemblée nationale et, le 20 juin 1789, dans la salle du Jeu de paume, ils jurent de ne pas se séparer avant d'avoir donné une constitution à la France. Ce serment montre que le pouvoir de fixer les règles du pays ne vient plus du roi de droit divin, mais des représentants de la nation.\n\nPar ailleurs, la nation ne se réduit pas aux députés : le peuple intervient directement, et parfois par la force. Le 14 juillet 1789, à Paris, les insurgés prennent la Bastille, prison qui symbolise le pouvoir absolu du roi ; les 5 et 6 octobre, 7 000 Parisiennes marchent sur Versailles et ramènent la famille royale à Paris, où le roi doit approuver la DDHC. Le peuple pèse donc désormais sur le pouvoir : la nation est devenue un acteur de la vie politique.\n\nB. Une nation de citoyens égaux dans une monarchie constitutionnelle\n\nPour que la nation existe, il faut d'abord que les Français soient égaux. Dans la nuit du 4 août 1789, l'Assemblée abolit les privilèges de la noblesse et du clergé, ce qui met fin à la société d'ordres. Puis la DDHC, adoptée le 26 août 1789, proclame que « les hommes naissent et demeurent libres et égaux en droits » et que « la souveraineté réside essentiellement dans la nation ». Ainsi, tous les Français deviennent membres d'une même communauté politique, et le pouvoir tire désormais sa légitimité de la nation.\n\nCette souveraineté nationale est ensuite organisée, mais avec des limites. La Constitution de septembre 1791 crée une monarchie constitutionnelle : une assemblée législative élue et indissoluble vote les lois et l'impôt, tandis que le roi des Français, héréditaire, les fait exécuter et ne dispose que d'un veto suspensif. Cependant, le suffrage est censitaire : seuls les citoyens assez riches pour payer l'impôt, âgés d'au moins 25 ans, votent. La nation est donc souveraine en droit, mais seule une partie des Français exerce réellement cette souveraineté.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie II",
        consigne: "Une phrase qui fait le bilan et annonce la suite.",
        attendu:
          "En trois ans, la nation est devenue souveraine ; pourtant, le compromis avec le roi ne dure pas, et la nation se divise sur la forme que doit prendre son pouvoir.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie II",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "II. 1792-1799 : une nation divisée dans une République instable\n\nA. La République défend la nation par la Terreur\n– La nation se passe du roi. La Convention proclame la République le 21 septembre 1792, et Louis XVI est exécuté le 21 janvier 1793 : la souveraineté appartient désormais à la seule nation.\n– Pour défendre la République menacée par la guerre et la Vendée, le gouvernement révolutionnaire suspend les libertés. La loi des suspects du 17 septembre 1793 permet d'arrêter tous les « ennemis de la liberté » : au nom de la nation, une partie des citoyens est exclue et poursuivie, même si des mesures sociales sont prises (abolition de l'esclavage, 4 février 1794).\n\nB. Le Directoire, une République fragile\n– Après la chute de Robespierre (28 juillet 1794), la Constitution de l'an III crée le Directoire (26 octobre 1795) pour rendre impossibles les excès : le pouvoir est partagé entre cinq directeurs et deux assemblées, le Conseil des Cinq-Cents qui propose les lois et le Conseil des Anciens qui les vote.\n– Mais le suffrage censitaire, restreint et indirect, divise environ par deux le nombre d'électeurs, la misère revient et les royalistes comme les jacobins menacent le régime : la nation est peu représentée et la République reste instable.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "II. 1792-1799 : une nation divisée dans une République instable\n\nDe 1792 à 1799, la nation devient la seule source du pouvoir dans une République, mais elle se divise et le régime reste instable.\n\nA. La République défend la nation par la Terreur\n\nÀ partir de 1792, la nation se passe du roi. La Convention, élue en septembre 1792, proclame la République le 21 septembre 1792, puis Louis XVI est jugé et exécuté à Paris le 21 janvier 1793. Pour la première fois, la France n'a plus de monarque : la souveraineté appartient entièrement à la nation et à ses représentants.\n\nMais cette République est menacée de toutes parts, et elle défend la nation en restreignant les libertés. En 1793, la France est en guerre contre les États coalisés, et l'Ouest se soulève en mars contre la levée de 300 000 hommes : c'est la guerre de Vendée. Le gouvernement révolutionnaire, appuyé sur le Comité de salut public, fait voter la loi des suspects le 17 septembre 1793, qui permet d'arrêter tous les ennemis de la Révolution, avoués ou supposés. Au nom de la nation, une partie des citoyens est donc exclue et poursuivie. Il faut toutefois nuancer : la Convention prend aussi des mesures sociales, comme l'abolition de l'esclavage dans les colonies le 4 février 1794. La nation est ainsi à la fois défendue et déchirée.\n\nB. Le Directoire, une République fragile\n\nAprès l'exécution de Robespierre, le 28 juillet 1794, les républicains modérés veulent éviter le retour de la Terreur. La Constitution de l'an III crée le Directoire, qui commence le 26 octobre 1795 : le pouvoir exécutif est partagé entre cinq directeurs, et le pouvoir législatif entre le Conseil des Cinq-Cents, qui propose les lois, et le Conseil des Anciens, qui les vote. Cette séparation des pouvoirs empêche un homme ou un comité de tout contrôler, mais elle rend le régime lent à décider.\n\nDe plus, la nation est mal représentée sous le Directoire. Le suffrage censitaire, restreint et indirect, réservé aux contribuables, réduit environ de moitié le nombre d'électeurs. En même temps, la misère sociale revient, et le régime est attaqué à la fois par les royalistes et par les jacobins. Faute d'un large soutien dans la nation, la République reste instable.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie III",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Cette instabilité permet à un général, Napoléon Bonaparte, de prendre le pouvoir en promettant l'ordre : que devient alors la nation ?",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie III",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "III. 1799-1804 : Napoléon encadre la nation par un pouvoir personnel\n\nA. Un pouvoir concentré entre les mains d'un seul homme\n– Bonaparte prend le pouvoir par la force. Le coup d'État du 18 brumaire an VIII (9 novembre 1799), à Saint-Cloud, met fin au Directoire avec l'aide de l'armée, puis la Constitution de l'an VIII donne au Premier consul les pouvoirs exécutif, militaire et diplomatique : la nation ne contrôle plus le pouvoir.\n– Il fonde un régime héréditaire. Le sénatus-consulte du 18 mai 1804 confie le gouvernement de la République à un empereur, et Napoléon est sacré par le pape à Notre-Dame le 2 décembre 1804, avec des symboles impériaux (aigle, couronne de laurier, main de justice) : il se comporte désormais comme un roi.\n\nB. Il consolide pourtant certains acquis de la Révolution\n– Le Code civil, promulgué le 21 mars 1804, unifie le droit pour toute la France et garantit l'égalité devant la loi et la propriété privée (art. 544) : les principes de 1789 sont conservés.\n– Napoléon organise l'État et récompense le mérite : préfets dans chaque département, premiers lycées publics et Légion d'honneur (1802). Mais l'égalité a des limites : les femmes sont juridiquement mineures et l'esclavage est rétabli en 1802.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "III. 1799-1804 : Napoléon encadre la nation par un pouvoir personnel\n\nDe 1799 à 1804, Napoléon Bonaparte place la nation sous son autorité personnelle, tout en conservant une partie des acquis de la Révolution.\n\nA. Un pouvoir concentré entre les mains d'un seul homme\n\nNapoléon Bonaparte prend d'abord le pouvoir par la force, sans passer par le vote de la nation. Le 18 brumaire an VIII (9 novembre 1799), à Saint-Cloud, il s'impose face au Conseil des Cinq-Cents avec l'aide de l'armée : ce coup d'État met fin au Directoire. La Constitution de l'an VIII, en décembre 1799, crée le Consulat et donne au Premier consul, Bonaparte, les pouvoirs exécutif, militaire et diplomatique ainsi que l'initiative des lois ; selon l'article 42, les deux autres consuls n'ont qu'une voix consultative. La nation ne contrôle donc plus le pouvoir : elle est encadrée par un seul homme, nommé consul à vie en 1802.\n\nEnsuite, ce pouvoir personnel devient héréditaire. Le sénatus-consulte du 18 mai 1804 déclare que « le gouvernement de la République est confié à un empereur », et Napoléon est sacré par le pape à Notre-Dame de Paris le 2 décembre 1804. Il s'entoure de symboles impériaux, comme l'aigle et la couronne de laurier, et des regalia des rois, comme la main de justice. Napoléon se comporte donc désormais comme un roi : la nation, devenue souveraine en 1789, ne choisit plus ceux qui la gouvernent.\n\nB. Il consolide pourtant certains acquis de la Révolution\n\nPourtant, Napoléon conserve des principes essentiels de 1789. Le Code civil, promulgué le 21 mars 1804, remplace les coutumes différentes selon les régions par un droit unifié pour toute la France ; il garantit l'égalité devant la loi et protège la propriété privée (article 544). Les Français restent ainsi des citoyens égaux en droits, membres d'une même nation régie par les mêmes lois.\n\nEnfin, Napoléon organise l'État et récompense le mérite plutôt que la naissance : il installe un préfet dans chaque département, crée les premiers lycées publics et fonde la Légion d'honneur en 1802. Toutefois, cette égalité a des limites : dans le Code civil, les femmes sont juridiquement mineures, soumises à leur mari, et l'esclavage est rétabli dans les colonies en 1802. La nation de Napoléon est donc unifiée et ordonnée, mais elle n'est plus libre de choisir ses dirigeants.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Conclusion",
        seulement: "developpe",
        consigne: CONCLUSION_CONSIGNE,
        attendu:
          "Ainsi, entre 1789 et 1804, la Révolution française et Napoléon Bonaparte transforment profondément la France en plaçant la nation au cœur de la vie politique. De 1789 à 1792, la nation devient souveraine et les Français deviennent des citoyens égaux en droits, même si le suffrage censitaire réserve le vote aux plus riches. De 1792 à 1799, la République fait de la nation la seule source du pouvoir, mais celle-ci se divise, de la Terreur à un Directoire instable. Enfin, de 1799 à 1804, Napoléon concentre le pouvoir et fonde un régime héréditaire, tout en conservant, avec le Code civil, l'égalité devant la loi. La nation est donc devenue la référence de tout pouvoir, mais à la fin de la période, elle ne gouverne plus réellement.\n\nCette idée de nation dépasse ensuite les frontières de la France : jusqu'en 1815, les conquêtes de l'Empire diffusent le Code civil et les principes de 1789 dans l'Europe conquise, mais elles éveillent aussi, chez les peuples occupés, un sentiment national tourné contre la France.",
        criteres: CRITERES_CONCLUSION,
        points: 2,
      },
    ],
  },
  {
    id: "hg-qp-1789",
    titre: "Question problématisée : 1789, la naissance d'une nouvelle France",
    duree: "1 h 30 (DST)",
    enonce: "Sujet : En quoi l'année 1789 marque-t-elle la naissance d'une nouvelle France ?",
    question: "Le titre du I de ton cours. Rédige l'introduction et le plan détaillé.",
    etapes: [
      {
        titre: "Analyser le sujet",
        consigne: ANALYSE_CONSIGNE,
        attendu:
          "Mots-clés : « en quoi » (montrer ce qui change, avec des preuves), « nouvelle France » (par rapport à l'Ancien Régime : pouvoir absolu et société d'ordres).\nBornes : l'année 1789, en partant de la crise de 1788 pour expliquer ; la France.\nPlan : thématique, avec un I sur ce qui précède pour mesurer le changement (une partie = un grand thème).",
        criteres: ["« Nouvelle » comparé à l'Ancien Régime", "Bornes : 1789, avec la crise de 1788", "Type de plan justifié"],
        points: 2,
      },
      {
        titre: "Rédiger l'introduction",
        consigne: "Accroche, contexte, définitions et bornes, problématique, annonce du plan.",
        attendu:
          "Le 14 juillet 1789, les Parisiens prennent la Bastille, prison qui symbolise le pouvoir absolu du roi. Au début de l'année, la France est encore sous l'Ancien Régime : un système politique et social fondé sur une monarchie absolue de droit divin et une société divisée en trois ordres, le clergé, la noblesse et le tiers état. Mais la monarchie traverse une grave crise financière, et l'hiver 1788 provoque une disette. En quelques mois, de la réunion des États généraux en mai à la marche des femmes en octobre 1789, le pouvoir et la société sont bouleversés.\n\nEn quoi l'année 1789 marque-t-elle la naissance d'une nouvelle France ?\n\nNous verrons d'abord que la France d'Ancien Régime est en crise à la veille de 1789, puis comment la nation prend le pouvoir au roi, enfin comment naissent une nouvelle société et de nouveaux principes.",
        criteres: CRITERES_INTRO,
        points: 5,
      },
      {
        titre: "Partie I",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "I. Une France d'Ancien Régime en crise à la veille de 1789\n\nA. Une société d'ordres jugée injuste\n– Une petite minorité possède des privilèges. Le clergé (environ 130 000 personnes, 0,5 % de la population) ne paie pas d'impôts et possède 10 % des terres du royaume, et la noblesse (1,5 %) a des privilèges honorifiques et judiciaires, comme le droit de porter l'épée : la naissance décide de la place dans la société.\n– Le tiers état, environ 98 % de la population, très hétérogène (bourgeois, artisans, paysans), paie seul les impôts comme la taille et la gabelle : cette inégalité nourrit la colère.\n\nB. Des crises et des idées nouvelles\n– La monarchie est en crise financière (plus de dépenses que de revenus), et l'hiver très froid de 1788 ruine les récoltes : la disette rend la situation explosive au printemps 1789.\n– Les Lumières remettent en cause la monarchie absolue : Montesquieu, dans De l'esprit des lois (1748), veut séparer les pouvoirs, et la Déclaration d'indépendance des États-Unis (1776) affirme que « tous les hommes sont nés égaux » : un autre modèle politique paraît possible.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "I. Une France d'Ancien Régime en crise à la veille de 1789\n\nPour mesurer ce que l'année 1789 a de nouveau, il faut d'abord voir que la France d'Ancien Régime est en crise à la veille de la Révolution.\n\nA. Une société d'ordres jugée injuste\n\nLa société d'Ancien Régime repose sur la naissance, qui donne des privilèges à une petite minorité. Le clergé, environ 130 000 personnes, soit 0,5 % de la population, ne paie pas d'impôts et possède 10 % des terres du royaume ; la noblesse, environ 1,5 % de la population, dispose de privilèges honorifiques et judiciaires, comme le droit de porter l'épée. La place de chacun dans la société est donc fixée dès la naissance, et non par le mérite.\n\nÀ l'inverse, le tiers état, qui rassemble environ 98 % des Français, porte seul le poids des impôts. Très hétérogène, puisqu'il regroupe aussi bien des bourgeois que des artisans et des paysans, il paie notamment la taille et la gabelle. Cette inégalité devant l'impôt nourrit un fort sentiment d'injustice, qui prépare la contestation de 1789.\n\nB. Des crises et des idées nouvelles\n\nÀ cette injustice s'ajoutent des crises graves. La monarchie dépense plus qu'elle ne gagne et connaît une crise financière ; en même temps, l'hiver très froid de 1788 ruine les récoltes et provoque une disette. Au printemps 1789, la faim et les difficultés du royaume rendent la situation explosive : le roi doit trouver une solution.\n\nEnfin, des idées nouvelles rendent un autre modèle politique pensable. Les philosophes des Lumières remettent en cause la monarchie absolue et la société d'ordres : Montesquieu, dans De l'esprit des lois en 1748, propose de séparer les pouvoirs exécutif, législatif et judiciaire. De plus, la Déclaration d'indépendance des États-Unis, en 1776, affirme que « tous les hommes sont nés égaux » et fonde une république. Les Français disposent donc d'arguments et d'exemples pour imaginer une France nouvelle.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie II",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Pour sortir de la crise, Louis XVI convoque les États généraux : c'est l'occasion pour la nation de s'emparer du pouvoir.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie II",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "II. La nation prend le pouvoir au roi\n\nA. Des États généraux à l'Assemblée nationale\n– Le roi accorde au tiers état autant de députés que les deux autres ordres réunis (27 décembre 1788), et les députés apportent les cahiers de doléances où les Français consignent leurs réclamations : pour la première fois depuis longtemps, la nation est consultée.\n– Mais Louis XVI refuse le vote par tête : les députés du tiers état se proclament Assemblée nationale et, le 20 juin 1789, jurent dans la salle du Jeu de paume de donner une constitution à la France. Ils affirment qu'ils représentent la nation, donc que la souveraineté leur appartient.\n\nB. Le peuple entre en révolution\n– Le 14 juillet 1789, les Parisiens prennent la Bastille, symbole du pouvoir absolu, et pendant l'été la Grande Peur pousse les paysans à piller les châteaux et brûler les titres seigneuriaux : le peuple montre par la violence qu'il refuse l'Ancien Régime.\n– Les 5 et 6 octobre 1789, 7 000 Parisiennes marchent sur Versailles pour réclamer du pain et ramènent la famille royale à Paris : le roi est désormais sous le contrôle du peuple et doit approuver la DDHC.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "II. La nation prend le pouvoir au roi\n\nEn 1789, la première nouveauté est politique : la nation enlève au roi le pouvoir qu'il détenait seul.\n\nA. Des États généraux à l'Assemblée nationale\n\nPour sortir de la crise, Louis XVI convoque les États généraux, qui s'ouvrent à Versailles en mai 1789. Le 27 décembre 1788, il avait accordé au tiers état autant de députés que les deux autres ordres réunis, et les députés arrivent avec les cahiers de doléances, où les Français ont consigné leurs vœux et leurs réclamations. La nation est donc consultée, ce qui ouvre la voie au changement.\n\nCependant, Louis XVI refuse le vote par tête, qui aurait donné la majorité au tiers état. Les députés du tiers état se proclament alors Assemblée nationale et, le 20 juin 1789, dans la salle du Jeu de paume, ils jurent de ne pas se séparer avant d'avoir donné une constitution à la France. En affirmant qu'ils représentent la nation, ils lui donnent la souveraineté : c'est une rupture avec la monarchie absolue de droit divin.\n\nB. Le peuple entre en révolution\n\nLe peuple soutient cette révolution par la force. Le 14 juillet 1789, à Paris, les insurgés, qui ont faim et craignent les soldats massés autour de la ville, prennent la Bastille, prison symbole du pouvoir absolu du roi. Pendant l'été, la Grande Peur gagne les campagnes : les paysans pillent les châteaux et brûlent les titres seigneuriaux où sont notés les privilèges. Le peuple montre ainsi qu'il refuse l'Ancien Régime.\n\nEnfin, le peuple impose sa volonté au roi lui-même. Les 5 et 6 octobre 1789, 7 000 Parisiennes marchent sur Versailles pour réclamer du pain ; le roi approuve la DDHC et la famille royale est ramenée de force à Paris. Désormais, le roi vit sous le contrôle du peuple parisien : le pouvoir a changé de mains.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie III",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Le pouvoir a changé de mains ; reste à construire une société fondée sur d'autres principes que la naissance.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie III",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "III. Une nouvelle société et de nouveaux principes\n\nA. La fin de la société d'ordres\n– Dans la nuit du 4 août 1789, l'Assemblée nationale abolit les privilèges de la noblesse et du clergé, dont les députés n'ont d'autre choix que d'accepter tant la révolte gronde : les trois ordres disparaissent.\n– Les Français deviennent des citoyens égaux, membres d'une même nation : la place de chacun ne dépend plus de sa naissance.\n\nB. Des droits proclamés pour tous\n– La DDHC, adoptée le 26 août 1789, affirme que « les hommes naissent et demeurent libres et égaux en droits » et proclame la liberté religieuse et l'égalité devant la loi : ce sont les principes de la nouvelle France.\n– Elle affirme aussi que « la souveraineté réside essentiellement dans la nation » : c'est la fin de la monarchie absolue de droit divin, et l'Assemblée prépare une constitution qui fera de la France une monarchie constitutionnelle (1791).",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "III. Une nouvelle société et de nouveaux principes\n\nL'année 1789 ne change pas seulement le pouvoir : elle fonde une nouvelle société sur de nouveaux principes.\n\nA. La fin de la société d'ordres\n\nDans la nuit du 4 août 1789, l'Assemblée nationale abolit les privilèges de la noblesse et du clergé. Les députés de ces deux ordres acceptent cette décision, car la révolte gronde dans les campagnes depuis la Grande Peur. Les trois ordres disparaissent donc : la société d'Ancien Régime, fondée sur l'inégalité de naissance, prend fin.\n\nAinsi, les Français ne sont plus répartis en ordres inégaux, mais deviennent des citoyens égaux, membres d'une même nation. Leur place dans la société ne dépend plus de leur naissance : c'est l'une des transformations les plus profondes de l'année 1789.\n\nB. Des droits proclamés pour tous\n\nCes principes nouveaux sont fixés dans la Déclaration des droits de l'homme et du citoyen, adoptée le 26 août 1789. Elle affirme que « les hommes naissent et demeurent libres et égaux en droits », et proclame la liberté religieuse et l'égalité devant la loi. Ces droits deviennent les fondements de la nouvelle France.\n\nSurtout, la DDHC déclare que « la souveraineté réside essentiellement dans la nation ». Le pouvoir ne vient donc plus de Dieu et du roi, mais de la nation : c'est la fin de la monarchie absolue de droit divin. L'Assemblée prépare alors une constitution, adoptée en septembre 1791, qui fera de la France une monarchie constitutionnelle.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Conclusion",
        seulement: "developpe",
        consigne: CONCLUSION_CONSIGNE,
        attendu:
          "Ainsi, l'année 1789 marque bien la naissance d'une nouvelle France. Alors que l'Ancien Régime était fragilisé par une société d'ordres injuste, par la crise financière, par la disette et par les idées des Lumières, la nation prend le pouvoir au roi, des États généraux au serment du Jeu de paume, avec le soutien du peuple, de la prise de la Bastille à la marche des femmes sur Versailles. Enfin, l'abolition des privilèges et la DDHC fondent une société de citoyens égaux en droits, dans laquelle la souveraineté appartient à la nation. En quelques mois, le pouvoir et la société ont changé de fondement.\n\nIl reste pourtant à organiser cette nouvelle France : la Constitution de 1791 crée une monarchie constitutionnelle, mais le compromis avec Louis XVI échoue, et la République est proclamée le 21 septembre 1792.",
        criteres: CRITERES_CONCLUSION,
        points: 2,
      },
    ],
  },
  {
    id: "hg-qp-instabilite",
    titre: "Question problématisée : l'instabilité politique (1791-1799)",
    duree: "1 h 30 (DST)",
    enonce: "Sujet : Pourquoi la Révolution française connaît-elle une forte instabilité politique de 1791 à 1799 ?",
    question: "Le II de ton cours, Terreur comprise. Rédige l'introduction et le plan détaillé.",
    etapes: [
      {
        titre: "Analyser le sujet",
        consigne: ANALYSE_CONSIGNE,
        attendu:
          "Mots-clés : « pourquoi » (des causes, pas un récit), « instabilité politique » (les régimes se succèdent vite : monarchie constitutionnelle, République de la Convention, Directoire).\nBornes : 1791 (Constitution) à 1799 (coup d'État de Bonaparte) ; la France.\nPlan : chronologique, chaque régime ayant ses propres faiblesses ; chaque partie doit expliquer pourquoi le régime tombe.",
        criteres: ["« Pourquoi » = expliquer des causes", "Bornes 1791 et 1799 justifiées", "Plan justifié"],
        points: 2,
      },
      {
        titre: "Rédiger l'introduction",
        consigne: "Accroche, contexte, définitions et bornes, problématique, annonce du plan.",
        attendu:
          "Le 14 juillet 1790, à la fête de la Fédération, le roi jure fidélité à la nation et à la Constitution : la Révolution semble achevée. Pourtant, après la ferveur de 1789, la France connaît une forte instabilité politique : en huit ans, trois régimes se succèdent. De la Constitution de septembre 1791, qui crée une monarchie constitutionnelle, au coup d'État de Napoléon Bonaparte en novembre 1799, aucun régime ne parvient à durer.\n\nPourquoi la Révolution française connaît-elle une forte instabilité politique de 1791 à 1799 ?\n\nNous verrons d'abord l'échec de la monarchie constitutionnelle, puis une République menacée qui choisit la Terreur, enfin un Directoire trop fragile pour durer.",
        criteres: CRITERES_INTRO,
        points: 5,
      },
      {
        titre: "Partie I",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "I. L'échec de la monarchie constitutionnelle (1791-1792)\n\nA. Un compromis fragile entre le roi et la nation\n– La Constitution de septembre 1791 partage le pouvoir : l'assemblée législative, indissoluble, vote les lois et l'impôt, et le roi des Français, héréditaire et inviolable, nomme les ministres et peut bloquer une loi par un veto suspensif. Ce partage suppose que le roi accepte la Révolution.\n– Or Louis XVI y est réticent : il traîne des pieds pour approuver la DDHC et ne s'y résout qu'après la marche des femmes d'octobre 1789. La confiance entre le roi et la nation est fragile.\n\nB. Une nation mal représentée\n– Le suffrage est censitaire : seuls les citoyens riches d'au moins 25 ans votent. Les plus pauvres, qui ont fait la Révolution, sont exclus.\n– Le compromis s'effondre : la Convention proclame la République le 21 septembre 1792 et Louis XVI est exécuté le 21 janvier 1793. La France change de régime pour la deuxième fois en trois ans.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "I. L'échec de la monarchie constitutionnelle (1791-1792)\n\nLe premier régime organisé par la Révolution, la monarchie constitutionnelle, ne dure qu'un an, car il repose sur un compromis fragile.\n\nA. Un compromis fragile entre le roi et la nation\n\nLa Constitution de septembre 1791 partage le pouvoir entre la nation et le roi. L'assemblée législative, indissoluble, vote les lois et l'impôt et ratifie les déclarations de guerre et les traités de paix ; le roi des Français, héréditaire et inviolable, nomme les ministres, fait exécuter les lois et peut bloquer une loi par un veto suspensif. Ce partage ne peut fonctionner que si le roi accepte sincèrement la Révolution.\n\nOr Louis XVI se montre réticent dès le début. En 1789, il tarde à approuver la DDHC et ne s'y résout qu'après la marche des femmes sur Versailles, les 5 et 6 octobre. La fête de la Fédération, le 14 juillet 1790, met bien en scène sa réconciliation avec la nation, mais en juin 1791, il tente de s'enfuir de Paris avec sa famille et il est arrêté à Varennes. La confiance est rompue : un régime qui repose sur un roi hostile à ses principes ne peut pas être stable.\n\nB. Une nation mal représentée\n\nDe plus, la monarchie constitutionnelle ne représente qu'une partie de la nation. Le suffrage est censitaire : seuls les citoyens qui paient un impôt, âgés d'au moins 25 ans, peuvent voter. Les plus pauvres, qui ont pourtant pris la Bastille ou marché sur Versailles, sont exclus de la vie politique, ce qui prive le régime d'une partie de ses soutiens.\n\nLe compromis finit par s'effondrer. La Convention, élue en septembre 1792, proclame la République le 21 septembre 1792, puis Louis XVI est exécuté à Paris le 21 janvier 1793. En trois ans, la France change de régime pour la deuxième fois : l'échec de la monarchie constitutionnelle ouvre une période plus instable encore.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie II",
        consigne: "Bilan, puis annonce.",
        attendu:
          "La République remplace la monarchie, mais elle naît dans la guerre et la division, ce qui la pousse vers des mesures d'exception.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie II",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "II. Une République menacée qui choisit la Terreur (1793-1794)\n\nA. Une République attaquée de toutes parts\n– À l'extérieur, la France est en guerre contre les États coalisés (Anglais, Autrichiens, Prussiens, Espagnols), et à l'intérieur, la Vendée se soulève en mars 1793 contre la levée de 300 000 hommes : la République doit se défendre partout.\n– Les révolutionnaires se divisent : le 2 juin 1793, les chefs girondins sont arrêtés et les Montagnards prennent le contrôle de la Convention.\n\nB. La Terreur, un régime d'exception qui s'épuise\n– Le Comité de salut public reçoit les pleins pouvoirs et la loi des suspects du 17 septembre 1793 permet d'arrêter tous les ennemis supposés de la Révolution : les libertés de 1789 sont suspendues et la Constitution de 1793 n'est jamais appliquée.\n– La Terreur se retourne contre ses propres chefs : Danton est exécuté en avril 1794, puis Robespierre le 28 juillet 1794 (10 thermidor an II). Le régime tombe à son tour.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "II. Une République menacée qui choisit la Terreur (1793-1794)\n\nLa République remplace la monarchie, mais la guerre et les divisions la poussent vers un régime d'exception qui ne peut pas durer.\n\nA. Une République attaquée de toutes parts\n\nLa jeune République doit d'abord se défendre contre des ennemis extérieurs et intérieurs. À l'extérieur, elle est en guerre contre les États coalisés, notamment les Anglais, les Autrichiens, les Prussiens et les Espagnols. À l'intérieur, l'Ouest se soulève en mars 1793 contre la levée de 300 000 hommes : la guerre de Vendée oppose les « bleus » républicains aux « blancs » royalistes, tandis que des villes comme Lyon ou Marseille se révoltent contre la Convention. Menacée partout, la République ne peut pas gouverner normalement.\n\nEn outre, les révolutionnaires eux-mêmes se divisent. À la Convention s'opposent les Girondins, modérés, et les Montagnards, plus radicaux et proches du peuple. Le 2 juin 1793, la Garde nationale et les sans-culottes entourent la Convention et les chefs girondins sont arrêtés : les Montagnards prennent le contrôle de l'Assemblée. Les luttes entre révolutionnaires aggravent donc l'instabilité.\n\nB. La Terreur, un régime d'exception qui s'épuise\n\nPour sauver la République, la Convention met en place un gouvernement révolutionnaire qui suspend les libertés. Le Comité de salut public reçoit les pleins pouvoirs, et la loi des suspects du 17 septembre 1793 permet d'arrêter tous les ennemis de la Révolution, avoués ou supposés. La Constitution de l'an I, adoptée le 24 juin 1793, n'est jamais appliquée. Le pouvoir repose donc sur des mesures d'exception et non sur des institutions durables.\n\nFinalement, la Terreur se retourne contre ses propres chefs. Danton, chef des Indulgents, est exécuté le 5 avril 1794, puis Robespierre est arrêté et exécuté le 28 juillet 1794 (10 thermidor an II). Un régime fondé sur la peur et sur l'élimination des opposants ne peut pas durer : sa chute entraîne un nouveau changement de régime.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie III",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Après la Terreur, les républicains modérés veulent empêcher tout retour des excès : ils créent le Directoire, mais ce régime est fragile dès sa naissance.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie III",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "III. Le Directoire, une République trop fragile (1795-1799)\n\nA. Un régime conçu pour éviter les excès\n– La Constitution de l'an III crée le Directoire (26 octobre 1795) : le pouvoir est divisé entre cinq directeurs, le Conseil des Cinq-Cents qui propose les lois et le Conseil des Anciens (250 membres de plus de 40 ans) qui les vote. Personne ne peut concentrer le pouvoir, mais le régime est lent à décider.\n– Le suffrage censitaire, restreint et indirect, réservé aux contribuables, réduit environ de moitié le nombre d'électeurs : le régime s'appuie sur une minorité de notables.\n\nB. Un régime menacé qui finit par un coup d'État\n– Les années du Directoire sont marquées par un regain de la misère sociale, et le régime est attaqué à la fois par les royalistes et par les jacobins : il n'a pas de soutien solide.\n– Le 18 brumaire an VIII (9 novembre 1799), Napoléon Bonaparte prend le pouvoir à Saint-Cloud avec l'aide de l'armée : ce coup d'État met fin au Directoire et à la décennie révolutionnaire.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "III. Le Directoire, une République trop fragile (1795-1799)\n\nEnfin, le Directoire, conçu pour empêcher le retour de la Terreur, est trop faible pour stabiliser la République.\n\nA. Un régime conçu pour éviter les excès\n\nLes républicains modérés qui ont renversé Robespierre veulent rendre impossibles les excès révolutionnaires. La Constitution de l'an III crée le Directoire, qui commence le 26 octobre 1795 (4 brumaire an IV) : cinq directeurs se partagent le pouvoir exécutif, le Conseil des Cinq-Cents propose les lois et le Conseil des Anciens, 250 membres de plus de 40 ans, les vote. Personne ne peut plus concentrer le pouvoir, mais cette division rend le régime lent à décider face aux crises.\n\nPar ailleurs, ce régime ne s'appuie que sur une minorité. Le suffrage censitaire, restreint et indirect, est réservé aux contribuables et réduit environ de moitié le nombre d'électeurs. Le Directoire est donc une République de notables, coupée d'une grande partie de la nation.\n\nB. Un régime menacé qui finit par un coup d'État\n\nDans ces conditions, le Directoire ne trouve pas de soutien solide. Ses années sont marquées par un regain de la misère sociale, et il est attaqué à la fois par les royalistes, qui veulent le retour du roi, et par les jacobins, qui veulent une République plus radicale. Menacé des deux côtés, le régime vit dans une instabilité permanente.\n\nC'est cette faiblesse qui permet à un général de s'imposer. Le 18 brumaire an VIII (9 novembre 1799), à Saint-Cloud, Napoléon Bonaparte prend le pouvoir face au Conseil des Cinq-Cents avec l'aide de l'armée. Ce coup d'État met fin au Directoire et à la décennie révolutionnaire : l'instabilité des régimes républicains a ouvert la voie à un pouvoir militaire.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Conclusion",
        seulement: "developpe",
        consigne: CONCLUSION_CONSIGNE,
        attendu:
          "Ainsi, de 1791 à 1799, la Révolution française connaît une forte instabilité politique, car aucun régime ne parvient à trouver un équilibre durable. La monarchie constitutionnelle échoue, faute d'un roi qui accepte la Révolution et d'une nation largement représentée. La République, menacée par la guerre étrangère et la guerre civile, choisit la Terreur, un régime d'exception qui finit par éliminer ses propres chefs. Enfin, le Directoire, conçu pour éviter les excès, est trop faible et trop peu soutenu pour résister aux crises. Ces causes politiques, militaires et sociales se combinent et expliquent la succession rapide des régimes.\n\nCette instabilité profite à Napoléon Bonaparte : avec le Consulat, il promet de rétablir l'ordre, mais au prix d'un pouvoir personnel qui conduit à l'Empire en 1804.",
        criteres: CRITERES_CONCLUSION,
        points: 2,
      },
    ],
  },
  {
    id: "hg-qp-napoleon",
    titre: "Question problématisée : Napoléon installe un nouveau régime",
    duree: "1 h 30 (DST)",
    enonce: "Sujet : Comment Napoléon Bonaparte installe-t-il un nouveau régime entre 1799 et 1804 ?",
    question: "Le III de ton cours, sans les conquêtes (pas au DST). Rédige l'introduction et le plan détaillé.",
    etapes: [
      {
        titre: "Analyser le sujet",
        consigne: ANALYSE_CONSIGNE,
        attendu:
          "Mots-clés : « comment » (les moyens : la force, les institutions, la propagande, les lois), « nouveau régime » (Consulat puis Empire, qui rompent avec la République du Directoire).\nBornes : 1799 (coup d'État du 18 brumaire) à 1804 (Code civil, Empire et sacre) ; la France.\nPlan : thématique ou chronologique ; ici, trois moyens : la prise du pouvoir, la marche vers l'Empire, l'organisation de la société.",
        criteres: ["« Comment » = les moyens", "Bornes 1799 et 1804 justifiées", "Plan justifié"],
        points: 2,
      },
      {
        titre: "Rédiger l'introduction",
        consigne: "Accroche, contexte, définitions et bornes, problématique, annonce du plan.",
        attendu:
          "Le 2 décembre 1804, à Notre-Dame de Paris, Napoléon est sacré empereur des Français par le pape. Cinq ans plus tôt, la France était encore une République, le Directoire, affaibli par la misère et menacé par les royalistes et les jacobins. Par le coup d'État du 18 brumaire an VIII (9 novembre 1799), c'est-à-dire une prise du pouvoir par la force avec l'aide de l'armée, le général Bonaparte met fin à la décennie révolutionnaire. Entre 1799 et 1804, il fonde le Consulat, puis l'Empire.\n\nComment Napoléon Bonaparte installe-t-il un nouveau régime entre 1799 et 1804 ?\n\nNous verrons d'abord qu'il prend et concentre le pouvoir, puis qu'il transforme la République en Empire, enfin qu'il organise la société en conservant certains acquis de la Révolution.",
        criteres: CRITERES_INTRO,
        points: 5,
      },
      {
        titre: "Partie I",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "I. Une prise du pouvoir par la force, puis un pouvoir concentré\n\nA. Le coup d'État du 18 brumaire\n– Bonaparte profite de la faiblesse du Directoire : le 18 brumaire an VIII (9 novembre 1799), à Saint-Cloud, il s'impose avec l'armée face au Conseil des Cinq-Cents. Le pouvoir ne vient plus des élections mais de la force.\n– Le tableau du coup d'État étudié en classe le montre au centre, entouré des députés en toge rouge et de soldats : la peinture présente déjà l'armée comme garante de l'ordre.\n\nB. Le Consulat, un régime autoritaire\n– La Constitution de l'an VIII (1799) confie le pouvoir à trois consuls, mais le Premier consul, Bonaparte, dispose seul des pouvoirs exécutif, militaire et diplomatique et propose les lois. L'article 42 le dit : les deux autres consuls n'ont qu'une voix consultative, « la décision du Premier consul suffit ».\n– En 1802, Bonaparte est nommé consul à vie : le pouvoir personnel s'installe dans la durée.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "I. Une prise du pouvoir par la force, puis un pouvoir concentré\n\nNapoléon Bonaparte installe d'abord un nouveau régime en s'emparant du pouvoir par la force, puis en le concentrant entre ses mains.\n\nA. Le coup d'État du 18 brumaire\n\nBonaparte profite de la faiblesse du Directoire, affaibli par la misère et menacé par les royalistes et les jacobins. Le 18 brumaire an VIII (9 novembre 1799), à Saint-Cloud, il s'impose face au Conseil des Cinq-Cents avec l'aide de l'armée. Le pouvoir ne vient donc plus des élections, mais de la force : c'est la définition même d'un coup d'État.\n\nLes images servent déjà à justifier cette prise du pouvoir. Le tableau du coup d'État étudié en classe montre Bonaparte au centre, entouré de soldats et des membres du Conseil des Cinq-Cents en toge rouge. En le plaçant au cœur de la scène, la peinture présente l'armée et son chef comme les garants de l'ordre face à un régime affaibli.\n\nB. Le Consulat, un régime autoritaire\n\nUne fois au pouvoir, Bonaparte fait adopter une nouvelle constitution qui lui donne l'essentiel des pouvoirs. La Constitution de l'an VIII, en décembre 1799, crée le Consulat, dirigé par trois consuls ; mais le Premier consul, Bonaparte, a seul l'autorité exécutive, militaire et diplomatique, et il propose les lois. L'article 42 le précise : les deux autres consuls n'ont qu'une voix consultative, « après quoi, la décision du Premier consul suffit ». Derrière l'apparence d'un pouvoir partagé, le Consulat est donc un régime autoritaire.\n\nEnsuite, ce pouvoir personnel s'installe dans la durée. En 1802, Bonaparte est nommé consul à vie : il n'a plus à craindre la fin de son mandat. Le nouveau régime repose ainsi sur un seul homme, ce qui prépare le passage à l'Empire.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie II",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Maître du pouvoir, Bonaparte veut le rendre héréditaire et le légitimer : il passe du Consulat à l'Empire.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie II",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "II. De la République à l'Empire\n\nA. Napoléon devient empereur\n– Conforté par ses victoires, la paix avec les puissances étrangères et le retour de la paix religieuse, le régime adopte le sénatus-consulte du 28 floréal an XII (18 mai 1804) : « le gouvernement de la République est confié à un empereur », et Napoléon est « empereur des Français ». Le pouvoir devient héréditaire.\n– Le 2 décembre 1804, Napoléon est sacré par le pape à Notre-Dame : il lie le pouvoir politique et religieux et se comporte désormais comme un roi.\n\nB. Une propagande pour légitimer le pouvoir\n– La peinture sert la propagande : elle rend le sacre sacré et glorifie l'empereur.\n– Napoléon reprend les symboles de l'Empire romain (aigle, couronne de laurier, toge pourpre), les regalia des rois (sceptre, main de justice) les abeilles (symbole mérovingien) et des symboles carolingiens : il se présente comme l'héritier de Rome et de Charlemagne.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "II. De la République à l'Empire\n\nPour rendre son pouvoir héréditaire et le légitimer, Napoléon transforme ensuite la République en Empire.\n\nA. Napoléon devient empereur\n\nEn 1804, Napoléon franchit une nouvelle étape. Conforté par ses victoires, par la paix avec les puissances étrangères et par le rétablissement de la paix religieuse, le régime adopte le sénatus-consulte du 28 floréal an XII (18 mai 1804) : « le gouvernement de la République est confié à un empereur », et « Napoléon est empereur des Français ». Le pouvoir devient ainsi héréditaire, comme sous la monarchie.\n\nPuis Napoléon donne à ce pouvoir une dimension religieuse. Le 2 décembre 1804, à Notre-Dame de Paris, il est sacré par le pape. En liant le pouvoir politique et le pouvoir religieux, il se comporte désormais comme un roi : le nouveau régime rompt avec la République proclamée en 1792.\n\nB. Une propagande pour légitimer le pouvoir\n\nPour faire accepter ce nouveau régime, Napoléon utilise la propagande, en particulier la peinture. Les tableaux du sacre glorifient l'empereur et donnent à la cérémonie un caractère sacré : ils doivent convaincre que son pouvoir est légitime.\n\nDe plus, Napoléon choisit des symboles qui le rattachent aux grands pouvoirs du passé. Il reprend ceux de l'Empire romain, comme l'aigle, la couronne de laurier et la toge pourpre, les regalia des rois, comme le sceptre et la main de justice, ainsi que les abeilles et des symboles carolingiens. Il se présente ainsi comme l'héritier de Rome et de Charlemagne, ce qui donne au nouveau régime une légitimité que l'élection ne lui donne pas.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie III",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Ce pouvoir personnel ne fait pourtant pas disparaître toute l'œuvre de la Révolution : Napoléon organise la société en en conservant une partie.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie III",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "III. Un régime qui organise la société et conserve certains acquis\n\nA. Le Code civil, un droit unifié\n– Avant la Révolution, les lois changeaient selon les régions (droit coutumier). Le 21 mars 1804, Napoléon promulgue le Code civil, un ensemble de lois écrites et organisées pour toute la France.\n– Le Code affirme l'égalité devant la loi et protège la propriété privée (art. 544) : il conserve les principes de 1789, même si les femmes y restent mineures, soumises à leur mari.\n\nB. Un État centralisé qui récompense le mérite\n– Napoléon installe un préfet dans chaque département et crée les premiers lycées publics : l'État encadre le territoire et forme les futurs cadres.\n– La Légion d'honneur (1802) récompense le mérite et non la naissance, mais elle crée une nouvelle élite fidèle au régime.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "III. Un régime qui organise la société et conserve certains acquis\n\nLe nouveau régime n'est pas seulement un pouvoir personnel : Napoléon organise aussi la société, en conservant une partie de l'œuvre de la Révolution.\n\nA. Le Code civil, un droit unifié\n\nAvant la Révolution, les lois changeaient selon les régions : c'était le droit coutumier. Les révolutionnaires voulaient un code unifié, mais la codification a été lente ; le 21 mars 1804, une fois la situation intérieure stabilisée, Napoléon promulgue le Code civil, un ensemble de lois écrites et organisées pour toute la France. Le même droit s'applique désormais à tous les Français, ce qui renforce l'unité du pays et l'autorité de l'État.\n\nCe Code conserve les principes de 1789. Il affirme l'égalité devant la loi et protège la propriété privée : selon l'article 544, la propriété est « le droit de jouir et disposer des choses de la manière la plus absolue ». Cependant, il maintient des inégalités, puisque les femmes y restent juridiquement mineures, soumises à leur mari. Le nouveau régime garde donc les acquis de la Révolution, mais dans un cadre d'ordre et de hiérarchie.\n\nB. Un État centralisé qui récompense le mérite\n\nNapoléon renforce aussi l'encadrement du territoire. Il installe un préfet dans chaque département pour représenter l'État, et crée les premiers lycées publics pour former les futurs cadres. L'État est ainsi plus centralisé et mieux contrôlé depuis Paris.\n\nEnfin, Napoléon crée en 1802 la Légion d'honneur, qui récompense le mérite et non la naissance, conformément à l'esprit de 1789. Mais cette distinction crée aussi une nouvelle élite, fidèle au régime : elle sert à attacher les notables au pouvoir de Napoléon.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Conclusion",
        seulement: "developpe",
        consigne: CONCLUSION_CONSIGNE,
        attendu:
          "Ainsi, entre 1799 et 1804, Napoléon Bonaparte installe un nouveau régime par étapes. Il prend d'abord le pouvoir par la force lors du coup d'État du 18 brumaire, puis le concentre avec la Constitution de l'an VIII et le consulat à vie. Il transforme ensuite la République en Empire héréditaire, légitimé par le sacre et par la propagande. Enfin, il organise la société avec le Code civil, les préfets, les lycées et la Légion d'honneur, en conservant certains acquis de la Révolution, comme l'égalité devant la loi. Le nouveau régime associe donc un pouvoir personnel, proche de celui d'un roi, et une partie de l'héritage de 1789.\n\nL'Empire dure jusqu'en 1815 : par ses conquêtes, Napoléon diffuse le Code civil dans une partie de l'Europe, et ce texte, plusieurs fois modifié, reste aujourd'hui la base du droit civil français.",
        criteres: CRITERES_CONCLUSION,
        points: 2,
      },
    ],
  },
  {
    id: "hg-qp-code-civil",
    titre: "Question problématisée : le Code civil de 1804",
    duree: "1 h 30 (DST)",
    enonce:
      "Sujet : En quoi le Code civil de 1804 reflète-t-il les tensions entre un ordre social novateur et un ordre social conservateur en France ?",
    question:
      "Le sujet de la carte mentale de ta prof, sans la partie III sur l'Europe (« pas au DST »). Plan en deux parties, chacune avec trois sous-parties comme sur sa carte.",
    etapes: [
      {
        titre: "Analyser le sujet",
        consigne: ANALYSE_CONSIGNE,
        attendu:
          "Mots-clés : « Code civil » (ensemble de lois écrites et unifiées sur la vie des personnes, la famille et la propriété, promulgué le 21 mars 1804), « novateur » (qui reprend les principes de 1789 : égalité, liberté), « conservateur » (qui maintient des hiérarchies), « tensions » (montrer les deux faces).\nBornes : 1804, avec ses origines (le droit coutumier d'Ancien Régime, la codification voulue depuis la Révolution) ; la France.\nPlan : thématique en deux parties : I. ce qui est novateur, II. ce qui est conservateur.",
        criteres: ["Code civil défini et daté", "« Novateur » et « conservateur » expliqués", "Plan en deux parties justifié"],
        points: 2,
      },
      {
        titre: "Rédiger l'introduction",
        consigne: "Accroche, contexte, définitions et bornes, problématique, annonce du plan.",
        attendu:
          "« Le Code civil est lu aux futurs époux lors de leur mariage » : aujourd'hui encore, des articles écrits en 1804 sont lus dans les mairies. Quand la Révolution éclate, la France est régie par des lois différentes selon les régions, le droit coutumier. Les révolutionnaires veulent un code unifié, c'est-à-dire un ensemble de lois écrites et organisées, mais ce travail lent et difficile n'est achevé que sous Napoléon, une fois la situation intérieure stabilisée : le 21 mars 1804, il promulgue le Code civil. Ce texte hérite des principes de 1789 tout en rétablissant de l'ordre dans la société.\n\nEn quoi le Code civil de 1804 reflète-t-il les tensions entre un ordre social novateur et un ordre social conservateur ?\n\nNous verrons d'abord qu'il consacre le principe de l'égalité juridique, puis qu'il reste un texte conservateur qui limite cette égalité.",
        criteres: CRITERES_INTRO,
        points: 5,
      },
      {
        titre: "Partie I",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "I. La consécration du principe de l'égalité juridique dans le Code civil de 1804\n\nA. Le principe fondamental de l'égalité devant la loi\n– Le Code civil affirme une justice sociale qui fixe des droits et des devoirs identiques pour tous les individus : les privilèges de naissance abolis le 4 août 1789 ne reviennent pas.\n\nB. La liberté contractuelle\n– Chaque citoyen peut, indépendamment de sa naissance ou de son rang, passer des contrats. L'article 1101 le définit : « Le contrat est une convention par laquelle une ou plusieurs personnes s'obligent, envers une ou plusieurs autres, à donner, à faire ou à ne pas faire quelque chose. » Les individus sont libres et égaux face au droit.\n\nC. La protection du droit de propriété privée\n– La propriété individuelle devient le pilier de la stabilité sociale et de la liberté économique. L'article 544 : « La propriété est le droit de jouir et disposer des choses de la manière la plus absolue, pourvu qu'on n'en fasse pas un usage prohibé par les lois ou par les règlements. » Les acquis de la Révolution, comme les biens achetés pendant la décennie, sont garantis.",
        criteres: [
          "Titre qui reprend les mots du sujet",
          "Trois sous-parties (égalité, contrat, propriété)",
          "Les articles 1101 et 544 cités",
          "Chaque exemple relié à l'idée de nouveauté",
          "Phrases rédigées",
        ],
        points: 6,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "I. La consécration du principe de l'égalité juridique dans le Code civil de 1804\n\nD'un côté, le Code civil de 1804 porte un ordre social novateur, car il inscrit dans la loi l'égalité juridique proclamée en 1789.\n\nA. Le principe fondamental de l'égalité devant la loi\n\nLe Code civil fixe des droits et des devoirs identiques pour tous les individus. Sous l'Ancien Régime, la place de chacun dépendait de sa naissance, et les lois changeaient d'une région à l'autre. Or le Code, promulgué le 21 mars 1804, s'applique à toute la France et ne reconnaît plus d'ordres : les privilèges abolis dans la nuit du 4 août 1789 ne reviennent pas. Il prolonge ainsi la DDHC de 1789, selon laquelle « les hommes naissent et demeurent libres et égaux en droits ». L'égalité devant la loi devient donc la base d'un ordre social nouveau.\n\nB. La liberté contractuelle\n\nLe Code civil donne aussi à chaque citoyen la liberté de passer des contrats, indépendamment de sa naissance ou de son rang. L'article 1101 le définit : « Le contrat est une convention par laquelle une ou plusieurs personnes s'obligent, envers une ou plusieurs autres, à donner, à faire ou à ne pas faire quelque chose. » Dans cette définition, il n'est plus question de nobles ou de roturiers, mais seulement de « personnes » : les individus sont libres et égaux face au droit, ce qui est une nouveauté par rapport à la société d'ordres.\n\nC. La protection du droit de propriété privée\n\nEnfin, le Code fait de la propriété individuelle le pilier de la stabilité sociale et de la liberté économique. L'article 544 affirme : « La propriété est le droit de jouir et disposer des choses de la manière la plus absolue, pourvu qu'on n'en fasse pas un usage prohibé par les lois ou par les règlements. » En garantissant la propriété, le Code protège notamment ceux qui ont acheté des biens pendant la Révolution : il consolide ainsi les acquis de la décennie révolutionnaire et rassure les propriétaires.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie II",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Le Code civil grave donc dans la loi l'égalité de 1789 ; pourtant, cette égalité s'arrête à la porte de la famille et de l'atelier.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie II",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "II. Un texte conservateur : les limites de l'égalité\n\nA. La dépendance juridique des femmes vis-à-vis de leur mari\n– Dans le Code civil, les femmes sont juridiquement mineures : elles dépendent de leur mari. L'égalité proclamée ne vaut que pour les hommes.\n\nB. Le maintien des inégalités\n– L'encadrement du droit d'héritage favorise la transmission dans les familles aisées. L'article 711 : « La propriété (…) se transmet par succession, par donation entre vifs ou testamentaire, et par l'effet des obligations. » Les fortunes se reproduisent d'une génération à l'autre.\n\nC. Le contrôle social de la main-d'œuvre et de la famille\n– La prééminence accordée au chef de famille et à l'employeur instaure une hiérarchie sociale : l'ordre, plus que l'égalité, guide le Code. On peut ajouter qu'en 1802 Bonaparte rétablit l'esclavage dans les colonies.",
        criteres: [
          "Titre qui reprend les mots du sujet",
          "Trois sous-parties (femmes, héritage, chef de famille et employeur)",
          "L'article 711 cité",
          "Chaque exemple relié à l'idée de conservatisme",
          "Phrases rédigées",
        ],
        points: 6,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "II. Un texte conservateur : les limites de l'égalité\n\nD'un autre côté, le Code civil reste un texte conservateur, qui maintient des hiérarchies et limite l'égalité qu'il proclame.\n\nA. La dépendance juridique des femmes vis-à-vis de leur mari\n\nL'égalité du Code civil ne vaut pas pour les femmes comme pour les hommes. Dans le Code, les femmes sont juridiquement mineures : mariées, elles dépendent de leur mari et lui doivent obéissance. L'égalité proclamée en 1789 s'arrête donc à la porte du foyer, où le Code installe une hiérarchie entre les époux.\n\nB. Le maintien des inégalités\n\nLe Code encadre aussi la transmission des biens, ce qui favorise les familles déjà aisées. L'article 711 prévoit que « la propriété (…) se transmet par succession, par donation entre vifs ou testamentaire, et par l'effet des obligations ». Par l'héritage, les fortunes se reproduisent d'une génération à l'autre : la naissance ne donne plus de privilèges juridiques, mais elle continue de décider de la richesse, donc de la place dans la société.\n\nC. Le contrôle social de la main-d'œuvre et de la famille\n\nEnfin, le Code accorde la prééminence au chef de famille et à l'employeur. Le mari et père dirige la famille, tandis que l'employeur domine l'ouvrier : une hiérarchie sociale est ainsi instaurée, et l'ordre, plus que l'égalité, guide le Code. Ce souci de l'ordre se retrouve dans la politique de Bonaparte, qui rétablit l'esclavage dans les colonies en 1802 : la liberté et l'égalité de 1789 ne valent donc pas pour tous.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Conclusion",
        seulement: "developpe",
        consigne: CONCLUSION_CONSIGNE,
        attendu:
          "Ainsi, le Code civil de 1804 reflète bien les tensions entre un ordre social novateur et un ordre social conservateur. Il est novateur, car il consacre l'égalité juridique héritée de 1789 : égalité devant la loi, liberté contractuelle et protection de la propriété privée. Mais il est aussi conservateur, car il maintient la dépendance des femmes, favorise la transmission des fortunes par l'héritage et place le chef de famille et l'employeur au sommet d'une hiérarchie sociale. Le Code civil conserve donc les principes de la Révolution tout en rétablissant l'ordre dans la société, à l'image du régime de Napoléon.\n\nCe texte dépasse d'ailleurs les frontières de la France : Napoléon l'impose dans l'Europe conquise entre 1806 et 1814, et le Code civil, plusieurs fois modifié, reste aujourd'hui la base du droit civil français.",
        criteres: CRITERES_CONCLUSION,
        points: 2,
      },
    ],
  },
];

// ———————————————————— Le chapitre ————————————————————

/** Dates de la Terreur absentes de la frise du H1 (sans doublon). */
const DATES_TERREUR = (T.dates ?? []).filter((t) => !["1792-09-21", "1793-01-21"].includes(t.tri));

export const HISTOIRE_REVOLUTION_EMPIRE: ChapitrePublie = {
  id: "hg-1re-revolution-empire",
  version: 3,
  matiere,
  titre: "H1 · La Révolution française et l'Empire",
  documents: [
    {
      titre: "Fiche méthode · La question problématisée",
      fichier: `${dossier}/methode-question-problematisee.pdf`,
      detail: "Fiche de ta prof · 2 pages (photos)",
    },
  ],
  definitions: DEFINITIONS,
  dates: [...DATES, ...DATES_TERREUR].sort((a, b) => a.tri.localeCompare(b.tri)),
  problemes: PROBLEMES_REVOLUTION,
  flashcards: [
    { recto: "Nation", verso: "Ensemble des êtres humains vivant sur un même territoire, ayant une communauté d'origine, d'histoire, de culture, de traditions, parfois de langue, et constituant une communauté politique." },
    { recto: "Absolutisme", verso: "Régime monarchique où le roi prétend gouverner sans limites et avoir tous les droits sur ses sujets ; il concentre le pouvoir politique." },
    { recto: "Ancien Régime", verso: "Système politique et social de la France avant 1789 : monarchie absolue de droit divin et société divisée en trois ordres (clergé, noblesse, tiers état)." },
    { recto: "Disette", verso: "Manque de ce qui est nécessaire à la vie, en particulier manque de vivres." },
    { recto: "Cahier de doléances", verso: "Document où les représentants élus aux États généraux consignent les vœux et les réclamations des Français." },
    { recto: "Club (pendant la Révolution)", verso: "Association dont les membres se réunissent régulièrement pour débattre de sujets politiques." },
    { recto: "Monarchie constitutionnelle", verso: "Régime où un monarque héréditaire est chef de l'État et de l'exécutif, mais où ses pouvoirs sont limités : une assemblée élue (au suffrage censitaire) propose et vote les lois avec le roi." },
    { recto: "Constitution", verso: "Texte qui définit et organise les pouvoirs au sein d'un régime politique." },
    { recto: "Suffrage censitaire", verso: "Seuls les citoyens qui paient un impôt (le cens), donc les plus riches, peuvent voter. En 1791 : hommes d'au moins 25 ans." },
    { recto: "Coup d'État", verso: "Prise du pouvoir par la force avec l'aide de l'armée." },
    { recto: "Qu'appelle-t-on les Lumières ?", verso: "Mouvement philosophique, littéraire, politique et scientifique du XVIIIe siècle qui remet en cause la société d'ordres et la monarchie absolue, veut séparer les pouvoirs et défend la souveraineté du peuple." },
    { recto: "Qui théorise la séparation des pouvoirs, et dans quel ouvrage ?", verso: "Montesquieu, De l'esprit des lois (1748) : pouvoirs exécutif, législatif et judiciaire séparés." },
    { recto: "Comment est organisée la société d'ordres avant 1789 ?", verso: "Clergé (0,5 %, pas d'impôts, 10 % des terres) et noblesse (1,5 %, privilèges honorifiques et judiciaires) sont privilégiés ; le tiers état (environ 98 %, très hétérogène) paie les impôts (taille, gabelle)." },
    { recto: "Pourquoi une Révolution éclate-t-elle au printemps 1789 ?", verso: "Société d'ordres injuste, crise financière de la monarchie (plus de dépenses que de revenus), crise économique et disette après l'hiver 1788, idées des Lumières, exemples des États-Unis et de la monarchie parlementaire anglaise." },
    { recto: "Qu'est-ce que le serment du Jeu de paume ?", verso: "Le 20 juin 1789, les députés du tiers état, proclamés Assemblée nationale, jurent de ne pas se séparer avant d'avoir donné une constitution à la France : ils placent la nation au centre." },
    { recto: "Pourquoi la prise de la Bastille (14 juillet 1789) est-elle un symbole ?", verso: "Le peuple, qui a faim et craint les soldats du roi, attaque une prison, symbole du pouvoir absolu du roi : une insurrection violente et armée." },
    { recto: "Qu'est-ce que la Grande Peur ?", verso: "Pendant l'été 1789, des révoltes dans les campagnes : les paysans pillent les châteaux et brûlent les titres seigneuriaux où sont notés les privilèges." },
    { recto: "Que décide l'Assemblée dans la nuit du 4 août 1789 ?", verso: "L'abolition des privilèges de la noblesse et du clergé : fin de la société d'ordres." },
    { recto: "Que proclame la DDHC du 26 août 1789 ?", verso: "« Les hommes naissent et demeurent libres et égaux en droits » ; « la souveraineté réside essentiellement dans la nation » ; liberté religieuse, égalité devant la loi. Fin de la monarchie absolue." },
    { recto: "Qu'est-ce que la marche des femmes sur Versailles ?", verso: "Les 5 et 6 octobre 1789, 7 000 Parisiennes marchent sur Versailles pour du pain ; le roi approuve la DDHC et la famille royale est ramenée de force à Paris." },
    { recto: "Pourquoi organise-t-on la fête de la Fédération (14 juillet 1790) ?", verso: "Pour créer l'unité nationale et le sentiment de nation, et symboliser la réconciliation du roi avec la nation (serments du roi et de La Fayette à la Constitution)." },
    { recto: "Comment la Constitution de 1791 partage-t-elle les pouvoirs ?", verso: "La nation (citoyens riches de 25 ans et plus) délègue ses pouvoirs à une assemblée législative indissoluble (impôt, lois, ratification des guerres et traités) et à un roi des Français héréditaire et inviolable (ministres, exécution des lois, veto suspensif)." },
    { recto: "Comment le Directoire est-il organisé (1795-1799) ?", verso: "Constitution de l'an III : cinq directeurs pour l'exécutif, deux assemblées, le Conseil des Cinq-Cents qui propose les lois et le Conseil des Anciens (250 membres de plus de 40 ans) qui les vote ; suffrage censitaire restreint et indirect." },
    { recto: "Pourquoi le Directoire est-il un régime fragile ?", verso: "Suffrage très restreint (environ moitié moins d'électeurs), regain de la misère sociale, menaces des royalistes et des jacobins : il finit par le coup d'État de Bonaparte (1799)." },
    { recto: "Qu'est-ce que le coup d'État du 18 brumaire an VIII ?", verso: "Le 9 novembre 1799, à Saint-Cloud, Napoléon Bonaparte prend le pouvoir avec l'aide de l'armée : fin du Directoire, début du Consulat." },
    { recto: "Quels pouvoirs le Premier consul a-t-il dans la Constitution de l'an VIII ?", verso: "Les pouvoirs exécutif, militaire et diplomatique, et il propose les lois ; les deux autres consuls n'ont qu'une voix consultative (art. 42 : « la décision du Premier consul suffit »). Consul à vie en 1802." },
    { recto: "Comment Napoléon devient-il empereur ?", verso: "Par le sénatus-consulte du 28 floréal an XII (18 mai 1804) : « le gouvernement de la République est confié à un empereur » ; il est sacré par le pape à Notre-Dame le 2 décembre 1804." },
    { recto: "Quels symboles Napoléon utilise-t-il pour légitimer son pouvoir ?", verso: "Ceux de l'Empire romain (aigle, couronne de laurier, toge pourpre), les regalia des rois (sceptre, main de justice), les abeilles ; il crée la Légion d'honneur et le Code. La peinture sert sa propagande." },
    { recto: "Qu'est-ce que le Code civil de 1804 ?", verso: "Un ensemble de lois écrites et unifiées pour toute la France (avant : droit coutumier, différent selon les régions), promulgué par Napoléon le 21 mars 1804." },
    { recto: "En quoi le Code civil est-il novateur ?", verso: "Il affirme l'égalité devant la loi, la liberté contractuelle (art. 1101) et la protection de la propriété privée (art. 544)." },
    { recto: "Quelles sont les limites de l'égalité dans le Code civil ?", verso: "Les femmes sont juridiquement mineures, dépendantes de leur mari ; l'héritage favorise les familles aisées (art. 711) ; le chef de famille et l'employeur dominent : une hiérarchie sociale." },
    { recto: "Quelles institutions Napoléon met-il en place en France ?", verso: "Un préfet dans chaque département, les premiers lycées publics, la Légion d'honneur (1802), le Code civil (1804)." },
    ...T.flashcards,
  ],
  fiche: {
    sections: [
      {
        titre: "La frise du chapitre",
        points: [
          { t: "==Cinq périodes à connaître dans l'ordre== : Ancien Régime, monarchie constitutionnelle (1789-1792), Ire République (1792-1799 : la Terreur en 1793-1794, puis le Directoire de 1795 à 1799), Consulat (1799-1804), Empire (1804-1815).", n: 1, schema: FRISE },
          { t: "==1789, l'année qui change tout== : États généraux (mai), serment du Jeu de paume (20 juin), prise de la Bastille (14 juillet), Grande Peur, abolition des privilèges (nuit du 4 août), DDHC (26 août), marche des femmes sur Versailles (5-6 octobre).", n: 1, schema: FRISE_1789 },
        ],
      },
      {
        titre: "Avant 1789 : pourquoi une Révolution ?",
        points: [
          { t: "==Une société d'ordres injuste== : le clergé (environ 130 000 personnes, 0,5 %) ne paie pas d'impôts, possède 10 % des terres et enregistre naissances et décès ; la noblesse (300 000 à 400 000 personnes, 1,5 %) a des privilèges honorifiques et judiciaires (porter l'épée) ; le tiers état (environ 98 %) est très hétérogène et paie les impôts (taille, gabelle).", n: 1, image: PYRAMIDE },
          { t: "Plusieurs noblesses : noblesse d'épée (par les armes, ancienne) et noblesse de robe (par les charges de justice et d'administration). Il existe aussi des privilèges au sein du tiers état.", n: 4 },
          { t: "==Une crise financière== (la monarchie dépense plus qu'elle ne gagne) et une crise économique : l'hiver 1788 est très froid, les récoltes sont maigres, c'est la disette.", n: 1 },
          { t: "Les Lumières remettent en cause la monarchie absolue et la société d'ordres : Montesquieu (De l'esprit des lois, 1748) veut séparer les pouvoirs exécutif, législatif et judiciaire.", n: 2 },
          { t: "Le contexte international : la Déclaration d'indépendance des États-Unis (1776, « tous les hommes sont nés égaux », une république) et la monarchie parlementaire du Royaume-Uni (Chambre des lords, Chambre des communes, suffrage censitaire : homme blanc, riche, d'au moins 21 ans).", n: 3 },
        ],
      },
      {
        titre: "I.A Le bouleversement de l'année 1789",
        points: [
          { t: "Le 27 décembre 1788, Louis XVI accorde au tiers état autant de députés que les deux autres ordres réunis aux États généraux. Les députés apportent les ==cahiers de doléances==.", n: 2 },
          { t: "Louis XVI refuse le vote par tête : les députés du tiers état, qui représentent 97 % de la population, se proclament Assemblée nationale et prêtent le ==serment du Jeu de paume (20 juin 1789)== : donner une constitution à la France. Ils se considèrent comme la nation.", n: 1 },
          { t: "Le 14 juillet 1789, le peuple, qui a faim et craint les soldats massés autour de Paris, prend la Bastille, prison symbole du pouvoir absolu du roi. Puis la Grande Peur gagne les campagnes : les paysans pillent les châteaux et brûlent les titres seigneuriaux.", n: 1 },
          { t: "==Nuit du 4 août 1789 : abolition des privilèges== de la noblesse et du clergé, acceptée par leurs députés tant la révolte gronde. ==26 août : la DDHC== : « Les hommes naissent et demeurent libres et égaux en droits », « la souveraineté réside essentiellement dans la nation », liberté religieuse, égalité devant la loi.", n: 1 },
          { t: "Les 5 et 6 octobre 1789, 7 000 Parisiennes marchent sur Versailles (« À Versailles ! ») : le roi, qui traînait pour approuver la DDHC, l'approuve et promet du pain ; la famille royale est ramenée de force à Paris (« Le boulanger, la boulangère et le petit mitron ! »). Le roi s'installe officiellement à Paris.", n: 2 },
          { t: "Précision : l'Assemblée nationale est proclamée le 17 juin, le serment est prêté le 20 juin 1789.", n: 5 },
        ],
      },
      {
        titre: "I.B La monarchie constitutionnelle (1789-1792)",
        points: [
          { t: "La souveraineté nationale s'exerce par la liberté d'opinion et d'expression : plus besoin d'autorisation royale pour créer un journal (des dizaines de titres dès 1789), et des ==clubs== se forment.", n: 2 },
          { t: "La ==Constitution de septembre 1791== crée une monarchie constitutionnelle. La nation, formée des citoyens riches d'au moins 25 ans (==suffrage censitaire==), est souveraine et délègue ses pouvoirs :", n: 1 },
          { t: "à une assemblée législative indissoluble, qui établit le montant de l'impôt, propose et vote la loi, ratifie les déclarations de guerre et les traités de paix ;", n: 2 },
          { t: "à un roi des Français héréditaire et inviolable, qui nomme et révoque les ministres, fait exécuter la loi (veto suspensif de 4 ans) et propose la guerre et la paix.", n: 2 },
          { t: "La ==fête de la Fédération (14 juillet 1790)== : serment du roi à la Constitution devant les fédérés des 83 nouveaux départements, serment de La Fayette au roi, à la nation et à la Constitution. But : créer l'unité nationale et symboliser la réconciliation du roi avec la nation.", n: 1 },
        ],
      },
      // II.A : la Terreur (chapitre fusionné), ses trois parties.
      ...T.fiche!.sections.map((sec) => ({ ...sec, titre: `II.A · ${sec.titre.replace(/^[IVX]+\. /, "")}` })),
      {
        titre: "II.B Le Directoire et le coup d'État (1795-1799)",
        points: [
          { t: "Après la Terreur, les thermidoriens (qui ont fait exécuter Robespierre) fondent une République conservatrice : ==le Directoire, du 4 brumaire an IV (26 octobre 1795) au 18 brumaire an VIII (9 novembre 1799)==, organisé par la Constitution de l'an III.", n: 1 },
          { t: "But premier : ==rendre impossibles les excès révolutionnaires==, par la séparation des pouvoirs : cinq directeurs se répartissent l'exécutif (affaires intérieures, guerre…) ; deux assemblées : le Conseil des Cinq-Cents propose les lois, le Conseil des Anciens (250 membres de plus de 40 ans) les vote.", n: 1 },
          { t: "Le suffrage est censitaire, restreint et indirect, réservé aux contribuables : le nombre d'électeurs diminue environ de moitié. Les années sont marquées par un regain de la misère sociale ; royalistes et jacobins menacent le régime.", n: 2 },
          { t: "Le Directoire s'achève par le ==coup d'État de Napoléon Bonaparte== (18 brumaire an VIII, 9 novembre 1799) : une prise du pouvoir par la force, avec l'aide de l'armée. Sur le tableau étudié, Bonaparte est au centre, entouré de soldats et des membres du Conseil des Cinq-Cents en toge rouge, à Saint-Cloud.", n: 1 },
        ],
      },
      {
        titre: "III.A Un nouvel ordre politique (1799-1804)",
        points: [
          { t: "La ==Constitution de l'an VIII== (1799) crée un régime autoritaire dirigé par trois consuls : le Premier consul, Napoléon Bonaparte, a l'autorité exécutive, militaire et diplomatique et propose les lois ; il est nommé consul à vie en 1802.", n: 1 },
          { t: "Article 42 : le deuxième et le troisième consul ont une voix consultative ; ils signent pour constater leur présence et peuvent consigner leurs opinions, « après quoi, la décision du Premier consul suffit ».", n: 3 },
          { t: "En mai 1804, conforté par ses victoires, la paix avec les puissances étrangères et le rétablissement de la paix religieuse, le régime adopte le ==sénatus-consulte du 28 floréal an XII (18 mai 1804)== : « Le gouvernement de la République est confié à un empereur » ; « Napoléon est empereur des Français ».", n: 1 },
          { t: "==Napoléon est sacré par le pape le 2 décembre 1804== à Notre-Dame : il concentre le pouvoir et se comporte désormais comme un roi.", n: 1 },
          { t: "Propagande par la peinture : l'empereur lie le pouvoir politique et religieux, la peinture légitime le sacre. Symboles : de l'Empire romain (aigle, couronne de laurier, toge pourpre), regalia (sceptre, main de justice), abeilles, symboles carolingiens ; créations : Légion d'honneur, Code.", n: 2 },
        ],
      },
      {
        titre: "III.B Le Code civil et les institutions",
        points: [
          { t: "Avant la Révolution, les lois changent selon les régions (droit coutumier). On veut un code unifié depuis les années 1780, mais la codification est lente : ==le Code civil est promulgué le 21 mars 1804==, une fois la situation intérieure stabilisée.", n: 1 },
          { t: "==Novateur : il consacre l'égalité juridique== : égalité devant la loi (des droits et des devoirs identiques pour tous) ; liberté contractuelle (art. 1101 : chacun peut passer des contrats, quelle que soit sa naissance) ; protection de la propriété privée (art. 544 : « le droit de jouir et disposer des choses de la manière la plus absolue »).", n: 1 },
          { t: "==Conservateur : il limite l'égalité== : les femmes sont mineures, dépendantes de leur mari ; l'héritage favorise les familles aisées (art. 711) ; la prééminence du chef de famille et de l'employeur instaure une hiérarchie sociale.", n: 1 },
          { t: "Napoléon installe aussi un préfet dans chaque département et crée les premiers lycées publics.", n: 2 },
          { t: "Pas au DST : la diffusion forcée du Code civil dans l'Europe conquise (1806-1814), son influence au XIXe siècle et son héritage aujourd'hui.", n: 5 },
        ],
      },
    ],
    decoupage: [
      { titre: "La frise", sujet: "Les régimes de 1789 à 1815 et le zoom sur 1789, à savoir dans l'ordre.", sections: [0] },
      { titre: "Une nouvelle France", sujet: "Les causes de la Révolution, l'année 1789 et la monarchie constitutionnelle.", sections: [1, 2, 3] },
      { titre: "La Terreur", sujet: "La Convention, la République menacée, le gouvernement révolutionnaire et la fin de la Terreur (1792-1794).", sections: [4, 5, 6] },
      { titre: "Le Directoire", sujet: "La République du Directoire et le coup d'État de Bonaparte (1795-1799).", sections: [7] },
      { titre: "Napoléon", sujet: "Le Consulat, l'Empire et le sacre, le Code civil.", sections: [8, 9] },
    ],
    aRetenir: [
      "nation",
      "Ancien Régime",
      "société d'ordres",
      "20 juin 1789",
      "nuit du 4 août",
      "DDHC",
      "monarchie constitutionnelle",
      "suffrage censitaire",
      "Directoire",
      "18 brumaire",
      "Consulat",
      "sacre",
      "Code civil",
      ...T.fiche!.aRetenir,
    ],
  },
  exercices: [
    ...T.exercices,
    { question: "Que jurent les députés lors du serment du Jeu de paume ?", choix: ["De rétablir la monarchie absolue", "De ne pas se séparer avant d'avoir donné une constitution à la France", "D'abolir l'esclavage", "De déclarer la guerre à l'Autriche"], bonneReponse: 1, explication: "Le 20 juin 1789, les députés du tiers état, proclamés Assemblée nationale, jurent de donner une constitution à la France." },
    { question: "Que décide l'Assemblée dans la nuit du 4 août 1789 ?", choix: ["La prise de la Bastille", "L'abolition des privilèges", "La proclamation de la République", "Le suffrage universel"], bonneReponse: 1, explication: "L'abolition des privilèges de la noblesse et du clergé met fin à la société d'ordres." },
    { question: "Quel est le premier article de la DDHC (26 août 1789) ?", choix: ["« Le but de la société est le bonheur commun »", "« Les hommes naissent et demeurent libres et égaux en droits »", "« Tous les hommes sont nés égaux »", "« Le gouvernement de la République est confié à un empereur »"], bonneReponse: 1, explication: "« Le bonheur commun » est la Constitution de 1793, « tous les hommes sont nés égaux » la Déclaration d'indépendance américaine, et l'empereur le sénatus-consulte de 1804." },
    { question: "Dans la Constitution de 1791, qui vote les lois ?", choix: ["Le roi seul", "L'assemblée législative", "Le Conseil des Anciens", "Le Premier consul"], bonneReponse: 1, explication: "L'assemblée législative, indissoluble, propose et vote la loi ; le roi la fait exécuter." },
    { question: "Sous le Directoire, quel conseil vote les lois ?", choix: ["Le Conseil des Cinq-Cents", "Le Conseil des Anciens", "Le Comité de salut public", "Le Conseil d'État"], bonneReponse: 1, explication: "Le Conseil des Cinq-Cents propose les lois, le Conseil des Anciens (250 membres de plus de 40 ans) les vote." },
    { question: "Quand Napoléon Bonaparte prend-il le pouvoir par un coup d'État ?", choix: ["14 juillet 1790", "21 septembre 1792", "9 novembre 1799 (18 brumaire an VIII)", "2 décembre 1804"], bonneReponse: 2, explication: "Le coup d'État du 18 brumaire an VIII (9 novembre 1799) met fin au Directoire." },
    { question: "Quel article du Code civil protège la propriété ?", choix: ["Article 42", "Article 544", "Article 711", "Article 1101"], bonneReponse: 1, explication: "Art. 544 : la propriété est le droit de jouir et disposer des choses de la manière la plus absolue. L'art. 1101 définit le contrat, l'art. 711 la transmission de la propriété, l'art. 42 de la Constitution de l'an VIII parle des consuls." },
    { type: "vraiFaux", affirmation: "La Constitution de 1791 donne le droit de vote à tous les hommes.", vrai: false, explication: "Le suffrage est censitaire : seuls les citoyens riches d'au moins 25 ans votent." },
    { type: "vraiFaux", affirmation: "Le Code civil de 1804 donne aux femmes les mêmes droits qu'aux hommes.", vrai: false, explication: "Les femmes sont juridiquement mineures, dépendantes de leur mari : c'est une limite de l'égalité." },
    { type: "vraiFaux", affirmation: "La fête de la Fédération (14 juillet 1790) veut symboliser la réconciliation du roi avec la nation.", vrai: true, explication: "Le roi prête serment à la Constitution ; le but est de créer l'unité nationale." },
    { type: "vraiFaux", affirmation: "Sous le Consulat, les trois consuls ont les mêmes pouvoirs.", vrai: false, explication: "Article 42 : les deux autres consuls n'ont qu'une voix consultative, « la décision du Premier consul suffit »." },
    { type: "trou", texte: "Le Directoire commence le 4 brumaire an IV et se termine par le coup d'État du 18 ___ an VIII.", reponses: ["brumaire"], explication: "18 brumaire an VIII = 9 novembre 1799." },
    { type: "trou", texte: "Pendant la Grande Peur, les paysans brûlent les titres ___ où sont notés les privilèges.", reponses: ["seigneuriaux"], explication: "Été 1789 : ils pillent les châteaux des seigneurs." },
    { type: "trou", texte: "Montesquieu défend la séparation des pouvoirs dans De l'esprit des ___ (1748).", reponses: ["lois"], explication: "Exécutif, législatif, judiciaire." },
    { type: "ordre", consigne: "Remets ces événements de 1789 dans l'ordre.", elements: ["Ouverture des États généraux", "Serment du Jeu de paume", "Prise de la Bastille", "Abolition des privilèges", "DDHC", "Marche des femmes sur Versailles"], explication: "Mai, 20 juin, 14 juillet, 4 août, 26 août, 5-6 octobre 1789." },
    { type: "ordre", consigne: "Remets ces régimes dans l'ordre.", elements: ["Ancien Régime", "Monarchie constitutionnelle", "Ire République (Convention)", "Directoire", "Consulat", "Empire"], explication: "Avant 1789, 1789-1792, 1792-1795, 1795-1799, 1799-1804, 1804-1815." },
    { type: "ordre", consigne: "Remets ces étapes du pouvoir de Napoléon dans l'ordre.", elements: ["Coup d'État du 18 brumaire", "Constitution de l'an VIII", "Consul à vie", "Code civil", "Sénatus-consulte : empereur des Français", "Sacre par le pape"], explication: "Novembre 1799, décembre 1799, 1802, 21 mars 1804, 18 mai 1804, 2 décembre 1804." },
    { type: "ouverte", question: "Montre, avec deux exemples datés, qu'en 1789 la nation prend le pouvoir au roi.", corrige: "Le 20 juin 1789, par le serment du Jeu de paume, les députés du tiers état, qui se disent représentants de la nation, jurent de donner une constitution à la France. Le 26 août 1789, la DDHC affirme que « la souveraineté réside essentiellement dans la nation » : le pouvoir ne vient plus de Dieu et du roi, mais de la nation." },
    { type: "ouverte", question: "En quoi le Code civil de 1804 est-il à la fois novateur et conservateur ?", corrige: "Novateur : il affirme l'égalité devant la loi, la liberté contractuelle (art. 1101) et la propriété privée (art. 544), héritées de 1789. Conservateur : les femmes sont juridiquement mineures, l'héritage favorise les familles aisées (art. 711), le chef de famille et l'employeur dominent." },
  ],
};

// ———————————————————— Méthode (onglet Apprendre) ————————————————————

export const LECON_QUESTION_PROBLEMATISEE: Lecon = {
  id: "hg-methode-question-problematisee",
  methode: true,
  titre: "La question problématisée",
  matiere: "Histoire-Géo",
  niveau: "Première",
  duree: "15 min",
  intro:
    "La méthode de ta prof, et ce qu'elle attend au DST du 3 décembre : une introduction rédigée et un plan détaillé rédigé. Exemple suivi : « Comment la Révolution française et Napoléon Bonaparte transforment-ils la France en plaçant la nation au cœur de la vie politique (1789-1804) ? »",
  documents: [
    { titre: "Fiche méthode · La question problématisée", fichier: `${dossier}/methode-question-problematisee.pdf`, detail: "Fiche de ta prof · 2 pages (photos)" },
  ],
  entrainement: {
    texte: "S'entraîner : cinq sujets sur la Révolution et l'Empire, à faire étape par étape (analyse, introduction, plan détaillé, transitions), puis à comparer au corrigé.",
    lien: "/exercices?mode=problemes",
  },
  etapes: [
    {
      titre: "Ce que l'exercice attend",
      texte: [
        "==Une réponse rédigée et construite à une question ouverte== : tu montres que tu sais sélectionner tes connaissances et les organiser pour répondre à la problématique. Ce n'est pas une récitation du cours.",
        "La réponse doit être synthétique, cohérente et articulée, avec des exemples précis et le vocabulaire historique. ==L'intitulé de la question suggère souvent le plan.==",
        "Au DST du 3/12 : seulement l'introduction rédigée et le plan détaillé, mais en phrases.",
      ],
      question: { q: "Que doit contenir chaque idée de ton développement, selon la fiche ?", r: "Un exemple précis et travaillé (daté, localisé), mis en lien avec l'idée expliquée." },
    },
    {
      titre: "Étape 1 · Le brouillon : comprendre le sujet",
      texte: [
        "Analyse chaque mot-clé pour trouver le chapitre, puis ==définis les mots-clés (« Quoi ? »)== et ==trouve les bornes chronologiques et spatiales (« Où ? », « Quand ? »)== pour ne pas tomber dans le hors-sujet.",
        "Étudie le sujet pour choisir le plan : chronologique (une partie = une période), thématique (une partie = un grand thème) ; en géographie aussi multiscalaire ou analytique.",
        "Sélectionne seulement les connaissances les plus importantes ou celles que tu maîtrises le mieux : idées, vocabulaire, exemples, événements, citations. Tableau, carte mentale, notes : la forme qui te convient.",
      ],
      exemple:
        "« transforment » = un changement par rapport à l'Ancien Régime ; « nation » = communauté politique de citoyens souverains ; bornes 1789-1804, la France ; plan chronologique (1789-1792, 1792-1799, 1799-1804).",
      question: { q: "Quel type de plan convient à « Pourquoi la Révolution connaît-elle une forte instabilité de 1791 à 1799 ? »", r: "Un plan chronologique (un régime par partie : monarchie constitutionnelle, Terreur, Directoire), chaque partie expliquant pourquoi le régime tombe." },
    },
    {
      titre: "Étape 2 · Rédiger l'introduction",
      texte: [
        "C'est la première impression du correcteur : soigne-la. Dans l'ordre :",
        "1. Accroche (facultative) : un événement précis, un tableau, un livre, une citation. 2. Contextualisation : le contexte historique en quelques phrases. 3. ==Définition des mots-clés et des bornes==.",
        "4. ==Saut de ligne, puis la problématique== réécrite. 5. Annonce du plan.",
      ],
      exemple:
        "« Le 20 juin 1789, dans la salle du Jeu de paume, les députés du tiers état jurent de donner une constitution à la France. » Puis l'Ancien Régime en deux phrases, la définition de « nation », les bornes 1789-1804. Ligne sautée : la problématique. « Nous verrons d'abord…, puis…, enfin… »",
      question: { q: "Que place-t-on juste après la définition des mots-clés et des bornes ?", r: "Un saut de ligne, puis la problématique, puis l'annonce du plan." },
    },
    {
      titre: "Étape 2 · Le plan détaillé rédigé",
      texte: [
        "Ce que ta prof attend : le titre de la partie (I.), le titre de la sous-partie (A.), puis ==pour chaque argument : argument, exemple, idée==. Puis la sous-partie B, encore « argument, exemple, idée ». ==Une phrase de transition==, puis la partie II, et ainsi de suite.",
        "Chaque partie commence par une phrase qui annonce son idée directrice en reprenant les mots du sujet. Pense que le correcteur ne connaît rien au sujet : sois explicite.",
        "Un exemple = daté et localisé (« le 14 juillet 1789, à Paris »). L'idée = ce que l'exemple prouve pour le sujet. Évite la « spirale descriptive » : chaque phrase doit servir la démonstration. Utilise des connecteurs logiques.",
      ],
      exemple:
        "I. 1789-1792 : la nation devient souveraine. A. En 1789, la nation prend le pouvoir au roi. « Les députés du tiers état se proclament représentants de la nation (argument). Le 20 juin 1789, par le serment du Jeu de paume à Versailles, ils jurent de donner une constitution à la France (exemple) : la souveraineté passe du roi à la nation (idée). »",
      question: { q: "Quelles sont les trois parties d'une phrase d'argument dans le plan détaillé ?", r: "L'argument, un exemple précis (daté, localisé), l'idée (ce que l'exemple montre pour le sujet)." },
    },
    {
      titre: "Gérer l'heure et demie",
      texte: [
        "Proposition de Luno (pas de la fiche) : 20 min pour analyser le sujet et trier tes connaissances au brouillon ; 10 min pour la problématique et le plan ; 20 min pour rédiger l'introduction ; 35 min pour le plan détaillé et les transitions ; 5 min pour relire.",
        "==Écris d'abord le plan complet au brouillon (titres et exemples)== : si le temps manque, une partie III courte vaut mieux que pas de partie III.",
      ],
      question: { q: "Pourquoi faire tout le plan au brouillon avant de rédiger ?", r: "Pour être sûr d'avoir une copie complète et cohérente, même si le temps manque à la fin." },
    },
  ],
};
