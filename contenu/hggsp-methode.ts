import type { Lecon, Probleme } from "@/lib/types";

/**
 * HGGSP · Méthode : étude critique de document(s) et dissertation, d'après les deux
 * fiches méthode du prof envoyées le 2026-11-12. Ce sont des leçons guidées de
 * l'onglet Apprendre (rangées sous « Méthodes », demandé le 2026-11-12), avec les PDF
 * du prof ; les problèmes à rédiger sont rattachés au chapitre « Thème 4 · Axe 2 »,
 * dont ils utilisent les exemples, et apparaissent dans S'exercer → Problèmes.
 */
const dossier = "documents/hggsp";

// ———————————————————— Étude critique ————————————————————


/** Article 11 de la Déclaration des droits de l'homme et du citoyen (26 août 1789). */
const ARTICLE_11 =
  "« La libre communication des pensées et des opinions est un des droits les plus précieux de l'Homme : tout Citoyen peut donc parler, écrire, imprimer librement, sauf à répondre de l'abus de cette liberté dans les cas déterminés par la Loi. »\nArticle 11 de la Déclaration des droits de l'homme et du citoyen, adoptée par l'Assemblée nationale constituante le 26 août 1789.";

export const PROBLEMES_ETUDE_CRITIQUE: Probleme[] = [
  {
    id: "hg-ec-article-11",
    titre: "Étude critique : l'article 11 de 1789",
    duree: "30 min (brouillon)",
    enonce: `Document : ${ARTICLE_11}`,
    question:
      "Consigne : montrez que ce texte fait de la liberté d'expression un droit fondamental, puis qu'il en fixe déjà les limites. Prépare ton étude critique comme au brouillon, étape par étape.",
    etapes: [
      {
        titre: "Lire la consigne",
        consigne: "Repère les mots-clés de la consigne. Combien de parties annonce-t-elle, et lesquelles ?",
        attendu:
          "Mots-clés : « liberté d'expression », « droit fondamental », « limites ». La consigne commande un plan en deux parties : I. un droit fondamental ; II. une liberté encadrée par la loi.",
        criteres: [
          "Les mots-clés relevés",
          "Deux parties, tirées de la consigne et non du document",
        ],
      },
      {
        titre: "Identifier le document",
        consigne: "Réponds à Quoi ? Qui ? Quand ? Où ? Thème ?",
        attendu:
          "Quoi ? Un article d'un texte juridique et politique, une déclaration de droits.\nQui ? L'Assemblée nationale constituante ; il s'adresse à tous les citoyens.\nQuand ? Le 26 août 1789, au début de la Révolution française, après la prise de la Bastille.\nOù ? __Déclaration des droits de l'homme et du citoyen__ (la source se souligne).\nThème ? La liberté de dire, écrire et imprimer, et ses limites fixées par la loi.",
        criteres: [
          "Nature précise (article d'une déclaration de droits)",
          "Auteur : l'Assemblée nationale constituante",
          "Date et contexte : 26 août 1789, Révolution",
          "Source nommée (et soulignée)",
          "Thème dit avec tes mots",
        ],
        points: 2,
      },
      {
        titre: "Intentions de l'auteur",
        consigne: "Pourquoi ce document a-t-il été produit ?",
        attendu:
          "Les révolutionnaires veulent rompre avec l'Ancien Régime, où l'imprimé était soumis à la censure royale : ils posent un principe universel. Mais ils veulent aussi que la loi puisse sanctionner les abus.",
        criteres: ["Rupture avec la censure de l'Ancien Régime", "Volonté de garder un cadre légal"],
      },
      {
        titre: "Problématique",
        consigne: "Formule la question centrale. Elle doit laisser deviner le plan.",
        attendu:
          "Dans quelle mesure l'article 11 fonde-t-il une liberté d'expression à la fois proclamée comme un droit essentiel et encadrée par la loi ?",
        criteres: [
          "Une vraie question, pas la consigne recopiée",
          "Elle fait apparaître la tension liberté / limites",
        ],
      },
      {
        titre: "Partie I au brouillon",
        consigne: "Pour l'idée I, remplis la ligne du tableau : citation · connaissances · regard critique.",
        attendu:
          "Citation : « un des droits les plus précieux de l'Homme » ; « parler, écrire, imprimer librement ».\nConnaissances : rupture avec la censure ; principe repris dans la Constitution de 1791, puis par la loi du 29 juillet 1881 sur la liberté de la presse.\nRegard critique : texte de principe, universel, mais écrit « à chaud », en pleine Révolution ; il ne dit rien de la réalité de l'accès à l'imprimé (beaucoup ne savent pas lire en 1789).",
        criteres: [
          "Une courte citation du document",
          "Une connaissance précise du cours (1791 ou 1881)",
          "Une critique : intérêt ou limite du document",
        ],
        points: 1.5,
      },
      {
        titre: "Partie II au brouillon",
        consigne: "Même travail pour l'idée II : les limites.",
        attendu:
          "Citation : « sauf à répondre de l'abus de cette liberté dans les cas déterminés par la Loi ».\nConnaissances : la loi de 1881 encadre la presse (diffamation, injure) ; la liberté reste fragile : censure sous Vichy, puis pendant la guerre d'Algérie malgré le statut de l'AFP de 1957.\nRegard critique : le texte ne dit pas quels sont ces « abus » : il laisse au législateur une marge qui peut servir à restreindre la liberté.",
        criteres: [
          "La citation sur les « abus »",
          "Un exemple de limite tiré du cours",
          "La critique : un texte flou sur les « cas déterminés »",
        ],
        points: 1.5,
      },
      {
        titre: "Conclusion",
        consigne: "Réponds à la problématique et fais le bilan des intérêts et limites du document.",
        attendu:
          "L'article 11 fonde la liberté d'expression comme un droit essentiel tout en la plaçant sous le contrôle de la loi. Intérêt : il pose le principe dont héritent 1791 et 1881. Limite : texte de principe, il ne montre pas comment cette liberté est appliquée, ni ses reculs ensuite.",
        criteres: [
          "Réponse directe à la problématique, sans recopier le plan",
          "Bilan : un intérêt et une limite du document",
        ],
      },
    ],
  },
  {
    id: "hg-ec-deux-documents",
    titre: "Deux documents : 1789 et 1881",
    duree: "15 min",
    enonce: `Document 1 : ${ARTICLE_11}\n\nDocument 2 : « L'imprimerie et la librairie sont libres. »\nArticle 1er de la loi du 29 juillet 1881 sur la liberté de la presse, votée sous la IIIe République.`,
    question:
      "Consigne : en confrontant les deux documents, montrez comment la liberté de la presse s'affirme en France. Prépare ton plan comme au brouillon.",
    etapes: [
      {
        titre: "Identifier les deux documents",
        consigne: "Présente chaque document en une phrase (nature, auteur, date, contexte).",
        attendu:
          "Document 1 : article d'une déclaration de droits, adoptée par l'Assemblée nationale constituante le 26 août 1789, au début de la Révolution.\nDocument 2 : article de loi, voté par le Parlement le 29 juillet 1881, sous la IIIe République, alors que la lecture se généralise (lois Ferry).",
        criteres: ["Les deux natures (déclaration / loi)", "Les deux dates et contextes"],
      },
      {
        titre: "Complémentaires ou opposés ?",
        consigne: "Les deux documents se complètent-ils ou s'opposent-ils ? Justifie.",
        attendu:
          "Ils sont complémentaires : 1789 proclame le principe et renvoie à « la Loi » ; 1881 est justement la loi qui l'applique à la presse, presque un siècle plus tard.",
        criteres: ["Complémentaires", "Le lien : 1789 renvoie à la loi, 1881 est cette loi"],
      },
      {
        titre: "Organiser sans séparer",
        consigne: "Propose un plan en deux parties qui confronte les deux documents dans chaque partie.",
        attendu:
          "I. Un principe proclamé puis garanti par la loi (doc. 1 : « droits les plus précieux » ; doc. 2 : « sont libres »).\nII. Une liberté encadrée et fragile (doc. 1 : « l'abus de cette liberté » ; doc. 2 : la loi de 1881 prévoit aussi des délits de presse ; reculs sous Vichy).",
        criteres: [
          "Les deux documents dans chaque partie",
          "Pas une partie par document",
        ],
        points: 2,
      },
    ],
  },
];

// ———————————————————— Dissertation ————————————————————


export const PROBLEMES_DISSERTATION: Probleme[] = [
  {
    id: "hg-dis-etats-information",
    titre: "Dissertation : l'État face à l'information",
    duree: "30 min (brouillon)",
    enonce:
      "Sujet : « L'État face à la liberté de l'information en France, de 1881 à nos jours. »\nTu as les connaissances du thème 4 (loi de 1881, affaire Dreyfus, Radio Londres, AFP, ORTF, fin du monopole en 1982, droits voisins en 2019).",
    question: "Prépare la dissertation au brouillon, étape par étape, comme le jour du devoir.",
    etapes: [
      {
        titre: "Décortiquer le sujet",
        consigne: "Définis les mots-clés et repère ce que demande la construction du sujet.",
        attendu:
          "État : la puissance publique (gouvernement, lois, administration). Liberté de l'information : droit de produire, diffuser et recevoir des informations sans contrôle préalable. « face à » : le sujet demande d'analyser une confrontation ou une hésitation de l'État entre garantir cette liberté et la contrôler.",
        criteres: [
          "Les mots-clés définis (État, liberté de l'information)",
          "« face à » = confrontation ou hésitation",
        ],
        points: 1.5,
      },
      {
        titre: "Bornes",
        consigne: "Justifie les bornes chronologiques et spatiales.",
        attendu:
          "1881 : la loi du 29 juillet 1881 établit la liberté de la presse sous la IIIe République. À nos jours : le numérique et les plateformes posent de nouvelles questions (droits voisins, 2019). Échelle nationale, la France, avec un regard sur l'échelle européenne (directive de 2019).",
        criteres: ["1881 justifiée par la loi sur la presse", "La fin et l'échelle justifiées"],
      },
      {
        titre: "Problématique",
        consigne: "Propose une problématique. Une piste : le paradoxe ou l'évolution.",
        attendu:
          "Comment l'État français, qui proclame la liberté de l'information depuis 1881, a-t-il oscillé entre la garantir et la contrôler ?",
        criteres: [
          "Pas une simple répétition du sujet",
          "La tension garantir / contrôler apparaît",
          "Impossible d'y répondre par oui ou non",
        ],
        points: 1.5,
      },
      {
        titre: "Type de plan",
        consigne: "Quel type de plan choisis-tu, et pourquoi ?",
        attendu:
          "Un plan chronologique : le sujet couvre une longue période avec des ruptures nettes (1940, 1944, 1982). Chaque partie aura une idée directrice, pas seulement des dates.",
        criteres: ["Un type de plan nommé", "Justifié par le sujet (ruptures nettes)"],
      },
      {
        titre: "Le plan détaillé",
        consigne: "Écris les titres-idées de tes 2 ou 3 parties.",
        attendu:
          "I. 1881-1939 : l'État garantit une liberté de la presse qui devient un contre-pouvoir (loi de 1881 ; « J'accuse… ! » de Zola en 1898).\nII. 1940-1981 : l'État reprend le contrôle de l'information (censure de Vichy et Radio Londres ; AFP créée en 1944 ; censure pendant la guerre d'Algérie ; ORTF, monopole d'État).\nIII. Depuis 1982 : l'État se fait régulateur d'un paysage ouvert (fin du monopole en 1982 ; droits voisins en 2019).",
        criteres: [
          "Des titres-idées, pas de simples thèmes",
          "Une progression logique",
          "Au moins un exemple précis par partie",
        ],
        points: 2,
      },
      {
        titre: "Une sous-partie",
        consigne: "Rédige une sous-partie : argument, exemple précis, explication.",
        attendu:
          "Argument : sous la IIIe République, la presse libre devient un contre-pouvoir face à l'État.\nExemple : le 13 janvier 1898, Zola publie « J'accuse… ! » dans L'Aurore pour dénoncer la condamnation injuste du capitaine Dreyfus.\nExplication : cela montre que la loi de 1881 permet à un journal d'accuser l'armée et le gouvernement ; Dreyfus est réhabilité en 1906.",
        criteres: [
          "Un argument en une phrase",
          "Un exemple daté, localisé, avec des acteurs",
          "Une explication « cela montre que… »",
        ],
        points: 1.5,
      },
      {
        titre: "Introduction",
        consigne: "Rédige l'accroche et l'annonce du plan (le reste de l'introduction, tu l'as déjà).",
        attendu:
          "Accroche reliée au sujet : « En 1940, depuis Londres, la radio de la France libre répète : « Les Français parlent aux Français » : la liberté d'informer passe alors par l'étranger. »\nAnnonce du plan : « Nous verrons d'abord que l'État garantit une presse libre, puis qu'il reprend le contrôle de l'information entre 1940 et 1981, enfin qu'il devient un régulateur depuis 1982. »",
        criteres: [
          "Accroche reliée au sujet, et expliquée",
          "Annonce du plan sans « I, II, III » ni titres",
        ],
      },
      {
        titre: "Conclusion",
        consigne: "Rédige le bilan et une ouverture.",
        attendu:
          "Bilan : l'État français proclame la liberté de l'information dès 1881, la restreint fortement entre 1940 et 1981, puis l'encadre en régulateur : il n'a jamais renoncé à agir sur l'information, mais ses moyens ont changé.\nOuverture (thématique) : face aux plateformes numériques et aux fausses informations, l'État peut-il encore réguler seul, sans l'Union européenne ?",
        criteres: [
          "Une réponse claire à la problématique",
          "Pas d'exemple nouveau dans le bilan",
          "Une ouverture précise, liée au sujet",
        ],
        points: 1.5,
      },
    ],
  },
  {
    id: "hg-dis-problematique",
    titre: "Atelier : améliorer une problématique",
    duree: "10 min",
    enonce:
      "Sujet : « Médias et démocratie en France depuis la fin du XIXe siècle. »\nUn élève propose comme problématique : « Les médias sont-ils importants pour la démocratie ? »",
    question: "Diagnostique cette problématique, puis réécris-la et tires-en un plan.",
    etapes: [
      {
        titre: "Diagnostic",
        consigne: "Qu'est-ce qui ne va pas dans cette problématique ?",
        attendu:
          "On peut y répondre par « oui » sans démontrer ; elle ne fait apparaître ni tension ni débat ; elle oublie les bornes (France, depuis la fin du XIXe siècle).",
        criteres: ["Réponse possible par oui ou non", "Pas de tension", "Les bornes oubliées"],
      },
      {
        titre: "Construction du sujet",
        consigne: "Que demande le « et » entre « médias » et « démocratie » ?",
        attendu: "Le « et » demande d'étudier la relation entre les deux : ce que les médias apportent à la démocratie, et ce qui peut la menacer.",
        criteres: ["Étudier la relation entre les deux termes"],
      },
      {
        titre: "Réécriture",
        consigne: "Réécris la problématique (piste du degré).",
        attendu:
          "Dans quelle mesure les médias, devenus des contre-pouvoirs depuis la fin du XIXe siècle, renforcent-ils la démocratie française, alors qu'ils peuvent aussi la fragiliser ?",
        criteres: ["Piste du degré (« dans quelle mesure »)", "Une tension, et les bornes"],
      },
      {
        titre: "Plan",
        consigne: "Propose un plan en deux ou trois parties qui répond à ta problématique.",
        attendu:
          "I. Les médias renforcent la démocratie : ils informent les citoyens et jouent un rôle de contre-pouvoir (loi de 1881, affaire Dreyfus).\nII. Mais ils peuvent la fragiliser : parti pris (La Croix antidreyfusard), contrôle par l'État (ORTF), méfiance du public (environ 2 Français sur 3, enquête de 2026).\nIII. D'où une démocratie qui cherche à les réguler (fin du monopole en 1982, droits voisins en 2019).",
        criteres: ["Des titres-idées", "Une progression", "Des exemples précis du cours"],
        points: 2,
      },
    ],
  },
];


const entrainement = {
  texte: "S'entraîner : rédige pas à pas les problèmes d'HGGSP (étude critique de l'article 11, dissertation sur l'État et l'information) et compare avec ce que ton prof attend.",
  lien: "/exercices?mode=problemes",
};

export const LECON_ETUDE_CRITIQUE: Lecon = {
  id: "hggsp-methode-etude-critique",
  methode: true,
  titre: "L'étude critique de document(s)",
  matiere: "HGGSP",
  niveau: "Première",
  duree: "15 min",
  intro:
    "La méthode de ton prof, étape par étape : analyser un ou deux documents à partir d'une consigne, sans réciter le cours ni paraphraser, en portant un regard critique. Exemple suivi : l'article 11 de la Déclaration de 1789.",
  documents: [
    { titre: "Fiche méthode · Étude critique d'un (ou deux) document(s)", fichier: `${dossier}/methode-etude-critique.pdf`, detail: "Fiche du prof · 5 pages" },
  ],
  entrainement,
  etapes: [
    {
      titre: "Ce que l'épreuve attend",
      texte: [
        "2 heures : ≈ 30 min de préparation au brouillon (analyser, problématiser, organiser), ≈ 85 min de rédaction au propre, ≈ 5 min de relecture.",
        "Quatre attentes : construire une problématique à partir du sujet (titre + consigne + document) ; montrer que tu comprends le sens général du document ; sélectionner, hiérarchiser et expliciter les informations utiles ; prendre un recul critique, en t'appuyant à la fois sur le document et sur tes connaissances.",
      ],
      question: { q: "Quelles sont les deux erreurs que l'étude critique interdit d'emblée ?", r: "Réciter le cours, et paraphraser le document." },
    },
    {
      titre: "1. Lire la consigne et cerner le sujet",
      texte: [
        "Repère les mots-clés de la consigne : ils indiquent la structure attendue et servent à bâtir le plan. Distingue ce qui est dans le sujet de ce qui est hors-sujet.",
        "C'est la consigne, pas le document, qui commande le plan : le plus souvent 2 ou 3 parties, une par idée à traiter.",
      ],
      exemple:
        "Consigne : « Montrez que ce texte fait de la liberté d'expression un droit fondamental, puis qu'il en fixe déjà les limites. » → deux parties : I. un droit fondamental ; II. une liberté encadrée par la loi.",
      question: { q: "Avec la consigne « Montrez que… puis discutez son point de vue », combien de parties fais-tu ?", r: "Deux : I. ce que le document montre ; II. la discussion (critique) de son point de vue." },
    },
    {
      titre: "2. Identifier le document",
      texte: [
        "Lis et annote (surligneurs, couleurs) : arguments, points de vue, expressions à citer ou à discuter.",
        "Puis réponds à cinq questions. Quoi ? la nature précise (article, discours, carte, caricature…). Qui ? l'auteur, le commanditaire, le destinataire. Quand ? la date et le contexte. Où ? la source, à souligner. Thème ? le contenu résumé avec tes mots.",
        "Termine toujours par les intentions de l'auteur : pourquoi ce document a-t-il été produit ?",
      ],
      exemple:
        "Article 11 : un article d'une déclaration de droits (Quoi), adoptée par l'Assemblée nationale constituante (Qui) le 26 août 1789, au début de la Révolution (Quand), dans la __Déclaration des droits de l'homme et du citoyen__ (Où). Intention : rompre avec la censure de l'Ancien Régime tout en gardant un cadre légal.",
      question: { q: "Que fait-on de la source dans la copie ?", r: "On la souligne." },
    },
    {
      titre: "3. Confronter et critiquer",
      texte: [
        "Confronte le document à tes connaissances et au contexte : ses informations sont-elles exactes, partielles, orientées ? Que passe-t-il sous silence ?",
        "Boîte à outils : traite-t-il pleinement le sujet ? L'auteur est-il neutre, objectif ou subjectif ? Écrit-il avec du recul ou « à chaud » ? Dit-il vrai, et sinon pourquoi ?",
        "Avec deux documents : sont-ils complémentaires ou opposés ? On les confronte, jamais une partie par document. Une critique peut aussi être positive : « l'auteur souligne justement… ».",
      ],
      exemple:
        "L'article 11 est un texte de principe, écrit en pleine Révolution : il ne dit pas quels sont les « abus » punis par la loi, ni qui a vraiment accès à l'imprimé en 1789.",
      question: { q: "Donne une limite de La Croix des années 1890 comme document sur l'affaire Dreyfus.", r: "C'est un journal antidreyfusard, orienté : il ne dit rien des arguments dreyfusards. Mais il montre bien l'antisémitisme d'une partie de la presse, c'est aussi son intérêt." },
    },
    {
      titre: "4. Problématiser et organiser au brouillon",
      texte: [
        "Formule la problématique : la question centrale, issue du titre et de la consigne, qui laisse deviner le plan.",
        "Range tes idées dans un tableau, une ligne par idée de la consigne : idée · citation ou description du document · contexte et connaissances qui l'éclairent · regard critique.",
      ],
      exemple:
        "Problématique : « Dans quelle mesure l'article 11 fonde-t-il une liberté d'expression à la fois proclamée comme un droit essentiel et encadrée par la loi ? »\nLigne I : « parler, écrire, imprimer librement » · Constitution de 1791, loi de 1881 · texte de principe, écrit à chaud.",
      question: { q: "Quelles sont les 4 colonnes du tableau du brouillon ?", r: "Idée de la consigne · citation / description du document · contexte et connaissances · regard critique." },
    },
    {
      titre: "5. Rédiger au propre",
      texte: [
        "Introduction (un paragraphe) : accroche et contexte, mots-clés définis, présentation complète du document et intentions de l'auteur, problématique, annonce du plan.",
        "Développement (2 ou 3 parties, une idée par paragraphe) : pars du document (courte citation « … », l. X), éclaire-le avec des connaissances précises, puis critique-le. Soigne les transitions et saute des lignes.",
        "Conclusion (un paragraphe) : réponds directement à la problématique sans recopier le plan, fais le bilan des intérêts et limites du document, ouverture éventuelle. Garde 5 minutes pour relire.",
      ],
      question: { q: "Dans quel ordre se construit un paragraphe du développement ?", r: "Citation courte du document → connaissances du cours qui l'éclairent → critique (intérêt ou limite)." },
    },
    {
      titre: "Les pièges à éviter",
      texte: [
        "La paraphrase (chaque citation doit être expliquée) ; l'oubli du document (réciter le cours) ; traiter deux documents séparément.",
        "Énumérer sans démontrer ; trop citer (une citation non analysée ne sert à rien) ; un français confus : pas de « je », pas de futur en histoire, des alinéas et des sauts de ligne.",
      ],
      question: { q: "Peut-on écrire « je pense que » dans une étude critique ?", r: "Non : la fiche demande d'éviter le « je »." },
    },
  ],
};

export const LECON_DISSERTATION: Lecon = {
  id: "hggsp-methode-dissertation",
  methode: true,
  titre: "Réussir la dissertation",
  matiere: "HGGSP",
  niveau: "Première",
  duree: "20 min",
  intro:
    "La méthode de ton prof, du brouillon à la conclusion. Une bonne dissertation, c'est une question claire (la problématique), un chemin logique pour y répondre (le plan) et des preuves précises (les exemples). Exemple suivi : « L'État face à la liberté de l'information en France, de 1881 à nos jours ».",
  documents: [
    { titre: "Fiche méthode · Réussir la dissertation en HGGSP", fichier: `${dossier}/methode-dissertation.pdf`, detail: "Fiche du prof · novembre 2026 · 9 pages" },
  ],
  entrainement,
  etapes: [
    {
      titre: "Ce qu'est une dissertation",
      texte: [
        "Une réponse organisée et argumentée à un sujet : une démonstration, ni récitation du cours ni catalogue de connaissances.",
        "Le correcteur attend que tu sélectionnes tes connaissances, que tu les organises pour le sujet posé, et que tu analyses (expliquer, relier, nuancer). Forme fixe : introduction, développement en parties, conclusion qui répond à la problématique.",
        "Depuis la session 2027, la langue compte dans la note : une copie défaillante sur l'ensemble ne peut pas avoir la moyenne. Garde 5 à 10 minutes pour relire.",
      ],
      question: { q: "Quelles sont les trois choses que doit contenir une bonne dissertation, selon la fiche ?", r: "Une question claire (la problématique), un chemin logique (le plan), des preuves précises (les exemples)." },
    },
    {
      titre: "Étape 1 · Décortiquer le sujet",
      texte: [
        "30 minutes de brouillon au plus. Recopie le sujet, entoure les mots importants, définis les mots-clés, repère les bornes chronologiques et spatiales (et justifie-les si le sujet n'en donne pas).",
        "Observe la construction : « et » = étudier la relation ; l'ordre des mots = le premier terme est le sujet central ; deux termes opposés = évolution ou tension ; une question = problématique à approfondir ; « face à », « entre… et… » = confrontation ou hésitation.",
      ],
      exemple:
        "« L'État face à la liberté de l'information… » : « face à » demande d'analyser une hésitation de l'État entre garantir cette liberté et la contrôler. Bornes : 1881, loi sur la liberté de la presse ; à nos jours, le numérique.",
      question: { q: "Que demande le « et » dans « Médias et démocratie » ?", r: "D'étudier la relation entre les deux termes." },
    },
    {
      titre: "Mobiliser ses connaissances, dégager les enjeux",
      texte: [
        "Note en vrac tout ce que tu sais (notions, dates, acteurs, lieux, exemples, chiffres), puis trie : ne garde que ce qui répond au sujet. Le plan du cours est souvent une bonne base.",
        "Demande-toi ce qui pose problème : une tension, un paradoxe, une évolution ou un débat. C'est elle qui devient la problématique.",
        "Piège classique : réduire le sujet ou l'élargir à tout le chapitre. Reviens au sujet toutes les 15 minutes.",
      ],
      question: { q: "Quels sont les deux pièges classiques face au sujet ?", r: "Le réduire (n'en traiter qu'une partie) ou l'élargir (raconter tout le chapitre)." },
    },
    {
      titre: "Étape 2 · La problématique",
      texte: [
        "C'est la question centrale à laquelle toute la copie répond. Une ou deux questions courtes, qui font apparaître la tension, auxquelles on ne peut pas répondre par oui ou non, et compréhensibles sans le sujet sous les yeux.",
        "Quatre pistes : le paradoxe, l'évolution, le degré (« dans quelle mesure… ? »), les acteurs et les moyens. Écris-en trois ou quatre au brouillon et garde la plus féconde.",
      ],
      exemple:
        "Faible : « La démocratie est-elle fragile ? » (simple répétition). Solide : « Comment la démocratie, régime fondé sur la liberté, peut-elle être menacée par ses propres principes ? »",
      question: { q: "Améliore : « Les médias sont-ils importants pour la démocratie ? »", r: "Par exemple : « Dans quelle mesure les médias, devenus des contre-pouvoirs depuis la fin du XIXe siècle, renforcent-ils la démocratie française, alors qu'ils peuvent aussi la fragiliser ? » (piste du degré, avec une tension)." },
    },
    {
      titre: "Étape 3 · Bâtir le plan",
      texte: [
        "2 parties minimum, 3 au maximum, chacune en 2 ou 3 sous-parties : chaque partie est une étape du raisonnement.",
        "Chronologique si la période est longue avec des ruptures nettes (justifie les césures) ; thématique si le sujet se décompose en aspects ; dialectique si le sujet invite au débat, à utiliser rarement.",
        "Chaque sous-partie : un argument (une phrase), un exemple précis (daté, localisé, avec des acteurs), une explication (« cela montre que… »).",
      ],
      exemple:
        "Argument : sous la IIIe République, la presse libre devient un contre-pouvoir. Exemple : le 13 janvier 1898, Zola publie « J'accuse… ! » dans L'Aurore. Explication : cela montre que la loi de 1881 permet d'accuser l'armée et le gouvernement.",
      question: { q: "Pourquoi « dans certains pays » n'est pas un bon exemple ?", r: "Ce n'est pas précis : un exemple doit être daté, localisé, avec des acteurs (« en Corée, depuis l'armistice de 1953 »)." },
    },
    {
      titre: "Vérifier le plan",
      texte: [
        "Chaque partie a un titre-idée (une phrase qui répond à la problématique), pas un simple thème. Les parties sont équilibrées, il y a une progression, aucune ne répète l'autre, chaque sous-partie a un exemple précis.",
        "Au brouillon, écris le plan détaillé en mots-clés : seule l'introduction se rédige entièrement.",
      ],
      question: { q: "Transforme le thème « I. La radio et la télévision » en titre-idée.", r: "Par exemple : « Au XXe siècle, la radio puis la télévision font de l'information un spectacle de masse, souvent contrôlé par l'État (Radio Londres en 1940, monopole de l'ORTF). »" },
    },
    {
      titre: "Étape 4 · L'introduction",
      texte: [
        "Un paragraphe d'une quinzaine de lignes, rédigé entièrement au brouillon, en quatre temps : l'accroche (citation, fait, date ou chiffre, toujours reliée au sujet) ; la présentation (contexte, mots-clés définis, bornes justifiées) ; la problématique ; l'annonce du plan.",
        "Formules : « On entend par… », « L'année… marque le début de… », « Dès lors, on peut se demander… », « Nous verrons d'abord que… puis que… enfin que… ».",
        "À éviter : une accroche sans lien, des termes non définis, une problématique absente, un plan annoncé avec « I, II, III » ou par des titres.",
      ],
      question: { q: "Dans quel ordre viennent les 4 temps de l'introduction ?", r: "Accroche → présentation du sujet → problématique → annonce du plan." },
    },
    {
      titre: "Étape 5 · Le développement",
      texte: [
        "Chaque partie : une phrase d'introduction qui annonce l'idée directrice, 2 ou 3 sous-parties en paragraphes avec alinéa, puis une ou deux phrases de transition.",
        "Pas de titres sur la copie (ni « I. », ni « A. »), des phrases complètes, pas de listes ni d'abréviations, des connecteurs logiques, le vocabulaire du cours. Un schéma peut appuyer une partie : valorisé, pas obligatoire.",
      ],
      question: { q: "Comment le correcteur voit-il ton plan, s'il n'y a pas de titres ?", r: "Grâce à la mise en page : alinéas, sauts de ligne entre les parties, phrases d'introduction et transitions." },
    },
    {
      titre: "Étape 6 · La conclusion",
      texte: [
        "Rédigée directement au propre, à la fin : garde-lui au moins 10 minutes. Deux paragraphes.",
        "Le bilan : une phrase par partie et une réponse claire à la problématique, sans exemple nouveau. L'ouverture : une question proche, sous un angle spatial, chronologique ou thématique.",
        "À éviter : recopier l'introduction, une ouverture vague (« l'avenir nous le dira »), oublier de répondre à la problématique.",
      ],
      exemple:
        "Ouverture : « Face aux plateformes numériques et aux fausses informations, l'État peut-il encore réguler seul, sans l'Union européenne ? »",
      question: { q: "Peut-on ajouter un exemple nouveau dans le bilan ?", r: "Non : le bilan résume et répond, sans exemple nouveau." },
    },
  ],
};
