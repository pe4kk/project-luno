import type { ChapitrePublie, DateCle, DefinitionCours, ImageCours } from "@/lib/types";

/**
 * Histoire-Géo Première : « La Convention et la Terreur (1792-1794) ». Repris le
 * 2026-11-13 d'une vidéo du cours du prof (PDF de 5 pages sur Padlet). Les images
 * (carte du manuel, gravures, sceau) sont découpées dans la vidéo.
 *
 * Précisions signalées dans le contenu (le cours dit autrement) : le calendrier
 * républicain est adopté par décret le 5 octobre 1793 (le cours dit « septembre
 * 1793 ») ; l'esclavage est rétabli par la loi du 20 mai 1802 (le cours dit « 20 juin
 * 1802 ») ; entre la chute de Robespierre et le Directoire (octobre 1795), il y a la
 * Convention thermidorienne ; la levée des 300 000 hommes est décrétée le 24 février
 * 1793, à ne pas confondre avec la levée en masse du 23 août 1793.
 */
const matiere = { nom: "Histoire-Géo", couleur: "#c98b6b", emoji: "🌍" };
const dossier = "documents/histoire-geo";

const CARTE: ImageCours = {
  fichier: `${dossier}/terreur-carte-france-1793.jpg`,
  alt: "Carte de la France en 1793 : attaques des coalisés aux frontières, zones d'insurrection fédéraliste, révolte vendéenne et villes insurgées (Lyon, Marseille, Toulon, Bordeaux, Nantes), puis contre-offensive des armées de la Convention.",
  legende: "La France divisée et envahie (1793-1795). Carte du manuel, dans ton cours.",
  ratio: 1.714,
};
const DECLARATION: ImageCours = {
  fichier: `${dossier}/terreur-declaration-1793.jpg`,
  alt: "Gravure de la Déclaration des droits de l'homme et du citoyen de 1793, entre des faisceaux de licteurs, sous le bonnet phrygien et l'œil de la Providence.",
  legende: "Déclaration des droits de 1793 : son article 1er fait du « bonheur commun » le but de la société. Archives nationales.",
  ratio: 0.666,
};
const SCEAU: ImageCours = {
  fichier: `${dossier}/terreur-sceau-comite.jpg`,
  alt: "Sceau du Comité de salut public : « République française une et indivisible », colonne « Liberté, Égalité, Fraternité ou la mort ».",
  legende: "Sceau du Comité de salut public : « Liberté, Égalité, Fraternité ou la mort ».",
  ratio: 0.744,
};
const ETRE_SUPREME: ImageCours = {
  fichier: `${dossier}/terreur-etre-supreme.jpg`,
  alt: "Gravure révolutionnaire : « Être suprême, peuple souverain, République française », sous un soleil rayonnant.",
  legende: "« Être suprême, peuple souverain, République française » : le culte civique de 1794.",
  ratio: 1.235,
};
const ARRESTATION: ImageCours = {
  fichier: `${dossier}/terreur-arrestation-robespierre.jpg`,
  alt: "Gravure : l'arrestation de Robespierre à l'Hôtel de Ville, la nuit, à la lueur des torches ; un soldat lui tire au visage.",
  legende: "L'Arrestation de Robespierre le 27 juillet 1794, d'après Fulchran-Jean Harriet, vers 1796.",
  ratio: 1.427,
};

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

/** Recopiées du cours, dans l'ordre. */
const DEFINITIONS: DefinitionCours[] = [
  d(
    "La Convention",
    "Élue en septembre 1792, elle proclame la République le 21 septembre 1792. Un nouveau calendrier républicain commence : c'est « l'An I de la Liberté ».",
  ),
  d(
    "Les Girondins",
    "Issus de la bourgeoisie libérale, plus modérés, siégeaient sur les bancs au centre ou à droite.",
  ),
  d(
    "Les Montagnards",
    "Plus proches du peuple, plus radicaux, siégeaient sur les bancs les plus élevés, en haut à gauche.",
  ),
  d("La Plaine", "Ou le Marais, le plus modéré et le plus nombreux."),
  p(
    "Une République menacée (1793)",
    "À l'extérieur : la guerre s'étend contre les États coalisés (Anglais, Hollandais, Autrichiens, Prussiens, Espagnols).\nÀ l'intérieur : la guerre civile éclate en Vendée et dans plusieurs autres régions (insurrections fédéralistes girondines).",
  ),
  d(
    "La Constitution de 1793",
    "Le 24 juin 1793, la Convention adopte une Constitution. Son article premier dispose que « le but de la société est le bonheur commun » ; cette Constitution ne sera jamais appliquée, mais elle reste longtemps une référence pour les républicains.",
    "Exemples de lois sociales : suffrage universel (uniquement masculin), système parlementaire, éducation gratuite et obligatoire.",
  ),
  d(
    "Le gouvernement révolutionnaire",
    "Mis en place en juillet 1793 par la Convention (maintenant contrôlée par les montagnards). Il repose sur deux organes : la Convention (pouvoir législatif) et le Comité de salut public (pouvoir exécutif).",
  ),
  d(
    "Le Comité de salut public",
    "Instauré le 6 avril 1793, il avait comme mission originale surveiller l'action des ministres. 12 députés, renouvelés tous les mois. Il remplace le gouvernement, il est doté des pleins pouvoirs sous le contrôle de l'Assemblée.",
    "« Présidé » d'abord par Danton, puis par Maximilien de Robespierre. Sous Robespierre, sa mission évolue : « vaincre les ennemis de la République ».",
  ),
  d(
    "Les représentants en mission",
    "Des députés qui surveillent les départements pour le Comité de salut public.",
  ),
  p(
    "Le début de la Terreur",
    "La date du début de la Terreur est compliquée à déterminer. Certains historiens la placent avec l'institution du Comité de salut public le 6 avril 1793, d'autres avec le vote de la « Loi des suspects » le 17 septembre 1793.",
  ),
  d(
    "No man's land",
    "Espace inoccupé compris entre les premières lignes de deux belligérants (Larousse).",
    "À nuancer : la Terreur n'est pas qu'une période sanglante. Sous le gouvernement révolutionnaire, plusieurs lois sociales sont appliquées.",
  ),
  d(
    "La loi des suspects",
    "Elle permet d'arrêter tous « ceux qui, par leur conduite, leurs relations, leurs propos ou leurs écrits, se sont montrés partisans de la tyrannie ou du fédéralisme et ennemis de la liberté » (art. 1). Cette loi entraîne la multiplication des arrestations de tous les ennemis de la révolution avoués ou susceptibles de l'être.",
  ),
  d(
    "La loi du maximum",
    "Fixation d'un prix maximum des aliments.",
  ),
  d(
    "Le calendrier républicain",
    "Adopté par la Convention en septembre 1793, il supprime le dimanche, les fêtes religieuses et les noms de saints pour les remplacer par des décades et des noms liés à la nature.",
    "Le décret qui l'adopte date précisément du 5 octobre 1793.",
  ),
  d(
    "La déchristianisation",
    "Les fêtes, le nom de certaines villes, les prénoms changent et abandonnent les références chrétiennes au profit de valeurs révolutionnaires.",
  ),
  d(
    "Le culte de l'Être suprême",
    "Pour « remplacer » le christianisme, un culte à la fois civique et religieux est organisé en France, notamment lors de fêtes en 1794. Il ne se veut pas une religion. Le décret du 18 floréal an II (7 mai 1794) instaure ces fêtes pour faire prendre conscience au peuple qu'il est souverain dans son pays.",
  ),
  d(
    "La guerre de Vendée",
    "Guerre civile entre les « bleus » (républicains) et les « blancs » (royalistes), de 1793 à 1796. Cette première guerre de Vendée se termine par une victoire républicaine.",
    "Plus de 180 000 morts du côté des royalistes et 120 000 chez les républicains.",
  ),
  d(
    "Les Indulgents",
    "Une faction des Montagnards opposés à la Terreur. Ils souhaitent le retour à la paix intérieure (ex. Danton).",
  ),
];

const DATES: DateCle[] = [
  {
    date: "20 septembre 1792",
    tri: "1792-09-20",
    evenement: "Victoire de Valmy",
    precision: "Première victoire des armées révolutionnaires contre les Prussiens (sur la carte du cours).",
    importance: 2,
  },
  {
    date: "21 septembre 1792",
    tri: "1792-09-21",
    evenement: "La Convention proclame la République",
    precision: "Fin de la monarchie. Le calendrier républicain fait commencer l'An I de la Liberté le lendemain, 22 septembre 1792.",
    importance: 1,
  },
  {
    date: "21 janvier 1793",
    tri: "1793-01-21",
    evenement: "Exécution de Louis XVI",
    precision: "Après sa mort, la Convention se divise entre Girondins, Montagnards et Plaine ; plusieurs pays européens entrent en guerre contre la France.",
    importance: 1,
  },
  {
    date: "Mars 1793",
    tri: "1793-03",
    evenement: "Soulèvement de la Vendée",
    precision: "En réaction à la levée de 300 000 hommes pour l'armée : début de la guerre civile entre « bleus » et « blancs ».",
    importance: 1,
  },
  {
    date: "6 avril 1793",
    tri: "1793-04-06",
    evenement: "Création du Comité de salut public",
    precision: "Pour certains historiens, c'est le début de la Terreur.",
    importance: 1,
  },
  {
    date: "2 juin 1793",
    tri: "1793-06-02",
    evenement: "Chute des Girondins",
    precision: "La Garde nationale et les sans-culottes entourent la Convention : les chefs girondins sont arrêtés, les Montagnards contrôlent l'Assemblée.",
    importance: 1,
  },
  {
    date: "24 juin 1793",
    tri: "1793-06-24",
    evenement: "Constitution de l'an I (Constitution montagnarde)",
    precision: "« Le but de la société est le bonheur commun » ; adoptée par référendum en juillet, mais jamais appliquée.",
    importance: 1,
  },
  {
    date: "Juillet 1793",
    tri: "1793-07",
    evenement: "Robespierre au Comité de salut public : le gouvernement révolutionnaire se met en place",
    precision: "La Convention (législatif) et le Comité de salut public (exécutif) concentrent le pouvoir.",
    importance: 2,
  },
  {
    date: "17 septembre 1793",
    tri: "1793-09-17",
    evenement: "Loi des suspects",
    precision: "Pour d'autres historiens, c'est le vrai début de la Terreur : multiplication des arrestations.",
    importance: 1,
  },
  {
    date: "Octobre 1793",
    tri: "1793-10-05",
    evenement: "Adoption du calendrier républicain",
    precision: "Ton cours dit « septembre 1793 » ; le décret date du 5 octobre 1793. Décades et noms liés à la nature à la place du dimanche et des saints.",
    importance: 2,
  },
  {
    date: "4 février 1794",
    tri: "1794-02-04",
    evenement: "Abolition de l'esclavage dans les colonies",
    precision: "Mesure phare « pour l'égalité des droits » du gouvernement révolutionnaire.",
    importance: 1,
  },
  {
    date: "5 avril 1794",
    tri: "1794-04-05",
    evenement: "Exécution de Danton, chef des Indulgents",
    precision: "Elle forme un soulèvement contre Robespierre, désigné comme « dictateur ».",
    importance: 2,
  },
  {
    date: "7 mai 1794 (18 floréal an II)",
    tri: "1794-05-07",
    evenement: "Décret instaurant le culte de l'Être suprême",
    precision: "Culte civique, avec des fêtes, pour que le peuple prenne conscience qu'il est souverain.",
    importance: 2,
  },
  {
    date: "28 juillet 1794 (10 thermidor an II)",
    tri: "1794-07-28",
    evenement: "Exécution de Robespierre : fin de la Terreur",
    precision: "Arrêté la veille, le 27 juillet (9 thermidor). Les exilés reviennent en France.",
    importance: 1,
  },
  {
    date: "1796",
    tri: "1796",
    evenement: "Fin de la première guerre de Vendée",
    precision: "Victoire républicaine.",
    importance: 2,
  },
  {
    date: "20 mai 1802",
    tri: "1802-05-20",
    evenement: "Rétablissement de l'esclavage par Bonaparte",
    precision: "Ton cours dit « 20 juin 1802 » : la loi date du 20 mai 1802 (30 floréal an X).",
    importance: 2,
  },
];

export const HISTOIRE_TERREUR: ChapitrePublie = {
  id: "hg-1re-convention-terreur",
  version: 1,
  matiere,
  titre: "La Convention et la Terreur (1792-1794)",
  definitions: DEFINITIONS,
  dates: DATES,
  flashcards: [
    { recto: "Date de la proclamation de la République", verso: "21 septembre 1792, par la Convention élue en septembre 1792. Début de « l'An I de la Liberté »." },
    { recto: "Les Girondins", verso: "Issus de la bourgeoisie libérale, plus modérés ; ils siègent au centre ou à droite de la Convention." },
    { recto: "Les Montagnards", verso: "Plus proches du peuple, plus radicaux ; ils siègent sur les bancs les plus élevés, en haut à gauche." },
    { recto: "La Plaine (ou le Marais)", verso: "Le groupe le plus modéré et le plus nombreux de la Convention." },
    { recto: "Pourquoi la République est-elle menacée en 1793 ?", verso: "À l'extérieur : guerre contre les États coalisés (Anglais, Hollandais, Autrichiens, Prussiens, Espagnols). À l'intérieur : guerre civile en Vendée et insurrections fédéralistes girondines.", },
    { recto: "Constitution de 1793 (an I)", verso: "Adoptée le 24 juin 1793 : « le but de la société est le bonheur commun » (art. 1), suffrage universel masculin, éducation gratuite et obligatoire. Jamais appliquée à cause des guerres." },
    { recto: "Que se passe-t-il le 2 juin 1793 ?", verso: "La Garde nationale et les sans-culottes entourent la Convention : décrets d'arrestation contre les chefs girondins, l'inviolabilité des députés est suspendue." },
    { recto: "Les deux organes du gouvernement révolutionnaire", verso: "La Convention (pouvoir législatif) et le Comité de salut public (pouvoir exécutif), mis en place en juillet 1793." },
    { recto: "Comité de salut public", verso: "Instauré le 6 avril 1793 : 12 députés renouvelés tous les mois, aidés de « représentants en mission ». « Présidé » par Danton puis Robespierre ; sa mission devient « vaincre les ennemis de la République »." },
    { recto: "Quand commence la Terreur ?", verso: "Date débattue : 6 avril 1793 (Comité de salut public) ou 17 septembre 1793 (loi des suspects)." },
    { recto: "Loi des suspects (17 septembre 1793)", verso: "Permet d'arrêter tous ceux qui, par leur conduite, leurs relations, leurs propos ou leurs écrits, se sont montrés partisans de la tyrannie ou du fédéralisme et ennemis de la liberté." },
    { recto: "Les mesures sociales de la Terreur", verso: "Abolition de l'esclavage (4 février 1794), suffrage universel masculin, droit à l'éducation, droit à l'assistance, loi du maximum (prix maximum des aliments)." },
    { recto: "Date de l'abolition de l'esclavage", verso: "4 février 1794 (rétabli par Bonaparte en 1802)." },
    { recto: "Calendrier républicain", verso: "Adopté à l'automne 1793 : il supprime le dimanche, les fêtes religieuses et les noms de saints, remplacés par des décades et des noms liés à la nature." },
    { recto: "Culte de l'Être suprême", verso: "Culte civique et religieux (qui ne se veut pas une religion), instauré par le décret du 18 floréal an II (7 mai 1794), avec des fêtes pour que le peuple prenne conscience qu'il est souverain." },
    { recto: "Guerre de Vendée", verso: "Révolte de l'Ouest contre la levée de 300 000 hommes (mars 1793), devenue guerre civile entre « bleus » (républicains) et « blancs » (royalistes), 1793-1796. Victoire républicaine." },
    { recto: "Les Indulgents", verso: "Faction des Montagnards opposée à la Terreur, qui veut le retour à la paix intérieure ; leur chef Danton est exécuté (avril 1794)." },
    { recto: "Chute de Robespierre", verso: "Arrêté le 9 thermidor an II (27 juillet 1794), exécuté le 10 thermidor (28 juillet 1794) : c'est la fin de la Terreur.", },
  ],
  fiche: {
    sections: [
      {
        titre: "I. La République divisée",
        points: [
          { t: "La Convention, élue en septembre 1792, ==proclame la République le 21 septembre 1792==. Un calendrier républicain commence : « l'An I de la Liberté ».", n: 1 },
          { t: "Après la mort de Louis XVI (21 janvier 1793), l'Hémicycle est divisé en trois groupes : les Girondins (bourgeoisie libérale, modérés, au centre ou à droite), les Montagnards (proches du peuple, radicaux, en haut à gauche) et la Plaine ou Marais (le plus modéré et le plus nombreux).", n: 1 },
          { t: "==En 1793, la République est menacée de toutes parts== : à l'extérieur, guerre contre les États coalisés (Anglais, Hollandais, Autrichiens, Prussiens, Espagnols) ; à l'intérieur, guerre civile en Vendée et insurrections fédéralistes girondines (Lyon, Marseille, Toulon, Bordeaux…).", n: 1, image: CARTE },
          { t: "Le 24 juin 1793, la Convention adopte la Constitution de l'an I : « le but de la société est le bonheur commun » (art. 1).", n: 1 },
          { t: "Pour convaincre une population qui n'était pas vraiment convaincue par la République, elle prévoit des lois sociales : suffrage universel (uniquement masculin), système parlementaire, éducation gratuite et obligatoire.", n: 2 },
          { t: "Le 2 juin 1793, la Garde nationale et les sans-culottes entourent la Convention : les chefs girondins sont arrêtés, l'inviolabilité des députés est suspendue.", n: 2 },
          { t: "À cause des guerres, la Convention diffère l'application de la Constitution : adoptée par référendum en juillet, ==elle ne sera jamais appliquée==, mais reste longtemps une référence pour les républicains.", n: 3 },
          { t: "La Déclaration des droits de 1793 ne reprend pas la formule de 1789 (« Les hommes naissent et demeurent libres et égaux en droits ») : elle met en avant le bonheur commun et le rôle du gouvernement.", n: 4, image: DECLARATION },
        ],
      },
      {
        titre: "II. La Terreur",
        points: [
          { t: "Le début de la Terreur est débattu : 6 avril 1793 (création du Comité de salut public) ou 17 septembre 1793 (loi des suspects).", n: 1 },
          { t: "En juillet 1793, la Convention, contrôlée par les Montagnards, met en place un ==gouvernement révolutionnaire== qui repose sur deux organes : la Convention (pouvoir législatif) et le Comité de salut public (pouvoir exécutif, pleins pouvoirs sous le contrôle de l'Assemblée).", n: 1 },
          { t: "Le Comité de salut public : 12 députés renouvelés tous les mois, des « représentants en mission » dans les départements ; « présidé » par Danton puis par Maximilien de Robespierre, sous qui sa mission devient « vaincre les ennemis de la République ».", n: 2, image: SCEAU },
          { t: "Contre les opposants : un tribunal révolutionnaire et la ==loi des suspects (17 septembre 1793), qui permet d'arrêter tous les ennemis de la Révolution, avoués ou supposés==.", n: 1 },
          { t: "Contre l'ennemi extérieur : levée en masse de volontaires puis de conscrits pour l'armée.", n: 2 },
          { t: "À nuancer : ==la Terreur n'est pas qu'une période sanglante, plusieurs lois sociales sont appliquées== : abolition de l'esclavage (4 février 1794), suffrage universel masculin, droit à l'éducation, droit à l'assistance, loi du maximum (prix maximum des aliments).", n: 2 },
          { t: "La Constitution de l'an I reste suspendue pendant tout le gouvernement révolutionnaire.", n: 3 },
          { t: "Déchristianisation : le calendrier républicain (automne 1793) supprime le dimanche, les fêtes religieuses et les noms de saints (décades, noms liés à la nature) ; des fêtes, des noms de villes et des prénoms changent.", n: 2 },
          { t: "Le culte de l'Être suprême, civique et religieux sans se vouloir une religion, est instauré par le décret du 18 floréal an II (7 mai 1794) : ses fêtes doivent faire prendre conscience au peuple qu'il est souverain.", n: 3, image: ETRE_SUPREME },
          { t: "Précision : le décret du calendrier républicain date du 5 octobre 1793 (ton cours dit « septembre 1793 ») ; l'abolition de l'esclavage est annulée par la loi du 20 mai 1802 (ton cours dit « 20 juin »).", n: 5 },
        ],
      },
      {
        titre: "III. Les contre-révolutionnaires et la fin de la Terreur",
        points: [
          { t: "Guerre de Vendée : en réaction à la levée de 300 000 hommes (mars 1793), l'Ouest se soulève. ==Guerre civile entre « bleus » (républicains) et « blancs » (royalistes), de 1793 à 1796==, gagnée par les républicains.", n: 1 },
          { t: "Bilan : plus de 180 000 morts côté royaliste et 120 000 côté républicain.", n: 3 },
          { t: "Danton, chef des Indulgents (Montagnards opposés à la Terreur, qui veulent la paix intérieure), est exécuté : un soulèvement se forme contre Robespierre, désigné comme « dictateur ».", n: 2 },
          { t: "==Robespierre est arrêté le 9 thermidor et exécuté le 10 thermidor an II (28 juillet 1794) : c'est la fin de la Terreur.== Des sans-culottes et Montagnards sont aussi exécutés ; les exilés reviennent.", n: 1, image: ARRESTATION },
          { t: "Les ennemis désignés ne sont pas seulement les royalistes : les Girondins chassés de la Convention (ex. Olympe de Gouges) et les révolutionnaires jugés trop modérés (ex. Danton) sont aussi poursuivis.", n: 4 },
          { t: "Après la Terreur, la Convention dite « thermidorienne » gouverne encore un an ; le Directoire commence en octobre 1795.", n: 4 },
        ],
      },
    ],
    aRetenir: [
      "Convention",
      "Girondins / Montagnards / Plaine",
      "Constitution de l'an I",
      "gouvernement révolutionnaire",
      "Comité de salut public",
      "Robespierre",
      "loi des suspects",
      "abolition de l'esclavage",
      "déchristianisation",
      "Être suprême",
      "Vendée",
      "9-10 thermidor an II",
    ],
  },
  exercices: [
    { question: "Quand la Convention proclame-t-elle la République ?", choix: ["14 juillet 1789", "21 septembre 1792", "21 janvier 1793", "24 juin 1793"], bonneReponse: 1, explication: "Élue en septembre 1792, la Convention proclame la République le 21 septembre 1792." },
    { question: "Quel groupe siège en haut à gauche de la Convention ?", choix: ["Les Girondins", "La Plaine", "Les Montagnards", "Les Feuillants"], bonneReponse: 2, explication: "Les Montagnards, plus radicaux et proches du peuple, siègent sur les bancs les plus élevés, en haut à gauche." },
    { question: "Quel est le pouvoir du Comité de salut public ?", choix: ["Le pouvoir législatif", "Le pouvoir exécutif", "Le pouvoir judiciaire", "Aucun, il ne fait que conseiller"], bonneReponse: 1, explication: "La Convention garde le législatif ; le Comité de salut public a le pouvoir exécutif, avec les pleins pouvoirs sous le contrôle de l'Assemblée." },
    { question: "Que permet la loi des suspects du 17 septembre 1793 ?", choix: ["D'abolir l'esclavage", "D'arrêter tous ceux qui se sont montrés ennemis de la liberté", "De fixer le prix des aliments", "D'élire une nouvelle Assemblée"], bonneReponse: 1, explication: "Elle permet d'arrêter tous ceux qui, par leur conduite, leurs relations, leurs propos ou leurs écrits, se sont montrés partisans de la tyrannie ou du fédéralisme." },
    { question: "Que fixe la loi du maximum ?", choix: ["Le nombre maximum de députés", "Un prix maximum des aliments", "La durée maximale d'un mandat", "Le nombre de soldats"], bonneReponse: 1, explication: "Elle fixe un prix maximum des aliments : c'est une des mesures sociales du gouvernement révolutionnaire." },
    { question: "Qui s'oppose dans la guerre de Vendée ?", choix: ["Girondins et Montagnards", "« Bleus » républicains et « blancs » royalistes", "Français et Anglais", "Sans-culottes et Garde nationale"], bonneReponse: 1, explication: "Guerre civile de 1793 à 1796 entre les « bleus » (républicains) et les « blancs » (royalistes)." },
    { type: "vraiFaux", affirmation: "La Constitution de l'an I (1793) a été appliquée pendant la Terreur.", vrai: false, explication: "Elle est adoptée le 24 juin 1793 et approuvée par référendum, mais sa mise en œuvre est différée à cause des guerres : elle ne sera jamais appliquée." },
    { type: "vraiFaux", affirmation: "La Terreur n'est qu'une période de violence, sans aucune loi sociale.", vrai: false, explication: "À nuancer : abolition de l'esclavage, suffrage universel masculin, droit à l'éducation, à l'assistance, loi du maximum." },
    { type: "vraiFaux", affirmation: "Le culte de l'Être suprême se veut une nouvelle religion qui remplace officiellement le catholicisme.", vrai: false, explication: "C'est un culte à la fois civique et religieux qui ne se veut pas une religion : il doit faire prendre conscience au peuple qu'il est souverain." },
    { type: "vraiFaux", affirmation: "Les historiens ne sont pas d'accord sur la date du début de la Terreur.", vrai: true, explication: "Certains la placent le 6 avril 1793 (Comité de salut public), d'autres le 17 septembre 1793 (loi des suspects)." },
    { type: "trou", texte: "Robespierre est exécuté le 10 ___ an II (28 juillet 1794).", reponses: ["thermidor"], explication: "Arrêté le 9 thermidor, exécuté le 10 thermidor an II : c'est la fin de la Terreur." },
    { type: "trou", texte: "L'article premier de la Constitution de 1793 dispose que « le but de la société est le ___ commun ».", reponses: ["bonheur"], explication: "La Déclaration de 1793 met en avant le bonheur commun et le rôle du gouvernement." },
    { type: "trou", texte: "L'esclavage est aboli par le décret du 4 février ___.", reponses: ["1794"], explication: "Décret du 4 février 1794 (16 pluviôse an II), annulé par Bonaparte en 1802." },
    { type: "trou", texte: "Les Montagnards opposés à la Terreur, menés par Danton, sont appelés les ___.", reponses: ["Indulgents", "indulgents"], explication: "Ils veulent le retour à la paix intérieure ; Danton est exécuté en avril 1794." },
    { type: "ordre", consigne: "Remets ces événements dans l'ordre chronologique.", elements: ["Proclamation de la République", "Exécution de Louis XVI", "Création du Comité de salut public", "Chute des Girondins", "Loi des suspects", "Exécution de Robespierre"], explication: "21/09/1792, 21/01/1793, 06/04/1793, 02/06/1793, 17/09/1793, 28/07/1794." },
    { type: "ordre", consigne: "Remets ces mesures dans l'ordre où elles sont prises.", elements: ["Constitution de l'an I", "Loi des suspects", "Abolition de l'esclavage", "Culte de l'Être suprême"], explication: "24 juin 1793, 17 septembre 1793, 4 février 1794, 7 mai 1794." },
    { type: "ouverte", question: "Pourquoi peut-on dire que la République est « menacée » en 1793 ? Appuie-toi sur la carte du cours.", corrige: "À l'extérieur, la France est attaquée sur toutes ses frontières par les coalisés (Anglais, Hollandais, Prussiens, Autrichiens, Espagnols, Piémontais). À l'intérieur, la guerre civile éclate en Vendée (révolte contre la levée de 300 000 hommes) et des villes se soulèvent (insurrections fédéralistes girondines à Lyon, Marseille, Toulon, Bordeaux)." },
    { type: "ouverte", question: "Montre que la Terreur ne se résume pas à la violence.", corrige: "Le gouvernement révolutionnaire arrête et exécute ses ennemis (tribunal révolutionnaire, loi des suspects), mais il prend aussi des mesures pour l'égalité des droits : abolition de l'esclavage (4 février 1794), suffrage universel masculin, droit à l'éducation, droit à l'assistance, loi du maximum sur les prix des aliments." },
    { type: "ouverte", question: "Comment la Terreur prend-elle fin ?", corrige: "Danton, chef des Indulgents, est exécuté ; Robespierre est alors désigné comme « dictateur ». Il est arrêté le 9 thermidor et exécuté le 10 thermidor an II (28 juillet 1794), avec des sans-culottes et des Montagnards. Les exilés reviennent : c'est la fin de la Terreur." },
  ],
};
