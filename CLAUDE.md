# Project Luno — mémoire du projet

Ce fichier est chargé automatiquement au début de chaque session Claude Code
ouverte sur ce dépôt. Il sert de mémoire entre les conversations.

## Règles de tenue de ce fichier (pour Claude)

- Lire ce fichier en entier avant de commencer à travailler.
- Le mettre à jour à chaque décision importante, changement d'architecture ou
  étape terminée, puis commiter et pousser : la session est éphémère, ce qui
  n'est pas poussé est perdu.
- Rester concis : état actuel et décisions, pas l'historique détaillé (git le
  garde). Remplacer les informations périmées au lieu d'en empiler.
- Ne jamais y écrire de secret (clé d'API, mot de passe, jeton) : le dépôt est
  public.
- Parler français avec l'utilisateur.

## Objectif du projet

Site web d'aide au travail scolaire, pour la France, fonctionnant en grande
partie par IA. Exigence forte : un site très beau et très fluide, avec de
jolies pages et des transitions soignées.

Onglets prévus (description de l'utilisateur du 2026-11-10) :

- **Calendrier** : tous les DST (devoirs sur table) de l'utilisateur.
- **Travail** : liste de matières ; dans chaque matière, des chapitres ; dans
  chaque chapitre, le cours envoyé par l'utilisateur, des flashcards générées
  par IA sur les définitions, et des fiches de révision dont on choisit la
  taille avec un slider.
- **Apprendre** : apprendre un sujet au choix avec un tuteur IA, dans l'esprit
  du skill « Learn » de Claude.
- **S'exercer** : exercices générés et corrigés par IA.

Interprétations de Claude à confirmer : « fifs » dans le message dicté =
fiches de révision ; le slider règle la longueur de la fiche.

## Réponses de l'utilisateur (2026-11-10)

- Utilisateurs : lui et des amis, chacun avec son compte (pas un produit public).
- Niveau : lycée (seconde, première, terminale).
- IA : **pas de clé d'API** (il ne veut rien payer en plus de son abonnement
  Claude). À la place, il envoie ses cours dans le chat Claude Code et Claude
  rédige lui-même flashcards, fiches et exercices, puis les ajoute au site.
  Conséquence : le site n'appelle aucune IA ; le tuteur en direct de l'onglet
  Apprendre n'est pas possible sous cette forme.
- Direction artistique : quatre maquettes proposées le 2026-11-10 (A Nuit
  lunaire, B Papier & encre, C Pop coloré, D Minimal clair), en plus du design
  actuel (crème et bleu nuit). L'utilisateur a retenu la famille « Papier &
  encre » (B : crème, serif Fraunces, rouge vermillon, traits fins) et a
  demandé des variantes, proposées le même jour : B1 Cahier d'écolier
  (réglure Seyès, encre bleue, écriture manuscrite Caveat), B2 Gazette (têtière
  de journal, Playfair Display, noir et rouge), B3 Ardoise & craie (tableau
  vert sombre, craie jaune), B4 Édition classique (EB Garamond, double filet
  rouge, sommaire à points de conduite).
  Il a ensuite envoyé quatre planches d'inspiration (gris, noir et blanc avec
  textures et motif chevron ; rose poudré, cuivre, terracotta, gris doux) et
  demandé des maquettes dans ces couleurs, proposées le même jour :
  P1 Encre & pierre (monochrome, capitales espacées, chevrons), P2 Rose poudré
  & cuivre (blush `#f8f1ee`, cuivre `#c98b6b`, gris chaud `#4b4648`, formes
  arrondies), P3 Terracotta & collage (terracotta `#b5573d`, noir `#1f1a1a`,
  papiers inclinés, manuscrit), P4 Anthracite & blush (anthracite `#2a2a2d`,
  blush `#e6bfb5`, aplats carrés). Choix final en attente.

## Stack et architecture

- Next.js 16 (App Router, `cacheComponents`), React 19, TypeScript,
  Tailwind CSS 4, `motion` (animations), `zustand` (état), `lucide-react`.
- **Next 16 a des changements cassants** : lire la doc embarquée dans
  `node_modules/next/dist/docs/` avant d'utiliser une API Next.
- Polices installées par npm (`@fontsource-variable/geist` et
  `bricolage-grotesque`), pas `next/font/google` : Google Fonts n'est pas
  joignable depuis les sessions cloud.
- Toutes les pages sont des composants client. `AppShell` n'affiche le contenu
  qu'après l'hydratation, car les données viennent du `localStorage`.
- Fichiers clés :
  - `app/` : `page.tsx` (accueil), `calendrier/`, `travail/`, `apprendre/`,
    `exercices/` (onglet « S'exercer »).
  - `components/AppShell.tsx` : barre latérale, barre du bas sur téléphone,
    transition entre pages. `components/ui.tsx` : boutons, cartes, fenêtres.
  - `components/travail/` : vue d'un chapitre (cours, flashcards, fiche) et
    séance de révision.
  - `lib/store.ts` : toutes les données (matières, chapitres, DST), stockées
    dans le `localStorage` du navigateur sous la clé `luno-v1`.
  - `lib/ai.ts` : **seul point d'entrée de l'IA**, aujourd'hui en mode démo
    (règles simples : repère les lignes « Terme : définition »). Pour brancher
    la vraie IA, remplacer le corps de ses fonctions par des appels à des
    routes serveur, sans changer les signatures, et passer `MODE_IA` à `reel`.
  - `lib/seed.ts` : données d'exemple (bouton « Charger l'exemple »).
- Design : fond crème, barre latérale bleu nuit, accent violet `#5b4bdb`, lune
  dorée ; une couleur par matière ; thème défini dans `app/globals.css`.
  Interface entièrement en français, noms de code en français.

## Environnement

- Sessions cloud Claude Code, dépôt `pe4kk/project-luno`, branche `main`
  (on pousse directement sur `main`, l'utilisateur travaille seul).
- Environnement cloud dédié : **`project-luno`** (créé le 2026-11-10), à
  sélectionner au lancement de chaque nouvelle session. Réseau limité aux
  registres de paquets ; son script de démarrage lance `npm ci` dans le dépôt.
  Le script n'a pas encore été éprouvé sur une session neuve : si
  `node_modules` est absent au démarrage, lancer `npm ci` à la main et le
  signaler.

## Commandes utiles

- `npm run dev` : serveur de développement (port 3000).
- `npm run build` puis `npx next start -p 3210` : version de production.
- `npm run lint` et `npx tsc --noEmit` : vérifications.
- Pour arrêter le serveur : `pkill -f next-server` (sinon l'ancien continue de
  répondre sur le port).
- Vérification visuelle : script Playwright qui charge l'exemple et parcourt
  tous les onglets (à réécrire au besoin, il n'est pas dans le dépôt).

## Décisions prises

| Date | Décision | Raison |
|------|----------|--------|
| 2026-11-10 | Mémoire du projet tenue dans `CLAUDE.md` à la racine | Chargé automatiquement à chaque session |
| 2026-11-10 | Données dans le navigateur (`localStorage`) pour l'instant | Interface d'abord ; comptes et base en ligne viendront ensuite |
| 2026-11-10 | IA isolée dans `lib/ai.ts`, en mode démo | Pas encore de clé d'API ; branchement futur sans toucher aux pages |
| 2026-11-10 | Exercices en démo = QCM tirés des flashcards | Fonctionne sans IA |
| 2026-11-10 | Pas d'API payante : Claude rédige les contenus dans le chat | Choix de l'utilisateur, pour ne rien payer en plus |

## État d'avancement

- 2026-11-10 : première version de l'interface, vérifiée dans un navigateur
  (ordinateur et téléphone, aucune erreur console) :
  - Accueil : compte à rebours du prochain DST, chiffres, raccourcis.
  - Calendrier : grille mensuelle, ajout, modification et suppression de DST.
  - Travail : matières, chapitres, cours (saisie ou import .txt/.md),
    flashcards (génération démo, ajout manuel, révision avec cartes qui se
    retournent), fiche avec curseur de taille à 5 crans.
  - Apprendre : choix du sujet et du niveau, parcours en 4 étapes, discussion
    avec le tuteur (réponses d'exemple).
  - S'exercer : QCM avec correction et score.
- Pas encore fait : vraie IA, comptes, base de données en ligne, mise en
  ligne du site, import de PDF ou de photos, thème sombre, tests automatisés.

## Prochaines étapes

1. Appliquer la direction artistique choisie par l'utilisateur à tout le site.
2. Passer au fonctionnement sans API : contenus rédigés par Claude et stockés
   dans le dépôt (piste de Claude, non validée : un dossier `contenu/` avec un
   fichier par chapitre, lu par le site), à la place du mode démo de
   `lib/ai.ts`. Repenser l'onglet Apprendre (leçons rédigées à la demande).
3. Mise en ligne du site pour l'utilisateur et ses amis (piste : Vercel).
4. Calendrier et progression propres à chaque ami : à trancher (comptes ou
   simple stockage dans le navigateur de chacun).

## Préférences de l'utilisateur

_À remplir au fil des conversations._
