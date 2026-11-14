/**
 * Ce que le mode Apprendre (quiz) ne pose pas (demandé le 2026-11-14 : « quand tu fais des
 * quiz, interroge-toi sur les défs pertinentes à inclure »). Critère : le prof peut-il le
 * demander en interro de cours ? On garde définitions, lois, formules et propriétés. On
 * écarte les méthodes de rédaction (elles sont dans la fiche), les astuces d'exercices, les
 * applications, les reformulations d'une carte déjà posée et les détails hors DST. Ces
 * cartes restent dans les flashcards. Une carte rédigée par la tâche planifiée peut porter
 * `horsQuiz: true`.
 */

/** Chapitres publiés dont aucune carte n'entre dans le quiz. */
export const CHAPITRES_HORS_QUIZ = new Set([
  "pc-1re-methode-redaction", // méthode de rédaction : dans la fiche
  "pc-1re-chap11-exercices", // astuces de la fiche d'exercices et du DM
]);

/** Rectos (en minuscules) des cartes écartées du quiz. */
export const CARTES_HORS_QUIZ = new Set(
  [
    // Chap. 9
    "Quelle est la limite du modèle du point matériel ?",
    "Quel est le lien entre la vitesse et la position ?",
    "À quoi sert la relation de Chasles dans la méthode d'Euler ?",
    "Vecteur vitesse par encadrement (fiche Euler)", // même formule que celle du chap. 11
    // Chap. 11
    "Cinématique", // mot-catégorie : flashcard seulement
    "Faut-il une force pour être en mouvement ?", // redit le principe d'inertie
    "Pourquoi le mouvement de la Lune autour de la Terre vérifie-t-il la 2e loi de Newton ?",
    // Forces
    "Force de rappel d'un ressort", // « très marginal en Première, pas en DST »
    // Chap. 4
    "Comment simplifier une équation-bilan ?",
  ].map((r) => r.toLowerCase()),
);
