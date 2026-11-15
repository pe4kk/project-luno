/**
 * FSRS (Free Spaced Repetition Scheduler), l'algorithme d'Anki depuis la version 23.10,
 * dans sa version 4.5 avec ses paramètres par défaut. Chaque carte a :
 * - une **stabilité** S (en jours) : le délai au bout duquel on a encore 90 % de chances
 *   de s'en souvenir ;
 * - une **difficulté** D (de 1 à 10) : à quel point elle résiste.
 * À chaque révision, S et D sont recalculées à partir de la réponse et du temps écoulé
 * depuis la révision précédente : une carte réussie après une longue absence gagne
 * beaucoup de stabilité, une carte réussie le jour même presque rien, une carte ratée en
 * perd. Le prochain délai vise `RETENTION` (90 % de chances de s'en souvenir), le « taux
 * de réussite visé » d'Anki.
 */

/** Paramètres par défaut de FSRS-4.5 (w0 à w16), appris sur des millions de révisions Anki. */
const W = [
  0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246,
  1.587, 0.2272, 2.8755,
];
const DECAY = -0.5;
const FACTOR = 19 / 81;
/** Taux de réussite visé à la prochaine révision. */
export const RETENTION = 0.9;
/** Délai le plus long : au-delà d'un an, une carte de lycée n'a plus d'intérêt. */
const MAX_JOURS = 365;

/** 1 = À revoir, 2 = Difficile, 3 = Je savais, 4 = Facile. */
export type Grade = 1 | 2 | 3 | 4;
export type EtatFsrs = { stabilite: number; difficulte: number };

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

/** Probabilité de se souvenir d'une carte de stabilité `s` après `t` jours. */
export const retenabilite = (t: number, s: number) => (1 + (FACTOR * t) / s) ** DECAY;

/** Délai en jours pour que cette probabilité retombe à `RETENTION` (= S quand on vise 90 %). */
export const delaiPour = (s: number) =>
  borner(Math.round((s / FACTOR) * (RETENTION ** (1 / DECAY) - 1)), 1, MAX_JOURS);

const difficulteInitiale = (g: Grade) => borner(W[4] - (g - 3) * W[5], 1, 10);

/**
 * Nouvel état après une révision. `etat` est null pour une carte jamais vue ; `jours` est
 * le temps écoulé depuis la révision précédente.
 */
export function reviser(etat: EtatFsrs | null, g: Grade, jours: number): EtatFsrs {
  if (!etat) return { stabilite: W[g - 1], difficulte: difficulteInitiale(g) };
  const { stabilite: s, difficulte: d } = etat;
  const r = retenabilite(Math.max(0, jours), s);
  // Difficulté : monte après un échec, baisse après « Facile », ramenée doucement vers la moyenne.
  const difficulte = borner(W[7] * difficulteInitiale(3) + (1 - W[7]) * (d - W[6] * (g - 3)), 1, 10);
  if (g === 1) {
    const oubli = W[11] * d ** -W[12] * ((s + 1) ** W[13] - 1) * Math.exp(W[14] * (1 - r));
    return { stabilite: Math.max(0.1, Math.min(oubli, s)), difficulte };
  }
  const bonus = g === 2 ? W[15] : g === 4 ? W[16] : 1;
  const gain = Math.exp(W[8]) * (11 - d) * s ** -W[9] * (Math.exp(W[10] * (1 - r)) - 1) * bonus;
  return { stabilite: s * (gain + 1), difficulte };
}
