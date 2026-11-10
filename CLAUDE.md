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

## Stack et architecture

_À remplir._

## Environnement

- Sessions cloud Claude Code, dépôt `pe4kk/project-luno`, branche `main`.
- Accès réseau : registres de paquets, plus `api.twelvedata.com` (la clé est
  injectée par le proxy, aucune clé à gérer dans le code).
- Pas encore de script d'installation.

## Commandes utiles

_À remplir (installation, lancement, tests)._

## Décisions prises

| Date | Décision | Raison |
|------|----------|--------|
| 2026-11-10 | Mémoire du projet tenue dans `CLAUDE.md` à la racine | Chargé automatiquement à chaque session |

## État d'avancement

- 2026-11-10 : dépôt créé, mémoire initialisée, projet décrit. Aucun code.

## Prochaines étapes

1. Trancher : utilisateurs (solo ou comptes), niveau scolaire, clé d'API pour l'IA.
2. Choisir la stack et mettre en place la structure du dépôt.
3. Construire la coque du site (navigation, design) puis les onglets un par un.

## Préférences de l'utilisateur

_À remplir au fil des conversations._
