import type { ChapitrePublie } from "@/lib/types";

/**
 * Chapitre d'exemple (bouton « Charger l'exemple »). Il sert aussi de modèle
 * pour le format des chapitres publiés dans `bibliotheque.ts`.
 */
export const EXEMPLE_DERIVATION: ChapitrePublie = {
  id: "exemple-derivation",
  version: 1,
  matiere: { nom: "Mathématiques", couleur: "#b5573d", emoji: "📐" },
  titre: "Dérivation",
  cours: `I. Nombre dérivé

Taux de variation : le taux de variation de f entre a et a+h est le quotient (f(a+h) − f(a)) / h.
Nombre dérivé : le nombre dérivé de f en a, noté f'(a), est la limite du taux de variation quand h tend vers 0.
La fonction f est dérivable en a lorsque cette limite existe et est finie.

II. Tangente

Tangente : la tangente à la courbe de f au point d'abscisse a est la droite passant par A(a ; f(a)) et de coefficient directeur f'(a).
Son équation réduite est y = f'(a)(x − a) + f(a).

III. Fonction dérivée

Fonction dérivée : la fonction dérivée de f, notée f', associe à chaque réel x le nombre dérivé f'(x).
La dérivée de x² est 2x. La dérivée de x³ est 3x². La dérivée de 1/x est −1/x².
La dérivée d'une somme est la somme des dérivées.

IV. Variations

Si f' est positive sur un intervalle, alors f est croissante sur cet intervalle.
Si f' est négative sur un intervalle, alors f est décroissante sur cet intervalle.
Extremum local : si f' s'annule en changeant de signe en a, alors f admet un extremum local en a.`,
  flashcards: [
    { recto: "Taux de variation de f entre a et a+h", verso: "Le quotient (f(a+h) − f(a)) / h. C'est la pente de la droite qui relie les deux points de la courbe." },
    { recto: "Nombre dérivé de f en a", verso: "La limite du taux de variation (f(a+h) − f(a)) / h quand h tend vers 0. On le note f'(a)." },
    { recto: "Fonction dérivable en a", verso: "Fonction dont le taux de variation en a admet une limite finie quand h tend vers 0." },
    { recto: "Tangente à la courbe en a", verso: "La droite qui passe par A(a ; f(a)) et dont le coefficient directeur est f'(a)." },
    { recto: "Équation de la tangente en a", verso: "y = f'(a)(x − a) + f(a)" },
    { recto: "Fonction dérivée", verso: "La fonction f' qui associe à chaque réel x le nombre dérivé f'(x)." },
    { recto: "Dérivée de x²", verso: "2x" },
    { recto: "Dérivée de x³", verso: "3x²" },
    { recto: "Dérivée de 1/x", verso: "−1/x² (pour x ≠ 0)" },
    { recto: "Lien entre signe de f' et variations de f", verso: "Si f' est positive sur un intervalle, f y est croissante ; si f' est négative, f y est décroissante." },
    { recto: "Extremum local", verso: "Si f' s'annule en a en changeant de signe, alors f admet un maximum ou un minimum local en a." },
  ],
  fiche: {
    sections: [
      {
        titre: "Nombre dérivé",
        points: [
          { t: "f'(a) est la limite de (f(a+h) − f(a)) / h quand h tend vers 0.", n: 1 },
          { t: "Le quotient (f(a+h) − f(a)) / h s'appelle le taux de variation : c'est la pente entre deux points de la courbe.", n: 3 },
          { t: "f est dérivable en a si cette limite existe et est finie.", n: 4 },
          { t: "Graphiquement, f'(a) mesure la pente de la courbe au point d'abscisse a.", n: 2 },
        ],
      },
      {
        titre: "Tangente",
        points: [
          { t: "La tangente en a a pour équation y = f'(a)(x − a) + f(a).", n: 1 },
          { t: "Elle passe par A(a ; f(a)) et son coefficient directeur est f'(a).", n: 2 },
          { t: "Si f'(a) = 0, la tangente est horizontale.", n: 4 },
        ],
      },
      {
        titre: "Dérivées usuelles",
        points: [
          { t: "(x²)' = 2x ; (x³)' = 3x² ; (1/x)' = −1/x².", n: 1 },
          { t: "La dérivée d'une somme est la somme des dérivées.", n: 2 },
          { t: "Plus généralement, (xⁿ)' = n·xⁿ⁻¹.", n: 3 },
          { t: "La dérivée d'une constante est 0 ; celle de k·f est k·f'.", n: 5 },
        ],
      },
      {
        titre: "Variations",
        points: [
          { t: "f' positive : f croissante. f' négative : f décroissante.", n: 1 },
          { t: "Si f' s'annule en changeant de signe en a, f admet un extremum local en a.", n: 2 },
          { t: "Méthode : calculer f', étudier son signe, puis dresser le tableau de variations.", n: 3 },
          { t: "Attention : f'(a) = 0 ne suffit pas, il faut le changement de signe (exemple : x³ en 0).", n: 5 },
        ],
      },
    ],
    aRetenir: ["Nombre dérivé", "Tangente", "Fonction dérivée", "Signe de f'", "Extremum local"],
  },
  exercices: [
    {
      question: "Quelle est la dérivée de f(x) = x² + x³ ?",
      choix: ["2x + 3x²", "x + x²", "2x² + 3x³", "5x⁴"],
      bonneReponse: 0,
      explication: "La dérivée d'une somme est la somme des dérivées : (x²)' = 2x et (x³)' = 3x².",
    },
    {
      question: "Pour f(x) = x², que vaut f'(3) ?",
      choix: ["9", "6", "3", "2"],
      bonneReponse: 1,
      explication: "f'(x) = 2x, donc f'(3) = 2 × 3 = 6.",
    },
    {
      question: "Quelle est l'équation de la tangente à la courbe de f(x) = x² au point d'abscisse 1 ?",
      choix: ["y = 2x − 1", "y = 2x + 1", "y = x + 1", "y = 2x"],
      bonneReponse: 0,
      explication: "f(1) = 1 et f'(1) = 2, donc y = 2(x − 1) + 1 = 2x − 1.",
    },
    {
      question: "Sur un intervalle où f' est négative, la fonction f est…",
      choix: ["croissante", "décroissante", "constante", "nulle"],
      bonneReponse: 1,
      explication: "Le signe de la dérivée donne le sens de variation : f' négative signifie f décroissante.",
    },
    {
      question: "f'(a) = 0 et f' change de signe en a. Que peut-on dire ?",
      choix: ["f s'annule en a", "f admet un extremum local en a", "f n'est pas dérivable en a", "f est constante"],
      bonneReponse: 1,
      explication: "Une dérivée qui s'annule en changeant de signe correspond à un maximum ou un minimum local.",
    },
    {
      question: "Quelle est la dérivée de f(x) = 1/x ?",
      choix: ["1/x²", "−1/x²", "−1/x", "ln(x)"],
      bonneReponse: 1,
      explication: "C'est une dérivée usuelle : (1/x)' = −1/x², pour x différent de 0.",
    },
  ],
};
