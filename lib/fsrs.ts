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
export const POIDS_DEFAUT = [
  0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246,
  1.587, 0.2272, 2.8755,
];
const DECAY = -0.5;
const FACTOR = 19 / 81;
/** Taux de réussite visé à la prochaine révision (réglable dans les statistiques). */
export const RETENTION = 0.9;
const W = POIDS_DEFAUT;
/** Délai le plus long : au-delà d'un an, une carte de lycée n'a plus d'intérêt. */
const MAX_JOURS = 365;

/** 1 = À revoir, 2 = Difficile, 3 = Je savais, 4 = Facile. */
export type Grade = 1 | 2 | 3 | 4;
export type EtatFsrs = { stabilite: number; difficulte: number };

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

/** Probabilité de se souvenir d'une carte de stabilité `s` après `t` jours. */
export const retenabilite = (t: number, s: number) => (1 + (FACTOR * t) / s) ** DECAY;

/** Délai en jours pour que cette probabilité retombe à `RETENTION` (= S quand on vise 90 %). */
export const delaiExact = (s: number, retention = RETENTION) => (s / FACTOR) * (retention ** (1 / DECAY) - 1);
export const delaiPour = (s: number, retention = RETENTION) => borner(Math.round(delaiExact(s, retention)), 1, MAX_JOURS);

const difficulteInitiale = (g: Grade, w: number[] = W) => borner(w[4] - (g - 3) * w[5], 1, 10);

/**
 * Nouvel état après une révision. `etat` est null pour une carte jamais vue ; `jours` est
 * le temps écoulé depuis la révision précédente.
 */
export function reviser(etat: EtatFsrs | null, g: Grade, jours: number, W: number[] = POIDS_DEFAUT): EtatFsrs {
  if (!etat) return { stabilite: W[g - 1], difficulte: difficulteInitiale(g, W) };
  const { stabilite: s, difficulte: d } = etat;
  const r = retenabilite(Math.max(0, jours), s);
  // Difficulté : monte après un échec, baisse après « Facile », ramenée doucement vers la moyenne.
  const difficulte = borner(W[7] * difficulteInitiale(3, W) + (1 - W[7]) * (d - W[6] * (g - 3)), 1, 10);
  if (g === 1) {
    const oubli = W[11] * d ** -W[12] * ((s + 1) ** W[13] - 1) * Math.exp(W[14] * (1 - r));
    return { stabilite: Math.max(0.1, Math.min(oubli, s)), difficulte };
  }
  const bonus = g === 2 ? W[15] : g === 4 ? W[16] : 1;
  const gain = Math.exp(W[8]) * (11 - d) * s ** -W[9] * (Math.exp(W[10] * (1 - r)) - 1) * bonus;
  return { stabilite: s * (gain + 1), difficulte };
}

// ———————————————————— Ajuster FSRS sur l'historique d'un élève ————————————————————

/** Une révision de l'historique, réduite à ce qu'il faut pour rejouer FSRS. */
export type RevisionRejouee = { carte: string; date: string; note: 0 | 1 | 2 | 3 };

/** Bornes des 17 poids (celles de l'optimiseur de FSRS-4.5). */
const BORNES: [number, number][] = [
  [0.1, 100], [0.1, 100], [0.1, 100], [0.1, 100], [1, 10], [0.01, 4], [0.01, 4], [0.001, 0.75],
  [0, 4.5], [0, 0.8], [0.01, 3.5], [0.01, 5], [0.001, 0.25], [0.001, 0.9], [0, 4], [0, 1], [1, 6],
];
/** Nombre de révisions « évaluables » (une carte déjà vue, revue un autre jour) à partir duquel on ajuste. */
export const MINIMUM_AJUSTEMENT = 400;

const joursEntre = (a: string, b: string) => Math.round((Date.parse(b.slice(0, 10)) - Date.parse(a.slice(0, 10))) / 86_400_000);

/**
 * Les historiques par carte, une seule révision par jour (la première, comme l'optimiseur
 * d'Anki : une carte revue deux fois le même jour ne dit rien sur la mémoire à long terme).
 */
export function historiques(revisions: RevisionRejouee[]) {
  const parCarte = new Map<string, RevisionRejouee[]>();
  for (const r of [...revisions].sort((a, b) => a.date.localeCompare(b.date))) {
    const l = parCarte.get(r.carte) ?? [];
    if (!l.length || l[l.length - 1].date.slice(0, 10) !== r.date.slice(0, 10)) l.push(r);
    parCarte.set(r.carte, l);
  }
  return [...parCarte.values()];
}

/** Nombre de révisions qui servent à mesurer la mémoire (toutes sauf la première de chaque carte). */
export const nombreEvaluables = (h: RevisionRejouee[][]) => h.reduce((n, l) => n + Math.max(0, l.length - 1), 0);

/**
 * Perte logarithmique moyenne : à chaque révision (sauf la première), FSRS prédit la
 * probabilité de se souvenir ; on la compare à ce qui s'est passé (su ou oublié).
 */
export function perte(h: RevisionRejouee[][], w: number[]) {
  let total = 0, n = 0;
  for (const l of h) {
    let etat: EtatFsrs | null = null;
    for (let i = 0; i < l.length; i++) {
      const g = (l[i].note + 1) as Grade;
      const jours = i ? joursEntre(l[i - 1].date, l[i].date) : 0;
      if (etat) {
        const r = Math.min(0.9999, Math.max(0.0001, retenabilite(jours, etat.stabilite)));
        const su = g > 1 ? 1 : 0;
        total -= su * Math.log(r) + (1 - su) * Math.log(1 - r);
        n++;
      }
      etat = reviser(etat, g, jours, w);
    }
  }
  return n ? total / n : 0;
}

/**
 * Cherche les poids qui prédisent le mieux l'historique (descente de gradient Adam, gradient
 * estimé par différences finies), avec un rappel vers les poids par défaut pour ne pas
 * sur-apprendre un petit historique. Rend la main au navigateur entre deux itérations.
 */
export async function ajuster(
  revisions: RevisionRejouee[],
  progression?: (fait: number, total: number) => void,
  depart: number[] = POIDS_DEFAUT,
) {
  const h = historiques(revisions);
  const n = nombreEvaluables(h);
  const rappel = 2 / Math.sqrt(Math.max(n, 1));
  const objectif = (w: number[]) =>
    perte(h, w) + rappel * w.reduce((t, x, i) => t + ((x - POIDS_DEFAUT[i]) / (POIDS_DEFAUT[i] || 1)) ** 2, 0) / w.length;
  let w = [...depart];
  const m = w.map(() => 0), v = w.map(() => 0);
  const ITERATIONS = 120, pas = 0.02;
  for (let it = 1; it <= ITERATIONS; it++) {
    const grad = w.map((x, i) => {
      const e = Math.max(1e-4, Math.abs(x) * 1e-3);
      const plus = [...w], moins = [...w];
      plus[i] = x + e; moins[i] = x - e;
      return (objectif(plus) - objectif(moins)) / (2 * e);
    });
    w = w.map((x, i) => {
      m[i] = 0.9 * m[i] + 0.1 * grad[i];
      v[i] = 0.999 * v[i] + 0.001 * grad[i] ** 2;
      const mh = m[i] / (1 - 0.9 ** it), vh = v[i] / (1 - 0.999 ** it);
      // Pas relatif à l'ordre de grandeur du poids (w0 à w3 se comptent en jours).
      const echelle = Math.max(0.05, Math.abs(POIDS_DEFAUT[i]));
      return borner(x - pas * echelle * (mh / (Math.sqrt(vh) + 1e-8)), BORNES[i][0], BORNES[i][1]);
    });
    progression?.(it, ITERATIONS);
    if (it % 4 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  return { poids: w.map((x) => Math.round(x * 10000) / 10000), avant: perte(h, depart), apres: perte(h, w), evaluables: n };
}
