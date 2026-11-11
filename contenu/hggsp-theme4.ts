import type { ChapitrePublie } from "@/lib/types";
import { DEF_HGGSP_INTRO, DEF_HGGSP_AXE1, DEF_HGGSP_AXE2 } from "./definitions";

/**
 * HGGSP Première, thème 4 : « S'informer : un regard critique sur les sources
 * et modes de communication ». Repris des fiches rédigées avec l'utilisateur
 * le 2026-11-09 à partir de ses notes de cours (documents « HGGSP Thème 4 —
 * Fiches courtes » et « Fiches complètes »). Les points `n` 1 et 2
 * correspondent aux fiches courtes, 3 à 5 aux fiches complètes.
 */
const matiere = { nom: "HGGSP", couleur: "#8a5a78", emoji: "🏛️" };

export const HGGSP_THEME_4: ChapitrePublie[] = [
  {
    id: "hggsp-1re-t4-intro",
    version: 3,
    definitions: DEF_HGGSP_INTRO,
    matiere,
    titre: "Thème 4 · Introduction : s'informer",
    flashcards: [
      {
        recto: "Information",
        verso:
          "Nouvelle d'actualité vérifiée, puis hiérarchisée, mise en forme et portée à la connaissance du public.",
      },
      {
        recto: "Communication",
        verso:
          "Production de messages destinés à promouvoir un intérêt particulier (commercial, politique ou institutionnel). À distinguer de l'information.",
      },
      {
        recto: "Média",
        verso:
          "Couple formé par un support technique de diffusion (smartphone, journal papier…) et une organisation, souvent une entreprise, qui produit de l'information ou de la communication.",
      },
      {
        recto: "Infobésité",
        verso:
          "Surabondance d'informations, liée à l'hyperconnexion et à la facilité d'accès : l'individu devient incapable de traiter toute l'information.",
      },
      {
        recto: "Fatigue informationnelle",
        verso:
          "Lassitude face au flux d'infos, qui pousse certains à se couper de l'actualité.",
      },
      {
        recto: "Désinformation",
        verso: "Fausse information diffusée volontairement pour tromper.",
      },
      {
        recto: "Mésinformation",
        verso: "Fausse information relayée de bonne foi.",
      },
      {
        recto: "Pluralisme",
        verso:
          "Possibilité de s'informer auprès de sources diverses, dans toutes les directions.",
      },
      {
        recto: "Problématique du thème 4",
        verso:
          "Comment se construisent les conditions d'un accès libre et éclairé à une information fiable dans une « société de l'information » ?",
      },
      {
        recto: "L'information hier et aujourd'hui",
        verso:
          "Hier : rare, lente, verticale (des producteurs vers le public). Aujourd'hui : surabondante, immédiate, réticulaire (en réseau).",
      },
      {
        recto:
          "Pourquoi l'information est-elle la matière première de la démocratie ?",
        verso:
          "Parce que la démocratie repose sur le choix (le vote) : sans bonnes informations, pas de choix éclairé.",
      },
      {
        recto: "Économie de l'attention : quelle dérive ?",
        verso:
          "Pour capter l'attention, les médias privilégient des contenus émotionnels, spectaculaires, voire clivants : c'est une racine du sensationnalisme, qui ouvre la porte à la désinformation.",
      },
      {
        recto: "Convergence numérique",
        verso:
          "Tout passe désormais par le téléphone ; publicité, information et divertissement s'y mélangent.",
      },
      {
        recto: "Les quatre fractures dans l'accès à l'information",
        verso:
          "Générationnelle, de genre, sociale et culturelle, territoriale (zones rurales sans fibre).",
      },
      {
        recto: "Fracture générationnelle",
        verso:
          "Les plus âgés privilégient la radio et la télé (on va vers l'info) ; les jeunes passent par les réseaux sociaux (l'info vient à nous).",
      },
      {
        recto: "Part des Français qui se méfient des médias",
        verso: "Environ 2 sur 3, selon une enquête de 2026.",
      },
      {
        recto: "Réponse publique à la désinformation",
        verso:
          "La France et l'UE légifèrent et cherchent un socle de faits partagés, en respectant la liberté d'expression garantie par la Constitution.",
      },
    ],
    fiche: {
      sections: [
        {
          titre: "Problématique",
          points: [
            {
              t: "Comment se construisent les conditions d'un accès libre et éclairé à une information fiable dans une « société de l'information » ?",
              n: 1,
            },
            {
              t: "Paradoxe : on n'a jamais été aussi informé, et il n'a jamais été aussi difficile de bien s'informer.",
              n: 2,
            },
            {
              t: "Accroche : le 8 mai 2025, une fumée blanche s'élève au-dessus de la chapelle Sixtine ; en quelques minutes, le monde entier apprend l'élection du pape Léon XIV (notifications, réseaux, télévision).",
              n: 3,
            },
          ],
        },
        {
          titre: "Définitions",
          points: [
            {
              t: "Information : nouvelle d'actualité vérifiée, hiérarchisée, mise en forme et portée à la connaissance du public.",
              n: 1,
            },
            {
              t: "Communication : message destiné à promouvoir un intérêt particulier (commercial, politique, institutionnel).",
              n: 1,
            },
            {
              t: "Infobésité : surabondance d'information liée à l'hyperconnexion, impossible à traiter en entier.",
              n: 1,
            },
            {
              t: "Média : un support technique (smartphone, journal papier…) et une organisation, souvent une entreprise, qui produit de l'info ou de la communication.",
              n: 2,
            },
            {
              t: "Désinformation : fausse info diffusée volontairement. Mésinformation : fausse info relayée de bonne foi.",
              n: 3,
            },
            {
              t: "Fatigue informationnelle : lassitude face au flux d'infos, qui pousse certains à se couper de l'actualité.",
              n: 3,
            },
          ],
        },
        {
          titre: "D'hier à aujourd'hui",
          points: [
            {
              t: "Hier : info rare, lente, verticale. Aujourd'hui : info surabondante, immédiate, réticulaire (en réseau).",
              n: 1,
            },
            {
              t: "Le problème principal n'est plus le manque mais l'abondance.",
              n: 2,
            },
            {
              t: "Avant l'imprimerie, l'information circule par le bouche-à-oreille.",
              n: 4,
            },
            {
              t: "Circulation verticale : des producteurs vers le public. Circulation réticulaire : en réseau, horizontale.",
              n: 4,
            },
          ],
        },
        {
          titre: "Un enjeu démocratique",
          points: [
            {
              t: "L'information est la matière première de la démocratie : sans bonne info, pas de choix éclairé.",
              n: 1,
            },
            {
              t: "Chaque média a sa sensibilité (exemple donné en cours : France Inter, accusée de privilégier des valeurs de gauche), d'où l'importance du pluralisme.",
              n: 3,
            },
            {
              t: "Les pays où l'information est tronquée ne sont pas considérés comme démocratiques.",
              n: 4,
            },
          ],
        },
        {
          titre: "Les dérives de l'économie de l'attention",
          points: [
            {
              t: "Pour capter l'attention, les médias privilégient l'émotionnel et le spectaculaire : sensationnalisme, porte ouverte à la désinformation.",
              n: 1,
            },
            {
              t: "Notre attention est devenue un marché comme un autre.",
              n: 2,
            },
            {
              t: "Arrivée massive des IA génératives, encore peu fiables mais aux progrès rapides : deepfakes.",
              n: 2,
            },
            {
              t: "Convergence numérique : tout est sur le téléphone ; le mélange publicité, information et divertissement pose problème.",
              n: 3,
            },
            { t: "La radio résiste car la population vieillit.", n: 5 },
          ],
        },
        {
          titre: "Une population connectée, des pratiques inégales",
          points: [
            {
              t: "Fracture générationnelle : les plus âgés vont vers l'info (radio, télé) ; chez les jeunes, l'info vient à eux par les réseaux sociaux.",
              n: 2,
            },
            {
              t: "Autres fractures : de genre, sociale et culturelle (médias différents selon le milieu), territoriale (zones rurales sans fibre).",
              n: 2,
            },
            {
              t: "Chiffres du cours : environ 8 personnes sur 10 ont une connexion internet fixe et mobile ; 85 % utilisent une messagerie instantanée.",
              n: 3,
            },
            {
              t: "3 personnes sur 4 consultent chaque jour un réseau social ou une plateforme vidéo ; 44 % des enfants sont sur les réseaux sociaux avant 13 ans.",
              n: 3,
            },
            {
              t: "Fracture sociale et culturelle : un contenu au niveau de langue trop soutenu peut exclure une partie du public.",
              n: 5,
            },
          ],
        },
        {
          titre: "Défiance et réponses",
          points: [
            {
              t: "Environ 2 Français sur 3 se méfient des médias (enquête de 2026).",
              n: 2,
            },
            {
              t: "La France et l'UE légifèrent et cherchent un socle de faits partagés, en respectant la liberté d'expression (Constitution).",
              n: 2,
            },
            {
              t: "La défiance envers les médias peut toucher la démocratie elle-même.",
              n: 3,
            },
            {
              t: "On fait davantage confiance aux journalistes eux-mêmes qu'aux médias ; lien possible avec la fatigue informationnelle.",
              n: 4,
            },
            {
              t: "Bilan : il est simple de s'informer, mais périlleux ; l'abondance a remplacé la rareté.",
              n: 4,
            },
          ],
        },
      ],
      aRetenir: [
        "Information",
        "Communication",
        "Média",
        "Infobésité",
        "Pluralisme",
        "Désinformation",
        "Économie de l'attention",
      ],
    },
    exercices: [
      {
        question: "Qu'est-ce qui distingue l'information de la communication ?",
        choix: [
          "L'information est vérifiée ; la communication cherche à promouvoir un intérêt particulier",
          "L'information est gratuite ; la communication est payante",
          "L'information passe par la presse ; la communication par internet",
          "Il n'y a aucune différence",
        ],
        bonneReponse: 0,
        explication:
          "L'information est une nouvelle vérifiée, hiérarchisée et mise en forme ; la communication défend un intérêt commercial, politique ou institutionnel.",
      },
      {
        question: "Que désigne l'infobésité ?",
        choix: [
          "La diffusion volontaire de fausses informations",
          "Une surabondance d'informations qu'on ne peut plus traiter",
          "Le manque d'accès à internet dans les zones rurales",
          "La concentration des médias entre quelques entreprises",
        ],
        bonneReponse: 1,
        explication:
          "L'infobésité est liée à l'hyperconnexion : l'information est si abondante que l'individu ne peut plus tout traiter.",
      },
      {
        question:
          "Aujourd'hui, l'information est dite « réticulaire ». Qu'est-ce que cela signifie ?",
        choix: [
          "Elle descend des producteurs vers le public",
          "Elle est contrôlée par l'État",
          "Elle circule en réseau, de manière horizontale",
          "Elle est rare et lente",
        ],
        bonneReponse: 2,
        explication:
          "Hier verticale (des producteurs vers le public), l'information circule aujourd'hui en réseau.",
      },
      {
        question:
          "Quelle est la différence entre désinformation et mésinformation ?",
        choix: [
          "La désinformation est volontaire, la mésinformation est relayée de bonne foi",
          "La désinformation concerne la télévision, la mésinformation les réseaux sociaux",
          "La mésinformation est volontaire, la désinformation est involontaire",
          "Ce sont deux synonymes",
        ],
        bonneReponse: 0,
        explication:
          "Dans les deux cas l'information est fausse, mais seule la désinformation est diffusée volontairement pour tromper.",
      },
      {
        question:
          "Pourquoi dit-on que l'information est la matière première de la démocratie ?",
        choix: [
          "Parce que les journaux sont financés par l'État",
          "Parce que les élus sont d'anciens journalistes",
          "Parce que sans bonne information, on ne peut pas faire un choix éclairé",
          "Parce que le vote se fait désormais en ligne",
        ],
        bonneReponse: 2,
        explication:
          "La démocratie repose sur le choix des citoyens, qui suppose d'être correctement informé.",
      },
      {
        question:
          "Comment se manifeste la fracture générationnelle dans l'accès à l'information ?",
        choix: [
          "Les jeunes lisent surtout la presse papier",
          "Les plus âgés vont vers l'info (radio, télé) ; chez les jeunes, elle vient à eux par les réseaux",
          "Les plus âgés n'ont pas accès à la télévision",
          "Les jeunes ne s'informent plus du tout",
        ],
        bonneReponse: 1,
        explication:
          "À 60-70 ans, on va vers l'information ; les jeunes « tombent » dessus sur les réseaux sociaux.",
      },
      {
        question:
          "Selon une enquête de 2026 citée dans le cours, quelle part des Français se méfie des médias ?",
        choix: [
          "Environ 1 sur 10",
          "Environ 1 sur 3",
          "Environ 2 sur 3",
          "Presque tous",
        ],
        bonneReponse: 2,
        explication:
          "Environ deux Français sur trois se méfient des médias, une défiance qui peut toucher la démocratie elle-même.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "La mésinformation est une fausse information diffusée volontairement pour tromper.",
        vrai: false,
        explication:
          "C'est la définition de la désinformation. La mésinformation est une fausse information relayée de bonne foi.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Aujourd'hui, le principal problème de l'information est sa rareté.",
        vrai: false,
        explication:
          "C'était vrai hier. Aujourd'hui le problème est l'abondance : c'est l'infobésité.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "La France et l'Union européenne légifèrent contre la désinformation en devant respecter la liberté d'expression.",
        vrai: true,
        explication:
          "Légiférer suppose de respecter la Constitution, qui garantit la liberté d'expression.",
      },
      {
        type: "trou",
        texte:
          "La surabondance d'informations, qu'on ne peut plus traiter, s'appelle l'___.",
        reponses: ["infobésité"],
        explication:
          "L'infobésité est liée à l'hyperconnexion et à la facilité d'accès à l'information.",
      },
      {
        type: "trou",
        texte:
          "La possibilité de s'informer auprès de sources diverses s'appelle le ___.",
        reponses: ["pluralisme"],
        explication:
          "Chaque média a sa sensibilité : le pluralisme permet de s'informer dans toutes les directions.",
      },
      {
        type: "ouverte",
        question:
          "Explique pourquoi l'économie de l'attention favorise la désinformation.",
        corrige:
          "Pour capter l'attention, les médias privilégient des contenus émotionnels, spectaculaires, voire clivants. C'est une racine du sensationnalisme, qui ouvre la porte à la désinformation et à la mésinformation. Notre attention est devenue un marché.",
      },
      {
        type: "ouverte",
        question:
          "Cite les quatre fractures dans l'accès à l'information et illustre-en une.",
        corrige:
          "Générationnelle, de genre, sociale et culturelle, territoriale. Exemple : les plus âgés vont vers l'info par la radio et la télé, alors que les jeunes la reçoivent par les réseaux sociaux ; ou encore, des zones rurales n'ont pas la fibre.",
      },
    ],
  },
  {
    id: "hggsp-1re-t4-axe1",
    version: 3,
    definitions: DEF_HGGSP_AXE1,
    matiere,
    titre: "Thème 4 · Axe 1 : les révolutions techniques de l'information",
    flashcards: [
      {
        recto: "Vers 1450",
        verso:
          "Invention de l'imprimerie par Gutenberg : on multiplie les copies en baissant fortement les coûts, la lecture se démocratise.",
      },
      {
        recto: "Canards (XVIe siècle)",
        verso:
          "Feuilles qui racontent prodiges et nouvelles : ancêtres du journal, déjà tournés vers le sensationnel.",
      },
      {
        recto: "1631",
        verso:
          "La Gazette de Théophraste Renaudot, premier périodique en France.",
      },
      {
        recto: "1777",
        verso:
          "Le Journal de Paris, premier quotidien français : les publications quotidiennes apparaissent au XVIIIe siècle.",
      },
      {
        recto: "Éditorial",
        verso:
          "Texte d'opinion du rédacteur en chef ou d'un journaliste important sur l'actualité.",
      },
      {
        recto: "Ligne éditoriale",
        verso: "Orientation idéologique d'un journal, faite de choix.",
      },
      {
        recto: "Rotative",
        verso:
          "Machine du XIXe siècle qui imprime très vite : elle rend possible la presse à grand tirage.",
      },
      {
        recto: "Facteurs de la presse à grand tirage au XIXe siècle",
        verso:
          "Alphabétisation, industrialisation, urbanisation, progrès des transports.",
      },
      {
        recto: "Le Petit Journal",
        verso:
          "Quotidien populaire qui atteint le million d'exemplaires par jour vers 1890 ; Le Petit Parisien le dépasse ensuite.",
      },
      {
        recto: "Loi du 29 juillet 1881",
        verso: "Loi sur la liberté de la presse (IIIe République).",
      },
      {
        recto: "4e pouvoir",
        verso:
          "La presse comme contre-pouvoir, après le législatif, l'exécutif et le judiciaire : elle exerce une veille démocratique.",
      },
      {
        recto: "1921",
        verso: "Radio Tour Eiffel, premier émetteur public en France.",
      },
      {
        recto: "Radio Londres (1940)",
        verso:
          "« Ici Londres, les Français parlent aux Français » : la BBC donne la parole à la Résistance contre la propagande de Vichy. Puissance politique du son face à la censure.",
      },
      {
        recto: "Transistor (années 1960)",
        verso:
          "Poste de radio portatif : l'écoute devient mobile et individuelle.",
      },
      { recto: "1949", verso: "Premier journal télévisé en France." },
      {
        recto: "ORTF",
        verso:
          "Office de radiodiffusion-télévision française, créé par la loi du 27 juin 1964 et démantelé en 1974 : la télévision est alors un monopole d'État.",
      },
      {
        recto: "1982",
        verso:
          "Loi qui met fin au monopole d'État sur l'audiovisuel, sous François Mitterrand : apparition des chaînes privées.",
      },
      {
        recto: "CNN (1980)",
        verso:
          "Première chaîne d'information en continu, aux États-Unis. En France aujourd'hui : BFM TV, CNews, LCI.",
      },
      {
        recto: "Arcom",
        verso:
          "Autorité de régulation de l'audiovisuel et du numérique : elle surveille les chaînes publiques et privées.",
      },
      {
        recto: "Arpanet (1969)",
        verso:
          "Réseau lancé par l'agence américaine ARPA dans le contexte de la guerre froide : réseau distribué, non hiérarchisé, communication par paquets.",
      },
      {
        recto: "Différence entre internet et le web",
        verso:
          "Internet est l'infrastructure (câbles, fibre optique, satellites). Le web est une application qui circule dessus et permet de naviguer de page en page grâce aux liens.",
      },
      {
        recto: "World Wide Web",
        verso:
          "Inventé par des Européens, Tim Berners-Lee au CERN, en 1989. Gratuit et public.",
      },
      {
        recto: "1998",
        verso: "Fondation de Google : accès facile à la connaissance.",
      },
      {
        recto: "Web 2.0",
        verso:
          "Milieu des années 2000 : les particuliers créent eux-mêmes du contenu, le web devient participatif.",
      },
      {
        recto: "GAFAM",
        verso:
          "Google, Apple, Facebook (Meta), Amazon, Microsoft : de grandes entreprises privées qui dominent le numérique.",
      },
      {
        recto: "Bulle de filtre (enclos informationnel)",
        verso:
          "Enfermement dans les contenus que les algorithmes nous proposent, à partir des informations accumulées sur nous.",
      },
    ],
    fiche: {
      sections: [
        {
          titre: "Idée-force",
          points: [
            {
              t: "Chaque révolution technique élargit le public touché et accélère l'information.",
              n: 1,
            },
            {
              t: "Avec internet, l'information devient horizontale : tout le monde peut informer, ou prétendre informer.",
              n: 1,
            },
            {
              t: "Informer peut être synonyme d'influencer : d'où la tension entre préserver la liberté et contrôler la diffusion (axe 2).",
              n: 3,
            },
          ],
        },
        {
          titre: "Jalon 1 · L'information imprimée",
          points: [
            {
              t: "Vers 1450 : imprimerie de Gutenberg, copies multipliées et coûts en chute, démocratisation de la lecture.",
              n: 1,
            },
            {
              t: "1631 : La Gazette de Renaudot, premier périodique français.",
              n: 1,
            },
            {
              t: "XIXe siècle : la rotative permet la presse à grand tirage ; Le Petit Journal dépasse 1 million d'exemplaires par jour vers 1890.",
              n: 1,
            },
            { t: "Loi du 29 juillet 1881 sur la liberté de la presse.", n: 1 },
            {
              t: "La presse est le 4e pouvoir : elle exerce une veille démocratique.",
              n: 2,
            },
            {
              t: "XVIe siècle : les canards, feuilles à sensation, sont les ancêtres du journal.",
              n: 2,
            },
            {
              t: "XVIIIe siècle : premiers quotidiens (Journal de Paris, 1777) ; le journal prend sa forme (rubriques, date, éditorial, ligne éditoriale, publicité).",
              n: 2,
            },
            {
              t: "Facteurs du grand tirage : alphabétisation, industrialisation, urbanisation, progrès des transports.",
              n: 2,
            },
            {
              t: "Aujourd'hui l'imprimé recule (près de 90 % de la presse est lue sur écran) mais n'est pas mort : il offre une info plus développée.",
              n: 2,
            },
            {
              t: "Avant l'imprimerie, l'écrit est réservé à une infime minorité ; les textes sont recopiés par des moines copistes.",
              n: 3,
            },
            {
              t: "L'imprimé est le premier média de masse : il invente l'info comme produit périodique.",
              n: 3,
            },
            {
              t: "Sans presse libre, pas de pluralisme ; dans un régime totalitaire, la presse est dirigée par l'État, source unique.",
              n: 3,
            },
            {
              t: "Développement des caricatures et des grands reporters ; la photographie s'impose dans la presse dans les années 1920.",
              n: 4,
            },
            {
              t: "Une presse politique aux lignes revendiquées se forme (exemple : La Croix, quotidien catholique antidreyfusard).",
              n: 4,
            },
            {
              t: "Au XVIIIe siècle, plus de 90 % des Français vivent à la campagne : l'info circule peu.",
              n: 5,
            },
            {
              t: "La publicité apparaît dès le XVIIIe siècle, car un journal vit difficilement de ses seules ventes.",
              n: 5,
            },
          ],
        },
        {
          titre: "Jalon 2 · Le son et l'image",
          points: [
            {
              t: "1921 : Radio Tour Eiffel, premier émetteur public en France.",
              n: 1,
            },
            {
              t: "1940 : Radio Londres, « les Français parlent aux Français », le son contre la censure.",
              n: 1,
            },
            {
              t: "1964 : l'ORTF, la télévision est un monopole d'État ; 1982 : fin du monopole sous Mitterrand, chaînes privées.",
              n: 1,
            },
            {
              t: "1980 : CNN, première chaîne d'info en continu (en France aujourd'hui : BFM TV, CNews, LCI).",
              n: 1,
            },
            {
              t: "1949 : premier journal télévisé. 1953 : couronnement d'Élisabeth II, premier grand direct. 1969 : Apollo 11 en direct.",
              n: 2,
            },
            {
              t: "Années 1960 : le transistor rend l'écoute mobile et individuelle.",
              n: 2,
            },
            {
              t: "Limites de l'image : mise en scène, montage, survalorisation de ce qui est télégénique ; chaînes surveillées par l'Arcom.",
              n: 2,
            },
            {
              t: "Entre-deux-guerres : la radio prend de vitesse les journaux grâce au direct.",
              n: 3,
            },
            {
              t: "La télé est perçue comme un membre du foyer en plus ; elle poursuit la course à l'immédiateté.",
              n: 3,
            },
            {
              t: "La RTF est d'abord la seule chaîne ; une 2e chaîne apparaît en 1964, une 3e en 1972 ; l'ORTF est démantelé en 1974.",
              n: 4,
            },
            {
              t: "La radio concurrence la presse écrite : info à heure fixe, mais aussi musique ; elle trouve vite sa place dans les foyers.",
              n: 4,
            },
            {
              t: "« La caméra explore le temps » : émission d'histoire très appréciée dans les années 1960.",
              n: 5,
            },
          ],
        },
        {
          titre: "Jalon 3 · Internet",
          points: [
            {
              t: "1969 : Arpanet, né dans le contexte de la guerre froide, réseau distribué où les messages circulent par paquets.",
              n: 1,
            },
            {
              t: "Internet n'est pas le web : internet est l'infrastructure (câbles, fibre, satellites), le web une application qui circule dessus.",
              n: 1,
            },
            {
              t: "1989 : le World Wide Web est inventé au CERN par des Européens (Tim Berners-Lee).",
              n: 1,
            },
            {
              t: "Dérives : harcèlement, viralité, poids des GAFAM, bulles de filtre créées par les algorithmes.",
              n: 1,
            },
            {
              t: "1998 : Google. Milieu des années 2000 : web 2.0, participatif.",
              n: 2,
            },
            {
              t: "Explosion du web : d'environ 20 000 sites en 1995 à plus de 10 millions en 2000.",
              n: 2,
            },
            {
              t: "L'information est de plus en plus accessible partout et individualisée par les filtres et les algorithmes, sous le contrôle de grands acteurs privés.",
              n: 3,
            },
            {
              t: "Un réseau centralisé est vulnérable : si on touche le centre, tout tombe. D'où le réseau distribué, difficile à intercepter.",
              n: 3,
            },
            {
              t: "Début des années 1970 : liaisons avec des centres de recherche européens (Royaume-Uni, Norvège) ; il faut des normes communes, les protocoles.",
              n: 4,
            },
            {
              t: "Le web est gratuit et public : ses concepteurs avaient une utopie en tête.",
              n: 4,
            },
            {
              t: "Pour lutter contre les dérives : réglementer, voire interdire ; certains États censurent internet.",
              n: 4,
            },
            {
              t: "La participation de tous est en partie une illusion : dérapages, abus.",
              n: 5,
            },
          ],
        },
      ],
      aRetenir: [
        "Gutenberg",
        "Renaudot",
        "Loi de 1881",
        "Rotative",
        "4e pouvoir",
        "Radio Londres",
        "ORTF",
        "Arcom",
        "Arpanet",
        "Internet ≠ web",
        "GAFAM",
        "Bulle de filtre",
      ],
    },
    exercices: [
      {
        question:
          "Quelle invention, vers 1450, permet de multiplier les copies d'un texte à faible coût ?",
        choix: [
          "La rotative",
          "L'imprimerie de Gutenberg",
          "Le télégraphe",
          "La Gazette",
        ],
        bonneReponse: 1,
        explication:
          "L'imprimerie de Gutenberg, vers 1450, fait chuter les coûts et démocratise la lecture.",
      },
      {
        question: "Quel est le premier périodique français, fondé en 1631 ?",
        choix: [
          "Le Petit Journal",
          "Le Journal de Paris",
          "La Gazette de Théophraste Renaudot",
          "L'Aurore",
        ],
        bonneReponse: 2,
        explication:
          "La Gazette de Renaudot paraît en 1631 ; le premier quotidien, le Journal de Paris, date de 1777.",
      },
      {
        question: "Que garantit la loi du 29 juillet 1881 ?",
        choix: [
          "La fin du monopole d'État sur la télévision",
          "La liberté de la presse",
          "L'instruction obligatoire",
          "La rémunération des agences de presse",
        ],
        bonneReponse: 1,
        explication:
          "La loi du 29 juillet 1881, sous la IIIe République, établit la liberté de la presse.",
      },
      {
        question:
          "Quel journal atteint le million d'exemplaires par jour vers 1890 ?",
        choix: ["La Croix", "Le Figaro", "Le Petit Journal", "La Gazette"],
        bonneReponse: 2,
        explication:
          "Le Petit Journal, grâce à la rotative et à l'alphabétisation ; Le Petit Parisien le dépasse ensuite.",
      },
      {
        question: "Que montre Radio Londres en 1940 ?",
        choix: [
          "Que la radio est contrôlée par Vichy",
          "La puissance politique du son face à la censure",
          "Que la télévision remplace la presse",
          "La naissance de l'information en continu",
        ],
        bonneReponse: 1,
        explication:
          "Depuis la BBC, « les Français parlent aux Français » : la radio porte la Résistance contre la propagande de Vichy.",
      },
      {
        question:
          "En quelle année une loi met-elle fin au monopole d'État sur l'audiovisuel en France ?",
        choix: ["1949", "1964", "1974", "1982"],
        bonneReponse: 3,
        explication:
          "La loi de 1982, sous François Mitterrand, autorise les chaînes privées. 1964 est la création de l'ORTF.",
      },
      {
        question: "Quelle est la différence entre internet et le web ?",
        choix: [
          "Ce sont deux noms pour la même chose",
          "Internet est l'infrastructure, le web une application qui circule dessus",
          "Le web est l'infrastructure, internet une application",
          "Internet est européen, le web américain",
        ],
        bonneReponse: 1,
        explication:
          "Internet désigne les câbles, la fibre et les satellites ; le web est une application qui permet de naviguer de page en page.",
      },
      {
        question: "Où le World Wide Web a-t-il été inventé, en 1989 ?",
        choix: [
          "À l'agence ARPA, aux États-Unis",
          "Chez Google",
          "Au CERN, par des Européens",
          "À la BBC",
        ],
        bonneReponse: 2,
        explication:
          "Tim Berners-Lee invente le web au CERN. Arpanet, lui, est lancé par l'agence américaine ARPA en 1969.",
      },
      {
        question: "Qu'appelle-t-on une bulle de filtre ?",
        choix: [
          "Un logiciel qui bloque la publicité",
          "La censure d'internet par un État",
          "L'enfermement dans les contenus que les algorithmes nous proposent",
          "Un réseau distribué par paquets",
        ],
        bonneReponse: 2,
        explication:
          "Les algorithmes, nourris des informations accumulées sur nous, risquent de nous enfermer dans une sphère informationnelle.",
      },
      {
        question: "Quelle chaîne invente l'information en continu en 1980 ?",
        choix: ["BFM TV", "CNN", "LCI", "L'ORTF"],
        bonneReponse: 1,
        explication:
          "CNN, aux États-Unis. En France, BFM TV, CNews et LCI suivent ce modèle.",
      },
      {
        type: "ordre",
        consigne: "Remets ces repères dans l'ordre chronologique.",
        elements: [
          "Imprimerie de Gutenberg",
          "La Gazette de Renaudot",
          "Loi sur la liberté de la presse",
          "Radio Tour Eiffel",
          "Création de l'ORTF",
          "Arpanet",
          "Invention du World Wide Web",
        ],
        explication: "Vers 1450, 1631, 1881, 1921, 1964, 1969, 1989.",
      },
      {
        type: "ordre",
        consigne:
          "Remets ces moments de l'histoire de la télévision dans l'ordre.",
        elements: [
          "Premier journal télévisé en France",
          "Couronnement d'Élisabeth II en direct",
          "Alunissage d'Apollo 11 en direct",
          "CNN, première chaîne d'info en continu",
          "Fin du monopole d'État en France",
        ],
        explication: "1949, 1953, 1969, 1980, 1982.",
      },
      {
        type: "vraiFaux",
        affirmation: "Internet et le web désignent la même chose.",
        vrai: false,
        explication:
          "Internet est l'infrastructure (câbles, fibre, satellites) ; le web est une application qui circule dessus.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Le World Wide Web a été inventé aux États-Unis par l'agence ARPA.",
        vrai: false,
        explication:
          "L'agence ARPA lance Arpanet en 1969. Le web, lui, est inventé au CERN par des Européens (Tim Berners-Lee, 1989).",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Au XVIIIe siècle, les journaux comportent déjà de la publicité.",
        vrai: true,
        explication:
          "La publicité apparaît dès le XVIIIe siècle, car un journal vit difficilement de ses seules ventes.",
      },
      {
        type: "trou",
        texte:
          "Au XIXe siècle, la machine qui imprime très vite et permet la presse à grand tirage est la ___.",
        reponses: ["rotative"],
        explication:
          "La rotative, avec l'alphabétisation, l'urbanisation et les transports, démocratise la presse.",
      },
      {
        type: "trou",
        texte:
          "Les chaînes de télévision publiques et privées sont surveillées par l'___.",
        reponses: ["Arcom"],
        explication:
          "L'Arcom est l'autorité de régulation de l'audiovisuel et du numérique.",
      },
      {
        type: "trou",
        texte:
          "Dans les années 1960, le ___ rend l'écoute de la radio mobile et individuelle.",
        reponses: ["transistor"],
        explication: "Le transistor est un poste de radio portatif.",
      },
      {
        type: "ouverte",
        question:
          "Pourquoi dit-on qu'avec internet l'information devient horizontale ? Quelles dérives cela entraîne-t-il ?",
        corrige:
          "Avec le web 2.0, chacun peut produire de l'information, et non plus seulement la recevoir des médias. Dérives : harcèlement, viralité, illusion de participation, poids des GAFAM, et bulles de filtre créées par les algorithmes.",
      },
    ],
  },
  {
    id: "hggsp-1re-t4-axe2",
    version: 3,
    definitions: DEF_HGGSP_AXE2,
    matiere,
    titre: "Thème 4 · Axe 2 : liberté ou contrôle de l'information",
    flashcards: [
      {
        recto: "Idée-force de l'axe 2",
        verso:
          "Depuis l'imprimerie, tous les pouvoirs se méfient de l'information et cherchent à la contrôler ; avec la démocratie, elle se libère et devient un contre-pouvoir.",
      },
      {
        recto: "1791",
        verso:
          "La liberté d'expression est inscrite dans la Constitution française.",
      },
      {
        recto: "Contre-pouvoir",
        verso:
          "Rôle de la presse, 4e pouvoir, censée surveiller les trois premiers : législatif, exécutif, judiciaire.",
      },
      {
        recto: "Alfred Dreyfus",
        verso:
          "Capitaine français, juif et alsacien, accusé à tort d'avoir livré des documents militaires aux Allemands ; condamné en 1894 et envoyé au bagne (île du Diable) ; réhabilité en 1906.",
      },
      {
        recto: "13 janvier 1898",
        verso:
          "Émile Zola publie « J'accuse… ! » dans L'Aurore, le journal de Clemenceau : il exige que Dreyfus soit rejugé.",
      },
      {
        recto: "Antidreyfusards",
        verso:
          "Camp hostile à Dreyfus : souvent catholiques, antisémites, ils refusent de remettre en cause le jugement de l'armée.",
      },
      {
        recto: "La Croix pendant l'affaire Dreyfus",
        verso:
          "Quotidien catholique des assomptionnistes, antidreyfusard, qui se proclame en 1890 « le journal le plus antijuif de France ».",
      },
      {
        recto: "Le Figaro pendant l'affaire Dreyfus",
        verso:
          "D'abord favorable à la révision du procès, il recule pour ne pas perdre ses lecteurs : le lectorat influence la presse.",
      },
      {
        recto: "Intellectuel engagé",
        verso:
          "Figure née avec l'affaire Dreyfus : la presse permet à des intellectuels, comme Zola, de s'engager publiquement pour une cause.",
      },
      {
        recto: "Les trois formes d'antisémitisme",
        verso: "Religieux, social, racial.",
      },
      {
        recto: "Agence de presse",
        verso:
          "Entreprise qui collecte l'information, la vérifie et la vend aux autres médias : un média qui fournit les médias.",
      },
      {
        recto: "Havas : 1832 et 1835",
        verso:
          "1832 : Charles-Louis Havas crée un bureau de traduction de la presse étrangère. 1835 : il le transforme en agence de presse.",
      },
      {
        recto: "Havas et la publicité (1857)",
        verso:
          "Alliance avec une agence de publicité : les journaux deviennent dépendants d'Havas, et les industriels disposent de moyens de pression.",
      },
      {
        recto: "Pourquoi Havas disparaît-elle comme agence de presse ?",
        verso:
          "Elle s'est compromise sous Vichy en participant à la propagande. Seule son activité publicitaire continue.",
      },
      {
        recto: "AFP",
        verso:
          "Agence France-Presse, créée en août 1944 à la Libération. Le GPRF de De Gaulle en fait un établissement public, pour ne pas dépendre des agences anglo-saxonnes.",
      },
      {
        recto: "Charte d'objectivité de l'AFP",
        verso:
          "Réponse aux accusations de propagande liées au contrôle de l'État : style factuel, règle des 5W, pyramide inversée.",
      },
      {
        recto: "Règle des 5W",
        verso:
          "Who, what, where, when, why : les cinq questions auxquelles une dépêche doit répondre.",
      },
      {
        recto: "Pyramide inversée",
        verso: "Article écrit du plus important au plus accessoire.",
      },
      {
        recto: "1957 (AFP)",
        verso:
          "Statut d'indépendance : les médias clients participent à sa gouvernance. Elle reste pourtant contrôlée, voire censurée, par exemple pendant la guerre d'Algérie.",
      },
      {
        recto: "Droits voisins",
        verso:
          "Droit des éditeurs et agences de presse d'être rémunérés quand les plateformes (Google, Meta) reprennent leurs contenus.",
      },
      {
        recto: "Loi du 24 juillet 2019",
        verso:
          "La France est le premier pays de l'UE à transposer la directive européenne de 2019 sur les droits voisins.",
      },
    ],
    fiche: {
      sections: [
        {
          titre: "Idée-force",
          points: [
            {
              t: "Depuis l'imprimerie, tous les pouvoirs se méfient de l'information et cherchent à la contrôler.",
              n: 1,
            },
            {
              t: "Avec la démocratie, elle se libère et devient un contre-pouvoir, le 4e pouvoir, qui surveille le législatif, l'exécutif et le judiciaire.",
              n: 1,
            },
            {
              t: "1791 : la liberté d'expression est inscrite dans la Constitution française.",
              n: 3,
            },
            {
              t: "Les gouvernements, notamment les monarchies, tentent très tôt de contrôler et de censurer l'information diffusée.",
              n: 4,
            },
          ],
        },
        {
          titre: "Jalon 1 · L'affaire Dreyfus et la presse (1894-1906)",
          points: [
            {
              t: "Alfred Dreyfus, capitaine juif alsacien, est accusé à tort d'espionnage pour l'Allemagne et condamné au bagne en 1894.",
              n: 1,
            },
            {
              t: "13 janvier 1898 : « J'accuse… ! » de Zola dans L'Aurore, naissance de l'intellectuel engagé.",
              n: 1,
            },
            {
              t: "La presse polarise l'opinion : dreyfusards contre antidreyfusards.",
              n: 1,
            },
            { t: "Dreyfus est réhabilité en 1906.", n: 1 },
            {
              t: "Contexte : liberté de la presse (1881) et instruction obligatoire (lois Ferry), la lecture se généralise.",
              n: 2,
            },
            {
              t: "Le lectorat influence la presse : Le Figaro recule sur son soutien à la révision pour ne pas perdre ses lecteurs.",
              n: 2,
            },
            {
              t: "La Croix, quotidien catholique, se proclame « le journal le plus antijuif de France ».",
              n: 2,
            },
            {
              t: "Trois formes d'antisémitisme : religieux, social, racial.",
              n: 2,
            },
            {
              t: "Les antidreyfusards, souvent catholiques, estiment qu'on ne remet pas en cause le jugement de l'armée.",
              n: 3,
            },
            {
              t: "Zola écrit au président de la République, condamne l'antisémitisme et exige que Dreyfus soit rejugé.",
              n: 3,
            },
            {
              t: "Les médias sont soumis à des contraintes économiques ; le service public existe en partie parce qu'il ne cherche pas la rentabilité.",
              n: 3,
            },
            {
              t: "Dreyfus est envoyé à l'île du Diable ; alsacien, il parle allemand, ce qui nourrit les soupçons.",
              n: 5,
            },
            {
              t: "L'Aurore est le journal de Clemenceau ; La Croix appartient aux assomptionnistes.",
              n: 5,
            },
          ],
        },
        {
          titre: "Jalon 2 · Havas et l'AFP, entre le marché et l'État",
          points: [
            {
              t: "Une agence de presse collecte, vérifie et vend l'information aux médias.",
              n: 1,
            },
            {
              t: "Havas : bureau de traduction (1832), puis agence de presse (1835) ; elle mêle information et publicité dès 1857.",
              n: 1,
            },
            {
              t: "Compromise dans la propagande de Vichy, Havas disparaît comme agence de presse.",
              n: 1,
            },
            {
              t: "AFP : créée en août 1944, reprise en main par le GPRF de De Gaulle pour ne pas dépendre des agences anglo-saxonnes.",
              n: 1,
            },
            {
              t: "Accusée de propagande, l'AFP adopte une charte d'objectivité : style factuel, 5W, pyramide inversée.",
              n: 2,
            },
            {
              t: "1957 : statut d'indépendance, mais la censure reste possible (guerre d'Algérie).",
              n: 2,
            },
            {
              t: "Aujourd'hui, l'AFP mène un important travail de vérification (fact-checking).",
              n: 2,
            },
            {
              t: "Les agences emploient des journalistes de terrain, car tous les journaux n'ont pas les moyens de couvrir le monde entier.",
              n: 3,
            },
            {
              t: "Havas cherche les scoops en premier : pigeons voyageurs, puis télégraphe et téléphone.",
              n: 3,
            },
            {
              t: "Avec la publicité, les journaux deviennent dépendants d'Havas et les industriels disposent de moyens de pression.",
              n: 3,
            },
            {
              t: "L'objectivité de l'AFP devient un argument commercial.",
              n: 4,
            },
            {
              t: "Havas s'associe à d'autres agences (Reuters, Associated Press) et se lie à l'État dès la Première Guerre mondiale (propagande).",
              n: 4,
            },
            {
              t: "En 1957, les médias clients entrent dans la gouvernance de l'AFP.",
              n: 5,
            },
          ],
        },
        {
          titre: "Aujourd'hui",
          points: [
            {
              t: "Droits voisins : les plateformes doivent rémunérer la presse dont elles utilisent les contenus (directive européenne et loi française du 24 juillet 2019).",
              n: 1,
            },
            {
              t: "Tension permanente : préserver la liberté ou contrôler la diffusion (désinformation, deepfakes).",
              n: 2,
            },
            {
              t: "La France est le premier pays de l'UE à transposer la directive sur les droits voisins.",
              n: 4,
            },
          ],
        },
      ],
      aRetenir: [
        "Contre-pouvoir",
        "Dreyfus",
        "Zola",
        "Intellectuel engagé",
        "Havas",
        "AFP",
        "5W",
        "Pyramide inversée",
        "Droits voisins",
      ],
    },
    exercices: [
      {
        question:
          "Qui publie « J'accuse… ! » le 13 janvier 1898, et dans quel journal ?",
        choix: [
          "Clemenceau, dans Le Figaro",
          "Émile Zola, dans L'Aurore",
          "Émile Zola, dans La Croix",
          "Alfred Dreyfus, dans Le Petit Journal",
        ],
        bonneReponse: 1,
        explication:
          "Zola publie sa lettre ouverte au président de la République dans L'Aurore, le journal de Clemenceau.",
      },
      {
        question: "Que montre l'attitude du Figaro pendant l'affaire Dreyfus ?",
        choix: [
          "Que la presse est contrôlée par l'armée",
          "Que le lectorat influence la presse",
          "Que les journaux sont tous antidreyfusards",
          "Que la censure est rétablie en 1898",
        ],
        bonneReponse: 1,
        explication:
          "D'abord favorable à la révision, Le Figaro recule pour ne pas perdre ses lecteurs : les médias subissent des contraintes économiques.",
      },
      {
        question: "Quelle figure naît avec l'affaire Dreyfus ?",
        choix: [
          "Le grand reporter",
          "Le rédacteur en chef",
          "L'intellectuel engagé",
          "Le fact-checker",
        ],
        bonneReponse: 2,
        explication:
          "La presse permet à des intellectuels comme Zola de s'engager publiquement pour une cause.",
      },
      {
        question: "En quelle année Alfred Dreyfus est-il réhabilité ?",
        choix: ["1894", "1898", "1906", "1944"],
        bonneReponse: 2,
        explication:
          "Condamné en 1894, défendu par Zola en 1898, Dreyfus est réhabilité en 1906.",
      },
      {
        question: "Quel est le rôle d'une agence de presse ?",
        choix: [
          "Imprimer les journaux",
          "Collecter, vérifier et vendre l'information aux médias",
          "Réguler l'audiovisuel",
          "Financer les journaux par la publicité uniquement",
        ],
        bonneReponse: 1,
        explication:
          "Les agences de presse sont « les médias des médias » : elles fournissent la matière première grâce à leurs journalistes de terrain.",
      },
      {
        question: "Pourquoi Havas cesse-t-elle d'être une agence de presse ?",
        choix: [
          "Elle fait faillite en 1857",
          "Elle est rachetée par Reuters",
          "Elle s'est compromise dans la propagande de Vichy",
          "Elle est interdite par la loi de 1881",
        ],
        bonneReponse: 2,
        explication:
          "Compromise sous Vichy, Havas ne garde que son activité publicitaire ; l'AFP est créée en août 1944.",
      },
      {
        question:
          "Pourquoi De Gaulle veut-il que l'AFP soit un établissement public à la Libération ?",
        choix: [
          "Pour que la France produise elle-même son information, sans dépendre des agences anglo-saxonnes",
          "Pour supprimer la liberté de la presse",
          "Pour concurrencer la télévision",
          "Pour financer les journaux par la publicité",
        ],
        bonneReponse: 0,
        explication:
          "Le GPRF met la main sur l'AFP pour garantir une information produite en France.",
      },
      {
        question: "Qu'est-ce que la pyramide inversée ?",
        choix: [
          "L'organisation hiérarchique d'une rédaction",
          "Un article écrit du plus important au plus accessoire",
          "Le classement des journaux par tirage",
          "Une technique de montage télévisé",
        ],
        bonneReponse: 1,
        explication:
          "Une dépêche commence par l'essentiel (les 5W), puis ajoute les détails par ordre d'importance décroissante.",
      },
      {
        question: "Que prévoient les droits voisins (loi du 24 juillet 2019) ?",
        choix: [
          "La gratuité de la presse en ligne",
          "L'interdiction des réseaux sociaux avant 13 ans",
          "La rémunération de la presse par les plateformes qui utilisent ses contenus",
          "Le contrôle des chaînes par l'Arcom",
        ],
        bonneReponse: 2,
        explication:
          "Les plateformes comme Google ou Meta doivent rémunérer les éditeurs et agences dont elles reprennent les contenus.",
      },
      {
        question: "Que montre la guerre d'Algérie à propos de l'AFP ?",
        choix: [
          "Que son statut d'indépendance de 1957 n'empêche pas le contrôle, voire la censure, par l'État",
          "Qu'elle a été créée pour ce conflit",
          "Qu'elle dépendait d'Havas",
          "Qu'elle refusait de couvrir l'actualité internationale",
        ],
        bonneReponse: 0,
        explication:
          "Malgré le statut de 1957, l'AFP reste contrôlée, voire censurée par l'État pendant la guerre d'Algérie.",
      },
      {
        type: "ordre",
        consigne: "Remets ces repères dans l'ordre chronologique.",
        elements: [
          "Liberté d'expression inscrite dans la Constitution",
          "Havas devient une agence de presse",
          "Loi sur la liberté de la presse",
          "« J'accuse… ! » de Zola",
          "Réhabilitation de Dreyfus",
          "Création de l'AFP",
          "Statut d'indépendance de l'AFP",
          "Loi française sur les droits voisins",
        ],
        explication: "1791, 1835, 1881, 1898, 1906, 1944, 1957, 2019.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Pendant l'affaire Dreyfus, le quotidien La Croix prend la défense de Dreyfus.",
        vrai: false,
        explication:
          "La Croix est antidreyfusard : il se proclame en 1890 « le journal le plus antijuif de France ».",
      },
      {
        type: "vraiFaux",
        affirmation: "L'AFP est créée à la Libération, en août 1944.",
        vrai: true,
        explication:
          "Le GPRF de De Gaulle en fait un établissement public, pour ne pas dépendre des agences anglo-saxonnes.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Depuis son statut de 1957, l'AFP n'a plus jamais été contrôlée par l'État.",
        vrai: false,
        explication:
          "Elle reste contrôlée, voire censurée, par exemple pendant la guerre d'Algérie.",
      },
      {
        type: "trou",
        texte: "Zola publie « J'accuse… ! » dans le journal L'___.",
        reponses: ["Aurore", "L'Aurore"],
        explication: "L'Aurore est le journal de Clemenceau.",
      },
      {
        type: "trou",
        texte:
          "Un article écrit du plus important au plus accessoire suit le principe de la pyramide ___.",
        reponses: ["inversée"],
        explication:
          "Une dépêche commence par l'essentiel (les 5W), puis ajoute les détails.",
      },
      {
        type: "trou",
        texte:
          "Le droit des éditeurs d'être rémunérés quand les plateformes reprennent leurs contenus s'appelle les droits ___.",
        reponses: ["voisins"],
        explication:
          "Les droits voisins sont fixés par une directive européenne et la loi française du 24 juillet 2019.",
      },
      {
        type: "ouverte",
        question:
          "Montre que l'affaire Dreyfus révèle à la fois la puissance et les limites de la presse.",
        corrige:
          "Puissance : la presse fait éclater l'affaire, permet à Zola de s'engager (« J'accuse… ! ») et donne naissance à l'intellectuel engagé. Limites : elle polarise l'opinion, diffuse l'antisémitisme (La Croix) et dépend de ses lecteurs, comme Le Figaro qui recule pour ne pas les perdre.",
      },
    ],
  },
];
