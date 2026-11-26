import type { Dissertation } from "@/lib/dissertation";
import { TEXTES_BAC } from "./bac-francais";
import { TEXTES_RIMBAUD } from "./rimbaud-textes";

/**
 * Dissertations sur les œuvres du bac de français (écrit du 15 juin 2027 : trois sujets, un par
 * œuvre de l'objet d'étude tiré). Rédigé le 2026-11-26 pour la dissertation en classe du jeudi
 * 10 décembre 2026 sur les Cahiers de Douai, à partir du cours sur Rimbaud déjà dans Luno
 * (`francais-rimbaud.ts`) et des analyses du prof (onglet Bac). Sujets d'entraînement, pas
 * le sujet du prof : on donne la méthode et des plans, jamais une copie entière à rendre.
 * Pot-Bouille viendra quand le parcours associé sera connu.
 */
export const DISSERTATION_RIMBAUD: Dissertation = {
  id: "diss-rimbaud",
  oeuvre: "Cahiers de Douai",
  auteur: "Arthur Rimbaud",
  parcours: "Émancipations créatrices",
  parcoursSens: [
    "==S’émanciper, c’est se libérer d’une tutelle== : la famille, l’école, la ville de province, la morale bourgeoise, l’Église, l’Empire de Napoléon III… et les modèles poétiques eux-mêmes.",
    "==« Créatrices » : cette libération produit une œuvre neuve.== Il ne suffit pas de montrer que Rimbaud se révolte ; il faut montrer que sa révolte invente une poésie (parodie, syllepses, mélange des registres, sonnet détourné).",
    "Le recueil est écrit en 1870 par un adolescent de 15-16 ans, pendant la guerre franco-prussienne et la chute du Second Empire, entre deux fugues : l’émancipation est à la fois vécue et écrite.",
    "Nuance attendue : Rimbaud reste dans une tradition (sonnets, alexandrins, imitation de Hugo, Villon, Molière, des Parnassiens) et c’est de l’intérieur qu’il la fait exploser.",
  ],
  axes: [
    { id: "milieu", titre: "S’émanciper de son milieu", resume: "Fugue, errance, sensations, rejet de la province bourgeoise et des convenances." },
    { id: "pouvoirs", titre: "S’émanciper des pouvoirs", resume: "Satire de Napoléon III, de l’Église, de la guerre et de la morale bourgeoise." },
    { id: "modeles", titre: "S’émanciper des modèles poétiques", resume: "Imiter pour détourner : parodie, réécriture, syllepses, mélange des registres." },
  ],
  sujets: [
    {
      id: "emancipation",
      sujet: "Dans quelle mesure les Cahiers de Douai sont-ils le recueil d’une émancipation ?",
      type: "« Dans quelle mesure » : il faut montrer que c’est vrai, puis jusqu’où c’est vrai. Plan nuancé en trois parties, la troisième répond « oui, mais une émancipation qui passe par la tradition ».",
      motsCles: [
        { mot: "Dans quelle mesure", sens: "Jusqu’à quel point : on attend une réponse nuancée, pas un oui ou un non." },
        { mot: "le recueil", sens: "L’ensemble des 22 poèmes : il faut des exemples variés, pas un seul poème." },
        { mot: "émancipation", sens: "Se libérer d’une tutelle : milieu, pouvoirs, modèles. Le parcours ajoute « créatrice »." },
      ],
      problematique: "En quoi la libération que chantent les Cahiers de Douai est-elle aussi, et surtout, une manière nouvelle d’écrire la poésie ?",
      plan: [
        {
          titre: "I. Un adolescent qui s’affranchit de son milieu",
          idee: "Le recueil fait de la fugue et des sensations une expérience de liberté contre la province et ses convenances.",
          arguments: [
            {
              idee: "La fugue devient un idéal de liberté.",
              poeme: "Ma Bohème",
              citation: "« Je m’en allais, les poings dans mes poches crevées ; / Mon paletot aussi devenait idéal »",
              analyse: "Syllepse sur « idéal » : le paletot est usé au point de n’être plus qu’une idée, et il devient parfait. La pauvreté de l’errance est transfigurée : se libérer, c’est voir le monde autrement.",
            },
            {
              idee: "La nature et le corps, contre l’enfermement.",
              poeme: "Sensation",
              citation: "« Et j’irai loin, bien loin, comme un bohémien, / Par la Nature, — heureux comme avec une femme. »",
              analyse: "Le futur et la répétition « loin, bien loin » font de la fugue un projet ; la comparaison sensuelle associe la liberté au plaisir du corps, ce que la morale de Charleville interdit.",
            },
            {
              idee: "Le rejet de la petite bourgeoisie de province.",
              poeme: "À la Musique",
              citation: "« Sur la place taillée en mesquines pelouses »",
              analyse: "L’adjectif péjoratif « mesquines » et le participe « taillée » caricaturent un monde étriqué et réglé ; le poète, « débraillé comme un étudiant », se place à l’écart des bourgeois réifiés.",
            },
          ],
        },
        {
          titre: "II. Une poésie qui se dresse contre les pouvoirs",
          idee: "L’émancipation est aussi politique : Rimbaud attaque l’Empire, l’Église et la guerre, souvent de façon cryptée.",
          arguments: [
            {
              idee: "Napoléon III ridiculisé.",
              poeme: "Le Châtiment de Tartufe",
              citation: "« Saint Tartufe était pâle »",
              analyse: "Écho de « l’Homme pâle » de « Rages de Césars » et acrostiche « Jules Cés » + A. R. (la signature) = « Jules César » (vers 4 à 11) : sous le dévot de Molière se cache l’empereur. La satire avance masquée, ce qui la rend plus mordante.",
            },
            {
              idee: "La guerre et l’Église qui la bénit.",
              poeme: "Le Mal",
              citation: "« Il est un Dieu, qui rit aux nappes damassées / Des autels »",
              analyse: "Le rire de Dieu devant le luxe des autels, pendant que les soldats meurent, dénonce une Église complice ; le sonnet sert à une révolte, pas à la célébration.",
            },
            {
              idee: "La guerre dénoncée par le contraste.",
              poeme: "Le Dormeur du val",
              citation: "« Il a deux trous rouges au côté droit. »",
              analyse: "La chute brutale renverse le tableau paisible du « trou de verdure » : le lecteur découvre que le dormeur est mort. Rimbaud s’émancipe du discours patriotique de 1870.",
            },
          ],
        },
        {
          titre: "III. Une émancipation créatrice, qui passe par la tradition",
          idee: "Rimbaud ne rompt pas d’un coup avec ses modèles : il les imite pour mieux les détourner, et c’est là qu’il invente.",
          arguments: [
            {
              idee: "Il réécrit les textes du passé en les renversant.",
              poeme: "Le Bal des pendus",
              citation: "« Au gibet noir, manchot aimable, / Dansent, dansent les paladins »",
              analyse: "Réécriture inversée de « La Ballade des pendus » de Villon : la pitié devient ricanement, et la danse macabre vise la cour de Napoléon III. L’intertextualité est une arme.",
            },
            {
              idee: "Il détourne le discours amoureux romantique.",
              poeme: "Les Reparties de Nina",
              citation: "« — Et mon bureau ? »",
              analyse: "Après une longue tirade amoureuse, la chute d’un vers, prosaïque, ridiculise à la fois l’amoureux lyrique et la jeune bourgeoise : Rimbaud prend ses distances avec le lyrisme qu’il imite.",
            },
            {
              idee: "Il libère le sonnet de l’intérieur.",
              poeme: "Ma Bohème",
              citation: "« Comme des lyres, je tirais les élastiques / De mes souliers blessés, un pied près de mon cœur ! »",
              analyse: "Dans un sonnet régulier, la syllepse sur « un pied » (le pied du marcheur, le pied du vers) et le mélange du familier (« élastiques ») et du noble (« lyres ») font de la forme ancienne un terrain de jeu : c’est l’émancipation créatrice.",
            },
          ],
        },
      ],
      transitions: [
        "Cette liberté conquise contre le milieu familial et provincial prend aussi une dimension plus large : elle s’attaque à ceux qui gouvernent les corps et les esprits.",
        "Pourtant, cette révolte ne naît pas de rien : c’est en reprenant les formes et les textes de ses modèles que Rimbaud s’en libère.",
      ],
      conclusion: "Les Cahiers de Douai sont bien le recueil d’une émancipation : contre la province, contre l’Empire et l’Église, contre les conventions poétiques. Mais cette émancipation est créatrice parce qu’elle ne détruit pas la tradition : elle la détourne de l’intérieur, par la parodie et le double sens.",
      ouverture: "Senghor, dans « Femme noire » (Chants d’ombre, 1945), texte de notre parcours, s’émancipe lui aussi de l’intérieur : il reprend la tradition occidentale de l’éloge de la femme pour célébrer une beauté noire que cette tradition ignorait.",
      pieges: [
        "Raconter la vie de Rimbaud (fugues, Verlaine) au lieu d’analyser les poèmes.",
        "Ne parler que de la révolte et oublier « créatrices » : la forme compte autant que les idées.",
        "Citer les lettres du Voyant (1871) comme si elles étaient dans le recueil : elles sont postérieures.",
      ],
    },
    {
      id: "revolte",
      sujet: "L’émancipation poétique de Rimbaud, dans les Cahiers de Douai, passe-t-elle seulement par la révolte ?",
      type: "Question fermée avec « seulement » : on montre d’abord la part de vérité (la révolte), puis ce que le « seulement » oublie (le jeu, l’émerveillement).",
      motsCles: [
        { mot: "émancipation poétique", sens: "Se libérer des règles et des modèles de la poésie, pas seulement de la société." },
        { mot: "seulement", sens: "Le mot clé du sujet : il invite à chercher d’autres voies que la révolte." },
        { mot: "révolte", sens: "Refus violent d’une autorité : politique, religieuse, sociale." },
      ],
      problematique: "La révolte est-elle le seul moteur de la liberté rimbaldienne, ou cette liberté passe-t-elle aussi par le rire et par le bonheur de sentir ?",
      plan: [
        {
          titre: "I. Une poésie de la révolte",
          idee: "Le recueil est d’abord une attaque contre l’ordre établi.",
          arguments: [
            { idee: "Contre l’Empereur.", poeme: "Rages de Césars", citation: "« L’Homme pâle, le long des pelouses fleuries, / Chemine, en habit noir, et le cigare aux dents »", analyse: "Napoléon III, prisonnier après Sedan, réduit à une silhouette pâle et oisive : la périphrase le déchoit de son titre." },
            { idee: "Contre l’Église complice de la guerre.", poeme: "Le Mal", citation: "« Il est un Dieu, qui rit aux nappes damassées / Des autels »", analyse: "Un Dieu indifférent aux morts, attaché au luxe : révolte anticléricale contre le discours officiel." },
            { idee: "Contre les bourgeois satisfaits.", poeme: "À la Musique", citation: "« Sur la place taillée en mesquines pelouses »", analyse: "La caricature (bourgeois réifiés et animalisés) vise la société du paraître qui étouffe le jeune poète." },
          ],
        },
        {
          titre: "II. Une liberté qui passe aussi par le rire",
          idee: "Rimbaud se libère en se moquant : parodie, registre bas, ricanement.",
          arguments: [
            { idee: "Le registre bas casse le pathétique.", poeme: "Les Effarés", citation: "« Leurs culs en rond »", analyse: "Au milieu d’une scène de misère, le mot trivial empêche l’attendrissement facile : Rimbaud refuse le pathos convenu." },
            { idee: "La chute qui ridiculise.", poeme: "Les Reparties de Nina", citation: "« — Et mon bureau ? »", analyse: "Un seul vers prosaïque fait s’effondrer la longue rêverie amoureuse : le rire libère du lyrisme sentimental." },
            { idee: "La parodie de la beauté classique.", poeme: "Vénus Anadyomène", citation: "« Belle hideusement d’un ulcère à l’anus. »", analyse: "L’oxymore final détruit le mythe de Vénus sortant des eaux ; selon les deux lectures du cours, parodie misogyne ou critique de la société qui exploite les prostituées." },
          ],
        },
        {
          titre: "III. Une liberté qui passe par l’émerveillement",
          idee: "S’émanciper, c’est aussi jouir du monde : la sensation et l’errance heureuse inventent une poésie légère.",
          arguments: [
            { idee: "Le bonheur de sentir.", poeme: "Sensation", citation: "« Par les soirs bleus d’été, j’irai dans les sentiers »", analyse: "Le futur et les couleurs ouvrent un rêve d’évasion joyeux, sans colère : la liberté est d’abord sensuelle." },
            { idee: "La pauvreté transfigurée.", poeme: "Ma Bohème", citation: "« Oh ! là ! là ! que d’amours splendides j’ai rêvées ! »", analyse: "L’interjection familière dans un sonnet traduit une joie spontanée : la fugue devient fête." },
            { idee: "Le plaisir simple, chanté sur un ton neuf.", poeme: "Au Cabaret-Vert", citation: "« Depuis huit jours, j’avais déchiré mes bottines / Aux cailloux des chemins. »", analyse: "Des détails concrets et prosaïques entrent dans le sonnet : la poésie s’émancipe des sujets nobles." },
          ],
        },
      ],
      transitions: [
        "Mais la révolte n’a pas toujours le visage de la colère : chez Rimbaud, elle prend souvent celui du rire.",
        "Au-delà de la contestation, rire ou colère, la liberté rimbaldienne a aussi une face heureuse.",
      ],
      conclusion: "La révolte est bien au cœur des Cahiers de Douai, mais elle ne suffit pas à dire l’émancipation de Rimbaud : le rire, qui détourne les codes, et l’émerveillement, qui fait entrer le quotidien dans le poème, sont d’autres manières de se libérer, et peut-être les plus créatrices.",
      ouverture: "Cette liberté joyeuse annonce la recherche d’une langue nouvelle dans les Illuminations (publiées en 1886).",
      pieges: [
        "Faire trois parties sur la révolte : le « seulement » demande d’autres voies.",
        "Analyser « Vénus Anadyomène » d’une seule façon : le cours en propose deux lectures, à nommer séparément.",
      ],
    },
    {
      id: "jeunesse",
      sujet: "« On n’est pas sérieux, quand on a dix-sept ans. » Ce vers de « Roman » suffit-il à caractériser les Cahiers de Douai ?",
      type: "Sujet-citation : expliquer d’abord la citation (légèreté, jeunesse), puis la discuter (la gravité, la maîtrise).",
      motsCles: [
        { mot: "On n’est pas sérieux", sens: "Légèreté, insouciance, jeu ; mais aussi ironie : le vers lui-même n’est pas tout à fait sérieux." },
        { mot: "dix-sept ans", sens: "La jeunesse ; Rimbaud en a quinze ou seize : le « je » est une pose." },
        { mot: "suffit-il", sens: "Invite à montrer ce que la citation laisse de côté." },
      ],
      problematique: "Les Cahiers de Douai sont-ils seulement le recueil léger d’un adolescent, ou l’insouciance y cache-t-elle une gravité et une maîtrise d’auteur ?",
      plan: [
        {
          titre: "I. Un recueil de l’insouciance adolescente",
          idee: "Le recueil célèbre les premiers émois, la fugue et le jeu.",
          arguments: [
            { idee: "La légèreté revendiquée.", poeme: "Roman", citation: "« On n’est pas sérieux, quand on a dix-sept ans. »", analyse: "L’alexandrin, répété en début et en fin de poème, a l’allure d’une maxime insouciante : l’adolescence comme âge de liberté." },
            { idee: "Les rêves de fugue.", poeme: "Ma Bohème", citation: "« Petit-Poucet rêveur, j’égrenais dans ma course / Des rimes. »", analyse: "La référence au conte et le rejet de « Des rimes » montrent un poète qui joue avec l’enfance et avec le vers." },
            { idee: "Le plaisir des sens.", poeme: "Sensation", citation: "« Par les soirs bleus d’été, j’irai dans les sentiers »", analyse: "Rêve sensuel et heureux, typique d’un âge où tout semble possible." },
          ],
        },
        {
          titre: "II. Mais une gravité qui affleure sans cesse",
          idee: "Sous le jeu, le recueil parle de la guerre, de la misère et de l’injustice.",
          arguments: [
            { idee: "La mort du soldat.", poeme: "Le Dormeur du val", citation: "« Nature, berce-le chaudement : il a froid. »", analyse: "L’apostrophe tendre à la Nature prépare la chute : derrière le tableau bucolique, la mort d’un jeune soldat de 1870." },
            { idee: "La misère des enfants.", poeme: "Les Effarés", citation: "« Le Boulanger au gras sourire »", analyse: "L’hypallage oppose le bien-nourri aux enfants affamés : une critique sociale sous le ton du conte." },
            { idee: "La violence de la guerre.", poeme: "Le Mal", citation: "« Tandis que les crachats rouges de la mitraille »", analyse: "La métaphore dégradante (« crachats ») dit l’horreur des combats de 1870, loin de toute légèreté." },
          ],
        },
        {
          titre: "III. Une maîtrise qui dépasse l’œuvre de jeunesse",
          idee: "Le ton léger est souvent une stratégie : Rimbaud programme plusieurs sens et satirise en cachette.",
          arguments: [
            { idee: "La satire cryptée.", poeme: "Le Châtiment de Tartufe", citation: "« Saint Tartufe était pâle »", analyse: "Acrostiche « Jules Cés » + A. R. (la signature) = « Jules César » et écho à « l’Homme pâle » : une construction savante, très sérieuse sous la farce." },
            { idee: "La polysémie programmée.", poeme: "Ma Bohème", citation: "« Mon paletot aussi devenait idéal »", analyse: "La syllepse impose deux lectures à la fois : un adolescent qui maîtrise ainsi le double sens est déjà un auteur." },
            { idee: "La distance avec le « je ».", poeme: "Roman", citation: "« On n’est pas sérieux, quand on a dix-sept ans. »", analyse: "Le poète de quinze ans se donne dix-sept ans : le « je » est un personnage, ce qu’il formulera en 1871 par « Je est un autre » (lettres hors recueil)." },
          ],
        },
      ],
      transitions: [
        "Pourtant, cette insouciance n’efface pas le monde de 1870 : la guerre et la misère traversent aussi le recueil.",
        "Légèreté et gravité ne s’opposent d’ailleurs pas toujours : chez Rimbaud, le jeu est souvent la forme même du sérieux.",
      ],
      conclusion: "Le vers de « Roman » dit bien l’élan joyeux des Cahiers de Douai, mais il ne suffit pas à les caractériser : la gravité de 1870 y affleure, et la légèreté elle-même est une stratégie d’auteur, faite de doubles sens et de satire cachée.",
      ouverture: "On peut rapprocher ce jeu sérieux de la fable selon La Fontaine : plaire pour instruire.",
      pieges: [
        "Prendre la citation au premier degré sans voir son ironie.",
        "Confondre le « je » du poème et l’homme Rimbaud.",
      ],
    },
    {
      id: "tradition",
      sujet: "Peut-on dire que, dans les Cahiers de Douai, Rimbaud rompt avec la tradition poétique ?",
      type: "Question ouverte « peut-on dire » : plan dialectique. La réponse attendue : il rompt, mais de l’intérieur.",
      motsCles: [
        { mot: "rompt", sens: "Une rupture nette et volontaire : à nuancer." },
        { mot: "tradition poétique", sens: "Les formes (sonnet, alexandrin, rime), les sujets nobles, les modèles (Hugo, Villon, les Parnassiens)." },
      ],
      problematique: "Rimbaud abandonne-t-il les modèles poétiques, ou les transforme-t-il de l’intérieur pour créer une poésie neuve ?",
      plan: [
        {
          titre: "I. Un jeune poète nourri de tradition",
          idee: "Rimbaud écrit des sonnets en alexandrins et imite ses aînés.",
          arguments: [
            { idee: "L’héritage parnassien et romantique.", poeme: "Ophélie", citation: "« La blanche Ophélia flotte comme un grand lys »", analyse: "Le mythe shakespearien, la comparaison florale et la musique régulière rappellent les poètes qu’il admire." },
            { idee: "La réécriture de Villon.", poeme: "Le Bal des pendus", citation: "« Au gibet noir, manchot aimable, / Dansent, dansent les paladins »", analyse: "Le sujet et la ballade viennent du XVe siècle : Rimbaud part d’un texte ancien." },
            { idee: "Le sonnet régulier.", poeme: "Le Dormeur du val", citation: "« Il a deux trous rouges au côté droit. »", analyse: "La forme fixe est respectée, et c’est elle qui donne sa force à la chute finale." },
          ],
        },
        {
          titre: "II. Mais une tradition détournée",
          idee: "Rimbaud parodie, renverse et mélange les registres.",
          arguments: [
            { idee: "La parodie du mythe.", poeme: "Vénus Anadyomène", citation: "« Belle hideusement d’un ulcère à l’anus. »", analyse: "Le motif classique de la naissance de Vénus est dégradé jusqu’au grotesque." },
            { idee: "Le prosaïque dans le sonnet.", poeme: "Au Cabaret-Vert", citation: "« Depuis huit jours, j’avais déchiré mes bottines / Aux cailloux des chemins. »", analyse: "Des détails du quotidien entrent dans une forme noble." },
            { idee: "Le lyrisme ridiculisé.", poeme: "Les Reparties de Nina", citation: "« — Et mon bureau ? »", analyse: "La chute prosaïque détruit le discours amoureux romantique." },
          ],
        },
        {
          titre: "III. Une rupture de l’intérieur, qui invente",
          idee: "C’est en gardant les formes que Rimbaud les fait exploser : la création naît du détournement.",
          arguments: [
            { idee: "La syllepse fait jouer le vers lui-même.", poeme: "Ma Bohème", citation: "« Comme des lyres, je tirais les élastiques / De mes souliers blessés, un pied près de mon cœur ! »", analyse: "« Un pied » : le marcheur et le vers. Le sonnet parle de lui-même." },
            { idee: "L’intertextualité devient arme politique.", poeme: "Le Châtiment de Tartufe", citation: "« Saint Tartufe était pâle »", analyse: "Molière réécrit pour viser Napoléon III : la tradition sert une satire neuve." },
            { idee: "Une liberté qui annonce la suite.", poeme: "Roman", citation: "« On n’est pas sérieux, quand on a dix-sept ans. »", analyse: "Le ton familier et ironique prépare les ruptures plus radicales des Illuminations." },
          ],
        },
      ],
      transitions: [
        "Mais Rimbaud ne se contente pas d’imiter : il retourne ses modèles contre eux-mêmes.",
        "Ce détournement n’est pas une destruction : il crée, de l’intérieur des formes anciennes, une poésie nouvelle.",
      ],
      conclusion: "Rimbaud ne rompt pas brutalement avec la tradition dans les Cahiers de Douai : il la connaît, l’imite, puis la détourne de l’intérieur. C’est cette rupture par le détournement qui fait de son émancipation une émancipation créatrice.",
      ouverture: "Baudelaire, avant lui, transformait déjà « la boue en or » à l’intérieur du sonnet (Les Fleurs du mal).",
      pieges: [
        "Répondre « oui, il rompt » sans voir qu’il garde le sonnet et l’alexandrin.",
        "Oublier de relier la question au parcours « Émancipations créatrices ».",
      ],
    },
  ],
  citations: [
    { citation: "« Je m’en allais, les poings dans mes poches crevées ; / Mon paletot aussi devenait idéal »", poeme: "Ma Bohème", procede: "Syllepse (« idéal »)", prouve: "La pauvreté de la fugue transfigurée en poésie.", axe: "milieu" },
    { citation: "« Comme des lyres, je tirais les élastiques / De mes souliers blessés, un pied près de mon cœur ! »", poeme: "Ma Bohème", procede: "Syllepse (« un pied ») et mélange des registres", prouve: "Le sonnet détourné de l’intérieur : émancipation créatrice.", axe: "modeles" },
    { citation: "« Petit-Poucet rêveur, j’égrenais dans ma course / Des rimes. »", poeme: "Ma Bohème", procede: "Référence au conte, rejet", prouve: "L’errance devient création poétique.", axe: "milieu" },
    { citation: "« Par les soirs bleus d’été, j’irai dans les sentiers »", poeme: "Sensation", procede: "Futur, couleur", prouve: "Le rêve d’évasion sensuel.", axe: "milieu" },
    { citation: "« Et j’irai loin, bien loin, comme un bohémien, / Par la Nature, — heureux comme avec une femme. »", poeme: "Sensation", procede: "Répétition, comparaison sensuelle", prouve: "Liberté du corps contre la morale bourgeoise.", axe: "milieu" },
    { citation: "« Sur la place taillée en mesquines pelouses »", poeme: "À la Musique", procede: "Adjectif péjoratif, participe « taillée »", prouve: "La caricature de la province bourgeoise et étriquée.", axe: "milieu" },
    { citation: "« On n’est pas sérieux, quand on a dix-sept ans. »", poeme: "Roman", procede: "Maxime, ironie, refrain", prouve: "L’insouciance adolescente, et la distance avec le « je ».", axe: "milieu" },
    { citation: "« Saint Tartufe était pâle »", poeme: "Le Châtiment de Tartufe", procede: "Écho à « l’Homme pâle », acrostiche « Jules Cés » + A. R. (la signature) = « Jules César »", prouve: "La satire cryptée de Napoléon III et de l’Église.", axe: "pouvoirs" },
    { citation: "« L’Homme pâle, le long des pelouses fleuries, / Chemine, en habit noir, et le cigare aux dents »", poeme: "Rages de Césars", procede: "Périphrase dégradante", prouve: "Napoléon III déchu, ridiculisé.", axe: "pouvoirs" },
    { citation: "« Il est un Dieu, qui rit aux nappes damassées / Des autels »", poeme: "Le Mal", procede: "Personnification ironique", prouve: "L’Église complice de la guerre.", axe: "pouvoirs" },
    { citation: "« Tandis que les crachats rouges de la mitraille »", poeme: "Le Mal", procede: "Métaphore dégradante", prouve: "L’horreur de la guerre de 1870.", axe: "pouvoirs" },
    { citation: "« Il a deux trous rouges au côté droit. »", poeme: "Le Dormeur du val", procede: "Chute du sonnet", prouve: "La dénonciation de la guerre par le contraste.", axe: "pouvoirs" },
    { citation: "« Nature, berce-le chaudement : il a froid. »", poeme: "Le Dormeur du val", procede: "Apostrophe, euphémisme", prouve: "La tendresse qui rend la mort plus cruelle.", axe: "pouvoirs" },
    { citation: "« Le Boulanger au gras sourire »", poeme: "Les Effarés", procede: "Hypallage", prouve: "La critique sociale sous l’apparence du conte.", axe: "pouvoirs" },
    { citation: "« Leurs culs en rond »", poeme: "Les Effarés", procede: "Registre bas", prouve: "Le refus du pathétique convenu.", axe: "modeles" },
    { citation: "« Au gibet noir, manchot aimable, / Dansent, dansent les paladins »", poeme: "Le Bal des pendus", procede: "Réécriture inversée de Villon", prouve: "L’intertextualité comme arme politique.", axe: "modeles" },
    { citation: "« — Et mon bureau ? »", poeme: "Les Reparties de Nina", procede: "Chute prosaïque", prouve: "Le lyrisme amoureux romantique ridiculisé.", axe: "modeles" },
    { citation: "« Belle hideusement d’un ulcère à l’anus. »", poeme: "Vénus Anadyomène", procede: "Oxymore, chute", prouve: "La parodie de la beauté classique (deux lectures).", axe: "modeles" },
    { citation: "« La blanche Ophélia flotte comme un grand lys »", poeme: "Ophélie", procede: "Comparaison, mythe littéraire", prouve: "L’héritage romantique et parnassien.", axe: "modeles" },
    { citation: "« Depuis huit jours, j’avais déchiré mes bottines / Aux cailloux des chemins. »", poeme: "Au Cabaret-Vert", procede: "Détails prosaïques", prouve: "Le quotidien entre dans le sonnet.", axe: "modeles" },
  ],
  methode: [
    {
      titre: "1. Analyser le sujet",
      temps: "15 min",
      conseils: [
        "Recopie le sujet et ==souligne chaque mot important== ; définis-le (émancipation, tradition, révolte…).",
        "Repère le type de sujet : « Dans quelle mesure » ou « Peut-on dire » → plan nuancé ; un mot comme « seulement » → montrer ce qu’il oublie ; une citation → l’expliquer puis la discuter.",
        "Relie toujours le sujet au parcours « Émancipations créatrices ».",
      ],
    },
    {
      titre: "2. Trouver la problématique",
      temps: "10 min",
      conseils: [
        "Une seule question, qui fait apparaître une tension (révolte / création, rupture / tradition, légèreté / gravité).",
        "Elle ne recopie pas le sujet : elle dit ce qui pose problème.",
      ],
      exemple: "Sujet : « Dans quelle mesure les Cahiers de Douai sont-ils le recueil d’une émancipation ? » → « En quoi la libération que chantent les Cahiers de Douai est-elle aussi une manière nouvelle d’écrire la poésie ? »",
    },
    {
      titre: "3. Chercher les exemples",
      temps: "30 min",
      conseils: [
        "Pour chaque idée : ==un poème précis et une citation exacte==, jamais un relevé seul (principe du prof : une idée = une citation analysée).",
        "Varie les poèmes : au moins deux poèmes différents par partie.",
        "Pas de biographie : la vie de Rimbaud n’est pas un argument. Le « je » du poème n’est pas l’homme.",
      ],
    },
    {
      titre: "4. Construire le plan",
      temps: "25 min",
      conseils: [
        "Deux ou trois parties ; chacune répond au sujet par une idée directrice.",
        "Chaque partie : deux ou trois arguments, chacun = idée + exemple + citation analysée (procédé, puis effet) + retour au sujet.",
        "La dernière partie nuance ou dépasse (souvent : une émancipation qui passe par la tradition).",
      ],
    },
    {
      titre: "5. Rédiger l’introduction",
      temps: "20 min (au brouillon)",
      conseils: [
        "Amorce (le contexte de 1870, ou une idée sur l’émancipation) → sujet cité → analyse des termes → problématique → annonce du plan.",
        "Ne commence jamais par « De tout temps ».",
      ],
      exemple: "Amorce possible : « En 1870, alors que l’Empire s’effondre, un lycéen de Charleville de quinze ans recopie à Douai vingt-deux poèmes qu’il ne publiera jamais. »",
    },
    {
      titre: "6. Rédiger le développement",
      temps: "1 h 45",
      conseils: [
        "Un paragraphe par argument : une phrase d’idée, l’exemple, la citation, son analyse, puis une phrase qui revient au sujet.",
        "Une transition entre les parties : un bilan de la partie, puis l’annonce de la suivante.",
      ],
    },
    {
      titre: "7. Conclure et relire",
      temps: "15 min + 10 min",
      conseils: [
        "Conclusion : bilan de chaque partie, ==réponse nette à la problématique==, ouverture (un autre texte du parcours, comme « Femme noire » de Senghor, ou une autre œuvre).",
        "Relis l’orthographe, les accords, les titres de poèmes entre guillemets et le titre du recueil souligné.",
      ],
    },
  ],
  criteres: [
    "Ma problématique est une vraie question qui fait apparaître une tension.",
    "Chaque partie répond au sujet, avec une idée directrice claire.",
    "Chaque argument a un poème précis et une citation exacte, analysée (procédé + effet).",
    "J’utilise au moins deux poèmes différents dans chaque partie.",
    "Je ne raconte pas la vie de Rimbaud et je ne confonds pas le « je » avec l’homme.",
    "Ma dernière partie nuance ou dépasse les précédentes.",
    "Je relie mon propos au parcours « Émancipations créatrices ».",
    "Ma conclusion répond nettement et ouvre sur un autre texte.",
  ],
};

export const DISSERTATIONS: Dissertation[] = [DISSERTATION_RIMBAUD];

// ———————————————————— D'où vient chaque citation ————————————————————

/** Les citations écrites dans les notes de cours (fiche « Rimbaud, Cahiers de Douai »). */
const CITATIONS_DU_COURS = [
  "Leurs culs en rond",
  "— Et mon bureau ?",
  "Saint Tartufe était pâle",
  "Mon paletot aussi devenait idéal",
  "Le Boulanger au gras sourire",
];

const norme = (s: string) =>
  s
    .replace(/[«»]/g, "")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/** « Les Effarés », strophes 1 à 7, recopiées du polycopié (photo du 2026-11-26 ; version de 1871). */
const EFFARES = [
  "Noirs dans la neige et dans la brume,",
  "Au grand soupirail qui s’allume,",
  "Leurs culs en rond,",
  "À genoux, cinq petits, — misère ! —",
  "Regardent le Boulanger faire",
  "Le lourd pain blond.",
  "Ils voient le fort bras blanc qui tourne",
  "La pâte grise et qui l’enfourne",
  "Dans un trou clair.",
  "Ils écoutent le bon pain cuire.",
  "Le Boulanger au gras sourire",
  "Grogne un vieil air.",
  "Ils sont blottis, pas un ne bouge,",
  "Au souffle du soupirail rouge",
  "Chaud comme un sein.",
  "Quand pour quelque médianoche,",
  "Façonné comme une brioche",
  "On sort le pain,",
];

/**
 * Vers d'autres poèmes du recueil cités dans la dissertation, vérifiés sur le texte intégral
 * (Poésies complètes, Vanier, 1895, Wikisource, 2026-11-26).
 */
const VERS_VERIFIES = [
  "On n’est pas sérieux, quand on a dix-sept ans.",
  "L’Homme pâle, le long des pelouses fleuries,",
  "Chemine, en habit noir, et le cigare aux dents :",
  "Tandis que les crachats rouges de la mitraille",
  "— Il est un Dieu, qui rit aux nappes damassées",
  "Des autels, à l’encens, aux grands calices d’or ;",
  "Nature, berce-le chaudement : il a froid.",
  "Tranquille. Il a deux trous rouges au côté droit.",
  "La blanche Ophélia flotte comme un grand lys,",
];

/** Tous les vers des textes étudiés et recopiés dans Luno (texte exact du polycopié). */
const VERS_ETUDIES = [
  ...TEXTES_BAC.filter((t) => !t.extraits).flatMap((t) =>
    t.mouvements.flatMap((m) => m.passages.flatMap((p) => p.lignes)),
  ),
  ...EFFARES,
  ...VERS_VERIFIES,
  ...Object.values(TEXTES_RIMBAUD).flatMap((t) => t.strophes.flat()),
].map(norme);

/** Les mots seuls, sans ponctuation ni tirets : la ponctuation varie d'une édition à l'autre. */
const mots = (s: string) => s.replace(/[^\p{L}\p{N}]+/gu, " ").trim();

/**
 * Origine d'une citation (demandé le 2026-11-26 : « n'invente SURTOUT pas de citations ») :
 * « texte » = retrouvée mot pour mot (ponctuation mise à part) dans un texte étudié ou vérifié sur le texte intégral ; « cours » = écrite
 * dans tes notes de cours ; « verifier » = citée de mémoire, à contrôler dans ton recueil.
 */
export function origineCitation(citation: string): "texte" | "cours" | "verifier" {
  const morceaux = citation.split("/").map(norme).filter(Boolean);
  if (morceaux.every((m) => VERS_ETUDIES.some((v) => mots(v).includes(mots(m))))) return "texte";
  const n = norme(citation);
  if (CITATIONS_DU_COURS.some((c) => n === norme(c) || n.startsWith(norme(c)))) return "cours";
  return "verifier";
}
