import type { SujetDiss } from "@/lib/dissertation";

/**
 * Deux nouveaux sujets corrigés sur les Cahiers de Douai (parcours « Émancipations créatrices »),
 * rédigés le 2026-11-28 sur le modèle de `DISSERTATION_RIMBAUD.sujets` : le corps et les sensations
 * (sujet-citation tiré de la lettre à Demeny de mai 1871, telle que la cite le cours), puis
 * « liberté ou provocation ». Chaque citation est recopiée des textes recopiés dans Luno
 * (`rimbaud-textes.ts`, `bac-francais.ts`, `EFFARES`, vers vérifiés de `dissertations.ts`).
 * Sujets d’entraînement : méthode et copie modèle, jamais un devoir à rendre.
 */
export const SUJETS_RIMBAUD_NOUVEAUX: SujetDiss[] = [
  {
    id: "corps",
    sujet:
      "Dans une lettre à Paul Demeny de mai 1871, Rimbaud affirme que le poète doit se faire « voyant » par un « immense et raisonné dérèglement de tous les sens ». Peut-on dire que, dès les Cahiers de Douai, le corps et les sensations sont au cœur de l’émancipation poétique de Rimbaud ?",
    type: "Sujet-citation suivi d’une question « Peut-on dire » : expliquer la citation, puis la confronter au recueil, écrit un an plus tôt. Plan nuancé : oui, les sens libèrent le poète et défient la morale ; mais ce n’est pas encore un « dérèglement » : les sensations restent rêvées et maîtrisées par l’écriture (le mot « raisonné » de la citation).",
    motsCles: [
      { mot: "voyant", sens: "Le poète qui voit au-delà du réel ordinaire : pour Rimbaud en 1871, c’est le but de la poésie." },
      { mot: "immense et raisonné dérèglement de tous les sens", sens: "Ne plus percevoir le monde selon les habitudes et la raison, mais bouleverser ses sensations, volontairement et avec méthode. « Raisonné dérèglement » est un oxymore : la nuance est dans la citation elle-même." },
      { mot: "dès", sens: "La lettre est postérieure au recueil : on cherche dans les Cahiers de Douai des germes de ce programme, sans faire comme s’ils l’appliquaient." },
      { mot: "le corps et les sensations", sens: "Ce que le poète perçoit (toucher, vue, odorat, goût), mais aussi le désir, le corps des autres et sa laideur." },
      { mot: "émancipation poétique", sens: "Se libérer des règles, des sujets nobles et de la morale : le parcours ajoute « créatrice »." },
    ],
    problematique:
      "Le corps et les sensations sont-ils déjà, dans les Cahiers de Douai, l’instrument d’une libération poétique, et le « dérèglement » annoncé en 1871 y est-il déjà à l’œuvre, ou reste-t-il maîtrisé par l’écriture ?",
    plan: [
      {
        titre: "I. Les sens, chemin de la liberté",
        idee: "S’émanciper, c’est d’abord sentir : le corps du marcheur découvre le monde, et ce contact devient une source de liberté et de poésie.",
        arguments: [
          {
            idee: "La sensation remplace la pensée.",
            poeme: "Sensation",
            citation: "« Je ne parlerai pas, je ne penserai rien : / Mais l’amour infini me montera dans l’âme, »",
            analyse: "Parallélisme de deux négations au futur qui effacent la parole et la pensée, puis « Mais », en tête du vers suivant, renverse le mouvement : c’est du corps laissé à lui-même que naît « l’amour infini » (hyperbole). La sensation prend la place de la raison : un premier pas vers une poésie des sens.",
          },
          {
            idee: "La sensation enivre et inspire.",
            poeme: "Ma Bohème",
            citation: "« Ces bons soirs de septembre où je sentais des gouttes / De rosée à mon front, comme un vin de vigueur ; »",
            analyse: "L’imparfait « sentais » dit une expérience vécue et répétée ; l’enjambement fait glisser la phrase comme la goutte ; la comparaison avec le « vin de vigueur » change la fraîcheur en ivresse. Le marcheur pauvre trouve sa richesse dans ce que perçoit son corps.",
          },
          {
            idee: "Le plaisir des sens fait entrer le quotidien dans le sonnet.",
            poeme: "Au Cabaret-Vert",
            citation: "« Du jambon rose et blanc parfumé d’une gousse / D’ail »",
            analyse: "Les couleurs, puis l’odeur : une fête des sens ; le rejet de « D’ail » brise l’alexandrin sur un mot prosaïque, presque comique. Le corps qui savoure libère le sonnet des sujets nobles.",
          },
        ],
      },
      {
        titre: "II. Le corps, arme contre la morale bourgeoise",
        idee: "Désirant ou dégradé, le corps exhibé défie la respectabilité bourgeoise et le culte de la beauté.",
        arguments: [
          {
            idee: "Le corps désirant du poète contre les bourgeois figés.",
            poeme: "À la Musique",
            citation: "« Je reconstruis les corps, brûlé de belles fièvres. »",
            analyse: "Métaphore du feu de la passion, portée par l’allitération en b et en l : face aux bourgeois réifiés de la première partie, le poète « débraillé » affirme un corps qui désire. C’est par là qu’il se met à l’écart de la place et se libère.",
          },
          {
            idee: "Un désir écrit dans une langue crue.",
            poeme: "Au Cabaret-Vert",
            citation: "« Quand la fille aux tétons énormes, aux yeux vifs, »",
            analyse: "Le mot familier « tétons » et l’hyperbole « énormes » : le regard d’un adolescent partagé entre la servante nourricière, qui rappelle la mère, et le désir. Le corps féminin entre dans le sonnet sans idéalisation.",
          },
          {
            idee: "Le corps dégradé contre le culte de la beauté.",
            poeme: "Vénus Anadyomène",
            citation: "« L’échine est un peu rouge, et le tout sent un goût / Horrible étrangement »",
            analyse: "Contre-blason : « L’échine » évoque la viande de porc, l’enjambement rejette « Horrible » en tête de vers, l’oxymore rappelle Baudelaire. Lecture 1 : la beauté de Vénus retournée en laideur (parodie). Lecture 2 : un corps abîmé par la prostitution, que la société ne veut pas voir. Dans les deux, le corps choque et libère la poésie du beau idéal.",
          },
        ],
      },
      {
        titre: "III. Des sens encore « raisonnés » : rêvés et composés par l’écriture",
        idee: "Le recueil ne dérègle pas encore les sens : il les rêve, les suggère et les met en forme ; c’est le mot « raisonné », plus que « dérèglement », qui lui convient.",
        arguments: [
          {
            idee: "La sensation est rêvée plus que vécue.",
            poeme: "Sensation",
            citation: "« Picoté par les blés, fouler l’herbe menue : / Rêveur, j’en sentirai la fraîcheur à mes pieds. »",
            analyse: "Le futur « sentirai » et l’adjectif « Rêveur » en tête de vers : la sensation est un projet (le futur de « Sensation » contre l’imparfait de « Ma Bohème »). Des perceptions précises et ordonnées, dans deux quatrains réguliers : rien n’est encore bouleversé.",
          },
          {
            idee: "Le désir reste un fantasme, et l’écriture s’arrête à temps.",
            poeme: "À la Musique",
            citation: "« J’ai bientôt déniché la bottine, le bas… »",
            analyse: "Aposiopèse : les points de suspension interrompent la phrase et laissent le lecteur imaginer la suite ; « déniché » garde un sous-entendu grivois. Le corps est suggéré, non montré : une malice qui suppose une parfaite maîtrise des effets.",
          },
          {
            idee: "La sensation est composée comme un tableau.",
            poeme: "Au Cabaret-Vert",
            citation: "« Que dorait un rayon de soleil arriéré. »",
            analyse: "Chute lumineuse : la lumière de fin de journée dore la mousse de la bière et transfigure un moment banal ; le sonnet finit sur une image de peintre. L’expérience du corps devient une œuvre construite, placée à l’endroit le plus travaillé du sonnet.",
          },
        ],
      },
    ],
    transitions: [
      "Mais le corps n’est pas seulement une source de joie : chez un adolescent de 1870, montrer le désir et la chair, c’est aussi défier une société qui les cache.",
      "Ces corps sentis, désirés ou dégradés sont pourtant moins vécus qu’imaginés et composés : le « dérèglement » de la lettre de 1871 reste ici tenu par l’écriture.",
    ],
    conclusion:
      "Dès les Cahiers de Douai, le corps et les sensations sont au cœur de l’émancipation de Rimbaud : ils libèrent le poète de la pensée et des sujets nobles, et, désirants ou dégradés, ils défient la morale bourgeoise. Mais ce n’est pas encore le « dérèglement » de 1871 : les sensations sont rêvées, suggérées et composées avec maîtrise. Le recueil illustre surtout le mot « raisonné » : une émancipation créatrice, qui fait des sensations la matière du poème.",
    ouverture:
      "Senghor, dans « Femme noire », texte de notre parcours, fait lui aussi du corps et des sens un chemin de libération : en célébrant le « Fruit mûr à la chair ferme », il chante une beauté noire que la tradition occidentale de l’éloge avait ignorée.",
    pieges: [
      "Faire comme si la lettre de 1871 était dans le recueil : elle est postérieure d’un an ; on y cherche des germes, pas une application.",
      "Oublier le mot « raisonné » : la citation est un oxymore, et c’est là que se trouve la nuance de la troisième partie.",
      "Faire un catalogue des cinq sens au lieu d’un plan qui répond à la question.",
      "Confondre le « je » qui sent et l’homme Rimbaud : le corps du poème est celui d’un personnage de poète.",
      "Analyser « Vénus Anadyomène » d’une seule façon : le cours en propose deux lectures, à nommer séparément.",
    ],
    introduction:
      "En mars 1870, un lycéen de Charleville de quinze ans écrit « Sensation », un poème de huit vers où il rêve d’aller « loin, bien loin », guidé par ce que perçoit son corps. Un an plus tard, dans une lettre à Paul Demeny de mai 1871, Rimbaud affirme que le poète doit se faire « voyant » par un « immense et raisonné dérèglement de tous les sens ». La formule, postérieure aux Cahiers de Douai, fait des sens l’outil même de la poésie : il ne s’agit plus de décrire le monde avec la raison, mais de le percevoir autrement, volontairement et avec méthode, comme le suggère l’oxymore « raisonné dérèglement ». Les vingt-deux poèmes recopiés à Douai à l’automne 1870 annoncent-ils déjà ce programme d’émancipation ? On se demandera si le corps et les sensations y sont déjà l’instrument d’une libération poétique, ou si ce « dérèglement » reste encore à venir. Nous verrons d’abord que les sens libèrent le poète et le font entrer dans le monde, puis que le corps devient une arme contre la morale bourgeoise, avant de montrer que ces sensations restent rêvées et maîtrisées : moins un dérèglement qu’une écriture « raisonnée » des sens.",
    developpe: {
      parties: [
        "Dans les Cahiers de Douai, s’émanciper, c’est d’abord sentir : le corps du marcheur découvre le monde, et ce contact devient une source de liberté et de poésie.\n\nDans « Sensation », le poète rêve d’une libération qui passe par le silence de l’esprit : « Je ne parlerai pas, je ne penserai rien : / Mais l’amour infini me montera dans l’âme ». Le parallélisme des deux propositions négatives au futur efface la parole et la pensée, puis la conjonction « Mais », en tête du vers suivant, renverse le mouvement : c’est du corps laissé à lui-même que naît « l’amour infini », hyperbole d’un bonheur sans limite. Le poète remplace la raison par la sensation, ce qui annonce déjà, sous une forme encore simple, la poésie des sens que réclamera la lettre de 1871.\n\n« Ma Bohème » fait de cette expérience un souvenir vécu. Le poète évoque « Ces bons soirs de septembre où je sentais des gouttes / De rosée à mon front, comme un vin de vigueur ». Le verbe « sentais », à l’imparfait, dit une expérience répétée, et l’enjambement fait glisser la phrase comme la goutte sur le front. Surtout, la comparaison avec le « vin de vigueur » transforme une simple sensation de fraîcheur en ivresse : le marcheur pauvre, aux « poches crevées », trouve sa richesse dans ce que perçoit son corps, et cette ivresse naturelle nourrit son inspiration.\n\nEnfin, dans « Au Cabaret-Vert », le plaisir des sens fait entrer le quotidien dans la poésie. Le dernier tercet détaille « Du jambon rose et blanc parfumé d’une gousse / D’ail » : les couleurs précises, puis l’odeur, font de l’assiette une fête des sens, et le rejet de « D’ail » brise l’alexandrin sur un mot prosaïque, presque comique. Le corps qui savoure libère ainsi le sonnet des sujets nobles : la sensation est déjà, en elle-même, une émancipation créatrice.\n\nMais le corps n’est pas seulement une source de joie : chez un adolescent de 1870, montrer le désir et la chair, c’est aussi défier une société qui les cache.",
        "Le corps devient en effet, dans le recueil, une arme contre la morale et l’idéal bourgeois : désirant ou dégradé, il choque et il libère.\n\nDans « À la Musique », le corps vivant du poète s’oppose aux bourgeois figés. Dans la première partie du poème, ceux-ci sont réifiés, confondus avec leurs objets et leurs apparences ; dans la seconde, le jeune homme « débraillé » suit des yeux les jeunes filles et avoue : « Je reconstruis les corps, brûlé de belles fièvres. » La métaphore du feu, soutenue par l’allitération en b et en l, dit un désir qui monte, à l’opposé de la respectabilité de la place de la gare. Face à une classe qui se confond avec ce qu’elle possède, le poète affirme un corps qui désire : c’est par là qu’il se met à l’écart et se libère.\n\nDans « Au Cabaret-Vert », ce désir s’écrit dans une langue plus crue. La servante est « la fille aux tétons énormes, aux yeux vifs » : le mot familier « tétons » et l’hyperbole « énormes » traduisent le regard d’un adolescent partagé entre la joie enfantine, puisque la servante nourricière rappelle la mère, et le désir. Le corps féminin entre dans le sonnet sans idéalisation, ce qui heurte les convenances de la poésie amoureuse.\n\nLe corps peut enfin devenir une provocation violente. « Vénus Anadyomène » est un contre-blason : la description descend le long du corps de la déesse pour le dégrader, jusqu’à l’odeur : « L’échine est un peu rouge, et le tout sent un goût / Horrible étrangement ». « L’échine » fait penser à la viande de porc, l’enjambement rejette « Horrible » en tête de vers, et l’oxymore « Horrible étrangement » rappelle Baudelaire. Selon une première lecture, Rimbaud parodie la beauté classique et retourne la déesse en laideur ; selon une seconde lecture, il montre un corps abîmé par la prostitution, que la société ne veut pas voir. Dans les deux cas, le corps exhibé choque le lecteur et libère la poésie du culte de la beauté.\n\nCes corps sentis, désirés ou dégradés sont pourtant moins vécus qu’imaginés et composés : le « dérèglement » dont parlera la lettre de 1871 reste ici tenu par l’écriture.",
        "Les sens du recueil ne sont donc pas encore « déréglés » : ils sont rêvés, suggérés et mis en forme avec une grande maîtrise, ce qui correspond davantage à l’adjectif « raisonné » de la lettre.\n\nD’abord, la sensation est souvent un rêve plus qu’une expérience. Dans « Sensation », le poète écrit : « Picoté par les blés, fouler l’herbe menue : / Rêveur, j’en sentirai la fraîcheur à mes pieds. » Le futur « sentirai » et l’adjectif « Rêveur », placé en tête de vers, montrent que la sensation est imaginée avant d’être vécue : à la différence de l’imparfait de « Ma Bohème », le futur de « Sensation » dit un projet. Les perceptions sont précises et ordonnées, le contact des blés puis la fraîcheur de l’herbe, dans deux quatrains réguliers : rien n’y est encore bouleversé.\n\nEnsuite, le désir reste un fantasme, et l’écriture s’arrête à temps. À la fin d’« À la Musique », le regard du poète descend le long du corps des jeunes filles : « J’ai bientôt déniché la bottine, le bas… ». Les points de suspension interrompent la phrase : cette aposiopèse laisse au lecteur le soin d’imaginer la suite, tandis que « déniché » garde un sous-entendu grivois. Le poète ne va pas plus loin que le fantasme : le corps est suggéré, non montré, avec une malice qui suppose une parfaite maîtrise des effets.\n\nEnfin, la sensation est composée comme un tableau. « Au Cabaret-Vert » s’achève sur la mousse de la bière « Que dorait un rayon de soleil arriéré. » La lumière de fin de journée transfigure un moment banal en instant de bonheur, et le sonnet finit sur une image de peintre. L’expérience du corps, la fatigue de la marche, la faim, le plaisir, devient une œuvre construite, placée à l’endroit le plus travaillé du sonnet : la chute. Le recueil ne dérègle pas les sens ; il les ordonne pour en faire de l’art.",
      ],
      conclusion:
        "Peut-on dire que, dès les Cahiers de Douai, le corps et les sensations sont au cœur de l’émancipation de Rimbaud ? Oui, en grande partie : ils libèrent le poète de la pensée et des sujets nobles, comme le montrent « Sensation », « Ma Bohème » et « Au Cabaret-Vert », et, désirants ou dégradés, ils deviennent une arme contre la morale bourgeoise dans « À la Musique » et « Vénus Anadyomène ». Mais ce n’est pas encore le « dérèglement de tous les sens » de 1871 : les sensations sont rêvées, suggérées et composées avec une grande maîtrise. Le recueil illustre surtout le mot « raisonné » : une émancipation créatrice, qui fait des sensations la matière même du poème.\n\nSenghor, dans « Femme noire », texte de notre parcours, fait lui aussi du corps et des sens un chemin de libération : en célébrant le « Fruit mûr à la chair ferme », il chante une beauté noire que la tradition occidentale de l’éloge avait ignorée.",
    },
  },
  {
    id: "provocation",
    sujet: "La poésie de Rimbaud, dans les Cahiers de Douai, est-elle une poésie de la liberté ou de la provocation ?",
    type: "Question alternative en « ou » : ne pas choisir trop vite l’un des deux termes. On montre la provocation, puis qu’elle sert la liberté, enfin que la liberté la plus profonde est celle d’une écriture à plusieurs sens, qui laisse le lecteur libre. La troisième partie ne doit pas redire la deuxième.",
    motsCles: [
      { mot: "liberté", sens: "Se libérer de ce qui entrave (milieu, pouvoirs, modèles poétiques), et libérer le lecteur : c’est le sens du parcours « Émancipations créatrices »." },
      { mot: "provocation", sens: "Chercher volontairement à choquer le lecteur, surtout le bourgeois : mots crus, rimes scandaleuses, irrévérence, blasphème. Elle peut être gratuite ou avoir un but." },
      { mot: "ou", sens: "Une alternative à dépasser : les deux termes peuvent aller ensemble, la provocation pouvant être une forme de la liberté." },
      { mot: "poésie", sens: "Pas seulement des idées : des formes, une langue, des procédés à analyser." },
    ],
    problematique:
      "La provocation n’est-elle chez Rimbaud qu’un plaisir de choquer, ou devient-elle le moyen d’une liberté, celle du poète comme celle du lecteur ?",
    plan: [
      {
        titre: "I. Une poésie qui cherche à choquer",
        idee: "Rimbaud provoque le lecteur bourgeois : rimes scandaleuses, ricanement devant la mort, mots crus.",
        arguments: [
          {
            idee: "Le nom de la déesse devient une marque infâmante.",
            poeme: "Vénus Anadyomène",
            citation: "« Les reins portent deux mots gravés : Clara Venus ; »",
            analyse: "Le tatouage (l’illustre Vénus, en latin) prépare la rime Venus / anus, faite pour choquer le bourgeois ; anagramme latine CLARA VENVS / VLCERA ANVS. Rimbaud s’attaque à l’un des sujets les plus nobles de la tradition pour heurter le bon goût.",
          },
          {
            idee: "Le ricanement devant les morts.",
            poeme: "Le Bal des pendus",
            citation: "« Hurrah ! les gais danseurs, qui n’avez plus de panse ! »",
            analyse: "Interjection, apostrophe ironique aux squelettes, adjectif « gais » et jeu sonore « danseurs » / « panse » : le gibet devient fête grotesque. Là où Villon appelait la pitié pour les pendus, Rimbaud ricane : la réécriture inverse son modèle.",
          },
          {
            idee: "Les mots crus salissent le lyrisme.",
            poeme: "Les Reparties de Nina",
            citation: "« Une vache fientera, fière, / À chaque pas… »",
            analyse: "Au milieu de la rêverie amoureuse de « Lui », un verbe trivial, mis en valeur par l’allitération en f : le décor idyllique est sali. L’auteur, en embuscade, mine le discours lyrique et défie les convenances de la poésie sentimentale.",
          },
        ],
      },
      {
        titre: "II. Une provocation au service de la liberté",
        idee: "Choquer sert à dénoncer : la provocation est l’arme d’une liberté qui s’affranchit du conformisme bourgeois, de l’Église et de l’Empire.",
        arguments: [
          {
            idee: "L’insolence contre la bourgeoisie de province.",
            poeme: "À la Musique",
            citation: "« Les gros bureaux bouffis traînent leurs grosses dames »",
            analyse: "Métonymie (les employés réduits à leurs « bureaux » : réification), redondance péjorative « gros » / « grosses », sonorités lourdes en b et gr, verbe « traînent » qui fait des épouses des fardeaux. La caricature libère le poète d’une société du paraître.",
          },
          {
            idee: "Le blasphème qui dénonce l’Église complice de la guerre.",
            poeme: "Le Mal",
            citation: "« — Il est un Dieu, qui rit aux nappes damassées / Des autels, à l’encens, aux grands calices d’or ; »",
            analyse: "Énumération des objets précieux du culte et verbe « rit » : un Dieu indifférent aux morts, attaché au luxe. La provocation envers le lecteur croyant dénonce le discours officiel qui bénit la guerre de 1870.",
          },
          {
            idee: "Déshabiller l’hypocrite, et le pouvoir.",
            poeme: "Le Châtiment de Tartufe",
            citation: "« — Peuh ! Tartufe était nu du haut jusques en bas ! »",
            analyse: "Chute irrévérencieuse : l’interjection méprisante et le dévot dénudé démasquent l’hypocrite. Deuxième lecture : Tartufe = Napoléon III (écho à « l’Homme pâle », acrostiche « Jules Cés » + A. R. = « Jules César », titre qui rappelle Les Châtiments de Hugo). Déshabiller le pouvoir, c’est s’en libérer.",
          },
        ],
      },
      {
        titre: "III. Une liberté plus profonde : des poèmes à plusieurs sens",
        idee: "Rimbaud programme plusieurs lectures : sa liberté de poète devient celle du lecteur, qui doit chercher le sens.",
        arguments: [
          {
            idee: "Un pathétique qui se dérobe.",
            poeme: "Les Effarés",
            citation: "« À genoux, cinq petits, — misère ! — / Regardent le Boulanger faire / Le lourd pain blond. »",
            analyse: "L’exclamation entre tirets appelle la pitié, mais la posture de prière est tournée vers le pain, pas vers Dieu, et le registre bas (« Leurs culs en rond ») casse l’attendrissement. Trois lectures possibles (réaliste, critique de la religion, critique de la bourgeoisie) : Rimbaud ne tranche pas.",
          },
          {
            idee: "Le lecteur doit choisir comment regarder.",
            poeme: "Vénus Anadyomène",
            citation: "« Des singularités qu’il faut voir à la loupe… »",
            analyse: "Consigne impérieuse et points de suspension ; le « on » change de sens : voyeurs complices (lecture 1, parodie qui peut sembler misogyne) ou regard du médecin hygiéniste (lecture 2, critique de la condition des prostituées). La provocation n’est pas le dernier mot : elle oblige à réfléchir.",
          },
          {
            idee: "Un « je » à double sens.",
            poeme: "À la Musique",
            citation: "« Moi, je suis, débraillé comme un étudiant »",
            analyse: "Emphase « Moi, je » contre les bourgeois ; « je suis » joue sur être (le poète est, quand les bourgeois ne font que paraître) et suivre (il suit des yeux les jeunes filles). Le vers affirme une identité libre et avoue un désir à la fois : une ambiguïté voulue.",
          },
        ],
      },
    ],
    transitions: [
      "Pourtant, cette provocation n’est pas gratuite : elle vise des cibles précises, et c’est en choquant que Rimbaud libère.",
      "Mais la liberté rimbaldienne ne se réduit pas à l’attaque : la provocation la plus profonde est peut-être de refuser au lecteur un sens unique.",
    ],
    conclusion:
      "La poésie des Cahiers de Douai est bien une poésie de la provocation, qui cherche à choquer le lecteur bourgeois. Mais cette provocation n’est pas gratuite : elle dénonce les bourgeois, l’Église et l’Empire, et c’est en choquant que le poète se libère. Plus profondément, la liberté de Rimbaud est celle d’une écriture qui programme plusieurs lectures : liberté et provocation ne s’opposent pas, la seconde est l’une des formes de la première.",
    ouverture:
      "Baudelaire, dont Rimbaud se souvient dans « Vénus Anadyomène », avait été condamné en 1857 pour Les Fleurs du mal : la provocation était déjà le prix d’une liberté poétique, celle de tirer une beauté nouvelle d’un sujet dégradé.",
    pieges: [
      "Choisir un seul des deux termes : le sujet attend qu’on montre comment la provocation sert la liberté.",
      "Faire de la provocation un caprice d’adolescent, sans analyser ses cibles ni ses procédés.",
      "Refaire le plan du sujet sur la révolte : ici, la troisième partie porte sur la liberté laissée au lecteur (plusieurs lectures), pas sur l’émerveillement.",
      "Citer les mots crus sans les analyser ni les situer dans le poème.",
      "Analyser « Vénus Anadyomène » d’une seule façon : nommer séparément les deux lectures du cours.",
    ],
    introduction:
      "En 1870, un lycéen de Charleville de quinze ans fait rimer, à la fin d’un sonnet, le nom de Vénus avec un mot cru qui devait scandaliser ses lecteurs. Les vingt-deux poèmes qu’il recopie à Douai à l’automne et confie à Paul Demeny, les Cahiers de Douai, sont pleins de ces audaces : mots crus, moqueries contre les bourgeois, l’Église et l’Empereur. D’où la question : la poésie de Rimbaud, dans ce recueil, est-elle une poésie de la liberté ou de la provocation ? La liberté, c’est se libérer de ce qui entrave, le milieu, les pouvoirs, les modèles poétiques, comme y invite le parcours « Émancipations créatrices » ; la provocation, c’est chercher volontairement à choquer le lecteur. La conjonction « ou » oppose les deux termes, comme s’il fallait choisir entre une liberté sérieuse et un simple goût du scandale. On se demandera donc si la provocation n’est chez Rimbaud qu’un plaisir de choquer, ou si elle devient le moyen d’une liberté, celle du poète comme celle du lecteur. Nous verrons d’abord que le recueil cherche à choquer, puis que cette provocation sert à dénoncer et à libérer, avant de montrer que la liberté la plus profonde de Rimbaud est celle d’une écriture à plusieurs sens.",
    developpe: {
      parties: [
        "Il est vrai, d’abord, que le recueil cherche à choquer : Rimbaud provoque son lecteur, et surtout le lecteur bourgeois, par des rimes scandaleuses, l’irrespect envers les morts et les mots crus.\n\nLa provocation la plus nette se trouve à la fin de « Vénus Anadyomène » : « Les reins portent deux mots gravés : Clara Venus ; ». Ce tatouage, qui veut dire l’illustre Vénus, semble rendre hommage à la déesse, mais il prépare la rime Venus / anus du dernier vers, faite pour scandaliser. On peut même y lire une anagramme : en latin, où le u s’écrit v, CLARA VENVS devient VLCERA ANVS. Le nom de la déesse de la beauté devient ainsi une marque infâmante : Rimbaud s’attaque à l’un des sujets les plus nobles de la tradition pour heurter le bon goût.\n\nDans « Le Bal des pendus », c’est le respect dû aux morts qui est bafoué. Le poète interpelle les squelettes : « Hurrah ! les gais danseurs, qui n’avez plus de panse ! » L’interjection, l’adjectif « gais » et le jeu sonore entre « danseurs » et « panse » transforment le gibet en fête grotesque. Là où « La Ballade des pendus » de Villon appelait la pitié, Rimbaud ricane : la réécriture inverse son modèle et provoque le lecteur, qui attendait la compassion.\n\nLa provocation passe enfin par des mots crus, introduits là où on ne les attend pas. Dans « Les Reparties de Nina », au milieu de la longue rêverie amoureuse de « Lui », surgit cette image : « Une vache fientera, fière, / À chaque pas… ». Le verbe trivial, mis en valeur par l’allitération en f, salit le décor idyllique de la campagne. L’auteur, en embuscade, mine de l’intérieur le discours lyrique de l’amoureux et défie les convenances de la poésie sentimentale.\n\nPourtant, cette provocation n’est pas gratuite : elle vise des cibles précises, et c’est en choquant que Rimbaud libère.",
        "Choquer sert en effet à dénoncer : la provocation est l’arme d’une liberté qui s’affranchit du conformisme bourgeois, de l’Église et du pouvoir impérial.\n\nDans « À la Musique », l’insolence vise la bourgeoisie de Charleville : « Les gros bureaux bouffis traînent leurs grosses dames ». Par une métonymie, les employés sont réduits à leurs « bureaux », c’est-à-dire réifiés, et la redondance péjorative « gros » / « grosses », soutenue par les sonorités lourdes en b et en gr, alourdit ce monde. Le verbe « traînent » fait des épouses des fardeaux. Cette caricature irrévérencieuse libère le poète d’une société du paraître, dont il se sépare ensuite, « débraillé comme un étudiant ».\n\nLa provocation devient blasphème dans « Le Mal ». Pendant que la guerre de 1870 fait des milliers de morts, « Il est un Dieu, qui rit aux nappes damassées / Des autels, à l’encens, aux grands calices d’or ». L’énumération des objets précieux du culte et le verbe « rit » font de Dieu un être indifférent, attaché au luxe. Montrer un Dieu qui rit pendant le massacre, c’est provoquer le lecteur croyant ; mais c’est surtout dénoncer une Église complice de la guerre et se libérer du discours officiel.\n\n« Le Châtiment de Tartufe » unit ces cibles. Le sonnet s’achève sur une chute irrévérencieuse : « — Peuh ! Tartufe était nu du haut jusques en bas ! » L’interjection méprisante et l’image du dévot dénudé démasquent l’hypocrite : arracher la « chaste robe noire », c’est révéler le désir qu’elle cache. Selon une deuxième lecture, Tartufe est Napoléon III : l’écho à « l’Homme pâle » de « Rages de Césars » et l’acrostiche des vers 4 à 11, complété par la signature A. R., qui forme « Jules César », visent l’empereur, et le titre rappelle Les Châtiments de Hugo. Déshabiller le pouvoir, c’est s’en libérer.\n\nMais la liberté rimbaldienne ne se réduit pas à l’attaque : la provocation la plus profonde est peut-être de refuser au lecteur un sens unique.",
        "La liberté la plus profonde du recueil est en effet celle de l’écriture : Rimbaud programme plusieurs lectures de ses poèmes, et sa liberté de poète devient celle du lecteur, qui doit chercher le sens.\n\n« Les Effarés » semblent d’abord un tableau pathétique : « À genoux, cinq petits, — misère ! — / Regardent le Boulanger faire / Le lourd pain blond. » L’exclamation entre tirets appelle la pitié. Mais la posture « À genoux », celle de la prière, est tournée vers le pain et non vers Dieu, et le registre bas de « Leurs culs en rond » empêche l’attendrissement facile. On peut lire le poème de trois façons : comme un tableau réaliste, comme une critique de la religion, puisque les enfants prient sans que rien ne change, ou comme une critique de la bourgeoisie. Rimbaud ne tranche pas : c’est au lecteur de se garder d’une lecture naïve.\n\n« Vénus Anadyomène » fait du regard même une question. Le poète prévient qu’on remarque « Des singularités qu’il faut voir à la loupe… ». La consigne impérieuse et les points de suspension créent l’attente, mais le « on » change de sens selon la lecture. Dans une première lecture, ce sont le poète et le lecteur, voyeurs complices, dans une parodie qui peut sembler misogyne ; dans une seconde lecture, c’est le regard du médecin hygiéniste, dans une critique de la condition des prostituées. La provocation n’est donc pas le dernier mot du poème : elle oblige le lecteur à choisir comment regarder.\n\nEnfin, le poète lui-même se dérobe à une définition simple. Dans « À la Musique », il se présente ainsi : « Moi, je suis, débraillé comme un étudiant ». L’emphase « Moi, je » l’oppose aux bourgeois, et le verbe joue sur deux sens : « je suis », c’est être, quand les bourgeois ne font que paraître ; c’est aussi suivre, puisqu’il suit des yeux les jeunes filles. Le vers affirme une identité libre et avoue un désir en même temps. Cette ambiguïté voulue montre que la liberté de Rimbaud tient moins au scandale qu’à une écriture à double sens.",
      ],
      conclusion:
        "La poésie des Cahiers de Douai est donc bien une poésie de la provocation : la rime Venus / anus, le ricanement devant les pendus ou la vache de « Nina » cherchent à choquer le lecteur bourgeois. Mais cette provocation n’est pas gratuite : elle dénonce les bourgeois de Charleville, une Église complice de la guerre et un empereur hypocrite, et c’est en choquant que le poète se libère. Plus profondément, la liberté de Rimbaud est celle d’une écriture qui programme plusieurs lectures et laisse le lecteur chercher le sens. Liberté et provocation ne s’opposent donc pas : la provocation est l’une des formes que prend une émancipation créatrice.\n\nBaudelaire, dont Rimbaud se souvient dans « Vénus Anadyomène », avait été condamné en 1857 pour Les Fleurs du mal : la provocation était déjà, pour lui, le prix d’une liberté poétique, celle de tirer une beauté nouvelle d’un sujet dégradé.",
    },
  },
];
