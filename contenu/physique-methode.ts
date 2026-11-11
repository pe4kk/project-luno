import type { ChapitrePublie, Lecon } from "@/lib/types";

/**
 * Physique-Chimie : la façon de rédiger qu'attend le professeur, relevée dans sa
 * correction des exercices du chap. 11 et dans ses cours (encadrés, formules
 * surlignées). Les exemples rédigés reprennent un exercice déjà corrigé par le prof
 * (l'homme-canon) ou des exercices parallèles, jamais le DM.
 */
const matiere = { nom: "Physique-Chimie", couleur: "#6f8fae", emoji: "⚗️" };

export const PHYSIQUE_METHODE: ChapitrePublie = {
  id: "pc-1re-methode-redaction",
  version: 2,
  matiere,
  titre: "Méthode · Rédiger comme ton prof l'attend",
  flashcards: [
    {
      recto: "Titre d'une réponse",
      verso:
        "Reformuler ce qu'on cherche, souligné : « b) Calcul de la durée d'ascension du système ».",
    },
    {
      recto: "Bloc « Données »",
      verso:
        "Système = {…} considéré comme un point matériel de masse m ; les valeurs de l'énoncé avec leurs unités ; le bilan des forces.",
    },
    {
      recto: "Bilan des forces",
      verso:
        "Chaque force avec son nom, sa direction et son sens : « P⃗ = m·g⃗, vertical, vers le bas ».",
    },
    {
      recto: "Citer la loi",
      verso:
        "Toujours l'annoncer : « D'après la 2e loi de Newton : ΣF⃗ = {{m·Δv⃗ // Δt}} », puis « or … » pour remplacer ΣF⃗.",
    },
    {
      recto: "Projection sur un axe",
      verso:
        "« En projection suivant (Oy), puisque le mouvement est suivant (Oy) » : après projection, on écrit les grandeurs sans flèche.",
    },
    {
      recto: "Expression littérale",
      verso:
        "Isoler l'inconnue avec des lettres, avant tout nombre, et l'encadrer : Δt = {{Δv // g}}.",
    },
    {
      recto: "Définir les lettres",
      verso:
        "Après l'expression : « avec Δv = |v_f − vᵢ| où v_f est la vitesse à l'état final et vᵢ la vitesse à l'état initial ».",
    },
    {
      recto: "A.N.",
      verso:
        "Application numérique : on remplace les lettres par les valeurs, on calcule, et on souligne le résultat avec son unité.",
    },
    {
      recto: "Chiffres significatifs",
      verso:
        "Le résultat a autant de chiffres significatifs que la donnée la moins précise. Le prof l'indique : « 3,6 s (2 c.s) ».",
    },
    {
      recto: "Valeur de g chez ton prof",
      verso: "g = 9,81 m·s⁻², accélération de la pesanteur terrestre.",
    },
    {
      recto: "Phrase de conclusion",
      verso:
        "Répondre à la question par une phrase : « ⇒ l'homme-canon met 3,6 s pour atteindre son altitude maximale ».",
    },
    {
      recto: "Répondre à un vrai ou faux",
      verso:
        "Citer la propriété du cours, dire si elle est respectée « ici », puis encadrer le verdict : « ce qui n'est pas le cas ici. FAUX ».",
    },
    {
      recto: "Schéma de la situation",
      verso:
        "Un repère (O, x, y), le système en point M(m), les forces en flèches ; préciser l'échelle si elle est demandée, sinon écrire « sans souci d'échelle ».",
    },
    {
      recto: "Ce qu'il faut savoir par cœur",
      verso:
        "Les définitions encadrées et les formules surlignées en vert dans les cours du prof.",
    },
  ],
  fiche: {
    sections: [
      {
        titre: "Le plan d'une réponse",
        points: [
          { t: "1. Un titre souligné qui reformule ce qu'on cherche.", n: 1 },
          {
            t: "2. Les données : système, valeurs de l'énoncé avec unités, bilan des forces.",
            n: 1,
          },
          {
            t: "3. La loi citée, puis la projection sur l'axe du mouvement.",
            n: 1,
          },
          { t: "4. L'expression littérale de l'inconnue, encadrée.", n: 1 },
          {
            t: "5. L'A.N., avec le résultat souligné, son unité et ses chiffres significatifs.",
            n: 1,
          },
          { t: "6. Une phrase de conclusion qui répond à la question.", n: 1 },
        ],
      },
      {
        titre: "Titres et données",
        points: [
          {
            t: "Chaque question commence par un titre souligné : « a) Calcul de la norme de {{Δv⃗ // Δt}} pendant le vol vertical ».",
            n: 2,
          },
          {
            t: "« Données : » puis une accolade : Système = {homme-canon} considéré comme un point matériel de masse m = 75,0 kg ; v₀ = 35 m·s⁻¹.",
            n: 2,
          },
          {
            t: "Bilan des forces : chaque force avec direction et sens, par exemple « P⃗ = m·g⃗, vertical, vers le bas ».",
            n: 2,
          },
          {
            t: "Pense aussi au référentiel (terrestre, supposé galiléen) : les lois de Newton n'y sont valables que s'il est galiléen.",
            n: 3,
          },
          {
            t: "Convertis tout de suite en unités du système international : 1,2 t = 1200 kg ; 7,7 kN = 7700 N ; 100 km/h ≈ 27,8 m·s⁻¹.",
            n: 3,
          },
        ],
      },
      {
        titre: "Loi, projection et expression littérale",
        points: [
          {
            t: "Annonce la loi : « D'après la 2e loi de Newton : ΣF⃗ = {{m·Δv⃗ // Δt}} ». Puis « or ΣF⃗ = P⃗ = m·g⃗ ⇒ {{Δv⃗ // Δt}} = g⃗ ».",
            n: 2,
          },
          {
            t: "Projette : « en projection suivant (Oy) » ; ensuite on écrit {{Δv // Δt}} = g, sans flèche.",
            n: 2,
          },
          {
            t: "Isole l'inconnue avec des lettres et encadre-la : Δt = {{Δv // g}}. Aucun nombre avant cette ligne.",
            n: 2,
          },
          {
            t: "Définis chaque lettre juste après : « avec Δv = |v_f − vᵢ| où v_f = 0 (altitude maximale) et vᵢ = v₀ = 35 m·s⁻¹ ».",
            n: 3,
          },
          {
            t: "Les flèches « ⇒ » relient les étapes ; « or » introduit ce que l'on sait ; « donc » amène la conséquence.",
            n: 4,
          },
        ],
      },
      {
        titre: "L'application numérique",
        points: [
          {
            t: "Écris « A.N. : », remplace les lettres par les valeurs, calcule, et souligne le résultat avec son unité.",
            n: 1,
          },
          {
            t: "Chiffres significatifs : autant que la donnée la moins précise, et note-les comme le prof : « (2 c.s) ».",
            n: 2,
          },
          {
            t: "Exemple du prof : Δt = {{|0 − 35| // 9,81}} = {{35 // 9,81}} = 3,6 s (2 c.s), car v₀ = 35 n'a que deux chiffres significatifs.",
            n: 2,
          },
          {
            t: "Grands nombres en puissance de dix : P = 320 × 9,81 = 3,14 × 10³ N (3 c.s).",
            n: 3,
          },
          {
            t: "Unités écrites avec des puissances : m·s⁻¹ pour une vitesse, m·s⁻² pour {{Δv // Δt}} ou g, N pour une force.",
            n: 3,
          },
          {
            t: "Un résultat absurde (une montgolfière à 200 m·s⁻¹) se commente : quelle force a-t-on négligée ?",
            n: 4,
          },
        ],
      },
      {
        titre: "Conclure et justifier",
        points: [
          {
            t: "Finis par une phrase qui répond à la question posée, avec le résultat.",
            n: 1,
          },
          {
            t: "Pour un vrai ou faux : la propriété du cours, « ce qui est (ou n'est pas) le cas ici », puis le verdict encadré.",
            n: 2,
          },
          {
            t: "Pour choisir une proposition : décris ce que tu observes (points qui s'écartent…), déduis le type de mouvement, applique la loi, conclus « proposition A uniquement ».",
            n: 3,
          },
          {
            t: "Une comparaison se conclut aussi : « ⇒ ΠA > P : la montgolfière s'élève », souligné.",
            n: 3,
          },
        ],
      },
      {
        titre: "Schémas",
        points: [
          {
            t: "Trace un repère (O, x, y), place le système en point M(m) et chaque force par une flèche partant de M.",
            n: 2,
          },
          {
            t: "Si l'énoncé demande une échelle, indique-la (par exemple 1 cm pour 1000 N) ; sinon, écris « sans souci d'échelle ».",
            n: 3,
          },
          {
            t: "Les forces qui se compensent ont des flèches de même longueur et de sens opposés.",
            n: 4,
          },
        ],
      },
      {
        titre: "Ce qu'il faut savoir par cœur",
        points: [
          {
            t: "Les définitions encadrées des cours (système, référentiel, trajectoire, vecteur déplacement…).",
            n: 2,
          },
          {
            t: "Les formules surlignées en vert : v⃗ = {{MM'⃗ // Δt}}, v⃗ᵢ = {{MᵢMᵢ₊₁⃗ // tᵢ₊₁ − tᵢ}}, ΣF⃗ = {{m·Δv⃗ // Δt}}.",
            n: 2,
          },
          {
            t: "Les trois lois de Newton, énoncées avec les mots du cours.",
            n: 3,
          },
        ],
      },
    ],
    aRetenir: [
      "Titre souligné",
      "Données",
      "Bilan des forces",
      "Loi citée",
      "Projection",
      "Expression encadrée",
      "A.N.",
      "c.s",
      "Conclusion",
    ],
  },
  exercices: [
    {
      type: "ordre",
      consigne: "Remets dans l'ordre les étapes d'une réponse rédigée.",
      elements: [
        "Titre souligné qui reformule ce qu'on cherche",
        "Données : système, valeurs, bilan des forces",
        "Loi citée, puis projection sur l'axe",
        "Expression littérale encadrée",
        "A.N. avec unité et chiffres significatifs",
        "Phrase de conclusion",
      ],
      explication: "C'est le plan suivi dans toute la correction de ton prof.",
    },
    {
      type: "vraiFaux",
      affirmation:
        "On peut remplacer les lettres par les nombres dès le début du calcul, sans écrire l'expression littérale.",
      vrai: false,
      explication:
        "Ton prof isole d'abord l'inconnue avec des lettres et l'encadre, puis seulement fait l'A.N.",
    },
    {
      type: "vraiFaux",
      affirmation:
        "Après une projection sur un axe, on écrit les grandeurs sans flèche.",
      vrai: true,
      explication:
        "On ne manipule plus des vecteurs mais leurs valeurs sur l'axe : « g = {{Δv // Δt}} suivant (Oy), sans flèche ».",
    },
    {
      type: "vraiFaux",
      affirmation: "Un résultat numérique sans unité peut être compté juste.",
      vrai: false,
      explication: "Le résultat se donne toujours avec son unité, et souligné.",
    },
    {
      question:
        "v₀ = 35 m·s⁻¹ et g = 9,81 m·s⁻². La calculatrice affiche Δt = 3,5678. Que faut-il écrire ?",
      choix: [
        "Δt = 3,5678 s",
        "Δt = 3,6 s (2 c.s)",
        "Δt = 4 s",
        "Δt = 3,57 s (3 c.s)",
      ],
      bonneReponse: 1,
      explication:
        "La donnée la moins précise, 35, a deux chiffres significatifs : le résultat aussi.",
    },
    {
      question: "m = 320 kg et g = 9,81 m·s⁻². Comment écrire le poids ?",
      choix: [
        "P = 3139,2 N",
        "P = 3,14 × 10³ N (3 c.s)",
        "P = 3 × 10³ N",
        "P = 3,1392 kN",
      ],
      bonneReponse: 1,
      explication:
        "Trois chiffres significatifs, comme 320 et 9,81, et une puissance de dix.",
    },
    {
      question: "Que faut-il encadrer dans une réponse ?",
      choix: [
        "Le titre",
        "L'expression littérale de l'inconnue",
        "Les données",
        "Rien",
      ],
      bonneReponse: 1,
      explication:
        "L'expression littérale est encadrée ; le résultat de l'A.N. est souligné.",
    },
    {
      question: "Quelle est l'unité de {{Δv // Δt}} ?",
      choix: ["m·s⁻¹", "m·s⁻²", "N", "s"],
      bonneReponse: 1,
      explication:
        "Une vitesse (m·s⁻¹) divisée par une durée (s) donne des m·s⁻², comme g.",
    },
    {
      question:
        "Quel titre convient à la question « Déterminer la durée de son ascension » ?",
      choix: [
        "Ascension",
        "b) Calcul de la durée d'ascension du système",
        "Réponse b",
        "Δt = ?",
      ],
      bonneReponse: 1,
      explication:
        "Le titre, souligné, reformule précisément ce qu'on cherche.",
    },
    {
      type: "trou",
      texte:
        "Avant le calcul chiffré, ton prof écrit « ___ : » pour application numérique.",
      reponses: ["A.N.", "AN"],
      explication: "Puis il remplace les lettres par les valeurs.",
    },
    {
      type: "trou",
      texte:
        "Le résultat a autant de chiffres significatifs que la donnée la moins ___.",
      reponses: ["précise"],
      explication:
        "Ton prof note le nombre retenu entre parenthèses : « (2 c.s) ».",
    },
    {
      type: "trou",
      texte: "Le système est considéré comme un point ___ de masse m.",
      reponses: ["matériel"],
      explication:
        "C'est la première ligne des données dans chaque correction.",
    },
    {
      type: "ouverte",
      question:
        "Rédige comme ton prof : une balle de 0,20 kg, lancée verticalement vers le haut à 12 m·s⁻¹, n'est soumise qu'à son poids. Calcule la durée de sa montée.",
      corrige:
        "b) Calcul de la durée de montée de la balle (souligné). Données : système = {balle}, point matériel de masse m = 0,20 kg ; v₀ = 12 m·s⁻¹ ; bilan des forces : P⃗ = m·g⃗, vertical, vers le bas. D'après la 2e loi de Newton : ΣF⃗ = {{m·Δv⃗ // Δt}} ; or ΣF⃗ = P⃗ = m·g⃗, donc {{Δv⃗ // Δt}} = g⃗. En projection suivant (Oy) : {{Δv // Δt}} = g, d'où Δt = {{Δv // g}} (encadré), avec Δv = |v_f − vᵢ|, v_f = 0 au sommet et vᵢ = 12 m·s⁻¹. A.N. : Δt = {{12 // 9,81}} = 1,2 s (2 c.s). ⇒ La balle met 1,2 s pour atteindre son point le plus haut.",
    },
    {
      type: "ouverte",
      question:
        "Justifie comme ton prof : « Un vecteur vitesse dessiné perpendiculaire à la trajectoire est-il bien représenté ? »",
      corrige:
        "On sait que le vecteur vitesse est toujours tangent à la trajectoire au point considéré, ce qui n'est pas le cas ici. FAUX (encadré).",
    },
    {
      type: "ouverte",
      question:
        "Quelles sont les six parties d'une réponse rédigée, dans l'ordre ?",
      corrige:
        "Le titre souligné ; les données (système, valeurs, bilan des forces) ; la loi citée et la projection ; l'expression littérale encadrée ; l'A.N. avec unité et chiffres significatifs ; la phrase de conclusion.",
    },
  ],
};

/** Leçon guidée (onglet Apprendre), construite comme une séance de tutorat : une étape, un exemple, une question. */
export const LECON_REDACTION: Lecon = {
  id: "pc-redaction",
  titre: "Rédiger une réponse de physique comme ton prof l'attend",
  matiere: "Physique-Chimie",
  niveau: "Première",
  duree: "12 min",
  intro:
    "On va construire ensemble une réponse complète, étape par étape, sur l'exercice de l'homme-canon que ton prof a corrigé. À chaque étape, réponds de tête avant de dévoiler la réponse : c'est ce qui fait rentrer la méthode. À la fin, tu rédigeras seul un exercice du même type.",
  etapes: [
    {
      titre: "Un titre qui dit ce que tu cherches",
      texte: [
        "Ton prof commence chaque question par un titre souligné qui reformule ce qu'on cherche. Ce n'est pas décoratif : ça t'oblige à identifier l'inconnue avant d'écrire quoi que ce soit.",
      ],
      exemple:
        "Énoncé : « Déterminer la norme du vecteur {{Δv⃗ // Δt}} pendant le vol vertical. »\nTitre du prof : a) Calcul de la norme de {{Δv⃗ // Δt}} pendant le vol vertical (souligné).",
      question: {
        q: "Quel titre écrirais-tu pour : « L'homme atteint sa hauteur maximale lorsque sa vitesse devient nulle. Déterminer la durée de son ascension » ?",
        r: "b) Calcul de la durée d'ascension du système, souligné. L'inconnue est donc une durée, Δt.",
      },
    },
    {
      titre: "Les données et le bilan des forces",
      texte: [
        "Ensuite, un bloc « Données : » qui pose le cadre. On y écrit le système, considéré comme un point matériel de masse m, les valeurs de l'énoncé avec leurs unités, et le bilan des forces.",
        "Dans le bilan, chaque force a un nom, une direction et un sens.",
      ],
      exemple:
        "Données :\nsystème = {homme-canon}, considéré comme un point matériel de masse m = 75,0 kg\nv₀ = 35 m·s⁻¹\nbilan des forces : P⃗ = m·g⃗, vertical, vers le bas",
      question: {
        q: "Une balle est lancée vers le haut, frottements de l'air négligés. Quel est son bilan des forces ?",
        r: "Une seule force : son poids, P⃗ = m·g⃗, vertical, vers le bas. Elle monte quand même : rien ne la « pousse » vers le haut une fois lancée (principe d'inertie).",
      },
    },
    {
      titre: "La loi, puis la projection",
      texte: [
        "On annonce toujours la loi utilisée, avec sa formule vectorielle. Puis « or » pour remplacer ΣF⃗ par ce que donne le bilan.",
        "Enfin on projette sur l'axe du mouvement : à partir de là, plus de flèches, on travaille avec des valeurs.",
      ],
      exemple:
        "D'après la 2e loi de Newton : ΣF⃗ = {{m·Δv⃗ // Δt}}\nor ΣF⃗ = P⃗ = m·g⃗ ⇒ m·g⃗ = {{m·Δv⃗ // Δt}} ⇒ g⃗ = {{Δv⃗ // Δt}}\nEn projection suivant (Oy), puisque le mouvement est suivant (Oy) : g = {{Δv // Δt}}",
      question: {
        q: "Pourquoi la masse m disparaît-elle ici, et qu'est-ce que ça veut dire physiquement ?",
        r: "Elle apparaît des deux côtés et se simplifie. En chute libre, {{Δv // Δt}} = g quelle que soit la masse : un objet lourd et un objet léger changent de vitesse au même rythme.",
      },
    },
    {
      titre: "L'expression littérale, encadrée",
      texte: [
        "Avant le moindre nombre, on isole l'inconnue avec des lettres et on encadre le résultat. Puis on définit chaque lettre qui reste.",
        "C'est l'étape la plus souvent sautée, et c'est celle qui rapporte des points même si l'A.N. est fausse.",
      ],
      exemple:
        "{{Δv // Δt}} = g ⇒ Δt = {{Δv // g}} (encadré)\navec Δv = |v_f − vᵢ|, où v_f = 0 à l'altitude maximale et vᵢ = v₀ = 35 m·s⁻¹",
      question: {
        q: "À partir de ΣF = m·{{Δv // Δt}}, isole Δt.",
        r: "Δt = {{m·Δv // ΣF}}. On multiplie les deux côtés par Δt, puis on divise par ΣF.",
      },
    },
    {
      titre: "L'A.N. et les chiffres significatifs",
      texte: [
        "On écrit « A.N. : », on remplace les lettres par les valeurs, on calcule, et on souligne le résultat avec son unité.",
        "Le résultat garde autant de chiffres significatifs que la donnée la moins précise, et ton prof le note entre parenthèses.",
      ],
      exemple:
        "A.N. : Δt = {{|0 − 35| // 9,81}} = {{35 // 9,81}} = 3,6 s (2 c.s)\n35 a deux chiffres significatifs, 9,81 en a trois : on garde deux.",
      question: {
        q: "Données : m = 320 kg et g = 9,81 m·s⁻². La calculatrice donne P = 3139,2. Qu'écris-tu ?",
        r: "P = 3,14 × 10³ N (3 c.s) : trois chiffres significatifs comme les deux données, une puissance de dix, et l'unité.",
      },
    },
    {
      titre: "Conclure, puis à toi",
      texte: [
        "On finit par une phrase qui répond à la question : « ⇒ l'homme-canon met 3,6 s pour atteindre son altitude maximale, où sa vitesse s'annule, avant de redescendre. »",
        "À toi maintenant, sur un exercice parallèle. Rédige-le en entier sur une feuille, avec les six parties, avant de regarder la réponse.",
      ],
      question: {
        q: "Une balle de 0,20 kg est lancée verticalement vers le haut à 12 m·s⁻¹ ; seul son poids agit. Rédige le calcul de la durée de sa montée.",
        r: "b) Calcul de la durée de montée de la balle (souligné)\nDonnées : système = {balle}, point matériel de masse m = 0,20 kg ; v₀ = 12 m·s⁻¹ ; P⃗ = m·g⃗, vertical, vers le bas\nD'après la 2e loi de Newton : ΣF⃗ = {{m·Δv⃗ // Δt}} ; or ΣF⃗ = P⃗ = m·g⃗ ⇒ {{Δv⃗ // Δt}} = g⃗\nEn projection suivant (Oy) : {{Δv // Δt}} = g ⇒ Δt = {{Δv // g}} (encadré), avec Δv = |0 − 12|\nA.N. : Δt = {{12 // 9,81}} = 1,2 s (2 c.s)\n⇒ La balle met 1,2 s pour atteindre son point le plus haut.\nCompare partie par partie : s'il te manque le titre, les données ou l'expression encadrée, c'est là que tu perdrais des points.",
      },
    },
  ],
};
