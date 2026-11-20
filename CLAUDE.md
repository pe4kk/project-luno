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
- **Généraliser chaque remarque** (demandé le 2026-11-14 : « essaie de généraliser tout
  ce qu'on se dit ») : quand il corrige un contenu ou un écran, en tirer la règle
  générale, l'écrire dans « Principes des contenus et des quiz » ci-dessous, l'appliquer
  à **tout** le contenu existant (toutes les matières, pas seulement l'exemple), et la
  reporter dans la consigne de la tâche planifiée.
- **Début de session : lire le journal du quiz** : `node scripts/demandes.mjs journal
  <date de la dernière lecture>` (signalements « pas claire / inutile / trop facile /
  corrigé faux », cartes souvent ratées, réponses fausses). Corriger les cartes visées
  (reformuler, `renommages.ts`, `hors-quiz.ts`, verso), en tirer une règle si le défaut
  se répète, puis noter ici la date de lecture. Dernière lecture : 2026-11-14 (vide).

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
    (testé le 2026-11-11 : fusion, envoi, hors connexion, direct). Un seul compte,
    le sien (`56a44891-…`) : le compte de test créé par Claude le 2026-11-11 a
    été supprimé le 2026-11-12 avec son accord. Pour tester, utiliser le faux
    serveur local, pas un vrai compte.
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
  - **Notes d'une matière** (2026-11-12, demandé pour son oral d'EMC) : troisième
    onglet « Notes » à côté de « Chapitres » et « Mes erreurs »
    (`components/travail/Notes.tsx`, `?o=notes&n=<note>`). Une note = titre + texte
    libre (écrit ou dicté), modes Lire / Modifier, enregistrement automatique, nombre
    de mots et durée à l'oral (130 mots/min), copier, « Télécharger pour Word » (.doc
    en HTML), documents joints (photos et PDF dans le stockage `demandes`,
    `<compte>/notes/<note>/…`, compte connecté seulement ; le seau n'accepte que JPEG
    et PDF). `notes` dans les données (synchronisées, fusion par id, la plus récente
    gagne). Carte « Faire taper une feuille » : demande de type `cours` avec
    `meta.note: true`, réponse `{ note: { titre, texte } }` (vérifiée par
    `verifierNote()`), reprise en note avec l'id `dem-<id>` (matière créée si absente).
    Lecture mise en page (`TexteNote`, 2026-11-19, « embellis cet onglet ») : une ligne en
    CAPITALES = titre de section numéroté ; « • Étiquette : texte » = carte avec l'étiquette en
    petit titre ; [mots entre crochets] = pastilles à remplacer ; « a (déf) · b · c » = étiquettes.
    Un texte sans titres ni puces reste en paragraphes simples. Écrire les notes de Claude ainsi.
  - **Dates clés** (2026-11-13, demandé pour l'histoire : « une partie dates entre
    Déf et Flashcards » pour les matières non scientifiques, avec un mode
    chronologique) : `dates` d'un chapitre (`DateCle` : `date` affichée, `tri`
    AAAA-MM-JJ / AAAA-MM / AAAA, `evenement`, `precision`, `importance` 1
    essentielle ou 2 utile), onglet « Dates » (`components/travail/Dates.tsx`,
    `?o=dates`) affiché seulement si le chapitre en a : frise par année, filtre
    « Seulement les essentielles », « Remettre dans l'ordre » (5 dates tirées) et
    « Quelle date ? » (cartes, une date ratée revient une fois). Cherchable dans
    Recherche. Ne garder que les dates utiles à un élève de Première.
  - **Images de cours** (2026-11-13) : `image` sur un point de fiche (`ImageCours` :
    `fichier` dans `public/documents/<matière>/`, `alt`, `legende`, `ratio`),
    dessinée par `components/Illustration.tsx` (agrandie au toucher ; une image en
    hauteur est limitée en largeur). Images découpées d'une vidéo avec ffmpeg
    (`fps=4`, puis rognage PIL).
  - **Bac de français** (2026-11-13, maquettes validées) : quatrième onglet « Bac »
    de la matière nommée « Français » seulement (`components/travail/Bac.tsx`,
    `?o=bac&t=<texte>&v=fiche|recite`). Descriptif par genre (4 objets d'étude × 4
    textes = 16, rappel des modalités de l'oral 2027 dans `ORAL_BAC`), puis par texte
    trois vues : « Texte annoté » (passages surlignés et numérotés ; sur ordinateur
    les remarques du prof dans la marge, sur téléphone la remarque du passage touché
    s'ouvre sous la strophe ; bouton pour cacher les annotations), « Fiche »
    (lecture, introduction, problématique, plan, mouvements, citations et procédés,
    conclusion, grammaire) et « Je récite » (explication cachée, dite à voix haute,
    puis cases à cocher et bilan ; rien n'est enregistré). **Le code couleur change
    selon le genre** (demandé) : `GENRES_BAC` dans `lib/bac.ts`, quatre catégories et
    quatre teintes par genre ; un texte peut renommer une catégorie (`categories`).
    Contenu dans `contenu/bac-francais.ts` (publié pour tous, pas dans les données
    de l'utilisateur) : les `extrait` des annotations reprennent les mots du texte à
    l'identique (apostrophes « ’ »), sans chevauchement dans une même strophe ; ne
    garder que l'essentiel de l'explication du prof. Prêt : « À la Musique »
    (Rimbaud, 34 remarques, complété les 19 et 20/11 avec sa feuille annotée et la page de son cahier : comparaison avec Glatigny) et « Femme
    noire » (Senghor, parcours, 2026-11-19, d'après la correction du DST de M. Waquet et ses
    notes du cours oral ; 4 mouvements, 34 remarques). Chaque texte a un résumé `essentiel`
    (« L'essentiel en une minute », en haut de la fiche, demandé : « une fiche qui résume
    l'analyse »). Un texte encore protégé (auteur mort depuis moins de 70 ans) n'est pas recopié
    en entier dans le dépôt public : seulement les passages commentés, `extraits: true`
    (bandeau « lis-le sur ton polycopié »). Coquille de la correction : « Aimée Césaire » (Aimé).
    « Vénus Anadyomène » (Rimbaud, texte 2, 2026-11-20, d'après le poème annoté au cours oral :
    3 mouvements, 20 remarques dont 9 `cle`) est `provisoire` (bandeau « sera complétée avec
    l'analyse écrite du prof ») : la compléter quand il l'enverra, puis retirer `provisoire`.
    Attendus : un troisième texte des Cahiers de Douai, puis théâtre, roman, littérature d'idées.
    Pas de question de grammaire donnée par le prof pour l'instant. Les modalités
    viennent de sites spécialisés concordants, pas du BO (education.gouv.fr n'est
    pas joignable depuis la session). Idée non construite : oral blanc chronométré.
  - **Préparer une éval** (2026-11-13, demandé : choisir une éval, dire si c'est une
    éval de cours ou avec exercices, recevoir un programme) : page `/preparer`
    (`app/preparer/page.tsx`, pas dans la barre d'onglets, qui est pleine ; accès par
    la carte « Prochain DST » de l'accueil, « Autre éval », et chaque DST du
    calendrier). Sans `?d=` : liste des évals à venir. Avec `?d=<dst>` : 1. chapitres
    au programme (cases, enregistrées dans `chapitreIds`), 2. « Éval de cours » ou
    « Éval avec exercices », 3. programme réparti d'aujourd'hui à la veille (cinq
    jours au plus), étapes à cocher qui ouvrent les écrans existants. Logique sans
    IA dans `lib/preparation.ts` (depuis le 2026-11-15 : révisions de tête `recurrente`
    posées chaque jour, ids `apprendre@<date>` ; fiche à « fermer et redire de tête » ;
    dissertation ou étude critique hors sciences ; conseil de priorité au-delà de 3 h) :
    `etapes()` (fiche, définitions, dates, flashcards ;
    pour « exos » série, calculs, problèmes ; la veille mes erreurs et interro
    blanche) et `repartir()`. Choix et étapes cochées dans `preparation` du DST
    (`majDst`, synchronisé, fusion par union).
  - **Lecteur de PDF intégré** (2026-11-14, `components/LecteurPdf.tsx`, pdf.js
    `pdfjs-dist` 5.4, version « legacy » ; le worker est copié dans `public/` par
    `next.config.ts` à chaque build, non versionné). Dans l'app installée sur
    l'iPhone, un lien vers un PDF du site (dans le `scope` du manifeste) s'ouvrait
    dans la fenêtre de l'app, sans bouton retour : impossible d'en sortir. Tout lien
    de PDF passe par `<LienPdf href titre>` ou `ouvrirPdf(url, titre)` : lecteur
    plein écran, bouton Fermer, zoom 100–300 %, le geste retour le ferme
    (`history.pushState`), « Enregistrer ou partager » dans l'app installée. Ne
    jamais remettre un lien `target="_blank"` vers un fichier de `public/` (les
    images de cours se zooment avec deux doigts dans leur fenêtre).
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
  - **S'exercer, quatre modes, plus « Apprendre » depuis le 2026-11-14** (2026-11-12, choisis parmi 4 maquettes : A, C,
    D) : « Série » (exercices rapides), « Problèmes » (A : situation réelle
    rédigée étape par étape, l'élève compare à `attendu` et coche le barème
    `criteres`, `components/exercices/Probleme.tsx`), « Calculs » (C : valeurs
    tirées à chaque version, vérifie valeur, unité et chiffres significatifs,
    `Calcul.tsx`, `lib/calcul.ts`), « Interro blanche » (D : questions de cours
    tirées de l'onglet Déf + calculs, chrono 30 min / 1 h ou sans, correction
    seulement à la remise, auto-notation des questions de cours, note sur 20,
    erreurs envoyées dans « Mes erreurs », `Interro.tsx` ; 14 questions par défaut pour 1 h,
    mots clés retrouvés affichés et confirmation pour « Juste » sous la moitié ; chaque erreur
    envoyée a une règle « Terme : ne pas oublier « … » » avec les mots les plus distinctifs oubliés). Types `Probleme` et
    `Calcul` dans `lib/types.ts`, champs `problemes` et `calculs` d'un
    chapitre ; contenu de physique dans `contenu/physique-entrainement.ts`
    (3 problèmes, 6 calculs ; rien du DM). Dans un `Calcul`, `{nom}` = valeur
    tirée, `{resultat}` = résultat ; `formule` en syntaxe simple (`m * v / dt`,
    conversions écrites en nombres dans la formule) ; éviter les bornes qui
    changent le nombre de c.s (« 0,8 », « 100 »).
  - **Journal du quiz et « Signaler »** (2026-11-14, demandé : « récupère mes actions et
    réponses pour améliorer les quiz ») : chaque réponse du mode Apprendre va dans
    `journal` des données (`EntreeQuiz` : chapitre, recto, palier, forme qcm / inverse /
    trou / tete, réponse, attendu, juste, `signal`, `remarque` ; 400 dernières,
    synchronisé, fusion par id). Bouton « Signaler » après chaque réponse (Pas claire,
    Inutile, Trop facile, Corrigé faux, Autre + un mot). Lecture :
    `node scripts/demandes.mjs journal [AAAA-MM-JJ]` (table `donnees`, clé injectée par
    le proxy). La tâche planifiée ne peut pas pousser sur le dépôt (clone public sans
    droits) : les corrections de contenu publié se font dans une conversation.
  - **Mode « Apprendre » de S'exercer** (2026-11-14, idée tirée des concurrents, testée
    sur l'éval de cours de physique du 16/11) : premier onglet de S'exercer
    (`components/exercices/Apprendre.tsx`, `lib/apprendre.ts`, `?mode=apprendre&dst=`),
    aussi étape « Apprendre les N notions » de Préparer une éval. Chaque flashcard monte
    par paliers : 1 Reconnaître (QCM, verso + 3 versos voisins), 2 Compléter (de 1 à 4 mots
    cachés selon la longueur de la réponse, un pour 4 mots clés, demandé le 2026-11-15 :
    « un peu simple » ; mots du vocabulaire du chapitre, ni verbe conjugué ni mot de
    liaison ni doublon ; un champ par trou, Entrée passe au suivant, palier réussi si
    tous sont justes ; `trousPour()`, `decouperTrous()`), 3 De tête (réponse
    comparée aux mots clés du verso, vert/rouge, puis l'élève valide ; les formules et
    équations du verso comptent aussi, `formulesDe()` : « Δv⃗ = 0⃗ » tapé tel quel, une
    fraction écrite a/b, des indices tapés vxi ou des états (aq) omis sont reconnus ;
    formule juste = « Formule juste », les mots manquants deviennent un complément ;
    juste à une majuscule près = juste, avec « attention aux majuscules (Δt n'est pas ΔT) »). Notion courte
    (≤ 4 mots clés) : pas de palier 2. Palier gardé dans `apprendre` de la carte (0–3,
    synchronisé, la fusion garde le plus haut) ; le palier 3 alimente aussi la répétition
    espacée (`noterFlashcard`). Manches de 7 (notions commencées d'abord), une notion ratée
    revient 3 questions plus loin une fois, bilan de fin de manche.
    Depuis le 2026-11-15 (élève testeur) : « Maîtrisée » seulement après une réussite de tête
    un **autre jour** (`apprendreJour`), une notion ratée puis rattrapée dans la manche ne
    monte pas ; les cartes-questions sautent le QCM sauf si elles ont des `leurres` écrits à
    la main ; intrus de QCM de même forme (formule, consigne, phrase) et, pour le
    vocabulaire, notions voisines (« terrestre », « héliocentrique ») ; correction De tête
    sans les exemples, avec synonymes (`SYNONYMES` de `lib/apprendre.ts`), flèches de vecteur
    et parenthésage exigés ; « C'était juste » demande une confirmation sous la moitié des
    mots clés ; « J'avais juste » (texte à trous) refusé si le mot écrit est un autre terme
    du cours ou déjà dans la phrase.
  - **Saisie de formules au téléphone** (`components/SaisieFormule.tsx`,
    `lib/saisie.ts`) : raccourcis tapés (`del` → Δ, `sig` → Σ, `*` → ·, `^2` →
    ², `^-1` → ⁻¹, `=>` → ⇒, `->` → →, `<=` → ≤, `!=` → ≠, `~=` → ≈, `sqrt` → √,
    `pi` → π, `rho` → ρ, `prime` après une lettre → ', apostrophe ’ de l'iPhone →
    ' ; vu le 2026-11-15 : « jpp écrire prime » ; indices : `M_i-1` → Mᵢ₋₁ (touche
    xᵢ, conversion à la frappe suivante) et « Mi-1 », « ti+1 » reconnus sans tiret bas), barre de touches (Δ, Σ, flèche de
    vecteur, prime ′, fraction, ², ⁻¹, ·, ×10^, √, ⇒ ; la flèche couvre tout ce qui
    précède le curseur, ou la sélection : sélectionner « MM' » puis v⃗) et aperçu dessiné : `a/b` ou `(a+b)/(2c)` s'affiche
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
    pour ne pas toucher aux trous « ___ »), `==essentiel==` (gras simple depuis le 2026-11-13), dessinée par
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
    `body` (sinon la barre du bas passe devant), ouverte par un bouton
    « Brouillon » en ligne au-dessus de l'exercice (un bouton flottant cachait
    « Suivante », 2026-11-15). Ordinateur (≥ 1024 px) : panneau collant à droite de la question.
    Un brouillon par question, en mémoire seulement, jamais noté ; une nouvelle
    séance repart d'une feuille blanche.
    Les touches de la calculatrice écrivent au curseur (vu sur son iPhone le
    2026-11-12 : elles écrivaient toujours à la fin) ; en-tête en icônes seules
    sous 420 px. Dessin au doigt sur iPhone : `touchstart`/`touchmove` refusés
    sur la toile, et tout glissement dans la feuille (`data-brouillon`, sauf
    `data-defile`) refusé au niveau du document. Ne pas figer la page tout en
    haut : dans un navigateur intégré à une appli (✕ en haut, boussole en bas),
    tirer vers le bas depuis le haut ferme le navigateur (vu le 2026-11-12) ;
    on garde la page à 1 px du haut (marge basse de 100dvh pendant l'ouverture). Touche fraction a⁄b (insère « ()÷() », curseur dans le
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
  - **Critique de design du 2026-11-19** (« corrige tout ») :
    - Un même chiffre partout : « À revoir aujourd'hui » des Statistiques = `revisionDuJour()`
      de l'accueil (nouvelles du quota comprises) ; la barre « aujourd'hui » de la prévision aussi.
      État vide des Statistiques (« Pas encore de révision » + Réviser).
    - Accueil : carte de révision « N nouvelles gardées pour les jours suivants » (le quota est
      expliqué dans les Statistiques) ; le jour même d'un DST, « Relire mes erreurs » remplace
      « Préparer cette éval ». Découverte du jour : sous 1024 px une seule carte à trois onglets
      (Le fait · L'œuvre · L'actu, ouverte sur le premier pas encore connu), trois colonnes au-delà ;
      « Lire la suite » en contour, « Je connais déjà » discret.
    - Matière : en-tête réduit à une ligne dans les sous-onglets (Erreurs, Notes, Bac) ;
      « Erreurs » au lieu de « Mes erreurs » sous 420 px, onglets resserrés sous 360 px.
    - Bac, texte annoté : **deux modes** (demandé) « L'essentiel » (remarques `cle: true`, 2 ou 3
      par strophe) et « Tout », choix gardé (`luno-bac-annotations`) ; toucher une couleur de la
      légende n'affiche que cette famille ; compteur « N remarques sur M » ; retrait suspendu des
      vers trop longs (texte annoté et Je récite). Tout nouveau texte marque ses remarques `cle`.
    - Bac, fiche : « L'essentiel » et la problématique ouverts, le reste en parties repliables
      (`PartieFiche`) avec un sommaire (Introduction, I à IV, Conclusion, Grammaire, Tout déplier).
  - **Évaluation par un élève testeur** (2026-11-15) : prompt `scripts/eleve-testeur.md`
    (Inès, Première, teste tout le site avec Playwright, juge la méthode de révision avec des
    sources, compare aux documents du prof, note sur 10). Six tours : 7,0 → 7,5 → 8,0 → 8,3 →
    8,5 → 8,8. Restes signalés : délais adaptés à l'historique (fait le 2026-11-15 : FSRS),
    deux réussites de tête sur des jours différents avant « Maîtrisée » (à discuter).
  - **Exos types** (2026-11-16, maquettes A + B choisies,
    https://claude.ai/artifact/2iBmZhc3EGYuLyv3Ex4HAg) : onglet « Exos types » (« Exos » sous
    420 px) des chapitres scientifiques qui en ont (`components/travail/ExosTypes.tsx`,
    `?o=exos&e=<exo>&v=sujet|copie|correction`). Contenu publié pour tous dans
    `contenu/exos-types.ts` (`EXOS_TYPES`, clé = id du chapitre publié, lu directement, pas
    copié dans les données) : `types` (id, titre, `court`, `rappel`) et le moins d'`exos`
    entiers possible qui couvrent tous les types (énoncé, schéma, questions avec `types`,
    `correction` rédigée comme le prof, `points`, `source`). Faits : chap. 9, chap. 13,
    forces, oxydoréduction, dérivation (2 exos chacun, calculs refaits). A : liste des types
    cochés (vert seul, cuivre avec la correction, rouge raté), exo conseillé. B : Sujet /
    Ma copie (SaisieFormule, enregistrée) / Correction (cachée tant qu'on n'a pas fini,
    « Voir quand même »), puis « Réussi seul / Avec la correction / Raté » par question.
    Progression `exos` des données (synchronisée, clé « publié/exo/numéro », la meilleure
    note gagne à la fusion). Sujets inspirés de sujets type bac et de manuels ; les
    exercices de ses profs passeront devant s'il les envoie.
  - **Demander une explication** (2026-11-16, option A) : `components/travail/Explications.tsx`.
    Dans Déf, Dates, Flashcards, Fiche et Exos types (`ZoneExplicable`), sélectionner un
    passage fait apparaître la bulle « Expliquer » (suivie par `selectionchange`) ; on dit ce
    qui bloque (écrit ou dicté) et la demande part à Claude (type « lecon » avec
    `meta.explication`, `passage`, `chapitreId`, `publieId`, `onglet` ; compte connecté
    seulement). Réponse `{ explication: { texte, exemple?, piege? } }` (vérifiée par
    `verifierExplication()`), affichée sous « Tes explications » en haut de l'onglet, avec
    le passage cité ; en attente : heure du prochain passage. Consigne de la tâche planifiée
    mise à jour le 2026-11-16.
  - **Découverte du jour** (2026-11-18, maquettes A pour le fait et l'actu, B « cartel de
    musée » pour l'œuvre, https://claude.ai/artifact/Ph6fdRsEw5jGoMUD83k5Vf) : sur l'accueil
    (`components/Decouverte.tsx`, sous « À faire »), compte connecté, activée par
    `reglages.decouverte` (bouton « Activer », désactivable dans `/decouvertes`). Chaque jour : un
    **fait** de culture générale utile en HGGSP, une **œuvre** (peinture avec la vraie image de
    Wikimedia Commons, texte ou discours court ou résumé ; liée au programme environ une fois sur
    deux, `programme`) et une **actualité** vérifiée (événement de 3 jours au plus, deux sources
    indépendantes, n'importe quel sujet ; **la plus importante du moment**, celle qui fait la une
    de la plupart des grands médias, pas une curiosité : demandé le 2026-11-18). HGGSP visée pour l'instant ; pour lui seul (amis : pas
    prévu). « Je connais déjà » range l'id dans `connues` des données (synchronisé, union) ; le
    passage suivant de la tâche remplace l'élément et garde l'ancien dans `anciens`. Historique :
    page `/decouvertes` (filtres, état « Déjà connue »). Lignes de la table `demandes` (type
    « lecon », `meta.decouverte`, `meta.jour`, prêtes d'emblée), écrites par la tâche avec
    `node scripts/demandes.mjs decouvertes | decouverte <compte> <fichier>` (vérifie formats,
    répétitions, âge de l'actu, sources, image qui répond) ; images :
    `images-commons "<mots>"` puis `image-commons "<File:…>"` (miniature 960 px sur
    upload.wikimedia.org, agrandie en 1920 px). **Le script copie l'image dans le stockage
    privé du compte** (`<compte>/decouvertes/<id>.jpg`, `image.chemin`) et le site l'affiche
    d'abord (adresse signée), Wikimedia ensuite, sinon la vignette sans image : le 2026-11-19
    l'image venue de Wikimedia s'affichait cassée sur son iPhone (Wikimedia limite les images
    demandées par les navigateurs). Réparer une découverte déjà déposée :
    `node scripts/demandes.mjs recopier-images <compte>`. L'environnement `project-luno` autorise
    commons.wikimedia.org et upload.wikimedia.org depuis le 2026-11-18. Formats : `lib/decouverte.ts`.
    Testé sur un faux serveur (`LUNO_PROJET=http://localhost:54321` pour le script,
    `NEXT_PUBLIC_SUPABASE_URL` pour le site, session injectée dans `luno-compte`).
  - **Cartes inversées : décidé, pas encore codé** (2026-11-18, après recherche : le sens non
    travaillé n'est retenu qu'à 70–90 %, Leuba 1966 ; Anki les réserve au contenu important). À
    inverser : vocabulaire et définitions, langues (FR → EN/ES surtout), dates. Jamais : cartes-
    questions, méthodes, listes, formules. Carte inversée = progression FSRS à part, jamais le même
    jour que sa sœur, mots de la réponse cachés dans la définition. Marquée par Claude à la rédaction.
  - `ZoneAction` (`components/ui.tsx`) : entoure le bouton principal d'un écran ; s'il
    apparaît sous la barre du bas, la page défile pour le montrer. À utiliser pour tout
    nouveau bouton d'action qui apparaît après une réponse.
  - Recherche : requête gardée dans l'adresse (`?q=`), une faute de frappe tolérée (6 lettres et plus).
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
  le délai est calculé par FSRS (voir ci-dessous), et une erreur, y compris à un QCM
  tiré de cette carte, la fait revenir le jour même ; un point de
  fiche porte `n`, la plus petite taille (1 à 5) à laquelle il apparaît, ce
  qui rend le curseur instantané.
  **Répétition espacée FSRS, l'algorithme d'Anki** (2026-11-15, demandé ; `lib/fsrs.ts`,
  FSRS-4.5 avec ses paramètres par défaut, appelé par `prochaineRevision()` dans
  `lib/store.ts`) : chaque carte a une `stabilite` (jours), une `difficulte` (1 à 10) et
  `revueLe` ; à chaque réponse, elles sont recalculées selon le temps écoulé, et le délai
  vise 90 % de chances de s'en souvenir. Quatre réponses (À revoir / Difficile / Je savais /
  Facile, délai affiché sous chaque bouton ; carte neuve : tout à l'heure, demain, 4 j,
  14 j ; « Je savais » en dégradé cuivré de la pastille d'onglet en thème clair, classe
  `bouton-je-savais`, choisi le 2026-11-16 parmi 6 couleurs : la terracotta tirait sur le
  rouge ; thème sombre inchangé). Les cartes de l'ancien système reprennent leur intervalle comme stabilité et leur
  `facilite` (SM-2, plus utilisée) comme difficulté. Une carte
  ratée repasse une fois dans la séance ; le recto reste visible au verso ; champ facultatif
  pour écrire sa réponse avant de retourner. Le quota de 20 nouvelles cartes saute pour les
  chapitres d'un DST dans 3 jours au plus (`lib/revision.ts`).
  **« La totale » d'Anki** (2026-11-18, demandé) :
  - Historique `revisions` des données (`EntreeRevision` : carte « recto|verso », chapitre,
    date, note 0-3, intervalle, `nouvelle` ; 6000 dernières, synchronisé, union par id),
    écrit par `noterFlashcard` (révision, Apprendre palier 3, QCM raté).
  - Réglages `reglages` (synchronisés) : `retention` (taux visé 80–95 %), `nouvellesParJour`
    (5–50, remplace `QUOTA_NOUVELLES` partout), `poids` (17 poids FSRS ajustés), `ajusteLe`,
    `ajusteSur`. `prochaineRevision(f, note, optionsDe(reglages) + charge)`.
  - Ajustement de FSRS sur l'historique (`ajuster()` dans `lib/fsrs.ts`) : rejoue chaque carte
    (une révision par jour), perte logarithmique, Adam avec gradient par différences finies,
    rappel vers les poids par défaut, bornes de FSRS-4.5 ; dès 400 révisions évaluables ;
    gardé seulement s'il prédit mieux. Testé sur un élève simulé (retrouve un oubli plus
    rapide, ~1 s sur iPhone).
  - Étalement de la charge (`etaler()`) : délai ≥ 3 j décalé de 5–10 % vers le jour le moins
    chargé (`chargeParJour()`).
  - Oublis (`oublis` d'une carte, « À revoir » sur une carte déjà sue) ; **sangsue** à 6
    (`estSangsue()`) : bandeau dans la révision (Demander une explication, Suspendre) et liste
    dans les statistiques.
  - **Suspendre** (`suspendue`, `estDue` l'exclut ; étiquette « Suspendue » dans le chapitre,
    réactivation dans les statistiques) et **Annuler** la dernière réponse (pile en mémoire
    dans le store, `annulerRevision()`, 30 au plus ; bouton ↶ dans la révision et sur l'écran
    de fin).
  - Page **`/statistiques`** (`app/statistiques/page.tsx`, liens depuis Travail, l'accueil et la
    fin d'une séance) : aujourd'hui, série, réussite réelle 30 j, à revoir cette semaine,
    calendrier de 18 semaines (une teinte cuivre, colonnes élastiques), prévision 30 jours en
    barres (toucher une barre), répartition solides / en cours / nouvelles, révisions sur
    mesure (`/travail?r=ratees`, `r=avance` : `cartesRateesAujourdhui()`, `cartesEnAvance()`),
    sangsues, suspendues, réglages et ajustement.
  - Pas fait (dit à l'utilisateur) : étapes d'apprentissage en minutes, textes à trous et
    cartes inversées créés par l'élève, images masquées, audio, hors connexion complet.
  Les flashcards sont mélangées à chaque séance (`melanger()` dans
  `components/travail/Revision.tsx`, demandé le 2026-11-14), quelle que soit
  l'entrée (chapitre, révision du jour, préparer un DST).
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

## Principes des contenus et des quiz (tirés de nos échanges, valables partout)

1. **Penser comme le prof** : sa méthode, ses notations, ses conversions (chaque unité
   convertie, jamais « × 3,6 ») ; une méthode générale fixe, plus une méthode par type
   d'exercice, jamais fondues.
2. **Pertinence d'abord** : ne garder que ce qu'un prof peut demander. Pas de carte sur
   les logiciels de TP, les anecdotes, les chiffres de sondage ; méthodes dans la fiche,
   pas en Déf ni en quiz (`hors-quiz.ts`).
3. **Une question se comprend seule** : un terme à définir ou une vraie question qui
   nomme son sujet (« Que signifie concrètement la 2e loi de Newton ? »), jamais un
   titre elliptique ni une date nue.
4. **La réponse ne se devine pas** : le verso ne redit pas le recto ; les mauvaises
   réponses d'un QCM viennent du même chapitre, sont de forme proche et jamais des
   paraphrases de la bonne ; le mot caché est un mot du cours.
5. **Une notion, une seule fois** : notion commune à deux chapitres = même entrée de Déf
   et même carte ; pas deux cartes qui disent la même chose.
6. **Juger le fond, pas la forme** : une formule juste (Δv⃗ = 0⃗, a/b, indices tapés)
   vaut une bonne réponse ; une reformulation qui garde le sens est acceptée ; l'élève
   valide lui-même.
7. **Faire ressortir l'essentiel** : `==…==` (gras), une ou deux fois par section ;
   textes longs acceptés.
8. **Généraliser les erreurs** : « Mes erreurs » donne la règle réutilisable, pas
   seulement la faute.
9. **Vérifier** : refaire chaque calcul et chaque bonne réponse (« les IA font des
   erreurs »), signaler les coquilles du prof sans les recopier.
10. **Ne jamais faire un devoir noté à sa place** : méthode et exemples parallèles.
11. **Ne pas rassurer à tort** (élève testeur, 2026-11-15) : se tester vaut mieux que relire ;
    une notion n'est sue qu'après un rappel de tête un autre jour ; l'élève qui se note
    elle-même est guidée par les mots clés ; un QCM dont la réponse se devine à sa forme ne
    mesure rien (mieux vaut pas de QCM que de mauvais intrus).
12. **Fidèle au prof jusqu'au programme** : ce que le prof dit hors DST (le ressort) sort de
    Déf et des flashcards et reste en détail de fiche.
13. **Commenter un texte (français, et toute analyse de document)** (tiré de son DST de
    français corrigé, 2026-11-19) : une idée = une citation analysée (procédé exact, puis
    pourquoi, comment, quel effet), jamais un relevé seul ni une généralité ; analyser ensemble
    ce que le texte relie ; rien sans preuve dans le texte (pas de surinterprétation : d'abord
    le sens simple) ; mesurer l'héritage avant de dire « original » ; toujours commenter la fin ;
    chaque partie répond à la problématique, la conclusion rappelle le contexte.

## Ajouter du contenu (cours envoyés par l'utilisateur)

L'utilisateur transmet une demande qui commence par `[Luno] Nouveau cours`
ou `[Luno] Nouvelle leçon` : collée dans le chat (bouton « Copier la
demande » du site), ou déposée en ticket GitHub (lire avec
`gh api "repos/pe4kk/project-luno/issues?state=open"`). Il peut aussi envoyer
un PDF ou une photo directement dans le chat.

- **Cours** : ajouter une entrée à `contenu/bibliotheque.ts` au format de
  `contenu/physique-mouvement.ts` : `id` stable, `version: 1`, matière (reprendre
  exactement le nom indiqué, la reprise compare les noms), titre du chapitre,
  `definitions` (onglet « Déf », entre Cours et Flashcards, recopiées mot pour
  mot dans l'ordre du cours, format `DefinitionCours`, modèles dans
  `contenu/definitions.ts` ; voir la **règle de Déf** ci-dessous), 10 à 20 flashcards, fiche dont chaque
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
- **Règle de Déf** (tirée de ses réponses sur des exemples du chap. 9 et 13, le
  2026-11-14) :
  - Dans Déf, en `definition` : les **termes qu'un prof peut demander de définir**
    (système, référentiel, chronophotographie, vecteur déplacement, force…).
  - Une notion qui n'est qu'un **cas ou une précision d'une autre** se fond dans sa
    définition (« point matériel » fait partie de « système » ; « système ponctuel »
    aussi).
  - **Formules, lois et constructions qui s'écrivent en formule** (vitesse moyenne,
    2e loi de Newton, méthode d'Euler) : type `formule` ou `loi`, triées à part
    (filtre « Formules et lois »). Propriétés et théorèmes : filtre « Propriétés ».
  - **Flashcard seulement, pas dans Déf** : les mots-catégories (« cinématique ») et
    les classements ou listes de cas (« caractérisation du mouvement »).
  - **Méthodes** (Euler comme démarche, méthode générale de rédaction, méthode
    descendante…) : dans la **fiche**, jamais dans Déf (`DEF_PC_METHODE` est vide).
  - Une **notion commune à deux chapitres** = une seule entrée, la même constante
    mise dans les deux (`SYSTEME`, `REFERENTIEL`, `TRAJECTOIRE` dans
    `definitions.ts`), et une seule carte identique (même recto, même verso :
    `CARTE_SYSTEME`, `CARTE_REFERENTIEL`). Deux cartes identiques avancent ensemble
    (`majCarte` dans `lib/store.ts`) et ne passent qu'une fois quand on révise
    plusieurs chapitres (révision, Apprendre, interro blanche). Pour retirer une carte
    publiée, `cartesRetirees` du chapitre (rectos) et augmenter `version`.
  - Son prof tolère sans doute de légers changements de formulation si le sens est
    gardé (à confirmer après l'interro du 16/11).
- **Rectos des flashcards : compréhensibles seuls** (demandé le 2026-11-14 : en QCM,
  « Ce que signifie la 2e loi » ne disait pas de quoi on parlait). Un recto est soit
  un terme à définir (« Système », « Référentiel galiléen »), soit une vraie question
  qui nomme son sujet (« Que signifie concrètement la 2e loi de Newton ? », « Quelle
  est l'unité d'une force ? »), jamais un titre elliptique (« Unité de force », « La
  Lune et la 2e loi »). Éviter deux cartes qui disent presque la même chose. Pour
  reformuler une carte publiée sans perdre la progression : l'ajouter à
  `contenu/renommages.ts` (ancien recto → nouveau) et augmenter `version`. Le QCM du
  mode Apprendre prend ses mauvaises réponses dans le même chapitre d'abord, de
  longueur proche, et écarte les versos trop proches de la bonne réponse. Pour une
  carte de vocabulaire (recto qui n'est pas une question), le QCM est **inversé** si
  le verso redit le mot (sinon une fois sur trois) : la définition, mots du recto
  cachés par « … », et quatre notions au choix, les voisines d'abord. Le mot caché du
  texte à trous est un mot du vocabulaire du chapitre (mots des rectos), jamais un mot
  du recto de la carte, un adverbe ou un mot banal ; s'il n'y en a pas, la carte saute
  le palier « Compléter ». Pas de carte sur ce qui ne tombe pas en éval (logiciels de
  TP comme Aviméca, Regressi : carte retirée le 2026-11-14, « typiquement inutile »). Éviter quand même qu'un verso redise son
  recto (« … : c'est la vitesse limite »).
- **Quiz : seulement ce qui est pertinent** (demandé le 2026-11-14) : avant de poser une
  carte en quiz (mode Apprendre), se demander « le prof peut-il le demander en interro
  de cours ? ». Dans le quiz : définitions, lois, formules, propriétés. Hors quiz
  (restent en flashcards) : méthodes de rédaction, astuces d'exercices, applications,
  reformulations d'une carte déjà posée, détails hors DST. Liste dans
  `contenu/hors-quiz.ts` (`CHAPITRES_HORS_QUIZ`, `CARTES_HORS_QUIZ`) ou `horsQuiz: true`
  sur la carte (format des réponses de la tâche planifiée).
- **Leçon** : ajouter une entrée à `contenu/lecons.ts` (étapes courtes, un
  exemple, une question « Vérifie-toi » par étape).
- Contenus publiés : `hggsp-theme4.ts`, `francais-rimbaud.ts`,
  `physique-mouvement.ts`, `physique-methode.ts` (fiche « Rédiger comme ton
  prof l'attend » et leçon guidée du même nom), `maths-derivation.ts`
  (chapitre et leçon guidée ; schémas calculés dans `schemas-maths.ts`),
  `histoire-terreur.ts` (Histoire-Géo, « La Convention et la Terreur
  (1792-1794) », 2026-11-13, d'une vidéo du PDF du prof : 18 définitions, 16 dates,
  18 flashcards, 19 exercices, carte du manuel et 4 gravures ; précisions signalées :
  calendrier républicain décrété le 5 octobre 1793, esclavage rétabli le 20 mai
  1802, Directoire en octobre 1795 seulement), `physique-oxydoreduction.ts`
  (Physique-Chimie, « Chap. 4 · Les réactions d'oxydoréduction », 2026-11-13, de 3
  photos du polycopié : 10 définitions et méthodes, 16 flashcards, fiche, 18
  exercices, 2 problèmes et 1 calcul sur d'autres couples que ceux du cours, 2
  schémas `SCHEMA_COUPLE` et `SCHEMA_TRANSFERT` ; formules chimiques en Unicode,
  Cr₂O₇²⁻, jamais `_`). **Méthodes** (demandé le 2026-11-12 : dans Apprendre, pas dans Travail) :
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
  l'échéance. Depuis le 2026-11-14 (maquette A choisie), l'échéance est aussi
  reconnue dans le texte (`lib/echeance.ts`, `reconnaitreDate()` : jours entiers ou
  abrégés avec point ou numéro, « demain », « après-demain », « 20/11 » ; un jour =
  le prochain de ce nom, aujourd'hui exclu sauf « ce samedi » ; la mention la plus
  à droite l'emporte) : la page groupe par jour (En retard, Demain, « Lundi 16 »…,
  Sans date), souligne le mot reconnu en cuivre, montre l'échéance reconnue sous le
  champ, et propose « Mettre au jeu. 19/11 » pour les anciennes tâches sans date
  (pas d'attribution automatique : on ne sait pas quand elles ont été écrites).
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
| 2026-11-12 | Pas de style « Liquid Glass » (verre d'iOS 26) pour les onglets et curseurs | Maquettes A à D montrées, il n'a pas aimé |

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
  (Chap. 9, Chap. 13, les forces ; « Chap. 13 » et non « 11 » comme dans le mail du prof,
  corrigé le 2026-11-20 ; ids `pc-1re-chap11-*` gardés pour la progression) avec les cinq PDF du prof, 67 flashcards,
  55 exercices. Le mail du prof (reçu le 2026-11-11) confirme : interro de
  cours d'1 h le lundi 16/11/2026 sur chap. 9, chap. 13 et les trois fiches
  méthode ; DM à rendre le même jour (ex. 1 cas 2 et 3, ex. 4 de la fiche
  d'exercices du chap. 13, à rédiger sur feuille). Quatrième chapitre « Fiche
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

0. Découverte du jour : vérifier après le passage de 6 h du 19/11 qu'elle s'affiche chez lui
   (il doit d'abord toucher « Activer » sur l'accueil) et que l'image et les sources sont justes.
   Exos types : il enverra peut-être les exercices de ses profs ; si oui, les mettre à
   la place des sujets inspirés de manuels (`source: "Exercice du prof"`). Tester une
   explication de bout en bout avec son compte (réponse de la tâche planifiée affichée).

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
- (2026-11-13) **Raisonner comme en classe, pas avec des raccourcis** : pour une
  conversion, on convertit chaque unité dans les données avant le calcul (90 km/h =
  90 × 10³ m / 3600 s), jamais « × 3,6 » ou « ÷ 3,6 » appris par cœur. Il l'a
  relevé dans la leçon sur la vitesse ; c'est général : toute méthode doit suivre
  celle du prof. Corrigé partout le 2026-11-13 (versions augmentées).
- (2026-11-13) **« Mes erreurs » : généraliser**. Pour une copie corrigée, ne pas
  décrire l'erreur ponctuelle seulement : en tirer la règle qui servira ailleurs
  (titre général, ce qui a été fait, la règle juste, une astuce). Fait pour le DST
  commun n°1 de physique (05/11, 15/20, macaron et E124) : 6 erreurs déposées par
  une demande `erreurs` prête dans son compte (chiffres significatifs des valeurs
  intermédiaires, justifier une dilution, puissances de dix, norme « par kg »,
  répondre à toute la question, lecture de graphique), avec `regle`, `rappel` et
  `theme` pour la vue « L'essentiel » (version 2 de la réponse, qui met à jour les
  erreurs déjà reprises de même titre).
- (2026-11-19) DST de français du 15/10 (commentaire de « Femme noire », 14/20) : 9 erreurs
  généralisées déposées dans « Mes erreurs » de Français (demande `erreurs` prête) et une note
  « Formulations du prof, réutilisables » dans Notes de Français (demande `cours` avec
  `meta.note`, prête). Points forts selon le prof : clarté, bonne expression, procédés cités.
- (2026-11-13) **« Mes erreurs » : deux vues, demandé** : « L'essentiel » (une ligne
  par erreur, la règle, un rappel et une étiquette, à relire en une minute avant
  l'éval ; toucher une ligne ouvre le détail) et « Détaillé » (la vue complète).
  Bascule dans `components/travail/Erreurs.tsx`, choix gardé dans `localStorage`
  (`luno-erreurs-vue`). Champs `regle`, `rappel`, `theme` d'`ErreurNotee` ; la tâche
  planifiée les remplit. Choisi parmi 4 maquettes (A).
- (2026-11-13) **Vérifier chaque exercice de physique** : il l'a demandé (« les IA
  font des erreurs »). Le 2026-11-13, les 111 exercices, 5 problèmes et 5 calculs de
  physique-chimie ont été refaits un par un : aucun résultat faux, quelques
  formulations corrigées. Chiffres significatifs d'une pente : une soustraction
  garde le nombre de décimales, une division le plus petit nombre de c.s. (k =
  1,40 / 45,0 = 3,11 × 10⁻², 3 c.s.). - (2026-11-13) **Physique : une méthode générale fixe, plus une méthode par type
  d'exercice.** Générale (ne change jamais) : titre souligné ; « Par définition de
  … » et la formule encadrée ; « avec » et les données ; « A.N. : » ; résultat final
  souligné. En plus, selon le chapitre : lois de Newton (système, bilan des forces,
  projection) ; **méthode descendante** pour les dilutions et dosages (partir de la
  formule de base, exprimer chaque inconnue, une seule expression littérale complète
  à la fin, une seule A.N.) ; demi-équations pour l'oxydoréduction (chap. 4). Ne
  jamais fondre une méthode de chapitre dans la méthode générale : chacune a sa
  section nommée dans `physique-methode.ts` (version 7), ou reste dans son chapitre.
- (2026-11-12) **Fiches et leçons : les textes peuvent être longs**, et il veut
  qu'on **fasse ressortir l'essentiel** : entourer les phrases les plus importantes de
  `==…==`, dessiné en **gras simple** (choisi le 2026-11-13 parmi 8 styles : il
  n'aimait pas le surligneur jaune ; classe `mark.surligne` dans `app/globals.css`,
  bouton « Gras » dans la bulle de `SaisieFormule`), sans
  en abuser (une ou deux par section ou par étape). Valable pour tout nouveau
  contenu, y compris les réponses de la tâche planifiée. Fait le 2026-11-12 pour toutes les
  fiches publiées (74 points, le point de niveau le plus bas de chaque section,
  deux si la section en a six ou plus ; versions augmentées).
