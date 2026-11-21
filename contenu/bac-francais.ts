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
  essentiel: [
    "==Une satire de la bourgeoisie de Charleville==, qui pastiche « Promenades d’hiver » de Glatigny mais en plus acerbe. Cahiers de Douai, 1870, Rimbaud a 15 ans.",
    "Le décalage d’emblée : un titre d’ode (« À la Musique ») et un lieu banal (« Place de la gare »). La musique elle-même est dévalorisée : un orchestre militaire, fonctionnel, plein de « couacs ».",
    "==Les hommes sont réifiés, les femmes animalisées== : le notaire « pend à ses breloques », les employés deviennent des « bureaux », les dames sont menées par des « cornacs » comme des éléphants.",
    "Tous sont en représentation : on vient se montrer (« parade le gandin »), pas écouter. Une classe qui se confond avec ses apparences.",
    "Puis le « Moi, je suis » : le poète débraillé, en marge, ==l’être contre l’avoir==, dans un jeu de regards avec les jeunes filles qui reste un fantasme.",
    "Liberté du vers : césure après « à », mot familier « couacs », sonorités lourdes en b et gr. Ouverture : « Roman ».",
  ],
  lecture:
    "Respecter la versification : le « e » se prononce devant une consonne, pas devant une voyelle ni en fin de vers. Donner le ton : moqueur dans la première partie, plus léger et rêveur dans la seconde.",
  introduction: [
    "Arthur Rimbaud (1854-1891) naît à Charleville dans la petite bourgeoisie. Pour fuir un climat familial étouffant et une mère dévote et rigide, il se réfugie dans la poésie, encouragé par son professeur Georges Izambard.",
    "Il rêve de rejoindre les Parnassiens à Paris, fugue plusieurs fois, rencontre Verlaine. Pour lui, le poète doit se faire « voyant » par un « immense et raisonné dérèglement de tous les sens » (lettre à Paul Demeny, mai 1871). Il cesse d’écrire vers 1875.",
    "==Le poème appartient au recueil Demeny, ou Cahiers de Douai== : vingt-deux poèmes écrits entre janvier et octobre 1870, recopiés et confiés à Paul Demeny en vue d’une publication.",
    "==C’est une caricature de la bourgeoisie, qui pastiche « Promenades d’hiver » du parnassien Albert Glatigny== et lui reprend l’opposition entre les bourgeois et le poète. Mais la satire de Rimbaud est plus acerbe : il examine le monde bourgeois et ses sous-catégories, dont il critique le conformisme social et politique.",
    "Ce que Rimbaud reprend à Glatigny : quatre thèmes (la bourgeoisie, les femmes et les jeunes filles, l’orchestre militaire, la place) et ==la structure même du poème, une opposition entre les bourgeois et leurs femmes qui écoutent un orchestre guerrier sur la place, et le poète avec les jeunes filles==. Il en reprend presque à l’identique le début. Chez Glatigny, la critique du goût bourgeois reste une nuance péjorative peu exploitée ; Rimbaud en fait le cœur du poème.",
  ],
  problematique:
    "Comment, dans ce poème satirique, Rimbaud oppose-t-il la bourgeoisie étriquée de Charleville-Mézières à l’esprit libre et espiègle d’un adolescent-poète ?",
  mouvements: [
    {
      titre: "La caricature des bourgeois, réifiés et animalisés",
      fiche: [
        "Le titre annonce une ode à la grande Musique, mais le sous-titre donne un lieu trivial : ==ce décalage annonce une caricature qui passe par la précision réaliste, poussée jusqu’à l’exagération.==",
        "Les six premiers vers posent le cadre autour de l’orchestre : ==plus on est proche de lui, plus on a de pouvoir==. Puis on s’en éloigne, cercle après cercle, jusqu’au poète, « Moi, je suis ».",
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
              cle: true,
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
              extrait: "place taillée",
              cat: "theme",
              titre: "Un monde étriqué",
              texte: "L’adjectif épithète « taillée » montre une nature découpée, contrôlée : dès les deux premiers vers, la satire vise le monde étriqué des bourgeois.",
            },
            {
              extrait: "mesquines pelouses",
              cle: true,
              cat: "figure",
              titre: "Hypallage",
              texte: "L’adjectif porte sur les pelouses, mais ce sont les bourgeois qui sont mesquins, sans imagination, trop rationnels.",
              retenir: "le lieu ressemble à ceux qui l’occupent",
            },
            {
              extrait: "tout est correct",
              cat: "registre",
              titre: "Hyperbole et connotation négative",
              texte: "« Tout » : l’hyperbole. Un arbre ne peut pas être « correct » : la bourgeoisie veut dominer la nature, lui imposer un ordre, une volonté de contrôle. Le mot vise aussi sa politesse, qui cache l’hypocrisie.",
            },
            {
              extrait: "Tous les bourgeois",
              cle: true,
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
              cle: true,
              cat: "registre",
              titre: "Musique militaire",
              texte: "Ni Mozart ni Wagner : une musique fonctionnelle, utilitaire, au centre du jardin comme l’armée est au centre de cette ville de garnison, en pleine tension franco-prussienne. Décalage avec le titre : la musique est dévalorisée.",
            },
            {
              extrait: "Balance ses schakos",
              cat: "registre",
              titre: "Image comique",
              texte: "Les schakos, coiffures militaires rigides, oscillent au rythme d’une valse : des soldats qui dansent.",
            },
            {
              extrait: "parade le gandin",
              cat: "registre",
              titre: "En représentation",
              texte: "Le gandin, dandy oisif, cherche à se montrer. Satire : les bourgeois ne viennent pas pour écouter l’orchestre, mais pour parader. L’article défini (« le gandin », « le notaire ») désigne un type, un stéréotype.",
            },
            {
              extrait: "ses breloques à chiffres",
              cle: true,
              cat: "theme",
              titre: "Réification",
              texte: "Hyperbole péjorative : le verbe « pendre » inverse les rôles, le notaire dépend de son objet et devient lui-même un objet. Les breloques (des bibelots) font écho aux « bêtises » de la strophe 1. Peut-être regarde-t-il l’heure : le temps, c’est de l’argent.",
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
              texte: "Les rentiers (des bourgeois qui vivent de leur argent sans travailler) sont, eux aussi, associés à un objet. Le lorgnon suggère des regards de convoitise ; s’ils relèvent les fausses notes, c’est par ostentation.",
            },
            {
              extrait: "couacs",
              cat: "registre",
              titre: "Mot familier",
              texte: "Inattendu en poésie, dans la voie ouverte par Hugo (« Je nommai le cochon par son nom »). Sous-entendu : l’orchestre est de piètre qualité.",
            },
            {
              extrait: "gros bureaux bouffis",
              cle: true,
              cat: "figure",
              titre: "Métonymie",
              texte: "Les employés deviennent leur bureau : ils jouent tellement le jeu social qu’ils s’identifient au lieu où ils travaillent.",
              retenir: "je travaille dans un bureau, je deviens un bureau",
            },
            {
              extrait: "traînent leurs grosses dames",
              cat: "vers",
              titre: "Redondance péjorative",
              texte: "« Gros », « bouffis », « grosses » : la répétition insiste sur leur corpulence, et les allitérations en b et gr miment la lourdeur, physique autant que morale.",
            },
            {
              extrait: "officieux cornacs",
              cle: true,
              cat: "figure",
              titre: "Métaphore",
              texte: "Un cornac conduit les éléphants : les « grosses dames » sont donc comparées à des éléphants, menées par leurs dames de compagnie. Les hommes sont chosifiés, les femmes animalisées.",
            },
            {
              extrait: "Celles dont les volants",
              cat: "figure",
              titre: "Périphrase",
              texte: "Elle désigne les dames de compagnie, qui escortent les « grosses dames » comme des cornacs mènent des éléphants. Elles ne sont même pas nommées, seulement par leurs volants : encore la personne réduite à ce qu’elle porte.",
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
              cle: true,
              cat: "figure",
              titre: "Emphase et ambiguïté",
              texte: "« Moi, je » s’oppose aux bourgeois (structure reprise à Glatigny). Rimbaud joue sur deux verbes : on croit lire être, c’est aussi suivre, un regard désirant. Cette ambiguïté oppose les bourgeois qui « paraissent » (v. 1 à 12) au poète qui « est » (v. 25-26).",
              retenir: "ils paraissent, lui est",
            },
            {
              extrait: "débraillé comme un étudiant",
              cle: true,
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
              cle: true,
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
              cle: true,
              cat: "figure",
              titre: "Aposiopèse",
              texte: "Les points de suspension interrompent la phrase : de la bottine au bas, au lecteur d’imaginer la suite. « Déniché » garde un sous-entendu grivois.",
            },
            {
              extrait: "Je reconstruis les corps",
              cle: true,
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

/**
 * Texte du parcours, reçu le 2026-11-19 : correction du DST (commentaire, M. Waquet, 4 pages),
 * notes du cours oral, copie corrigée. Senghor est mort en 2001 : poème encore protégé, on ne
 * garde que les passages commentés (`extraits`).
 */
export const FEMME_NOIRE: TexteBac = {
  id: "senghor-femme-noire",
  genre: "poesie",
  titre: "Femme noire",
  auteur: "Léopold Sédar Senghor",
  date: "1945",
  forme: "4 strophes de versets (5, 5, 5 et 3), sans rimes",
  parcours: true,
  extraits: true,
  categories: { registre: "Lyrisme et éloge", theme: "La femme et l’Afrique", vers: "Verset et sonorités" },
  essentiel: [
    "==Un éloge (tonalité épidictique) de toutes les femmes noires==, pas d’une femme en particulier : pas de déterminant devant « Femme nue, femme noire ».",
    "Héritage : l’éloge de la femme, la femme-paysage (romantiques), la fuite du temps (Ronsard). ==Originalité : célébrer la femme NOIRE en français==, en versets inspirés du Cantique des cantiques.",
    "Un portrait en trois âges : la mère protectrice (« ombre »), l’amante désirée (« Terre promise », « fruit mûr »), la femme sereine et divine (« attaches célestes »).",
    "La couleur noire revalorisée (« obscure, sombres, noir, vin ») et l’Afrique associée à la femme (savane, tamtam, gazelle, princes du Mali) : ==ne jamais séparer l’Afrique de la femme, c’est par elle que Senghor la magnifie.==",
    "La fin : « Je chante ta beauté qui passe, forme que je fixe dans l’Éternel » : le poète immortalise la femme, et fait l’éloge de la poésie elle-même. Vision cyclique, pas tragique : les cendres nourrissent la vie.",
    "Un poème incantatoire, fait pour être dit : la reprise « Femme nue, femme… », le poète comme un griot. Lien au parcours « Émancipations créatrices ».",
  ],
  lecture:
    "Lire lentement, avec un ton incantatoire : marquer chaque reprise « Femme nue, femme… », respirer aux virgules des versets, ralentir sur le dernier tercet.",
  introduction: [
    "==« Négritude » : terme audacieux, formé sur « nègre », injure raciste que le Martiniquais Aimé Césaire et Senghor retournent avec fierté==. Le mouvement revendique la valeur d’une couleur longtemps méprisée.",
    "Léopold Sédar Senghor (1906-2001), Sénégalais, agrégé de grammaire, futur président du Sénégal (1960-1980) et académicien, affirme l’identité, la culture et l’histoire des peuples noirs après des siècles de domination coloniale qui en niait l’existence.",
    "« Femme noire » paraît dans Chants d’ombre (1945). Par son thème et sa tonalité épidictique, le poème s’inscrit dans la tradition occidentale ; ==par sa forme (des versets qui rappellent le Cantique des cantiques) et par son audace (célébrer la femme noire et non plus blanche), il marque son originalité.==",
    "Ce n’est pas un poème « défensif » : il ne répond pas aux clichés en argumentant, il célèbre simplement la femme noire, et à travers elle une Afrique sensuelle, sauvage et sublime.",
  ],
  problematique: "Comment le poète parvient-il à magnifier la femme noire ?",
  mouvements: [
    {
      titre: "De la mère protectrice à la femme désirée",
      fiche: [
        "Le premier vers pose le sujet sans déterminant : ==il s’agit de toutes les femmes noires==. Le verset 2 associe la couleur à la « vie » et la forme à la « beauté ».",
        "« J’ai grandi à ton ombre » : la femme est une mère protectrice ; l’ombre abrite l’enfant de la chaleur équatoriale. « La douceur de tes mains bandait mes yeux » : le toucher, la protection contre la dureté du monde.",
        "« Et voilà » : le présentatif marque une rupture sans transition, l’irruption du désir à l’adolescence.",
        "==Le champ lexical de l’incandescence amoureuse== (« Été », « Midi », « calciné », « foudroie », « éclair ») : chaleur, désir, coup de foudre. « Je te découvre » joue sur deux sens.",
      ],
      passages: [
        {
          lignes: [
            "Femme nue, femme noire",
            "Vêtue de ta couleur qui est vie, de ta forme qui est beauté !",
            "J’ai grandi à ton ombre ; la douceur de tes mains bandait mes yeux.",
            "Et voilà […] au cœur de l’Été et de Midi, je te découvre Terre promise du haut d’un haut col calciné",
            "Et ta beauté me foudroie en plein cœur, comme l’éclair d’un aigle.",
          ],
          annotations: [
            {
              extrait: "Femme nue, femme noire",
              cle: true,
              cat: "figure",
              titre: "Absence de déterminant",
              texte: "Ni « la » ni « une » : Senghor ne célèbre pas une femme en particulier, mais toutes les femmes noires, au-delà de leurs particularités.",
              retenir: "pas de déterminant : toutes les femmes noires",
            },
            {
              extrait: "ta couleur qui est vie",
              cat: "theme",
              titre: "Le noir, c’est la vie",
              texte: "La peau habille naturellement la femme, sans parure : la couleur noire, si souvent méprisée, est associée à la vie. Le mot reviendra au dernier vers.",
            },
            {
              extrait: "ta forme qui est beauté",
              cat: "theme",
              titre: "Forme et beauté",
              texte: "Vie, forme, beauté : trois mots qui définissent aussi une poésie réussie. Le dernier tercet reprendra « forme » et « beauté ».",
            },
            {
              extrait: "J’ai grandi à ton ombre",
              cle: true,
              cat: "theme",
              titre: "La mère protectrice",
              texte: "L’ombre abrite l’enfant du soleil et de la chaleur ; il a grandi sous la responsabilité de la femme. L’ombre est rassurante, alors que chez les romantiques elle est un double inquiétant.",
              retenir: "ombre = protection",
            },
            {
              extrait: "la douceur de tes mains bandait mes yeux",
              cat: "figure",
              titre: "Le toucher",
              texte: "Le sens tactile dit la proximité entre la mère et l’enfant : elle le protège de l’extérieur et garde son innocence. Idée de protection, pas de « perfection ».",
            },
            {
              extrait: "Et voilà",
              cat: "registre",
              titre: "Présentatif",
              texte: "Il signale l’absence de transition : le désir fait irruption dans la vie de l’adolescent.",
            },
            {
              extrait: "au cœur de l’Été et de Midi",
              cat: "figure",
              titre: "Double sens",
              texte: "Au sens littéral, la chaleur de l’Afrique ; au sens figuré, l’éveil du désir et le moment le plus intense de la vie (« midi », sommet du jour).",
            },
            {
              extrait: "je te découvre",
              cle: true,
              cat: "figure",
              titre: "Syllepse de sens",
              texte: "« Découvrir » signifie à la fois connaître et déshabiller : l’érotisme est clairement affirmé.",
              retenir: "un mot, deux sens à la fois",
            },
            {
              extrait: "Terre promise",
              cat: "figure",
              titre: "Métaphore biblique",
              texte: "La terre promise par Dieu aux Hébreux, et plus largement le paradis : la rencontre physique est inéluctable et la femme aimée magnifiée.",
            },
            {
              extrait: "du haut d’un haut col calciné",
              cat: "vers",
              titre: "Répétition de « haut »",
              texte: "Elle souligne la position de surplomb de l’adolescent et l’élévation du lieu. L’article indéfini « un » ne permet pas de situer le lieu : effet de généralité. « Calciné » prolonge la chaleur.",
            },
            {
              extrait: "comme l’éclair d’un aigle",
              cat: "figure",
              titre: "Comparaison",
              texte: "Avec « foudroie », l’image du coup de foudre : la beauté frappe comme un éclair. Elle complète le champ lexical de l’incandescence amoureuse.",
            },
          ],
        },
      ],
    },
    {
      titre: "L’amante, sensuelle et africaine",
      fiche: [
        "==La métaphore du fruit et du vin fait de la femme une amante qu’on goûte== : le sens du goût après le toucher. Le « vin » renvoie à l’ivresse, les « extases » à l’excès.",
        "La couleur noire est partout (« obscure », « sombres », « noir », « vin ») : une isotopie qui prend ici une connotation positive, à l’inverse de la culture occidentale où le noir est associé au mal.",
        "La femme est associée à l’Afrique : la savane (la vue), le tamtam (l’ouïe). Le corps à corps amoureux se joue dans les sonorités.",
        "==Le dernier verset contrebalance l’insistance sur le corps== : la voix « est le chant spirituel de l’Aimée » (présent de vérité générale). L’amour s’élève au-delà du corporel.",
      ],
      passages: [
        {
          lignes: [
            "Femme nue, femme obscure",
            "Fruit mûr à la chair ferme, sombres extases du vin noir, bouche qui fais lyrique ma bouche",
            "Savane aux horizons purs, savane qui frémis aux caresses ferventes du Vent d’Est",
            "Tamtam sculpté, tamtam tendu qui grondes sous les doigts du vainqueur",
            "Ta voix grave de contralto est le chant spirituel de l’Aimée.",
          ],
          annotations: [
            {
              extrait: "femme obscure",
              cat: "theme",
              titre: "Mystère",
              texte: "« Obscure » dit la couleur, mais aussi le mystère de la femme, qui rend sa célébration inépuisable.",
            },
            {
              extrait: "Fruit mûr à la chair ferme",
              cle: true,
              cat: "figure",
              titre: "Métaphore du fruit",
              texte: "L’âge adulte, la maturité ; le sens du goût, comme si la femme pouvait être goûtée charnellement.",
            },
            {
              extrait: "sombres extases du vin noir",
              cat: "figure",
              titre: "Ivresse et passion",
              texte: "Le vin, c’est l’ivresse ; les extases, l’excès, la sortie de soi vers un ailleurs, physique autant que spirituel. Encore le noir, valorisé.",
            },
            {
              extrait: "bouche qui fais lyrique ma bouche",
              cle: true,
              cat: "figure",
              titre: "Antanaclase",
              texte: "Le même mot dans deux sens : la première « bouche » est sensuelle, la seconde est la voix du poète inspiré. La femme est sa muse. « Lyrique » renvoie aussi à la lyre d’Orphée.",
              retenir: "la femme inspire le poète : c’est sa muse",
            },
            {
              extrait: "Savane aux horizons purs",
              cle: true,
              cat: "theme",
              titre: "La femme-paysage",
              texte: "Héritage romantique. Le mot, sans déterminant, est stylisé ; « purs » connote l’innocence. Senghor ne garde pas le cliché du monde sauvage, mais une beauté épurée.",
            },
            {
              extrait: "savane qui frémis aux caresses ferventes du Vent d’Est",
              cat: "vers",
              titre: "Harmonie imitative",
              texte: "Les sons « van » (savane, ferventes, vent) alternent avec l’allitération en « r » (horizons, purs, frémis, caresses) : comme si se jouait le corps à corps entre la femme et l’homme. La seconde moitié du verset est plus longue que la première : l’image est amplifiée.",
            },
            {
              extrait: "Tamtam sculpté, tamtam tendu qui grondes",
              cat: "vers",
              titre: "Consonnes dures",
              texte: "Les allitérations en « t » et « d » évoquent la résistance d’un corps qui ne se laisse pas dompter. « Sculpté », « tendu » : une beauté épurée.",
            },
            {
              extrait: "sous les doigts du vainqueur",
              cat: "theme",
              titre: "La femme instrument",
              texte: "La femme est comparée à un instrument que l’homme fait chanter, mais elle « gronde » comme le tonnerre : elle sait le remettre à sa place.",
            },
            {
              extrait: "est le chant spirituel de l’Aimée",
              cat: "registre",
              titre: "Le spirituel",
              texte: "Le présent de vérité générale élève la relation au-delà du corps : l’insistance sur le physique est contrebalancée.",
            },
          ],
        },
      ],
    },
    {
      titre: "La femme sereine, sublime et divinisée",
      fiche: [
        "Dans ce quintil, ==des métaphores hyperboliques disent la sérénité et la sagesse de la femme==, qui retrouve son rôle protecteur du début (« ombre », « angoisse » apaisée).",
        "La femme est de l’ordre du divin : « attaches célestes », perles devenues « étoiles », or rouge. Une source perpétuelle d’émerveillement.",
        "==L’histoire est convoquée : les « princes du Mali »== (empire du XIIIᵉ au XVIᵉ siècle) donnent à la femme noire une noblesse que l’idéologie coloniale lui refusait.",
      ],
      passages: [
        {
          lignes: [
            "Femme nue, femme obscure",
            "Huile que ne ride nul souffle, huile calme aux flancs de l’athlète, aux flancs des princes du Mali",
            "Gazelle aux attaches célestes, les perles sont étoiles sur la nuit de ta peau",
            "[…] les reflets de l’or rouge sur ta peau qui se moire",
            "À l’ombre de ta chevelure, s’éclaire mon angoisse aux soleils prochains de tes yeux.",
          ],
          annotations: [
            {
              extrait: "Huile que ne ride nul souffle",
              cat: "figure",
              titre: "Métaphore",
              texte: "L’huile que rien ne trouble : l’apaisement autant que la ténacité. Le mot est repris et amplifié (« huile calme »).",
            },
            {
              extrait: "aux flancs de l’athlète",
              cat: "figure",
              titre: "Métonymie",
              texte: "L’huile évoque les soins dont la femme pare les athlètes : une présence tactile, rassurante, protectrice, gage de santé.",
            },
            {
              extrait: "princes du Mali",
              cle: true,
              cat: "theme",
              titre: "L’histoire africaine",
              texte: "Référence au prestigieux empire du Mali (XIIIᵉ-XVIᵉ siècle) : la femme noire est associée à la royauté, une noblesse que l’idéologie coloniale lui déniait.",
              retenir: "rendre à l’Afrique son histoire",
            },
            {
              extrait: "Gazelle aux attaches célestes",
              cle: true,
              cat: "theme",
              titre: "Divinisation",
              texte: "La gazelle (un mouvement, le sens cinesthésique) n’est pas un animal ordinaire : ses attaches « célestes » la transfigurent.",
            },
            {
              extrait: "les perles sont étoiles sur la nuit de ta peau",
              cat: "figure",
              titre: "Métaphore",
              texte: "Les perles rattachent la femme au ciel ; la peau devient la nuit, encore une image positive du noir.",
            },
            {
              extrait: "l’or rouge sur ta peau qui se moire",
              cat: "registre",
              titre: "Émerveillement",
              texte: "Une beauté toujours en mouvement : les reflets changent sans cesse, la femme est une source perpétuelle d’émerveillement.",
            },
            {
              extrait: "s’éclaire mon angoisse",
              cle: true,
              cat: "theme",
              titre: "Retour de la protection",
              texte: "L’ombre revient et chasse l’angoisse du poète : la femme apaise, comme la mère du début. Cette angoisse annonce la fuite du temps du dernier tercet.",
            },
            {
              extrait: "aux soleils prochains de tes yeux",
              cat: "figure",
              titre: "Métaphore",
              texte: "Les yeux sont des soleils (pas de « comme » : métaphore, pas comparaison). Antithèse avec « ombre » : l’ombre et la lumière.",
            },
          ],
        },
      ],
    },
    {
      titre: "Immortaliser la femme par le chant",
      fiche: [
        "Toujours lire de près la fin d’un poème. ==Le dernier tercet répond à l’angoisse : le poète « fixe dans l’Éternel » une beauté qui passe.== De passif, il devient actif ; de protégé, il protège.",
        "Héritage : la fuite du temps, depuis Ronsard (« Quand vous serez bien vieille… », 1578). Originalité : l’appliquer à une femme noire.",
        "==L’antithèse « beauté qui passe » / « l’Éternel » déplace l’éloge vers la poésie elle-même== : la forme du poème ne prend pas une ride, tout lecteur pourra redire cette beauté.",
        "Vision cyclique, pas tragique : le « Destin jaloux » (allégorie) réduit la femme en cendres qui « nourrissent les racines de la vie ». Idée de réincarnation, plus païenne que chrétienne.",
        "Le poète se fait griot : « Je chante ». La reprise « Femme nue, femme… » rend le poème incantatoire : à chaque lecture, la femme réapparaît en majesté.",
      ],
      passages: [
        {
          lignes: [
            "Femme nue, femme noire",
            "Je chante ta beauté qui passe, forme que je fixe dans l’Éternel",
            "Avant que le Destin jaloux ne te réduise en cendres pour nourrir les racines de la vie.",
          ],
          annotations: [
            {
              extrait: "Femme nue, femme noire",
              cle: true,
              cat: "registre",
              titre: "Incantation",
              texte: "La reprise en tête de chaque strophe (« femme noire » au début et à la fin, « femme obscure » au milieu) donne au poème un ton incantatoire, comme une formule magique.",
              retenir: "le poème fait réapparaître celle qu’il nomme",
            },
            {
              extrait: "Je chante",
              cat: "theme",
              titre: "Le poète griot",
              texte: "Le poète se donne une mission. Il chante comme le griot (dyâli) qui dit les récits fondateurs de la communauté, au rythme d’un instrument.",
            },
            {
              extrait: "ta beauté qui passe",
              cle: true,
              cat: "figure",
              titre: "Antithèse",
              texte: "Avec « l’Éternel » : la beauté passagère du corps contre la forme éternelle du poème. Le thème de la fuite du temps, hérité de Ronsard.",
            },
            {
              extrait: "forme que je fixe dans l’Éternel",
              cle: true,
              cat: "theme",
              titre: "Éloge de la poésie",
              texte: "« Forme » reprend le verset 2 : la forme du corps devient la forme du poème. Senghor fait aussi l’éloge de la poésie et de sa puissance d’immortaliser.",
              retenir: "immortaliser par les mots",
            },
            {
              extrait: "le Destin jaloux",
              cat: "figure",
              titre: "Personnification, allégorie",
              texte: "Une idée abstraite représentée comme une personne : seule la mort peut anéantir cette beauté.",
            },
            {
              extrait: "pour nourrir les racines de la vie",
              cle: true,
              cat: "vers",
              titre: "Le cycle et l’assonance en « i »",
              texte: "Les cendres nourrissent la vie : une vision cyclique, pas tragique. L’assonance en « i » insiste sur les termes mélioratifs ; « vie » fait écho au verset 2.",
              retenir: "la mort nourrit la vie",
            },
          ],
        },
      ],
    },
  ],
  conclusion: [
    "==Le poème s’inscrit pleinement dans le parcours « Émancipations créatrices »== : poète francophone dont la langue maternelle était le wolof, Senghor utilise toutes les ressources du français pour magnifier un être que la tradition poétique n’avait jamais célébré, la femme noire.",
    "Tout en reprenant des thèmes anciens (la fuite du temps de Ronsard, la femme-paysage des romantiques), il s’émancipe de la tradition en valorisant l’oralité et la fonction magique du poème : faire réapparaître l’être dont on parle.",
    "Rappeler la négritude : affirmer la beauté de la femme noire, c’est répondre aux clichés coloniaux en célébrant plutôt qu’en se défendant.",
    "Ouverture : Senghor souhaitait que ses poèmes soient psalmodiés, accompagnés d’une kora. Ou Ronsard, « Quand vous serez bien vieille », pour comparer deux manières de vaincre le temps.",
  ],
};

/**
 * Texte 2 : poème annoté au cours oral (2026-11-20), puis analyse écrite du prof (M. Waquet,
 * 12 pages, reçue le 2026-11-21). Plan du prof : deux mouvements, et dans chacun deux
 * interprétations distinctes (parodique et misogyne / féministe et critique sociale). Les deux
 * lectures ont chacune leur couleur (`registre` et `theme`) pour pouvoir les afficher à part.
 */
export const VENUS_ANADYOMENE: TexteBac = {
  id: "rimbaud-venus-anadyomene",
  genre: "poesie",
  titre: "Vénus Anadyomène",
  auteur: "Arthur Rimbaud",
  date: "27 juillet 1870",
  forme: "Sonnet d’alexandrins (2 quatrains, 2 tercets)",
  categories: { registre: "Lecture 1 : parodie misogyne", theme: "Lecture 2 : critique sociale" },
  essentiel: [
    "==Un contre-blason== : Rimbaud dégrade le motif mythologique de la naissance de Vénus (Hésiode, Botticelli), décrivant le corps de haut en bas, de la tête à « l’anus ».",
    "==Deux lectures contradictoires, à garder séparées== : 1. un poème parodique et misogyne (l’adolescent rebelle prend à revers le topos de l’éloge de Vénus, par esprit potache) ; 2. un poème féministe porteur d’une critique sociale (comment une bourgeoisie hypocrite traite les prostituées : maladie, misère).",
    "L’intérêt du poème est de rendre possibles ces deux lectures : ==cette ouverture du sens est une marque de modernité==, elle laisse l’initiative au lecteur. Aujourd’hui, la lecture féministe paraît la plus convaincante.",
    "Indices de la prostitution : « fortement pommadés » et le tatouage repris de Glatigny (« Les Antres malsains »), Vénus (en latin venus : vente), l’échine rouge et l’ulcère (syphilis, maladie « vénérienne »), la « loupe » du médecin hygiéniste.",
    "La chute : CLARA VENUS est l’anagramme de VLCERA ANVS ; « Belle hideusement », un oxymore. Rimbaud vise aussi le Parnasse et l’art pour l’art, qui détourne les yeux de la réalité sociale.",
  ],
  lecture: "Lecture expressive : bien prononcer les « e » devant consonne. Un ton neutre, presque clinique, puis ralentir sur la chute.",
  introduction: [
    "Arthur Rimbaud (1854-1891) naît à Charleville dans la petite bourgeoisie ; il fuit un climat familial étouffant dans la poésie, encouragé par son professeur Georges Izambard. Il rêve de rejoindre les Parnassiens, admire leur art mais s’en éloigne vite, car sa poésie a une forte dimension politique. Pour lui, le poète doit se faire « voyant » (lettre à Paul Demeny, mai 1871). Il cesse d’écrire vers 1875.",
    "Le poème, daté du 27 juillet 1870, appartient au recueil Demeny (Cahiers de Douai) : vingt-deux poèmes confiés au poète Paul Demeny en septembre-octobre 1870, en vue d’une publication.",
    "Il reprend ==un célèbre motif mythologique tiré d’Hésiode : la naissance de Vénus, déesse de l’amour et de la beauté, dans la mer==, peinte par Apelle puis Botticelli, chantée par Sully Prudhomme (« Naissance de Vénus », 1865). « Anadyomène » signifie « sortie de », « surgie vers le haut ». Rimbaud la dégrade dans un ==contre-blason== (un blason célèbre une partie du corps, un contre-blason la dégrade).",
    "Par sa tonalité polémique et son propos obscène, le poème a suscité deux lectures contradictoires : parodique et misogyne, ou féministe et critique sociale. Le choix d’un sonnet, forme classique, rend plus choquant un sujet (la prostitution) qui contrevient à la bienséance.",
  ],
  problematique:
    "Comment, sous couvert d’une parodie du mythe de Vénus, Rimbaud sensibilise-t-il le lecteur aux conditions de vie des prostituées ?",
  mouvements: [
    {
      titre: "Les quatrains : une Vénus repoussante, une prostituée dégradée",
      fiche: [
        "Le titre n’a rien de polémique : « Vénus sortant de »… la mer, ou sa baignoire. La description suit le regard d’un témoin : la tête, puis la descente le long du corps, de dos.",
        "==Première lecture (parodique et misogyne)== : l’attente du lecteur est déçue. Contre-rejet qui déséquilibre l’alexandrin, termes péjoratifs (« vieille », « lente et bête », « déficits assez mal ravaudés »), mer réduite à une baignoire-cercueil, conte horrifique. Dans le second quatrain, Rimbaud passe en revue avec jubilation les attraits de la déesse pour les dégrader (graisse, rondeurs, « Qui saillent »). On a pu y lire une détestation des femmes, ou un jeu potache contre les versions latines.",
        "==Seconde lecture (féministe, critique sociale)== : « fortement pommadés » renvoie à Glatigny, « Les Antres malsains » : la femme est une prostituée. Vénus signifie aussi « vente » en latin. « Comme » est un modalisateur : le regard visionnaire du poète voit la vraie condition des prostituées, un pied dans la tombe. « Lente et bête » : faute d’éducation, sous un Second Empire qui pousse les femmes du peuple à la prostitution tout en la condamnant hypocritement.",
        "Les sens se superposent : « déficits » (défauts physiques et pauvreté), « ravaudés » (raccommodés, et en ardennais « ravau » = rabais : elle baisse ses tarifs). La caricature, comme chez Daumier, peut dénoncer plutôt que se moquer : tonalité pathétique.",
      ],
      passages: [
        {
          chapeau: true,
          lignes: ["Vénus Anadyomène"],
          annotations: [
            {
              extrait: "Vénus Anadyomène",
              cle: true,
              cat: "vers",
              titre: "Un titre sans polémique",
              texte: "« Anadyomène » : qui sort de la mer. Le préfixe ana (mouvement de bas en haut) inverse duomai (se plonger) : « Vénus sortant de ». Elle peut sortir de la mer… ou de sa baignoire. Vénus est un topos littéraire : le lecteur attend un éloge.",
              retenir: "Vénus sortant de… sa baignoire",
            },
          ],
        },
        {
          lignes: [
            "Comme d’un cercueil vert en fer blanc, une tête",
            "De femme à cheveux bruns fortement pommadés",
            "D’une vieille baignoire émerge, lente et bête,",
            "Avec des déficits assez mal ravaudés ;",
          ],
          annotations: [
            {
              extrait: "Comme d’un",
              cat: "theme",
              titre: "« Comme », modalisateur",
              texte: "Pas un outil de comparaison mais un modalisateur, qui marque le regard du poète : visionnaire, il voit au-delà du réel la condition des prostituées. La baignoire-cercueil dit une santé fragile : elle a déjà un pied dans la tombe.",
            },
            {
              extrait: "cercueil vert en fer blanc",
              cle: true,
              cat: "registre",
              titre: "Un conte horrifique",
              texte: "Les morts sortent de leur tombeau : « cercueil », matériaux froids comme la mort, consonnes dures comme le fer. L’emphase place le comparant avant le comparé (« vieille baignoire », v. 3) : effet d’attente, description macabre.",
              retenir: "la baignoire est un cercueil",
            },
            {
              extrait: "une tête",
              cat: "vers",
              titre: "Enjambement et contre-rejet",
              texte: "« une tête / De femme… » : le contre-rejet déséquilibre l’alexandrin, alors qu’on attend l’harmonie d’un poème célébrant Vénus. La description commence par la tête puis descend le long du corps.",
            },
            {
              extrait: "fortement pommadés",
              cle: true,
              cat: "theme",
              titre: "Un indice : Glatigny",
              texte: "Probable référence aux « Antres malsains » de Glatigny, poème sur la prostitution : la femme est une prostituée. Les cheveux pommadés masquent peut-être une maladie (la syphilis fait tomber les cheveux), une calvitie ou des poux.",
            },
            {
              extrait: "vieille baignoire",
              cle: true,
              cat: "figure",
              titre: "Hypallage et réduction parodique",
              texte: "« Vieille » renvoie moins à la baignoire qu’à la femme. La mer du mythe est réduite aux dimensions d’une baignoire : parodie.",
            },
            {
              extrait: "lente et bête",
              cat: "registre",
              titre: "À l’opposé de la déesse",
              texte: "Une attitude aux antipodes de la beauté, qui contrevient au topos. Seconde lecture : « bête » par manque d’éducation plus que par mépris, et « lente » par une santé fragile.",
            },
            {
              extrait: "déficits",
              cat: "theme",
              titre: "Défauts et pauvreté",
              texte: "Les défauts d’un corps dégradé, mais aussi une pauvreté accrue par cette dégradation : un déficit financier. La femme est jugée sur son physique, réifiée.",
            },
            {
              extrait: "mal ravaudés",
              cle: true,
              cat: "figure",
              titre: "Double sens",
              texte: "« Ravauder » : raccommoder de vieux vêtements. Un visage vieilli qu’on tente de masquer par des artifices, à l’opposé de la beauté naturelle de Vénus. En ardennais, « ravau » signifie rabais : une prostituée qui baisse ses tarifs, mais pas assez, à mesure que son corps se dégrade.",
              retenir: "Rimbaud joue sur plusieurs sens à la fois",
            },
          ],
        },
        {
          lignes: [
            "Puis le col gras et gris, les larges omoplates",
            "Qui saillent ; le dos court qui rentre et qui ressort ;",
            "Puis les rondeurs des reins semblent prendre l’essor ;",
            "La graisse sous la peau paraît en feuilles plates ;",
          ],
          annotations: [
            {
              extrait: "Puis",
              cat: "registre",
              titre: "Le contre-blason se poursuit",
              texte: "La femme sort de sa baignoire et dévoile son dos. Avec jubilation, Rimbaud passe en revue les attraits de la déesse pour les dégrader : une surenchère de termes péjoratifs. Derrière la parodie, on a pu lire une détestation de la femme, ou un poème potache contre les versions latines.",
            },
            {
              extrait: "le col gras et gris",
              cat: "vers",
              titre: "Allitération en « gr »",
              texte: "La morbidité du cou (« gris ») et l’excès de poids (« gras ») : les sonorités alourdissent ce corps ruiné.",
            },
            {
              extrait: "Qui saillent",
              cle: true,
              cat: "figure",
              titre: "Rejet et double sens",
              texte: "Un rejet à la sonorité désagréable. « Saillir » : former une saillie, mais aussi s’accoupler, pour un mâle. Les omoplates prennent une connotation sexuelle : réification (un corps sans âme) et animalisation.",
              retenir: "saillir : ressortir et s’accoupler",
            },
            {
              extrait: "qui rentre et qui ressort",
              cat: "vers",
              titre: "Répétition et allitération en « r »",
              texte: "Trois « qui », l’allitération en « r » (court, rentre, ressort, rondeurs, reins, prendre) : la lourdeur du corps. Les relatives peuvent aussi faire penser à l’accouplement.",
            },
            {
              extrait: "semblent prendre l’essor",
              cat: "figure",
              titre: "Une chair qui s’échappe",
              texte: "Les rondeurs semblent autonomes, la chair en trop s’envole : réminiscence du vol dans le poème de Glatigny. La femme est réifiée.",
            },
            {
              extrait: "La graisse sous la peau",
              cle: true,
              cat: "theme",
              titre: "Caricaturer pour dénoncer",
              texte: "Seconde lecture : un corps abîmé par la prostitution, la pauvreté, le déclassement. Pourquoi en rire ? Comme Daumier, la caricature peut prendre le parti de la victime : la tonalité devient pathétique.",
              retenir: "caricaturer n’est pas se moquer",
            },
            {
              extrait: "en feuilles plates",
              cat: "figure",
              titre: "Métaphore",
              texte: "La graisse dessine les nervures d’une feuille : Rimbaud décrit sans doute des vergetures.",
            },
          ],
        },
      ],
    },
    {
      titre: "Les tercets : voir autrement la condition de prostituée",
      fiche: [
        "==Première lecture== : le contre-blason se poursuit (« échine », la viande de porc), l’odorat après la vue, l’oxymore « Horrible étrangement » d’inspiration baudelairienne. Le « on » réunit poète et lecteur, voyeurs complices ; les points de suspension préparent le pire. La chute choque le bourgeois : Venus rime avec anus.",
        "==Seconde lecture== : la « loupe » est une consigne, le « on » devient le regard du médecin hygiéniste. À la différence de Glatigny, Rimbaud élimine le désir masculin : une vision objective.",
        "Le tatouage « Clara Venus », référence trop savante pour un proxénète, est sans doute l’œuvre d’un client bourgeois et cultivé : une marque infâmante d’ironie, tragique, car la femme ne peut plus rejoindre son modèle.",
        "L’ulcère n’est pas là seulement pour choquer : il montre les maladies et les violences infligées aux prostituées (étude du médecin Parent-Duchâtel). Rimbaud refuse le regard voyeur et hypocrite des bourgeois du Second Empire, et s’écarte de l’art pour l’art parnassien.",
      ],
      passages: [
        {
          lignes: [
            "L’échine est un peu rouge, et le tout sent un goût",
            "Horrible étrangement ; on remarque surtout",
            "Des singularités qu’il faut voir à la loupe…",
          ],
          annotations: [
            {
              extrait: "L’échine",
              cat: "registre",
              titre: "Un corps-viande",
              texte: "La colonne vertébrale, mais aussi la viande de porc : le corps devient un tas de viande, animalisé, comme dépourvu d’âme (« bête »).",
            },
            {
              extrait: "un peu rouge",
              cle: true,
              cat: "theme",
              titre: "Les marques de la syphilis",
              texte: "Les rougeurs renvoient sans doute à la syphilis, maladie « vénérienne » (qui vient de Vénus). Première lecture : la beauté retournée en laideur mortelle, image d’une laideur morale.",
            },
            {
              extrait: "sent un goût",
              cat: "figure",
              titre: "Après la vue, l’odorat",
              texte: "Loin du parfum d’une déesse, une odeur repoussante, mise en valeur par l’enjambement qui rejette « Horrible » en début de vers.",
            },
            {
              extrait: "Horrible étrangement",
              cle: true,
              cat: "figure",
              titre: "Oxymore baudelairien",
              texte: "« Étrangement » dit une odeur inédite, indescriptible. Comme Baudelaire, qui extrait « l’or de la boue » (« Une Charogne »), Rimbaud fait d’un sujet dégradé un poème en alexandrins, contre le culte romantique de la beauté.",
            },
            {
              extrait: "on remarque",
              cle: true,
              cat: "figure",
              titre: "Le « on » change de sens",
              texte: "Première lecture : le poète et le lecteur, voyeurs complices, fascinés et repoussés. Seconde lecture : le regard du médecin hygiéniste de l’époque.",
            },
            {
              extrait: "qu’il faut voir à la loupe…",
              cle: true,
              cat: "theme",
              titre: "Une consigne impérieuse",
              texte: "Redoubler d’attention sur ce que la prostituée montre, et sur ce que Rimbaud choisit de montrer. Il élimine le désir masculin de Glatigny : une vision objective. Les points de suspension créent l’attente (première lecture : une méchanceté, une vengeance).",
              retenir: "regarder comme un médecin",
            },
          ],
        },
        {
          lignes: [
            "Les reins portent deux mots gravés : Clara Venus ;",
            "— Et tout ce corps remue et tend sa large croupe",
            "Belle hideusement d’un ulcère à l’anus.",
          ],
          annotations: [
            {
              extrait: "deux mots gravés",
              cat: "theme",
              titre: "Un tatouage de client",
              texte: "Le souteneur tatouait sa prostituée (Alain Corbin). Mais « Clara Venus », l’illustre Vénus, est trop savante pour un proxénète : sans doute un client bourgeois et cultivé (Clara est un prénom bourgeois). Il a marqué sa préférée comme une statue, mais le corps change plus vite : une marque infâmante d’ironie, tragique.",
            },
            {
              extrait: "Clara Venus",
              cle: true,
              cat: "figure",
              titre: "Anagramme",
              texte: "En latin, où u s’écrit v, CLARA VENVS devient VLCERA ANVS. La rime Venus / anus est scandaleuse, faite pour choquer le bourgeois. En latin, anus signifie aussi « vieille femme » et venus « vente » : une vieille prostituée.",
              retenir: "Clara Venus = ulcera anus",
            },
            {
              extrait: "tend sa large croupe",
              cat: "registre",
              titre: "S’offrir ou se montrer ?",
              texte: "Première lecture : elle s’offre passivement au lecteur voyeur, rapport inégal entre les sexes et les classes. Seconde lecture : non pour exciter le désir, mais pour qu’on observe, comme un médecin, les blessures infligées.",
            },
            {
              extrait: "Belle hideusement",
              cle: true,
              cat: "figure",
              titre: "Oxymore",
              texte: "« Hideusement », quatre syllabes, insiste sur la laideur. Première lecture : une ironie. Seconde lecture : le sens de tout oxymore, une réalité contradictoire ; elle reste belle malgré sa laideur, ce qui suscite la pitié.",
              retenir: "la chute résume le poème",
            },
            {
              extrait: "d’un ulcère à l’anus",
              cle: true,
              cat: "theme",
              titre: "Dénoncer la violence",
              texte: "Pas seulement pour dégoûter : une maladie vénérienne et les violences infligées aux prostituées lors des rapports, qu’étudie le médecin Parent-Duchâtel. Le lecteur est mis face à une réalité qu’il ne veut pas voir.",
            },
          ],
        },
      ],
    },
  ],
  conclusion: [
    "==Les deux interprétations, parodique-misogyne et féministe-sociale, montrent la difficulté d’un poème en apparence simple== : il faut connaître le contexte idéologique, les références à Glatigny et aux autres poèmes de Rimbaud, et lire les différents sens d’un même mot.",
    "Aujourd’hui, la lecture féministe paraît la plus convaincante : il a fallu plus d’un siècle pour retrouver le sens initial du poème. Comprendre une œuvre est un exercice d’humilité.",
    "Rimbaud vise le Parnasse et l’art pour l’art : son poème choque, non gratuitement, mais pour faire prendre conscience de la condition des prostituées et de l’hypocrisie bourgeoise, qui condamne la prostitution tout en la pratiquant. Comme chez Daumier, la caricature attire l’attention sur une réalité sordide.",
    "Ouvertures : « Nana » de Zola (1880), « La Maison Tellier » de Maupassant (1881), « La Vengeance d’une femme » de Barbey d’Aurevilly (1883) ; ou Baudelaire, qui transforme la boue en or (« Une Charogne »).",
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
      VENUS_ANADYOMENE,
      { titre: "Troisième texte de l’œuvre", attente: "Envoie le texte et l’explication du prof" },
      FEMME_NOIRE,
    ],
  },
  { genre: "theatre", places: [] },
  { genre: "roman", places: [] },
  { genre: "idees", places: [] },
];

export const TEXTES_BAC: TexteBac[] = PROGRAMME_BAC.flatMap((g) =>
  g.places.filter((p): p is TexteBac => "mouvements" in p),
);
