#!/usr/bin/env node
// Outil de la tâche planifiée qui traite les demandes envoyées depuis Luno.
//
//   node scripts/demandes.mjs liste                     demandes en attente (JSON)
//   node scripts/demandes.mjs repondre <id> <fichier>   dépose la réponse (JSON) et la marque prête
//   node scripts/demandes.mjs erreur <id> "<message>"   marque la demande en erreur
//   node scripts/demandes.mjs images <id>               télécharge les photos jointes et
//                                                       affiche leurs chemins (à ouvrir avec Read)
//
// La clé secrète Supabase n'est jamais dans le dépôt : dans l'environnement cloud
// « project-luno », le proxy réseau l'ajoute lui-même à l'en-tête `apikey` des requêtes
// vers le projet. On passe par curl, qui utilise ce proxy.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";

const PROJET = "https://jexdghinuyirmyebfxvp.supabase.co";
const URL = `${PROJET}/rest/v1/demandes`;
const CLE = process.env.SUPABASE_CLE_SECRETE || "remplacee-par-le-proxy";

function requete(methode, chemin, corps) {
  const args = ["-sS", "-X", methode, `${URL}${chemin}`, "-H", `apikey: ${CLE}`,
    "-H", "Content-Type: application/json", "-H", "Prefer: return=representation",
    "-w", "\n%{http_code}"];
  if (corps !== undefined) args.push("--data-binary", JSON.stringify(corps));
  const sortie = execFileSync("curl", args, { encoding: "utf8", maxBuffer: 1 << 26 });
  const i = sortie.lastIndexOf("\n");
  const code = Number(sortie.slice(i + 1));
  const texte = sortie.slice(0, i);
  if (code >= 300) throw new Error(`Supabase a répondu ${code} : ${texte}`);
  return texte ? JSON.parse(texte) : null;
}

// --- Vérification du format, avant d'écrire chez l'utilisateur ---
const erreurs = [];
const exiger = (ok, message) => { if (!ok) erreurs.push(message); };
const texteOk = (s, ou) => {
  exiger(typeof s === "string" && s.trim().length > 0, `${ou} : texte manquant`);
  if (typeof s !== "string") return;
  const o = (s.match(/\{\{/g) || []).length, f = (s.match(/\}\}/g) || []).length;
  const sep = (s.match(/\{\{[^{}]*? \/\/ [^{}]*?\}\}/g) || []).length;
  exiger(o === f && o === sep, `${ou} : fraction mal écrite (attendu {{numérateur // dénominateur}}, sans imbrication)`);
};
function verifierLecon(l) {
  for (const k of ["titre", "matiere", "niveau", "duree", "intro"]) texteOk(l[k], k);
  exiger(Array.isArray(l.etapes) && l.etapes.length >= 3, "etapes : au moins 3 étapes");
  (l.etapes || []).forEach((e, i) => {
    texteOk(e.titre, `etapes[${i}].titre`);
    exiger(Array.isArray(e.texte) && e.texte.length > 0, `etapes[${i}].texte : tableau de paragraphes`);
    (e.texte || []).forEach((t, j) => texteOk(t, `etapes[${i}].texte[${j}]`));
    if (e.exemple !== undefined) texteOk(e.exemple, `etapes[${i}].exemple`);
    if (e.question) { texteOk(e.question.q, `etapes[${i}].question.q`); texteOk(e.question.r, `etapes[${i}].question.r`); }
  });
}
function verifierErreurs(r) {
  exiger(Array.isArray(r.erreurs) && r.erreurs.length > 0, "erreurs : tableau non vide");
  (r.erreurs || []).forEach((e, i) => {
    texteOk(e.titre, `erreurs[${i}].titre`);
    texteOk(e.correction, `erreurs[${i}].correction`);
    for (const k of ["erreur", "conseil", "source", "chapitre"]) if (e[k] !== undefined) texteOk(e[k], `erreurs[${i}].${k}`);
  });
}
const TYPES = new Set([undefined, "qcm", "vraiFaux", "trou", "ordre", "ouverte"]);
function verifierCours(c) {
  texteOk(c.titre, "titre");
  exiger(Array.isArray(c.flashcards) && c.flashcards.length >= 8, "flashcards : au moins 8");
  (c.flashcards || []).forEach((k, i) => { texteOk(k.recto, `flashcards[${i}].recto`); texteOk(k.verso, `flashcards[${i}].verso`); });
  exiger(c.fiche && Array.isArray(c.fiche.sections) && Array.isArray(c.fiche.aRetenir), "fiche : { sections, aRetenir }");
  (c.fiche?.sections || []).forEach((s, i) => {
    texteOk(s.titre, `fiche.sections[${i}].titre`);
    (s.points || []).forEach((p, j) => {
      texteOk(p.t, `fiche.sections[${i}].points[${j}].t`);
      exiger(Number.isInteger(p.n) && p.n >= 1 && p.n <= 5, `fiche.sections[${i}].points[${j}].n : entier de 1 à 5`);
    });
  });
  exiger(Array.isArray(c.exercices) && c.exercices.length >= 8, "exercices : au moins 8");
  (c.exercices || []).forEach((e, i) => {
    exiger(TYPES.has(e.type), `exercices[${i}].type inconnu : ${e.type}`);
    if (!e.type || e.type === "qcm") exiger(Array.isArray(e.choix) && e.choix.length === 4 && Number.isInteger(e.bonneReponse), `exercices[${i}] : QCM à 4 choix avec bonneReponse`);
    if (e.type === "trou") exiger(/___/.test(e.texte || "") && Array.isArray(e.reponses), `exercices[${i}] : trou avec « ___ » et reponses`);
    if (e.type === "ordre") exiger(Array.isArray(e.elements) && e.elements.length >= 3, `exercices[${i}] : ordre avec au moins 3 éléments`);
  });
}

const [commande, id, arg] = process.argv.slice(2);
if (commande === "liste") {
  const lignes = requete("GET", "?statut=eq.en_attente&order=cree.asc&select=id,type,titre,texte,meta,cree");
  console.log(JSON.stringify(lignes, null, 2));
} else if (commande === "repondre" && id && arg) {
  const [ligne] = requete("GET", `?id=eq.${id}&select=id,type,statut`);
  if (!ligne) throw new Error(`Demande ${id} introuvable`);
  const reponse = JSON.parse(readFileSync(arg, "utf8"));
  if (ligne.type === "lecon") verifierLecon(reponse);
  else if (ligne.type === "erreurs") verifierErreurs(reponse);
  else verifierCours(reponse);
  if (erreurs.length) {
    console.error("Réponse refusée, à corriger :\n- " + erreurs.join("\n- "));
    process.exit(1);
  }
  requete("PATCH", `?id=eq.${id}`, { statut: "prete", reponse, erreur: null, traite: new Date().toISOString() });
  console.log(`Demande ${id} : réponse déposée.`);
} else if (commande === "images" && id) {
  const [ligne] = requete("GET", `?id=eq.${id}&select=meta`);
  const chemins = ligne?.meta?.images ?? [];
  const dossier = `/tmp/luno-images/${id}`;
  mkdirSync(dossier, { recursive: true });
  for (const chemin of chemins) {
    const fichier = `${dossier}/${chemin.split("/").pop()}`;
    execFileSync("curl", ["-sSf", "-o", fichier, `${PROJET}/storage/v1/object/demandes/${chemin}`,
      "-H", `apikey: ${CLE}`]);
    console.log(fichier);
  }
  if (!chemins.length) console.log("(aucune photo)");
} else if (commande === "erreur" && id && arg) {
  requete("PATCH", `?id=eq.${id}`, { statut: "erreur", erreur: arg, traite: new Date().toISOString() });
  console.log(`Demande ${id} : marquée en erreur.`);
} else {
  console.error("Usage : liste | repondre <id> <fichier.json> | erreur <id> \"<message>\"");
  process.exit(2);
}
