import type { ChapitrePublie, DefinitionCours, Probleme } from "@/lib/types";

/**
 * HGGSP · Méthode : étude critique de document(s) et dissertation. Repris des deux
 * fiches méthode du prof envoyées le 2026-11-12 (« Étude critique d'un (ou deux)
 * document(s) » et « Réussir la dissertation en HGGSP », novembre 2026). Les
 * définitions sont recopiées mot pour mot ; les exercices et problèmes s'appuient sur
 * des documents et exemples du thème 4 (information), déjà vus en cours.
 */
const matiere = { nom: "HGGSP", couleur: "#8a5a78", emoji: "🏛️" };
const dossier = "documents/hggsp";

// ———————————————————— Étude critique ————————————————————

const DEF_ETUDE_CRITIQUE: DefinitionCours[] = [
  {
    type: "definition",
    terme: "Étude critique d'un (ou deux) document(s)",
    texte:
      "Analyser un ou deux documents, souvent de natures différentes, à partir d'une consigne. Il ne s'agit ni de réciter le cours, ni de paraphraser le document : on construit une analyse organisée, appuyée sur le document et sur vos connaissances, en portant un regard critique.",
    precision: "≈ 30 min de préparation au brouillon, ≈ 85 min de rédaction au propre, ≈ 5 min de relecture : soit 2 heures d'épreuve au total.",
  },
  {
    type: "propriete",
    terme: "Ce que l'épreuve attend de vous",
    texte:
      "1. Construire une problématique à partir du sujet (titre + consigne + document).\n2. Montrer que vous comprenez le sens général du ou des documents.\n3. Sélectionner, hiérarchiser et expliciter les informations utiles.\n4. Prendre un recul critique, en vous appuyant à la fois sur le contenu du document et sur vos connaissances personnelles.",
  },
  {
    type: "methode",
    terme: "1. Lire la consigne et cerner le sujet",
    texte:
      "Repérez les mots-clés de la consigne : ils indiquent la structure attendue et servent à bâtir le plan. Respectez-les. Distinguez ce qui est dans le sujet de ce qui est hors-sujet.",
    precision: "Repère. C'est la consigne — pas le document — qui commande le plan : le plus souvent 2 ou 3 parties, correspondant aux idées à traiter dans la consigne.",
  },
  {
    type: "methode",
    terme: "2. Analyser et identifier le(s) document(s)",
    texte:
      "Lisez attentivement et annotez (surligneurs, couleurs) : repérez les arguments, les points de vue affirmés, les expressions à citer ou à discuter. Identifiez chaque document : Quoi ? Nature précise du document (article, discours, carte, caricature, affiche, tableau de données…). Qui ? Auteur (biographie si possible), commanditaire, destinataire. Quand ? Date de création et/ou de diffusion, et contexte historique. Où ? Source : l'ouvrage ou le média dans lequel le document a été publié (à souligner). Thème ? Le contenu résumé avec vos mots.",
    precision: "Terminez toujours par une réflexion sur les intentions de l'auteur : pourquoi ce document a-t-il été produit ?",
  },
  {
    type: "methode",
    terme: "3. Confronter et critiquer",
    texte:
      "Confrontez les informations du document à vos connaissances et au contexte : sont-elles exactes ? partielles ? orientées ? Demandez-vous ce que le document ne dit pas : quels aspects du sujet passe-t-il sous silence ? S'il y a deux documents : sont-ils complémentaires ou opposés ? Il faut les confronter, jamais les traiter chacun dans une partie séparée.",
  },
  {
    type: "methode",
    terme: "4. Problématiser et organiser au brouillon",
    texte:
      "Formulez la problématique : la question centrale qui organise votre réponse. Elle découle du titre et de la consigne, et laisse deviner le plan. Classez vos idées dans un tableau pour avoir une vue d'ensemble et éviter les répétitions : idée de la consigne · citation / description du document · contexte et connaissances qui l'éclairent · regard critique.",
    precision: "Une ligne par idée de la consigne (2 ou 3 au total).",
  },
  {
    type: "methode",
    terme: "5. Rédiger au propre : l'introduction",
    texte:
      "Accroche (citation, fait, chiffre) puis contextualisation. Définissez les mots-clés du sujet. Présentation complète du ou des documents : nature, auteur, date, source, destinataire, contexte — suivie d'une courte réflexion sur les intentions de l'auteur. Énoncé de la problématique, puis annonce du plan.",
    precision: "Un paragraphe.",
  },
  {
    type: "methode",
    terme: "5. Rédiger au propre : le développement",
    texte:
      "Construisez 2 ou 3 parties, à raison d'une idée par paragraphe, en réponse à la problématique. Partez du document : une courte citation (« … », l. X) ou la description d'un élément (image, carte, caricature). Éclairez-la avec des connaissances précises tirées du cours. Critiquez : intérêt et/ou limite du document pour traiter ce point. Avec deux documents, confrontez-les ici. Soignez les transitions entre les parties (sautez des lignes avant et après).",
  },
  {
    type: "methode",
    terme: "5. Rédiger au propre : la conclusion",
    texte:
      "Répondez directement à la problématique, sans recopier le plan. Bilan : intérêts et limites du ou des documents pour traiter le sujet. Ouverture éventuelle.",
    precision: "Relecture — les 5 dernières minutes. Vérifiez la langue, l'orthographe, les mots oubliés et les alinéas. Une copie aérée se lit mieux et se note mieux.",
  },
  {
    type: "propriete",
    terme: "Les pièges à éviter",
    texte:
      "La paraphrase — décrire ou reformuler le document sans l'analyser. Chaque citation doit être expliquée. L'oubli du document — réciter le cours alors que le document doit rester au cœur de l'analyse. Traiter les deux documents séparément — une partie pour l'un, une pour l'autre : il faut au contraire les confronter. Énumérer sans démontrer — le but n'est pas de lister des citations mais de prouver, de raisonner. Trop citer — une citation non analysée ne sert à rien. Un français confus — éviter le « je », le futur en histoire, l'absence d'alinéas et de sauts de lignes.",
  },
  {
    type: "methode",
    terme: "Boîte à outils : critiquer un document",
    texte:
      "Replacez le document dans son contexte de création, puis interrogez ses intérêts et ses limites face au sujet : Le document permet-il de traiter pleinement le sujet ? Quels aspects laisse-t-il de côté ? Ces oublis sont-ils volontaires ? L'auteur est-il neutre, objectif ou subjectif ? Quels sont son point de vue, ses intérêts ? Le document est-il écrit avec du recul ou « à chaud » (sous le coup de l'émotion) ? Le document dit-il vrai (à confronter à vos connaissances) ? S'il déforme la réalité, pourquoi ?",
    precision: "Exemples de critiques : une opinion biaisée ; un aspect passé sous silence ; un lien entre la personnalité de l'auteur et le contexte. La critique peut aussi être positive — « l'auteur souligne justement tel aspect ».",
  },
];

/** Article 11 de la Déclaration des droits de l'homme et du citoyen (26 août 1789). */
const ARTICLE_11 =
  "« La libre communication des pensées et des opinions est un des droits les plus précieux de l'Homme : tout Citoyen peut donc parler, écrire, imprimer librement, sauf à répondre de l'abus de cette liberté dans les cas déterminés par la Loi. »\nArticle 11 de la Déclaration des droits de l'homme et du citoyen, adoptée par l'Assemblée nationale constituante le 26 août 1789.";

const PROBLEMES_ETUDE_CRITIQUE: Probleme[] = [
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

const DEF_DISSERTATION: DefinitionCours[] = [
  {
    type: "definition",
    terme: "La dissertation (ou composition)",
    texte:
      "La dissertation (ou composition) est une réponse organisée et argumentée à un sujet donné. Le sujet est en général une phrase qui contient, au moins de manière implicite, une question à laquelle vous devez répondre : la problématique. Ce n'est donc ni une récitation du cours, ni un catalogue de connaissances. C'est une démonstration : vous défendez une réponse, étape par étape, en vous appuyant sur des arguments et des exemples précis.",
  },
  {
    type: "propriete",
    terme: "Ce que le correcteur attend (texte officiel du bac)",
    texte:
      "Le candidat doit montrer qu'il sait : maîtriser des connaissances et les sélectionner : tout le cours n'a pas sa place, seulement ce qui sert le sujet ; organiser ces connaissances pour traiter le sujet précis qui est posé ; analyser et réfléchir : expliquer, relier, nuancer. La forme attendue est fixe : une introduction qui dégage les enjeux et énonce une problématique, un développement en plusieurs parties structurées, une conclusion qui répond à la problématique.",
  },
  {
    type: "propriete",
    terme: "Maîtrise de la langue",
    texte:
      "Depuis la session 2027, l'orthographe, la syntaxe, le vocabulaire et l'organisation du propos comptent dans la note globale. Une copie défaillante sur l'ensemble de ces aspects ne peut pas avoir la moyenne. Gardez 5 à 10 minutes pour vous relire.",
    precision: "À retenir : une bonne dissertation, c'est une question claire (la problématique), un chemin logique pour y répondre (le plan), et des preuves précises (les exemples).",
  },
  {
    type: "methode",
    terme: "Étape 1 : lire et décortiquer le sujet",
    texte:
      "1. Recopiez le sujet en haut de votre brouillon et entourez chaque mot important. 2. Définissez les mots-clés : que veut dire précisément chaque terme ? 3. Repérez les bornes du sujet : bornes chronologiques : de quand à quand ? Pourquoi ces dates ? Bornes spatiales : quel(s) territoire(s), à quelle(s) échelle(s) (locale, nationale, régionale, mondiale) ? Si le sujet ne donne pas de bornes, c'est à vous de les fixer et de les justifier dans l'introduction. 4. Observez la construction du sujet : les petits mots comptent.",
    precision: "Tout commence au brouillon : prévoyez 30 minutes maximum de travail préparatoire avant d'écrire la moindre ligne au propre. La moitié des mauvaises notes vient d'un sujet mal compris (hors-sujet ou sujet traité à moitié).",
  },
  {
    type: "propriete",
    terme: "La construction du sujet",
    texte:
      "« et » entre deux termes : étudier la relation entre les deux (« Médias et démocratie »). Un ordre des mots : le premier terme est le sujet central (« L'Allemagne d'Hitler » ≠ « Hitler et l'Allemagne »). Deux termes opposés : mesurer une évolution ou une tension (« Essor et déclin de l'Empire ottoman »). Une question : la problématique est déjà là, mais il faut l'approfondir (« Les frontières sont-elles des lignes de séparation ? »). « face à », « entre… et… » : analyser une confrontation ou une hésitation (« Les États face à l'enjeu de la connaissance »).",
  },
  {
    type: "methode",
    terme: "Mobiliser ses connaissances et dégager les enjeux",
    texte:
      "Au brouillon, notez en vrac tout ce que vous savez sur le sujet : notions, dates, acteurs, lieux, exemples, chiffres. Puis triez : gardez seulement ce qui répond au sujet. Demandez-vous : pourquoi ce sujet est-il intéressant ? Qu'est-ce qui pose problème ? Il y a souvent une tension, un paradoxe, une évolution ou un débat. C'est cette tension qui va devenir votre problématique.",
    precision: "Piège classique : réduire le sujet (n'en traiter qu'une partie) ou l'élargir (raconter tout le chapitre). Revenez au sujet toutes les 15 minutes.",
  },
  {
    type: "definition",
    terme: "La problématique",
    texte:
      "La problématique est la question centrale à laquelle toute votre copie va répondre. Elle est le fil conducteur : chaque partie, chaque argument doit y contribuer.",
  },
  {
    type: "propriete",
    terme: "Ce qu'est une bonne problématique",
    texte:
      "Une ou deux questions (trois au maximum), courtes et claires. Elle ne se contente pas de répéter le sujet avec un point d'interrogation : elle fait apparaître la tension, le paradoxe ou le débat repéré à l'étape 1. On ne peut pas y répondre par « oui » ou « non » sans nuance : elle appelle une démonstration. Elle est comprise par un lecteur qui n'a pas le sujet sous les yeux.",
    precision: "Astuce : écrivez trois ou quatre problématiques au brouillon, puis gardez celle qui vous permet le mieux de construire un plan en deux ou trois étapes.",
  },
  {
    type: "methode",
    terme: "Trouver la problématique : quatre pistes",
    texte:
      "1. Le paradoxe : deux réalités semblent se contredire. 2. L'évolution : quelque chose change dans le temps. 3. Le degré : dans quelle mesure une affirmation est-elle vraie ? 4. Les acteurs et les moyens : qui agit, comment, avec quels effets ?",
    precision: "« Dans quelle mesure les médias renforcent-ils la démocratie ? » ; « Par quels moyens les États cherchent-ils à contrôler l'information ? »",
  },
  {
    type: "propriete",
    terme: "Le plan : la norme",
    texte:
      "La norme : 2 parties minimum, 3 parties maximum, chacune divisée en 2 ou 3 sous-parties. Le plan est la réponse progressive à la problématique : chaque partie est une étape du raisonnement.",
  },
  {
    type: "methode",
    terme: "Choisir le type de plan",
    texte:
      "Chronologique : le sujet couvre une période assez longue avec des ruptures nettes ; chaque partie doit avoir une idée directrice, pas seulement des dates : justifiez les césures. Thématique : le sujet se décompose en aspects différents ; les thèmes doivent répondre à la problématique, pas juste « ranger » le cours. Dialectique (thèse / antithèse / dépassement) : le sujet invite à un débat (« dans quelle mesure… », « … ? ») ; à utiliser rarement : la 3e partie ne doit pas contredire la 2e, elle nuance et dépasse.",
    precision: "Astuce : le plan du cours est souvent une bonne base, mais il faut l'adapter au sujet précis posé.",
  },
  {
    type: "methode",
    terme: "Remplir le plan : arguments et exemples",
    texte:
      "Chaque sous-partie repose sur un couple argument + exemple(s) : l'argument est une idée qui répond à une partie de la problématique. Il s'écrit en une phrase. L'exemple est la preuve : un fait précis, daté, localisé, avec des acteurs. L'explication fait le lien entre l'exemple et l'argument : « cela montre que… ».",
    precision: "Pas « dans certains pays », mais « en Corée, depuis l'armistice de 1953 ».",
  },
  {
    type: "methode",
    terme: "Vérifier son plan avant de rédiger",
    texte:
      "Chaque partie a un titre-idée (une phrase qui répond à la problématique), pas un simple thème. Les parties sont équilibrées (même nombre de sous-parties, même longueur environ). Il y a une progression : on va du plus simple au plus complexe, ou du constat à l'explication puis à la nuance. Aucune partie ne répète une autre. Chaque sous-partie a au moins un exemple précis.",
    precision: "Ne rédigez pas tout le développement au brouillon : écrivez le plan détaillé (idées + exemples sous forme de mots-clés). Seule l'introduction se rédige entièrement au brouillon.",
  },
  {
    type: "methode",
    terme: "Rédiger l'introduction",
    texte:
      "L'introduction se rédige entièrement au brouillon, en un seul paragraphe d'une quinzaine de lignes environ. 1. L'accroche : capter l'attention et entrer dans le sujet (une citation, un fait d'actualité, une date ou un chiffre marquant, toujours relié au sujet). 2. La présentation du sujet : exposer le contexte, définir les mots-clés, justifier les bornes chronologiques et spatiales. 3. La problématique : une ou deux questions, issues de la tension repérée au brouillon. 4. L'annonce du plan : annoncer les parties en une ou deux phrases, sans répéter mot pour mot la problématique.",
    precision: "Erreurs à éviter : une accroche sans lien avec le sujet ; oublier de définir les termes ; une problématique absente ; annoncer le plan avec « I, II, III » ou par des titres.",
  },
  {
    type: "methode",
    terme: "Rédiger le développement",
    texte:
      "1. Une phrase d'introduction de partie qui annonce l'idée directrice. 2. Deux ou trois sous-parties, chacune dans un paragraphe qui commence par un alinéa (retrait en début de ligne). 3. Une ou deux phrases de transition à la fin de la partie : elles résument ce qui vient d'être montré et annoncent la suite.",
    precision: "Pas de titres sur la copie (ni « I. », ni « A. ») : c'est la mise en page qui montre le plan. Des phrases complètes, pas de listes à puces, pas d'abréviations (sauf sigles courants expliqués une première fois : ONU, UE…). Un schéma ou un croquis peut appuyer une partie : il est valorisé, sans être obligatoire.",
  },
  {
    type: "methode",
    terme: "Rédiger la conclusion",
    texte:
      "Elle se rédige directement au propre, à la fin du devoir : gardez-lui au moins 10 minutes pour ne pas la bâcler. Elle tient en deux paragraphes. 1. Le bilan : résumez les conclusions de chaque partie (une phrase par partie) et formulez clairement votre réponse à la problématique. Pas d'exemple nouveau ici. 2. L'ouverture : élargissez la réflexion vers une question proche, sous un angle spatial (un autre espace), chronologique (une autre période, ou les perspectives d'avenir) ou thématique (un autre thème du programme).",
    precision: "Erreurs à éviter : une conclusion qui recopie l'introduction ; une ouverture sans lien avec le sujet ou trop vague (« l'avenir nous le dira ») ; oublier de répondre à la problématique.",
  },
];

const PROBLEMES_DISSERTATION: Probleme[] = [
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

export const HGGSP_METHODE: ChapitrePublie[] = [
  {
    id: "hggsp-1re-methode-etude-critique",
    version: 1,
    matiere,
    titre: "Méthode · Étude critique de document(s)",
    documents: [
      {
        titre: "Fiche méthode · Étude critique d'un (ou deux) document(s)",
        fichier: `${dossier}/methode-etude-critique.pdf`,
        detail: "Fiche du prof · 5 pages",
      },
    ],
    definitions: DEF_ETUDE_CRITIQUE,
    problemes: PROBLEMES_ETUDE_CRITIQUE,
    flashcards: [
      { recto: "Étude critique : durée et répartition", verso: "2 heures : ≈ 30 min de préparation au brouillon, ≈ 85 min de rédaction au propre, ≈ 5 min de relecture." },
      { recto: "Ce que l'étude critique n'est pas", verso: "Ni réciter le cours, ni paraphraser le document." },
      { recto: "Qui commande le plan d'une étude critique ?", verso: "La consigne, pas le document : le plus souvent 2 ou 3 parties, correspondant aux idées à traiter dans la consigne." },
      { recto: "Les 4 attentes de l'épreuve", verso: "Une problématique ; comprendre le sens général du document ; sélectionner, hiérarchiser et expliciter les informations utiles ; prendre un recul critique (document + connaissances)." },
      { recto: "Les 5 questions pour identifier un document", verso: "Quoi ? (nature) · Qui ? (auteur, commanditaire, destinataire) · Quand ? (date, contexte) · Où ? (source, à souligner) · Thème ? (avec tes mots)." },
      { recto: "Par quoi termine-t-on l'identification du document ?", verso: "Par une réflexion sur les intentions de l'auteur : pourquoi ce document a-t-il été produit ?" },
      { recto: "Que fait-on de la source dans la copie ?", verso: "On la souligne." },
      { recto: "Confronter le document : 3 questions", verso: "Ses informations sont-elles exactes, partielles, orientées ? Que ne dit-il pas ? (S'il y en a deux) sont-ils complémentaires ou opposés ?" },
      { recto: "Deux documents : la règle d'or", verso: "Les confronter dans chaque partie, jamais une partie pour chaque document." },
      { recto: "Le tableau du brouillon : ses 4 colonnes", verso: "Idée de la consigne · citation / description du document · contexte et connaissances qui l'éclairent · regard critique. Une ligne par idée (2 ou 3)." },
      { recto: "L'introduction de l'étude critique", verso: "Accroche et contexte ; définition des mots-clés ; présentation complète du document et intentions de l'auteur ; problématique ; annonce du plan." },
      { recto: "Un paragraphe de développement", verso: "Partir du document (courte citation « … », l. X, ou description) ; l'éclairer par des connaissances précises ; critiquer : intérêt et/ou limite pour ce point." },
      { recto: "La conclusion de l'étude critique", verso: "Répondre directement à la problématique, sans recopier le plan ; bilan des intérêts et limites du document ; ouverture éventuelle." },
      { recto: "Les 6 pièges à éviter", verso: "Paraphrase ; oubli du document ; traiter deux documents séparément ; énumérer sans démontrer ; trop citer ; un français confus (« je », futur en histoire, pas d'alinéas)." },
      { recto: "Les 4 questions de la boîte à outils critique", verso: "Traite-t-il pleinement le sujet ? L'auteur est-il neutre ou subjectif ? Écrit avec du recul ou « à chaud » ? Dit-il vrai (et sinon, pourquoi) ?" },
      { recto: "Une critique peut-elle être positive ?", verso: "Oui : « l'auteur souligne justement tel aspect »." },
    ],
    fiche: {
      sections: [
        {
          titre: "Le principe",
          points: [
            { t: "Analyser un ou deux documents à partir d'une consigne, avec un regard critique : ni réciter le cours, ni paraphraser.", n: 1 },
            { t: "2 h : ≈ 30 min de brouillon, ≈ 85 min au propre, ≈ 5 min de relecture.", n: 1 },
            { t: "Attendus : une problématique, le sens général du document, des informations sélectionnées et expliquées, un recul critique.", n: 2 },
            { t: "Documents souvent de natures différentes : texte, carte, caricature, affiche, tableau de données…", n: 4 },
          ],
        },
        {
          titre: "Au brouillon : 30 minutes",
          points: [
            { t: "1. La consigne commande le plan (2 ou 3 parties) : repère et respecte ses mots-clés, écarte le hors-sujet.", n: 1 },
            { t: "2. Identifie le document : Quoi ? Qui ? Quand ? Où ? (source soulignée) Thème ? Puis les intentions de l'auteur.", n: 1 },
            { t: "3. Confronte-le à tes connaissances : exact, partiel, orienté ? Ce qu'il ne dit pas ?", n: 2 },
            { t: "Annote le document en couleurs : arguments, points de vue, expressions à citer.", n: 3 },
            { t: "4. Formule la problématique (elle laisse deviner le plan) et remplis le tableau : idée · citation · connaissances · critique.", n: 2 },
            { t: "Deux documents : complémentaires ou opposés ? On les confronte dans chaque partie.", n: 2 },
          ],
        },
        {
          titre: "Au propre : 85 minutes",
          points: [
            { t: "Introduction (un paragraphe) : accroche, contexte, mots-clés définis, présentation complète du document et intentions, problématique, plan.", n: 1 },
            { t: "Développement : 2 ou 3 parties, une idée par paragraphe : citation courte → connaissances → critique.", n: 1 },
            { t: "Transitions soignées, lignes sautées avant et après chaque partie.", n: 3 },
            { t: "Conclusion : réponse directe à la problématique, bilan des intérêts et limites du document, ouverture éventuelle.", n: 2 },
            { t: "5 dernières minutes : relecture (langue, orthographe, mots oubliés, alinéas).", n: 3 },
          ],
        },
        {
          titre: "Critiquer un document",
          points: [
            { t: "Traite-t-il pleinement le sujet ? Ce qu'il laisse de côté est-il volontaire ?", n: 2 },
            { t: "Auteur neutre, objectif ou subjectif ? Son point de vue, ses intérêts ?", n: 2 },
            { t: "Écrit avec du recul ou « à chaud » ?", n: 3 },
            { t: "Dit-il vrai ? S'il déforme la réalité, pourquoi ?", n: 3 },
            { t: "Exemples de critique : opinion biaisée, aspect passé sous silence, lien entre l'auteur et le contexte ; une critique peut être positive.", n: 4 },
          ],
        },
        {
          titre: "Les pièges",
          points: [
            { t: "Paraphraser, oublier le document, traiter deux documents séparément.", n: 2 },
            { t: "Énumérer sans démontrer, trop citer sans analyser.", n: 3 },
            { t: "Écrire « je », utiliser le futur en histoire, oublier alinéas et sauts de ligne.", n: 5 },
          ],
        },
      ],
      aRetenir: [
        "La consigne commande le plan.",
        "Quoi ? Qui ? Quand ? Où ? Thème ? puis les intentions de l'auteur.",
        "Chaque paragraphe : citation courte, connaissances, critique.",
        "Deux documents : toujours confrontés, jamais séparés.",
      ],
    },
    exercices: [
      { question: "Dans une étude critique, qu'est-ce qui commande le plan ?", choix: ["Le document", "La consigne", "Le plan du cours", "L'ordre des lignes du texte"], bonneReponse: 1, explication: "C'est la consigne — pas le document — qui commande le plan : 2 ou 3 parties, une par idée de la consigne." },
      { question: "Combien de temps prévoir pour la préparation au brouillon ?", choix: ["10 min", "≈ 30 min", "≈ 1 h", "≈ 85 min"], bonneReponse: 1, explication: "≈ 30 min de brouillon, ≈ 85 min de rédaction, ≈ 5 min de relecture." },
      { question: "« Où ? » dans l'identification du document désigne…", choix: ["Le lieu où se passe l'action", "La source : l'ouvrage ou le média de publication", "Le pays de l'auteur", "Le destinataire"], bonneReponse: 1, explication: "« Où ? » : la source, l'ouvrage ou le média dans lequel le document a été publié, à souligner." },
      { question: "Avec deux documents, comment organiser le développement ?", choix: ["Une partie par document", "Le plus récent d'abord", "En les confrontant dans chaque partie", "En étudiant seulement le plus important"], bonneReponse: 2, explication: "Il faut les confronter, jamais les traiter chacun dans une partie séparée." },
      { question: "Lequel n'est PAS une question de la boîte à outils critique ?", choix: ["L'auteur est-il neutre ?", "Le document est-il écrit à chaud ?", "Le document est-il long ?", "Le document dit-il vrai ?"], bonneReponse: 2, explication: "La longueur ne compte pas : on interroge le sujet couvert, la neutralité, le recul et la vérité." },
      { type: "vraiFaux", affirmation: "Paraphraser le document, c'est l'analyser.", vrai: false, explication: "La paraphrase décrit ou reformule sans analyser : chaque citation doit être expliquée." },
      { type: "vraiFaux", affirmation: "Une critique de document peut être positive.", vrai: true, explication: "« L'auteur souligne justement tel aspect » est aussi une critique." },
      { type: "vraiFaux", affirmation: "On peut écrire « je pense que » dans une étude critique.", vrai: false, explication: "Parmi les pièges : éviter le « je » et le futur en histoire." },
      { type: "vraiFaux", affirmation: "La conclusion recopie l'annonce du plan.", vrai: false, explication: "On répond directement à la problématique, sans recopier le plan, puis on fait le bilan des intérêts et limites du document." },
      { type: "trou", texte: "Dans la copie, la source du document se ___.", reponses: ["souligne", "souligner"], explication: "« Où ? Source : l'ouvrage ou le média dans lequel le document a été publié (à souligner). »" },
      { type: "trou", texte: "On termine l'identification par une réflexion sur les ___ de l'auteur.", reponses: ["intentions", "intention"], explication: "Pourquoi ce document a-t-il été produit ?" },
      { type: "trou", texte: "Un document écrit sous le coup de l'émotion est écrit « à ___ ».", reponses: ["chaud"], explication: "Avec du recul ou « à chaud » : une question de la boîte à outils." },
      { type: "ordre", consigne: "Remets les étapes de l'étude critique dans l'ordre.", elements: ["Lire la consigne et cerner le sujet", "Analyser et identifier le document", "Confronter et critiquer", "Problématiser et organiser au brouillon", "Rédiger au propre", "Relire"], explication: "Les 5 étapes de la fiche, puis les 5 dernières minutes de relecture." },
      { type: "ordre", consigne: "Remets dans l'ordre les éléments de l'introduction.", elements: ["Accroche et contextualisation", "Définition des mots-clés", "Présentation du document et intentions de l'auteur", "Problématique", "Annonce du plan"], explication: "L'introduction tient en un paragraphe, dans cet ordre." },
      { type: "ordre", consigne: "Remets dans l'ordre un paragraphe de développement.", elements: ["Partir du document : courte citation", "L'éclairer par des connaissances du cours", "Critiquer : intérêt ou limite du document"], explication: "Document → connaissances → critique, une idée par paragraphe." },
      { type: "ouverte", question: "Identifie ce document : « J'accuse… ! », lettre ouverte d'Émile Zola au président de la République, parue à la une de L'Aurore le 13 janvier 1898.", corrige: "Quoi ? Une lettre ouverte, publiée comme article de presse. Qui ? Émile Zola, écrivain, s'adressant au président de la République et, à travers lui, à l'opinion. Quand ? Le 13 janvier 1898, en pleine affaire Dreyfus (condamné en 1894). Où ? __L'Aurore__ (source soulignée). Intentions : obtenir la révision du procès en dénonçant l'armée ; Zola s'engage, c'est un texte de parti pris." },
      { type: "ouverte", question: "Donne une limite d'un article de La Croix des années 1890 comme document sur l'affaire Dreyfus.", corrige: "La Croix est antidreyfusard (il se proclame en 1890 « le journal le plus antijuif de France ») : c'est un document orienté, qui ne dit rien des arguments dreyfusards. Il montre en revanche très bien l'antisémitisme d'une partie de la presse : c'est aussi son intérêt." },
      { type: "ouverte", question: "Consigne : « Montrez que ce document illustre le rôle de la presse dans l'affaire Dreyfus, puis discutez son point de vue. » Combien de parties, et lesquelles ?", corrige: "Deux parties, tirées de la consigne : I. le rôle de la presse dans l'affaire (illustration) ; II. la discussion du point de vue de l'auteur (critique)." },
    ],
  },
  {
    id: "hggsp-1re-methode-dissertation",
    version: 1,
    matiere,
    titre: "Méthode · Réussir la dissertation",
    documents: [
      {
        titre: "Fiche méthode · Réussir la dissertation en HGGSP",
        fichier: `${dossier}/methode-dissertation.pdf`,
        detail: "Fiche du prof · novembre 2026 · 9 pages",
      },
    ],
    definitions: DEF_DISSERTATION,
    problemes: PROBLEMES_DISSERTATION,
    flashcards: [
      { recto: "La dissertation, en une phrase", verso: "Une réponse organisée et argumentée à un sujet : une démonstration, ni récitation du cours, ni catalogue de connaissances." },
      { recto: "Les 3 attendus du correcteur", verso: "Maîtriser et sélectionner ses connaissances ; les organiser pour le sujet posé ; analyser et réfléchir (expliquer, relier, nuancer)." },
      { recto: "Maîtrise de la langue (session 2027)", verso: "Orthographe, syntaxe, vocabulaire et organisation comptent : une copie défaillante sur l'ensemble ne peut pas avoir la moyenne. 5 à 10 min de relecture." },
      { recto: "Temps de brouillon", verso: "30 minutes maximum avant d'écrire au propre." },
      { recto: "Les 4 gestes pour décortiquer le sujet", verso: "Recopier et entourer les mots importants ; définir les mots-clés ; repérer les bornes chronologiques et spatiales ; observer la construction du sujet." },
      { recto: "« et » entre deux termes", verso: "Étudier la relation entre les deux. Ex. « Médias et démocratie »." },
      { recto: "« face à », « entre… et… »", verso: "Analyser une confrontation ou une hésitation. Ex. « Les États face à l'enjeu de la connaissance »." },
      { recto: "Le sujet ne donne pas de bornes : que faire ?", verso: "Les fixer soi-même et les justifier dans l'introduction." },
      { recto: "Une bonne problématique", verso: "1 ou 2 questions (3 max), courtes ; elle fait apparaître une tension ; pas de réponse par oui ou non ; comprise sans le sujet sous les yeux." },
      { recto: "Les 4 pistes pour trouver la problématique", verso: "Le paradoxe · l'évolution · le degré (« dans quelle mesure… ? ») · les acteurs et les moyens." },
      { recto: "La norme du plan", verso: "2 parties minimum, 3 maximum, chacune en 2 ou 3 sous-parties." },
      { recto: "Les 3 types de plan", verso: "Chronologique (ruptures nettes) ; thématique (aspects différents) ; dialectique (débat, à utiliser rarement)." },
      { recto: "Une sous-partie", verso: "Argument (une phrase) + exemple précis (daté, localisé, avec des acteurs) + explication (« cela montre que… »)." },
      { recto: "Les 4 étapes de l'introduction", verso: "Accroche reliée au sujet ; présentation (contexte, mots-clés, bornes) ; problématique ; annonce du plan. Un paragraphe, rédigé entièrement au brouillon." },
      { recto: "Ce qu'on ne met jamais sur la copie", verso: "Des titres (ni « I. », ni « A. »), des listes à puces, des abréviations non expliquées." },
      { recto: "La conclusion", verso: "Deux paragraphes, au moins 10 min : le bilan (une phrase par partie, réponse à la problématique, pas d'exemple nouveau) puis l'ouverture (spatiale, chronologique ou thématique)." },
    ],
    fiche: {
      sections: [
        {
          titre: "Le principe",
          points: [
            { t: "Une démonstration organisée et argumentée qui répond à la problématique contenue dans le sujet.", n: 1 },
            { t: "Introduction (enjeux + problématique), développement en parties, conclusion qui répond.", n: 1 },
            { t: "Le correcteur attend : sélectionner ses connaissances, les organiser, analyser (expliquer, relier, nuancer).", n: 2 },
            { t: "Depuis 2027, la langue compte dans la note : garder 5 à 10 min de relecture.", n: 3 },
          ],
        },
        {
          titre: "Au brouillon : 30 minutes au plus",
          points: [
            { t: "Recopier le sujet, entourer les mots importants, définir les mots-clés.", n: 1 },
            { t: "Bornes chronologiques et spatiales ; à fixer et justifier si le sujet n'en donne pas.", n: 2 },
            { t: "Les petits mots : « et » = relation ; ordre des mots = sujet central ; termes opposés = évolution ou tension ; question = à approfondir ; « face à » = confrontation.", n: 2 },
            { t: "Noter en vrac ses connaissances, puis trier : ne garder que ce qui sert le sujet.", n: 3 },
            { t: "Piège : réduire ou élargir le sujet. Revenir au sujet toutes les 15 minutes.", n: 3 },
          ],
        },
        {
          titre: "La problématique",
          points: [
            { t: "La question centrale, fil conducteur de toute la copie : 1 ou 2 questions courtes.", n: 1 },
            { t: "Elle montre une tension et appelle une démonstration (pas de oui ou non).", n: 2 },
            { t: "Quatre pistes : paradoxe, évolution, degré, acteurs et moyens.", n: 2 },
            { t: "Faible : « La démocratie est-elle fragile ? » ; solide : « Comment la démocratie, régime fondé sur la liberté, peut-elle être menacée par ses propres principes ? »", n: 4 },
            { t: "Astuce : en écrire 3 ou 4 au brouillon et garder la plus féconde pour le plan.", n: 5 },
          ],
        },
        {
          titre: "Le plan",
          points: [
            { t: "2 ou 3 parties, chacune en 2 ou 3 sous-parties : une réponse progressive.", n: 1 },
            { t: "Chronologique (ruptures nettes, justifier les césures), thématique, dialectique (rarement).", n: 2 },
            { t: "Chaque sous-partie : argument + exemple précis + explication.", n: 1 },
            { t: "Vérifier : titres-idées, parties équilibrées, progression, aucune répétition, un exemple par sous-partie.", n: 3 },
            { t: "Au brouillon : le plan détaillé en mots-clés ; seule l'introduction est rédigée en entier.", n: 3 },
          ],
        },
        {
          titre: "Rédiger",
          points: [
            { t: "Introduction (un paragraphe, ≈ 15 lignes) : accroche reliée au sujet, présentation, problématique, annonce du plan.", n: 1 },
            { t: "Chaque partie : phrase d'introduction, 2 ou 3 paragraphes avec alinéa, transition.", n: 2 },
            { t: "Pas de titres ni de listes, des connecteurs logiques, le vocabulaire du cours.", n: 2 },
            { t: "Un schéma ou un croquis peut appuyer une partie : valorisé, pas obligatoire.", n: 4 },
            { t: "Conclusion (au propre, 10 min) : bilan + réponse, puis ouverture spatiale, chronologique ou thématique.", n: 1 },
            { t: "Formules : « On entend par… », « Dès lors, on peut se demander… », « Nous verrons d'abord que… puis que… enfin que… », « En définitive… ».", n: 5 },
          ],
        },
      ],
      aRetenir: [
        "Une question claire, un chemin logique, des preuves précises.",
        "30 min de brouillon au plus ; seule l'introduction y est rédigée.",
        "Argument + exemple daté et localisé + « cela montre que… ».",
        "Pas de titres sur la copie : la mise en page montre le plan.",
      ],
    },
    exercices: [
      { question: "Que demande un sujet construit avec « et » (« Médias et démocratie ») ?", choix: ["De traiter chaque terme séparément", "D'étudier la relation entre les deux", "De choisir le plus important", "Un plan chronologique"], bonneReponse: 1, explication: "« et » entre deux termes : étudier la relation entre les deux." },
      { question: "Laquelle est une problématique solide ?", choix: ["La démocratie est-elle fragile ?", "Qu'est-ce qu'une frontière ?", "Les frontières sont-elles d'abord des lignes de séparation ou des espaces d'échanges ?", "Les médias existent-ils ?"], bonneReponse: 2, explication: "Elle fait apparaître une tension et appelle une démonstration ; les autres répètent le sujet ou appellent une définition." },
      { question: "Quel type de plan utiliser rarement ?", choix: ["Chronologique", "Thématique", "Dialectique", "Aucun"], bonneReponse: 2, explication: "Dialectique, à utiliser rarement : la 3e partie ne contredit pas la 2e, elle nuance et dépasse." },
      { question: "Qu'est-ce qu'un bon exemple dans une sous-partie ?", choix: ["« Dans certains pays »", "Un fait précis, daté, localisé, avec des acteurs", "Une définition du cours", "Une citation célèbre"], bonneReponse: 1, explication: "Pas « dans certains pays », mais « en Corée, depuis l'armistice de 1953 »." },
      { question: "Que rédige-t-on entièrement au brouillon ?", choix: ["Tout le devoir", "Le développement", "L'introduction", "La conclusion"], bonneReponse: 2, explication: "Seule l'introduction se rédige entièrement au brouillon ; la conclusion se rédige directement au propre." },
      { question: "« Dans quelle mesure… ? » correspond à quelle piste de problématique ?", choix: ["Le paradoxe", "L'évolution", "Le degré", "Les acteurs"], bonneReponse: 2, explication: "Le degré : dans quelle mesure une affirmation est-elle vraie ?" },
      { type: "vraiFaux", affirmation: "On annonce le plan en écrivant « I, II, III ».", vrai: false, explication: "Erreur à éviter : annoncer le plan avec « I, II, III » ou par des titres." },
      { type: "vraiFaux", affirmation: "Dans le bilan de la conclusion, on peut ajouter un exemple nouveau.", vrai: false, explication: "Pas d'exemple nouveau dans le bilan." },
      { type: "vraiFaux", affirmation: "Si le sujet ne donne pas de bornes, on les fixe et on les justifie dans l'introduction.", vrai: true, explication: "C'est à toi de les fixer et de les justifier." },
      { type: "vraiFaux", affirmation: "Depuis la session 2027, une copie défaillante en langue sur l'ensemble des aspects peut quand même avoir la moyenne.", vrai: false, explication: "Elle ne peut pas avoir la moyenne." },
      { type: "trou", texte: "L'explication fait le lien entre l'exemple et l'argument : « cela ___ que… ».", reponses: ["montre"], explication: "Argument + exemple + explication." },
      { type: "trou", texte: "Le plan compte 2 parties minimum et ___ parties maximum.", reponses: ["3", "trois"], explication: "Chacune divisée en 2 ou 3 sous-parties." },
      { type: "trou", texte: "Une ouverture trop vague, à éviter : « l'avenir nous le ___ ».", reponses: ["dira"], explication: "L'ouverture doit être précise et liée au sujet." },
      { type: "ordre", consigne: "Remets dans l'ordre les étapes de l'introduction.", elements: ["L'accroche", "La présentation du sujet (contexte, mots-clés, bornes)", "La problématique", "L'annonce du plan"], explication: "Quatre étapes, dans cet ordre, en un paragraphe." },
      { type: "ordre", consigne: "Remets dans l'ordre la construction d'une partie.", elements: ["Phrase d'introduction de la partie", "Deux ou trois sous-parties avec alinéa", "Transition vers la partie suivante"], explication: "Le plan se voit grâce aux alinéas et aux sauts de ligne." },
      { type: "ordre", consigne: "Remets dans l'ordre le travail au brouillon.", elements: ["Décortiquer le sujet", "Mobiliser ses connaissances", "Dégager les enjeux", "Construire la problématique", "Bâtir le plan détaillé", "Rédiger l'introduction"], explication: "30 minutes au plus avant d'écrire au propre." },
      { type: "ouverte", question: "Sujet : « Les révolutions techniques de l'information, du XIXe siècle à nos jours. » Propose une problématique avec la piste de l'évolution.", corrige: "Par exemple : « Comment les révolutions techniques, de la presse de masse au numérique, ont-elles transformé la production et la diffusion de l'information ? » Elle porte sur un changement dans le temps et appelle un plan chronologique (presse, radio et télévision, internet)." },
      { type: "ouverte", question: "Transforme ce thème en titre-idée : « I. La radio et la télévision ».", corrige: "Par exemple : « I. Au XXe siècle, la radio puis la télévision font de l'information un spectacle de masse, souvent contrôlé par l'État (Radio Londres en 1940, monopole de l'ORTF). » Un titre-idée est une phrase qui répond à la problématique." },
      { type: "ouverte", question: "Écris une ouverture chronologique pour une dissertation sur la liberté de la presse en France.", corrige: "Par exemple : « Reste à savoir si cette liberté, conquise contre l'État, résistera aux plateformes numériques, qui trient désormais l'information que lisent les citoyens. » Elle prolonge le sujet vers l'avenir sans être vague." },
    ],
  },
];
