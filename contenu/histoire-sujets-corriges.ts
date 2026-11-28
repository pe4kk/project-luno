import type { Probleme } from "@/lib/types";

/**
 * Histoire-Géo Première, H1 (Révolution et Empire, Terreur comprise) : trois nouvelles questions
 * problématisées corrigées, en plus des cinq de `histoire-revolution-empire.ts`, dans le périmètre
 * du DST du 3/12/2026 (jusqu'au Code civil, en France ; ni les conquêtes ni l'Europe).
 *
 * Chaque sujet a deux modes : « plan » (introduction + plan détaillé, le format du DST) et
 * « developpe » (la même copie entièrement rédigée, avec une conclusion). Tous les faits, dates et
 * citations viennent du cours de l'élève ; quelques connaissances classiques sûres s'y ajoutent
 * (Olympe de Gouges guillotinée en 1793, levée en masse, Concordat de 1801, plébiscites, journaux
 * supprimés sous le Consulat, suffrage universel masculin en 1848).
 *
 * Plans : chronologique (la radicalisation), thématique (le peuple), deux parties qui s'opposent
 * (Napoléon héritier ou fossoyeur).
 */

// ———————————————————— Critères et consignes (mêmes que les modèles) ————————————————————

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

const ANALYSE_CONSIGNE =
  "Au brouillon, comme le demande ta prof : entoure les mots-clés et définis-les (« Quoi ? »), trouve les bornes (« Où ? », « Quand ? »), puis choisis le type de plan (chronologique ou thématique).";
const PARTIE_CONSIGNE =
  "Plan détaillé rédigé : titre de la partie, titre de la sous-partie, puis pour chaque argument une phrase « argument, exemple, idée ». Deux arguments par sous-partie suffisent.";

// ———————————————————— Copie développée ————————————————————

const PARTIE_DEVELOPPE_CONSIGNE =
  "Copie développée : rédige toute la partie, sans titres. Une phrase qui annonce l'idée directrice en reprenant les mots du sujet, puis un paragraphe par sous-partie (alinéa) : l'idée, un exemple précis (daté, localisé) expliqué, et une phrase qui le relie au sujet.";
const CRITERES_PARTIE_DEVELOPPE = [
  "Phrase d'annonce de la partie qui reprend les mots du sujet",
  "Un paragraphe par sous-partie, avec un alinéa",
  "Chaque idée appuyée sur un exemple précis, daté et localisé, expliqué",
  "Chaque paragraphe se termine en reliant l'exemple au sujet",
  "Connecteurs logiques : une démonstration, pas un récit",
  "Phrases complètes, sans tirets ni abréviations",
];
const CONCLUSION_CONSIGNE =
  "Bilan rapide qui reprend les idées clés de chaque partie et répond clairement à la problématique, puis une ouverture (facultative) qui situe le sujet dans une perspective plus vaste. Conseil de ta prof : rédige la conclusion au brouillon avant le développement.";
const CRITERES_CONCLUSION = [
  "Bilan qui reprend l'idée clé de chaque partie",
  "Réponse claire et nuancée à la problématique",
  "Ouverture exacte qui situe le sujet dans une perspective plus vaste",
];

// ———————————————————— Les sujets ————————————————————

export const PROBLEMES_HISTOIRE_NOUVEAUX: Probleme[] = [
  // 1. Plan chronologique
  {
    id: "hg-qp-radicalisation",
    titre: "Question problématisée : la radicalisation de la Révolution (1792-1794)",
    duree: "1 h 30 (DST)",
    enonce: "Sujet : Comment et pourquoi la Révolution française se radicalise-t-elle entre 1792 et 1794 ?",
    question:
      "La République et la Terreur (II.A de ton cours). Plan chronologique en trois parties : rédige l'introduction et le plan détaillé, ou toute la copie en mode développé.",
    etapes: [
      {
        titre: "Analyser le sujet",
        consigne: ANALYSE_CONSIGNE,
        attendu:
          "Mots-clés : « radicalisation » (la Révolution adopte des positions et des moyens de plus en plus extrêmes : fin de la monarchie, mort du roi, suspension des libertés, arrestations de masse), « comment » et « pourquoi » (les étapes et les causes : il faut expliquer, pas seulement raconter).\nBornes : 1792 (élection de la Convention et proclamation de la République, septembre 1792) à 1794 (exécution de Robespierre, 28 juillet 1794, fin de la Terreur) ; la France, menacée à ses frontières.\nPlan : chronologique, car la radicalisation se fait par étapes ; dans chaque partie, donner les causes (la guerre, les divisions) en même temps que les faits.",
        criteres: ["« Radicalisation » définie", "Bornes 1792 et 1794 justifiées par des événements", "Plan chronologique justifié (étapes et causes)"],
        points: 2,
      },
      {
        titre: "Rédiger l'introduction",
        consigne: "Accroche, contexte, définitions et bornes, problématique, annonce du plan. Des phrases complètes.",
        attendu:
          "Le 21 janvier 1793, Louis XVI est guillotiné à Paris. En 1789, pourtant, les révolutionnaires voulaient seulement limiter le pouvoir du roi : la DDHC a fait de la nation la souveraine du pays et la Constitution de 1791 a créé une monarchie constitutionnelle, qui partage le pouvoir entre une assemblée élue et le roi. Mais en septembre 1792, alors que la France est en guerre, une nouvelle assemblée, la Convention, proclame la République. Entre 1792 et 1794, la Révolution se radicalise, c'est-à-dire qu'elle adopte des positions et des moyens de plus en plus extrêmes : mort du roi, gouvernement d'exception, arrestations de masse. Cette période, appelée la Terreur à partir de 1793, s'achève avec l'exécution de Robespierre le 28 juillet 1794.\n\nComment et pourquoi la Révolution française se radicalise-t-elle entre 1792 et 1794 ?\n\nNous verrons d'abord que la République naît, de 1792 au printemps 1793, dans la guerre et la division, puis que, de l'été 1793 au printemps 1794, les Montagnards installent un gouvernement d'exception, la Terreur, enfin qu'en 1794 cette radicalisation se retourne contre ses propres auteurs.",
        criteres: CRITERES_INTRO,
        points: 5,
      },
      {
        titre: "Partie I",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "I. 1792-printemps 1793 : la République naît dans la guerre et la division\n\nA. La fin de la monarchie\n– La Révolution rompt avec la royauté. Élue en septembre 1792, la Convention proclame la République le 21 septembre 1792, au lendemain de la victoire de Valmy contre les Prussiens, et les actes officiels sont désormais datés de « l'an I de la République » : la nation se gouverne désormais sans roi.\n– La rupture devient définitive. Louis XVI est guillotiné à Paris le 21 janvier 1793 : tout retour en arrière est impossible, mais plusieurs pays européens entrent alors en guerre contre la France.\n\nB. Une République menacée et divisée\n– La République est attaquée de toutes parts. À l'extérieur, la guerre s'étend contre les États coalisés (Anglais, Hollandais, Autrichiens, Prussiens, Espagnols) ; à l'intérieur, la Vendée se soulève en mars 1793 contre la levée de 300 000 hommes : la peur de la défaite pousse vers des mesures d'exception.\n– Les révolutionnaires se déchirent. À la Convention, les Girondins, issus de la bourgeoisie libérale et plus modérés, s'opposent aux Montagnards, plus radicaux et proches du peuple, tandis que la Plaine hésite ; le 6 avril 1793, un Comité de salut public est créé : la division prépare la victoire des plus radicaux.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "Entre l'automne 1792 et le printemps 1793, la Révolution se radicalise d'abord parce que la République naît dans la guerre et dans la division.\n\nLa première étape de cette radicalisation est la fin de la monarchie. Élue en septembre 1792, la Convention proclame la République le 21 septembre 1792, au lendemain de la victoire de Valmy, première victoire des armées révolutionnaires contre les Prussiens. Les actes officiels sont désormais datés de « l'an I de la République » : les révolutionnaires veulent montrer qu'une ère nouvelle s'ouvre, dans laquelle la nation se gouverne sans roi. La rupture devient définitive le 21 janvier 1793, lorsque Louis XVI est guillotiné à Paris. En exécutant le roi, les révolutionnaires rendent tout retour en arrière impossible, mais plusieurs pays européens entrent alors en guerre contre la France. La radicalisation politique fait donc naître de nouvelles menaces, qui vont à leur tour la nourrir.\n\nEn effet, en 1793, la République est attaquée de toutes parts. À l'extérieur, la guerre s'étend contre les États coalisés : Anglais, Hollandais, Autrichiens, Prussiens et Espagnols. À l'intérieur, la Vendée se soulève en mars 1793 contre la levée de 300 000 hommes pour l'armée, et cette révolte devient une guerre civile entre les « bleus » républicains et les « blancs » royalistes ; des insurrections fédéralistes éclatent aussi dans plusieurs villes, comme Lyon ou Marseille. Face à ces dangers, les révolutionnaires se divisent. À la Convention, les Girondins, issus de la bourgeoisie libérale et plus modérés, s'opposent aux Montagnards, plus radicaux et plus proches du peuple, tandis que la Plaine, le groupe le plus nombreux, hésite entre les deux. Dès le 6 avril 1793, la Convention crée un Comité de salut public chargé de surveiller les ministres. La peur de la défaite et ces divisions préparent ainsi la victoire des plus radicaux.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie II",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Menacée par la guerre et divisée, la République bascule à l'été 1793 : les Montagnards prennent le pouvoir et installent un régime d'exception.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie II",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "II. Été 1793-printemps 1794 : la Terreur, un gouvernement d'exception\n\nA. Les Montagnards concentrent le pouvoir\n– Les plus radicaux éliminent leurs rivaux. Le 2 juin 1793, la Garde nationale et les sans-culottes entourent la Convention à Paris et obtiennent l'arrestation des chefs girondins : les Montagnards contrôlent l'Assemblée par la pression de la rue.\n– Les libertés promises sont suspendues. La Constitution de l'an I, adoptée le 24 juin 1793, prévoit le suffrage universel masculin mais n'est jamais appliquée ; en juillet 1793, un gouvernement révolutionnaire se met en place : la Convention garde le pouvoir législatif et le Comité de salut public, où entre Robespierre, reçoit les pleins pouvoirs exécutifs. L'urgence de la guerre justifie la concentration du pouvoir.\n\nB. Une radicalisation politique, religieuse et sociale\n– La répression frappe tous les opposants. La loi des suspects du 17 septembre 1793 permet d'arrêter tous les « ennemis de la liberté », jugés par un tribunal révolutionnaire, et la levée en masse fournit des soldats : la Terreur devient un moyen de gouverner.\n– La Révolution veut aussi transformer les esprits et la société. Le calendrier républicain (5 octobre 1793) supprime le dimanche et les fêtes religieuses ; la Convention abolit l'esclavage dans les colonies le 4 février 1794 et fixe un prix maximum des aliments (loi du maximum) : la radicalisation n'est pas seulement violente, elle pousse l'égalité plus loin qu'en 1789.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "À partir de l'été 1793, la radicalisation change de nature : les Montagnards installent un gouvernement d'exception, la Terreur.\n\nLes plus radicaux commencent par éliminer leurs adversaires et par concentrer le pouvoir. Le 2 juin 1793, la Garde nationale et les sans-culottes, révolutionnaires issus des milieux populaires parisiens, entourent la Convention et obtiennent l'arrestation des chefs girondins. Les Montagnards contrôlent désormais l'Assemblée, mais grâce à la pression de la rue et non grâce au vote. La Convention adopte bien, le 24 juin 1793, une nouvelle Constitution, dont l'article premier affirme que « le but de la société est le bonheur commun » et qui prévoit le suffrage universel masculin. Pourtant, à cause des guerres, elle n'est jamais appliquée. À sa place, un gouvernement révolutionnaire se met en place en juillet 1793 : la Convention garde le pouvoir législatif, et le Comité de salut public, où entre Robespierre, reçoit le pouvoir exécutif avec les pleins pouvoirs, aidé par des représentants en mission dans les départements. Au nom de l'urgence, la séparation des pouvoirs voulue en 1789 est donc abandonnée.\n\nCe gouvernement fait de la Terreur un moyen de gouverner. La loi des suspects du 17 septembre 1793 permet d'arrêter tous « ceux qui, par leur conduite, leurs relations, leurs propos ou leurs écrits, se sont montrés partisans de la tyrannie ou du fédéralisme et ennemis de la liberté ». Avec le tribunal révolutionnaire, elle multiplie les arrestations d'opposants, avoués ou supposés, tandis que la levée en masse fournit des soldats contre l'ennemi extérieur. Cependant, la radicalisation n'est pas seulement répressive : elle veut aussi transformer la société et les esprits. Le calendrier républicain, adopté le 5 octobre 1793, supprime le dimanche, les fêtes religieuses et les noms de saints. Surtout, la Convention abolit l'esclavage dans les colonies le 4 février 1794 et fixe un prix maximum des aliments par la loi du maximum. La Terreur pousse donc l'égalité plus loin qu'en 1789, tout en suspendant les libertés.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie III",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Mais un régime qui arrête tous ses ennemis supposés finit par en voir partout, y compris parmi les révolutionnaires eux-mêmes.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie III",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "III. 1794 : la radicalisation se retourne contre ses auteurs\n\nA. La Terreur frappe les révolutionnaires\n– Les ennemis désignés ne sont plus seulement les royalistes. Dès l'automne 1793, les chefs girondins chassés de la Convention sont guillotinés à Paris le 31 octobre 1793, puis Olympe de Gouges, proche d'eux, le 3 novembre : la Terreur s'en prend à des républicains.\n– Même les Montagnards se divisent. Danton, chef des Indulgents qui réclament le retour à la paix intérieure, est exécuté le 5 avril 1794 : demander la fin de la Terreur devient un crime.\n\nB. La chute de Robespierre met fin à la Terreur\n– Robespierre inquiète jusqu'à la Convention. Le décret du 18 floréal an II (7 mai 1794) instaure le culte de l'Être suprême, dont les fêtes doivent faire prendre conscience au peuple qu'il est souverain, mais ses adversaires le désignent comme un « dictateur » : chaque député peut se sentir menacé.\n– Les députés s'unissent contre lui. Robespierre est arrêté le 9 thermidor et exécuté le 10 thermidor an II (28 juillet 1794), avec des sans-culottes et des Montagnards, et les exilés reviennent : la Terreur prend fin et la Révolution entre dans une phase plus modérée.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "Dès l'automne 1793, et surtout en 1794, cette radicalisation se retourne contre ceux qui l'ont conduite.\n\nLa Terreur frappe d'abord les révolutionnaires eux-mêmes. Les ennemis désignés ne sont plus seulement les royalistes : dès l'automne 1793, les chefs girondins chassés de la Convention sont guillotinés à Paris le 31 octobre, puis Olympe de Gouges, proche d'eux, le 3 novembre. Même les Montagnards se divisent. Les Indulgents, menés par Danton, réclament le retour à la paix intérieure et donc la fin de la Terreur ; Danton est exécuté le 5 avril 1794. Demander la modération devient ainsi un crime : la radicalisation ne connaît plus de limite, et chaque révolutionnaire peut à son tour devenir suspect.\n\nC'est ce qui provoque la chute de Robespierre. Le décret du 18 floréal an II (7 mai 1794) instaure le culte de l'Être suprême, un culte civique dont les fêtes doivent faire prendre conscience au peuple qu'il est souverain. Mais ses adversaires présentent désormais Robespierre comme un « dictateur », et les députés, qui craignent pour leur vie, s'unissent contre lui. Il est arrêté le 9 thermidor et exécuté le 10 thermidor an II (28 juillet 1794), avec des sans-culottes et des Montagnards. Les exilés reviennent alors en France : la Terreur prend fin. La radicalisation s'arrête donc au moment où elle menace la Convention elle-même.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Conclusion",
        seulement: "developpe",
        consigne: CONCLUSION_CONSIGNE,
        attendu:
          "Entre 1792 et 1794, la Révolution française se radicalise d'abord parce que la République naît dans la guerre et la division : la mort du roi, la coalition étrangère et la Vendée font craindre sa disparition. Pour la sauver, les Montagnards, maîtres de la Convention depuis juin 1793, installent un gouvernement d'exception qui suspend les libertés de 1789 et fait de la Terreur un moyen de gouverner, tout en poussant l'égalité plus loin, avec l'abolition de l'esclavage. Mais cette logique finit par frapper les révolutionnaires eux-mêmes, jusqu'à la chute de Robespierre, arrêté le 9 thermidor et exécuté le 10 thermidor an II (28 juillet 1794). La radicalisation s'explique donc par les menaces qui pèsent sur la République, mais elle trahit en partie les libertés qu'elle prétend défendre.\n\nAprès la Terreur, les républicains modérés veulent rendre impossibles de tels excès : la Constitution de l'an III crée le Directoire en octobre 1795, un régime qui divise le pouvoir mais reste fragile, jusqu'au coup d'État de Bonaparte en 1799.",
        criteres: CRITERES_CONCLUSION,
        points: 2,
      },
    ],
  },

  // 2. Plan thématique
  {
    id: "hg-qp-peuple",
    titre: "Question problématisée : la place du peuple dans la Révolution (1789-1799)",
    duree: "1 h 30 (DST)",
    enonce: "Sujet : Quelle place le peuple occupe-t-il dans la Révolution française (1789-1799) ?",
    question:
      "Un sujet transversal sur toute la décennie révolutionnaire : plan thématique en trois parties. Rédige l'introduction et le plan détaillé, ou toute la copie en mode développé.",
    etapes: [
      {
        titre: "Analyser le sujet",
        consigne: ANALYSE_CONSIGNE,
        attendu:
          "Mots-clés : « peuple » (l'ensemble des Français, et surtout les catégories populaires : paysans, artisans, boutiquiers, sans-culottes, par opposition aux élites), « place » (son rôle dans les événements, mais aussi ses droits : vote-t-il ? gouverne-t-il ?), « Révolution française ».\nBornes : 1789 (États généraux, prise de la Bastille) à 1799 (coup d'État de Bonaparte, qui met fin à la décennie révolutionnaire) ; la France.\nPlan : thématique, car la « place » du peuple a plusieurs aspects : I. le peuple acteur, II. le peuple souverain mais écarté du pouvoir, III. le peuple qu'on veut unir et qui se divise.",
        criteres: ["« Peuple » et « place » définis", "Bornes 1789 et 1799 justifiées", "Plan thématique justifié"],
        points: 2,
      },
      {
        titre: "Rédiger l'introduction",
        consigne: "Accroche, contexte, définitions et bornes, problématique, annonce du plan.",
        attendu:
          "« Le boulanger, la boulangère et le petit mitron ! » : c'est ce que crient les Parisiennes en ramenant de force la famille royale de Versailles à Paris, les 5 et 6 octobre 1789. Sous l'Ancien Régime, le peuple, qui forme l'essentiel du tiers état, environ 98 % de la population, paie seul les impôts et n'a aucune part au pouvoir. Le peuple désigne ici l'ensemble des Français, et surtout les catégories populaires, paysans des campagnes, artisans et boutiquiers des villes, par opposition aux élites. Entre 1789, quand s'ouvrent les États généraux, et 1799, quand le coup d'État de Bonaparte met fin à la décennie révolutionnaire, la Révolution affirme que la souveraineté appartient à la nation, mais les régimes successifs ne donnent pas tous la même place au peuple.\n\nQuelle place le peuple occupe-t-il dans la Révolution française de 1789 à 1799 ?\n\nNous verrons d'abord que le peuple est un acteur décisif de la Révolution, puis qu'il est souverain en principe mais souvent écarté du pouvoir, enfin que les révolutionnaires cherchent à l'unir alors que la Révolution le divise.",
        criteres: CRITERES_INTRO,
        points: 5,
      },
      {
        titre: "Partie I",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "I. Le peuple, acteur décisif de la Révolution\n\nA. En 1789, les insurrections populaires défendent et accélèrent la Révolution\n– Le peuple parisien défend l'Assemblée nationale. Le 14 juillet 1789, les Parisiens, qui ont faim et craignent les soldats massés autour de Paris, prennent la Bastille, prison symbole du pouvoir absolu : le peuple protège par la force la Révolution naissante.\n– Les paysans obtiennent la fin des privilèges. Pendant la Grande Peur de l'été 1789, ils pillent les châteaux et brûlent les titres seigneuriaux ; face à cette révolte, les députés abolissent les privilèges dans la nuit du 4 août 1789 : la violence populaire force les réformes.\n\nB. Le peuple fait pression sur les pouvoirs\n– Les femmes du peuple contraignent le roi. Les 5 et 6 octobre 1789, 7 000 Parisiennes marchent sur Versailles pour réclamer du pain ; le roi approuve la DDHC et la famille royale est ramenée à Paris : le roi est désormais sous la surveillance du peuple.\n– Les sans-culottes font basculer la Convention. Le 2 juin 1793, avec la Garde nationale, ils entourent l'Assemblée et obtiennent l'arrestation des chefs girondins : le peuple de Paris décide de l'issue des conflits politiques au profit des Montagnards.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "Tout au long de la décennie révolutionnaire, le peuple est d'abord un acteur décisif de la Révolution : ses interventions font avancer les événements.\n\nDès 1789, les insurrections populaires défendent et accélèrent la Révolution. Le 14 juillet 1789, alors que des soldats sont massés autour de Paris et que le pain manque après l'hiver 1788, les Parisiens prennent la Bastille, une prison qui symbolise le pouvoir absolu du roi. Par cette insurrection armée, le peuple protège l'Assemblée nationale proclamée quelques semaines plus tôt. Dans les campagnes, pendant la Grande Peur de l'été 1789, les paysans pillent les châteaux et brûlent les titres seigneuriaux où sont notés les privilèges. Face à cette révolte, les députés de la noblesse et du clergé acceptent l'abolition des privilèges dans la nuit du 4 août 1789. La violence populaire a donc imposé une réforme qui met fin à la société d'ordres.\n\nEnsuite, le peuple fait pression sur les pouvoirs. Les 5 et 6 octobre 1789, 7 000 Parisiennes marchent sur Versailles pour réclamer du pain. Le roi, qui tardait à approuver la DDHC, l'approuve enfin, et la famille royale est ramenée de force à Paris. Le roi se trouve désormais sous la surveillance du peuple parisien, et les femmes, pourtant privées de droits politiques, ont pesé sur le cours de la Révolution. Le peuple intervient encore en 1793 : le 2 juin, la Garde nationale et les sans-culottes, révolutionnaires issus des milieux populaires de Paris, entourent la Convention et obtiennent l'arrestation des chefs girondins. Cette journée fait basculer le pouvoir vers les Montagnards : le peuple de Paris décide de l'issue des conflits politiques.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie II",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Acteur décisif des grandes journées révolutionnaires, le peuple obtient-il pour autant le pouvoir ? Les révolutionnaires le proclament souverain, mais l'écartent souvent du vote.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie II",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "II. Un peuple souverain en principe, mais souvent écarté du pouvoir\n\nA. Une souveraineté exercée par des représentants élus par les plus riches\n– Le principe du pouvoir change. La DDHC du 26 août 1789 affirme que « la souveraineté réside essentiellement dans la nation » : le pouvoir ne vient plus de Dieu et du roi, mais des citoyens.\n– Mais la Constitution de septembre 1791 réserve le vote aux citoyens qui paient un impôt, le cens, âgés d'au moins 25 ans : le suffrage censitaire exclut les plus pauvres, ceux-là mêmes qui ont pris la Bastille.\n\nB. Un suffrage universel promis puis abandonné\n– La Convention est élue en septembre 1792 au suffrage universel masculin, mais à deux degrés ; la Constitution de l'an I, adoptée le 24 juin 1793, prévoit le suffrage universel masculin et affirme que « le but de la société est le bonheur commun », mais elle n'est jamais appliquée à cause des guerres : la promesse reste sans effet.\n– Le Directoire, créé le 26 octobre 1795, revient à un suffrage censitaire, restreint et indirect, qui réduit environ de moitié le nombre d'électeurs, et les femmes ne votent jamais de toute la décennie : le peuple souverain reste en grande partie privé du vote.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "Pourtant, si le peuple est souverain en principe, il est souvent écarté du pouvoir réel.\n\nLa Révolution transforme d'abord le principe du pouvoir. La DDHC du 26 août 1789 affirme que « la souveraineté réside essentiellement dans la nation » : le pouvoir ne vient plus de Dieu et du roi, mais de l'ensemble des citoyens. Toutefois, le texte parle de la nation et non du peuple, et cette souveraineté s'exerce par des représentants. La Constitution de septembre 1791 le montre : elle réserve le vote aux citoyens qui paient un impôt, le cens, âgés d'au moins 25 ans. Ce suffrage censitaire exclut les plus pauvres, alors même qu'ils ont pris la Bastille et marché sur Versailles. Une partie du peuple qui a fait la Révolution n'a donc pas le droit de choisir ses députés.\n\nLe suffrage universel est ensuite promis, puis abandonné. Certes, la Convention est élue en septembre 1792 au suffrage universel masculin, mais à deux degrés. Le 24 juin 1793, la Convention adopte une Constitution qui prévoit le suffrage universel masculin et dont l'article premier affirme que « le but de la société est le bonheur commun ». Mais, à cause des guerres, elle n'est jamais appliquée. Après la Terreur, la Constitution de l'an III crée le Directoire, le 26 octobre 1795 : elle revient à un suffrage censitaire, restreint et indirect, réservé aux contribuables, qui réduit environ de moitié le nombre d'électeurs. Quant aux femmes, elles ne votent à aucun moment de la décennie. Le peuple souverain reste ainsi, en grande partie, privé du vote.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie III",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Écarté du pouvoir, le peuple reste pourtant au cœur des préoccupations des révolutionnaires, qui veulent en faire une nation unie de citoyens, alors même qu'il se déchire.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie III",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "III. Un peuple que l'on veut unir, mais que la Révolution divise\n\nA. Faire du peuple une nation de citoyens\n– Les révolutionnaires organisent des fêtes pour créer l'unité nationale. Le 14 juillet 1790, à la fête de la Fédération, les fédérés des 83 nouveaux départements assistent aux serments du roi et de La Fayette à la nation et à la Constitution : le peuple doit se sentir une seule nation.\n– Le gouvernement révolutionnaire veut gagner le peuple. La loi du maximum fixe un prix maximum des aliments, et le décret du 18 floréal an II (7 mai 1794) instaure les fêtes de l'Être suprême pour que le peuple prenne conscience qu'il est souverain : on veut éduquer le peuple autant que le représenter.\n\nB. Un peuple divisé par la Révolution\n– Une partie du peuple combat la Révolution. En mars 1793, les paysans de Vendée se soulèvent contre la levée de 300 000 hommes ; la guerre civile entre « bleus » et « blancs » dure jusqu'en 1796 et fait plus de 180 000 morts chez les royalistes et 120 000 chez les républicains : le peuple n'est pas uni derrière la Révolution.\n– Le peuple devient suspect, puis se lasse. La loi des suspects du 17 septembre 1793 permet d'arrêter tous les « ennemis de la liberté », et sous le Directoire la misère sociale revient : le régime n'a plus de soutien populaire solide, ce qui facilite le coup d'État de Bonaparte en 1799.",
        criteres: CRITERES_PARTIE,
        points: 4,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "Enfin, les révolutionnaires veulent faire du peuple une nation unie de citoyens, alors que la Révolution le divise profondément.\n\nPour créer cette unité, ils organisent des fêtes et prennent des mesures en faveur du peuple. Le 14 juillet 1790, la fête de la Fédération réunit à Paris des fédérés venus des 83 nouveaux départements : le roi prête serment à la Constitution et La Fayette jure fidélité au roi, à la nation et à la Constitution. La fête doit donner au peuple le sentiment d'appartenir à une seule nation. Sous la Terreur, le gouvernement révolutionnaire cherche aussi à gagner le peuple : la loi du maximum fixe un prix maximum des aliments, et le décret du 18 floréal an II (7 mai 1794) instaure les fêtes de l'Être suprême, qui doivent faire prendre conscience au peuple qu'il est souverain. Les révolutionnaires veulent donc éduquer et rassembler le peuple autant que le représenter.\n\nMais la Révolution divise le peuple. En mars 1793, les paysans de Vendée se soulèvent contre la levée de 300 000 hommes pour l'armée. La guerre civile entre les « bleus » républicains et les « blancs » royalistes dure jusqu'en 1796 et fait plus de 180 000 morts du côté royaliste et 120 000 du côté républicain : une partie du peuple combat la Révolution. Au même moment, la loi des suspects du 17 septembre 1793 permet d'arrêter tous ceux qui se sont montrés « ennemis de la liberté », si bien qu'une partie du peuple devient suspecte aux yeux du pouvoir. Sous le Directoire, enfin, la misère sociale revient et le régime n'a plus de soutien populaire solide, ce qui facilite le coup d'État de Bonaparte en 1799. Le peuple que l'on voulait unir sort donc de la décennie divisé et lassé.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Conclusion",
        seulement: "developpe",
        consigne: CONCLUSION_CONSIGNE,
        attendu:
          "De 1789 à 1799, le peuple occupe donc une place paradoxale dans la Révolution française. Il en est l'acteur décisif : la prise de la Bastille, la Grande Peur, la marche des femmes sur Versailles ou la journée du 2 juin 1793 font avancer la Révolution par la force. Il en devient aussi, en principe, le souverain, puisque la souveraineté appartient désormais à la nation. Pourtant, il est souvent écarté du pouvoir : le suffrage censitaire de 1791 et du Directoire exclut les plus pauvres, le suffrage universel masculin de 1793 n'est jamais appliqué et les femmes ne votent jamais. Enfin, les révolutionnaires veulent en faire une nation unie par des fêtes et un culte civique, mais la Révolution le divise profondément, jusqu'à la guerre civile en Vendée. Le peuple est ainsi le moteur de la Révolution bien plus que son maître.\n\nAprès 1799, Bonaparte consulte le peuple par des plébiscites tout en lui retirant le pouvoir réel ; il faudra attendre 1848 pour que le suffrage universel masculin direct s'impose durablement en France.",
        criteres: CRITERES_CONCLUSION,
        points: 2,
      },
    ],
  },

  // 3. Plan en deux parties qui s'opposent
  {
    id: "hg-qp-heritier-fossoyeur",
    titre: "Question problématisée : Napoléon, héritier ou fossoyeur de la Révolution ?",
    duree: "1 h 30 (DST)",
    enonce: "Sujet : Napoléon Bonaparte est-il l'héritier ou le fossoyeur de la Révolution française (1799-1804) ?",
    question:
      "Un sujet classique qui demande de peser le pour et le contre, sans les conquêtes (pas au DST). Plan en deux parties qui s'opposent, avec trois sous-parties chacune. Rédige l'introduction et le plan détaillé, ou toute la copie en mode développé.",
    etapes: [
      {
        titre: "Analyser le sujet",
        consigne: ANALYSE_CONSIGNE,
        attendu:
          "Mots-clés : « héritier » (celui qui reçoit un héritage et le conserve : ici les principes de 1789, la fin des privilèges, l'égalité devant la loi, la propriété), « fossoyeur » (celui qui enterre : celui qui met fin à la Révolution et à ses libertés), « ou » (le sujet invite à peser les deux termes et à nuancer, pas à choisir un seul camp).\nBornes : 1799 (coup d'État du 18 brumaire) à 1804 (Code civil, Empire et sacre) ; la France (les conquêtes en Europe ne sont pas au programme du DST).\nPlan : thématique en deux parties qui s'opposent : I. ce que Napoléon enterre (la liberté politique), II. ce qu'il conserve (l'égalité civile) ; la réponse se construit dans la nuance.",
        criteres: ["« Héritier » et « fossoyeur » définis", "Bornes 1799 et 1804 justifiées", "Plan en deux parties qui pèse les deux termes"],
        points: 2,
      },
      {
        titre: "Rédiger l'introduction",
        consigne: "Accroche, contexte, définitions et bornes, problématique, annonce du plan.",
        attendu:
          "Le 2 décembre 1804, à Notre-Dame de Paris, Napoléon est sacré empereur des Français par le pape, entouré de symboles qui rappellent les rois, comme le sceptre et la main de justice. Quinze ans plus tôt, la Révolution avait aboli la monarchie absolue de droit divin et la société d'ordres, et proclamé que les hommes « naissent et demeurent libres et égaux en droits ». Général des armées de la République, Napoléon Bonaparte prend le pouvoir par le coup d'État du 18 brumaire an VIII (9 novembre 1799), fonde le Consulat puis, en 1804, l'Empire, l'année même où il promulgue le Code civil. Héritier de la Révolution, il en recueillerait et en conserverait les principes ; fossoyeur, il l'enterrerait.\n\nDans quelle mesure Napoléon Bonaparte, entre 1799 et 1804, met-il fin à la Révolution tout en conservant une partie de son héritage ?\n\nNous verrons d'abord que Napoléon est le fossoyeur de la liberté politique conquise depuis 1789, puis qu'il est pourtant l'héritier de l'égalité civile, qu'il consolide.",
        criteres: CRITERES_INTRO,
        points: 5,
      },
      {
        titre: "Partie I",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "I. Le fossoyeur de la liberté politique conquise depuis 1789\n\nA. Un pouvoir pris par la force\n– Bonaparte s'empare du pouvoir avec l'armée. Le 18 brumaire an VIII (9 novembre 1799), il lance son coup d'État ; le lendemain, à Saint-Cloud, il s'impose face au Conseil des Cinq-Cents et met fin au Directoire : le pouvoir ne vient plus des élections, ce qui contredit la souveraineté nationale.\n– Le tableau du coup d'État étudié en classe le montre au centre, entouré de soldats et des députés en toge rouge : l'armée, et non le vote, fait le pouvoir.\n\nB. Un pouvoir personnel, puis héréditaire\n– La Constitution de l'an VIII (décembre 1799) donne au Premier consul les pouvoirs exécutif, militaire et diplomatique et lui fait proposer les lois ; selon l'article 42, les deux autres consuls n'ont qu'une voix consultative, « après quoi, la décision du Premier consul suffit » : la séparation des pouvoirs disparaît.\n– Consul à vie en 1802, Napoléon devient « empereur des Français » par le sénatus-consulte du 18 mai 1804, puis il est sacré par le pape le 2 décembre 1804 avec les regalia des rois (sceptre, main de justice) : le pouvoir redevient héréditaire et lié à la religion, comme sous l'Ancien Régime.\n\nC. Des conquêtes de la Révolution remises en cause\n– La presse est étroitement surveillée et de nombreux journaux sont supprimés, alors que la liberté d'expression avait fait naître des dizaines de titres dès 1789 : la liberté d'opinion est muselée.\n– La loi du 20 mai 1802 rétablit l'esclavage dans les colonies, aboli par la Convention le 4 février 1794 : l'égalité des droits recule.",
        criteres: [
          "Titre qui reprend les mots du sujet (« fossoyeur »)",
          "Trois sous-parties (la force, le pouvoir personnel, les conquêtes remises en cause)",
          "Exemples précis et datés (18 brumaire, an VIII, 1802, 1804)",
          "Chaque exemple relié à l'idée : ce que Napoléon enterre",
          "Phrases rédigées",
        ],
        points: 6,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "Entre 1799 et 1804, Napoléon Bonaparte apparaît d'abord comme le fossoyeur de la liberté politique conquise depuis 1789.\n\nIl prend en effet le pouvoir par la force. Le 18 brumaire an VIII (9 novembre 1799), il lance son coup d'État ; le lendemain, à Saint-Cloud, il s'impose avec l'aide de l'armée face au Conseil des Cinq-Cents et met fin au Directoire. Le tableau du coup d'État étudié en classe le montre au centre, entouré de soldats et des députés en toge rouge : ce n'est plus le vote des citoyens, mais l'armée, qui fait le pouvoir. Ce coup d'État contredit donc le principe de la souveraineté nationale proclamé en 1789.\n\nIl concentre ensuite le pouvoir, puis le rend héréditaire. La Constitution de l'an VIII, en décembre 1799, confie le pouvoir à trois consuls, mais le Premier consul dispose seul des pouvoirs exécutif, militaire et diplomatique et propose les lois ; selon l'article 42, les deux autres consuls n'ont qu'une voix consultative, « après quoi, la décision du Premier consul suffit ». La séparation des pouvoirs défendue par Montesquieu et par les révolutionnaires disparaît. Nommé consul à vie en 1802, Bonaparte devient « empereur des Français » par le sénatus-consulte du 18 mai 1804, puis il est sacré par le pape à Notre-Dame le 2 décembre 1804, avec le sceptre et la main de justice des rois. Le pouvoir redevient ainsi héréditaire et lié à la religion, comme sous l'Ancien Régime.\n\nEnfin, il revient sur des conquêtes de la Révolution. La presse est étroitement surveillée et de nombreux journaux sont supprimés, alors que la liberté d'expression avait fait naître des dizaines de titres dès 1789. Surtout, la loi du 20 mai 1802 rétablit l'esclavage dans les colonies, que la Convention avait aboli le 4 février 1794. Sur ces points, Napoléon enterre bien une partie de l'œuvre révolutionnaire.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Transition vers la partie II",
        consigne: "Bilan, puis annonce.",
        attendu:
          "Napoléon enterre donc la liberté politique de la Révolution ; pourtant, il ne rétablit ni les ordres ni les privilèges, et conserve une grande part de son héritage social.",
        criteres: CRITERES_TRANSITION,
        points: 1,
      },
      {
        titre: "Partie II",
        consigne: PARTIE_CONSIGNE,
        attendu:
          "II. L'héritier qui consolide l'égalité civile de 1789\n\nA. Pas de retour à l'Ancien Régime\n– Napoléon garde le vocabulaire de la Révolution. Le sénatus-consulte du 18 mai 1804 dispose que « le gouvernement de la République est confié à un empereur », et ses régimes sont approuvés par des plébiscites : il se présente comme l'élu de la nation, non comme un roi de droit divin.\n– Il rétablit la paix religieuse avec le pape par le Concordat de 1801, sans rendre au clergé ses privilèges : la société d'ordres abolie le 4 août 1789 ne revient pas.\n\nB. Le Code civil grave dans la loi les principes de 1789\n– Promulgué le 21 mars 1804, le Code civil remplace le droit coutumier, différent selon les régions, par des lois écrites et unifiées pour toute la France, et affirme l'égalité devant la loi : Napoléon achève l'œuvre voulue par les révolutionnaires.\n– Il garantit la liberté contractuelle (art. 1101) et la propriété privée (art. 544, « le droit de jouir et disposer des choses de la manière la plus absolue ») : les biens achetés pendant la Révolution sont protégés. Mais les femmes y restent juridiquement mineures : l'héritage est conservé avec ses limites.\n\nC. Un État qui récompense le mérite\n– Napoléon installe un préfet dans chaque département, une division créée par la Révolution, et ouvre les premiers lycées publics en 1802 : l'État forme ses cadres selon le talent.\n– La Légion d'honneur (1802) récompense le mérite et non la naissance, même si elle crée une nouvelle élite fidèle au régime : l'égalité de 1789 est conservée, mais mise au service de son pouvoir.",
        criteres: [
          "Titre qui reprend les mots du sujet (« héritier »)",
          "Trois sous-parties (pas de retour à l'Ancien Régime, Code civil, mérite)",
          "Articles du Code civil cités (544, 1101)",
          "Chaque exemple relié à l'idée : ce que Napoléon conserve",
          "Phrases rédigées",
        ],
        points: 6,
        developpe: {
          consigne: PARTIE_DEVELOPPE_CONSIGNE,
          attendu:
            "Pourtant, Napoléon ne rétablit pas l'Ancien Régime : il est aussi l'héritier de l'égalité civile de 1789, qu'il consolide.\n\nD'abord, il garde les principes et le vocabulaire de la Révolution. Le sénatus-consulte du 18 mai 1804 dispose que « le gouvernement de la République est confié à un empereur », et chacun de ses régimes est approuvé par un plébiscite : Napoléon se présente comme l'élu de la nation, non comme un roi de droit divin. De même, il rétablit la paix religieuse avec le pape par le Concordat de 1801, sans rendre au clergé ses privilèges. La société d'ordres abolie dans la nuit du 4 août 1789 ne revient donc pas.\n\nEnsuite, le Code civil grave dans la loi les principes de 1789. Avant la Révolution, les lois changeaient selon les régions : c'était le droit coutumier. Les révolutionnaires voulaient un code unifié, mais c'est Napoléon qui le promulgue, le 21 mars 1804. Ce Code affirme l'égalité de tous devant la loi, la liberté contractuelle, puisque l'article 1101 permet à chacun de passer des contrats quelle que soit sa naissance, et la propriété privée, définie par l'article 544 comme « le droit de jouir et disposer des choses de la manière la plus absolue ». Les biens achetés pendant la Révolution sont ainsi garantis. Cet héritage reste toutefois limité : les femmes sont juridiquement mineures, dépendantes de leur mari, et l'héritage des biens favorise les familles aisées (article 711).\n\nEnfin, Napoléon organise un État qui récompense le mérite. Il installe un préfet dans chaque département, une division créée par la Révolution, et ouvre en 1802 les premiers lycées publics pour former les futurs cadres. La même année, il crée la Légion d'honneur, qui récompense le mérite et non la naissance, même si elle forme aussi une nouvelle élite fidèle au régime. L'égalité de 1789 est donc conservée, mais mise au service de l'ordre et de son pouvoir.",
          criteres: CRITERES_PARTIE_DEVELOPPE,
        },
      },
      {
        titre: "Conclusion",
        seulement: "developpe",
        consigne: CONCLUSION_CONSIGNE,
        attendu:
          "Entre 1799 et 1804, Napoléon Bonaparte est donc à la fois le fossoyeur et l'héritier de la Révolution. Il en enterre la liberté politique : il prend le pouvoir par la force le 18 brumaire, le concentre entre ses mains, le rend héréditaire en devenant empereur, se fait sacrer par le pape, muselle la presse et rétablit l'esclavage en 1802. Mais il en conserve l'héritage social : il ne rétablit ni les ordres ni les privilèges, et le Code civil de 1804 grave dans la loi l'égalité devant la loi, la liberté des contrats et la propriété, tandis que l'État récompense désormais le mérite. Napoléon met ainsi fin à la Révolution comme période de liberté politique et d'instabilité, mais il en consolide les acquis civils, à condition qu'ils servent l'ordre et son pouvoir.\n\nCet héritage lui survit : après la fin de l'Empire en 1815, le Code civil reste en vigueur, et aujourd'hui encore certains de ses articles sont lus aux futurs époux lors des mariages en mairie.",
        criteres: CRITERES_CONCLUSION,
        points: 2,
      },
    ],
  },
];
