---
name: orchestrer-projet
description: Lance une chaîne complète de production logicielle pilotée par un agent orchestrateur, de l'idée à la production, avec des agents BMAD spécialisés (analyste, PM, UX, architecte, développeur, reviewer, déployeur). Utiliser quand l'utilisateur donne une nouvelle idée de produit et veut la faire réaliser de A à Z par des agents, ou dit « orchestre », « lance la chaîne », « nouveau projet à partir de cette idée ».
---

# Orchestrer un projet de l'idée à la production

Cette skill décrit la même organisation que pour le projet Scrum Speaking Timer. Elle sert à reproduire la chaîne sur une nouvelle idée sans la réinventer.

## Principe

L'orchestrateur ne produit pas les livrables. Il délègue chaque étape à un sous-agent qui joue un rôle BMAD, lit le livrable, le contrôle et décide de la suite. Chaque rôle a sa définition dans `.claude/skills/<skill>/SKILL.md`. Le sous-agent lit cette définition, adopte son identité et exécute la mission de façon autonome.

## Entrées

- L'idée du produit, en quelques phrases.
- La langue de travail (français par défaut).
- Le nom du projet (sert au dossier, au dépôt et à l'URL GitHub Pages).

## Étapes

Tiens le journal `_bmad-output/orchestration-log.md` à jour à chaque étape.

1. **Analyse** : délègue à Mary (`bmad-agent-analyst`) la rédaction de `_bmad-output/planning-artifacts/prd.md`. Contrôle : FR numérotées, personas, KPI, périmètre V1 justifié, au moins 4 epics.
2. **Découpage** : délègue à John (`bmad-agent-pm`) les epics et stories avec critères d'acceptation testables. Contrôle : chaque FR est couverte par au moins une story.
3. **Conception en parallèle** :
   - Sally (`bmad-agent-ux-designer`) produit `DESIGN.md` (couleurs en tokens, typographie, composants, accessibilité) et un logo SVG, puis `EXPERIENCE.md` (parcours et états d'erreur).
   - Winston (`bmad-agent-architect`) produit `architecture.md` (choix techniques justifiés, modèle de données, contrats, déploiement).
4. **Développement story par story** : délègue à Amelia (`bmad-agent-dev`) une story à la fois, dans l'ordre des epics. Chaque story doit suivre le cycle rouge, vert, refactor, avec les tests écrits d'abord. Les formulaires valident chaque champ et affichent un message d'erreur sous le champ concerné.
5. **Vérification après chaque story** : l'orchestrateur exécute lui-même les tests et le build. Il ne valide que sur sortie réelle.
6. **Revue indépendante** : un reviewer (méthode `bmad-code-review`) relit le diff et les critères d'acceptation, sans voir le raisonnement de l'agent qui a codé. Verdict : approuvé, ou changements demandés. Les changements demandés repartent chez Amelia.
7. **Déploiement** : la CI n'autorise la publication que si le rapport de revue indique « approuvé ». Vérifier que le site répond en HTTP 200.
8. **Documentation** : README à jour, et lien vers le site en ligne.

## Grille de contrôle d'un livrable

- Présence : le fichier existe et n'est pas vide.
- Complétude : toutes les sections demandées ont un contenu concret.
- Traçabilité : exigence, story, test.
- Cohérence : pas de contradiction avec l'étape précédente.
- Preuve : sortie réelle pour le code (tests, build), citation de fichiers et de lignes pour la revue.

Trois tentatives maximum par livrable. Au-delà, signaler le blocage à l'humain.

## Sorties attendues

- Dépôt Git avec l'historique des étapes.
- Documents dans `_bmad-output/`.
- Application testée, dockerisée et déployée.
- Journal d'orchestration complet, qui permet de rejouer la démarche.
