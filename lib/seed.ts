import type { Chapitre, Dst, Matiere } from "./types";
import { toISO } from "./dates";

const COURS_DERIVATION = `I. Nombre dérivé

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
Extremum local : si f' s'annule en changeant de signe en a, alors f admet un extremum local en a.`;

const COURS_GUERRE_FROIDE = `I. Un monde bipolaire

Guerre froide : période de tensions entre les États-Unis et l'URSS, de 1947 à 1991, sans affrontement militaire direct.
Doctrine Truman : politique américaine d'endiguement du communisme, annoncée en 1947.
Plan Marshall : aide économique américaine à la reconstruction de l'Europe, lancée en 1947.
Rideau de fer : expression de Churchill désignant la frontière entre l'Europe de l'Ouest et l'Europe de l'Est.

II. Crises et détente

Blocus de Berlin : tentative soviétique d'isoler Berlin-Ouest entre 1948 et 1949.
La crise de Cuba en 1962 amène le monde au bord de la guerre nucléaire.
Détente : phase d'apaisement des relations entre les deux Grands, de 1963 à 1975.

III. La fin de la guerre froide

Le mur de Berlin tombe le 9 novembre 1989.
L'URSS disparaît en décembre 1991.`;

export function donneesExemple(): { matieres: Matiere[]; chapitres: Chapitre[]; dsts: Dst[] } {
  const matieres: Matiere[] = [
    { id: "m-maths", nom: "Mathématiques", couleur: "#b5573d", emoji: "📐" },
    { id: "m-pc", nom: "Physique-Chimie", couleur: "#6f8fae", emoji: "⚗️" },
    { id: "m-hg", nom: "Histoire-Géo", couleur: "#c98b6b", emoji: "🌍" },
    { id: "m-fr", nom: "Français", couleur: "#d98a8a", emoji: "📚" },
    { id: "m-svt", nom: "SVT", couleur: "#7d9a84", emoji: "🧬" },
    { id: "m-ang", nom: "Anglais", couleur: "#c9a24a", emoji: "🗣️" },
  ];
  const vide = { cours: "", flashcards: [], fiche: null };
  const chapitres: Chapitre[] = [
    { id: "c-deriv", matiereId: "m-maths", titre: "Dérivation", ...vide, cours: COURS_DERIVATION },
    { id: "c-suites", matiereId: "m-maths", titre: "Suites numériques", ...vide },
    { id: "c-gf", matiereId: "m-hg", titre: "La guerre froide", ...vide, cours: COURS_GUERRE_FROIDE },
    { id: "c-meca", matiereId: "m-pc", titre: "Mouvement et forces", ...vide },
    { id: "c-adn", matiereId: "m-svt", titre: "ADN et division cellulaire", ...vide },
  ];
  const dans = (j: number) => {
    const d = new Date();
    d.setDate(d.getDate() + j);
    return toISO(d);
  };
  const dsts: Dst[] = [
    { id: "d1", matiereId: "m-maths", titre: "Dérivation", date: dans(3), heure: "08:00", dureeMin: 120, salle: "B204", notes: "Calculatrice autorisée" },
    { id: "d2", matiereId: "m-hg", titre: "La guerre froide", date: dans(8), heure: "14:00", dureeMin: 120, salle: "A012", notes: "" },
    { id: "d3", matiereId: "m-pc", titre: "Mouvement et forces", date: dans(15), heure: "10:00", dureeMin: 90, salle: "Labo 2", notes: "" },
    { id: "d4", matiereId: "m-svt", titre: "ADN et division cellulaire", date: dans(22), heure: "08:00", dureeMin: 60, salle: "C110", notes: "" },
  ];
  return { matieres, chapitres, dsts };
}
