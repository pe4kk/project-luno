import type { ProgrammeGenre, TexteBac } from "@/lib/bac";

/**
 * Bac de français 2027 (voie générale) : les textes de l'oral, par genre. Quatre textes
 * par genre, seize au total. Chaque texte reprend l'explication linéaire du prof
 * (M. Waquet), réduite à l'essentiel : pas tout, ce qu'il faut savoir dire à l'oral.
 * Les `extrait` des annotations doivent reprendre les mots du texte à l'identique
 * (apostrophes « ’ » comprises) : ils sont retrouvés dans les lignes pour être surlignés.
 */

/** Texte 1, reçu le 2026-11-13 (texte en .docx, explication du prof en PDF de 7 pages). */
export const A_LA_MUSIQUE: TexteBac = {
  id: "rimbaud-a-la-musique",
  genre: "poesie",
  titre: "À la Musique",
  auteur: "Arthur Rimbaud",
  date: "1870",
  forme: "9 quatrains d’alexandrins, rimes croisées",
  categories: { theme: "Objets : la réification", registre: "Satire et mots péjoratifs" },
  lecture:
    "Respecter la versification : le « e » se prononce devant une consonne, pas devant une voyelle ni en fin de vers. Donner le ton : moqueur dans la première partie, plus léger et rêveur dans la seconde.",
  introduction: [
    "Arthur Rimbaud (1854-1891) naît à Charleville dans la petite bourgeoisie. Pour fuir un climat familial étouffant et une mère dévote et rigide, il se réfugie dans la poésie, encouragé par son professeur Georges Izambard.",
    "Il rêve de rejoindre les Parnassiens à Paris, fugue plusieurs fois, rencontre Verlaine. Pour lui, le poète doit se faire « voyant » par un « immense et raisonné dérèglement de tous les sens » (lettre à Paul Demeny, mai 1871). Il cesse d’écrire vers 1875.",
    "==Le poème appartient au recueil Demeny, ou Cahiers de Douai== : vingt-deux poèmes écrits entre janvier et octobre 1870, recopiés et confiés à Paul Demeny en vue d’une publication.",
    "==C’est une caricature de la bourgeoisie, qui pastiche « Promenades d’hiver » du parnassien Albert Glatigny== et lui reprend l’opposition entre les bourgeois et le poète. Mais la satire de Rimbaud est plus acerbe : il examine le monde bourgeois et ses sous-catégories, dont il critique le conformisme social et politique.",
  ],
  problematique:
    "Comment, dans ce poème satirique, Rimbaud oppose-t-il la bourgeoisie étriquée de Charleville-Mézières à l’esprit libre et espiègle d’un adolescent-poète ?",
  mouvements: [
    {
      titre: "La caricature des bourgeois, réifiés et animalisés",
      fiche: [
        "Le titre annonce une ode à la grande Musique, mais le sous-titre donne un lieu trivial : ==ce décalage annonce une caricature qui passe par la précision réaliste, poussée jusqu’à l’exagération.==",
        "Strophe 1 : le cadre (la place, les jeudis soirs) et le ton satirique, par les termes péjoratifs (« mesquines », « correct », « poussifs », « bêtises jalouses »). « Tous les bourgeois » : Rimbaud vise la classe sociale entière.",
        "Strophes 2 et 3 : un défilé de types sociaux (le gandin, le notaire, les rentiers, les employés de bureau). ==Les hommes sont réifiés, réduits à leurs objets (« breloques à chiffres », « lorgnons ») ; les femmes sont animalisées (« cornacs »).==",
        "Tous sont en représentation : on vient moins écouter l’orchestre, d’ailleurs médiocre (« couacs »), que se montrer. Une classe attachée aux apparences au point de se confondre avec elles.",
        "Rimbaud prend des libertés avec le vers : césure après la préposition « à », mot familier « couacs », allitérations qui miment la lourdeur.",
      ],
      passages: [
        {
          chapeau: true,
          lignes: ["À la Musique", "Place de la gare, à Charleville."],
          annotations: [
            {
              extrait: "À la Musique",
              cat: "registre",
              titre: "Un titre d’ode",
              texte: "On attend un hommage à la grande Musique, avec une majuscule.",
            },
            {
              extrait: "Place de la gare, à Charleville.",
              cat: "registre",
              titre: "Décalage",
              texte: "Le lieu, trivial et bruyant, court-circuite l’éloge annoncé : la précision réaliste servira la caricature.",
              retenir: "titre noble, lieu banal : la satire commence",
            },
          ],
        },
        {
          lignes: [
            "Sur la place taillée en mesquines pelouses,",
            "Square où tout est correct, les arbres et les fleurs,",
            "Tous les bourgeois poussifs qu’étranglent les chaleurs",
            "Portent, les jeudis soirs, leurs bêtises jalouses.",
          ],
          annotations: [
            {
              extrait: "mesquines pelouses",
              cat: "figure",
              titre: "Hypallage",
              texte: "L’adjectif porte sur les pelouses, mais ce sont les bourgeois qui sont mesquins, sans imagination, trop rationnels.",
              retenir: "le lieu ressemble à ceux qui l’occupent",
            },
            {
              extrait: "tout est correct",
              cat: "registre",
              titre: "Connotation négative",
              texte: "Un arbre ne peut pas être « correct » : la bourgeoisie veut dominer la nature, lui imposer un ordre. Le mot vise aussi sa politesse, qui cache l’hypocrisie.",
            },
            {
              extrait: "Tous les bourgeois",
              cat: "figure",
              titre: "Hyperbole",
              texte: "Rimbaud ne vise pas seulement les bourgeois de Charleville, mais la classe sociale en général.",
            },
            {
              extrait: "bêtises jalouses",
              cat: "registre",
              titre: "Double sens",
              texte: "Leur sottise, mais aussi leurs babioles : ils envient celles des autres et veulent être enviés. C’est l’obsession bourgeoise des objets.",
            },
            {
              extrait: "les jeudis soirs",
              cat: "theme",
              titre: "Un rendez-vous régulier",
              texte: "Le vrai spectacle semble moins celui de l’orchestre que celui du public, qui vient se montrer.",
            },
          ],
        },
        {
          lignes: [
            "— L’orchestre militaire, au milieu du jardin,",
            "Balance ses schakos dans la Valse des fifres :",
            "— Autour, aux premiers rangs, parade le gandin ;",
            "Le notaire pend à ses breloques à chiffres",
          ],
          annotations: [
            {
              extrait: "L’orchestre militaire",
              cat: "registre",
              titre: "Musique militaire",
              texte: "Ni Mozart ni Wagner : une musique fonctionnelle, au centre du jardin comme l’armée est au centre de cette ville de garnison, en pleine rivalité franco-prussienne.",
            },
            {
              extrait: "Balance ses schakos",
              cat: "registre",
              titre: "Image risible",
              texte: "Les coiffures militaires rigides oscillent au rythme d’une valse.",
            },
            {
              extrait: "parade le gandin",
              cat: "registre",
              titre: "En représentation",
              texte: "Le gandin, dandy oisif, cherche à se montrer. L’article défini (« le gandin », « le notaire ») désigne un type, un stéréotype.",
            },
            {
              extrait: "ses breloques à chiffres",
              cat: "theme",
              titre: "Réification",
              texte: "Le verbe « pendre » inverse les rôles : le notaire dépend de son accessoire, signe de propriété dont il est fier. Peut-être regarde-t-il l’heure : le temps, c’est de l’argent.",
              retenir: "l’objet vaut plus que l’homme",
            },
            {
              extrait: "pend à",
              cat: "vers",
              titre: "Césure après « à »",
              texte: "L’alexandrin est coupé après une préposition : une audace, dans le sillage de Baudelaire et des Parnassiens, qui met en valeur le second hémistiche.",
            },
          ],
        },
        {
          lignes: [
            "Des rentiers à lorgnons soulignent tous les couacs :",
            "Les gros bureaux bouffis traînent leurs grosses dames",
            "Auprès desquelles vont, officieux cornacs,",
            "Celles dont les volants ont des airs de réclames ;",
          ],
          annotations: [
            {
              extrait: "rentiers à lorgnons",
              cat: "theme",
              titre: "Caractérisés par un objet",
              texte: "Les rentiers vivent de leur argent sans travailler. Le lorgnon suggère des regards de convoitise ; s’ils relèvent les fausses notes, c’est par ostentation.",
            },
            {
              extrait: "couacs",
              cat: "registre",
              titre: "Mot familier",
              texte: "Inattendu en poésie, dans la voie ouverte par Hugo (« Je nommai le cochon par son nom »). Sous-entendu : l’orchestre est de piètre qualité.",
            },
            {
              extrait: "gros bureaux bouffis",
              cat: "figure",
              titre: "Métonymie",
              texte: "Les employés deviennent leur bureau : ils jouent tellement le jeu social qu’ils s’identifient au lieu où ils travaillent.",
              retenir: "je travaille dans un bureau, je deviens un bureau",
            },
            {
              extrait: "traînent leurs grosses dames",
              cat: "vers",
              titre: "Allitérations en b et gr",
              texte: "Les sonorités et la répétition gros / grosses miment la lourdeur, physique autant que morale.",
            },
            {
              extrait: "officieux cornacs",
              cat: "figure",
              titre: "Métaphore",
              texte: "Un cornac conduit les éléphants : les dames sont donc comparées à des éléphants. Les hommes sont chosifiés, les femmes animalisées.",
            },
            {
              extrait: "airs de réclames",
              cat: "theme",
              titre: "Le règne des apparences",
              texte: "Des tenues faites pour attirer l’œil, comme une publicité : cette classe se confond avec ce qu’elle montre.",
            },
          ],
        },
        {
          nonEtudie: true,
          lignes: [
            "Sur les bancs verts, des clubs d’épiciers retraités",
            "Qui tisonnent le sable avec leur canne à pomme,",
            "Fort sérieusement discutent les traités,",
            "Puis prisent en argent, et reprennent : « En somme !… »",
          ],
          annotations: [],
        },
        {
          nonEtudie: true,
          lignes: [
            "Épatant sur son banc les rondeurs de ses reins,",
            "Un bourgeois à boutons clairs, bedaine flamande,",
            "Savoure son onnaing d’où le tabac par brins",
            "Déborde — vous savez, c’est de la contrebande ; —",
          ],
          annotations: [],
        },
        {
          nonEtudie: true,
          lignes: [
            "Le long des gazons verts ricanent les voyous ;",
            "Et, rendus amoureux par le chant des trombones,",
            "Très naïfs, et fumant des roses, les pioupious",
            "Caressent les bébés pour enjôler les bonnes…",
          ],
          annotations: [],
        },
      ],
    },
    {
      titre: "L’autoportrait du poète en adolescent espiègle",
      fiche: [
        "La description par cercles concentriques nous a éloignés de l’orchestre : on arrive aux marges, opposées à l’univers bourgeois hiérarchisé et cadenassé.",
        "==« Moi, je suis » : l’emphase marque l’opposition avec les bourgeois, et le verbe joue sur être et suivre== (l’être contre l’avoir). « Débraillé comme un étudiant » : la bohème, un parfum de désordre dans l’ordre social.",
        "La focalisation change : après le regard extérieur qui croquait les bourgeois, le point de vue du « je », au présent d’habitude.",
        "==Un jeu de regards érotique et subversif se joue en parallèle de la comédie bourgeoise==, mais le poète ne dépasse pas le fantasme : il « reconstruit les corps » par l’imagination, et les points de suspension laissent le lecteur imaginer.",
        "Autodérision : les jeunes filles le trouvent « drôle », à la fois amusant et bizarre, infréquentable.",
      ],
      passages: [
        {
          lignes: [
            "— Moi, je suis, débraillé comme un étudiant",
            "Sous les marronniers verts les alertes fillettes :",
            "Elles le savent bien, et tournent en riant,",
            "Vers moi, leurs yeux tout pleins de choses indiscrètes.",
          ],
          annotations: [
            {
              extrait: "Moi, je suis",
              cat: "figure",
              titre: "Emphase et ambiguïté",
              texte: "« Moi, je » s’oppose aux bourgeois (structure reprise à Glatigny). On croit lire le verbe être, l’authenticité contre l’avoir ; c’est le verbe suivre, un regard désirant.",
              retenir: "être contre avoir",
            },
            {
              extrait: "débraillé comme un étudiant",
              cat: "theme",
              titre: "La bohème",
              texte: "Le poète ne soigne pas sa tenue, à l’inverse des bourgeois aliénés par leurs vêtements et leurs objets : il apporte du désordre dans l’ordre social.",
            },
            {
              extrait: "alertes fillettes",
              cat: "registre",
              titre: "Opposition",
              texte: "Vives et spontanées, elles s’opposent aux « grosses dames » de la première partie.",
            },
            {
              extrait: "Elles le savent bien",
              cat: "theme",
              titre: "Un autre jeu",
              texte: "Elles se savent regardées : un jeu érotique et subversif se joue en parallèle de la comédie bourgeoise.",
            },
            {
              extrait: "marronniers verts",
              cat: "vers",
              titre: "Le son « ver »",
              texte: "« verts », « Vers » : la saison des amours, mais aussi ce qui n’est pas mûr. Rien de concret ne se passera.",
            },
          ],
        },
        {
          lignes: [
            "Je ne dis pas un mot : je regarde toujours",
            "La chair de leurs cous blancs brodés de mèches folles :",
            "Je suis, sous le corsage et les frêles atours,",
            "Le dos divin après la courbe des épaules",
          ],
          annotations: [
            {
              extrait: "je regarde toujours",
              cat: "vers",
              titre: "Enjambement",
              texte: "La phrase déborde sur le vers suivant et mime l’audace du regard. Le présent a une valeur d’habitude.",
            },
            {
              extrait: "Je suis, sous le corsage",
              cat: "figure",
              titre: "Ambiguïté redoublée",
              texte: "Suit-il des yeux le corps, ou est-il déjà sous le corsage ? Les deux. Il déshabille mentalement les jeunes filles, dans un mouvement descendant.",
            },
            {
              extrait: "frêles atours",
              cat: "registre",
              titre: "Érotisme léger",
              texte: "Des vêtements légers, d’été. Comme dans « Roman », le poète ne va pas plus loin que le fantasme.",
            },
            {
              extrait: "brodés de mèches folles",
              cat: "theme",
              titre: "Un naturel travaillé",
              texte: "Les mèches sont « folles » mais « brodées » : ces jeunes filles deviendront sans doute les bourgeoises décrites plus haut.",
            },
          ],
        },
        {
          lignes: [
            "J’ai bientôt déniché la bottine, le bas…",
            "— Je reconstruis les corps, brûlé de belles fièvres.",
            "Elles me trouvent drôle et se parlent tout bas…",
            "— Et je sens les baisers qui me viennent aux lèvres…",
          ],
          annotations: [
            {
              extrait: "la bottine, le bas…",
              cat: "figure",
              titre: "Aposiopèse",
              texte: "Les points de suspension interrompent la phrase : de la bottine au bas, au lecteur d’imaginer la suite. « Déniché » garde un sous-entendu grivois.",
            },
            {
              extrait: "Je reconstruis les corps",
              cat: "theme",
              titre: "L’imagination",
              texte: "Il imagine sans passer à l’acte, comme le lecteur imagine le texte à partir des mots.",
            },
            {
              extrait: "brûlé de belles fièvres",
              cat: "vers",
              titre: "Allitération en b et l",
              texte: "Le cliché de la passion comme un feu, porté par les sonorités.",
            },
            {
              extrait: "drôle",
              cat: "registre",
              titre: "Autodérision",
              texte: "Amusant, mais aussi bizarre, frondeur : le poète se renvoie lui-même à la marge.",
            },
            {
              extrait: "les baisers qui me viennent aux lèvres…",
              cat: "figure",
              titre: "Personnification",
              texte: "Les baisers viennent d’eux-mêmes : le désir monte, et les points de suspension laissent le rêve ouvert.",
            },
          ],
        },
      ],
    },
  ],
  conclusion: [
    "Le poème prend sa source chez le parnassien Albert Glatigny, mais ==Rimbaud rend la caricature plus acerbe et l’opposition entre les bourgeois et lui plus franche==. Il est proche des caricaturistes de son temps et de l’art du croquis.",
    "Son regard est aigu : il analyse les signes d’une classe sociale (la représentation, les objets qui réifient ou animalisent) et livre le récit lucide des rêves inaboutis d’un adolescent.",
    "Ouverture : « Roman », où Rimbaud reprend ce jeu amoureux silencieux et fantasmé, avec une discrète critique sociale (les jeunes filles marchent « sous l’ombre du faux-col effrayant » de leur père).",
  ],
};

export const PROGRAMME_BAC: ProgrammeGenre[] = [
  {
    genre: "poesie",
    oeuvre: {
      titre: "Cahiers de Douai",
      auteur: "Arthur Rimbaud",
      parcours: "Émancipations créatrices",
      chapitrePublie: "francais-1re-rimbaud-douai",
    },
    places: [
      A_LA_MUSIQUE,
      { titre: "Deuxième texte de l’œuvre", attente: "Envoie le texte et l’explication du prof" },
      { titre: "Troisième texte de l’œuvre", attente: "Envoie le texte et l’explication du prof" },
      { titre: "Femme noire, Léopold Sédar Senghor", attente: "En attente du cours", parcours: true },
    ],
  },
  { genre: "theatre", places: [] },
  { genre: "roman", places: [] },
  { genre: "idees", places: [] },
];

export const TEXTES_BAC: TexteBac[] = PROGRAMME_BAC.flatMap((g) =>
  g.places.filter((p): p is TexteBac => "mouvements" in p),
);
