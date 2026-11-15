import { peutSExercer } from "./contenu";
import { dansJours, joursAvant } from "./dates";
import { lienTravail } from "./liens";
import { dansLeQuiz } from "./apprendre";
import type { Chapitre, Dst, ErreurNotee } from "./types";

/**
 * Programme de révision d'une évaluation (page « Préparer une éval ») : la liste des
 * étapes est déduite de ce que contiennent les chapitres au programme, puis répartie
 * sur les jours qui restent. Rien n'est rédigé ici : chaque étape renvoie à un écran
 * existant (fiche, définitions, dates, cartes, exercices, erreurs, interro blanche).
 */

export type EtapePreparation = {
  /** Identifiant stable, gardé dans `preparation.faits` quand l'étape est cochée. */
  id: string;
  titre: string;
  detail: string;
  href: string;
  /** Durée indicative, en minutes. */
  minutes: number;
  /** Étape de fin : à garder pour la veille. */
  veille?: boolean;
  /**
   * Révision de tête à refaire chaque jour (répétition espacée) : `repartir` en pose une
   * part sur chaque jour, en début de séance, au lieu d'une seule fois.
   */
  recurrente?: boolean;
};

export function etapes(
  dst: Dst,
  chapitres: Chapitre[],
  erreurs: ErreurNotee[],
  type: "cours" | "exos",
  scientifique = true,
): EtapePreparation[] {
  const auProgramme = chapitres.filter((c) => dst.chapitreIds.includes(c.id));
  const plusieurs = auProgramme.length > 1;
  const nom = (c: Chapitre) => (plusieurs ? ` · ${c.titre}` : "");
  const lien = (c: Chapitre, o: string) => lienTravail({ m: c.matiereId, c: c.id, o });
  const exos = (mode: string) => `/exercices?mode=${mode}&dst=${encodeURIComponent(dst.id)}`;
  const liste: EtapePreparation[] = [];

  // 1. Le cours, chapitre par chapitre : comprendre (fiche), puis apprendre par cœur.
  for (const c of auProgramme) {
    if (c.fiche)
      liste.push({
        id: `fiche:${c.id}`,
        titre: `Comprendre la fiche${nom(c)}`,
        detail: "Lis-la en taille « Standard », puis ferme-la et redis de tête les points essentiels. Relire ne suffit pas : c'est se tester qui fait retenir.",
        href: lien(c, "fiche"),
        minutes: 15,
      });
    else if (c.cours.trim())
      liste.push({
        id: `cours:${c.id}`,
        titre: `Relire le cours${nom(c)}`,
        detail: "Tes notes de cours.",
        href: lien(c, "cours"),
        minutes: 15,
      });
    const nbDefs = c.definitions?.length ?? 0;
    if (nbDefs)
      liste.push({
        id: `defs:${c.id}`,
        titre: `Apprendre les ${nbDefs} définitions${nom(c)}`,
        detail: "Mot pour mot, comme ton prof les a écrites.",
        href: lien(c, "defs"),
        minutes: 20,
      });
    const nbDates = c.dates?.length ?? 0;
    if (nbDates)
      liste.push({
        id: `dates:${c.id}`,
        titre: `Apprendre les ${nbDates} dates${nom(c)}`,
        detail: "La frise, puis « Remettre dans l'ordre » et « Quelle date ? ».",
        href: lien(c, "dates"),
        minutes: 15,
      });
  }
  const nbCartes = auProgramme.reduce((n, c) => n + c.flashcards.length, 0);
  const nbNotions = auProgramme.reduce((n, c) => n + c.flashcards.filter((f) => dansLeQuiz(c, f)).length, 0);
  if (nbNotions)
    liste.push({
      id: "apprendre",
      titre: `Apprendre les ${nbNotions} notions`,
      detail: "Les compléter, puis les écrire de tête, par manches de 7. Une notion n'est maîtrisée qu'après une réussite de tête un autre jour.",
      href: exos("apprendre"),
      // Environ 1,5 min par notion (deux ou trois paliers de 30 s), réparti sur les jours.
      minutes: Math.round(nbNotions * 1.5),
      recurrente: true,
    });
  if (nbCartes)
    liste.push({
      id: "cartes",
      titre: `Réviser les ${nbCartes} flashcards`,
      detail: "Les cartes des chapitres au programme : dis honnêtement si tu les savais.",
      href: lienTravail({ r: dst.id }),
      minutes: Math.max(10, Math.round(nbCartes / 5)),
      recurrente: true,
    });

  // 2. Les exercices, seulement pour une éval avec exercices.
  if (type === "exos") {
    // Hors sciences (HGGSP, histoire), un DST « avec exercices », c'est une dissertation
    // ou une étude critique : on rédige un sujet, pas une série de QCM.
    const aRediger = auProgramme.some((c) => (c.problemes?.length ?? 0) > 0);
    if (!scientifique && aRediger)
      liste.push({
        id: "problemes",
        titre: "Rédiger un sujet (dissertation ou étude critique)",
        detail: "Introduction et plan détaillé au brouillon, puis compare au corrigé étape par étape. Relis d'abord la méthode dans Apprendre → Méthodes.",
        href: exos("problemes"),
        minutes: 60,
      });
    if (scientifique && auProgramme.some(peutSExercer))
      liste.push({
        id: "serie",
        titre: "Faire une série d'exercices",
        detail: "QCM, vrai ou faux, textes à trous : pour vérifier que le cours est su.",
        href: exos("serie"),
        minutes: 15,
      });
    if (auProgramme.some((c) => (c.calculs?.length ?? 0) > 0))
      liste.push({
        id: "calculs",
        titre: "S'entraîner aux calculs",
        detail: "Valeurs tirées au hasard : formule, unité, chiffres significatifs.",
        href: exos("calculs"),
        minutes: 20,
      });
    if (scientifique && aRediger)
      liste.push({
        id: "problemes",
        titre: "Rédiger un problème",
        detail: "Étape par étape, comme sur ta copie, avec le barème.",
        href: exos("problemes"),
        minutes: 30,
      });
  }

  // 3. La veille : ses erreurs passées, puis une répétition générale.
  const nbErreurs = erreurs.filter((e) => e.matiereId === dst.matiereId).length;
  if (nbErreurs)
    liste.push({
      id: "erreurs",
      titre: `Relire mes ${nbErreurs} erreurs`,
      detail: "Ce qui t'a coûté des points aux évals d'avant.",
      href: lienTravail({ m: dst.matiereId, o: "erreurs" }),
      minutes: 10,
      veille: true,
    });
  if (auProgramme.some((c) => (c.definitions?.length ?? 0) + (c.calculs?.length ?? 0) > 0))
    liste.push({
      id: "interro",
      titre: "Faire une interro blanche",
      detail:
        type === "exos"
          ? "Questions de cours et calculs, chronométrés, avec une note sur 20."
          : "Questions de cours tirées de tes définitions, avec une note sur 20.",
      href: exos("interro"),
      minutes: 30,
      veille: true,
    });
  return liste;
}

export type JourPreparation = { date: string; etapes: EtapePreparation[] };

/**
 * Répartit les étapes sur les jours qui restent, d'aujourd'hui à la veille (cinq jours
 * au plus). Le cours à comprendre est réparti à parts à peu près égales ; les révisions
 * de tête (`recurrente`) reviennent chaque jour, en début de séance, pour revoir ce qui
 * a été appris la veille (répétition espacée), avec une part de la durée totale ; les
 * étapes de fin vont la veille. Une étape répétée a un identifiant par jour
 * (« apprendre@2026-11-16 »), pour être cochée jour par jour.
 */
export function repartir(liste: EtapePreparation[], dateDst: string): JourPreparation[] {
  const reste = joursAvant(dateDst);
  // Éval aujourd'hui ou déjà passée : tout tient en une journée.
  const nb = Math.max(1, Math.min(5, reste));
  const premier = Math.max(0, reste - nb);
  const jours: JourPreparation[] = Array.from({ length: nb }, (_, i) => ({ date: dansJours(premier + i), etapes: [] }));
  const debut = liste.filter((e) => !e.veille && !e.recurrente);
  const recurrentes = liste.filter((e) => e.recurrente);
  const fin = liste.filter((e) => e.veille);
  // Avec plusieurs jours, la veille est réservée à la répétition générale.
  const libres = nb > 1 && fin.length ? nb - 1 : nb;
  // Révisions de tête : chaque jour (veille comprise), en tête de séance.
  jours.forEach((j, i) => {
    for (const e of recurrentes) {
      const part = Math.max(10, Math.round(e.minutes / nb));
      j.etapes.push({
        ...e,
        id: nb > 1 ? `${e.id}@${j.date}` : e.id,
        titre: nb > 1 && i > 0 ? e.titre.replace(/^Apprendre/, "Continuer d'apprendre").replace(/^Réviser/, "Revoir") : e.titre,
        minutes: part,
      });
    }
  });
  const total = debut.reduce((n, e) => n + e.minutes, 0) || 1;
  let cumul = 0;
  for (const e of debut) {
    jours[Math.min(libres - 1, Math.floor((cumul / total) * libres))].etapes.push(e);
    cumul += e.minutes;
  }
  // Jour 1 : on comprend le cours avant de se tester dessus.
  jours[0].etapes.sort((a, b) => Number(Boolean(a.recurrente)) - Number(Boolean(b.recurrente)));
  jours[nb - 1].etapes.push(...fin);
  return jours.filter((j) => j.etapes.length > 0);
}
