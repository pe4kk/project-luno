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
- Niveau : lycée. L'utilisateur est en **Première** (2026-2027) et suit la
  spécialité HGGSP ; ses autres spécialités ne sont pas connues.
- IA : **pas de clé d'API** (il ne veut rien payer en plus de son abonnement
  Claude). Le site n'appelle aucune IA : Claude rédige flashcards, fiches,
  exercices et leçons dans une conversation, puis les publie dans `contenu/`.
- Direction artistique (choisie le 2026-11-10 après plusieurs séries de
  maquettes) : thème clair **« Blush graphique » (M5)** et thème sombre
  **« Nuit cuivrée » (M4)**, avec un bouton pour basculer. Inspiration :
  ses planches rose poudré, cuivre, terracotta et anthracite. Il n'a pas
  retenu les styles monochrome, pop, cahier d'écolier ni gazette.

## Stack et architecture

- Next.js 16 (App Router) en **export statique** (`output: "export"`, pas de
  serveur, pas de `cacheComponents`), React 19, TypeScript, Tailwind CSS 4,
  `motion` (animations), `zustand` (état), `lucide-react`.
- **Next 16 a des changements cassants** : lire la doc embarquée dans
  `node_modules/next/dist/docs/` avant d'utiliser une API Next.
- Polices installées par npm (`@fontsource-variable/outfit`, `fraunces`,
  `caveat`), pas `next/font/google` : Google Fonts n'est pas joignable depuis
  les sessions cloud.
- Toutes les pages sont des composants client. `AppShell` n'affiche le contenu
  qu'après l'hydratation, car les données viennent du `localStorage`.
- Fichiers clés :
  - `app/` : `page.tsx` (accueil), `calendrier/`, `taches/` (onglet « À
    faire »), `travail/`, `apprendre/`, `exercices/` (onglet « S'exercer »).
    Six onglets : c'est le maximum qui tient dans la barre du bas sur
    téléphone. `recherche/` n'est pas un onglet : on y accède par la loupe
    de la barre du haut.
  - `components/AppShell.tsx` : barre du haut (logo, onglets, « Mes données »,
    thème), barre du bas sur téléphone, transition entre pages.
  - `components/Donnees.tsx` : fenêtre « Mes données » (sauvegarde,
    restauration, effacement), message « Annuler », reprise des contenus
    publiés au chargement.
  - `components/ui.tsx` : boutons, cartes, fenêtre (portail, focus piégé),
    `EnvoyerAClaude`, `pluriel()`.
  - `components/travail/` : vue d'un chapitre (cours, flashcards, fiche) et
    séance de révision.
  - `lib/store.ts` : données de l'utilisateur (matières, chapitres, DST) dans
    le `localStorage`, clé `luno-v1`, format version 2 (`normaliser()` reprend
    les anciens formats et les sauvegardes importées). Toute suppression passe
    par `annulation` (message « Annuler » pendant 8 s), jamais par `confirm()`.
  - `lib/contenu.ts` : outils sans IA (repérage des lignes « Terme :
    définition », QCM tirés des flashcards, texte des demandes à Claude).
  - `lib/liens.ts` : l'onglet Travail garde matière, chapitre et sous-onglet
    dans l'adresse (`/travail?m=…&c=…&o=…`, `r=tout` pour la révision du
    jour), pour que le bouton retour du téléphone remonte d'un niveau.
  - `contenu/` : ce que Claude rédige (voir « Ajouter du contenu »).
- Modèle de données (`lib/types.ts`) : un DST liste ses chapitres à réviser
  (`chapitreIds`) ; une flashcard a une échéance (`echeance`, `intervalle`) :
  l'intervalle double à chaque « Je savais » et repart de zéro à chaque
  erreur, y compris une erreur à un QCM tiré de cette carte ; un point de
  fiche porte `n`, la plus petite taille (1 à 5) à laquelle il apparaît, ce
  qui rend le curseur instantané.
- Design : deux thèmes définis par des variables CSS dans `app/globals.css`
  (`:root` = clair M5, `:root[data-theme="dark"]` = sombre M4), exposées à
  Tailwind (`bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `bg-accent`,
  `text-on-accent`, `bg-blush`…). Ne jamais coder `text-white` ou une couleur
  en dur : utiliser ces jetons pour que les deux thèmes fonctionnent.
  - Clair : blush `#f8f1ee`, blanc, anthracite `#2a2a2d`, terracotta
    `#b5573d`, rose `#e6bfb5`, cuivre `#c98b6b`. Sombre : fond `#242426`,
    cartes `#2f2f32`, texte `#f4e7e2`, accent cuivre `#dba283`.
  - Titres en Fraunces (graisse 500), texte en Outfit, touches manuscrites en
    Caveat (classe `font-hand`), petits titres en capitales (classe
    `surtitre`), dégradé cuivré (`copper-bg`, `copper-text`).
  - Le thème choisi est gardé dans `localStorage` (`luno-theme`) et appliqué
    par un script en ligne dans `app/layout.tsx` avant l'affichage.
  - Couleurs de matière : `pastel()` et `var(--mix-fg)` les adaptent au thème.
  Interface entièrement en français, noms de code en français.

## Ajouter du contenu (cours envoyés par l'utilisateur)

L'utilisateur transmet une demande qui commence par `[Luno] Nouveau cours`
ou `[Luno] Nouvelle leçon` : collée dans le chat (bouton « Copier la
demande » du site), ou déposée en ticket GitHub (lire avec
`gh api "repos/pe4kk/project-luno/issues?state=open"`). Il peut aussi envoyer
un PDF ou une photo directement dans le chat.

- **Cours** : ajouter une entrée à `contenu/bibliotheque.ts` au format de
  `contenu/exemple.ts` : `id` stable, `version: 1`, matière (reprendre
  exactement le nom indiqué, la reprise compare les noms), titre du chapitre,
  10 à 20 flashcards, fiche dont chaque point porte `n` de 1 (essentiel) à 5
  (détail), et 15 à 20 exercices variés (types dans `lib/types.ts`) : QCM à
  quatre choix, `vraiFaux`, `trou` (texte avec « ___ », réponses acceptées),
  `ordre` (éléments donnés dans le bon ordre, idéal pour les chronologies),
  `ouverte` (question et corrigé, l'élève s'auto-évalue). Une série pioche
  tour à tour dans chaque type. Rester
  fidèle au cours fourni, niveau lycée. Pour corriger un chapitre publié,
  augmenter `version`.
- **Leçon** : ajouter une entrée à `contenu/lecons.ts` (étapes courtes, un
  exemple, une question « Vérifie-toi » par étape).
- Ses anciennes fiches faites dans d'autres conversations sont des documents
  Claude Docs visibles avec l'outil Artifact (`action: list`), à lire avec le
  connecteur Claude Docs. Déjà repris : « HGGSP Thème 4 » (fiches courtes et
  complètes) dans `contenu/hggsp-theme4.ts` ; « Rimbaud, Cahiers de Douai »
  dans `contenu/francais-rimbaud.ts`. Pas encore repris, à proposer : « La
  cellule » (SVT), « Éléments chimiques & cristaux », « Dilution et
  absorbance », carnet de vocabulaire EN·ES.
- **Tâches (« À faire »)** : elles vivent dans le navigateur de l'utilisateur,
  Claude ne peut pas y écrire. Quand il dicte ses tâches dans le chat, lui
  répondre par une liste propre (une tâche par ligne, dans un bloc de code)
  qu'il colle dans l'onglet avec « Coller une liste ».
- **Calendrier du lycée** : `contenu/calendrier.ts` contient les DST de
  Première 2026-2027 relevés sur une photo du document du lycée (sans les
  heures). Relevé revérifié le 2026-11-10 sur la photo agrandie, ligne par
  ligne : dates et durées conformes. Les DST de Première tombent le jeudi ;
  les autres jours sont des rattrapages, oraux blancs ou semaine de bac blanc. Chaque utilisateur choisit ses matières dans la page Calendrier ;
  les DST repris ont un identifiant `cal-<rang>` : ne pas réordonner la liste,
  ajouter à la fin, sinon les ajouts des utilisateurs (heure, chapitres liés)
  se décalent. Les EAF de juin n'y sont pas, faute de date.
- Pousser sur `main` : le site se redéploie et chaque navigateur reprend le
  nouveau contenu à la visite suivante. Tout le monde le reçoit.
- Fermer le ticket GitHub correspondant si la demande en venait.

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
- `npm run build` : génère le site statique dans `out/`. Pour le tester :
  `cd out && python3 -m http.server 3210`.
- `npm run lint` et `npx tsc --noEmit` : vérifications.
- Vérification visuelle : script Playwright qui charge l'exemple et parcourt
  tous les onglets (à réécrire au besoin, il n'est pas dans le dépôt). Toujours
  vérifier aussi en téléphone (`devices['iPhone 13']`) : la barre du bas est
  fixe, donc tout bouton d'action doit rester visible au-dessus d'elle.

## Mise en ligne

- Adresse prévue : https://pe4kk.github.io/project-luno/ (GitHub Pages,
  branche `gh-pages`, dossier racine).
- `.github/workflows/deployer.yml` reconstruit le site et remplace la branche
  `gh-pages` à chaque push sur `main` (build avec `GITHUB_PAGES=true`, qui
  active le préfixe `/project-luno`). Rien à faire à la main.
- GitHub Pages s'est activé tout seul au premier push de `gh-pages`
  (2026-11-10) et les déploiements sont passés au vert (`gh run list`).
  L'adresse `github.io` n'est pas joignable depuis une session cloud : seul
  l'utilisateur peut confirmer que la page s'affiche. Non confirmé à ce jour.

## Décisions prises

| Date | Décision | Raison |
|------|----------|--------|
| 2026-11-10 | Mémoire du projet tenue dans `CLAUDE.md` à la racine | Chargé automatiquement à chaque session |
| 2026-11-10 | Données personnelles dans le navigateur (`localStorage`), avec sauvegarde et restauration par fichier | Pas de comptes pour l'instant |
| 2026-11-10 | Pas d'API payante : Claude rédige les contenus et les publie dans `contenu/` | Choix de l'utilisateur, pour ne rien payer en plus |
| 2026-11-10 | Site statique sur GitHub Pages, déploiement automatique | Gratuit, pas de serveur à gérer |
| 2026-11-10 | Suppression annulable plutôt que demande de confirmation | Critique de design, « corrige tout » demandé par l'utilisateur |

## État d'avancement

- 2026-11-10 : site complet en ligne, deux thèmes, vérifié dans un navigateur
  sur ordinateur et en émulation iPhone 13 (aucune erreur) :
  - Accueil : prochain DST avec bouton « Réviser » vers le chapitre lié,
    cartes à revoir aujourd'hui, matières, bandeau pour effacer l'exemple.
  - Calendrier : toucher un jour ouvre le détail du jour ; DST liés à des
    chapitres ; suppression annulable.
  - Travail : matières et chapitres modifiables ; cours ; flashcards
    modifiables avec répétition espacée ; fiche à curseur instantané.
  - Apprendre : leçons rédigées (une leçon de démonstration, la
    photosynthèse) et formulaire de demande.
  - S'exercer : exercices rédigés, sinon QCM tirés des flashcards.
  - « Mes données » : sauvegarde, restauration, effacement.
  - Installable sur l'écran d'accueil du téléphone ; icône croissant cuivré.
- Suite à une critique de design (2026-11-10), tous les points relevés ont
  été corrigés. Rien n'a été testé avec de vrais utilisateurs ni sur un vrai
  téléphone.
- Contenus publiés : HGGSP Première, thème 4 (introduction, axe 1, axe 2 :
  64 flashcards, 27 exercices, fiches à cinq tailles). Le prochain DST de
  HGGSP est le 19/11/2026 ; rien ne dit qu'il porte sur ce thème.
- Français Première : Rimbaud, Cahiers de Douai (30 flashcards, 12
  exercices, fiche à cinq tailles).
- Calendrier des DST de Première 2026-2027 disponible à l'import (47 dates).
- Onglet « À faire » (`app/taches/`, 2026-11-10) : ajout direct, collage
  d'une liste, cocher et décocher, échéance facultative, aperçu à l'accueil.
- 2026-11-11 : barre d'onglets mobile redessinée (fond translucide, pastille
  cuivrée qui glisse), page Recherche (sans accents ni casse, dans tout le
  contenu), exercices variés (cinq types), matières sur deux colonnes sur
  téléphone.
- Idées proposées le 2026-11-10 et pas encore demandées : planning de
  révision automatique avant un DST, export des DST vers le calendrier du
  téléphone, vacances scolaires, notes et moyennes, flashcards inversées,
  mode DST blanc, espace bac de français, impression PDF, hors connexion.
- Pas encore fait : comptes, synchronisation entre appareils, tests
  automatisés dans le dépôt.

## Prochaines étapes

1. Proposer de reprendre ses autres fiches existantes (voir « Ajouter du
   contenu ») et traiter les nouveaux cours qu'il envoie.
2. Obtenir sa confirmation que le site en ligne s'affiche bien sur son
   téléphone, et ses retours.
3. À trancher avec lui : tâche planifiée qui traite seule les tickets GitHub
   en attente ; comptes pour synchroniser entre appareils.

## Préférences de l'utilisateur

_À remplir au fil des conversations._
