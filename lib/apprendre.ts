import { melanger, simplifier } from "./contenu";
import { sansMiseEnForme } from "@/components/Formule";
import type { Chapitre, Flashcard } from "./types";
import { CARTES_HORS_QUIZ, CHAPITRES_HORS_QUIZ } from "@/contenu/hors-quiz";

/**
 * Mode « Apprendre » (S'exercer) : chaque notion (une flashcard) monte par paliers
 * jusqu'à être maîtrisée. 1 = la reconnaître (QCM), 2 = la compléter (texte à trous),
 * 3 = l'écrire de tête (comparée au cours, validée par l'élève). Une notion courte n'a
 * que deux paliers : QCM puis de tête. Le palier atteint est gardé dans la carte
 * (`apprendre` : 0 à 3, 3 = maîtrisée) et synchronisé.
 */

export type Palier = 1 | 2 | 3;
export const MAITRISEE = 3;
export const TAILLE_MANCHE = 7;

const VIDES = new Set(
  "alors aussi avec avoir avant cela celle celui cette dans depuis donc elle elles entre est être fait font leur leurs mais même nous pour plus quand quel quelle qu'il sans selon sont tout tous toute toutes très vers une des les par sur qui que dont ou où son ses aux ils lui cet ces sous peut ainsi comme deux trois quatre cinq exemple exemples comment pourquoi quels quelles quoi faut signifie auquel lequel laquelle lesquels duquel chaque autre autres celles ceux partir obtenue obtenu obtient defini definie definis definit relation decompose decomposer succession appelle appele appelee correspond donne".split(
    " ",
  ),
);

/**
 * Mots de même sens, acceptés l'un pour l'autre quand on corrige une réponse écrite
 * (« au bout » pour « à l'extrémité », « consécutives » pour « successives »).
 */
const SYNONYMES: string[][] = [
  ["extremite", "bout"],
  ["successives", "successifs", "successive", "successif", "consecutives", "consecutifs", "consecutive", "consecutif"],
  ["nul", "nulle", "nuls", "nulles", "zero"],
  ["constant", "constante", "constants", "constantes", "inchange", "inchangee"],
  ["oppose", "opposee", "opposes", "opposees", "contraire", "inverse"],
  ["colineaires", "paralleles", "colineaire", "parallele"],
  ["intervalle", "duree"],
  ["instant", "moment", "date"],
];
const GROUPE = new Map<string, number>(SYNONYMES.flatMap((g, i) => g.map((m) => [m, i] as const)));
/** Deux mots (sans accents) de même sens ? */
export const synonymes = (a: string, b: string) => GROUPE.has(a) && GROUPE.get(a) === GROUPE.get(b);

/** Le texte sans ses exemples : « (par exemple cartésien) », « Exemples : cycliste… ». */
export const sansExemples = (texte: string) =>
  texte
    .replace(/\((?:par )?ex(?:emples?|\.)[^)]*\)/gi, " ")
    .replace(/(?:par exemple|exemples?\s*:|ex\.\s*:?)[^.;]*/gi, " ");

/** Les mots qui comptent dans un texte (sans formules, mots vides ni petits mots). */
export function motsCles(texte: string): string[] {
  // « de l'ordre de » n'est pas un mot du cours (tour 2 : « il manque ordre »).
  const brut = sansMiseEnForme(texte)
    .replace(/\{\{[^}]*\}\}/g, " ")
    .replace(/de l['’]ordre d['’e]/gi, " ");
  return [
    ...new Set(
      brut
        .split(/[\s,;:.!?()«»"'’/—–-]+/)
        .map((m) => m.trim())
        .filter((m) => m.length >= 4 && /^[A-Za-zÀ-ÿ]+$/.test(m) && !VIDES.has(simplifier(m))),
    ),
  ];
}

/** Une notion est courte si elle tient en peu de mots : pas de texte à trous. */
export const estCourte = (f: Flashcard) => motsCles(f.verso).length <= 4;

/** Le palier à travailler pour une carte (celui qu'elle n'a pas encore réussi). */
export function palierSuivant(f: Flashcard): Palier {
  const atteint = f.apprendre ?? 0;
  if (atteint >= 2) return 3;
  if (atteint === 1) return estCourte(f) ? 3 : 2;
  return 1;
}

/** Palier enregistré après une réussite au palier `p`. */
export const apresReussite = (f: Flashcard, p: Palier) => (p === 3 ? 3 : p === 1 && estCourte(f) ? 2 : p);

/** Palier enregistré après un échec : au palier 3, on redescend d'un cran. */
export const apresEchec = (f: Flashcard, p: Palier) => (p === 3 ? (estCourte(f) ? 1 : 2) : Math.max(0, p - 1));

export type NotionManche = {
  chapitreId: string;
  carte: Flashcard;
  palier: Palier;
  /** Palier 1 : quatre propositions, dont le verso (ou le recto si `inverse`). */
  choix?: string[];
  /**
   * Palier 1 inversé, pour une carte de vocabulaire : on montre la définition (le mot
   * lui-même caché par « … » s'il y figure) et on choisit la notion parmi quatre rectos.
   */
  inverse?: string;
  /** Palier 2 : le mot caché dans le verso. */
  trous?: string[];
};

/** Part des mots clés de `b` déjà présents dans `a` (0 à 1). */
function recouvrement(a: string, b: string) {
  const ma = new Set(motsCles(a).map(simplifier));
  const mb = motsCles(b).map(simplifier);
  return mb.length ? mb.filter((m) => ma.has(m)).length / mb.length : 0;
}

/**
 * La forme d'une réponse : une formule (« Δv⃗ = 0⃗ … »), une consigne (« Tracer… »),
 * un oui / non, ou une phrase. Un intrus d'une autre forme se repère sans rien savoir.
 */
function forme(verso: string) {
  const t = sansMiseEnForme(verso).trim();
  if (/^(oui|non)\b/i.test(t)) return "ouinon";
  if (/=/.test(t.slice(0, 24))) return "formule";
  const premier = t.split(/[\s,;:]/)[0] ?? "";
  if (/^[A-ZÀ-Ý][a-zà-ÿ]+(er|ir|re)$/.test(premier) && !/^(Le|La|Les|Une?)$/.test(premier)) return "consigne";
  return "phrase";
}

/** Le début d'une question (« Que vaut », « Comment », « À quoi »), pour des intrus du même genre. */
const debutQuestion = (recto: string) =>
  estQuestion(recto) ? simplifier(recto).split(" ").slice(0, 2).join(" ") : "";

/**
 * Les quatre propositions d'un QCM : le verso et trois versos du même chapitre d'abord,
 * de même forme (formule, consigne, phrase) et de longueur proche, sinon la bonne réponse
 * se devine à sa forme (tour 1 de l'élève testeur : « Que vaut Δv⃗ ? » avec une seule
 * réponse en « Δv⃗ = », et un intrus « Oui : … »). Si la bonne réponse reprend des mots
 * de la question (« repère d'espace », « horloge »), les intrus qui en reprennent aussi
 * passent devant. Une carte qui dit presque la même chose que la bonne réponse est
 * écartée : il n'y aurait pas une seule bonne réponse.
 */
function choixPour(carte: Flashcard, memeChapitre: Flashcard[], ailleurs: Flashcard[]) {
  const motsRecto = motsDuRecto(carte);
  // Deux mots voisins (« géocentrique » et « héliocentrique ») ont des définitions de
  // même forme : c'est justement le bon intrus, même si elles se ressemblent.
  const voisine = (f: Flashcard) =>
    !estQuestion(carte.recto) && !estQuestion(f.recto) && f.recto !== carte.recto && [...motsDuRecto(f)].some((m) => motsRecto.has(m));
  const valable = (f: Flashcard) =>
    f.id !== carte.id &&
    f.verso !== carte.verso &&
    (voisine(f) || (recouvrement(f.verso, carte.verso) < 0.35 && recouvrement(carte.verso, f.verso) < 0.35));
  const formeBonne = forme(carte.verso);
  const reprendQuestion = recouvrement(carte.verso, carte.recto) > 0;
  const debut = debutQuestion(carte.recto);
  const ecart = (f: Flashcard, ailleursPenalite: number) => {
    let e = ailleursPenalite;
    const fo = forme(f.verso);
    if (fo !== formeBonne) e += fo === "ouinon" || formeBonne === "ouinon" ? 6 : 3;
    const la = carte.verso.length;
    e += (2 * Math.abs(f.verso.length - la)) / Math.max(la, f.verso.length);
    if (reprendQuestion && recouvrement(f.verso, carte.recto) === 0) e += 1.5;
    if (debut && debutQuestion(f.recto) === debut) e -= 1;
    // Carte de vocabulaire (« Référentiel géocentrique ») : les intrus sont les définitions
    // des notions voisines (« Référentiel terrestre », « héliocentrique »), d'autres mots à
    // définir, jamais des réponses à des questions (tour 3, défaut 5).
    if (!estQuestion(carte.recto)) {
      if (estQuestion(f.recto)) e += 3;
      else if ([...motsDuRecto(f)].some((m) => motsRecto.has(m))) e -= 2.5;
    }
    return e + Math.random() * 0.6;
  };
  const candidats = [
    ...memeChapitre.filter(valable).map((f) => ({ f, e: ecart(f, 0) })),
    ...ailleurs.filter(valable).map((f) => ({ f, e: ecart(f, 2) })),
  ].sort((a, b) => a.e - b.e);
  // Deux cartes identiques ailleurs (même verso) ne comptent qu'une fois.
  const versos = new Set<string>([carte.verso]);
  const autres: string[] = [];
  for (const { f } of candidats) {
    if (versos.has(f.verso)) continue;
    versos.add(f.verso);
    autres.push(f.verso);
    if (autres.length === 3) break;
  }
  return melanger([carte.verso, ...autres]);
}

/** Un recto rédigé en question (« Quelle est… ? ») plutôt qu'un mot à définir. */
export const estQuestion = (recto: string) => /\?\s*$/.test(recto.trim());

/** Les mots clés du recto (sans accents), pour ne pas les cacher ni les montrer. */
const motsDuRecto = (f: Flashcard) => new Set(motsCles(f.recto.replace(/\(.*?\)/g, "")).map(simplifier));
const memeMot = (a: string, b: string) => a === b || a.replace(/s$/, "") === b.replace(/s$/, "");

/** La définition, avec les mots du recto remplacés par « … » (le QCM inversé ne se devine pas). */
function cacherRecto(carte: Flashcard) {
  const mots = [...motsDuRecto(carte)];
  return sansMiseEnForme(carte.verso).replace(/[A-Za-zÀ-ÿ]+/g, (m) =>
    mots.some((r) => memeMot(simplifier(m), r)) ? "…" : m,
  ).replace(/(…\s*)+…/g, "…");
}

/** Le verso redit-il les mots du recto (« … : c'est la vitesse limite ») ? */
const versoRepeteRecto = (f: Flashcard) => {
  const mots = [...motsDuRecto(f)];
  const verso = new Set(motsCles(f.verso).map(simplifier));
  return mots.length > 0 && mots.every((r) => [...verso].some((v) => memeMot(v, r)));
};

/** QCM inversé : la bonne notion parmi quatre rectos de vocabulaire (même chapitre d'abord). */
function inversePour(carte: Flashcard, memeChapitre: Flashcard[], ailleurs: Flashcard[]) {
  const valable = (f: Flashcard) => f.id !== carte.id && !estQuestion(f.recto) && f.recto !== carte.recto;
  // Les notions voisines d'abord (« Référentiel terrestre » pour « Référentiel héliocentrique ») :
  // il faut vraiment savoir, pas éliminer.
  const mots = motsDuRecto(carte);
  const voisine = (f: Flashcard) => [...motsDuRecto(f)].some((m) => mots.has(m));
  const trier = (l: Flashcard[]) => melanger(l.filter(valable)).sort((a, b) => Number(voisine(b)) - Number(voisine(a)));
  const autres = [...trier(memeChapitre), ...trier(ailleurs)].slice(0, 3);
  if (autres.length < 3) return null;
  return { enonce: cacherRecto(carte), choix: melanger([carte.recto, ...autres.map((f) => f.recto)]) };
}

/**
 * Un mot qui revient souvent sans être du cours : un verbe conjugué (« étudie », « exerce »,
 * « vérifié ») ou un mot de liaison (« après », « rapport »). Ne sert pas de trou.
 */
const PASSAGE = new Set("apres rapport difference lointaines exerce permet avant partir ensemble diriges change pseudo aucune aucun".split(" "));
const motDePassage = (m: string) => PASSAGE.has(m) || /(ent|ez|ons|e|ee|ees|es|er|ie|ise)$/.test(m) && /(ent|ez|ons|ee|ees|er|ie|ise|isee?)$|^(exerc|utilis|modelis|associ|etudi|verifi)/.test(m);

/** Position d'un mot entier dans un texte (sans le prendre dans un autre mot). */
const positionMot = (texte: string, mot: string, depuis = 0) => {
  const m = new RegExp(`(?<![A-Za-zÀ-ÿ])${mot}(?![A-Za-zÀ-ÿ])`, "g");
  m.lastIndex = depuis;
  return m.exec(texte)?.index ?? -1;
};

/**
 * Les mots cachés au palier 2 (demandé le 2026-11-15 : « plus qu'un mot, c'est un peu
 * simple ») : de 1 à 4 selon la longueur de la réponse, un trou pour 4 mots clés environ.
 * Ce sont des mots du vocabulaire du chapitre (mots des rectos, ou mots qui reviennent
 * dans plusieurs réponses : « tangente », « référentiel », « colinéaires »…), absents du
 * recto de la carte. Jamais un adverbe (« numériquement ») ni un mot banal. Rangés dans
 * l'ordre du texte.
 */
function trousPour(carte: Flashcard, vocabulaire: Set<string>) {
  const texte = sansMiseEnForme(carte.verso);
  const recto = [...motsDuRecto(carte)];
  const cles = motsCles(carte.verso);
  const duCours = cles.filter(
    (m) =>
      !/ment$/i.test(m) &&
      !recto.some((r) => memeMot(simplifier(m), r)) &&
      [...vocabulaire].some((v) => memeMot(simplifier(m), v)) &&
      positionMot(texte, m) >= 0,
  );
  // Aucun mot du cours dans la réponse : pas de texte à trous (un mot pris au hasard
  // n'apprend rien), on passera à « De tête ».
  if (!duCours.length) return undefined;
  const nombre = Math.max(1, Math.min(4, Math.round(cles.length / 4)));
  // Un même mot ne sert qu'une fois (« force » et « forces »).
  const distincts = melanger(duCours).filter(
    (m, i, l) => l.findIndex((x) => memeMot(simplifier(x), simplifier(m))) === i,
  );
  return distincts
    .slice(0, nombre)
    .sort((a, b) => positionMot(texte, a) - positionMot(texte, b));
}

/** Le texte découpé autour des trous : morceaux de texte et numéros de trous, dans l'ordre. */
export function decouperTrous(verso: string, trous: string[]): (string | number)[] {
  const texte = sansMiseEnForme(verso);
  const morceaux: (string | number)[] = [];
  let fin = 0;
  trous.forEach((mot, i) => {
    const p = positionMot(texte, mot, fin);
    if (p < 0) return;
    morceaux.push(texte.slice(fin, p), i);
    fin = p + mot.length;
  });
  morceaux.push(texte.slice(fin));
  return morceaux;
}

export function preparerNotion(
  chapitreId: string,
  carte: Flashcard,
  memeChapitre: Flashcard[],
  ailleurs: Flashcard[] = [],
): NotionManche {
  let palier = palierSuivant(carte);
  // Carte de vocabulaire : QCM inversé si le verso redit le mot, sinon une fois sur trois.
  if (palier === 1 && !estQuestion(carte.recto) && (versoRepeteRecto(carte) || Math.random() < 1 / 3)) {
    const inv = inversePour(carte, memeChapitre, ailleurs);
    if (inv) return { chapitreId, carte, palier, choix: inv.choix, inverse: inv.enonce };
  }
  // Une carte-question sans leurres écrits à la main saute le QCM : des intrus pris dans
  // d'autres cartes n'ont ni la même forme ni le même sujet, la bonne réponse se devine.
  if (palier === 1 && estQuestion(carte.recto) && !(carte.leurres && carte.leurres.length >= 3))
    palier = estCourte(carte) ? 3 : 2;
  let choix =
    palier === 1
      ? carte.leurres && carte.leurres.length >= 3
        ? melanger([carte.verso, ...melanger(carte.leurres).slice(0, 3)])
        : choixPour(carte, memeChapitre, ailleurs)
      : undefined;
  // Pas assez d'autres cartes pour un QCM : on passe au palier suivant.
  if (choix && choix.length < 4) {
    palier = estCourte(carte) ? 3 : 2;
    choix = undefined;
  }
  // Vocabulaire du chapitre : les mots des rectos, et ceux qui reviennent dans au moins
  // deux réponses (les mots du cours, pas les mots de passage).
  const frequence = new Map<string, number>();
  for (const f of memeChapitre)
    for (const m of new Set(motsCles(f.verso).map(simplifier))) frequence.set(m, (frequence.get(m) ?? 0) + 1);
  const vocabulaire = new Set(
    [
      ...memeChapitre.flatMap((f) => [...motsDuRecto(f)]),
      ...[...frequence].filter(([m, n]) => n >= 2 && m.length >= 6 && !motDePassage(m)).map(([m]) => m),
    ].filter((m) => m.length >= 5 && !/ment$/.test(m) && !motDePassage(m)),
  );
  const trous = palier === 2 ? trousPour(carte, vocabulaire) : undefined;
  // Aucun mot intéressant à cacher : on passe à « De tête ».
  if (palier === 2 && !trous) palier = 3;
  return { chapitreId, carte, palier, choix, trous };
}

/**
 * Les notions d'une manche : d'abord celles déjà commencées (les plus avancées en
 * premier, pour les finir), puis des nouvelles, mélangées.
 */
/** Une carte que le quiz pose : ni méthode, ni astuce, ni détail hors DST (contenu/hors-quiz.ts). */
export const dansLeQuiz = (c: Chapitre, f: Flashcard) =>
  !f.horsQuiz && !(c.publieId && CHAPITRES_HORS_QUIZ.has(c.publieId)) && !CARTES_HORS_QUIZ.has(f.recto.trim().toLowerCase());

/** Les cartes du quiz, une seule fois chacune (une carte peut être dans deux chapitres). */
function sansDoublons(chapitres: Chapitre[]) {
  const vues = new Set<string>();
  return chapitres.flatMap((c) =>
    c.flashcards.filter((f) => dansLeQuiz(c, f)).flatMap((carte) => {
      const cle = `${carte.recto.trim().toLowerCase()}|${carte.verso.trim().toLowerCase()}`;
      if (vues.has(cle)) return [];
      vues.add(cle);
      return [{ chapitreId: c.id, carte }];
    }),
  );
}

export function composerManche(chapitres: Chapitre[], taille = TAILLE_MANCHE): NotionManche[] {
  const toutes = sansDoublons(chapitres);
  // Une notion déjà avancée aujourd'hui passe après les autres : la reposer tout de suite
  // ne mesure que la mémoire immédiate.
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const vueAujourdhui = (f: Flashcard) => f.apprendreJour === aujourdhui;
  const enCours = melanger(toutes.filter((x) => (x.carte.apprendre ?? 0) > 0 && (x.carte.apprendre ?? 0) < MAITRISEE)).sort(
    (a, b) =>
      Number(vueAujourdhui(a.carte)) - Number(vueAujourdhui(b.carte)) || (b.carte.apprendre ?? 0) - (a.carte.apprendre ?? 0),
  );
  const nouvelles = melanger(toutes.filter((x) => !x.carte.apprendre));
  const ordre = [
    ...enCours.filter((x) => !vueAujourdhui(x.carte)),
    ...nouvelles,
    ...enCours.filter((x) => vueAujourdhui(x.carte)),
  ];
  return melanger(ordre.slice(0, taille)).map((x) => {
    const du = (meme: boolean) => toutes.filter((y) => (y.chapitreId === x.chapitreId) === meme).map((y) => y.carte);
    return preparerNotion(x.chapitreId, x.carte, du(true), du(false));
  });
}

/** Combien de notions à chaque palier. */
export function repartition(chapitres: Chapitre[]) {
  const r = { maitrisees: 0, aEcrire: 0, aCompleter: 0, nouvelles: 0, total: 0 };
  for (const { carte: f } of sansDoublons(chapitres)) {
      r.total++;
      const a = f.apprendre ?? 0;
      if (a >= MAITRISEE) r.maitrisees++;
      else if (a === 0) r.nouvelles++;
      else if (palierSuivant(f) === 3) r.aEcrire++;
      else r.aCompleter++;
    }
  return r;
}

/**
 * Compare une réponse écrite de tête au verso : chaque mot clé du verso est-il présent
 * (sans accents ni majuscules, en tolérant une faute de frappe) ?
 */
/** Une formule ramenée à l'essentiel : sans espaces, flèches, parenthèses ni « · ». */
// Indices et exposants écrits en petit (vₓᵢ, MnO₄⁻) ou tapés normalement (vxi, MnO4-).
const PETITS: Record<string, string> = Object.fromEntries(
  [..."₀₁₂₃₄₅₆₇₈₉₊₋⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ᵢₓᵧₙₘ"].map((c, i) => [c, "0123456789+-0123456789+-ixynm"[i]]),
);
const normFormule = (t: string) =>
  t
    .replace(/[₀-₉₊₋⁰¹²³⁴-⁹⁺⁻ᵢₓᵧₙₘ]/g, (c) => PETITS[c] ?? c)
    .replace(/\((aq|l|s|g)\)/g, "")
    .replace(/⇄|↔|<->|->|⟶/g, "→")
    .replace(/\{\{(.+?)\s*\/\/\s*(.+?)\}\}/g, "($1)/($2)")
    .replace(/[’′]/g, "'")
    .replace(/[\s·*×]/g, "")
    .replace(/−/g, "-")
    .replace(/_/g, "")
    .replace(/0\u20d7/g, "0");

/**
 * Retire les parenthèses qui n'entourent qu'un seul terme (« (2Δt) » = « 2Δt ») mais
 * garde celles qui comptent : « Mᵢ₋₁Mᵢ₊₁/(2Δt) » n'est pas « (Mᵢ₋₁Mᵢ₊₁)/(2Δt) ».
 */
const sansParenthesesInutiles = (t: string) => {
  let avant = "";
  while (avant !== t) {
    avant = t;
    t = t.replace(/\(([^()+\-/=]*)\)/g, "$1");
  }
  return t;
};
// Les indices ᵢ₋₁ et ᵢ₊₁ font partie du nom d'un point (Mᵢ₋₁) : ce ne sont pas des opérations.
const indicesDePoints = (t: string) => t.replace(/([A-Z])i([+-])1(?![0-9])/g, (_, l, sg) => `${l}{i${sg === "+" ? "p" : "m"}1}`);
const formuleNette = (t: string) => sansParenthesesInutiles(indicesDePoints(normFormule(t)));
const sansFleches = (t: string) => t.replace(/\u20d7/g, "");

/** Les formules d'un verso (« Δv⃗ = 0⃗ », « ΣF⃗ = {{m·Δv⃗ // Δt}} »), telles qu'écrites. */
export function formulesDe(verso: string): string[] {
  const t = sansMiseEnForme(verso)
    .replace(/\{\{(.+?) \/\/ (.+?)\}\}/g, (m) => m.replace(/\s+/g, "\u00a0"))
    .replace(/\s*([=⟺⇄→+\-−×·/])\s*/g, "$1");
  // Équation de chimie (« MnO₄⁻ + 8 H⁺ + 5 e⁻ ⇄ Mn²⁺ + 4 H₂O ») : toute la proposition.
  const chimie = sansMiseEnForme(verso)
    .split(/[:;]|\.\s|\.$/)
    .map((x) => x.trim())
    .filter((x) => /⇄|→/.test(x) && /[A-Z]/.test(x) && /\+/.test(x));
  if (chimie.length) return chimie;
  return t
    .split(/[\s:;,]+|(?:\.\s)/)
    .map((x) => x.replace(/\u00a0/g, " ").replace(/[.]$/, "").replace(/\{\{(.+?)\/\/(.+?)\}\}/g, "{{$1 // $2}}"))
    .filter((x) => /=|⟺/.test(x) && x.length >= 3);
}

export function comparer(reponse: string, verso: string) {
  verso = sansExemples(verso);
  const dits = new Set(
    simplifier(reponse)
      .split(" ")
      .filter((m) => m.length >= 3),
  );
  const proche = (a: string, b: string) => {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1 || a.length < 5) return false;
    // Une seule lettre différente, ajoutée ou retirée.
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    return a.slice(i + 1) === b.slice(i + 1) || a.slice(i + 1) === b.slice(i) || a.slice(i) === b.slice(i + 1);
  };
  const cles = motsCles(verso);
  const presents = new Set(
    cles.filter((m) => {
      const s = simplifier(m);
      return [...dits].some((d) => proche(d, s) || synonymes(d, s) || (s.length >= 6 && (d.startsWith(s.slice(0, -1)) || s.startsWith(d.slice(0, -1)))));
    }),
  );
  // Les formules comptent aussi : « Δv⃗ = 0⃗ » écrit tel quel, c'est l'essentiel de la réponse.
  // Il faut les flèches de vecteur si le cours en met (« v = MM'/Δt » pour un vecteur
  // vitesse perd des points), et le bon parenthésage.
  const rep = formuleNette(reponse);
  const ditNul = /\b(nul|nulle|zero)\b/.test(simplifier(reponse));
  const formules = formulesDe(verso).map((f) => {
    const attendue = formuleNette(f);
    if (rep.includes(attendue)) return { f, trouvee: true, sansFleche: false };
    // « Il est nul » pour « Δv⃗ = 0⃗ » : c'est la même chose dite en mots.
    if (ditNul && /=0$/.test(sansFleches(attendue))) return { f, trouvee: true, sansFleche: false };
    const sansFleche = attendue !== sansFleches(attendue) && sansFleches(rep).includes(sansFleches(attendue));
    return { f, trouvee: false, sansFleche };
  });
  return {
    cles,
    presents,
    manquants: cles.filter((m) => !presents.has(m)),
    part: cles.length ? presents.size / cles.length : 1,
    formules,
  };
}
