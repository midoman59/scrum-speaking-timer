# Journal d'orchestration : Scrum Speaking Timer

Tenu par l'agent orchestrateur. Chaque étape indique l'agent qui a produit le livrable et les contrôles effectués par l'orchestrateur.

## Reprise v2 : chaîne à sous-agents

### Étape A : Analyse (Mary, `bmad-agent-analyst`)
- Livrable : [prd.md](./planning-artifacts/prd.md) (746 lignes, 28 FR, 22 NFR, 6 epics, 17 hypothèses)
- Contrôles : présence ✔ complétude ✔ (sections 0 à 9, hypothèses, questions ouvertes) traçabilité ✔ (epics E1 à E6 couvrent les FR) cohérence ✔ (une incohérence signalée, voir décisions)
- Verdict : validé
- Décisions de l'orchestrateur sur les questions ouvertes :
  - **Q1 (observateur distant)** : non en V1. Un seul appareil partagé à l'écran. Raison : pas de serveur, confidentialité préservée. Réversible plus tard.
  - **Q2 (temps alloué)** : total par membre pour toute la session. Pause par intervention, comme le PRD. Le brief disait pause sur la session entière : on garde le PRD, le brief est superseded.
  - **Q3 (répartition manuelle)** : la somme doit égaler exactement la durée de cérémonie. Pas de reliquat.
- Limite relevée : les KPI ne peuvent pas être mesurés par télémétrie (NFR-8, pas de serveur). Ils passeront par un pilote.

### Étape B : Design, logo et parcours (Sally, `bmad-agent-ux-designer`)
- Livrables : [DESIGN.md](./planning-artifacts/DESIGN.md), [EXPERIENCE.md](./planning-artifacts/EXPERIENCE.md), [logo.svg](../public/icons/logo.svg), [favicon.svg](../public/favicon.svg)
- Contrôles : présence ✔ · logo SVG valide ✔ · calcul vérifié ✔ (15 min / 6 = 150 s, la correction E-1 est juste) · contraste minimal relevé 4,83:1 (seuil 3:1 pour bordures, 4,5:1 pour texte)
- Verdict : validé avec réserves (icônes PWA 192/512 px et theme_color à régénérer pendant le développement)
- Décisions de l'orchestrateur sur les écarts E-1 à E-15 :
  - E-1 : correction retenue (2 min 30 s par membre). Mise à jour du PRD à faire.
  - E-2 : bouton « Enregistrer » à la création seulement ; modifications suivantes auto-sauvegardées.
  - E-3 : confirmation de fin de session en bandeau inline, pour respecter FR-19 (pas de modale pendant une intervention).
  - E-4 : réouverture pendant une session en cours → écran Session directement.
  - E-7 : compteur « 07:12 / 15:00 » pour l'observateur retenu, à valider par le client (aucune exigence fonctionnelle ne le couvre encore).
  - E-15 : une alerte par membre et par session retenue.
  - Textes marqués [NOUVEAU] dans EXPERIENCE.md : à valider par le client.
### Étape C : Architecture (Winston, `bmad-agent-architect`)
- Livrable : [architecture.md](./planning-artifacts/architecture.md) (1173 lignes, 19 ADR, 26 incohérences du PRD traitées en annexe A)
- Contrôles : présence ✔ · complétude ✔ (sections 0 à 10) · cohérence ✔ avec le PRD après arbitrage · preuve : à faire au premier build
- Verdict : validé avec réserves
- Décisions de l'orchestrateur :
  - Chemin de déploiement : `/scrum-speaking-timer/` (nom réel du dépôt). Le `/Timer/` provisoire est corrigé.
  - Mesure du temps : `Date.now()` avec garde contre les régressions d'horloge, pas `performance.now()`.
  - Persistance : checkpoint toutes les 5 s et écriture à `pagehide`.
  - Routage : mode hash (ADR-04), pour éviter les 404 au rechargement sur GitHub Pages.
  - Tests : Karma/Jasmine conservés (7 tests déjà verts). Pas de migration vers Vitest en V1.
  - Angular 20 : à vérifier. Une montée de version est à planifier si la fin de support approche.
  - Identifiants : `crypto.randomUUID` au lieu de `Date.now()`, pour éviter les collisions.
### Étape D : Découpage en stories (John, `bmad-agent-pm`)
- Livrable : [epics-et-stories.md](./planning-artifacts/epics-et-stories.md) (6 epics, 76 stories, 7 lots)
- Contrôles : présence ✔ · traçabilité ✔ (28 FR et 22 NFR, aucun orphelin, vérifié par script) · ordre sans dépendance circulaire ✔
- Verdict : validé
- Décisions de l'orchestrateur :
  - E-5 (champ vide pour un membre ajouté en manuel) : on suit ADR-08, 30 s.
  - E-7 (chronomètre de session pour l'observateur) : hors lot. Décision client requise.
  - Point d'entrée « Nouvelle équipe » : à définir pendant le développement du lot 2.
  - Angular 20 et Vitest : à réviser après le spike S-E1-01.
### Étape E : Développement lots 1 et 2 (Amelia, `bmad-agent-dev`)
- Livrables : 17 commits locaux (56414b5 à 7669e68), notes dans [dev-notes.md](./dev-notes.md)
- Stories faites : S-E1-01 à S-E1-06, S-E1-08, S-E2-01 à S-E2-07, S-E2-12, S-E3-01, S-E3-02. Lots 3 à 7 non commencés.
- Contrôles de l'orchestrateur (relancés moi-même) : `ng test` 98 SUCCESS ✔ · build production avec base href `/scrum-speaking-timer/` ✔ · check-privacy 11 fichiers, aucune URL externe ✔
- Verdict : validé pour la revue, non poussé sur GitHub
- Décisions à confirmer par le PO : « jEAN » (épopée) contre « JEAN » (PRD 6.3, INV-07) ; libellé « Nouvelle équipe » ; textes sans source dans la table de messages.

### Étape F : Revue indépendante lots 1 et 2 (reviewer)
- Livrable : [revue-lots-1-2.md](./revue-lots-1-2.md)
- Verdict : CHANGEMENTS DEMANDÉS (3 bloquants, 6 importants, 12 mineurs)
- Bloquants : C-1 (test responsive et accessibilité absent), C-2 (motif d'impossibilité au-dessus du bouton au lieu de dessous), C-3 (message de données illisibles jamais affiché)
- Renvoi à Amelia pour correction des bloquants et des importants. Mineurs repoussés. M-1 (« jEAN ») : décision client.
- Gate : la revue sera rejouée après correction. Le déploiement reste bloqué tant que le verdict n'est pas APPROUVÉ.

### Étape F bis : Corrections (Amelia)
- 9 commits (704d5fc à ecf8d47 et suivants) : C-1, C-2, C-3, I-1 à I-6 traités. M-1 non modifié (décision client).
- Contrôles de l'orchestrateur (relancés moi-même) : `ng test` 124 SUCCESS (98 avant) ✔ · build production base href `/scrum-speaking-timer/` ✔ · check-privacy 11 fichiers, aucune URL externe ✔ · e2e 18 passed ✔
- Non traité, à signaler : ADR-05 non mis à jour ; message FR-25 d'échec d'écriture et bandeau B-1 non encore affichés.

### Étape F ter : Seconde revue (reviewer neuf)
- Livrable : [revue-2-lots-1-2.md](./revue-2-lots-1-2.md)
- Verdict : CHANGEMENTS DEMANDÉS (0 bloquant, 3 importants, 4 mineurs)
- Vérifié par le reviewer : C-1, C-2, I-1 à I-4 corrigés et prouvés ; C-3 et I-5, I-6 corrigés avec réserves.
- Importants renvoyés à Amelia (étape F quater) : N-1 (bandeau FR-25 absent), N-2 (focus sur le mauvais champ), N-3 (politique de sauvegarde non consignée dans l'ADR-05, perte silencieuse à la quatrième corruption).
- Mineurs repoussés : N-4 (check-privacy), N-5 (annonces), N-6 (échec de copie), N-7 (documents non versionnés, à traiter par l'orchestrateur).

### Étape F quater : Corrections N-1 à N-3 (Amelia)
- Commits : c011f71 (N-1, bandeau B-1 FR-25), a9553b9 (N-2, focus sur la première erreur), 2b966e2 (N-3, perte signalée, ADR-05 mis à jour)
- Contrôles de l'orchestrateur (relancés moi-même) : `ng test` 131 SUCCESS (124 avant) ✔ · build production base href `/scrum-speaking-timer/` ✔ · check-privacy 11 fichiers, aucune URL externe ✔ · e2e 18 passed ✔
- Point à valider par le PO : texte du bandeau de perte de sauvegarde, proposition non présente dans le PRD.

### Étape F quinquies : Troisième revue (reviewer neuf)
- Livrable : [revue-3-lots-1-2.md](./revue-3-lots-1-2.md)
- Verdict : CHANGEMENTS DEMANDÉS (0 bloquant, 2 importants, 1 mineur)
- N-1, N-2, N-3, I-5, I-6 : corrigés et prouvés.
- Renvoyé à Amelia (troisième tentative, dernière autorisée par le processus) : I-A (bandeau B-1 ne revient pas après fermeture), I-B (documentation incohérente avec la rotation à trois emplacements), M-A (message « remplacée » affiché avant l'écriture).
- Décisions client non jugées : « jEAN » ou « JEAN », texte du bandeau de perte.
- Si le verdict reste négatif après cette tentative, blocage signalé à l'humain.

### Étape F sexies : Corrections I-A, I-B, M-A (Amelia, tentative 3)
- I-A corrigé et prouvé : commit 5770a88 (bandeau B-1 rouvert à chaque nouvel échec d'écriture).
- M-A corrigé et prouvé : commit 9798e8b (backupLost seulement après écriture réussie).
- I-B partiel : `epics-et-stories.md` réécrit mais non suivi par git (non commité) ; `architecture.md` non modifié pour les lignes 491 et 1050 (fichier porteur de modifications non commitées, réécriture v2 de Winston).
- Contrôles de l'orchestrateur (relancés moi-même) : `ng test` 133 SUCCESS ✔ · e2e 18 passed ✔ (build et privacy validés par Amelia, à relancer avant publication).

### BLOCAGE HUMAIN : trois tentatives épuisées sur la revue lots 1-2
- Verdict de la troisième revue : CHANGEMENTS DEMANDÉS, seul reste ouvert I-B (documentation de la rotation à trois emplacements).
- Options proposées au client :
  1. Autoriser l'orchestrateur à corriger les deux lignes de `architecture.md` (491, 1050) et à commiter la documentation de planification, puis rejouer la revue une dernière fois.
  2. Accepter le lot 1-2 en l'état, avec I-B consigné comme dette documentaire.
- Décisions client en attente : prénom « jEAN » ou « JEAN » ; texte du bandeau de perte de sauvegarde (proposition non validée).
### Étape F : Revue indépendante (reviewer) : en attente
### Étape G : Déploiement : en attente

---

## Première passe (v1), conservée pour mémoire

### Étape 1 : Métier : validé (brief sommaire, remplacé par le PRD)
### Étape 2 : Architecture : validé (remplacé par la réécriture de Winston)
### Étape 3 : Développement : validé, puis à refaire avec Amelia
### Étape 4 : Tests : 7 tests validés, à étendre
### Étape 5 : Revue : non faite en v1
### Étape 6 : Conteneurisation et pipeline : écrit, Docker non vérifié
### Étape 7 : Déploiement : validé (GitHub Pages en ligne)
