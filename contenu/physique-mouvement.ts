import type { ChapitrePublie } from "@/lib/types";
import { CALCULS_CHAP11, CALCULS_CHAP9, CALCULS_FORCES, PROBLEMES_CHAP11 } from "./physique-entrainement";
import { DEF_PC_CHAP9, DEF_PC_CHAP11, DEF_PC_FORCES } from "./definitions";
import {
  ARCHIMEDE,
  CARACTERISER,
  CONSTRUCTION_DELTA_V,
  COORDONNEES,
  COULOMB,
  DEUXIEME_LOI,
  ENCADREMENT,
  EULER,
  FROTTEMENT,
  FUSEE,
  GRAVITATION,
  REACTION,
  RELATIVITE,
  RESSORT,
  SKIEUR,
  TENSION,
  TRAJECTOIRES,
  VARIATION_RECTILIGNE,
  VITESSE_INSTANTANEE,
  VITESSE_MOYENNE,
} from "./schemas-physique";

/**
 * Physique-Chimie Première (spécialité) : mouvement et interactions.
 * Rédigé le 2026-11-11 à partir des documents envoyés par le professeur :
 * cours « Chap. 9 – Décrire un mouvement » et « Chap. 11 – Mouvement d'un
 * système », fiches méthode « méthode d'Euler », « vecteur variation de
 * vitesse » et « tableau synoptique des forces ». Les PDF sont dans
 * `public/documents/physique-chimie/`. Préparé pour l'évaluation de cours
 * du lundi 16/11/2026.
 */
const matiere = { nom: "Physique-Chimie", couleur: "#6f8fae", emoji: "⚗️" };
const dossier = "documents/physique-chimie";

export const PHYSIQUE_MOUVEMENT: ChapitrePublie[] = [
  {
    id: "pc-1re-chap9-mouvement",
    version: 7,
    calculs: CALCULS_CHAP9,
    definitions: DEF_PC_CHAP9,
    matiere,
    titre: "Chap. 9 · Décrire un mouvement",
    documents: [
      {
        titre: "Chap. 9 · Décrire un mouvement",
        fichier: `${dossier}/chap9-decrire-un-mouvement.pdf`,
        detail: "Cours du prof · 4 pages",
      },
      {
        titre: "Fiche méthode · Calculer une vitesse (méthode d'Euler)",
        fichier: `${dossier}/fiche-methode-euler.pdf`,
        detail: "Fiche manuscrite · 1 page",
      },
    ],
    flashcards: [
      { recto: "Système", verso: "L'objet dont on étudie le mouvement." },
      {
        recto: "Point matériel",
        verso:
          "Modèle du système réduit à un seul point, en général son centre de gravité, auquel on associe toute la masse m du système.",
      },
      {
        recto: "Limite du modèle du point matériel",
        verso:
          "On perd des informations sur le mouvement : par exemple la rotation d'un marteau qui tourne sur lui-même.",
      },
      {
        recto: "Référentiel",
        verso:
          "Objet de référence, supposé fixe, par rapport auquel on étudie le mouvement. On lui associe un repère d'espace et une horloge.",
      },
      {
        recto: "Repère d'espace et horloge",
        verso:
          "Le repère d'espace (par exemple cartésien) sert à décrire les positions ; l'horloge mesure les instants t à partir d'une origine t = 0.",
      },
      {
        recto: "Référentiel terrestre",
        verso:
          "Lié à un objet fixe à la surface de la Terre. Pour les mouvements sur Terre plus courts qu'une rotation de la Terre : cycliste, chute d'une balle.",
      },
      {
        recto: "Référentiel géocentrique",
        verso:
          "Origine au centre de la Terre, axes dirigés vers trois étoiles lointaines supposées fixes. Pour l'échelle de la planète : la Lune, les satellites.",
      },
      {
        recto: "Référentiel héliocentrique",
        verso:
          "Origine au centre du Soleil, axes dirigés vers trois étoiles lointaines supposées fixes. Pour le système solaire : planètes, comètes.",
      },
      {
        recto: "Relativité du mouvement", schema: RELATIVITE,
        verso:
          "Le mouvement dépend du référentiel. Une balle lâchée dans un train tombe verticalement pour un passager, mais décrit une courbe vue depuis le quai.",
      },
      {
        recto: "Chronophotographie",
        verso:
          "Succession de photographies prises à intervalles de temps égaux, qui décompose un mouvement en positions successives.",
      },
      {
        recto: "Trajectoire",
        verso:
          "Courbe orientée formée par l'ensemble des positions successives du point au cours du mouvement ; elle indique le sens et la direction du mouvement.",
      },
      {
        recto: "Les trois types de trajectoires", schema: TRAJECTOIRES,
        verso:
          "Rectiligne (une droite), circulaire (un cercle), curviligne (une courbe quelconque).",
      },
      {
        recto: "Vecteur déplacement",
        verso:
          "Le vecteur MM'⃗ qui relie deux positions successives M et M', orienté dans le sens du mouvement.",
      },
      {
        recto: "Vecteur vitesse moyenne", schema: VITESSE_MOYENNE,
        verso:
          "v⃗ = {{MM'⃗ // Δt}}, avec MM'⃗ le vecteur déplacement et Δt la durée du parcours de M à M'.",
      },
      {
        recto: "Vecteur vitesse instantanée (cours, chap. 9)", schema: VITESSE_INSTANTANEE,
        verso:
          "v⃗ᵢ = {{MᵢMᵢ₊₁⃗ // tᵢ₊₁ − tᵢ}}, avec la durée en s et le déplacement en m.",
      },
      {
        recto: "Les caractéristiques du vecteur vitesse en Mᵢ",
        verso:
          "Origine : le point Mᵢ. Direction : celle du segment [MᵢMᵢ₊₁], tangente à la trajectoire. Sens : celui du mouvement. Longueur : proportionnelle à la vitesse, selon l'échelle.",
      },
      {
        recto: "Direction du vecteur vitesse",
        verso:
          "Le vecteur vitesse est toujours tangent à la trajectoire au point considéré.",
      },
      {
        recto: "Unité de la vitesse",
        verso:
          "Le mètre par seconde (m/s, ou m·s⁻¹). Pour changer d'unité, on convertit séparément la distance et la durée : 1 km = 10³ m et 1 h = 3600 s.",
      },
      {
        recto: "Mouvement rectiligne uniforme",
        verso: "Trajectoire droite et vecteur vitesse qui ne varie pas.",
      },
      {
        recto: "Mouvement rectiligne non uniforme", schema: CARACTERISER,
        verso:
          "Trajectoire droite et vecteur vitesse qui varie : accéléré si la vitesse augmente (v₃ > v₁), décéléré si elle diminue (v₃ < v₁).",
      },
      {
        recto: "Lien entre vitesse et position",
        verso:
          "La vitesse est le taux de variation de la position ; en mathématiques, on parle de dérivée de la position.",
      },
      {
        recto: "Vecteur vitesse par encadrement (fiche Euler)", schema: ENCADREMENT,
        verso:
          "v⃗₂ = {{M₁M₃⃗ // t₃ − t₁}} : le vecteur vitesse en M₂ est parallèle au segment [M₁M₃].",
      },
      {
        recto: "Méthode d'Euler", schema: EULER,
        verso:
          "vₓᵢ = {{xᵢ₊₁ − xᵢ₋₁ // tᵢ₊₁ − tᵢ₋₁}} et vᵧᵢ = {{yᵢ₊₁ − yᵢ₋₁ // tᵢ₊₁ − tᵢ₋₁}} : on calcule les coordonnées des vecteurs vitesse à partir des positions.",
      },
      {
        recto: "Relation de Chasles dans la méthode d'Euler",
        verso:
          "M₁M₃⃗ = M₁O⃗ + OM₃⃗ = OM₃⃗ − OM₁⃗ : on passe des vecteurs position aux coordonnées.",
      },
      {
        recto: "Aviméca, Regressi, Python",
        verso:
          "Aviméca sert à pointer les positions sur une vidéo ; Regressi calcule numériquement les vitesses ; Python permet de tracer positions et vecteurs vitesse.",
      },
    ],
    fiche: {
      sections: [
        {
          titre: "Système et point matériel",
          points: [
            {
              t: "==Pour décrire un mouvement, on choisit d'abord le système (l'objet étudié) et le référentiel.==",
              n: 1,
            },
            {
              t: "On modélise le système par un point matériel : en général son centre de gravité, auquel on associe toute la masse m.",
              n: 1,
            },
            {
              t: "Ce modèle peut faire perdre des informations : la rotation d'un marteau qui tourne sur lui-même disparaît.",
              n: 3,
            },
          ],
        },
        {
          titre: "Référentiel",
          points: [
            {
              t: "==Référentiel : objet de référence supposé fixe, avec un repère d'espace (positions) et une horloge (instants, à partir de t = 0).==",
              n: 1,
            },
            {
              t: "Terrestre pour un mouvement sur Terre (cycliste, chute d'une balle) ; géocentrique pour la Lune et les satellites ; héliocentrique pour les planètes et les comètes.",
              n: 1,
            },
            {
              t: "Le mouvement dépend du référentiel : une balle lâchée dans un train tombe tout droit pour un passager, mais décrit une courbe vue du quai.",
              n: 2, schema: RELATIVITE,
            },
            {
              t: "Le référentiel terrestre convient aux mouvements plus courts qu'une rotation de la Terre sur elle-même.",
              n: 3,
            },
            {
              t: "Repères associés : géocentrique, origine au centre de la Terre ; héliocentrique, origine au centre du Soleil ; dans les deux cas, axes vers trois étoiles lointaines supposées fixes.",
              n: 4,
            },
          ],
        },
        {
          titre: "Trajectoire",
          points: [
            {
              t: "==La trajectoire est la courbe orientée formée par les positions successives du point.==",
              n: 1,
            },
            {
              t: "Elle peut être rectiligne (droite), circulaire (cercle) ou curviligne (courbe quelconque).",
              n: 2, schema: TRAJECTOIRES,
            },
            {
              t: "Une chronophotographie montre les positions prises à intervalles de temps égaux : c'est l'outil de base des exercices.",
              n: 2,
            },
            {
              t: "Une position est repérée par ses coordonnées dans un repère gradué à une échelle adaptée, et par l'instant t correspondant.",
              n: 4, schema: COORDONNEES,
            },
          ],
        },
        {
          titre: "Vecteur vitesse",
          points: [
            {
              t: "==Vitesse moyenne : v⃗ = {{MM'⃗ // Δt}}. Vitesse instantanée en Mᵢ : v⃗ᵢ = {{MᵢMᵢ₊₁⃗ // tᵢ₊₁ − tᵢ}}.==",
              n: 1, schema: VITESSE_MOYENNE,
            },
            {
              t: "==Le vecteur vitesse est toujours tangent à la trajectoire.==",
              n: 1,
            },
            {
              t: "Ses caractéristiques : origine au point Mᵢ, direction du segment [MᵢMᵢ₊₁], sens du mouvement, longueur proportionnelle à la vitesse selon l'échelle.",
              n: 2, schema: VITESSE_INSTANTANEE,
            },
            {
              t: "Attention : le chap. 11 et la fiche Euler calculent la vitesse en Mᵢ par encadrement, avec Mᵢ₋₁ et Mᵢ₊₁. Utilise la formule demandée dans l'énoncé.",
              n: 2,
            },
            {
              t: "Vecteur déplacement : le vecteur MM'⃗ qui relie deux positions successives, dans le sens du mouvement.",
              n: 3,
            },
            {
              t: "La vitesse s'exprime en m/s. Pour la donner en km/h, on convertit la distance et la durée : 10 m/s = {{10 × 10⁻³ km // (1/3600) h}} = 36 km/h.",
              n: 3,
            },
          ],
        },
        {
          titre: "Caractériser un mouvement",
          points: [
            {
              t: "==Sur une trajectoire droite : vecteur vitesse constant, mouvement rectiligne uniforme ; vecteur vitesse qui varie, rectiligne non uniforme.==",
              n: 1,
            },
            {
              t: "Non uniforme accéléré si la vitesse augmente (v₃ > v₁), décéléré si elle diminue (v₃ < v₁).",
              n: 2,
            },
            {
              t: "Sur une chronophotographie : points également espacés, uniforme ; de plus en plus espacés, accéléré ; de plus en plus serrés, décéléré.",
              n: 2, schema: CARACTERISER,
            },
          ],
        },
        {
          titre: "Méthode d'Euler (fiche méthode)",
          points: [
            {
              t: "==La vitesse est le taux de variation, ou dérivée, de la position.==",
              n: 2,
            },
            {
              t: "==Par encadrement : v⃗₂ = {{M₁M₃⃗ // t₃ − t₁}}, parallèle au segment [M₁M₃].==",
              n: 2,
            },
            {
              t: "Coordonnées : vₓᵢ = {{xᵢ₊₁ − xᵢ₋₁ // tᵢ₊₁ − tᵢ₋₁}} et vᵧᵢ = {{yᵢ₊₁ − yᵢ₋₁ // tᵢ₊₁ − tᵢ₋₁}}.",
              n: 2, schema: EULER,
            },
            {
              t: "On y arrive avec la relation de Chasles : M₁M₃⃗ = OM₃⃗ − OM₁⃗.",
              n: 3,
            },
            {
              t: "Outils : Aviméca pour pointer les positions, Regressi pour calculer les vitesses, Python pour tracer positions et vecteurs vitesse.",
              n: 4,
            },
            {
              t: "Ta fiche présente Euler comme un mathématicien allemand du XIXe siècle : Leonhard Euler était suisse et a vécu au XVIIIe siècle (1707-1783).",
              n: 5,
            },
          ],
        },
        {
          titre: "Capacités exigibles",
          points: [
            {
              t: "==Décrire un mouvement par celui d'un point matériel et expliquer l'influence du choix du référentiel.==",
              n: 3,
            },
            {
              t: "Caractériser un mouvement rectiligne, uniforme ou non, d'après la variation du vecteur vitesse.",
              n: 3,
            },
            {
              t: "Exploiter une chronophotographie pour représenter des vecteurs vitesse.",
              n: 3,
            },
            {
              t: "Pointer des positions avec un logiciel (Aviméca) et les représenter avec Python.",
              n: 5,
            },
          ],
        },
      ],
      aRetenir: [
        "Système",
        "Point matériel",
        "Référentiel",
        "Relativité du mouvement",
        "Trajectoire",
        "Chronophotographie",
        "Vecteur vitesse",
        "Méthode d'Euler",
      ],
    },
    exercices: [
      {
        question:
          "Quel référentiel choisir pour étudier le mouvement de la Lune autour de la Terre ?",
        choix: ["Terrestre", "Géocentrique", "Héliocentrique", "Lié à la Lune"],
        bonneReponse: 1,
        explication:
          "À l'échelle de la planète (Lune, satellites), on utilise le référentiel géocentrique.",
      },
      {
        question:
          "Quel référentiel choisir pour étudier le mouvement d'un cycliste sur une route ?",
        choix: [
          "Terrestre",
          "Géocentrique",
          "Héliocentrique",
          "Aucun n'est adapté",
        ],
        bonneReponse: 0,
        explication:
          "Pour un mouvement sur Terre, court devant une rotation de la Terre, le référentiel terrestre convient.",
      },
      {
        question:
          "Sur une chronophotographie, les points sont alignés et de plus en plus espacés. Le mouvement est…",
        choix: [
          "rectiligne uniforme",
          "rectiligne accéléré",
          "rectiligne décéléré",
          "circulaire uniforme",
        ],
        bonneReponse: 1,
        explication:
          "Les photos sont prises à intervalles égaux : si la distance parcourue augmente, la vitesse augmente.",
      },
      {
        question:
          "Entre deux positions successives, le point parcourt 12 cm en 40 ms. Quelle est sa vitesse ?",
        choix: ["0,30 m/s", "3,0 m/s", "30 m/s", "0,48 m/s"],
        bonneReponse: 1,
        explication:
          "v = {{0,12 m // 0,040 s}} = 3,0 m/s. Pense à convertir en mètres et en secondes.",
      },
      {
        question:
          "On lit x₁ = 0,10 m à t₁ = 0,20 s et x₃ = 0,50 m à t₃ = 0,60 s. Avec la méthode d'Euler, que vaut vₓ₂ ?",
        choix: ["0,50 m/s", "1,0 m/s", "2,0 m/s", "0,83 m/s"],
        bonneReponse: 1,
        explication: "vₓ₂ = {{x₃ − x₁ // t₃ − t₁}} = {{0,40 // 0,40}} = 1,0 m/s.",
      },
      {
        question:
          "Quelle est la direction du vecteur vitesse en un point de la trajectoire ?",
        choix: [
          "Vers le centre de la trajectoire",
          "Tangente à la trajectoire",
          "Perpendiculaire à la trajectoire",
          "Verticale",
        ],
        bonneReponse: 1,
        explication:
          "Le vecteur vitesse est toujours tangent à la trajectoire au point considéré.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Le mouvement d'un objet est le même quel que soit le référentiel choisi.",
        vrai: false,
        explication:
          "C'est la relativité du mouvement : la balle lâchée dans un train tombe tout droit pour un passager, mais décrit une courbe vue du quai.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Modéliser un marteau qui tourne sur lui-même par un point matériel conserve toutes les informations sur son mouvement.",
        vrai: false,
        explication:
          "Le point matériel fait perdre l'information de rotation du marteau.",
      },
      {
        type: "vraiFaux",
        affirmation: "Une vitesse de 10 m/s correspond à 36 km/h.",
        vrai: true,
        explication: "On convertit les mètres et les secondes : 10 m en 1 s = 10 × 10⁻³ km en {{1 // 3600}} h, soit 10 × 10⁻³ × 3600 = 36 km/h.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Une chronophotographie est faite de photos prises à intervalles de temps égaux.",
        vrai: true,
        explication:
          "C'est ce qui permet de comparer les distances parcourues et donc les vitesses.",
      },
      {
        type: "trou",
        texte:
          "Le ___ est l'objet de référence, supposé fixe, par rapport auquel on étudie un mouvement.",
        reponses: ["référentiel"],
        explication: "On lui associe un repère d'espace et une horloge.",
      },
      {
        type: "trou",
        texte:
          "Si le vecteur vitesse ne varie pas sur une trajectoire droite, le mouvement est rectiligne ___.",
        reponses: ["uniforme"],
        explication:
          "S'il varie, le mouvement est rectiligne non uniforme (accéléré ou décéléré).",
      },
      {
        type: "trou",
        texte:
          "Une succession de photos prises à intervalles de temps égaux s'appelle une ___.",
        reponses: ["chronophotographie"],
        explication: "Elle décompose le mouvement en positions successives.",
      },
      {
        type: "trou",
        texte: "La vitesse est la ___ de la position par rapport au temps.",
        reponses: ["dérivée", "taux de variation"],
        explication:
          "La fiche méthode parle de taux de variation, ou de dérivée en mathématiques.",
      },
      {
        type: "ordre",
        consigne: "Remets dans l'ordre les étapes pour décrire un mouvement.",
        elements: [
          "Définir le système et le point étudié",
          "Choisir le référentiel",
          "Indiquer la trajectoire du point",
          "Étudier le vecteur vitesse",
        ],
        explication:
          "C'est l'ordre de la synthèse du cours : système, référentiel, trajectoire, puis vitesse.",
      },
      {
        type: "ordre",
        consigne: "Classe ces référentiels du plus local au plus vaste.",
        elements: ["Terrestre", "Géocentrique", "Héliocentrique"],
        explication:
          "Un objet sur Terre, puis la Terre et ses satellites, puis le système solaire.",
      },
      {
        type: "ouverte",
        question:
          "Pourquoi une balle lâchée dans un train en mouvement n'a-t-elle pas la même trajectoire pour un passager et pour une personne sur le quai ?",
        corrige:
          "Parce que le mouvement dépend du référentiel. Dans le référentiel du train, la balle tombe verticalement. Dans le référentiel du quai, elle avance en plus avec le train, donc sa trajectoire est une courbe.",
      },
      {
        type: "ouverte",
        question:
          "Donne les quatre caractéristiques du vecteur vitesse au point Mᵢ.",
        corrige:
          "Origine : le point Mᵢ. Direction : celle du segment [MᵢMᵢ₊₁], tangente à la trajectoire. Sens : celui du mouvement. Longueur : proportionnelle à la valeur de la vitesse, selon l'échelle choisie.",
      },
      {
        type: "ouverte",
        question:
          "Comment calcule-t-on les coordonnées du vecteur vitesse au point M₂ à partir des positions (méthode d'Euler) ?",
        corrige:
          "On encadre M₂ par M₁ et M₃ : vₓ₂ = {{x₃ − x₁ // t₃ − t₁}} et vᵧ₂ = {{y₃ − y₁ // t₃ − t₁}}. Cela vient de v⃗₂ = {{M₁M₃⃗ // t₃ − t₁}} et de la relation de Chasles, M₁M₃⃗ = OM₃⃗ − OM₁⃗.",
      },
    ],
  },
  {
    id: "pc-1re-chap11-newton",
    version: 8,
    problemes: PROBLEMES_CHAP11,
    calculs: CALCULS_CHAP11,
    definitions: DEF_PC_CHAP11,
    matiere,
    titre: "Chap. 11 · Mouvement d'un système et lois de Newton",
    documents: [
      {
        titre: "Chap. 11 · Mouvement d'un système",
        fichier: `${dossier}/chap11-mouvement-d-un-systeme.pdf`,
        detail: "Cours du prof · 4 pages",
      },
      {
        titre: "Fiche méthode · Tracer le vecteur variation de vitesse",
        fichier: `${dossier}/fiche-methode-variation-de-vitesse.pdf`,
        detail: "Fiche manuscrite · 1 page",
      },
    ],
    flashcards: [
      {
        recto: "Cinématique",
        verso:
          "Étude des mouvements indépendamment de leurs causes, c'est-à-dire des forces.",
      },
      {
        recto: "Système ponctuel",
        verso:
          "Système dont les dimensions sont petites devant la région où il évolue ; on le représente par un point matériel de même masse, placé en son centre de gravité.",
      },
      {
        recto: "Référentiel galiléen",
        verso:
          "Référentiel dans lequel le principe d'inertie est vérifié. Tout référentiel en translation rectiligne uniforme par rapport à un référentiel galiléen l'est aussi.",
      },
      {
        recto: "Le référentiel héliocentrique est-il galiléen ?",
        verso: "Oui : le principe d'inertie y est vérifié.",
      },
      {
        recto:
          "Les référentiels terrestre et géocentrique sont-ils galiléens ?",
        verso:
          "Seulement sur des durées courtes, de l'ordre d'une expérience en laboratoire.",
      },
      {
        recto: "Où les lois de Newton sont-elles valables ?",
        verso: "Uniquement dans un référentiel galiléen.",
      },
      {
        recto: "Vecteur vitesse par encadrement (chap. 11)", schema: ENCADREMENT,
        verso:
          "v⃗ᵢ = {{Mᵢ₋₁Mᵢ₊₁⃗ // 2Δt}}, avec Δt l'intervalle de temps entre deux positions.",
      },
      {
        recto: "Vecteur variation de vitesse",
        verso:
          "Δv⃗ᵢ = v⃗ᵢ₊₁ − v⃗ᵢ₋₁ : la différence entre le vecteur vitesse au point suivant et au point précédent.",
      },
      {
        recto: "Δv⃗ dans un mouvement rectiligne uniforme",
        verso: "Δv⃗ = 0⃗ : le vecteur vitesse ne change pas.",
      },
      {
        recto: "Δv⃗ dans un mouvement rectiligne accéléré ou ralenti", schema: VARIATION_RECTILIGNE,
        verso:
          "Accéléré : Δv⃗ dans le sens du mouvement. Ralenti : Δv⃗ dans le sens opposé.",
      },
      {
        recto: "Δv⃗ dans un mouvement circulaire uniforme",
        verso:
          "Δv⃗ est dirigé vers le centre de la trajectoire : la valeur de la vitesse ne change pas, mais sa direction change.",
      },
      {
        recto: "Modéliser une action mécanique",
        verso:
          "Par une force, représentée par un vecteur : origine au point du système, direction et sens de l'action, longueur proportionnelle à la valeur en newtons (N).",
      },
      {
        recto: "Résultante des forces", schema: SKIEUR,
        verso:
          "La somme vectorielle ΣF⃗ de toutes les forces qui s'exercent sur le système.",
      },
      {
        recto: "2e loi de Newton (principe fondamental de la dynamique)",
        verso: "Dans un référentiel galiléen : ΣF⃗ = {{m·Δv⃗ // Δt}}.",
      },
      {
        recto: "Conséquence de la 2e loi sur les directions", schema: DEUXIEME_LOI,
        verso: "ΣF⃗ et Δv⃗ sont colinéaires et de même sens.",
      },
      {
        recto: "Ce que signifie la 2e loi",
        verso:
          "Un système ne peut accélérer ou changer de direction que si des forces lui sont appliquées.",
      },
      {
        recto: "Variation de vitesse, masse et forces",
        verso:
          "Pendant une même durée, Δv est proportionnelle à la somme des forces et inversement proportionnelle à la masse.",
      },
      {
        recto: "Principe d'inertie (1re loi de Newton)",
        verso:
          "Un système isolé ou pseudo-isolé reste au repos s'il était immobile, ou est en mouvement rectiligne uniforme s'il était en mouvement.",
      },
      {
        recto: "Isolé ou pseudo-isolé",
        verso:
          "Isolé : aucune force extérieure. Pseudo-isolé : les forces extérieures se compensent (ΣF⃗ = 0⃗).",
      },
      {
        recto: "Le principe d'inertie en une ligne",
        verso: "v⃗ = 0⃗ ou v⃗ constant ⟺ Δv⃗ = 0⃗ ⟺ ΣF⃗ = 0⃗.",
      },
      {
        recto: "Inertie",
        verso: "Capacité d'un système à résister aux changements de vitesse.",
      },
      {
        recto: "Faut-il une force pour être en mouvement ?",
        verso:
          "Non : d'après le principe d'inertie, un système peut être en mouvement rectiligne uniforme sans qu'aucune force ne le pousse.",
      },
      {
        recto: "3e loi de Newton (actions réciproques)",
        verso:
          "À toute action d'un système A sur un système B correspond une réaction égale et opposée de B sur A : F⃗A→B = −F⃗B→A.",
      },
      {
        recto: "Propulsion d'une fusée", schema: FUSEE,
        verso:
          "La fusée expulse des gaz vers le bas ; d'après la 3e loi, les gaz exercent sur la fusée une force vers le haut, F⃗gaz/fusée, qui la fait décoller.",
      },
      {
        recto: "Tracer Δv⃗₃ (fiche méthode)", schema: CONSTRUCTION_DELTA_V,
        verso:
          "Tracer v⃗₂ en M₂ et v⃗₄ en M₄ ; reporter v⃗₄ à partir de M₃ ; ajouter −v⃗₂ au bout ; relier M₃ à l'extrémité obtenue : c'est Δv⃗₃.",
      },
      {
        recto: "La Lune et la 2e loi",
        verso:
          "Δv⃗₃ pointe vers le centre de la Terre, comme F⃗g, la seule force qui s'exerce sur la Lune : ΣF⃗ et Δv⃗ sont bien colinéaires et de même sens.",
      },
    ],
    fiche: {
      sections: [
        {
          titre: "Cinématique et référentiel galiléen",
          points: [
            {
              t: "==Référentiel galiléen : référentiel où le principe d'inertie est vérifié. Les lois de Newton ne valent que là.==",
              n: 1,
            },
            {
              t: "Le référentiel héliocentrique est galiléen ; terrestre et géocentrique ne le sont que sur des durées courtes (une expérience de laboratoire).",
              n: 1,
            },
            {
              t: "La cinématique étudie les mouvements sans s'occuper de leurs causes (les forces).",
              n: 2,
            },
            {
              t: "Un référentiel en translation rectiligne uniforme par rapport à un référentiel galiléen est lui aussi galiléen.",
              n: 3,
            },
            {
              t: "Un système est ponctuel si ses dimensions sont petites devant la région où il évolue.",
              n: 4,
            },
          ],
        },
        {
          titre: "Variation de vitesse",
          points: [
            { t: "==Δv⃗ᵢ = v⃗ᵢ₊₁ − v⃗ᵢ₋₁.==", n: 1 },
            {
              t: "==Rectiligne uniforme : Δv⃗ = 0⃗. Accéléré : Δv⃗ dans le sens du mouvement. Ralenti : Δv⃗ dans le sens opposé.==",
              n: 1, schema: VARIATION_RECTILIGNE,
            },
            {
              t: "Circulaire uniforme : Δv⃗ dirigé vers le centre, car la direction de la vitesse change.",
              n: 1,
            },
            { t: "Vitesse par encadrement : v⃗ᵢ = {{Mᵢ₋₁Mᵢ₊₁⃗ // 2Δt}}.", n: 2, schema: ENCADREMENT },
            {
              t: "Méthode pour Δv⃗₃ : tracer v⃗₂ et v⃗₄, reporter v⃗₄ à partir de M₃, ajouter −v⃗₂, puis relier M₃ à l'extrémité.",
              n: 2, schema: CONSTRUCTION_DELTA_V,
            },
            {
              t: "Dans la fiche méthode (Lune, mouvement uniforme), tous les vecteurs vitesse ont la même longueur : 2,0 cm.",
              n: 4,
            },
          ],
        },
        {
          titre: "Modéliser une action",
          points: [
            {
              t: "==Une action mécanique est modélisée par une force : origine au point du système, direction et sens de l'action, longueur proportionnelle à la valeur en newtons (N).==",
              n: 1,
            },
            {
              t: "La somme vectorielle des forces s'appelle la résultante, notée ΣF⃗.",
              n: 2,
            },
            {
              t: "Exemple du cours : un skieur tiré par un téléski subit la tension T⃗, la réaction R⃗ et le poids P⃗.",
              n: 4, schema: SKIEUR,
            },
          ],
        },
        {
          titre: "2e loi de Newton",
          points: [
            { t: "==Dans un référentiel galiléen : ΣF⃗ = {{m·Δv⃗ // Δt}}.==", n: 1 },
            { t: "==ΣF⃗ et Δv⃗ sont colinéaires et de même sens.==", n: 1, schema: DEUXIEME_LOI },
            {
              t: "Un système ne peut accélérer ou changer de direction que si des forces s'exercent sur lui.",
              n: 2,
            },
            {
              t: "Pendant une même durée, Δv est proportionnelle à la somme des forces et inversement proportionnelle à la masse.",
              n: 2,
            },
            {
              t: "Exemple de la Lune : Δv⃗₃ pointe vers la Terre, comme F⃗g, seule force appliquée.",
              n: 3,
            },
            {
              t: "La force nécessaire pour modifier la vitesse d'un système est proportionnelle à sa masse.",
              n: 3,
            },
          ],
        },
        {
          titre: "1re loi : principe d'inertie",
          points: [
            {
              t: "==Un système isolé ou pseudo-isolé reste au repos, ou garde un mouvement rectiligne uniforme.==",
              n: 1,
            },
            {
              t: "Isolé : aucune force. Pseudo-isolé : les forces se compensent.",
              n: 2,
            },
            { t: "v⃗ = 0⃗ ou v⃗ constant ⟺ Δv⃗ = 0⃗ ⟺ ΣF⃗ = 0⃗.", n: 2 },
            {
              t: "Il n'est pas nécessaire qu'une force s'exerce pour qu'un système soit en mouvement.",
              n: 3,
            },
            {
              t: "L'inertie est la capacité d'un système à résister aux changements de vitesse.",
              n: 3,
            },
          ],
        },
        {
          titre: "3e loi : actions réciproques",
          points: [
            {
              t: "==F⃗A→B = −F⃗B→A : même valeur, même direction, sens opposés.==",
              n: 1,
            },
            {
              t: "Exemple : la fusée pousse les gaz vers le bas, les gaz poussent la fusée vers le haut.",
              n: 2, schema: FUSEE,
            },
            {
              t: "Les deux forces s'exercent sur deux systèmes différents (l'une sur A, l'autre sur B).",
              n: 4,
            },
          ],
        },
        {
          titre: "Capacités exigibles",
          points: [
            {
              t: "==Soustraire des vecteurs vitesse, construire et caractériser un vecteur variation de vitesse.==",
              n: 3,
            },
            {
              t: "Relier la variation de vitesse au type de mouvement, et aux forces par la 2e loi.",
              n: 3,
            },
            {
              t: "Connaître les conséquences du principe d'inertie sur le mouvement d'un système.",
              n: 3,
            },
          ],
        },
      ],
      aRetenir: [
        "Référentiel galiléen",
        "Δv⃗ = v⃗ᵢ₊₁ − v⃗ᵢ₋₁",
        "ΣF⃗ = {{m·Δv⃗ // Δt}}",
        "Principe d'inertie",
        "Pseudo-isolé",
        "Actions réciproques",
        "Inertie",
      ],
    },
    exercices: [
      {
        question:
          "Un objet de 2,0 kg voit sa vitesse augmenter de 3,0 m/s en 0,50 s. Quelle est la valeur de la somme des forces ?",
        choix: ["3,0 N", "6,0 N", "12 N", "0,75 N"],
        bonneReponse: 2,
        explication: "ΣF = {{m × Δv // Δt}} = {{2,0 × 3,0 // 0,50}} = 12 N.",
      },
      {
        question:
          "On applique la même force pendant la même durée à un objet deux fois plus lourd. Sa variation de vitesse est…",
        choix: [
          "deux fois plus grande",
          "la même",
          "deux fois plus petite",
          "nulle",
        ],
        bonneReponse: 2,
        explication:
          "Δv est inversement proportionnelle à la masse : doubler la masse divise Δv par deux.",
      },
      {
        question:
          "Dans un mouvement circulaire uniforme, le vecteur variation de vitesse est…",
        choix: [
          "nul",
          "tangent à la trajectoire",
          "dirigé vers le centre",
          "dirigé vers l'extérieur",
        ],
        bonneReponse: 2,
        explication:
          "La valeur de la vitesse ne change pas, mais sa direction tourne : Δv⃗ pointe vers le centre.",
      },
      {
        question: "Quelle loi de Newton explique la propulsion d'une fusée ?",
        choix: [
          "La 1re loi (principe d'inertie)",
          "La 2e loi (principe fondamental)",
          "La 3e loi (actions réciproques)",
          "Aucune",
        ],
        bonneReponse: 2,
        explication:
          "La fusée exerce une force sur les gaz ; les gaz exercent en retour une force opposée sur la fusée.",
      },
      {
        question:
          "Un palet glisse sur une glace parfaite : son poids et la réaction de la glace se compensent. Son mouvement est…",
        choix: [
          "rectiligne uniforme",
          "rectiligne ralenti",
          "circulaire",
          "il s'arrête aussitôt",
        ],
        bonneReponse: 0,
        explication:
          "Système pseudo-isolé : d'après le principe d'inertie, il garde un mouvement rectiligne uniforme.",
      },
      {
        question:
          "Comment calcule-t-on le vecteur variation de vitesse au point M₃ ?",
        choix: [
          "Δv⃗₃ = v⃗₃ − v⃗₂",
          "Δv⃗₃ = v⃗₄ − v⃗₂",
          "Δv⃗₃ = v⃗₄ + v⃗₂",
          "Δv⃗₃ = v⃗₂ − v⃗₄",
        ],
        bonneReponse: 1,
        explication: "Δv⃗ᵢ = v⃗ᵢ₊₁ − v⃗ᵢ₋₁, donc ici v⃗₄ − v⃗₂.",
      },
      {
        question: "Dans un mouvement rectiligne ralenti, le vecteur Δv⃗ est…",
        choix: [
          "nul",
          "dans le sens du mouvement",
          "dans le sens opposé au mouvement",
          "perpendiculaire au mouvement",
        ],
        bonneReponse: 2,
        explication:
          "La vitesse diminue : Δv⃗ est opposé au mouvement, comme la somme des forces.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Un objet en mouvement subit forcément une force dans le sens de son mouvement.",
        vrai: false,
        explication:
          "D'après le principe d'inertie, un objet peut être en mouvement rectiligne uniforme alors que les forces se compensent.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "La somme des forces et le vecteur variation de vitesse ont la même direction et le même sens.",
        vrai: true,
        explication: "C'est une conséquence de la 2e loi : ΣF⃗ = {{m·Δv⃗ // Δt}}.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Dans un mouvement circulaire uniforme, le vecteur variation de vitesse est nul.",
        vrai: false,
        explication:
          "La valeur ne change pas, mais la direction oui : Δv⃗ pointe vers le centre.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Le référentiel terrestre peut être considéré comme galiléen pendant une expérience de quelques minutes en laboratoire.",
        vrai: true,
        explication:
          "Sur une durée courte, la Terre se déplace presque en ligne droite à vitesse constante.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Les lois de Newton s'appliquent dans n'importe quel référentiel.",
        vrai: false,
        explication: "Elles ne sont valables que dans un référentiel galiléen.",
      },
      {
        type: "trou",
        texte: "Un système soumis à des forces qui se compensent est dit ___.",
        reponses: ["pseudo-isolé", "pseudo isolé"],
        explication: "Sans aucune force, il serait isolé.",
      },
      {
        type: "trou",
        texte:
          "La capacité d'un système à résister aux changements de vitesse s'appelle l'___.",
        reponses: ["inertie"],
        explication: "C'est ce qui donne son nom au principe d'inertie.",
      },
      {
        type: "trou",
        texte:
          "L'étude des mouvements, sans s'intéresser à leurs causes, s'appelle la ___.",
        reponses: ["cinématique"],
        explication: "Du grec kinêma, le mouvement.",
      },
      {
        type: "trou",
        texte:
          "Un référentiel dans lequel le principe d'inertie est vérifié est dit ___.",
        reponses: ["galiléen"],
        explication: "Le référentiel héliocentrique en est un exemple.",
      },
      {
        type: "ordre",
        consigne: "Remets dans l'ordre les étapes pour tracer Δv⃗₃.",
        elements: [
          "Tracer v⃗₂ au point M₂ et v⃗₄ au point M₄",
          "Reporter v⃗₄ à partir du point M₃",
          "Ajouter −v⃗₂ au bout de v⃗₄",
          "Relier M₃ à l'extrémité obtenue : c'est Δv⃗₃",
        ],
        explication:
          "C'est la construction en trois étapes de la fiche méthode, précédée du tracé des deux vecteurs vitesse.",
      },
      {
        type: "ouverte",
        question: "Énonce les trois lois de Newton.",
        corrige:
          "1re loi (inertie) : un système isolé ou pseudo-isolé reste au repos ou garde un mouvement rectiligne uniforme. 2e loi : dans un référentiel galiléen, ΣF⃗ = {{m·Δv⃗ // Δt}}. 3e loi : F⃗A→B = −F⃗B→A.",
      },
      {
        type: "ouverte",
        question:
          "Dans la fiche méthode, pourquoi Δv⃗₃ pointe-t-il vers la Terre, et qu'est-ce que cela illustre ?",
        corrige:
          "La seule force qui s'exerce sur la Lune est la force de gravitation F⃗g, dirigée vers le centre de la Terre. D'après la 2e loi, ΣF⃗ et Δv⃗ sont colinéaires et de même sens : Δv⃗₃ pointe donc lui aussi vers la Terre.",
      },
      {
        type: "ouverte",
        question:
          "Dans un bus qui freine brusquement, un passager debout part vers l'avant. Explique-le avec le principe d'inertie.",
        corrige:
          "Le passager tend à garder sa vitesse (inertie). Le bus ralentit, mais aucune force suffisante ne freine le passager au même moment : par rapport au bus, il continue vers l'avant.",
      },
    ],
  },
  {
    id: "pc-1re-forces",
    version: 8,
    calculs: CALCULS_FORCES,
    definitions: DEF_PC_FORCES,
    matiere,
    titre: "Les forces en spé PC",
    documents: [
      {
        titre: "Tableau synoptique des forces",
        fichier: `${dossier}/fiche-methode-forces.pdf`,
        detail: "Fiche manuscrite · 1 page",
      },
    ],
    flashcards: [
      {
        recto: "Les deux familles de forces",
        verso:
          "Les forces de contact (réaction, tension, frottement, ressort) et les forces à distance (gravitation, poids, poussée d'Archimède, force électrostatique).",
      },
      { recto: "Unité de force", verso: "Le newton (N)." },
      {
        recto: "Réaction normale R⃗N d'un support", schema: REACTION,
        verso:
          "Force exercée par le support sur l'objet ; pour un support horizontal, verticale vers le haut.",
      },
      {
        recto: "Bille immobile sur une table",
        verso: "P⃗ + R⃗N = 0⃗, donc R⃗N = −P⃗ : les deux forces se compensent.",
      },
      {
        recto: "Tension T⃗ d'un fil", schema: TENSION,
        verso: "Force dirigée le long du fil, vers le point d'attache.",
      },
      {
        recto: "Frottement fluide f⃗", schema: FROTTEMENT,
        verso:
          "Force exercée par un fluide (air, eau) sur un objet en mouvement, opposée au mouvement : dans une chute, f⃗ est vers le haut.",
      },
      {
        recto: "Chute libre",
        verso: "Chute où seul le poids s'exerce sur l'objet.",
      },
      {
        recto: "Vitesse limite",
        verso:
          "Dans une chute avec frottements, quand le frottement compense le poids, la vitesse devient constante : c'est la vitesse limite.",
      },
      {
        recto: "Force de rappel d'un ressort", schema: RESSORT,
        verso:
          "Loi de Hooke : F⃗r = −k · Δl⃗, avec k la constante de raideur et Δl⃗ l'allongement du ressort.",
      },
      {
        recto: "Force de gravitation F⃗g", schema: GRAVITATION,
        verso:
          "Force à distance entre deux corps qui ont une masse, dirigée vers le corps attracteur. On l'utilise loin de la surface de la Terre : par exemple pour la Lune.",
      },
      {
        recto: "Poids P⃗",
        verso:
          "P = m · g, vertical, vers le bas. À la surface d'une planète, le poids est assimilé à la force de gravitation.",
      },
      {
        recto: "Valeur de g sur Terre",
        verso: "g = 9,81 N/kg (ou m·s⁻²), la valeur qu'utilise ton prof.",
      },
      {
        recto: "Poussée d'Archimède Π⃗A", schema: ARCHIMEDE,
        verso:
          "Force verticale, vers le haut, exercée par un fluide sur un objet immergé : ΠA = ρfluide × Vimmergé × g.",
      },
      {
        recto: "Force électrostatique de Coulomb F⃗e",
        verso:
          "Force à distance qui s'exerce uniquement entre deux corps portant des charges électriques.",
      },
      {
        recto: "Charges électriques : attraction ou répulsion ?", schema: COULOMB,
        verso:
          "Deux charges de signes opposés s'attirent ; deux charges de même signe se repoussent.",
      },
      {
        recto: "Coulomb et 3e loi de Newton",
        verso:
          "F⃗e(q₁ sur q₂) = −F⃗e(q₂ sur q₁) : les deux charges exercent l'une sur l'autre des forces opposées.",
      },
    ],
    fiche: {
      sections: [
        {
          titre: "Forces de contact",
          points: [
            {
              t: "==Réaction normale R⃗N : exercée par un support ; verticale vers le haut pour un support horizontal.==",
              n: 1, schema: REACTION,
            },
            {
              t: "Tension T⃗ : le long du fil, vers le point d'attache.",
              n: 1, schema: TENSION,
            },
            {
              t: "Frottement fluide f⃗ : opposé au mouvement dans l'air ou l'eau.",
              n: 1, schema: FROTTEMENT,
            },
            {
              t: "D'après ta fiche, la force de rappel d'un ressort est très marginale en Première et ne tombera pas en DST.",
              n: 2,
            },
            {
              t: "Force de rappel d'un ressort (loi de Hooke) : F⃗r = −k · Δl⃗, k constante de raideur, Δl⃗ allongement.",
              n: 4, schema: RESSORT,
            },
          ],
        },
        {
          titre: "Forces à distance",
          points: [
            {
              t: "==Poids : P = m · g, vertical, vers le bas (g = 9,81 N/kg sur Terre).==",
              n: 1,
            },
            {
              t: "==Gravitation F⃗g : dirigée vers le corps attracteur ; on l'utilise loin de la surface, pour la Lune ou un satellite.==",
              n: 1, schema: GRAVITATION,
            },
            {
              t: "Poussée d'Archimède Π⃗A : verticale, vers le haut, exercée par un fluide sur un objet immergé.",
              n: 1, schema: ARCHIMEDE,
            },
            {
              t: "Force de Coulomb F⃗e : uniquement entre corps chargés ; signes opposés, attraction ; même signe, répulsion.",
              n: 1, schema: COULOMB,
            },
            {
              t: "À la surface d'une planète, le poids est assimilé à la force de gravitation : P⃗ ≈ F⃗g.",
              n: 2,
            },
            {
              t: "ΠA = ρfluide × Vimmergé × g : elle dépend du volume immergé, pas de la masse de l'objet.",
              n: 2,
            },
            {
              t: "Entre deux charges, F⃗e(q₁ sur q₂) = −F⃗e(q₂ sur q₁) : c'est la 3e loi de Newton.",
              n: 3,
            },
          ],
        },
        {
          titre: "Situations types",
          points: [
            { t: "==Chute libre : seul le poids s'exerce.==", n: 1 },
            {
              t: "Chute avec frottements : poids et frottement ; quand ils se compensent, la vitesse atteint une valeur limite.",
              n: 2,
            },
            {
              t: "Bille immobile sur une table : P⃗ + R⃗N = 0⃗, les forces se compensent.",
              n: 2,
            },
            {
              t: "Lune autour de la Terre : une seule force, F⃗g, dirigée vers le centre de la Terre.",
              n: 3,
            },
          ],
        },
        {
          titre: "Point à vérifier avec ton prof",
          points: [
            {
              t: "Ta fiche présente P⃗ = −R⃗N pour la bille comme une illustration de la 3e loi. Attention : ==ces deux forces s'exercent sur la même bille, et leur compensation découle du principe d'inertie== (la bille est immobile). Le partenaire de R⃗N au sens de la 3e loi est la force exercée par la bille sur la table.",
              n: 4,
            },
          ],
        },
      ],
      aRetenir: [
        "Contact ou distance",
        "R⃗N",
        "T⃗",
        "f⃗",
        "P = m·g",
        "F⃗g",
        "Π⃗A",
        "F⃗e",
      ],
    },
    exercices: [
      {
        question: "Laquelle de ces forces est une force à distance ?",
        choix: [
          "La tension d'un fil",
          "La réaction d'un support",
          "Le poids",
          "Le frottement de l'air",
        ],
        bonneReponse: 2,
        explication:
          "Le poids s'exerce sans contact. Les trois autres sont des forces de contact.",
      },
      {
        question: "Quel est le poids d'un élève de 60 kg (g = 9,81 N/kg) ?",
        choix: ["60 N", "6,1 N", "5,9 × 10² N", "9,8 N"],
        bonneReponse: 2,
        explication: "P = m · g = 60 × 9,81 ≈ 589 N, soit environ 5,9 × 10² N.",
      },
      {
        question:
          "Un objet de 2,0 L est entièrement immergé dans l'eau (ρ = 1000 kg/m³, g = 9,81 N/kg). Quelle est la poussée d'Archimède ?",
        choix: ["2,0 N", "20 N", "2,0 × 10³ N", "0,20 N"],
        bonneReponse: 1,
        explication:
          "ΠA = 1000 × 2,0 × 10⁻³ × 9,81 ≈ 19,6 N, soit environ 20 N. Attention : 2,0 L = 2,0 × 10⁻³ m³.",
      },
      {
        question:
          "Deux corps portent chacun une charge positive. Que se passe-t-il ?",
        choix: [
          "Ils s'attirent",
          "Ils se repoussent",
          "Rien",
          "Cela dépend de leur masse",
        ],
        bonneReponse: 1,
        explication: "Deux charges de même signe se repoussent.",
      },
      {
        question:
          "Un parachutiste descend à vitesse constante. Que peut-on dire des forces ?",
        choix: [
          "Le poids est plus grand que le frottement",
          "Le frottement compense le poids",
          "Seul le poids s'exerce",
          "Aucune force ne s'exerce",
        ],
        bonneReponse: 1,
        explication:
          "Vitesse constante en ligne droite : les forces se compensent (principe d'inertie). C'est la vitesse limite.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Dans une chute libre, la seule force qui s'exerce est le poids.",
        vrai: true,
        explication: "C'est la définition de la chute libre.",
      },
      {
        type: "vraiFaux",
        affirmation: "La poussée d'Archimède est dirigée vers le bas.",
        vrai: false,
        explication: "Elle est verticale et dirigée vers le haut.",
      },
      {
        type: "vraiFaux",
        affirmation: "Deux charges de signes opposés se repoussent.",
        vrai: false,
        explication:
          "Elles s'attirent ; ce sont les charges de même signe qui se repoussent.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "La tension d'un fil est dirigée le long du fil, vers le point d'attache.",
        vrai: true,
        explication: "C'est sa direction et son sens.",
      },
      {
        type: "trou",
        texte: "Une chute où seul le poids s'exerce s'appelle une chute ___.",
        reponses: ["libre"],
        explication: "Avec des frottements, ce n'est plus une chute libre.",
      },
      {
        type: "trou",
        texte: "Le poids se calcule avec la formule P = m × ___.",
        reponses: ["g"],
        explication: "g = 9,81 N/kg à la surface de la Terre.",
      },
      {
        type: "trou",
        texte:
          "La force qui s'exerce entre deux corps chargés électriquement est la force de ___.",
        reponses: ["Coulomb"],
        explication: "On l'appelle aussi force électrostatique.",
      },
      {
        type: "trou",
        texte:
          "Quand le frottement compense le poids, la vitesse d'un objet qui tombe atteint une vitesse ___.",
        reponses: ["limite"],
        explication:
          "La vitesse devient constante : le mouvement est alors rectiligne uniforme.",
      },
      {
        type: "ordre",
        consigne: "Remets dans l'ordre les étapes pour représenter une force.",
        elements: [
          "Placer l'origine au point qui représente le système",
          "Tracer la direction de l'action",
          "Orienter la flèche dans le sens de l'action",
          "Donner une longueur proportionnelle à la valeur, selon l'échelle",
        ],
        explication:
          "Une force se représente par un vecteur : origine, direction, sens, puis longueur.",
      },
      {
        type: "ouverte",
        question:
          "Une bille est immobile sur une table horizontale. Quelles forces s'exercent sur elle, et pourquoi se compensent-elles ?",
        corrige:
          "Le poids P⃗, vertical vers le bas, et la réaction normale R⃗N de la table, verticale vers le haut. La bille est immobile, donc d'après le principe d'inertie les forces se compensent : P⃗ + R⃗N = 0⃗.",
      },
      {
        type: "ouverte",
        question:
          "Pourquoi un objet qui tombe dans l'air finit-il par atteindre une vitesse constante ?",
        corrige:
          "Le frottement de l'air augmente avec la vitesse. Quand il devient égal au poids, les forces se compensent : d'après le principe d'inertie, la vitesse reste alors constante. C'est la vitesse limite.",
      },
    ],
  },
  {
    id: "pc-1re-chap11-exercices",
    version: 4,
    matiere,
    titre: "Chap. 11 · Fiche d'exercices et DM",
    documents: [
      {
        titre: "Exercices du Chap. 11",
        fichier: `${dossier}/exercices-chap11.pdf`,
        detail: "Énoncés · 4 pages",
      },
      {
        titre: "Correction des exercices du Chap. 11",
        fichier: `${dossier}/correction-exercices-chap11.pdf`,
        detail:
          "Correction manuscrite · 6 pages · à ouvrir après avoir cherché",
      },
    ],
    flashcards: [
      {
        recto: "Les étapes d'une rédaction en dynamique",
        verso:
          "Définir le système (point matériel de masse m) et le référentiel ; faire le bilan des forces ; écrire la 2e loi de Newton ; projeter sur un axe ; isoler l'inconnue ; faire l'application numérique avec l'unité et les chiffres significatifs.",
      },
      {
        recto: "Chute libre : que vaut {{Δv // Δt}} ?",
        verso:
          "Seul le poids agit : {{m·Δv⃗ // Δt}} = m · g⃗, donc {{Δv // Δt}} = g = 9,81 m·s⁻², quelle que soit la masse.",
      },
      {
        recto: "Durée d'une variation de vitesse",
        verso:
          "D'après la 2e loi : Δt = {{m·Δv // ΣF}} (en projection sur l'axe du mouvement).",
      },
      {
        recto: "Δv à l'arrêt complet",
        verso:
          "Δv = |v_f − vᵢ| avec v_f = 0 : la norme de la variation de vitesse est égale à la vitesse initiale.",
      },
      {
        recto: "Reconnaître la vitesse limite sur une chronophotographie",
        verso:
          "À partir d'une position, les points sont également espacés : la vitesse est constante, Δv⃗ = 0⃗, donc les forces se compensent (P⃗ + f⃗ = 0⃗).",
      },
      {
        recto: "Une montgolfière s'élève-t-elle ?",
        verso:
          "Oui si la poussée d'Archimède est plus grande que le poids : ΠA > P, la somme des forces et Δv⃗ sont alors vers le haut.",
      },
      {
        recto: "Valeur trop grande dans un calcul de vitesse",
        verso:
          "Souvent parce qu'on a négligé une force, en général le frottement de l'air, qui freine le système.",
      },
      {
        recto: "Convertir des km/h en m/s",
        verso: "On convertit la distance et la durée séparément : 100 km/h = {{100 × 10³ m // 3600 s}} ≈ 27,8 m·s⁻¹.",
      },
    ],
    fiche: {
      sections: [
        {
          titre: "Le travail demandé par ton prof",
          points: [
            {
              t: "==Faire les exercices sans la correction d'abord, puis seulement les corriger avec le PDF.==",
              n: 1,
            },
            {
              t: "==DM pour le lundi 16/11 : rédiger sur feuille les cas 2 et 3 de l'exercice 1, et l'exercice 4.==",
              n: 1,
            },
            {
              t: "Interrogation de cours d'une heure le lundi 16/11, dès la première séance : chap. 9, chap. 11 et les trois fiches méthode.",
              n: 1,
            },
            {
              t: "La fiche méthode sur la méthode d'Euler prépare le TP du retour en classe.",
              n: 2,
            },
            {
              t: "L'exercice 7 (chute parabolique) sera fait en classe.",
              n: 3,
            },
            {
              t: "Les documents s'intitulent « Chap. 13 » : c'est bien le chapitre 11 du mail.",
              n: 5,
            },
          ],
        },
        {
          titre: "Pistes pour le DM, sans la réponse",
          points: [
            {
              t: "Ex. 1, cas 2 : inspire-toi du cas 1 corrigé. Regarde comment évolue l'écart entre les points dans le sens du mouvement : accéléré ou ralenti ? Déduis-en le sens de Δv⃗₂, puis choisis la proposition.",
              n: 1,
            },
            {
              t: "Ex. 1, cas 3 : applique la fiche méthode « tracer le vecteur variation de vitesse » au point 2, puis compare ton tracé aux deux propositions.",
              n: 1,
            },
            {
              t: "Ex. 4, b : si seul le poids agit, raisonne comme dans l'exercice 3 corrigé ({{Δv // Δt}} = g), calcule la vitesse après 12 s et compare-la à 53 m·s⁻¹.",
              n: 1,
            },
            {
              t: "Ex. 4, c : quand la vitesse est stabilisée, raisonne comme dans l'exercice 5 corrigé : que vaut Δv⃗, et qu'en déduit le principe d'inertie ?",
              n: 1,
            },
            {
              t: "Ex. 4, a : sur ton schéma, place le point, P⃗, f⃗ et Δv⃗ entre le départ (vitesse nulle) et la vitesse stabilisée ; pas besoin d'échelle.",
              n: 2,
            },
            {
              t: "==Rédige chaque fois : système, référentiel, bilan des forces, loi utilisée, puis conclusion justifiée.==",
              n: 2,
            },
          ],
        },
        {
          titre: "Ce que dit la correction (exercices hors DM)",
          points: [
            {
              t: "Ex. 1, schémas : A faux (v⃗ n'est pas tangent) ; B vrai (rectiligne décéléré) ; C faux (ΣF⃗ et Δv⃗ pas de même sens) ; D vrai.",
              n: 2,
            },
            {
              t: "Ex. 1, cas 1 : points de plus en plus espacés, mouvement accéléré vers la droite ; Δv⃗₃ vers la droite : proposition A.",
              n: 2,
            },
            {
              t: "Ex. 3 (homme-canon) : {{Δv // Δt}} = g = 9,81 m·s⁻² ; durée d'ascension Δt = {{35 // 9,81}} ≈ 3,6 s.",
              n: 2,
            },
            {
              t: "Ex. 5 (vitesse limite) : vitesse constante après une position donnée, donc Δv⃗ = 0⃗ ; principe d'inertie : P⃗ + f⃗ = 0⃗.",
              n: 2,
            },
            {
              t: "Ex. 6 (montgolfière) : P ≈ 3,14 × 10³ N, ΠA ≈ 4,19 × 10³ N, donc ΠA > P : elle s'élève. Après 5,0 s, v ≈ 16 m·s⁻¹ ; après 1,0 min, v ≈ 2,0 × 10² m·s⁻¹, beaucoup trop : on a négligé le frottement de l'air.",
              n: 3,
            },
            {
              t: "Ex. 2 (freinage) n'est pas dans la correction : voir les exercices de ce chapitre.",
              n: 3,
            },
          ],
        },
        {
          titre: "À vérifier dans la correction",
          points: [
            {
              t: "Ex. 6, 2a : la correction écrit Δv = 16 m·s⁻¹, puis v_f = 1,6 × 10⁻² m·s⁻¹. La bonne valeur est 16 m·s⁻¹ (1,6 × 10¹) : {{1,05 × 10³ // 320}} × 5,0 ≈ 16.",
              n: 4,
            },
            {
              t: "Ex. 5 : l'énoncé parle de la cinquième position, la correction de la dixième. Regarde la chronophotographie pour trancher.",
              n: 4,
            },
          ],
        },
      ],
      aRetenir: [
        "DM : ex. 1 cas 2 et 3, ex. 4",
        "Interro lundi 16/11",
        "{{Δv // Δt}} = g",
        "Δt = {{m·Δv // ΣF}}",
        "Vitesse limite",
        "ΠA > P",
      ],
    },
    exercices: [
      {
        type: "vraiFaux",
        affirmation:
          "Fiche d'exercices, ex. 1, schéma A : les vecteurs sont bien représentés.",
        vrai: false,
        explication:
          "Le vecteur vitesse v⃗ n'est pas tangent à la trajectoire, alors qu'il doit toujours l'être.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Fiche d'exercices, ex. 1, schéma B : les vecteurs sont bien représentés.",
        vrai: true,
        explication:
          "v⃗ est tangent, ΣF⃗ et Δv⃗ sont colinéaires et de même sens. Δv⃗ est opposé à v⃗ : le mouvement est rectiligne décéléré, ce qui est possible.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Fiche d'exercices, ex. 1, schéma C : les vecteurs sont bien représentés.",
        vrai: false,
        explication:
          "ΣF⃗ et Δv⃗ ne sont pas de même sens, ce qui contredit la 2e loi de Newton.",
      },
      {
        type: "vraiFaux",
        affirmation:
          "Fiche d'exercices, ex. 1, schéma D : les vecteurs sont bien représentés.",
        vrai: true,
        explication:
          "ΣF⃗ et Δv⃗ sont colinéaires et de même sens, et v⃗ est tangent à la trajectoire.",
      },
      {
        question:
          "Ex. 2 : une voiture roule à 100 km/h et freine jusqu'à l'arrêt. Quelle est la norme de Δv⃗ ?",
        choix: ["100 m·s⁻¹", "27,8 m·s⁻¹", "360 m·s⁻¹", "3,6 m·s⁻¹"],
        bonneReponse: 1,
        explication: "Δv = |0 − v| avec v = 100 km/h = {{100 × 10³ m // 3600 s}} ≈ 27,8 m·s⁻¹.",
      },
      {
        question:
          "Ex. 2 : la voiture de 1,2 t est freinée par une force de 7,7 kN. Combien de temps dure le freinage ?",
        choix: ["0,23 s", "4,3 s", "43 s", "16 s"],
        bonneReponse: 1,
        explication:
          "D'après la 2e loi : Δt = {{m·Δv // F}} = {{1200 × 27,8 // 7700}} ≈ 4,3 s. Attention aux conversions : 1,2 t = 1200 kg et 7,7 kN = 7700 N.",
      },
      {
        question:
          "Ex. 2 : pour qu'un véhicule deux fois plus lourd, à la même vitesse, s'arrête dans la même durée, il faut…",
        choix: [
          "la même force de freinage",
          "une force deux fois plus grande",
          "une force deux fois plus petite",
          "une force quatre fois plus grande",
        ],
        bonneReponse: 1,
        explication:
          "Δt = {{m·Δv // F}} : si m double, F doit doubler pour garder Δt, soit environ 15,4 kN.",
      },
      {
        question:
          "Ex. 3 : l'homme-canon, soumis à son seul poids, est lancé vers le haut à 35 m·s⁻¹. Combien de temps dure l'ascension ?",
        choix: ["0,28 s", "3,6 s", "35 s", "343 s"],
        bonneReponse: 1,
        explication: "{{Δv // Δt}} = g, donc Δt = {{Δv // g}} = {{35 // 9,81}} ≈ 3,6 s.",
      },
      {
        question:
          "Ex. 6 : une montgolfière de 320 kg a un volume de 350 m³ (ρair = 1,22 kg·m⁻³). Que vaut la poussée d'Archimède ?",
        choix: ["3,14 × 10³ N", "4,19 × 10³ N", "427 N", "1,05 × 10³ N"],
        bonneReponse: 1,
        explication:
          "ΠA = ρair × V × g = 1,22 × 350 × 9,81 ≈ 4,19 × 10³ N. Le poids vaut 320 × 9,81 ≈ 3,14 × 10³ N.",
      },
      {
        question:
          "Ex. 6 : partie de l'arrêt, quelle vitesse atteint la montgolfière en 5,0 s ?",
        choix: ["1,6 × 10⁻² m·s⁻¹", "3,3 m·s⁻¹", "16 m·s⁻¹", "2,0 × 10² m·s⁻¹"],
        bonneReponse: 2,
        explication:
          "Δv = {{(ΠA − P) × Δt // m}} = {{1,05 × 10³ × 5,0 // 320}} ≈ 16 m·s⁻¹. La correction du prof écrit aussi 1,6 × 10⁻² : c'est une coquille.",
      },
      {
        type: "trou",
        texte:
          "En chute libre, {{Δv // Δt}} est égal à ___, l'accélération de la pesanteur.",
        reponses: ["g", "9,81", "9.81"],
        explication: "g = 9,81 m·s⁻² : la masse n'intervient pas.",
      },
      {
        type: "trou",
        texte:
          "Ex. 6 : la vitesse calculée après une minute est trop grande, car on a négligé le ___ de l'air.",
        reponses: ["frottement", "frottements"],
        explication: "Le frottement de l'air freine la montgolfière.",
      },
      {
        type: "ordre",
        consigne:
          "Remets dans l'ordre les étapes d'une rédaction en dynamique.",
        elements: [
          "Définir le système et le référentiel",
          "Faire le bilan des forces",
          "Écrire la 2e loi de Newton",
          "Projeter sur l'axe du mouvement",
          "Faire l'application numérique",
        ],
        explication:
          "C'est la démarche suivie dans toute la correction du prof.",
      },
      {
        type: "ouverte",
        question:
          "Ex. 5 : une bille tombe dans l'huile ; à partir d'une position, ses positions sont également espacées. Que peut-on dire de sa vitesse, de Δv⃗ et des forces ?",
        corrige:
          "La vitesse est constante, le mouvement est rectiligne uniforme, donc Δv⃗ = 0⃗. D'après le principe d'inertie, les forces se compensent : le poids P⃗ est compensé par le frottement fluide f⃗, vertical vers le haut (P⃗ + f⃗ = 0⃗). La bille a atteint sa vitesse limite.",
      },
      {
        type: "ouverte",
        question:
          "Ex. 6 : montre que la montgolfière s'élève, en utilisant la 2e loi de Newton.",
        corrige:
          "Système : la montgolfière, point matériel de masse m. Forces : le poids P⃗ vers le bas et la poussée d'Archimède Π⃗A vers le haut. 2e loi en projection sur un axe vertical vers le haut : ΠA − P = m · {{Δv // Δt}}. Comme ΠA ≈ 4,19 × 10³ N > P ≈ 3,14 × 10³ N, {{Δv // Δt}} > 0 : Δv⃗ est vers le haut, la montgolfière s'élève.",
      },
    ],
  },
];
