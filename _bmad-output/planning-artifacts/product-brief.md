# Brief produit : Scrum Speaking Timer

**Auteur :** Agent métier (BMAD `bmad-agent-analyst`)
**Statut :** Brouillon v1 — prêt pour l'architecte
**Langue :** Français

## 1. Problème

Pendant les cérémonies Scrum, en particulier les Daily, le temps de parole n'est pas maîtrisé.
Une personne parle trop longtemps, les autres n'ont pas la parole, et la réunion dépasse le créneau prévu.
Le Scrum Master doit alors interrompre à la main, ce qui crée des tensions.

## 2. Objectif produit

Une Progressive Web App (PWA) qui aide une équipe à **respecter un temps de parole équitable** pendant ses cérémonies.

Résultat attendu : chaque membre sait combien de temps il lui reste, l'outil signale quand le temps est dépassé, et l'équipe finit dans le créneau.

## 3. Utilisateurs

| Rôle | Besoin principal |
|------|------------------|
| Scrum Master | Lancer la session, faire tourner la parole, voir le bilan |
| Membre de l'équipe | Voir son temps restant quand il a la parole |
| Observateur | Suivre le déroulé sans interagir |

## 4. Périmètre de la V1 (MVP)

Une seule fonctionnalité complète, testée et déployée :

1. **Créer une équipe** : saisir les prénoms des membres (liste mémorisée sur l'appareil).
2. **Définir la durée de la cérémonie** (par défaut : 15 minutes, comme un Daily).
3. **Répartir le temps** : par défaut, temps égal pour chacun, modifiable par membre.
4. **Minuteur par intervention** : passer la parole à la personne suivante, avec un chronomètre visible.
5. **Alerte** : signal visuel et sonore quand le temps individuel est dépassé.
6. **Bilan** : temps de parole réel de chacun à la fin de la session.
7. **Mémoire** : l'équipe et ses réglages sont conservés entre les sessions (stockage local).

## 5. Hors périmètre (V1)

- Comptes utilisateurs et authentification.
- Synchronisation entre plusieurs appareils.
- Intégration avec Jira, Teams, Slack ou Zoom.
- Statistiques sur plusieurs semaines.

## 6. Exigences fonctionnelles

- **RF1** : une équipe contient entre 2 et 15 membres.
- **RF2** : la session démarre, se met en pause et se termine.
- **RF3** : le temps réel de parole de chaque membre est mesuré, pas seulement le temps prévu.
- **RF4** : une alerte se déclenche au dépassement du temps individuel, sans bloquer l'interface.
- **RF5** : le bilan est affiché à la fin et peut être copié en texte.
- **RF6** : les données de l'équipe persistent après rechargement de la page.

## 7. Exigences non fonctionnelles

- **Installation :** l'application s'installe sur mobile et ordinateur depuis le navigateur (PWA).
- **Hors ligne :** l'application fonctionne sans connexion après le premier chargement.
- **Accessibilité :** contrastes suffisants, navigation au clavier, alertes non uniquement sonores.
- **Langues :** interface en français.
- **Portabilité :** le projet se lance à l'identique sur n'importe quelle machine via Docker.

## 8. Critères de succès

- Une session Daily de 15 minutes pour 5 personnes se déroule sans dépassement non signalé.
- Les tests automatisés passent dans le pipeline GitHub Actions.
- L'application déployée sur GitHub Pages est accessible par un lien public.

## 9. Risques

| Risque | Action |
|--------|--------|
| Minuteur qui dérive en arrière-plan sur mobile | Calculer le temps à partir de l'horodatage, pas d'un compteur |
| Perte des données au rechargement | Stockage local avec sauvegarde à chaque changement |
| Mauvaise compatibilité GitHub Pages (chemins) | Configurer la base href au déploiement |

## 10. Questions ouvertes pour l'architecte

1. Le stockage local suffit-il, ou faut-il prévoir un export/import JSON ?
2. Faut-il une gestion d'état dédiée (signals Angular) ou un service simple ?
3. Quelle stratégie de cache hors ligne pour le service worker ?
