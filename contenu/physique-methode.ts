import type { ChapitrePublie, Lecon } from "@/lib/types";
import { DEF_PC_METHODE } from "./definitions";
import { HOMME_CANON } from "./schemas-physique";

/**
 * Physique-Chimie : la façon de rédiger qu'attend le professeur, relevée dans sa
 * correction des exercices du chap. 11 et dans ses cours (encadrés, formules
 * surlignées). Les exemples rédigés reprennent un exercice déjà corrigé par le prof
 * (l'homme-canon) ou des exercices parallèles, jamais le DM.
 * Version 7 (2026-11-13, demandé) : la méthode générale (titre, « par définition »,
 * formule encadrée, « avec » et données, A.N., résultat souligné) ne change pas ; les
 * méthodes propres à un type d'exercice sont des sections à part, nommées (lois de
 * Newton, méthode descendante des dilutions ; l'oxydoréduction reste dans le chap. 4).
 * Version 6 : complétée avec la correction du DST commun n°1 (contrôle de
 * qualité d'un macaron, dosage par étalonnage) : consignes du sujet, démarche en
 * plusieurs étapes, dilution, chiffres significatifs des valeurs intermédiaires,
 * produit en croix, écart relatif.
 */
const matiere = { nom: "Physique-Chimie", couleur: "#6f8fae", emoji: "⚗️" };

export const PHYSIQUE_METHODE: ChapitrePublie = {
  id: "pc-1re-methode-redaction",
  version: 8,
  definitions: DEF_PC_METHODE,
  matiere,
  titre: "Méthode · Rédiger comme ton prof l'attend",
  flashcards: [
    {
      recto: "La méthode générale",
      verso:
        "Un titre souligné ; « Par définition de … » et la formule encadrée ; « avec » et les données converties ; « A.N. : » ; le résultat final souligné, avec unité et chiffres significatifs.",
    },
    {
      recto: "Reconnaître la méthode à utiliser",
      verso:
        "La méthode générale vaut partout. En plus : lois de Newton pour le mouvement (système, bilan des forces, projection), méthode descendante pour les dilutions et dosages, demi-équations pour l'oxydoréduction.",
    },
    {
      recto: "Titre d'une réponse",
      verso:
        "Reformuler ce qu'on cherche, souligné : « b) Calcul de la durée d'ascension du système ».",
    },
    {
      recto: "Bloc « Données » (lois de Newton)",
      verso:
        "Système = {…} considéré comme un point matériel de masse m ; les valeurs de l'énoncé avec leurs unités ; le bilan des forces.",
    },
    {
      recto: "Bilan des forces (lois de Newton)", schema: HOMME_CANON,
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
      recto: "Les 4 consignes du sujet (points enlevés sinon)",
      verso:
        "Un titre souligné qui rappelle la question ; les formules littérales encadrées ; le bon nombre de chiffres significatifs à chaque A.N. ; de la rigueur et une copie propre.",
    },
    {
      recto: "La méthode descendante (dilutions, dosages)",
      verso:
        "Partir de la formule de base de ce qu'on cherche, puis « on cherche donc … » : exprimer chaque inconnue, numéroter les relations (1), (2), (3). Quand il n'y a plus d'inconnue, remplacer (3) dans (2) puis (2) dans (1) : une seule expression littérale complète, encadrée, puis une seule A.N.",
    },
    {
      recto: "Justifier une dilution",
      verso:
        "« Au cours d'une dilution, la masse de soluté se conserve : m_mère = m_fille, or m = C_m × V, d'où C_m,mère × V_mère = C_m,fille × V_fille. » Ne jamais écrire « ×5 » sans cette justification.",
    },
    {
      recto: "Valeurs intermédiaires",
      verso:
        "Les écrire avec leurs chiffres significatifs (k = {{1,40 // 45,0}} = 3,11 × 10⁻² L·g⁻¹, 3 c.s., pas 3,0 × 10⁻²) et garder la valeur complète dans la calculatrice. On n'arrondit que le résultat final, au nombre de chiffres significatifs des données.",
    },
    {
      recto: "Une norme donnée « par kg »",
      verso:
        "La ramener à l'objet étudié par un produit en croix : 50 mg pour 1 kg, donc m pour 15,0 × 10⁻³ kg. Puis calculer ce qu'on demande (pourcentage, masse) pour cet objet.",
    },
    {
      recto: "Écart relatif",
      verso:
        "écart relatif = {{|valeur exp − valeur de référence| // valeur de référence}} × 100, en %. On le compare à l'écart toléré (souvent 10 %) pour conclure.",
    },
    {
      recto: "Convertir des unités",
      verso:
        "Convertir chaque unité dans les données, avant le calcul : 90 km/h = {{90 × 10³ m // 3600 s}} = 25 m·s⁻¹. Pas de coefficient appris par cœur (« ÷ 3,6 »).",
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
        titre: "La méthode générale (tous les chapitres)",
        points: [
          { t: "==1. Un titre souligné qui rappelle la question posée.==", n: 1 },
          { t: "==2. « Par définition de … » (ou « D'après la loi de … »), puis la formule littérale, encadrée.==", n: 1 },
          { t: "3. « avec » : les données une par une, converties dans les bonnes unités avant le calcul (km → m, h → s…).", n: 1 },
          { t: "4. « A.N. : » on remplace les lettres par les valeurs, on calcule.", n: 1 },
          { t: "5. Le résultat final souligné, avec son unité et le bon nombre de chiffres significatifs.", n: 1 },
          { t: "Si la question demande de conclure ou de justifier : une phrase qui répond, avec le résultat.", n: 2 },
        ],
      },
      {
        titre: "Chaque type d'exercice a sa méthode",
        points: [
          { t: "==La méthode générale ne change pas. Mais selon le chapitre, le prof attend en plus une méthode propre au type d'exercice : il faut reconnaître lequel on fait.==", n: 1 },
          { t: "Mouvement et forces (chap. 9 et 11) : système, référentiel, bilan des forces, loi de Newton, projection. Voir « Lois de Newton » ci-dessous.", n: 2 },
          { t: "Dilutions et dosages : la méthode descendante, qui finit par une seule expression littérale complète. Voir « La méthode descendante » ci-dessous.", n: 2 },
          { t: "Oxydoréduction (chap. 4) : les demi-équations en quatre étapes, puis leur combinaison. Cette méthode est dans le chapitre 4, onglet Déf.", n: 2 },
        ],
      },
      {
        titre: "Lois de Newton (chap. 9 et 11) · Données et bilan des forces",
        points: [
          {
            t: "==Chaque question commence par un titre souligné : « a) Calcul de la norme de {{Δv⃗ // Δt}} pendant le vol vertical ».==",
            n: 2,
          },
          {
            t: "« Données : » puis une accolade : Système = {homme-canon} considéré comme un point matériel de masse m = 75,0 kg ; v₀ = 35 m·s⁻¹.",
            n: 2,
          },
          {
            t: "Bilan des forces : chaque force avec direction et sens, par exemple « P⃗ = m·g⃗, vertical, vers le bas ».",
            n: 2, schema: HOMME_CANON,
          },
          {
            t: "Pense aussi au référentiel (terrestre, supposé galiléen) : les lois de Newton n'y sont valables que s'il est galiléen.",
            n: 3,
          },
          {
            t: "Convertis tout de suite en unités du système international : 1,2 t = 1200 kg ; 7,7 kN = 7700 N ; 100 km/h = {{100 × 10³ m // 3600 s}} ≈ 27,8 m·s⁻¹. On convertit chaque unité (km → m, h → s), pas de « ÷ 3,6 » appris par cœur.",
            n: 3,
          },
        ],
      },
      {
        titre: "Lois de Newton (chap. 9 et 11) · Loi, projection, expression",
        points: [
          {
            t: "==Annonce la loi : « D'après la 2e loi de Newton : ΣF⃗ = {{m·Δv⃗ // Δt}} ». Puis « or ΣF⃗ = P⃗ = m·g⃗ ⇒ {{Δv⃗ // Δt}} = g⃗ ».==",
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
            t: "==Écris « A.N. : », remplace les lettres par les valeurs, calcule, et souligne le résultat avec son unité.==",
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
            t: "==Finis par une phrase qui répond à la question posée, avec le résultat.==",
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
        titre: "Dilutions et dosages · la méthode descendante",
        points: [
          {
            t: "==Les consignes du sujet coûtent des points : titre souligné qui rappelle la question, formules littérales encadrées, bon nombre de chiffres significatifs à chaque A.N., rigueur et propreté.==",
            n: 1,
          },
          {
            t: "==On part de la formule de base de ce qu'on cherche (« Par définition du pourcentage massique : … »), puis on descend : chaque grandeur inconnue de la formule est exprimée à son tour, jusqu'à n'avoir plus que des données.==",
            n: 1,
          },
          {
            t: "À chaque étape : « On cherche donc m(E124) », « on doit donc calculer C_m,mère, la seule inconnue ici ». Chaque relation est encadrée et numérotée (1), (2), (3).",
            n: 2,
          },
          {
            t: "==Quand il n'y a plus d'inconnue, on insère (3) dans (2), puis (2) dans (1) : on obtient une seule formule complète, l'expression littérale finale, encadrée. Une seule A.N. à la fin, sur cette formule.==",
            n: 2,
          },
          {
            t: "Commence par un schéma du protocole : solution mère (V_mère prélevé), solution fille (V_fille = V_fiole), et un tableau mère | fille avec un « ? » sur ce que l'on cherche.",
            n: 2,
          },
          {
            t: "==Justifie toujours une dilution : « au cours d'une dilution, la masse de soluté se conserve », donc C_m,mère × V_mère = C_m,fille × V_fille.== Un facteur « F = 5 » sans explication perd des points.",
            n: 2,
          },
          {
            t: "Coefficient directeur d'une droite d'étalonnage : deux points éloignés de la droite, k = {{A_B − A_A // C_m(B) − C_m(A)}}, avec son unité (L·g⁻¹). k = {{1,56 − 0,16 // 50,0 − 5,0}} = {{1,40 // 45,0}} = 3,11 × 10⁻² L·g⁻¹ : 3 c.s., car une soustraction garde le nombre de décimales (1,40 et 45,0 ont chacun 3 c.s.), puis une division garde le plus petit nombre de c.s.",
            n: 3,
          },
          {
            t: "Ne pas arrondir les valeurs intermédiaires : arrondir k à 3,0 × 10⁻² donnait 5,0 % au lieu de 4,80 %. Seul le résultat final s'arrondit, au nombre de chiffres significatifs des données (ici 3 : 15,0 g ; 25,0 mL ; 50,0 mL).",
            n: 3,
          },
          {
            t: "Une norme donnée « par kg d'aliment » se ramène à l'objet étudié par un produit en croix : 50 mg pour 1 kg, donc 0,75 mg pour 15,0 g. Puis le pourcentage : {{0,75 × 10⁻³ // 15,0}} × 100 = 5,0 × 10⁻³ %.",
            n: 3,
          },
          {
            t: "Réponds à toute la question : « à quelle longueur d'onde et pourquoi » demande la valeur (λ_max = 510 nm) et la raison (c'est là que la solution absorbe le plus, ce qui minimise les incertitudes sur A).",
            n: 3,
          },
          {
            t: "Pour conclure sur une mesure : écart relatif = {{|valeur exp − valeur de référence| // valeur de référence}} × 100, comparé à l'écart toléré (10 %), puis une phrase qui répond : « le fabricant n'a pas respecté la réglementation ».",
            n: 4,
          },
          {
            t: "Contrôle l'ordre de grandeur de chaque résultat avant de t'en servir : une erreur de puissance de dix à une question se reporte sur toutes les suivantes.",
            n: 4,
          },
        ],
      },
      {
        titre: "Schémas",
        points: [
          {
            t: "==Trace un repère (O, x, y), place le système en point M(m) et chaque force par une flèche partant de M.==",
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
            t: "==Les définitions encadrées des cours (système, référentiel, trajectoire, vecteur déplacement…).==",
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
      "Par définition",
      "Formule encadrée",
      "avec : données converties",
      "A.N.",
      "Résultat souligné",
      "c.s",
      "Newton : bilan des forces, projection",
      "Méthode descendante",
    ],
  },
  exercices: [
    {
      type: "ordre",
      consigne: "Lois de Newton : remets dans l'ordre les étapes d'une réponse rédigée.",
      elements: [
        "Titre souligné qui reformule ce qu'on cherche",
        "Données : système, valeurs, bilan des forces",
        "Loi citée, puis projection sur l'axe",
        "Expression littérale encadrée",
        "A.N. avec unité et chiffres significatifs",
        "Phrase de conclusion",
      ],
      explication: "C'est le plan suivi par ton prof dans la correction des exercices du chap. 11 : la méthode générale, avec en plus le bilan des forces et la projection.",
    },
    {
      type: "ordre",
      consigne: "Méthode générale (tous les chapitres) : remets les étapes dans l'ordre.",
      elements: [
        "Titre souligné qui rappelle la question",
        "« Par définition de … » et la formule littérale encadrée",
        "« avec » : les données, converties dans les bonnes unités",
        "« A.N. : » les valeurs remplacées",
        "Le résultat final souligné, avec unité et chiffres significatifs",
      ],
      explication: "Cette méthode ne change pas ; selon le chapitre, une méthode propre s'y ajoute (lois de Newton, méthode descendante, demi-équations).",
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
        "Quelle méthode utiliser pour un exercice de dilution, et en quoi diffère-t-elle d'un exercice sur les lois de Newton ?",
      corrige:
        "Les deux suivent la méthode générale (titre, « par définition », formule encadrée, « avec », A.N., résultat souligné). Pour une dilution, on utilise en plus la méthode descendante : on part de la formule de ce qu'on cherche, on exprime chaque inconnue (relations numérotées), puis une seule expression littérale complète et une seule A.N. Pour les lois de Newton, on ajoute le système, le référentiel, le bilan des forces, la loi et la projection sur l'axe.",
    },
  ],
};

/** Leçon guidée (onglet Apprendre), construite comme une séance de tutorat : une étape, un exemple, une question. */
export const LECON_REDACTION: Lecon = {
  id: "pc-redaction",
  methode: true,
  titre: "Rédiger une réponse de physique comme ton prof l'attend : l'exemple des lois de Newton",
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
      schema: HOMME_CANON,
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
        "À toi maintenant, sur un exercice parallèle. Rédige-le en entier sur une feuille, avec toutes les étapes vues dans cette leçon, avant de regarder la réponse.",
      ],
      question: {
        q: "Une balle de 0,20 kg est lancée verticalement vers le haut à 12 m·s⁻¹ ; seul son poids agit. Rédige le calcul de la durée de sa montée.",
        r: "b) Calcul de la durée de montée de la balle (souligné)\nDonnées : système = {balle}, point matériel de masse m = 0,20 kg ; v₀ = 12 m·s⁻¹ ; P⃗ = m·g⃗, vertical, vers le bas\nD'après la 2e loi de Newton : ΣF⃗ = {{m·Δv⃗ // Δt}} ; or ΣF⃗ = P⃗ = m·g⃗ ⇒ {{Δv⃗ // Δt}} = g⃗\nEn projection suivant (Oy) : {{Δv // Δt}} = g ⇒ Δt = {{Δv // g}} (encadré), avec Δv = |0 − 12|\nA.N. : Δt = {{12 // 9,81}} = 1,2 s (2 c.s)\n⇒ La balle met 1,2 s pour atteindre son point le plus haut.\nCompare partie par partie : s'il te manque le titre, les données ou l'expression encadrée, c'est là que tu perdrais des points.",
      },
    },
  ],
};
