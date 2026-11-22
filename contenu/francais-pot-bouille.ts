import type { ChapitrePublie, Exercice } from "@/lib/types";
import { ROMAINS, questionsQuiz } from "@/lib/oeuvre";
import { POT_BOUILLE as O } from "./pot-bouille";

/**
 * Chapitre « Pot-Bouille » de Français : flashcards, fiche et exercices pour l'évaluation
 * de lecture (QCM) du 25/11/2026. Les cartes des personnages et les QCM sont tirés des
 * données de `pot-bouille.ts` (une seule source) ; l'exploration de l'œuvre (immeuble,
 * familles) est dans l'onglet Bac. Rien au-delà du chapitre XVI : l'élève n'a pas fini.
 * Changer les données ou ce fichier : augmenter `version`.
 */

const nom = (id: string) => O.personnages.find((p) => p.id === id)!.nom;

/** Une carte par personnage à connaître : « Qui est … ? ». */
const cartesPersonnages = O.personnages
  .filter((p) => p.importance <= 2)
  .map((p) => {
    const ou = p.adresses.filter((a) => (a.de ?? 1) <= O.luJusqua).at(-1);
    const lieu = ou && ou.lieu !== "dehors" ? O.logements.find((l) => l.id === ou.lieu)?.nom : p.ailleurs;
    return {
      recto: `Qui est ${p.nom} dans Pot-Bouille ?`,
      verso: `${p.role}.${lieu ? ` Où : ${lieu.charAt(0).toLowerCase()}${lieu.slice(1)}.` : ""} ${p.traits[0]}.`,
    };
  });

const cartesImmeuble = [
  {
    recto: "Qui occupe le rez-de-chaussée et l’entresol de l’immeuble de Pot-Bouille ?",
    verso: "La soierie d’Auguste Vabre, le fils aîné du propriétaire, qui loge à l’entresol avant son mariage. La loge des Gourd est sous le porche.",
  },
  {
    recto: "Qui habite le 1er étage de l’immeuble de Pot-Bouille ?",
    verso: "Sur la rue : les Duveyrier (le conseiller et Clotilde), qui logent le vieux Vabre, le propriétaire. Sur la cour : Théophile et Valérie Vabre.",
  },
  {
    recto: "Qui habite le 2e étage de l’immeuble de Pot-Bouille ?",
    verso: "Sur la rue : « les gens du second », un écrivain et sa femme que personne ne connaît. Sur la cour : Auguste et Berthe après leur mariage (chap. VIII).",
  },
  {
    recto: "Qui habite le 3e étage de l’immeuble de Pot-Bouille ?",
    verso: "Sur la rue : les Campardon (Achille, Rose, Angèle), rejoints par Gasparine au chap. IX. Sur la cour : Mme Juzeur et la chambre du « monsieur distingué ».",
  },
  {
    recto: "Qui habite le 4e étage de l’immeuble de Pot-Bouille ?",
    verso: "Sur la rue : les Josserand. Sur la cour : les Pichon (Jules, Marie, Lilie) et, au fond du couloir, la chambre d’Octave.",
  },
  {
    recto: "Qui vit sous les toits, à l’étage des bonnes, dans Pot-Bouille ?",
    verso: "Les domestiques (Adèle, Lisa, Julie, Clémence et Hippolyte, Rachel…), et une chambre louée : le menuisier (chassé au chap. VI), puis la piqueuse de bottines (chassée au chap. XIII).",
  },
  {
    recto: "Que montre l’escalier de l’immeuble de Pot-Bouille ?",
    verso: "Le grand escalier, chauffé, en faux marbre, fait la façade honnête de la maison ; le tapis rouge s’arrête au 3e. L’escalier de service et la cour des cuisines en montrent l’envers.",
  },
];

const cartesFamilles = [
  {
    recto: "Quels sont les trois enfants du vieux Vabre dans Pot-Bouille ?",
    verso: "Auguste (l’aîné, soierie, épouse Berthe), Clotilde (épouse du conseiller Duveyrier) et Théophile (le cadet, mari de Valérie).",
  },
  {
    recto: "Quels sont les quatre enfants des Josserand dans Pot-Bouille ?",
    verso: "Léon (l’aîné, amant de Mme Dambreville), Hortense (veut épouser Verdier), Berthe (épouse Auguste Vabre) et Saturnin (resté enfant, violent).",
  },
  {
    recto: "Quel lien unit Bachelard aux Josserand dans Pot-Bouille ?",
    verso: "Narcisse Bachelard est le frère de Mme Josserand, donc l’oncle de Berthe et d’Hortense. Gueulin est son neveu par alliance.",
  },
  {
    recto: "Qui est Gasparine par rapport aux Campardon ?",
    verso: "La cousine de Rose et la maîtresse d’Achille Campardon, qui l’avait quittée pour épouser Rose et sa dot. Elle s’installe chez eux au chap. IX.",
  },
];

const cartesIntrigue = [
  {
    recto: "Que signifie le titre « Pot-Bouille » ?",
    verso: "La « pot-bouille », c’est la cuisine ordinaire, le ragoût du ménage : le quotidien sans éclat et sale de ces bourgeois, dont les bonnes crient les secrets dans la cour des cuisines.",
  },
  {
    recto: "Comment Berthe est-elle mariée à Auguste Vabre dans Pot-Bouille ?",
    verso: "Au concert des Duveyrier (chap. V), Hortense laisse retomber un rideau : Berthe et Auguste restent cachés derrière, à la fenêtre. Compromis, il doit l’épouser ; la dot de 50 000 F est un mensonge.",
  },
  {
    recto: "Pourquoi Octave quitte-t-il le Bonheur des Dames dans Pot-Bouille ?",
    verso: "Mme Hédouin le repousse calmement quand il veut la prendre (chap. IX). Vexé, il démissionne et entre chez Auguste Vabre, à la soierie.",
  },
  {
    recto: "Que découvre-t-on à la mort du vieux Vabre dans Pot-Bouille ?",
    verso: "Il n’y a ni testament ni fortune : il a tout perdu en secret à la Bourse et hypothéqué la maison. Duveyrier la rachète pour 149 000 F (chap. XI).",
  },
  {
    recto: "Qui dénonce Berthe et Octave à Auguste dans Pot-Bouille ?",
    verso: "Rachel, la bonne de Berthe, qui se faisait payer son silence. Auguste revient de Lyon et frappe la nuit à la porte d’Octave (chap. XIV).",
  },
  {
    recto: "Qui sont les maîtresses d’Octave avant le chapitre XVI de Pot-Bouille ?",
    verso: "Marie Pichon, sa voisine (chap. IV), puis Berthe Vabre (chap. XII). Valérie et Mme Hédouin l’ont repoussé.",
  },
];

/** QCM tirés des données, graine fixe : les mêmes à chaque build. */
const qcm: Exercice[] = questionsQuiz(O, 2, 20261125)
  .filter((q, i, t) => t.findIndex((x) => x.type === q.type && x.personnage === q.personnage) === i)
  .slice(0, 16)
  .map((q) => ({ type: "qcm", consigne: q.consigne, question: q.question, choix: q.choix, bonneReponse: q.bonne, explication: q.explication }));

const exercices: Exercice[] = [
  ...qcm,
  {
    type: "ordre",
    consigne: "Remets ces événements dans l’ordre du roman",
    elements: [
      "Octave arrive rue de Choiseul",
      "Marie Pichon devient la maîtresse d’Octave",
      "Berthe et Auguste cachés derrière le rideau",
      "Le mariage de Berthe et d’Auguste",
      "Octave quitte le Bonheur des Dames",
      "La mort du vieux Vabre",
      "Berthe devient la maîtresse d’Octave",
      "Auguste surprend Berthe chez Octave",
    ],
    explication: "Chap. I, IV, V, VIII, IX, XI, XII, XIV.",
  },
  {
    type: "vraiFaux",
    affirmation: "Dans Pot-Bouille, Valérie Vabre devient la maîtresse d’Octave.",
    vrai: false,
    explication: "Elle le repousse, glacée, pendant sa crise de nerfs (chap. IV). Théophile accuse quand même Octave à la noce (chap. VIII).",
  },
  {
    type: "vraiFaux",
    affirmation: "Dans Pot-Bouille, l’oncle Bachelard paie la dot de Berthe.",
    vrai: false,
    explication: "Il ne donne rien : il conseille de parler d’une assurance et de payer par morceaux (chap. VII).",
  },
  {
    type: "trou",
    texte: "Dans Pot-Bouille, le concierge de la maison s’appelle M. ___.",
    reponses: ["Gourd"],
    explication: "M. Gourd, ancien valet de chambre d’un duc.",
  },
  {
    type: "trou",
    texte: "La patronne d’Octave au Bonheur des Dames s’appelle Mme ___.",
    reponses: ["Hédouin", "Hedouin"],
    explication: "Mme Hédouin (Caroline), qui le repousse au chap. IX.",
  },
  {
    type: "ouverte",
    question: "Pourquoi peut-on dire que l’immeuble de Pot-Bouille est un personnage à part entière ?",
    corrige:
      "Sa structure montre la société : les étages classent les gens (le tapis rouge s’arrête au 3e, les bonnes sous les toits), la façade et le grand escalier font l’honnêteté apparente, la cour des cuisines et l’escalier de service révèlent les secrets. M. Gourd en garde la « moralité » en chassant les pauvres.",
  },
];

export const FRANCAIS_POT_BOUILLE: ChapitrePublie = {
  id: "francais-1re-pot-bouille",
  version: 2,
  matiere: { nom: "Français", couleur: "#d98a8a", emoji: "📚" },
  titre: `Zola, Pot-Bouille (chap. I à ${ROMAINS[O.luJusqua]})`,
  flashcards: [...cartesImmeuble, ...cartesFamilles, ...cartesPersonnages, ...cartesIntrigue],
  fiche: {
    sections: [
      {
        titre: "L’œuvre et le décor",
        points: [
          { t: `==${O.presentation}==`, n: 1 },
          ...O.decor.map((t, i) => ({ t, n: i < 2 ? 1 : 2 })),
        ],
      },
      {
        titre: "Qui habite où",
        points: cartesImmeuble.slice(0, 6).map((c) => {
          const lieu = c.recto.replace(/^Qui (habite|occupe|vit) /, "").replace(/,? (de l’immeuble de|dans) Pot-Bouille \?/, "");
          return { t: `${lieu.charAt(0).toUpperCase()}${lieu.slice(1)} : ${c.verso}`, n: 1 };
        }),
      },
      {
        titre: "Les familles",
        points: cartesFamilles.map((c) => ({ t: c.verso, n: 1 })),
      },
      {
        titre: `L’intrigue, chapitre par chapitre (I à ${ROMAINS[O.luJusqua]})`,
        points: O.resumes.flatMap((r) =>
          r.resume.map((t, i) => ({ t: i === 0 ? `Chap. ${ROMAINS[r.n]}, ${r.titre} : ${t}` : t, n: i === 0 ? 2 : 4 })),
        ),
      },
    ],
    aRetenir: [
      `Rez-de-chaussée : la soierie d’Auguste ; 1er : ${nom("duveyrier")} et Clotilde (rue), Théophile et Valérie (cour) ; 2e : l’écrivain (rue), Auguste et Berthe après le mariage (cour) ; 3e : les Campardon (rue), Mme Juzeur (cour) ; 4e : les Josserand (rue), les Pichon et Octave (cour).`,
      "Le vieux Vabre, propriétaire, a trois enfants : Auguste, Clotilde (Mme Duveyrier), Théophile.",
      "Bachelard est le frère de Mme Josserand ; Gasparine est la cousine de Rose Campardon.",
      "Les maîtresses d’Octave : Marie Pichon (IV), puis Berthe (XII).",
    ],
  },
  exercices,
};
