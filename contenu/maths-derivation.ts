import type { ChapitrePublie, Lecon } from "@/lib/types";
import {
  RACINE,
  SECANTE,
  TANGENTE_EQUATION,
  TANGENTE_LIMITE,
  VALEUR_ABSOLUE,
} from "./schemas-maths";

/**
 * Mathématiques (spécialité, Première) : séquence 2, dérivation. Repris des photos du
 * polycopié du prof (pages 1 à 8, 10 et 13), des fiches d'exercices (Transmath 1re) et des
 * démonstrations faites en classe (2026-11-11).
 *
 * Les exercices ci-dessous sont des exercices parallèles à ceux des fiches, pas leurs
 * corrigés : l'élève fait les exercices du prof lui-même.
 *
 * Une coquille relevée dans le polycopié : la propriété 8 de la valeur absolue est écrite
 * |x − y| > ||x| − |y||, avec une inégalité stricte. C'est ≥ : pour x = y, les deux côtés
 * valent 0.
 */

const matiere = { nom: "Mathématiques", couleur: "#b5573d", emoji: "📐" };

export const MATHS_DERIVATION: ChapitrePublie = {
  id: "maths-1re-derivation",
  version: 1,
  matiere,
  titre: "Séquence 2 · Dérivation",
  flashcards: [
    {
      recto: "Taux de variation de f entre a et a + h",
      verso: "t(h) = {{f(a + h) − f(a) // h}}, avec h réel non nul et a + h dans I.",
    },
    {
      recto: "Interprétation géométrique du taux de variation",
      verso:
        "C'est la pente (le coefficient directeur) de la sécante (AM), où A et M sont les points de la courbe d'abscisses a et a + h : t(h) = {{y_M − y_A // x_M − x_A}}.",
      schema: SECANTE,
    },
    {
      recto: "f est dérivable en a",
      verso:
        "Quand h tend vers 0, le taux de variation t(h) tend vers un nombre réel. Ce nombre est le nombre dérivé f'(a).",
    },
    {
      recto: "Nombre dérivé f'(a)",
      verso: "f'(a) = lim (h → 0) {{f(a + h) − f(a) // h}}",
    },
    {
      recto: "Interprétation géométrique de f'(a)",
      verso:
        "C'est la pente de la tangente à la courbe au point A(a ; f(a)) : la limite des pentes des sécantes (AM) quand M se rapproche de A.",
      schema: TANGENTE_LIMITE,
    },
    {
      recto: "Équation de la tangente en a",
      verso: "y = f(a) + f'(a)(x − a). Elle passe par A(a ; f(a)) et a pour pente f'(a).",
      schema: TANGENTE_EQUATION,
    },
    {
      recto: "Dérivable sur un intervalle I",
      verso:
        "f est dérivable en tout réel a de I. La fonction f' : x ↦ f'(x) est la fonction dérivée de f.",
    },
    { recto: "Dérivée d'une constante k", verso: "0, sur ℝ." },
    { recto: "Dérivée de ax + b", verso: "a, sur ℝ. En particulier, la dérivée de x est 1." },
    { recto: "Dérivée de x²", verso: "2x, sur ℝ." },
    {
      recto: "Dérivée de xⁿ (n entier non nul)",
      verso: "nxⁿ⁻¹, sur ℝ si n > 0, sur ℝ* si n < 0. Exemple : (x⁷)' = 7x⁶.",
    },
    { recto: "Dérivée de {{1 // x}}", verso: "−{{1 // x²}}, sur ℝ*." },
    {
      recto: "Dérivée de √x",
      verso: "{{1 // 2√x}}, sur ]0 ; +∞[. La racine carrée est définie en 0 mais pas dérivable en 0.",
      schema: RACINE,
    },
    {
      recto: "Pourquoi √x n'est pas dérivable en 0",
      verso:
        "En 0, t(h) = {{√h // h}} = {{1 // √h}} : quand h tend vers 0, t(h) devient de plus en plus grand et ne tend vers aucun nombre réel.",
    },
    {
      recto: "Dérivabilité de |x|",
      verso:
        "Continue sur ℝ, dérivable sur ℝ* (f'(x) = −1 si x < 0, 1 si x > 0), non dérivable en 0.",
      schema: VALEUR_ABSOLUE,
    },
    { recto: "Dérivée d'une somme u + v", verso: "u' + v'" },
    { recto: "Dérivée de ku (k réel)", verso: "ku'" },
    { recto: "Dérivée d'un produit uv", verso: "u'v + uv'" },
    { recto: "Dérivée de u²", verso: "2uu'" },
    { recto: "Dérivée de {{1 // v}}", verso: "−{{v' // v²}}, là où v ne s'annule pas." },
    { recto: "Dérivée d'un quotient {{u // v}}", verso: "{{u'v − uv' // v²}}, là où v ne s'annule pas." },
    {
      recto: "Dérivée de x ↦ g(ax + b)",
      verso: "a × g'(ax + b), là où ax + b est dans l'intervalle où g est dérivable.",
    },
    { recto: "Dérivée de √u", verso: "{{u' // 2√u}}, là où u > 0." },
    { recto: "Dérivée de uⁿ", verso: "nu'uⁿ⁻¹" },
    {
      recto: "Qui a inventé le calcul différentiel ?",
      verso:
        "Leibniz (1646-1716) et Newton (1642-1727), au XVIIe siècle. Lagrange (1736-1813) a introduit la notation f'(a).",
    },
  ],
  fiche: {
    sections: [
      {
        titre: "Taux de variation",
        points: [
          {
            t: "Le taux de variation de f entre a et a + h (h ≠ 0) est t(h) = {{f(a + h) − f(a) // h}}.",
            n: 1,
          },
          {
            t: "C'est la pente de la sécante (AM), avec A(a ; f(a)) et M(a + h ; f(a + h)) : t(h) = {{y_M − y_A // x_M − x_A}}.",
            n: 1,
            schema: SECANTE,
          },
          {
            t: "On le calcule toujours de la même façon : remplacer, développer f(a + h), soustraire f(a), puis simplifier par h.",
            n: 2,
          },
          {
            t: "Le calcul différentiel vient du XVIIe siècle (Leibniz et Newton) ; la notation f'(a) est de Lagrange. Il sert aujourd'hui dans les capteurs des smartphones.",
            n: 5,
          },
        ],
      },
      {
        titre: "Nombre dérivé",
        points: [
          {
            t: "Si t(h) tend vers un réel quand h tend vers 0, f est dérivable en a, et ce réel est le nombre dérivé : f'(a) = lim (h → 0) {{f(a + h) − f(a) // h}}.",
            n: 1,
          },
          {
            t: "On ne peut pas remplacer h par 0 dans la fraction : on diviserait par 0. Il faut d'abord simplifier par h, puis faire tendre h vers 0.",
            n: 2,
          },
          {
            t: "Exemple du cours : pour la fonction carré en 3, t(h) = {{(3 + h)² − 3² // h}} = 6 + h, qui tend vers 6. Donc f'(3) = 6.",
            n: 3,
          },
          {
            t: "Exemple du cours : pour la fonction inverse en 1, t(h) = −{{1 // 1 + h}}, qui tend vers −1. Donc f'(1) = −1.",
            n: 3,
          },
        ],
      },
      {
        titre: "Tangente à la courbe",
        points: [
          {
            t: "Quand h tend vers 0, M se rapproche de A et la sécante (AM) se rapproche d'une droite : la tangente en A, de pente f'(a).",
            n: 2,
            schema: TANGENTE_LIMITE,
          },
          {
            t: "La tangente à la courbe au point A(a ; f(a)) a pour équation y = f(a) + f'(a)(x − a).",
            n: 1,
            schema: TANGENTE_EQUATION,
          },
          {
            t: "Lecture graphique : f'(a) est le coefficient directeur de la tangente. On avance de 1 vers la droite et on lit de combien on monte (ou descend).",
            n: 2,
          },
          {
            t: "Exemple du cours : f(x) = 3x², f(1) = 3 et f'(1) = 6, donc y = 3 + 6(x − 1), soit y = 6x − 3 (équation réduite).",
            n: 3,
          },
          {
            t: "Démonstration : la tangente s'écrit y = mx + p avec m = f'(a). Elle passe par A, donc f(a) = f'(a) × a + p, d'où p = f(a) − f'(a) × a. En factorisant par f'(a) : y = f(a) + f'(a)(x − a).",
            n: 4,
          },
          {
            t: "Une tangente parallèle à l'axe des abscisses a une pente nulle : on cherche les a tels que f'(a) = 0. Deux tangentes parallèles ont la même pente.",
            n: 3,
          },
        ],
      },
      {
        titre: "Fonction dérivée et fonctions usuelles",
        points: [
          {
            t: "f est dérivable sur I si elle l'est en tout réel de I ; la fonction f' : x ↦ f'(x) est sa fonction dérivée.",
            n: 2,
          },
          { t: "Constante k : 0. Affine ax + b : a. Identité x : 1.", n: 1 },
          { t: "x² : 2x. xⁿ (n entier non nul) : nxⁿ⁻¹, sur ℝ si n > 0, sur ℝ* si n < 0.", n: 1 },
          { t: "{{1 // x}} : −{{1 // x²}} sur ℝ*. √x : {{1 // 2√x}} sur ]0 ; +∞[.", n: 1 },
          {
            t: "La racine carrée est définie en 0 mais pas dérivable en 0 : t(h) = {{1 // √h}} ne tend vers aucun réel.",
            n: 2,
            schema: RACINE,
          },
          {
            t: "On retrouve les deux dernières avec nxⁿ⁻¹ : {{1 // x}} = x⁻¹ donne −x⁻² = −{{1 // x²}} ; en écrivant √x comme x puissance {{1 // 2}}, on obtient {{1 // 2}} × x puissance −{{1 // 2}}, soit {{1 // 2√x}}.",
            n: 4,
          },
          {
            t: "Démonstration pour x² : t(h) = {{(a + h)² − a² // h}} = {{h(2a + h) // h}} = 2a + h, qui tend vers 2a.",
            n: 4,
          },
          {
            t: "Démonstration pour {{1 // x}} : t(h) = −{{1 // a(a + h)}}, qui tend vers −{{1 // a²}}.",
            n: 4,
          },
        ],
      },
      {
        titre: "Opérations sur les fonctions dérivables",
        points: [
          { t: "(u + v)' = u' + v' et (ku)' = ku'.", n: 1 },
          { t: "(uv)' = u'v + uv'. Attention : ce n'est pas u'v'.", n: 1 },
          {
            t: "({{1 // v}})' = −{{v' // v²}} et ({{u // v}})' = {{u'v − uv' // v²}}, là où v ne s'annule pas.",
            n: 1,
          },
          { t: "(u²)' = 2uu'.", n: 2 },
          {
            t: "Exemple du cours : f(x) = x² + {{1 // x}} donne f'(x) = 2x − {{1 // x²}} sur ℝ*.",
            n: 3,
          },
          {
            t: "Exemple du cours : f(x) = x²√x sur ]0 ; +∞[, avec u = x² et v = √x : f'(x) = 2x√x + {{x² // 2√x}} = {{5 // 2}}x√x.",
            n: 3,
          },
          {
            t: "Exemple du cours : g(x) = {{3x − 1 // x² + 1}}. x² + 1 ne s'annule jamais, donc g est dérivable sur ℝ et g'(x) = {{−3x² + 2x + 3 // (x² + 1)²}}.",
            n: 3,
          },
          {
            t: "Démonstration du produit : on ajoute et retire u(a)v(a + h) au numérateur, ce qui donne t(h) = {{u(a + h) − u(a) // h}} v(a + h) + u(a) {{v(a + h) − v(a) // h}}, qui tend vers u'(a)v(a) + u(a)v'(a).",
            n: 5,
          },
        ],
      },
      {
        titre: "Fonctions composées",
        points: [
          {
            t: "Si g est dérivable sur I et ax + b est dans I, alors x ↦ g(ax + b) a pour dérivée a × g'(ax + b).",
            n: 1,
          },
          { t: "À connaître aussi : (√u)' = {{u' // 2√u}} et (uⁿ)' = nu'uⁿ⁻¹.", n: 2 },
          {
            t: "Exemple du cours : f(x) = √(2x − 4). La racine est dérivable sur ]0 ; +∞[, et 2x − 4 > 0 ⟺ x > 2. Donc f est dérivable sur ]2 ; +∞[ et f'(x) = 2 × {{1 // 2√(2x − 4)}} = {{1 // √(2x − 4)}}.",
            n: 3,
          },
          {
            t: "Exemple du cours : g(x) = {{1 // x³}} = x⁻³, donc g'(x) = −3x⁻⁴ = −{{3 // x⁴}} sur ℝ*.",
            n: 3,
          },
        ],
      },
      {
        titre: "Valeur absolue",
        points: [
          { t: "|x| = x si x ≥ 0, et |x| = −x si x < 0. Exemple : |2 − √5| = √5 − 2.", n: 2 },
          {
            t: "La valeur absolue est continue sur ℝ, dérivable sur ℝ* (−1 pour x < 0, 1 pour x > 0) et non dérivable en 0.",
            n: 1,
            schema: VALEUR_ABSOLUE,
          },
          {
            t: "Propriétés : |−x| = |x| ; √(x²) = |x| ; |xy| = |x| × |y| ; |x| = |y| ⟺ x = y ou x = −y ; |x| ≤ y ⟺ −y ≤ x ≤ y.",
            n: 4,
          },
          {
            t: "Inégalité triangulaire : |x + y| ≤ |x| + |y|. Et |x − y| ≥ ||x| − |y|| (le polycopié écrit « > », mais pour x = y les deux côtés valent 0).",
            n: 5,
          },
        ],
      },
      {
        titre: "Rédiger comme ton prof l'attend",
        points: [
          {
            t: "Commence par l'ensemble de dérivabilité, en le justifiant : « u et v sont dérivables sur ℝ en tant que fonctions polynômes », « x² + 1 ≠ 0 sur ℝ ».",
            n: 1,
          },
          {
            t: "Nomme les morceaux avant de dériver : « f est de la forme {{u // v}} avec u(x) = … et v(x) = … », puis écris u'(x) et v'(x).",
            n: 1,
          },
          {
            t: "Écris la formule avec u et v, puis remplace : f'(x) = {{u'(x)v(x) − u(x)v'(x) // v²(x)}} = …",
            n: 2,
          },
          { t: "Conclus en encadrant : « Donc, ∀x ∈ ℝ, f'(x) = … ».", n: 2 },
          {
            t: "Pour un quotient, développe le numérateur mais laisse le dénominateur au carré, sous la forme (x² + 1)².",
            n: 3,
          },
          {
            t: "Pour une démonstration par la définition, écris « ∀a ∈ ℝ, ∀h ∈ ℝ* », calcule t(h), puis « Donc lim (h → 0) t(h) = … », « Donc f est dérivable en a et f'(a) = … ».",
            n: 3,
          },
        ],
      },
    ],
    aRetenir: [
      "{{f(a + h) − f(a) // h}}",
      "f'(a) = lim t(h)",
      "y = f(a) + f'(a)(x − a)",
      "(uv)' = u'v + uv'",
      "({{u // v}})' = {{u'v − uv' // v²}}",
      "a × g'(ax + b)",
      "√x non dérivable en 0",
    ],
  },
  exercices: [
    {
      question: "Soit f(x) = 5x − 2. Que vaut f'(x) ?",
      choix: ["5", "5x", "−2", "0"],
      bonneReponse: 0,
      explication: "La dérivée de ax + b est a : ici 5, pour tout réel x.",
    },
    {
      question: "Quelle est la dérivée de x ↦ {{1 // x}} sur ℝ* ?",
      choix: ["−{{1 // x²}}", "{{1 // x²}}", "x⁻²", "−{{1 // x}}"],
      bonneReponse: 0,
      explication: "{{1 // x}} = x⁻¹, donc sa dérivée est −1 × x⁻² = −{{1 // x²}}.",
    },
    {
      question: "Pour f(x) = x², quelle est l'équation réduite de la tangente au point d'abscisse 2 ?",
      choix: ["y = 4x − 4", "y = 4x + 4", "y = 2x", "y = 4x − 2"],
      bonneReponse: 0,
      explication: "f(2) = 4 et f'(2) = 2 × 2 = 4. Donc y = 4 + 4(x − 2) = 4x − 4.",
    },
    {
      consigne: "Lecture graphique",
      question:
        "La tangente à la courbe de f au point d'abscisse 1 passe par les points (1 ; 2) et (3 ; 6). Que vaut f'(1) ?",
      choix: ["2", "4", "{{1 // 2}}", "6"],
      bonneReponse: 0,
      explication: "f'(1) est la pente de la tangente : {{6 − 2 // 3 − 1}} = {{4 // 2}} = 2.",
    },
    {
      question: "Soit f(x) = x³. Que vaut f'(−1) ?",
      choix: ["3", "−3", "−1", "1"],
      bonneReponse: 0,
      explication: "f'(x) = 3x², donc f'(−1) = 3 × (−1)² = 3. Le carré rend le résultat positif.",
    },
    {
      question: "Quelle est la dérivée de f(x) = {{2x + 1 // x − 1}} sur ]1 ; +∞[ ?",
      choix: ["−{{3 // (x − 1)²}}", "{{3 // (x − 1)²}}", "2", "{{4x − 1 // (x − 1)²}}"],
      bonneReponse: 0,
      explication:
        "u = 2x + 1, v = x − 1, u' = 2, v' = 1 : f'(x) = {{2(x − 1) − (2x + 1) × 1 // (x − 1)²}} = {{−3 // (x − 1)²}}.",
    },
    {
      question: "Quelle est la dérivée de f(x) = √(3x + 6) sur ]−2 ; +∞[ ?",
      choix: ["{{3 // 2√(3x + 6)}}", "{{1 // 2√(3x + 6)}}", "3√(3x + 6)", "{{3 // √(3x + 6)}}"],
      bonneReponse: 0,
      explication:
        "f(x) = g(3x + 6) avec g = √ : f'(x) = 3 × {{1 // 2√(3x + 6)}}. Ne pas oublier le facteur a = 3.",
    },
    {
      question: "Quelle est la dérivée de (uv) ?",
      choix: ["u'v + uv'", "u'v'", "u'v − uv'", "{{u' // v'}}"],
      bonneReponse: 0,
      explication: "La dérivée d'un produit n'est pas le produit des dérivées : (uv)' = u'v + uv'.",
    },
    {
      type: "vraiFaux",
      affirmation: "La fonction racine carrée est dérivable en 0.",
      vrai: false,
      explication:
        "Elle est définie en 0, mais t(h) = {{1 // √h}} ne tend vers aucun réel quand h tend vers 0 : pas de nombre dérivé.",
    },
    {
      type: "vraiFaux",
      affirmation: "f'(a) est le coefficient directeur de la tangente à la courbe au point d'abscisse a.",
      vrai: true,
      explication: "C'est l'interprétation géométrique du nombre dérivé.",
    },
    {
      type: "vraiFaux",
      affirmation: "({{u // v}})' = {{u' // v'}}.",
      vrai: false,
      explication: "({{u // v}})' = {{u'v − uv' // v²}}. Le quotient des dérivées est une erreur classique.",
    },
    {
      type: "vraiFaux",
      affirmation: "La fonction x ↦ |x| est dérivable sur ℝ*, mais pas en 0.",
      vrai: true,
      explication: "Sa courbe a une pointe en 0 : la pente vaut −1 à gauche et 1 à droite.",
    },
    {
      type: "vraiFaux",
      affirmation: "La dérivée de x ↦ x⁻² sur ℝ* est x ↦ −2x⁻³.",
      vrai: true,
      explication: "Avec nxⁿ⁻¹ et n = −2 : −2x⁻²⁻¹ = −2x⁻³, soit −{{2 // x³}}.",
    },
    {
      type: "trou",
      texte: "Le nombre dérivé f'(a) est la limite du taux de variation t(h) quand h tend vers ___.",
      reponses: ["0", "zéro"],
      explication: "f'(a) = lim (h → 0) t(h).",
    },
    {
      type: "trou",
      texte: "La tangente au point d'abscisse a a pour équation y = f(a) + f'(a)(x − ___).",
      reponses: ["a"],
      explication: "y = f(a) + f'(a)(x − a) : elle passe par A(a ; f(a)) avec la pente f'(a).",
    },
    {
      type: "trou",
      texte: "Une fonction dérivable en tout réel d'un intervalle I est dite dérivable ___ I.",
      reponses: ["sur"],
      explication: "On dit « dérivable sur I », et on définit alors sa fonction dérivée f'.",
    },
    {
      type: "trou",
      texte: "Pour dériver un quotient {{u // v}}, il faut que v ne s'___ pas sur l'intervalle.",
      reponses: ["annule"],
      explication: "On divise par v², qui doit être non nul.",
    },
    {
      type: "ordre",
      consigne: "Remets dans l'ordre les étapes pour trouver l'équation de la tangente en a.",
      elements: [
        "Calculer f(a)",
        "Calculer f'(x), puis f'(a)",
        "Remplacer dans y = f(a) + f'(a)(x − a)",
        "Développer pour obtenir l'équation réduite y = mx + p",
      ],
      explication: "Exemple : f(x) = 3x² en 1 donne f(1) = 3, f'(1) = 6, y = 3 + 6(x − 1), soit y = 6x − 3.",
    },
    {
      type: "ordre",
      consigne: "Remets dans l'ordre les étapes pour montrer avec la définition que f est dérivable en a.",
      elements: [
        "Écrire t(h) = {{f(a + h) − f(a) // h}}",
        "Remplacer et développer f(a + h)",
        "Simplifier par h",
        "Faire tendre h vers 0",
        "Conclure : f est dérivable en a et f'(a) = …",
      ],
      explication: "C'est la démarche des démonstrations du cours (fonction carré, fonction inverse).",
    },
    {
      type: "ouverte",
      question:
        "Avec la définition, montre que f(x) = x² + 3x est dérivable en 1 et calcule f'(1).",
      corrige:
        "f(1) = 4. Pour h ≠ 0 : t(h) = {{(1 + h)² + 3(1 + h) − 4 // h}} = {{1 + 2h + h² + 3 + 3h − 4 // h}} = {{5h + h² // h}} = 5 + h.\nDonc lim (h → 0) t(h) = 5 : f est dérivable en 1 et f'(1) = 5.\nVérification avec les formules : f'(x) = 2x + 3, et f'(1) = 5.",
    },
    {
      type: "ouverte",
      question: "Calcule la dérivée de f(x) = (x² + 1)(2x − 3) sur ℝ.",
      corrige:
        "f est un produit uv avec u(x) = x² + 1, u'(x) = 2x, v(x) = 2x − 3, v'(x) = 2.\nf'(x) = 2x(2x − 3) + (x² + 1) × 2 = 4x² − 6x + 2x² + 2.\nDonc, ∀x ∈ ℝ, f'(x) = 6x² − 6x + 2.",
    },
    {
      type: "ouverte",
      question: "Détermine l'ensemble de dérivabilité de g(x) = {{x + 2 // x² + 3}} et calcule g'(x).",
      corrige:
        "u(x) = x + 2 et v(x) = x² + 3 sont dérivables sur ℝ (polynômes), et x² + 3 > 0 ne s'annule jamais : g est dérivable sur ℝ.\nu'(x) = 1, v'(x) = 2x.\ng'(x) = {{1 × (x² + 3) − (x + 2) × 2x // (x² + 3)²}} = {{−x² − 4x + 3 // (x² + 3)²}}.",
    },
    {
      type: "ouverte",
      question: "Donne l'équation réduite de la tangente à la courbe de f(x) = {{1 // x}} au point d'abscisse 2.",
      corrige:
        "f(2) = {{1 // 2}} ; f'(x) = −{{1 // x²}}, donc f'(2) = −{{1 // 4}}.\ny = {{1 // 2}} − {{1 // 4}}(x − 2) = −{{1 // 4}}x + {{1 // 2}} + {{1 // 2}}.\nDonc y = −{{1 // 4}}x + 1.",
    },
    {
      type: "ouverte",
      question: "Calcule la dérivée de f(x) = (3x − 1)⁴ sur ℝ, de deux façons si tu peux.",
      corrige:
        "Avec (uⁿ)' = nu'uⁿ⁻¹, u = 3x − 1 et u' = 3 : f'(x) = 4 × 3 × (3x − 1)³ = 12(3x − 1)³.\nAvec g(ax + b), g(X) = X⁴ et a = 3 : f'(x) = 3 × 4(3x − 1)³, le même résultat.",
    },
    {
      type: "ouverte",
      question: "Démontre que la fonction racine carrée n'est pas dérivable en 0.",
      corrige:
        "Pour h > 0 : t(h) = {{f(0 + h) − f(0) // h}} = {{√h − √0 // h}} = {{√h // h}} = {{√h // √h × √h}} = {{1 // √h}}.\nQuand h tend vers 0, √h tend vers 0, donc {{1 // √h}} prend des valeurs de plus en plus grandes et ne tend vers aucun nombre réel.\nDonc la fonction racine carrée n'est pas dérivable en 0.",
    },
    {
      type: "ouverte",
      question: "Calcule la dérivée de f(x) = x³√x sur ]0 ; +∞[ et simplifie.",
      corrige:
        "u(x) = x³, u'(x) = 3x² ; v(x) = √x, v'(x) = {{1 // 2√x}}.\nf'(x) = 3x²√x + {{x³ // 2√x}} = {{6x³ + x³ // 2√x}} = {{7x³ // 2√x}} = {{7 // 2}}x²√x\n(en multipliant le haut et le bas par √x : {{x³ // √x}} = x²√x).",
    },
  ],
};

/** Leçon guidée : de la pente d'une droite aux formules de dérivation. */
export const LECON_DERIVATION: Lecon = {
  id: "maths-derivation",
  titre: "La dérivation, de la pente aux formules",
  matiere: "Mathématiques",
  niveau: "Première",
  duree: "20 min",
  intro:
    "On reconstruit le chapitre pas à pas, à partir d'une seule idée : la pente d'une droite. À chaque étape, réponds de tête (ou sur un brouillon) avant de dévoiler la réponse. Les exemples ne sont pas ceux de tes fiches d'exercices : la méthode est la même, pour que tu puisses ensuite faire les tiens seul.",
  etapes: [
    {
      titre: "Le point de départ : la pente d'une droite",
      texte: [
        "Tout le chapitre repose sur un calcul de collège : la pente (le coefficient directeur) d'une droite qui passe par deux points.",
        "Pente de (AB) = {{y_B − y_A // x_B − x_A}} : de combien on monte quand on avance d'une unité vers la droite.",
      ],
      exemple: "A(1 ; 2) et B(3 ; 8) : pente = {{8 − 2 // 3 − 1}} = {{6 // 2}} = 3.",
      question: {
        q: "Quelle est la pente de la droite qui passe par (1 ; 3) et (4 ; 9) ?",
        r: "{{9 − 3 // 4 − 1}} = {{6 // 3}} = 2.",
      },
    },
    {
      titre: "Le taux de variation, c'est une pente",
      schema: SECANTE,
      texte: [
        "Sur une courbe, on prend deux points : A d'abscisse a et M d'abscisse a + h. La pente de la sécante (AM), c'est le taux de variation.",
        "t(h) = {{f(a + h) − f(a) // h}} : c'est la même formule que la pente, avec y = f(x) et un écart h entre les abscisses.",
      ],
      exemple:
        "f(x) = x², entre 1 et 1 + h :\nt(h) = {{(1 + h)² − 1 // h}} = {{1 + 2h + h² − 1 // h}} = {{2h + h² // h}} = 2 + h.",
      question: {
        q: "Même calcul pour f(x) = x² + x, entre 2 et 2 + h. Que vaut t(h) ?",
        r: "f(2) = 6. t(h) = {{(2 + h)² + (2 + h) − 6 // h}} = {{4 + 4h + h² + 2 + h − 6 // h}} = {{5h + h² // h}} = 5 + h.",
      },
    },
    {
      titre: "Faire tendre h vers 0 : le nombre dérivé",
      schema: TANGENTE_LIMITE,
      texte: [
        "Quand h devient tout petit, M glisse vers A. Si t(h) se rapproche d'un nombre réel, ce nombre est le nombre dérivé f'(a).",
        "On ne remplace jamais h par 0 dans la fraction de départ (on diviserait par 0) : on simplifie d'abord par h, puis on fait tendre h vers 0.",
      ],
      exemple: "Pour x² en 1 : t(h) = 2 + h, qui tend vers 2. Donc f'(1) = 2.",
      question: {
        q: "À partir de ta réponse précédente (t(h) = 5 + h), que vaut f'(2) pour f(x) = x² + x ?",
        r: "5 + h tend vers 5 quand h tend vers 0 : f'(2) = 5.",
      },
    },
    {
      titre: "La tangente : une droite de pente f'(a)",
      schema: TANGENTE_EQUATION,
      texte: [
        "La tangente en A est la droite qui passe par A(a ; f(a)) avec la pente f'(a). Son équation : y = f(a) + f'(a)(x − a).",
        "Il suffit donc de deux nombres : f(a) et f'(a).",
      ],
      exemple: "f(x) = x² en 1 : f(1) = 1, f'(1) = 2, donc y = 1 + 2(x − 1), soit y = 2x − 1.",
      question: {
        q: "Avec f(x) = x² + x, f(2) = 6 et f'(2) = 5 : quelle est l'équation réduite de la tangente en 2 ?",
        r: "y = 6 + 5(x − 2) = 5x − 10 + 6, soit y = 5x − 4.",
      },
    },
    {
      titre: "Les formules : plus besoin de la limite",
      texte: [
        "Refaire la limite à chaque fois serait long. Le cours la fait une fois pour chaque fonction usuelle, et on garde le résultat : (x²)' = 2x, (xⁿ)' = nxⁿ⁻¹, ({{1 // x}})' = −{{1 // x²}}, (√x)' = {{1 // 2√x}}.",
        "Avec la somme et le facteur constant, on dérive morceau par morceau.",
      ],
      exemple: "f(x) = 3x² + {{1 // x}} : f'(x) = 3 × 2x − {{1 // x²}} = 6x − {{1 // x²}}, sur ℝ*.",
      question: {
        q: "Dérive f(x) = x⁴ − 2√x sur ]0 ; +∞[.",
        r: "f'(x) = 4x³ − 2 × {{1 // 2√x}} = 4x³ − {{1 // √x}}.",
      },
    },
    {
      titre: "Produit et quotient : nommer u et v",
      texte: [
        "Le piège : la dérivée d'un produit n'est pas le produit des dérivées. (uv)' = u'v + uv' et ({{u // v}})' = {{u'v − uv' // v²}}.",
        "La méthode du prof : écrire u, v, u', v' avant de calculer, puis remplacer dans la formule.",
      ],
      exemple:
        "f(x) = (x + 1)(x² − 2) : u = x + 1, u' = 1, v = x² − 2, v' = 2x.\nf'(x) = 1 × (x² − 2) + (x + 1) × 2x = 3x² + 2x − 2.",
      question: {
        q: "Dérive f(x) = {{2x + 1 // x + 3}} sur ]−3 ; +∞[.",
        r: "u = 2x + 1, u' = 2, v = x + 3, v' = 1 : f'(x) = {{2(x + 3) − (2x + 1) // (x + 3)²}} = {{5 // (x + 3)²}}.",
      },
    },
    {
      titre: "Les fonctions composées g(ax + b)",
      texte: [
        "Quand on applique une fonction usuelle à ax + b, on dérive la fonction usuelle et on multiplie par a : (g(ax + b))' = a × g'(ax + b).",
        "Attention à l'ensemble : ax + b doit rester là où g est dérivable.",
      ],
      exemple:
        "f(x) = √(4x + 1), dérivable quand 4x + 1 > 0, soit x > −{{1 // 4}} :\nf'(x) = 4 × {{1 // 2√(4x + 1)}} = {{2 // √(4x + 1)}}.",
      question: {
        q: "Dérive f(x) = (5x − 2)³ sur ℝ.",
        r: "g(X) = X³, g'(X) = 3X², a = 5 : f'(x) = 5 × 3(5x − 2)² = 15(5x − 2)².",
      },
    },
    {
      titre: "Là où ça ne marche pas : les pointes et les verticales",
      schema: VALEUR_ABSOLUE,
      texte: [
        "Une fonction peut être définie en un point sans y être dérivable. La valeur absolue a une pointe en 0 (pente −1 à gauche, 1 à droite) ; la racine carrée part à la verticale en 0.",
        "Dans les deux cas, le taux de variation ne tend pas vers un seul nombre réel.",
      ],
      question: {
        q: "La fonction f(x) = |x − 3| est-elle dérivable en 3 ? Pourquoi ?",
        r: "Non : sa courbe est celle de |x| décalée de 3 vers la droite. Elle a une pointe en 3, avec une pente −1 à gauche et 1 à droite.",
      },
    },
    {
      titre: "À toi : tout le chapitre en un exercice",
      texte: [
        "Rédige-le sur une feuille comme ton prof l'attend : ensemble de dérivabilité justifié, u, v, u', v', formule, résultat encadré, puis la tangente.",
      ],
      question: {
        q: "f(x) = {{x² // x + 1}} sur ]−1 ; +∞[. Calcule f'(x), puis l'équation réduite de la tangente au point d'abscisse 1.",
        r: "u = x², u' = 2x, v = x + 1, v' = 1 : f'(x) = {{2x(x + 1) − x² // (x + 1)²}} = {{x² + 2x // (x + 1)²}}.\nf(1) = {{1 // 2}} et f'(1) = {{3 // 4}}, donc y = {{1 // 2}} + {{3 // 4}}(x − 1) = {{3 // 4}}x − {{1 // 4}}.",
      },
    },
  ],
};
