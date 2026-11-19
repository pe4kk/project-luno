#!/usr/bin/env node
// Outil de la tâche planifiée qui traite les demandes envoyées depuis Luno.
//
//   node scripts/demandes.mjs liste                     demandes en attente (JSON)
//   node scripts/demandes.mjs repondre <id> <fichier>   dépose la réponse (JSON) et la marque prête
//   node scripts/demandes.mjs erreur <id> "<message>"   marque la demande en erreur
//   node scripts/demandes.mjs images <id>               télécharge les photos jointes et
//                                                       affiche leurs chemins (à ouvrir avec Read)
//   node scripts/demandes.mjs journal [AAAA-MM-JJ]      réponses au quiz (mode Apprendre) depuis
//                                                       cette date : signalements, cartes souvent
//                                                       ratées, réponses fausses (pour améliorer les quiz)
//   node scripts/demandes.mjs decouvertes               comptes qui ont activé la découverte du jour :
//                                                       à créer aujourd'hui ? éléments « Je connais déjà »
//                                                       à remplacer ? historique (pour ne rien répéter)
//   node scripts/demandes.mjs decouverte <compte> <fichier>
//                                                       dépose la découverte du jour { fait, oeuvre, actu }
//                                                       (les trois si elle n'existe pas encore aujourd'hui,
//                                                       sinon seulement les éléments à remplacer)
//   node scripts/demandes.mjs recopier-images <compte>  copie dans le stockage les images d'œuvres
//                                                       qui n'y sont pas (réparation)
//   node scripts/demandes.mjs images-commons "<mots>"   cherche une œuvre sur Wikimedia Commons (fichiers)
//   node scripts/demandes.mjs image-commons "<File:…>"  adresse 800 px, page et crédit d'un fichier Commons,
//                                                       prêts pour `oeuvre.image`
//
// La clé secrète Supabase n'est jamais dans le dépôt : dans l'environnement cloud
// « project-luno », le proxy réseau l'ajoute lui-même à l'en-tête `apikey` des requêtes
// vers le projet. On passe par curl, qui utilise ce proxy.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";

// LUNO_PROJET : un faux serveur local pour tester le script, jamais un vrai compte.
const PROJET = process.env.LUNO_PROJET || "https://jexdghinuyirmyebfxvp.supabase.co";
const URL = `${PROJET}/rest/v1/demandes`;
const CLE = process.env.SUPABASE_CLE_SECRETE || "remplacee-par-le-proxy";

function requete(methode, chemin, corps, base = URL) {
  const args = ["-sS", "-X", methode, `${base}${chemin}`, "-H", `apikey: ${CLE}`,
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
function verifierBilan(r) {
  const b = r.bilan || {};
  texteOk(b.resume, "bilan.resume");
  for (const k of ["pointsForts", "aRetravailler", "conseils"]) {
    exiger(Array.isArray(b[k]) && b[k].length > 0, `bilan.${k} : tableau non vide`);
    (b[k] || []).forEach((t, i) => texteOk(t, `bilan.${k}[${i}]`));
  }
  exiger(Array.isArray(r.erreurs), "erreurs : tableau (vide si aucune erreur)");
  (r.erreurs || []).forEach((e, i) => {
    texteOk(e.titre, `erreurs[${i}].titre`);
    texteOk(e.correction, `erreurs[${i}].correction`);
    texteOk(e.matiere, `erreurs[${i}].matiere (nom exact d'une matière de l'interro)`);
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
// Explication d'un passage du cours (type « lecon » avec meta.explication) :
// { explication: { texte, exemple?, piege? } }, mêmes notations que contenu/.
function verifierExplication(r) {
  exiger(r && r.explication && typeof r.explication === "object", "explication : { texte, exemple?, piege? }");
  texteOk(r.explication?.texte, "explication.texte");
  if (r.explication?.exemple !== undefined) texteOk(r.explication.exemple, "explication.exemple");
  if (r.explication?.piege !== undefined) texteOk(r.explication.piege, "explication.piege");
}
function verifierNote(r) {
  exiger(r && r.note && typeof r.note === "object", "note : { titre, texte }");
  texteOk(r.note?.titre, "note.titre");
  texteOk(r.note?.texte, "note.texte");
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

// --- Découverte du jour (fait, œuvre, actualité), voir lib/decouverte.ts ---
const jourParis = (d = new Date()) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris" }).format(d);
const DONNEES = `${PROJET}/rest/v1/donnees`;
/** Appel de l'API de Commons ; elle limite les requêtes rapprochées : on réessaie après une pause. */
function commons(params) {
  const q = new globalThis.URLSearchParams({ ...params, format: "json" });
  for (let essai = 1; ; essai++) {
    const brut = execFileSync("curl", ["-sS", "-A", "LunoBot/1.0 (outil scolaire)", `https://commons.wikimedia.org/w/api.php?${q}`], { encoding: "utf8" });
    try {
      return JSON.parse(brut);
    } catch {
      if (essai >= 4) throw new Error(`Commons ne répond pas : ${brut.slice(0, 120)}`);
      execFileSync("sleep", [String(10 * essai)]);
    }
  }
}
function lignesDecouverte(compte) {
  return requete("GET", `?user_id=eq.${compte}&meta->>decouverte=eq.true&statut=eq.prete&select=id,meta,reponse&order=cree.desc`);
}
function elementsDe(lignes) {
  return lignes.flatMap((l) => {
    const d = l.reponse?.decouverte;
    if (!d) return [];
    return [
      { ...d.fait, type: "fait", jour: d.jour },
      { ...d.oeuvre, type: "oeuvre", jour: d.jour },
      { ...d.actu, type: "actu", jour: d.jour },
      ...(d.anciens || []).map((a) => ({ ...a, jour: d.jour })),
    ];
  });
}
function joursDepuis(iso, jour) {
  return Math.round((Date.parse(jour) - Date.parse(iso)) / 86_400_000);
}
function urlRepond(url) {
  try {
    const code = // Comme le site : un navigateur qui envoie l'adresse du site (Wikimedia refuse les images
    // demandées par un navigateur sans « Referer »).
    execFileSync("curl", ["-sS", "-A", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Safari/604.1",
      "-e", "https://pe4kk.github.io/", "-o", "/dev/null", "-L", "-w", "%{http_code}", url], { encoding: "utf8" });
    return Number(code) < 400;
  } catch {
    return false;
  }
}
/** Copie l'image d'une œuvre dans le stockage privé du compte ; rend son chemin, ou null. */
function copierImage(compte, id, url) {
  const fichier = `/tmp/luno-decouverte-${id}.jpg`;
  try {
    execFileSync("curl", ["-sSf", "-A", "LunoBot/1.0 (outil scolaire)", "-o", fichier, url]);
    const chemin = `${compte}/decouvertes/${id}.jpg`;
    execFileSync("curl", ["-sSf", "-X", "POST", `${PROJET}/storage/v1/object/demandes/${chemin}`, "-H", `apikey: ${CLE}`,
      "-H", "Content-Type: image/jpeg", "-H", "x-upsert: true", "--data-binary", `@${fichier}`], { encoding: "utf8" });
    return chemin;
  } catch (e) {
    console.error(`Image non copiée (le site utilisera Wikimedia) : ${e.message.split("\n")[0]}`);
    return null;
  }
}
const avecCopie = (compte, o) => {
  if (!o?.image?.url || o.image.chemin) return o;
  const chemin = copierImage(compte, o.id, o.image.url);
  return chemin ? { ...o, image: { ...o.image, chemin } } : o;
};

function verifierDecouverte(r, jour, deja, complet) {
  const titres = new Set(deja.map((e) => `${e.type}|${(e.titre || "").trim().toLowerCase()}`));
  const nouveau = (type, t) => exiger(!titres.has(`${type}|${(t || "").trim().toLowerCase()}`), `${type} : « ${t} » a déjà été proposé`);
  if (complet) exiger(r.fait && r.oeuvre && r.actu, "première découverte du jour : fait, oeuvre et actu sont tous les trois attendus");
  if (r.fait) {
    texteOk(r.fait.titre, "fait.titre"); texteOk(r.fait.texte, "fait.texte");
    for (const k of ["suite", "utile", "matiere"]) if (r.fait[k] !== undefined) texteOk(r.fait[k], `fait.${k}`);
    nouveau("fait", r.fait.titre);
  }
  if (r.oeuvre) {
    const o = r.oeuvre;
    for (const k of ["titre", "auteur", "date"]) texteOk(o[k], `oeuvre.${k}`);
    exiger(["peinture", "litterature", "discours"].includes(o.genre), "oeuvre.genre : peinture, litterature ou discours");
    exiger(Array.isArray(o.points) && o.points.length >= 2 && o.points.length <= 4, "oeuvre.points : 2 à 4 choses à retenir");
    (o.points || []).forEach((t, i) => texteOk(t, `oeuvre.points[${i}]`));
    for (const k of ["lieu", "extrait", "aPlacer", "suite"]) if (o[k] !== undefined) texteOk(o[k], `oeuvre.${k}`);
    exiger(typeof o.programme === "boolean", "oeuvre.programme : true si l'œuvre est liée au programme d'HGGSP, sinon false");
    if (o.genre === "peinture") exiger(o.image, "oeuvre.image : obligatoire pour une peinture (voir image-commons)");
    if (o.image) {
      exiger(/^https:\/\/upload\.wikimedia\.org\//.test(o.image.url || ""), "oeuvre.image.url : une adresse upload.wikimedia.org (voir image-commons)");
      exiger(/^https:\/\/commons\.wikimedia\.org\//.test(o.image.page || ""), "oeuvre.image.page : la page Commons du fichier");
      texteOk(o.image.credit, "oeuvre.image.credit");
      if (o.image.url) exiger(urlRepond(o.image.url), `oeuvre.image.url ne répond pas : ${o.image.url}`);
    }
    nouveau("oeuvre", o.titre);
  }
  if (r.actu) {
    const a = r.actu;
    texteOk(a.titre, "actu.titre"); texteOk(a.texte, "actu.texte");
    if (a.suite !== undefined) texteOk(a.suite, "actu.suite");
    exiger(/^\d{4}-\d{2}-\d{2}$/.test(a.date || ""), "actu.date : date de l'événement, AAAA-MM-JJ");
    const age = joursDepuis(a.date, jour);
    exiger(age >= 0 && age <= 3, `actu.date : l'événement doit dater de 3 jours au plus (ici ${age} j)`);
    const sources = Array.isArray(a.sources) ? a.sources : [];
    const hotes = new Set(sources.map((x) => { try { return new globalThis.URL(x.url).hostname.replace(/^www\./, ""); } catch { return ""; } }));
    exiger(sources.length >= 2 && hotes.size >= 2 && !hotes.has(""), "actu.sources : au moins deux sources de sites différents { nom, url }");
    sources.forEach((x, i) => texteOk(x.nom, `actu.sources[${i}].nom`));
    nouveau("actu", a.titre);
  }
}

const [commande, id, arg] = process.argv.slice(2);
if (commande === "liste") {
  const lignes = requete("GET", "?statut=eq.en_attente&order=cree.asc&select=id,type,titre,texte,meta,cree");
  console.log(JSON.stringify(lignes, null, 2));
} else if (commande === "repondre" && id && arg) {
  const [ligne] = requete("GET", `?id=eq.${id}&select=id,type,statut,meta`);
  if (!ligne) throw new Error(`Demande ${id} introuvable`);
  const reponse = JSON.parse(readFileSync(arg, "utf8"));
  if (ligne.type === "lecon" && ligne.meta?.explication) verifierExplication(reponse);
  else if (ligne.type === "lecon") verifierLecon(reponse);
  else if (ligne.type === "erreurs" && ligne.meta?.bilan) verifierBilan(reponse);
  else if (ligne.type === "erreurs") verifierErreurs(reponse);
  else if (ligne.meta?.note) verifierNote(reponse);
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
} else if (commande === "journal") {
  // Le journal vit dans les données synchronisées de chaque compte (table donnees).
  const depuis = id || "";
  const lignes = requete("GET", "?select=user_id,journal:contenu->journal", undefined, `${PROJET}/rest/v1/donnees`);
  for (const l of lignes) {
    const journal = (l.journal || []).filter((e) => e.date >= depuis);
    if (!journal.length) continue;
    const parCarte = new Map();
    for (const e of journal) {
      const k = `${e.chapitre} | ${e.recto}`;
      const c = parCarte.get(k) || { carte: k, publieId: e.publieId, essais: 0, rates: 0, formes: new Set() };
      c.essais++;
      if (!e.juste) c.rates++;
      c.formes.add(e.forme);
      parCarte.set(k, c);
    }
    const stats = [...parCarte.values()]
      .filter((c) => c.rates > 0)
      .sort((a, b) => b.rates / b.essais - a.rates / a.essais || b.rates - a.rates)
      .map((c) => ({ ...c, formes: [...c.formes].join(",") }));
    console.log(JSON.stringify({
      compte: l.user_id.slice(0, 8),
      reponses: journal.length,
      justes: journal.filter((e) => e.juste).length,
      signalements: journal.filter((e) => e.signal).map(({ chapitre, recto, forme, reponse, attendu, signal, remarque, date }) =>
        ({ chapitre, recto, forme, reponse, attendu, signal, remarque, date })),
      cartesRatees: stats.slice(0, 30),
      reponsesFausses: journal.filter((e) => !e.juste && e.reponse).slice(-40).map(({ chapitre, recto, forme, reponse, attendu }) =>
        ({ chapitre, recto, forme, reponse, attendu })),
    }, null, 2));
  }
} else if (commande === "decouvertes") {
  const jour = jourParis();
  const comptes = requete("GET", "?select=user_id,reglages:contenu->reglages,connues:contenu->connues", undefined, DONNEES)
    .filter((l) => l.reglages?.decouverte === true);
  const sortie = comptes.map((l) => {
    const lignes = lignesDecouverte(l.user_id);
    const duJour = lignes.find((x) => x.meta?.jour === jour);
    const d = duJour?.reponse?.decouverte;
    const connues = new Set(l.connues || []);
    const historique = elementsDe(lignes);
    const oeuvres = historique.filter((e) => e.type === "oeuvre").slice(0, 10);
    return {
      compte: l.user_id,
      jour,
      aCreer: !duJour,
      aRemplacer: d ? ["fait", "oeuvre", "actu"].filter((t) => connues.has(d[t]?.id)) : [],
      oeuvresDuProgrammeSurLesDernieres: `${oeuvres.filter((e) => e.programme).length}/${oeuvres.length}`,
      dejaConnues: historique.filter((e) => connues.has(e.id)).map((e) => `${e.type} · ${e.titre}`),
      historique: historique.map((e) => `${e.jour} · ${e.type} · ${e.titre}${e.auteur ? ` (${e.auteur})` : ""}`),
    };
  });
  console.log(JSON.stringify(sortie, null, 2));
} else if (commande === "decouverte" && id && arg) {
  const jour = jourParis();
  const r = JSON.parse(readFileSync(arg, "utf8"));
  const lignes = lignesDecouverte(id);
  const duJour = lignes.find((x) => x.meta?.jour === jour);
  verifierDecouverte(r, jour, elementsDe(lignes), !duJour);
  if (erreurs.length) {
    console.error("Découverte refusée, à corriger :\n- " + erreurs.join("\n- "));
    process.exit(1);
  }
  const avecId = (type) => {
    if (!r[type]) return r[type];
    const e = { ...r[type], id: `${jour}-${type}-${Math.random().toString(36).slice(2, 7)}` };
    return type === "oeuvre" ? avecCopie(id, e) : e;
  };
  const maintenant = new Date().toISOString();
  if (!duJour) {
    requete("POST", "", {
      user_id: id, type: "lecon", titre: `Découverte du ${jour}`, texte: "Découverte du jour, écrite par la tâche planifiée.",
      meta: { decouverte: true, jour }, statut: "prete", traite: maintenant,
      reponse: { decouverte: { jour, fait: avecId("fait"), oeuvre: avecId("oeuvre"), actu: avecId("actu"), anciens: [] } },
    });
    console.log(`Découverte du ${jour} déposée.`);
  } else {
    const d = { ...duJour.reponse.decouverte, anciens: [...(duJour.reponse.decouverte.anciens || [])] };
    for (const type of ["fait", "oeuvre", "actu"]) {
      if (!r[type]) continue;
      d.anciens.push({ ...d[type], type, remplaceLe: maintenant });
      d[type] = avecId(type);
    }
    requete("PATCH", `?id=eq.${duJour.id}`, { reponse: { decouverte: d }, traite: maintenant });
    console.log(`Découverte du ${jour} : ${["fait", "oeuvre", "actu"].filter((t) => r[t]).join(", ")} remplacé(s).`);
  }
} else if (commande === "recopier-images" && id) {
  // Réparation : copie dans le stockage les images d'œuvres qui n'y sont pas encore.
  for (const l of lignesDecouverte(id)) {
    const d = l.reponse?.decouverte;
    if (!d?.oeuvre?.image || d.oeuvre.image.chemin) continue;
    const oeuvre = avecCopie(id, d.oeuvre);
    if (oeuvre.image.chemin) {
      requete("PATCH", `?id=eq.${l.id}`, { reponse: { decouverte: { ...d, oeuvre } } });
      console.log(`${d.jour} : image copiée (${oeuvre.image.chemin}).`);
    }
  }
} else if (commande === "images-commons" && id) {
  const json = commons({ action: "query", list: "search", srnamespace: "6", srlimit: "10", srsearch: id });
  for (const r of json.query?.search || []) console.log(r.title);
} else if (commande === "image-commons" && id) {
  const titre = id.startsWith("File:") ? id : `File:${id}`;
  const json = commons({ action: "query", titles: titre, prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "960" });
  const page = Object.values(json.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) { console.error(`Fichier introuvable sur Commons : ${titre}`); process.exit(1); }
  const m = info.extmetadata || {};
  const net = (h) => String(h?.value || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  console.log(JSON.stringify({
    // Miniature de 960 px servie par upload.wikimedia.org (tailles admises : 500, 960, 1280, 1920…).
    url: String(info.thumburl || info.url).split("?")[0].replace("https://thumb.wikimedia.org/", "https://upload.wikimedia.org/"),
    page: info.descriptionurl,
    credit: [net(m.Artist), net(m.Credit).slice(0, 60), net(m.LicenseShortName)]
      .filter((x) => x && !/unknown source/i.test(x)).join(" · "),
  }, null, 2));
} else if (commande === "erreur" && id && arg) {
  requete("PATCH", `?id=eq.${id}`, { statut: "erreur", erreur: arg, traite: new Date().toISOString() });
  console.log(`Demande ${id} : marquée en erreur.`);
} else {
  console.error("Usage : liste | repondre <id> <fichier.json> | erreur <id> \"<message>\" | images <id> | journal [AAAA-MM-JJ] | decouvertes | decouverte <compte> <fichier.json> | images-commons \"<mots>\" | image-commons \"<File:…>\"");
  process.exit(2);
}
