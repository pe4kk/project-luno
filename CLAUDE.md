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
- Niveau : lycée. L'utilisateur est en **Première** (2026-2027) ; spécialités
  connues : HGGSP et physique-chimie (la troisième n'est pas connue).
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
    téléphone. Une grille ou une rangée trop large sur téléphone fait dézoomer
  toute la page et coupe le bas des fenêtres : les tests doivent comparer
  `innerWidth` à `visualViewport.width`. Tester aussi à 260–320 px : le zoom
  « aA » de Safari ou le zoom d'affichage de l'iPhone rétrécissent la page
  (le 2026-11-12, les cartes de l'accueil débordaient chez lui). `recherche/` n'est pas un onglet : on y accède par la loupe
    de la barre du haut.
  - `components/AppShell.tsx` : barre du haut (logo, onglets, « Mes données »,
    thème), barre du bas sur téléphone, transition entre pages. Sur grand
    écran (2xl, ≥ 1536 px), contenu jusqu'à 1920 px et **panneau
    « Aujourd'hui »** à droite (`components/PanneauJour.tsx` : prochain DST,
    semaine, tâches, cartes à revoir), choisi le 2026-11-11 (« A+B aligné »).
    Son titre s'aligne sur le premier bloc de la page (`data-aligne-panneau`,
    sinon ce qui suit `data-entete`) ; une page étroite et le panneau sont
    centrés ensemble ; sur le calendrier, le panneau est la 3e colonne, aligné
    sur « À venir » ; pas de panneau sur l'accueil. Téléphone et portables
    inchangés.
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
  - **Synchronisation** (choisie le 2026-11-11 : comptes Supabase, tout
    synchroniser) : `lib/synchro.ts` (connexion adresse + mot de passe, une
    ligne `donnees` par compte, envoi 1 s après chaque modification, réception
    en direct et au retour sur l'onglet, attente hors connexion),
    `lib/fusion.ts` (`alleger()` retire le contenu publié avant l'envoi,
    `regonfler()` le remet ; `fusionner()` réunit deux appareils : matières par
    nom, chapitres par `publieId`, cartes par recto, en gardant la meilleure
    progression), `components/Synchro.tsx` (section dans « Mes données »,
    pastille sur le bouton). Table et règles RLS : `supabase/schema.sql`.
    Projet Supabase de l'utilisateur : `jexdghinuyirmyebfxvp` (offre
    gratuite, pause après 7 jours sans visite). Son adresse et sa clé
    publiable (`sb_publishable_…`) sont dans `lib/synchro.ts` : pas secrètes.
    Ne jamais écrire la clé secrète (`sb_secret_…`) nulle part. L'environnement
    `project-luno` autorise ce serveur, ce qui permet de tester pour de vrai
    (testé le 2026-11-11 : fusion, envoi, hors connexion, direct).
  - **Demandes traitées automatiquement** (demandé le 2026-11-11) : depuis la
    fenêtre « Envoyer à Claude » (leçon dans Apprendre, cours d'un chapitre),
    un compte connecté écrit une ligne dans la table `demandes`
    (`lib/demandes.ts`). Une tâche planifiée (session neuve, environnement
    `project-luno`, `CRON_TZ=Europe/Paris 7 6,13,18,20 * * *`, 6 h au lieu de 8 h depuis le 2026-11-12) les traite avec
    `node scripts/demandes.mjs liste | repondre <id> <fichier.json> | erreur`.
    La réponse va dans la ligne (format `Lecon` ou `ChapitrePublie`, mêmes
    règles de rédaction et de notation que `contenu/`) : rien n'est poussé
    sur `main`, c'est personnel. Le site affiche les leçons prêtes dans
    Apprendre (« rédigée pour toi ») et reprend les cours prêts dans le
    chapitre (`importerPublie`, id `dem-<id>`). La clé secrète Supabase est
    un secret réseau de l'environnement (en-tête `apikey`), jamais dans le
    dépôt. Tâche planifiée : `trig_01WDyj9wkFnJJNcpE5iopcLG` (créée le
    2026-11-11 ; elle démarre sans dépôt attaché et doit le cloner). Dans cet
    environnement, le proxy met la clé secrète sur toutes les requêtes vers
    Supabase, y compris celles du navigateur de test : pour tester le site,
    utiliser le faux serveur local (Supabase refuse une clé secrète venant
    d'un navigateur).
  - **Photos, PDF et « Mes erreurs »** (2026-11-11) : `PiecesJointes`
    (`components/ui.tsx`, boutons « Prendre une photo » et « Photo ou PDF »),
    visible directement dans le formulaire d'Apprendre, la carte « Mes erreurs »
    et la fenêtre d'envoi ; jusqu'à 20 fichiers, photos compressées dans le
    navigateur (1568 px, JPEG), PDF tels quels (20 Mo), rangés dans le stockage
    privé `demandes` (`<compte>/<demande>/n.jpg|pdf`) ; la tâche
    les récupère avec `node scripts/demandes.mjs images <id>` puis les lit.
    Chaque matière a deux onglets, « Chapitres » et « Mes erreurs »
    (`components/travail/Erreurs.tsx`, `?o=erreurs`) : la fiche des erreurs
    d'anciennes évaluations (`erreurs` dans les données, synchronisées), à
    relire avant chaque évaluation, alimentée à la main ou par une demande
    `erreurs` (photos de la copie corrigée, conseils du prof) dont la réponse
    est `{ erreurs: [{ titre, erreur, correction, conseil, chapitre, source }] }`.
  - `components/Curseur.tsx` (2026-11-11, « sliders plus fluides ») : tous les
    curseurs passent par lui. Le bouton suit le doigt en continu (`step`
    0,001), la valeur entière change à mi-cran, et au lâcher il glisse jusqu'au
    cran ; le clavier avance d'un cran. Les points de fiche ne sont plus
    montés et démontés : ils se replient en CSS (classe `repli`, grille
    `0fr ↔ 1fr`), sans `layout` de motion, qui saccadait.
  - **Fluidité sur téléphone** (2026-11-11) : n'animer que `opacity` et
    `transform`. Avec motion, écrire `transform: "translate3d(…)"` plutôt que
    `x` / `y` / `scale` (animés image par image sur le fil principal), et ne
    pas mettre `layout` sur les listes (gardé seulement pour l'exercice
    « ordre »). Les pastilles d'onglets passent par `usePastille()`
    (`lib/pastille.ts`) : mesure FLIP puis `element.animate`, l'onglet actif
    porte `data-actif`. Pas de `backdrop-filter` plein écran (fenêtres) ; la
    barre du bas garde un flou léger (`backdrop-blur-md`).
  - **S'exercer, quatre modes** (2026-11-12, choisis parmi 4 maquettes : A, C,
    D) : « Série » (exercices rapides), « Problèmes » (A : situation réelle
    rédigée étape par étape, l'élève compare à `attendu` et coche le barème
    `criteres`, `components/exercices/Probleme.tsx`), « Calculs » (C : valeurs
    tirées à chaque version, vérifie valeur, unité et chiffres significatifs,
    `Calcul.tsx`, `lib/calcul.ts`), « Interro blanche » (D : questions de cours
    tirées de l'onglet Déf + calculs, chrono 30 min / 1 h ou sans, correction
    seulement à la remise, auto-notation des questions de cours, note sur 20,
    erreurs envoyées dans « Mes erreurs », `Interro.tsx`). Types `Probleme` et
    `Calcul` dans `lib/types.ts`, champs `problemes` et `calculs` d'un
    chapitre ; contenu de physique dans `contenu/physique-entrainement.ts`
    (3 problèmes, 6 calculs ; rien du DM). Dans un `Calcul`, `{nom}` = valeur
    tirée, `{resultat}` = résultat ; `formule` en syntaxe simple (`m * v / dt`,
    conversions écrites en nombres dans la formule) ; éviter les bornes qui
    changent le nombre de c.s (« 0,8 », « 100 »).
  - **Saisie de formules au téléphone** (`components/SaisieFormule.tsx`,
    `lib/saisie.ts`) : raccourcis tapés (`del` → Δ, `sig` → Σ, `*` → ·, `^2` →
    ², `^-1` → ⁻¹, `=>` → ⇒, `->` → →, `<=` → ≤, `!=` → ≠, `~=` → ≈, `sqrt` → √,
    `pi` → π, `rho` → ρ), barre de touches (Δ, Σ, flèche de vecteur, fraction,
    ², ⁻¹, ·, ×10^, √, ⇒) et aperçu dessiné : `a/b` ou `(a+b)/(2c)` s'affiche
    en vraie fraction (`versNotation`), les unités comme m/s restent en ligne.
    Seulement dans les matières scientifiques (`estScientifique()` dans
    `lib/saisie.ts`, demandé le 2026-11-12) : ailleurs, texte simple. « del » et
    « sig » ne sont remplacés qu'après la lettre suivante, si elle ne continue
    pas un mot (« au-delà », « signe » restent intacts).
  - **Dictée vocale** (2026-11-12) : `components/Dictee.tsx` (`ZoneDictee`,
    zone de texte avec un bouton micro ; reconnaissance vocale du navigateur,
    `fr-FR`, gratuite, sans clé). Dans le cours d'un chapitre, « Ce qui te
    bloque » (Apprendre), les notes de « Mes erreurs » et le champ « Tes
    consignes pour Claude » de la fenêtre d'envoi, ajouté à la demande en
    « Mes consignes : … » (la tâche planifiée les suit pour la forme du
    contenu). Sans reconnaissance (Firefox, certaines apps de l'écran
    d'accueil), message : utiliser le micro du clavier. Pas encore essayé sur
    son vrai iPhone.
  - **Lettres françaises sur ordinateur** (2026-11-12, clavier QWERTY) :
    `components/Accents.tsx`, monté dans `AppShell`. Barre en bas de l'écran
    dès qu'un champ de texte a le focus, seulement avec une souris
    (`hover: hover` et `pointer: fine`) : é è ê ë à â ç ù û ü î ï ô œ æ « » ’ …,
    touche Maj (ou Shift tenu). Insertion par `execCommand("insertText")`, qui
    garde Ctrl+Z et passe par le `onChange` de React ; les touches ne prennent
    jamais le focus (marche aussi dans les fenêtres).
  - **Bilan d'interro blanche par Claude** (2026-11-12) : bouton « Demander un
    bilan à Claude » sur la copie corrigée (`Interro.tsx`), texte complet
    (questions, réponses, texte du cours, notes). La table n'accepte que trois
    types : le bilan passe par le type `erreurs` avec `meta.bilan: true` et
    `meta.matieres` (pas de SQL à lancer). Réponse `{ bilan: { resume,
    pointsForts, aRetravailler, conseils }, erreurs: [{ …, matiere }] }`,
    vérifiée par `verifierBilan()` dans `scripts/demandes.mjs` ; les erreurs
    vont dans « Mes erreurs » de leur matière, le bilan s'affiche sous « Tes
    bilans » dans l'onglet Interro blanche.
  - **Encadrer, souligner, surligner** (2026-11-12, idées 1 et 3 choisies sur
    maquettes) : notation `[[encadré]]`, `__souligné__` (exactement deux « _ »,
    pour ne pas toucher aux trous « ___ »), `==surligné==`, dessinée par
    `formule()` partout (classes `encadre`, `souligne`, `surligne`), retirée
    par `sansMiseEnForme()`. Dans `SaisieFormule`, une sélection fait
    apparaître une bulle « Encadrer / Souligner / Surligner » sous le champ
    (au-dessus, le menu de l'iPhone la cacherait ; la sélection est suivie par
    `selectionchange`), touche ▢ dans la barre. Problèmes : `encadrer: true`
    sur une étape = le prof attend un résultat encadré ; Luno le vérifie
    (`aEncadre()`) et le dit, **sans jamais compter dans la note** (demandé :
    c'est un réflexe à prendre). Ne pas mettre « encadré » dans `criteres`.
    Dans `attendu`, écrire le résultat entre `[[ ]]`.
  - **Brouillon** (2026-11-12, idées B et C) : `components/Brouillon.tsx`,
    `<AvecBrouillon cle cs versAN>` autour des quatre lecteurs de S'exercer.
    Onglets Dessin (toile à petits carreaux : stylo sensible à la pression du
    stylet, surligneur, flèche droite, gomme, 4 couleurs du thème, annuler,
    tout effacer), Notes, Calculatrice (`evaluer()` de `lib/calcul.ts`, Ans,
    historique, arrondi au nombre de c.s choisi, « Mettre … dans l'A.N. »
    pour les calculs). Téléphone : feuille qui glisse du bas, en portail sur
    `body` (sinon la barre du bas passe devant), bouton rond au-dessus de la
    barre. Ordinateur (≥ 1024 px) : panneau collant à droite de la question.
    Un brouillon par question, en mémoire seulement, jamais noté ; une nouvelle
    séance repart d'une feuille blanche.
    Les touches de la calculatrice écrivent au curseur (vu sur son iPhone le
    2026-11-12 : elles écrivaient toujours à la fin) ; en-tête en icônes seules
    sous 420 px. Touche fraction a⁄b (insère « ()÷() », curseur dans le
    numérateur ; une sélection devient le numérateur), aperçu dessiné de la
    fraction au-dessus du résultat, C dans le coin de l'écran de calcul.
  - **Suite de la critique de design du 2026-11-12** (« corrige » demandé) :
    - Révision du jour avec quota (`lib/revision.ts`, `revisionDuJour()`) :
      toutes les cartes déjà vues qui reviennent + 20 nouvelles au plus par jour
      (`QUOTA_NOUVELLES`), chapitres des prochains DST d'abord ; compteur `jour`
      (nouvelles vues, cartes revues) dans le store, persisté, par appareil.
      Accueil, panneau du jour, badges des matières et des chapitres et
      `/travail?r=tout` l'utilisent ; dans un chapitre, on peut tout revoir.
    - Prochain DST (accueil) : liste des chapitres au programme, bouton « Faire
      une interro blanche » (`/exercices?mode=interro&dst=<id>`, chapitres
      cochés d'avance) et « Revoir ses N cartes » (`/travail?r=<id du DST>`).
      Carte « DST cette semaine » au lieu du total.
    - S'exercer : chapitres triés par prochain DST (`trierParDst()`, badge
      « DST J-4 »), barre « Commencer » collée au-dessus de la barre d'onglets
      sur téléphone (`components/exercices/BarreAction.tsx`) ; plus de bouton
      désactivé : un message dit ce qui manque.
    - Chapitre publié : onglet Cours replié derrière « Ajouter mes notes »,
      sans « Envoyer à Claude » ni « Flashcards rapides ». Titre plus petit sur
      téléphone, titre de la fiche masqué sur téléphone (déjà en haut).
    - Accueil : matières sans chapitre repliées sous « N matières sans
      chapitre ». Titres de chapitres sur deux lignes au lieu d'être coupés.
    - Boutons d'ajout jamais grisés : champ `required`, le navigateur dit ce
      qui manque. Tout au « tu ».
  - `components/MiseAJour.tsx` : message « Nouvelle version de Luno —
    Recharger » quand `version.json` (écrit à chaque build par
    `next.config.ts`, hash du commit) diffère de la version chargée. Ajouté le
    2026-11-11 : son iPhone gardait l'ancienne version (cache de 10 min de
    GitHub Pages, app de l'écran d'accueil restée ouverte).
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
  - Changement de thème (`changerTheme()` dans `AppShell.tsx`, 2026-11-11) :
    sur ordinateur, le nouveau thème s'ouvre en cercle depuis le bouton (View
    Transitions) ; sur téléphone, fondu enchaîné (le cercle en `clip-path`
    était saccadé sur iPhone, il redessine toute la page à chaque image) ;
    sinon les couleurs glissent (classe `theme-glisse`). Le logo (disque
    blush + disque anthracite décalé) fait un tour en passant par la pleine
    lune, avec un halo cuivré, en animations natives (`element.animate`,
    transform et opacity seulement), décalé pour attendre le cercle. Sur
    téléphone, n'animer que transform et opacity.
    Pour filmer une animation, ralentir la page (`Animation.setPlaybackRate`
    et `requestAnimationFrame`) : les captures sont trop lentes sinon.
  - Couleurs de matière : `pastel()` et `var(--mix-fg)` les adaptent au thème.
  - Emoji de matière : toujours par `<Emoji e={…} />` (`components/Emoji.tsx`),
    qui dessine les drapeaux 🇬🇧 (LVA) et 🇪🇸 (LVB) en SVG, car Windows ne les
    affiche pas.
  - `html` et `body` ont `overflow-x: clip` : le glissement d'entrée d'une page
    (24 px) faisait dézoomer le téléphone.
  Interface entièrement en français, noms de code en français.

## Ajouter du contenu (cours envoyés par l'utilisateur)

L'utilisateur transmet une demande qui commence par `[Luno] Nouveau cours`
ou `[Luno] Nouvelle leçon` : collée dans le chat (bouton « Copier la
demande » du site), ou déposée en ticket GitHub (lire avec
`gh api "repos/pe4kk/project-luno/issues?state=open"`). Il peut aussi envoyer
un PDF ou une photo directement dans le chat.

- **Cours** : ajouter une entrée à `contenu/bibliotheque.ts` au format de
  `contenu/physique-mouvement.ts` : `id` stable, `version: 1`, matière (reprendre
  exactement le nom indiqué, la reprise compare les noms), titre du chapitre,
  `definitions` (onglet « Déf », entre Cours et Flashcards : toutes les
  définitions, propriétés, théorèmes, lois, formules et méthodes du cours,
  recopiées mot pour mot dans l'ordre du cours, format `DefinitionCours`,
  modèles dans `contenu/definitions.ts`), 10 à 20 flashcards, fiche dont chaque
  point porte `n` de 1 (essentiel) à 5 (détail), et 15 à 20 exercices variés (types dans `lib/types.ts`) : QCM à
  quatre choix, `vraiFaux`, `trou` (texte avec « ___ », réponses acceptées),
  `ordre` (éléments donnés dans le bon ordre, idéal pour les chronologies),
  `ouverte` (question et corrigé, l'élève s'auto-évalue). Une série pioche
  tour à tour dans chaque type. **Notation des formules**
  (`components/Formule.tsx`) : vecteur = flèche combinante U+20D7 après la
  lettre (« v⃗ᵢ », « MM'⃗ »), dessinée en SVG ; fraction =
  `{{numérateur // dénominateur}}` (sans parenthèses autour), affichée
  superposée ; indice en lettres = `v_f`, aussi après une flèche (`R⃗_N`,
  `F⃗_A→B`) ou une lettre grecque (`ρ_fluide`). Ne pas utiliser ces notations dans
  les réponses acceptées d'un `trou`. Tout nouvel affichage de contenu doit
  passer par `formule()`, et tout texte brut (aria-label…) par `texteBrut()`.
  Les unités restent en ligne (m·s⁻¹, N/kg). Une nouvelle `version` met à jour
  le verso et le schéma des flashcards déjà reprises, en gardant la progression.
  **Schémas** (demandé le 2026-11-11 : il les trouve essentiels pour
  comprendre) : redessiner les schémas des PDF du prof, minimalistes, en
  données (`Schema` dans `lib/types.ts`, dessiné par `components/Schema.tsx`) :
  `fleche`, `point` (rond ou croix de chronophotographie), `trait` (courbe
  lissée), `cercle`, `rect`, `texte` (`main: true` = annotation manuscrite),
  `axes`, `sol`, `ressort`. On les met sur un point de fiche (`schema`), une
  flashcard (affiché avec la réponse) ou une étape de leçon. Couleurs :
  vitesses en `encre`, Δv⃗ en `accent`, forces en `cuivre`, constructions en
  `doux`. Ceux de physique sont dans `contenu/schemas-physique.ts` (21
  schémas). Toujours les vérifier en capture, clair et sombre, ordinateur et
  téléphone : les textes manuscrits débordent vite. **PDF du prof** : les copier dans
  `public/documents/<matière>/` et les déclarer dans `documents` du chapitre ;
  ils sont publics (le dépôt l'est). Rester
  fidèle au cours fourni, niveau lycée. Pour corriger un chapitre publié,
  augmenter `version`.
- **Leçon** : ajouter une entrée à `contenu/lecons.ts` (étapes courtes, un
  exemple, une question « Vérifie-toi » par étape).
- Contenus publiés : `hggsp-theme4.ts`, `francais-rimbaud.ts`,
  `physique-mouvement.ts`, `physique-methode.ts` (fiche « Rédiger comme ton
  prof l'attend » et leçon guidée du même nom), `maths-derivation.ts`
  (chapitre et leçon guidée ; schémas calculés dans `schemas-maths.ts`). **Méthodes** (demandé le 2026-11-12 : dans Apprendre, pas dans Travail) :
  leçons avec `methode: true`, rangées sous « Méthodes » dans Apprendre, avec
  `documents` (PDF du prof, affichés au début) et `entrainement` (lien de fin vers
  S'exercer). `hggsp-methode.ts` : « L'étude critique de document(s) » et
  « Réussir la dissertation » (fiches du prof dans `public/documents/hggsp/`) ;
  leurs problèmes à rédiger (étude critique de l'article 11 de 1789, 1789 / 1881,
  dissertation « L'État face à la liberté de l'information », atelier de
  problématique) sont rattachés au chapitre « Thème 4 · Axe 2 ». Les anciens
  chapitres « Méthode · … » d'HGGSP sont dans `PUBLIES_RETIRES`
  (`contenu/bibliotheque.ts`) : effacés au chargement et à la synchro. Pour une
  nouvelle méthode, écrire une leçon, pas un chapitre.
- **Dates publiées** (`contenu/evenements.ts`) : chaque entrée crée un DST
  `pub-<id>` chez tous les utilisateurs, rattaché aux chapitres publiés
  indiqués par leur `id`. Une date supprimée par l'utilisateur ne revient
  pas, sauf si sa `version` augmente. Publiées : interro de PC et DM du
  16/11/2026.
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
  qu'il colle dans l'onglet avec « Coller une liste ». Une date entre
  parenthèses en fin de ligne, « (13/11) » ou « (ven. 13/11) », devient
  l'échéance.
- **Calendrier du lycée** : `contenu/calendrier.ts` contient les DST de
  Première 2026-2027 relevés sur une photo du document du lycée (sans les
  heures). Relevé revérifié le 2026-11-10 sur la photo agrandie, ligne par
  ligne : dates et durées conformes. Les DST de Première tombent le jeudi ;
  les autres jours sont des rattrapages, oraux blancs ou semaine de bac blanc.
  **Ajouté tout seul à la première visite** (chaque navigateur a ses propres
  données : rien ne passe du téléphone à l'ordinateur), avec les matières
  `parDefaut` : tronc commun, bac blanc, HGGSP et Physique-Chimie. Chacun
  change ses matières dans la page Calendrier ;
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
| 2026-11-11 | Grand écran : contenu élargi et panneau « Aujourd'hui » aligné | Choisi par l'utilisateur parmi 6 maquettes (A, B, C, A+B, A+C, A+B aligné) |
| 2026-11-11 | Fond du thème sombre uni, sans halo | Le halo terracotta en haut à droite le gênait |
| 2026-11-11 | Synchro par comptes Supabase (adresse + mot de passe, sans mail de confirmation), toutes les données | Choix de l'utilisateur ; le mot de passe évite les mails (limités par Supabase) et marche dans l'app installée sur l'iPhone |

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
- 2026-11-11 : données d'exemple retirées du site (boutons, bandeaux,
  chapitre « Dérivation ») ; `normaliser()` efface les anciennes données
  `ex-…` des navigateurs (format version 3), en gardant une matière d'exemple
  si un vrai DST ou chapitre s'y rattache. Le 2026-11-11, l'utilisateur
  voyait encore les exemples sur son ordinateur : ils venaient de la toute
  première version, sans préfixe (`m-maths`, `c-deriv`, `d1`…). Ils sont
  maintenant reconnus aussi (`ANCIENS_EXEMPLES`, format version 4). Leçon
  d'exemple « photosynthèse » retirée. Physique-Chimie : trois chapitres
  (Chap. 9, Chap. 11, les forces) avec les cinq PDF du prof, 67 flashcards,
  55 exercices. Le mail du prof (reçu le 2026-11-11) confirme : interro de
  cours d'1 h le lundi 16/11/2026 sur chap. 9, chap. 11 et les trois fiches
  méthode ; DM à rendre le même jour (ex. 1 cas 2 et 3, ex. 4 de la fiche
  d'exercices du chap. 11, à rédiger sur feuille). Quatrième chapitre « Fiche
  d'exercices et DM » : énoncé (converti du .docx en PDF) et correction du
  prof, exercices tirés des parties corrigées, pistes de méthode pour le DM.
  **Ne pas rédiger le DM à sa place** : la correction du prof ne le contient
  pas, et il doit le faire lui-même. Coquille relevée dans la correction
  (ex. 6 : 1,6 × 10⁻² au lieu de 16 m·s⁻¹). Deux erreurs relevées dans les fiches du prof et
  signalées dans le contenu : Euler présenté comme allemand du XIXe siècle,
  et P⃗ = −R⃗N attribué à la 3e loi.
- 2026-11-11 : vraies flèches de vecteur et fractions superposées dans tous
  les contenus de physique ; 21 schémas explicatifs repris des cours et
  fiches méthode du prof (fiches, 21 flashcards, leçon de rédaction).
- 2026-11-11 : Mathématiques (spécialité), séquence 2 « Dérivation », repris
  de 15 photos (polycopié du prof, fiches d'exercices Transmath 1re,
  démonstrations du cahier) : 25 flashcards, fiche à cinq tailles avec 5
  schémas, 26 exercices parallèles (pas les corrigés de ses fiches), leçon
  guidée en 9 étapes. Coquille du polycopié signalée : |x − y| ≥ ||x| − |y||
  (écrit « > »). DST de maths au calendrier : 12/11 (1 h) et 03/12 (2 h) ;
  on ne sait pas s'ils portent sur la dérivation.
- 2026-11-12 : onglet « Déf » dans chaque chapitre, rempli pour les 9
  chapitres publiés (environ 100 définitions et propriétés, recopiées des PDF
  et polycopiés ; pas pour « Fiche d'exercices et DM »), cherchable dans
  Recherche. L'onglet Déf n'apparaît que si le chapitre a des définitions
  (demandé le 2026-11-12). Drapeaux pour LVA et LVB (matières existantes mises à jour au
  chargement). Bouton photo, appareil photo et PDF visibles dans Apprendre et
  Mes erreurs.
- 2026-11-11 : barre d'onglets mobile redessinée (fond translucide, pastille
  cuivrée qui glisse), page Recherche (sans accents ni casse, dans tout le
  contenu), exercices variés (cinq types), matières sur deux colonnes sur
  téléphone.
- Idées proposées le 2026-11-10 et pas encore demandées : planning de
  révision automatique avant un DST, export des DST vers le calendrier du
  téléphone, vacances scolaires, notes et moyennes, flashcards inversées,
  espace bac de français, impression PDF, hors connexion.
- 2026-11-11 : synchronisation entre appareils en ligne (table créée,
  confirmation par mail désactivée). Pas encore confirmée par l'utilisateur
  sur ses appareils.
- Pas encore fait : tests automatisés dans le dépôt.

## Prochaines étapes

1. Proposer de reprendre ses autres fiches existantes (voir « Ajouter du
   contenu ») et traiter les nouveaux cours qu'il envoie.
2. Obtenir sa confirmation que le site en ligne s'affiche bien sur son
   téléphone, et ses retours.
3. Lui faire vérifier la synchro entre son téléphone et son ordinateur.
4. Tâche planifiée des demandes : vérifier qu'elle tourne (`list_triggers`)
   et que les réponses arrivent bien chez lui.

## Préférences de l'utilisateur

- (2026-11-11) Quand il transmet une consigne datée (mail d'un prof, DM,
  interro), **Claude ajoute lui-même la date au calendrier** dans
  `contenu/evenements.ts`, rattachée aux chapitres, au lieu de lui demander
  de le faire. Les tâches « À faire » restent à coller par lui (Claude n'y
  a pas accès) : lui fournir la liste prête à coller.
- (2026-11-11) Il veut que Claude **utilise le skill « learn »** pour l'aider
  à apprendre : diagnostiquer avant d'expliquer, une question à la fois,
  exemples parallèles plutôt que la réponse à un travail noté. Les leçons de
  l'onglet Apprendre sont construites sur ce principe.
- Il veut des fiches qui reflètent **ce que son prof attend** (méthode de
  rédaction, encadrés, A.N.), pas seulement le contenu du cours.
