---
title: Scrum Speaking Timer
document: Epics et stories V1
created: 2026-11-08
statut: Brouillon v1, proposé pour exécution (à valider par le Product Owner)
auteur: John, Product Manager (BMAD bmad-agent-pm)
sources: prd.md (référence fonctionnelle), architecture.md (choix techniques et ADR), DESIGN.md, EXPERIENCE.md
langue: Français
---

# Epics et stories : Scrum Speaking Timer V1

## 0. Objet et règles de lecture

Ce document découpe la V1 décrite dans le [PRD](./prd.md) en epics E1 à E6 et en stories exécutables. Il ne réécrit ni le PRD ni l'architecture : les règles de comportement viennent du PRD, les choix techniques de l'[architecture](./architecture.md), les écrans des documents [DESIGN](./DESIGN.md) et [EXPERIENCE](./EXPERIENCE.md).

- Les chemins de fichiers sont relatifs à la racine du dépôt `C:\Projects\Timer` et suivent l'arborescence cible de l'architecture (section 5.2).
- Chaque story suit le même gabarit : identifiant, titre, intention (en tant que / je veux / afin de), exigences couvertes, dépendances, estimation, fichiers, tests, critères d'acceptation au format Given / When / Then.
- Estimation en points relatifs : 1, 2 ou 3. Une story jugée à 5 a été découpée.
- Les textes entre guillemets sont les messages exacts du PRD ou de EXPERIENCE. Quand un texte n'existe dans aucun document source, il est marqué **[À VALIDER]**.
- Les tests unitaires et de composants s'écrivent avec Karma et Jasmine, conservés pour la V1 (voir section 1).

---

## 1. Décisions respectées

Ces décisions sont tenues pour acquises. Les stories ne les remettent pas en cause.

| Décision | Effet sur les stories |
|---|---|
| Un seul appareil partagé en V1, sans serveur (D1, ADR-18) | Aucune story de synchronisation ni de compte. Une seule Équipe active par navigateur. |
| Temps alloué = total par Membre pour toute la Session (D2, H-7) | Le temps parlé s'accumule sur toutes les Interventions. Voir S-E4-02, S-E4-06. |
| Pause par Intervention, pas par Session (D3, FR-13) | Aucun état « Session en pause ». Voir S-E4-03, S-E4-08. |
| Répartition manuelle : somme exacte (D4, INV-04) | Pas de reliquat. Le bouton Enregistrer reste désactivé tant que la somme n'est pas exacte. Voir S-E3-06. |
| Export et import JSON dans la V1 (D5, ADR-19) | Voir S-E6-07 à S-E6-09. |
| Une seule alerte de dépassement par Membre et par Session (INV-14, A4, E-15) | H-14 du PRD est remplacé. Voir S-E5-01, S-E5-06. |
| Angular 20 et tests Karma / Jasmine conservés pour la V1 | Pas de Vitest. Le spike S-E1-01 vérifie que `ng test` fonctionne. Aucune story de migration de runner. |
| Routage en mode hash pour GitHub Pages (ADR-04) | `withHashLocation()`, gardes par phase de Session. Voir S-E1-03, S-E4-11. |
| Base href `/scrum-speaking-timer/` (ADR-16) | Valeur lue de la variable `APP_BASE_HREF`, jamais écrite en dur. Voir S-E1-13. |

---

## 2. Traçabilité FR et NFR vers les stories

Chaque FR et chaque NFR du PRD pointe vers au moins une story. Aucune FR n'est orpheline.

### 2.1 Exigences fonctionnelles

| Exigence | Sujet | Stories | Epic |
|---|---|---|---|
| FR-1 | Créer une Équipe | S-E2-01, S-E2-05, S-E2-06 | E2 |
| FR-2 | Ajouter un Membre | S-E2-02, S-E2-05, S-E2-07, S-E3-08 | E2, E3 |
| FR-3 | Modifier ou supprimer un Membre | S-E2-08, S-E2-09, S-E3-08 | E2, E3 |
| FR-4 | Ordonner les Membres | S-E2-10 | E2 |
| FR-5 | Modifier Nom d'équipe et Durée | S-E2-11, S-E3-03, S-E3-08, S-E4-12 | E2, E3, E4 |
| FR-6 | Reprendre l'Équipe à chaque visite | S-E2-05, S-E2-12, S-E4-11 | E2, E4 |
| FR-7 | Fixer la Durée de cérémonie | S-E3-01, S-E3-03 | E3 |
| FR-8 | Répartition égale | S-E3-02, S-E3-04 | E3 |
| FR-9 | Répartition manuelle | S-E2-04, S-E3-05, S-E3-06, S-E3-07, S-E3-09 | E3 |
| FR-10 | Démarrer la Session | S-E4-02, S-E4-05 | E4 |
| FR-11 | Passer la parole au Membre suivant | S-E4-02, S-E4-06 | E4 |
| FR-12 | Choisir le Membre courant | S-E4-02, S-E4-07 | E4 |
| FR-13 | Mettre en Pause et reprendre | S-E4-03, S-E4-08 | E4 |
| FR-14 | Mesurer le temps de parole | S-E4-01, S-E4-05, S-E4-14 | E4 |
| FR-15 | Terminer la Session | S-E4-03, S-E4-09 | E4 |
| FR-16 | Reprise après rechargement ou fermeture | S-E4-04, S-E4-10, S-E4-11, S-E4-15 | E4 |
| FR-17 | Signaler le dépassement | S-E5-01, S-E5-02, S-E5-06, S-E5-07 | E5 |
| FR-18 | Alerte sonore | S-E5-04, S-E5-05, S-E5-07 | E5 |
| FR-19 | Alerte non bloquante | S-E5-03, S-E5-07 | E5 |
| FR-20 | Afficher le Bilan | S-E6-01, S-E6-02 | E6 |
| FR-21 | Copier le Bilan en texte | S-E6-03, S-E6-04 | E6 |
| FR-22 | Copie de repli | S-E6-05 | E6 |
| FR-23 | Conserver le dernier Bilan | S-E6-06 | E6 |
| FR-24 | Conserver l'Équipe et les réglages | S-E2-03, S-E2-05, S-E4-04, S-E5-05, S-E6-07 | E2, E4, E5, E6 |
| FR-25 | Erreurs de stockage | S-E2-03, S-E2-04, S-E2-13 | E2 |
| FR-26 | Exporter l'Équipe | S-E6-07 | E6 |
| FR-27 | Importer une Équipe | S-E6-08, S-E6-09 | E6 |
| FR-28 | Réinitialiser les données | S-E2-14 | E2 |

### 2.2 Exigences non fonctionnelles

| Exigence | Sujet | Stories | Epic |
|---|---|---|---|
| NFR-1 | Installable (PWA) | S-E1-02, S-E1-14 | E1 |
| NFR-2 | Hors ligne | S-E1-09, S-E1-12, S-E6-10 | E1, E6 |
| NFR-3 | Mise à jour non interruptive | S-E1-10 | E1 |
| NFR-4 | Déploiement sous `/<repo>/` | S-E1-03, S-E1-11, S-E1-13, S-E1-17 | E1 |
| NFR-5 | Performance (LCP, poids JS) | S-E1-13, S-E1-14, S-E2-05 | E1, E2 |
| NFR-6 | Fiabilité du minuteur | S-E4-01, S-E4-14 | E4 |
| NFR-7 | Réactivité inférieure à 200 ms | S-E4-06 | E4 |
| NFR-8 | Aucune donnée sur serveur | S-E1-04, S-E1-05, S-E6-10 | E1, E6 |
| NFR-9 | Données locales uniquement | S-E2-03, S-E2-14 | E2 |
| NFR-10 | Presse-papiers (écriture seule) | S-E6-04 | E6 |
| NFR-11 | Contrastes | S-E1-06, S-E6-11 | E1, E6 |
| NFR-12 | Clavier | S-E4-07, S-E6-11 | E4, E6 |
| NFR-13 | Lecteurs d'écran (aria-live) | S-E4-13, S-E5-02, S-E6-11 | E4, E5, E6 |
| NFR-14 | Information non portée par la couleur seule | S-E5-02, S-E6-02 | E5, E6 |
| NFR-15 | Cibles tactiles 44 px | S-E1-07, S-E6-12 | E1, E6 |
| NFR-16 | Réduction des mouvements | S-E1-07 | E1 |
| NFR-17 | Langue française (`lang="fr"`) | S-E1-02, S-E1-08, S-E6-11 | E1, E6 |
| NFR-18 | Responsive 320 px sans défilement horizontal | S-E1-07, S-E6-12 | E1, E6 |
| NFR-19 | Navigateurs cibles | S-E6-13 | E6 |
| NFR-20 | Format des durées et des dates | S-E1-08, S-E6-02 | E1, E6 |
| NFR-21 | Tests et CI | S-E1-05, S-E1-15, S-E1-16, S-E6-10 | E1, E6 |
| NFR-22 | Déploiement reproductible (Docker) | S-E1-11, S-E1-16 | E1 |

---

## 3. Epics

### E1 : Socle PWA, déploiement et hors ligne

- **Objectif :** une application installable, hors ligne et publiée sur GitHub Pages, même vide.
- **Exigences :** aucune FR fonctionnelle ; NFR-1, NFR-2, NFR-3, NFR-4, NFR-5, NFR-8, NFR-11, NFR-15, NFR-16, NFR-17, NFR-18, NFR-20, NFR-21, NFR-22.
- **Critère de fin :** build de production installable, déployé sur GitHub Pages, tests hors ligne et test d'absence de requête tierce verts en CI.
- **Stories :** S-E1-01 à S-E1-17.

### E2 : Équipe et Mémoire

- **Objectif :** créer, modifier et retrouver une équipe.
- **Exigences :** FR-1 à FR-6, FR-24, FR-25, FR-28 ; règles 6.1 à 6.3 ; NFR-9.
- **Critère de fin :** une équipe créée est retrouvée après rechargement et après redémarrage du navigateur ; les règles 6.1 à 6.3 sont couvertes par des tests.
- **Stories :** S-E2-01 à S-E2-14.

### E3 : Durée et répartition du temps

- **Objectif :** fixer la durée de cérémonie et répartir le temps à égalité ou à la main.
- **Exigences :** FR-2, FR-3, FR-5, FR-7, FR-8, FR-9 ; règles 6.4 et 6.5 ; INV-04, INV-05, INV-08, INV-09.
- **Critère de fin :** la somme des Temps alloués égale la Durée de cérémonie dans tous les cas testés (dont 15 min pour 7 Membres et 1 min pour 2 Membres, ce dernier cas étant refusé par la règle des 30 s) ; le parcours UJ-2 passe en E2E.
- **Stories :** S-E3-01 à S-E3-09.

### E4 : Session et minuteur d'Intervention

- **Objectif :** dérouler la parole, mesurer le temps réel, gérer la Pause et la reprise.
- **Exigences :** FR-5 (verrou), FR-6 (gardes), FR-10 à FR-16 ; NFR-6, NFR-7, NFR-12, NFR-13.
- **Critère de fin :** test à horloge simulée (SM-4) vert ; reprise après rechargement vérifiée en E2E ; aucune alerte ni son à ce stade (ils relèvent de E5).
- **Stories :** S-E4-01 à S-E4-15.

### E5 : Alerte de dépassement

- **Objectif :** signaler le dépassement sans bloquer, par un signal visuel, textuel et sonore.
- **Exigences :** FR-17, FR-18, FR-19 ; NFR-13 (annonce assertive), NFR-14.
- **Critère de fin :** alerte annoncée par lecteur d'écran, son déclenché une seule fois par Membre et par Session, aucun blocage d'interface testé en E2E.
- **Stories :** S-E5-01 à S-E5-07.

### E6 : Bilan, partage et portabilité

- **Objectif :** présenter le bilan, le copier et sauvegarder l'équipe.
- **Exigences :** FR-20 à FR-23, FR-26, FR-27 ; NFR-10, NFR-11, NFR-12, NFR-13, NFR-18, NFR-19, NFR-21 (parcours complet), SM-1 à SM-3 (pilote).
- **Critère de fin :** copie texte validée sur Chrome, Safari et Firefox ; import et export d'une équipe valides ; parcours complet UJ-1 à UJ-4 vert en E2E ; pilote de 4 semaines lancé avec 2 équipes (SM-1 à SM-3).
- **Stories :** S-E6-01 à S-E6-14.

---

## 4. Stories

### 4.1 Epic E1 : Socle PWA, déploiement et hors ligne

#### S-E1-01 : Spike S0, vérifier Karma et le routage en hash sur le build de production

- **En tant que** développeur, **je veux** vérifier que les tests Karma s'exécutent et que le routage en hash fonctionne sur le build de production, **afin de** valider le socle technique avant tout développement métier.
- **Exigences :** NFR-4, NFR-21 ; prépare FR-6 et FR-16.
- **Dépendances :** aucune.
- **Estimation :** 2.
- **Fichiers :** `karma.conf.js`, `angular.json`, `package.json`, `src/app/app.config.ts`, `src/app/app.routes.ts` (route provisoire), `src/app/app.spec.ts` (test factice).
- **Tests :** `ng test --watch=false` ; `ng build --configuration production --base-href /scrum-speaking-timer/` puis service statique sous ce préfixe.
- **Critères d'acceptation :**
  1. Given le projet Angular 20.3.x, When `ng test --watch=false` est lancé, Then Karma/Jasmine exécute au moins un spec et se termine avec le code 0 en ChromeHeadless.
  2. Given le build de production avec `--base-href /scrum-speaking-timer/`, When le dossier `dist` est servi sous ce préfixe, Then `index.html` contient le même `<base href>` et la page s'affiche.
  3. Given `withHashLocation()` activé, When l'URL `/scrum-speaking-timer/#/session` est ouverte directement ou rechargée, Then la page répond sans 404 et la route provisoire s'affiche.
  4. Given un échec de Karma ou du routage, When le spike est clos, Then l'échec est consigné avec sa cause dans la section 8 et escaladé au PO, sans migration de runner.
  5. Given le spike terminé, Then la version exacte d'Angular, la durée des tests et le résultat sont consignés dans la section 8.

#### S-E1-02 : Initialiser le shell PWA

- **En tant que** Scrum Master, **je veux** installer l'application sur mon poste ou mon téléphone, **afin de** la lancer comme une application.
- **Exigences :** NFR-1, NFR-17.
- **Dépendances :** S-E1-01.
- **Estimation :** 2.
- **Fichiers :** `src/manifest.webmanifest`, `src/index.html`, `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/logo.svg` (source existante), `angular.json`, `ngsw-config.json`.
- **Tests :** build de production ; contrôle JSON du manifeste dans un test unitaire simple ; Lighthouse dans S-E1-14.
- **Critères d'acceptation :**
  1. Given le build de production, When le manifeste est lu, Then il contient `name`, `short_name`, `start_url: "./"`, `scope: "./"`, `display: "standalone"`, `theme_color: "#4338CA"`, `background_color: "#FFFFFF"`.
  2. Given le manifeste, Then il référence des icônes PNG de 192 px et 512 px présentes dans `public/icons/`.
  3. Given `src/index.html`, When la page est lue, Then elle porte `lang="fr"`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, une balise `theme-color` et le titre « Scrum Speaking Timer ».
  4. Given les PNG générés depuis `logo.svg`, Then la version maskable est aussi produite (point ouvert 1 de DESIGN.md).

#### S-E1-03 : Routes en hash et base href configurable

- **En tant que** Scrum Master, **je veux** que chaque écran ait une adresse qui fonctionne après rechargement sur GitHub Pages, **afin de** ne pas tomber sur une erreur 404.
- **Exigences :** NFR-4 ; prépare FR-6, FR-16.
- **Dépendances :** S-E1-01.
- **Estimation :** 2.
- **Fichiers :** `src/app/app.config.ts`, `src/app/app.routes.ts`, `src/app/features/team-editor/team-editor.page.ts`, `src/app/features/preparation/preparation.page.ts`, `src/app/features/session/session.page.ts`, `src/app/features/summary/summary.page.ts` (pages provisoires), `src/app/app.routes.spec.ts`.
- **Tests :** unitaire sur la configuration du routeur ; test de composant sur les pages provisoires.
- **Critères d'acceptation :**
  1. Given `app.config.ts`, When le routeur est configuré, Then il utilise `withHashLocation()` et aucune autre stratégie d'URL.
  2. Given les routes `/equipe`, `/preparation`, `/session` et `/bilan`, When chacune est ouverte en hash, Then la page provisoire correspondante affiche son titre `h1`.
  3. Given la route vide `''`, When l'application démarre, Then elle redirige vers `/equipe` (les règles selon l'état sont ajoutées en S-E4-11).
  4. Given le code source, When on recherche le préfixe `/scrum-speaking-timer` en dur, Then aucune occurrence n'est trouvée (la valeur vient de `APP_BASE_HREF`).

#### S-E1-04 : CSP en balise meta et script de contrôle de confidentialité

- **En tant que** responsable de la confidentialité, **je veux** que l'application ne puisse charger aucune ressource tierce, **afin de** garantir qu'aucune donnée d'équipe ne quitte l'appareil.
- **Exigences :** NFR-8.
- **Dépendances :** S-E1-02.
- **Estimation :** 2.
- **Fichiers :** `src/index.html` (CSP), `scripts/check-privacy.mjs`, `package.json` (script `check:privacy`).
- **Tests :** exécution du script sur un `dist` de test contenant et ne contenant pas d'URL externe.
- **Critères d'acceptation :**
  1. Given `src/index.html`, When la balise CSP est lue, Then elle contient exactement les directives de l'ADR-12 (`default-src 'self'`, `connect-src 'self'`, `object-src 'none'`, `form-action 'none'`, etc.).
  2. Given un `dist` contenant une URL absolue vers un autre domaine, When `npm run check:privacy` est lancé, Then le script se termine avec le code 1 et affiche le fichier et l'URL fautive.
  3. Given un `dist` sans URL externe, When le script est lancé, Then il se termine avec le code 0.
  4. Given la feuille de styles et les polices, Then aucune police ni feuille de style d'un CDN n'est référencée (polices système uniquement).

#### S-E1-05 : Playwright et garde réseau sur tout le parcours

- **En tant que** testeur, **je veux** un outil E2E qui échoue à la moindre requête hors de l'application, **afin de** prouver automatiquement l'absence de données sortantes.
- **Exigences :** NFR-8, NFR-21 ; SM-8.
- **Dépendances :** S-E1-03, S-E1-04.
- **Estimation :** 2.
- **Fichiers :** `playwright.config.ts`, `e2e/fixtures.ts`, `e2e/privacy-network.spec.ts`, `package.json` (script `e2e`).
- **Tests :** le spec `privacy-network.spec.ts` lui-même sur la page provisoire.
- **Critères d'acceptation :**
  1. Given Playwright installé, When `npm run e2e` est lancé, Then le projet `chromium` s'exécute et passe.
  2. Given `e2e/fixtures.ts`, When une page fait une requête vers une origine différente de celle de l'application, Then le test échoue avec un message qui nomme l'URL.
  3. Given la page d'accueil chargée, When toutes les requêtes sont interceptées, Then aucune requête hors origine n'est émise.

#### S-E1-06 : Jetons de couleur, focus visible et contrastes

- **En tant que** utilisateur malvoyant, **je veux** des couleurs contrastées et un focus visible, **afin de** suivre l'écran à distance et au clavier.
- **Exigences :** NFR-11 ; NFR-14 (base).
- **Dépendances :** S-E1-02.
- **Estimation :** 2.
- **Fichiers :** `src/styles.css`, `src/app/core/design/contrast.spec.ts` (test des ratios), `src/app/core/design/contrast.ts` (calcul utilitaire, hors domaine métier).
- **Tests :** unitaire sur les couples de DESIGN.md section 3.
- **Critères d'acceptation :**
  1. Given `styles.css`, When la feuille est lue, Then les jetons de DESIGN.md section 2.2 sont définis sur `:root`, redéfinis sous `@media (prefers-color-scheme: dark)` avec la garde `:root:not([data-theme="light"])`, et sous `:root[data-theme="dark"]`.
  2. Given les couples texte/fond de DESIGN.md section 3, When le test calcule les ratios, Then chaque couple de texte atteint 4,5 : 1 et chaque couple de composant atteint 3 : 1.
  3. Given un élément interactif, When il a le focus, Then un anneau de 3 px `var(--color-focus)` avec décalage de 2 px est visible, et aucun `outline: none` n'est présent sans remplacement.
  4. Given `body`, Then il a un fond explicite `var(--color-bg)`.

#### S-E1-07 : Mise en page responsive, cibles 44 px et réduction des mouvements

- **En tant que** utilisateur mobile, **je veux** une page en colonne unique lisible à 320 px, **afin de** participer depuis mon téléphone.
- **Exigences :** NFR-15, NFR-16, NFR-18.
- **Dépendances :** S-E1-06.
- **Estimation :** 2.
- **Fichiers :** `src/styles.css`, `src/app/app.ts` (conteneur de page), `src/app/shared/layout.css` (si besoin), `e2e/responsive-a11y.spec.ts` (partie 320 px, première version).
- **Tests :** E2E 320 px sur les pages provisoires ; test de composant pour la classe de cible.
- **Critères d'acceptation :**
  1. Given une largeur de 320 px, When une page est affichée, Then `scrollWidth` est inférieur ou égal à `clientWidth` (pas de défilement horizontal) et la marge latérale est de 16 px.
  2. Given un bouton, une case ou une ligne de Membre, Then sa zone cliquable mesure au moins 44 × 44 px (`--target-min`).
  3. Given `prefers-reduced-motion: reduce`, When une transition de bouton se joue, Then sa durée est de 0 ms.

#### S-E1-08 : Socle de formatage et messages

- **En tant que** développeur, **je veux** des fonctions de format et une table de messages uniques, **afin que** les durées et les textes soient identiques partout.
- **Exigences :** NFR-17, NFR-20.
- **Dépendances :** S-E1-01.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/format.ts`, `src/app/core/domain/format.spec.ts`, `src/app/core/domain/messages.ts`, `src/app/core/domain/messages.spec.ts`.
- **Tests :** unitaires purs, sans Angular.
- **Critères d'acceptation :**
  1. Given 225 secondes, When `formatMmSs` est appelée, Then elle renvoie « 03:45 ». Given 7 380 secondes, Then elle renvoie « 123:00 » (pas de limite de minutes, A24).
  2. Given 3 599 secondes, When `formatClock` est appelée, Then elle renvoie « 59:59 » ; Given 3 600 secondes, Then « 1:00:00 ».
  3. Given un dépassement de 20 000 ms, When `formatOverrun` est appelée, Then elle renvoie « +00:20 » ; Given 1 ms de dépassement, Then « +00:01 » (arrondi au supérieur, minimum 1 s).
  4. Given une date du 8 novembre 2026, When `formatDateFr` est appelée, Then elle renvoie « 08/11/2026 ».
  5. Given `messages.ts`, When le test lit les codes d'erreur, Then chaque code possède exactement un texte français, identique à celui de PRD section 6.

#### S-E1-09 : Service worker et cache de l'application

- **En tant que** Scrum Master, **je veux** que l'application se charge sans réseau après la première visite, **afin de** l'utiliser même si la connexion est coupée.
- **Exigences :** NFR-2.
- **Dépendances :** S-E1-02.
- **Estimation :** 2.
- **Fichiers :** `ngsw-config.json`, `src/app/app.config.ts` (enregistrement `registerWhenStable:30000`).
- **Tests :** contrôle de `ngsw-config.json` dans un test unitaire ; E2E dans S-E1-12.
- **Critères d'acceptation :**
  1. Given `ngsw-config.json`, When il est lu, Then il contient un seul `assetGroup` `app` en `prefetch` (`index.html`, JS, CSS, manifeste, icônes) et `dataGroups` vide.
  2. Given le build de production servi, When la page est chargée, Then le service worker est enregistré après stabilisation (`registerWhenStable:30000`).
  3. Given `ngsw-config.json`, Then aucune URL tierce n'y figure.

#### S-E1-10 : Mise à jour non interruptive

- **En tant que** Scrum Master, **je veux** qu'une mise à jour ne coupe jamais une Session en cours, **afin de** ne pas perdre le déroulé du Daily.
- **Exigences :** NFR-3 ; ADR-11.
- **Dépendances :** S-E1-09.
- **Estimation :** 1.
- **Fichiers :** `src/app/core/update/update-policy.ts` (ou intégré à `app.ts`), `src/app/core/update/update-policy.spec.ts`.
- **Tests :** unitaire avec `SwUpdate` simulé.
- **Critères d'acceptation :**
  1. Given un `SwUpdate` qui signale une version prête, When la politique de mise à jour s'exécute, Then `activateUpdate()` n'est jamais appelé.
  2. Given une nouvelle version publiée pendant une Session en cours, When le SM recharge la page, Then la nouvelle version est appliquée au chargement complet suivant (vérification manuelle au pilote, risque T6).
  3. Given l'interface, Then aucune invite de mise à jour n'est affichée en V1 (A12).

#### S-E1-11 : Conteneur Docker multi-étapes et Compose

- **En tant que** mainteneur, **je veux** lancer l'application identiquement partout avec Docker, **afin de** tester le build servi sous le préfixe de production.
- **Exigences :** NFR-22, NFR-4.
- **Dépendances :** S-E1-03.
- **Estimation :** 3.
- **Fichiers :** `Dockerfile` (existant à la racine, à mettre à jour), `docker/nginx.conf` (à créer ; le fichier `nginx.conf` racine est à déplacer ou supprimer), `docker-compose.yml` (existant, services `web` et `dev`), `.dockerignore`, `.nvmrc`.
- **Tests :** `docker build` et `docker compose up -d web` dans la CI (S-E1-16) ; contrôle HTTP scripté.
- **Critères d'acceptation :**
  1. Given le Dockerfile, When l'image est construite, Then l'étape `build` utilise `node:22-alpine` et l'étape `web` utilise `nginx:1.27-alpine` avec le contenu de `dist` sous `/usr/share/nginx/html/scrum-speaking-timer/`.
  2. Given `docker compose up -d web`, When `GET http://localhost:8080/scrum-speaking-timer/` est appelé, Then la réponse est 200 ; `GET /` redirige vers `/scrum-speaking-timer/`.
  3. Given `docker/nginx.conf`, Then `index.html` et `ngsw.json` ont `Cache-Control: no-cache`, et les fichiers hachés ont un cache long.
  4. Given le service `dev` (profil `dev`), When il est lancé, Then `ng serve` répond sur le port 4200.

#### S-E1-12 : Test hors ligne sur le service web

- **En tant que** testeur, **je veux** un test qui coupe le réseau après le premier chargement, **afin de** prouver que l'application fonctionne hors ligne.
- **Exigences :** NFR-2 ; SM-5 (partiel).
- **Dépendances :** S-E1-05, S-E1-09, S-E1-11.
- **Estimation :** 2.
- **Fichiers :** `e2e/offline.spec.ts`, `e2e/fixtures.ts`.
- **Tests :** ce spec est le test.
- **Critères d'acceptation :**
  1. Given le service `web` lancé et une première visite, When `navigator.serviceWorker.ready` est résolu, Then `context.setOffline(true)` puis rechargement affiche l'écran provisoire.
  2. Given le mode hors ligne, When la navigation par hash entre les pages provisoires est faite, Then chaque page s'affiche.
  3. Given le mode hors ligne, Then aucune requête vers une origine externe n'est tentée.

#### S-E1-13 : Contrôles de build : base href et budget JavaScript

- **En tant que** mainteneur, **je veux** que le build échoue si le chemin de déploiement ou le poids du JavaScript sont incorrects, **afin de** éviter une application cassée sur GitHub Pages.
- **Exigences :** NFR-4, NFR-5 ; H-17.
- **Dépendances :** S-E1-03.
- **Estimation :** 2.
- **Fichiers :** `scripts/check-base-href.mjs`, `scripts/check-bundle.mjs`, `package.json` (scripts `check:base-href`, `check:bundle`, `build:prod`).
- **Tests :** exécution des scripts sur des `dist` de test valides et invalides.
- **Critères d'acceptation :**
  1. Given `APP_BASE_HREF` non défini, When `check:base-href` est lancé, Then le script échoue avec un message qui demande de définir la variable.
  2. Given `APP_BASE_HREF=/scrum-speaking-timer/` et un `index.html` correspondant, Then le script réussit ; avec un `<base href>` différent, il échoue.
  3. Given le manifeste ou `ngsw.json` contenant un chemin absolu hors préfixe, Then le script échoue.
  4. Given le JavaScript initial, When `check:bundle` mesure sa taille gzip, Then le script échoue au-delà de 300 Kio et réussit en dessous.

#### S-E1-14 : Lighthouse CI : installabilité, accessibilité et LCP

- **En tant que** mainteneur, **je veux** que Lighthouse valide l'installabilité, l'accessibilité et le temps d'affichage à chaque build, **afin de** détecter les régressions de PWA.
- **Exigences :** NFR-1, NFR-5 ; SM-6, SM-7.
- **Dépendances :** S-E1-02, S-E1-11.
- **Estimation :** 2.
- **Fichiers :** `lighthouserc.json`, `package.json` (script `lhci`).
- **Tests :** `lhci autorun` sur le service web.
- **Critères d'acceptation :**
  1. Given `lighthouserc.json`, When `lhci autorun` est lancé sur `http://localhost:8080/scrum-speaking-timer/`, Then l'accessibilité est au moins 0,95, le LCP en profil mobile 4G simulé est au plus 2 500 ms, et les audits d'installabilité passent.
  2. Given un score sous le seuil, Then la commande échoue.
  3. Given une version de Lighthouse qui a renommé le score « Installable » (risque T5), Then les audits équivalents sont utilisés et la substitution est consignée dans `lighthouserc.json`.

#### S-E1-15 : CI qualité (ci.yml, job quality)

- **En tant que** mainteneur, **je veux** qu'une pull request passe lint, tests et build avant fusion, **afin de** protéger `main`.
- **Exigences :** NFR-21.
- **Dépendances :** S-E1-04, S-E1-05, S-E1-13.
- **Estimation :** 3.
- **Fichiers :** `.github/workflows/ci.yml`, `.github/pull_request_template.md`, `eslint.config.mjs` (règle `no-restricted-imports` sur `src/app/core/domain/**`), `.prettierrc.json`.
- **Tests :** exécution du workflow sur une branche de test.
- **Critères d'acceptation :**
  1. Given une pull request, When le job `quality` s'exécute, Then il lance `npm ci`, le lint, la vérification du format, `ng test` avec couverture, le build de production avec `APP_BASE_HREF`, `check:privacy`, `check:bundle` et `check:base-href`.
  2. Given un fichier de `core/domain` qui importe `@angular`, When le lint s'exécute, Then il échoue.
  3. Given le workflow, Then les actions tierces sont épinglées par SHA et les permissions sont limitées à `contents: read`.
  4. Given la protection de `main`, Then le job `quality` est déclaré obligatoire (réglage vérifié à la revue).

#### S-E1-16 : CI e2e et Lighthouse

- **En tant que** mainteneur, **je veux** que les tests E2E et Lighthouse tournent sur le build servi par Docker, **afin de** tester ce qui sera réellement déployé.
- **Exigences :** NFR-21, NFR-22.
- **Dépendances :** S-E1-11, S-E1-12, S-E1-14, S-E1-15.
- **Estimation :** 2.
- **Fichiers :** `.github/workflows/ci.yml` (jobs `e2e` et `lighthouse`).
- **Tests :** exécution du workflow.
- **Critères d'acceptation :**
  1. Given le job `e2e` qui dépend de `quality`, When il s'exécute, Then il lance `docker compose up -d web` puis Playwright sur `chromium`.
  2. Given un échec E2E, Then les rapports Playwright sont publiés comme artefacts.
  3. Given le job `lighthouse` qui dépend de `quality`, Then `lhci autorun` s'exécute sur le service `web`.
  4. Given la protection de `main`, Then `e2e` et `lighthouse` sont obligatoires.

#### S-E1-17 : Déploiement GitHub Pages et test de fumée

- **En tant que** Scrum Master, **je veux** que l'application soit en ligne à l'adresse du projet GitHub Pages, **afin de** la partager à mon équipe.
- **Exigences :** NFR-4, NFR-21 ; critère de fin de E1.
- **Dépendances :** S-E1-16.
- **Estimation :** 3.
- **Fichiers :** `.github/workflows/deploy-pages.yml`, `e2e/smoke-prod.spec.ts`, `.github/workflows/ci.yml` (appel du workflow réutilisable sur `main`).
- **Prérequis :** `gh auth login` effectué (état « en attente » du PRD, section 8.2) ; Pages source « GitHub Actions » ; environnement `github-pages` limité à `main` et aux tags `v*`. Sans ces prérequis, la story est bloquée et le reste de E1 reste livrable.
- **Tests :** `smoke-prod.spec.ts` sur `https://<owner>.github.io/scrum-speaking-timer/`.
- **Critères d'acceptation :**
  1. Given une fusion sur `main`, When `ci.yml` appelle `deploy-pages.yml`, Then l'artefact `dist` est publié dans l'environnement `github-pages`.
  2. Given l'URL publique, When le test de fumée s'exécute, Then la page répond 200, `manifest.webmanifest` et `ngsw.json` sont accessibles, et aucune requête hors origine n'est émise.
  3. Given `workflow_dispatch` avec une entrée `ref`, Then le workflow peut redéployer un tag existant (procédure de rollback, architecture 6.4).

### 4.2 Epic E2 : Équipe et Mémoire

#### S-E2-01 : Valider et normaliser le Nom d'équipe

- **En tant que** Scrum Master, **je veux** un nom d'équipe valide et propre, **afin de** l'identifier dans l'écran et le bilan.
- **Exigences :** FR-1 ; règle 6.1 ; INV-03.
- **Dépendances :** S-E1-08.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/normalize.ts`, `src/app/core/domain/normalize.spec.ts`, `src/app/core/domain/validation.ts`, `src/app/core/domain/validation.spec.ts`.
- **Tests :** unitaires purs.
- **Critères d'acceptation :**
  1. Given un nom vide ou composé d'espaces, When il est validé, Then l'erreur est « Donnez un nom à votre équipe. ».
  2. Given un nom de 51 caractères, Then l'erreur est « Le nom ne doit pas dépasser 50 caractères. » ; un nom de 50 caractères est accepté.
  3. Given un nom contenant `<` ou `#`, Then l'erreur est « Caractères non autorisés dans le nom de l'équipe. » ; un nom contenant des lettres accentuées, des chiffres, des apostrophes, des tirets, des points et des parenthèses est accepté.
  4. Given « Équipe    Alpha » avec espaces multiples et espaces de bord, When il est normalisé, Then il devient « Équipe Alpha ».

#### S-E2-02 : Valider et normaliser les Prénoms

- **En tant que** Scrum Master, **je veux** des prénoms cohérents et sans doublon, **afin de** distinguer chaque Membre sans ambiguïté.
- **Exigences :** FR-2, FR-3 ; règle 6.3 ; INV-02, INV-06, INV-07 ; T8.
- **Dépendances :** S-E1-08.
- **Estimation :** 3.
- **Fichiers :** `src/app/core/domain/normalize.ts`, `src/app/core/domain/validation.ts`, `src/app/core/domain/validation.spec.ts`.
- **Tests :** unitaires purs, un test par règle de la section 6.3.
- **Critères d'acceptation :**
  1. Given « thomas », When il est normalisé, Then il devient « Thomas » ; Given « jEAN », Then il reste « jEAN » (seule la première lettre est corrigée).
  2. Given « Léa » et « Lea » dans la même équipe, When la validation est faite, Then aucun doublon n'est détecté ; Given « thomas » et « Thomas  » dans la même équipe, Then l'erreur est « Ce prénom existe déjà dans l'équipe. ».
  3. Given « Jean3 » ou un emoji, Then l'erreur est « Un prénom ne peut contenir que des lettres, espaces, traits d'union et apostrophes. ».
  4. Given une saisie vide, Then « Saisissez un prénom. » ; Given 31 caractères, Then « Le prénom ne doit pas dépasser 30 caractères. ».
  5. Given « Le\u0301a » (forme décomposée), When il est validé, Then il est converti en NFC et accepté.
  6. Given le renommage d'un Membre en son propre prénom, Then aucune erreur de doublon n'est levée.

#### S-E2-03 : Stockage versionné et lecture tolérante

- **En tant que** Scrum Master, **je veux** que mes données soient conservées entre deux visites et ne soient jamais écrasées sans sauvegarde, **afin de** ne pas perdre mon équipe.
- **Exigences :** FR-24, FR-25 ; NFR-9 ; ADR-05.
- **Dépendances :** S-E1-03.
- **Estimation :** 3.
- **Fichiers :** `src/app/core/ports/storage.port.ts`, `src/app/core/adapters/local-storage.adapter.ts` (+ spec), `src/app/core/domain/storage-schema.ts` (+ spec), `src/app/core/domain/model.ts`, `src/app/core/domain/errors.ts`, `src/app/services/persistence.service.ts` (+ spec).
- **Tests :** unitaires sur le schéma et l'adaptateur (faux `localStorage`) ; service avec stockage en mémoire.
- **Critères d'acceptation :**
  1. Given la clé `scrum-timer:v1` absente, When l'application charge les données, Then le résultat est « vide » et aucun message n'est affiché.
  2. Given un contenu `StoredRootV1` valide, When `load()` est appelé, Then équipe, réglages et session sont restaurés.
  3. Given un JSON invalide ou `schemaVersion: 2`, When `load()` est appelé, Then le brut est copié dans la première case libre parmi trois (`scrum-timer:v1:backup`, `scrum-timer:v1:backup-2`, `scrum-timer:v1:backup-3`) ; quand les trois sont prises, la troisième est remplacée et la perte est signalée à partir de la quatrième donnée illisible (N-3), l'équipe est vide et le message est « Les données enregistrées sont illisibles et ont été ignorées. Vous pouvez importer un fichier de sauvegarde. ».
  4. Given `setItem` qui lève `QuotaExceededError`, When `save()` est appelé, Then il renvoie `STORAGE_QUOTA`, `health` passe à `degraded`, et aucune exception n'est propagée.
  5. Given un accès à `localStorage` qui lève `SecurityError`, Then l'adaptateur renvoie `STORAGE_UNAVAILABLE` sans lever d'exception.

#### S-E2-04 : Boîte de confirmation et bandeau d'état partagés

- **En tant que** utilisateur, **je veux** des confirmations et des bandeaux cohérents, **afin de** ne jamais valider une action destructive par erreur.
- **Exigences :** FR-1, FR-3, FR-9, FR-25 ; DESIGN 8.6, 8.8.
- **Dépendances :** S-E1-03, S-E1-06.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/shared/confirm-dialog.ts` (+ spec), `src/app/features/shared/status-banner.ts` (+ spec).
- **Tests :** tests de composant.
- **Critères d'acceptation :**
  1. Given une boîte de confirmation ouverte, When elle s'affiche, Then le focus va sur le bouton non destructif.
  2. Given la touche Échap, Then la boîte se ferme comme si l'on cliquait sur « Annuler ».
  3. Given Tab dans la boîte ouverte, Then le focus reste dans la boîte ; à la fermeture, il revient à l'élément déclencheur.
  4. Given un bandeau d'information ou d'avertissement, Then il porte `role="status"` ; un bandeau d'erreur porte `role="alert"` ; tous sont fermables.

#### S-E2-05 : Créer une équipe et la retrouver à la visite suivante

- **En tant que** Scrum Master, **je veux** créer mon équipe une seule fois et la retrouver ensuite, **afin de** ne pas ressaisir les prénoms à chaque Daily.
- **Exigences :** FR-1, FR-2 (ajout de base), FR-6, FR-24 ; NFR-5 (reprise en moins de 1 s).
- **Dépendances :** S-E2-01, S-E2-02, S-E2-03, S-E3-01, S-E3-02, S-E1-03.
- **Estimation :** 3.
- **Fichiers :** `src/app/services/team.service.ts` (+ spec), `src/app/core/domain/draft.ts` (+ spec), `src/app/features/team-editor/team-editor.page.ts`, `team-editor.page.html`, `team-editor.page.css`, `src/app/app.guards.ts`.
- **Tests :** unitaires `draft.ts` et `team.service.ts` ; composant de l'écran Équipe ; E2E intégré dans S-E6-10.
- **Critères d'acceptation :**
  1. Given une application vide, When l'écran Équipe s'affiche, Then il présente « Créer votre équipe », le champ Nom d'équipe, la Durée à 15, une liste vide et le bouton « Enregistrer l'équipe » désactivé.
  2. Given un nom valide, une durée de 15 et deux Membres « Camille » et « Thomas », When « Enregistrer l'équipe » est cliqué, Then l'équipe est enregistrée dans `scrum-timer:v1` avec `allocationMode: "equal"` et 450 secondes par Membre, puis l'application affiche `/preparation`.
  3. Given un seul Membre, Then le bouton reste désactivé et le message « Ajoutez au moins 2 membres pour lancer une session. » est affiché comme état.
  4. Given une équipe enregistrée, When la page est rechargée, Then `/preparation` s'affiche directement avec l'équipe, sans ressaisie, en moins d'une seconde.
  5. Given la saisie « Thomas » puis Entrée dans le champ d'ajout, Then le Membre est ajouté en fin de liste et le champ reçoit à nouveau le focus.

#### S-E2-06 : Remplacer l'équipe existante à la création

- **En tant que** Scrum Master, **je veux** être averti avant de remplacer mon équipe, **afin de** ne pas la perdre par accident.
- **Exigences :** FR-1.
- **Dépendances :** S-E2-04, S-E2-05.
- **Estimation :** 1.
- **Fichiers :** `src/app/features/team-editor/team-editor.page.ts` (+ spec).
- **Tests :** composant.
- **Critères d'acceptation :**
  1. Given une équipe existante et l'écran de création ouvert, When « Enregistrer l'équipe » est cliqué, Then la boîte D-1 s'ouvre avec « Remplacer l'équipe existante ? Cette action supprime l'équipe actuelle et son réglage. » et les boutons « Remplacer » et « Annuler », focus sur « Annuler ».
  2. Given D-1 ouverte, When « Annuler » ou Échap est activé, Then rien ne change.
  3. Given D-1 ouverte, When « Remplacer » est activé, Then l'ancienne équipe est remplacée et l'application affiche `/preparation`.
  4. Given l'accès à l'écran de création depuis E-2, Then un point d'entrée « Nouvelle équipe » est présent [À VALIDER : le libellé et l'emplacement ne sont pas définis dans le PRD].

#### S-E2-07 : Limite de 15 Membres et erreurs d'ajout

- **En tant que** Scrum Master, **je veux** être arrêté proprement quand l'équipe est pleine ou que la saisie est invalide, **afin de** garder une équipe cohérente.
- **Exigences :** FR-2.
- **Dépendances :** S-E2-02, S-E2-05.
- **Estimation :** 1.
- **Fichiers :** `src/app/features/team-editor/team-editor.page.ts` (+ spec), `src/app/core/domain/draft.ts`.
- **Tests :** unitaire `addMemberToDraft` ; composant.
- **Critères d'acceptation :**
  1. Given 15 Membres, When l'écran s'affiche, Then le champ d'ajout et « Ajouter » sont désactivés et « Une équipe ne peut pas dépasser 15 membres. » est affiché sous la liste.
  2. Given un prénom invalide, When « Ajouter » est activé, Then le message d'erreur est lié au champ par `aria-describedby`, le prénom reste dans le champ et le Membre n'est pas ajouté.
  3. Given une erreur d'ajout, Then la première erreur reçoit le focus.

#### S-E2-08 : Renommer un Membre

- **En tant que** Scrum Master, **je veux** corriger le prénom d'un Membre, **afin de** garder une liste exacte.
- **Exigences :** FR-3.
- **Dépendances :** S-E2-05.
- **Estimation :** 1.
- **Fichiers :** `src/app/core/domain/draft.ts` (+ spec), `src/app/features/team-editor/team-editor.page.ts` (+ spec).
- **Tests :** unitaires `renameMemberInDraft` ; composant.
- **Critères d'acceptation :**
  1. Given « Thomas » renommé en « Thomas », Then aucune erreur n'est affichée.
  2. Given « Thomas » renommé en « Camille » alors que « Camille » existe, Then l'erreur « Ce prénom existe déjà dans l'équipe. » est affichée et le nom n'est pas changé.
  3. Given un renommage valide enregistré, When l'écran est rouvert, Then le nouveau nom est affiché.

#### S-E2-09 : Supprimer un Membre avec confirmation

- **En tant que** Scrum Master, **je veux** retirer un Membre sans risque d'erreur, **afin de** garder une équipe à jour.
- **Exigences :** FR-3.
- **Dépendances :** S-E2-04, S-E2-07.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/draft.ts`, `src/app/features/team-editor/team-editor.page.ts` (+ spec).
- **Tests :** unitaires `removeMemberFromDraft` ; composant.
- **Critères d'acceptation :**
  1. Given un Membre « Léa » et l'équipe à 4 Membres, When « Supprimer » est activé, Then D-2 s'ouvre avec « Supprimer Léa de l'équipe ? » et les boutons « Supprimer » et « Annuler », focus sur « Annuler ».
  2. Given D-2 et « Annuler », Then rien ne change ; given « Supprimer », Then Léa disparaît et les Temps alloués sont recalculés en répartition égale.
  3. Given une équipe à exactement 2 Membres, When « Supprimer » est activé, Then D-2 ne s'ouvre pas et « Une équipe doit compter au moins 2 membres. » est affiché.

#### S-E2-10 : Ordonner les Membres

- **En tant que** Scrum Master, **je veux** changer l'ordre de passage, **afin d'** adapter la parole à l'ordre réel de l'équipe.
- **Exigences :** FR-4 ; H-6.
- **Dépendances :** S-E2-07.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/draft.ts` (`moveMemberInDraft`, +spec), `src/app/features/team-editor/team-editor.page.ts` (+spec).
- **Tests :** unitaire ; composant clavier.
- **Critères d'acceptation :**
  1. Given la liste de 4 Membres, When « Descendre » sur le 2e est activé, Then l'ordre devient 1, 3, 2, 4 et le focus reste sur le bouton « Descendre » du Membre déplacé.
  2. Given le premier Membre, Then « Monter » a l'attribut `disabled` ; given le dernier, « Descendre » a l'attribut `disabled`.
  3. Given chaque bouton, Then il porte un libellé « Monter [Prénom] » ou « Descendre [Prénom] » et une zone de 44 × 44 px.
  4. Given un changement d'ordre, Then il est enregistré immédiatement (E-2) et conservé après rechargement.

#### S-E2-11 : Modifier le Nom d'équipe et la Durée hors Session

- **En tant que** Scrum Master, **je veux** corriger le nom et la durée de mon équipe, **afin de** l'adapter à une autre cérémonie.
- **Exigences :** FR-5.
- **Dépendances :** S-E2-05, S-E3-03.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/team-editor/team-editor.page.ts` (mode modification), `src/app/services/team.service.ts` (+spec).
- **Tests :** composant ; unitaire `commit`.
- **Critères d'acceptation :**
  1. Given l'équipe enregistrée, When « Modifier l'équipe » est activé depuis E-2, Then l'écran affiche le titre « Modifier l'équipe » et le lien « Annuler ».
  2. Given un nouveau nom valide et « Enregistrer l'équipe », Then le nom est mis à jour, persisté et E-2 s'affiche.
  3. Given « Annuler », Then E-2 s'affiche sans modification.
  4. Given une modification de la Durée en répartition égale, Then les Temps alloués sont recalculés.

#### S-E2-12 : Écran de préparation et garde de la route

- **En tant que** Scrum Master, **je veux** voir mon équipe avant de lancer la Session, **afin de** vérifier la liste et le temps de chacun.
- **Exigences :** FR-6 ; prépare FR-10.
- **Dépendances :** S-E2-05, S-E1-03.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/preparation/preparation.page.ts`, `preparation.page.html`, `preparation.page.css`, `src/app/app.guards.ts` (garde `/preparation`), `src/app/app.routes.ts`.
- **Tests :** composant ; unitaire de la garde.
- **Critères d'acceptation :**
  1. Given une équipe valide, When `/preparation` s'affiche, Then il présente « Préparer la session » en `h1`, le nom d'équipe, la durée (« 15 min »), la liste ordonnée avec position, prénom et temps alloué en mm:ss.
  2. Given aucune équipe, When `/preparation` est ouvert, Then la garde redirige vers `/equipe`.
  3. Given une équipe invalide, Then le bouton « Démarrer la session » est désactivé avec le motif affiché sous le bouton.

#### S-E2-13 : Bandeaux de stockage (B-1 et B-2)

- **En tant que** Scrum Master, **je veux** être prévenu si mes données ne seront pas conservées, **afin de** exporter mon équipe à temps.
- **Exigences :** FR-25.
- **Dépendances :** S-E2-03, S-E2-04.
- **Estimation :** 2.
- **Fichiers :** `src/app/app.ts` (bandeau global), `src/app/services/persistence.service.ts` (+spec).
- **Tests :** composant ; unitaire de `health`.
- **Critères d'acceptation :**
  1. Given un stockage refusé, When l'application démarre, Then le bandeau affiche « Vos données ne seront pas conservées après fermeture. Exportez votre équipe pour la sauvegarder. » et peut être fermé.
  2. Given des données illisibles, Then le bandeau B-2 affiche « Les données enregistrées sont illisibles et ont été ignorées. Vous pouvez importer un fichier de sauvegarde. ».
  3. Given un bandeau fermé, Then l'application reste utilisable et aucune donnée n'est perdue en mémoire vive.

#### S-E2-14 : Réinitialiser les données

- **En tant que** Scrum Master, **je veux** effacer toutes les données de l'application sur cet appareil, **afin de** repartir de zéro.
- **Exigences :** FR-28 ; NFR-9.
- **Dépendances :** S-E2-03, S-E2-04.
- **Estimation :** 2.
- **Fichiers :** `src/app/services/data-reset.service.ts` (+spec), `src/app/features/preparation/preparation.page.ts` (pied de page).
- **Tests :** unitaire ; composant ; E2E de NFR-9 (clé absente après réinitialisation) dans S-E6-10.
- **Critères d'acceptation :**
  1. Given E-2, When « Réinitialiser les données » est activé, Then D-5 s'ouvre avec « Effacer toutes les données de l'application sur cet appareil ? Cette action est définitive. » et les boutons « Effacer » et « Annuler », focus sur « Annuler ».
  2. Given « Effacer », Then `scrum-timer:v1` et `scrum-timer:v1:backup` sont supprimées et l'écran Équipe vide s'affiche.
  3. Given « Annuler » ou Échap, Then aucune donnée n'est supprimée.
  4. Given une Session en cours, Then le bouton n'est pas visible sur E-2 et le service renvoie `SESSION_IN_PROGRESS`.

### 4.3 Epic E3 : Durée et répartition du temps

#### S-E3-01 : Valider la Durée de cérémonie

- **En tant que** Scrum Master, **je veux** une durée entière et cohérente avec le nombre de Membres, **afin d'éviter** un temps par personne absurde.
- **Exigences :** FR-7 ; règle 6.4 ; INV-08, INV-09 ; H-4, H-5.
- **Dépendances :** S-E1-08.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/validation.ts` (+spec), `src/app/core/domain/errors.ts`.
- **Tests :** unitaires purs.
- **Critères d'acceptation :**
  1. Given une saisie vide, Then « Indiquez la durée de la cérémonie. ».
  2. Given « 7,5 », Then « Saisissez un nombre entier de minutes. » ; given 0 ou -3, Then « La durée minimale est de 1 minute. » ; given 121, Then « La durée maximale est de 120 minutes. ».
  3. Given 15 minutes, When la durée est validée, Then elle vaut 900 secondes.
  4. Given 1 minute et 3 Membres (20 s par personne), Then « Avec 3 membres, chacun aurait moins de 30 secondes. Augmentez la durée ou retirez des membres. ». Given 1 minute et 2 Membres (30 s), Then la durée est acceptée.

#### S-E3-02 : Calcul de la répartition égale et de l'écart

- **En tant que** développeur, **je veux** un calcul de répartition exact et testé, **afin que** la somme des temps égale toujours la durée.
- **Exigences :** FR-8 ; INV-04 ; ADR-08.
- **Dépendances :** S-E1-01.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/allocation.ts`, `src/app/core/domain/allocation.spec.ts`.
- **Tests :** unitaires et test de propriété (boucle sur n de 2 à 15 et durées multiples de 60).
- **Critères d'acceptation :**
  1. Given 900 secondes et 4 Membres, When `allocateEqual` est appelée, Then le résultat est [225, 225, 225, 225].
  2. Given 900 secondes et 7 Membres, Then le résultat est 129 quatre fois puis 128 trois fois.
  3. Given toute durée valide et tout n entre 2 et 15, Then la somme du résultat est exactement égale à la durée.
  4. Given une liste de Membres et une durée, When `allocationDelta` est appelée, Then elle renvoie durée moins somme (positif = il manque du temps).
  5. Given « 90 », Then `parseAllocation` renvoie 90 ; given « 01:30 », Then 90 ; given « 4min », Then `ALLOCATION_FORMAT`.

#### S-E3-03 : Champ Durée et temps moyen en direct

- **En tant que** Scrum Master, **je veux** voir le temps moyen par personne pendant que je saisis la durée, **afin de** régler la cérémonie en connaissance de cause.
- **Exigences :** FR-5, FR-7 ; DESIGN 8.2.
- **Dépendances :** S-E3-01, S-E2-05.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/team-editor/team-editor.page.ts` (+spec), `src/app/features/team-editor/team-editor.page.html`.
- **Tests :** composant.
- **Critères d'acceptation :**
  1. Given 6 Membres et une durée de 15, When l'écran s'affiche, Then « Temps moyen par membre : 02:30 » est visible sous le champ.
  2. Given la saisie de « 7,5 », Then le message de S-E3-01 est affiché et « Enregistrer l'équipe » est désactivé.
  3. Given un temps moyen inférieur à 30 s, When « Enregistrer l'équipe » est activé, Then l'enregistrement est bloqué.
  4. Given une durée modifiée en répartition égale, Then les Temps alloués sont recalculés et persistés.

#### S-E3-04 : Répartition égale affichée et recalculée

- **En tant que** Scrum Master, **je veux** une répartition automatique qui suit mes changements, **afin de** ne pas recalculer à la main.
- **Exigences :** FR-8.
- **Dépendances :** S-E3-02, S-E2-12.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/draft.ts` (`recomputeEqual`, +spec), `src/app/features/preparation/preparation.page.ts` (+spec).
- **Tests :** unitaire ; composant.
- **Critères d'acceptation :**
  1. Given la répartition égale, When un Membre est ajouté, Then tous les temps sont recalculés immédiatement et affichés en mm:ss.
  2. Given 15 minutes pour 4 Membres, Then chaque ligne affiche « 03:45 ».
  3. Given la répartition égale, Then le total est affiché en vert sans message d'erreur.

#### S-E3-05 : Passer en répartition manuelle et saisir les temps

- **En tant que** Scrum Master, **je veux** régler le temps de chaque Membre à la main, **afin de** donner plus de parole à quelqu'un qui présente un sujet.
- **Exigences :** FR-9 ; règle 6.5 ; INV-05 ; E-14.
- **Dépendances :** S-E3-02, S-E2-12.
- **Estimation :** 3.
- **Fichiers :** `src/app/core/domain/draft.ts` (`setAllocationModeInDraft`, `setManualAllocationInDraft`, +spec), `src/app/features/preparation/preparation.page.ts` (+spec), `preparation.page.html`.
- **Tests :** unitaires ; composant.
- **Critères d'acceptation :**
  1. Given la répartition égale avec 02:30 par Membre, When « Répartition manuelle » est choisie, Then aucune boîte n'apparaît, les valeurs restent à 02:30 et des champs « Temps alloué » sont visibles.
  2. Given la saisie « 04:00 » pour Thomas, Then la valeur est enregistrée à 240 secondes ; given « 90 », Then 90 secondes.
  3. Given une saisie « 4min », Then « Format attendu : secondes (ex. 90) ou mm:ss (ex. 01:30). » et la valeur n'est pas enregistrée.
  4. Given un champ vidé, Then « Indiquez le temps alloué à Thomas. ». Given 29 secondes, Then « Le temps minimum est de 30 secondes. ». Given une valeur supérieure à la durée, Then « Le temps dépasse la durée de la cérémonie. ».

#### S-E3-06 : Indicateur de total et blocage de l'enregistrement

- **En tant que** Scrum Master, **je veux** voir en permanence si la somme des temps est exacte, **afin de** ne jamais lancer une Session avec un total faux.
- **Exigences :** FR-9 ; INV-04 ; D4.
- **Dépendances :** S-E3-05.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/validation.ts` (`ALLOCATION_SUM_MISMATCH`), `src/app/features/preparation/preparation.page.ts` (+spec), `src/app/features/shared/total-indicator.ts` (+spec).
- **Tests :** unitaires ; composant ; annonce `role="status"`.
- **Critères d'acceptation :**
  1. Given une somme exacte, Then l'indicateur affiche « Total alloué : 15:00 / 15:00 » en vert avec une coche.
  2. Given une somme de 13:20, Then l'indicateur affiche « Total alloué : 13:20 / 15:00 » et « Il manque 100 s pour atteindre la durée » en rouge avec le symbole ⚠.
  3. Given une somme de 15:30, Then « Il y a 30 s de trop ».
  4. Given une somme inexacte, Then « Enregistrer » et « Démarrer la session » sont désactivés.
  5. Given une saisie en cours, Then le libellé n'est annoncé (`role="status"`) qu'à la sortie du champ, et non à chaque frappe.

#### S-E3-07 : Revenir à la répartition égale (D-3)

- **En tant que** Scrum Master, **je veux** revenir à un partage égal d'un geste, **afin de** repartir de valeurs saines.
- **Exigences :** FR-9.
- **Dépendances :** S-E3-05, S-E2-04.
- **Estimation :** 1.
- **Fichiers :** `src/app/features/preparation/preparation.page.ts` (+spec).
- **Tests :** composant.
- **Critères d'acceptation :**
  1. Given la répartition manuelle, When « Revenir à la répartition égale » est activé, Then D-3 s'ouvre avec « Revenir à une répartition égale ? Vos valeurs manuelles seront remplacées. », les boutons « Revenir à l'égalité » et « Annuler », focus sur « Annuler ».
  2. Given « Revenir à l'égalité », Then les temps sont recalculés en répartition égale.
  3. Given « Annuler » ou Échap, Then les valeurs manuelles restent.

#### S-E3-08 : Ajouter, supprimer et modifier la durée en répartition manuelle

- **En tant que** Scrum Master, **je veux** que les changements d'effectif ou de durée restent cohérents avec une répartition manuelle, **afin de** ne pas perdre mes réglages.
- **Exigences :** FR-2, FR-3, FR-5 ; A7 ; ADR-08 ; E-5, E-6.
- **Dépendances :** S-E3-06, S-E2-09.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/draft.ts` (+spec), `src/app/features/preparation/preparation.page.ts` (+spec).
- **Tests :** unitaires ; composant.
- **Critères d'acceptation :**
  1. Given une répartition manuelle, When un Membre est ajouté, Then il reçoit 30 secondes, le total devient inexact et « Enregistrer » est bloqué jusqu'à correction.
  2. Given une répartition manuelle, When un Membre est supprimé, Then les autres valeurs ne changent pas et l'indicateur recontrôle la somme.
  3. Given une répartition manuelle, When la durée est modifiée, Then les valeurs sont conservées et la somme est recontrôlée.
  4. Given un champ de temps vidé pour le Membre ajouté, Then le message « Indiquez le temps alloué à [Prénom]. » s'affiche [À VALIDER : EXPERIENCE E-5 prévoit un champ vide, ADR-08 prévoit 30 s ; cette story suit ADR-08].

#### S-E3-09 : E2E du parcours de répartition manuelle (UJ-2)

- **En tant que** testeur, **je veux** un test de bout en bout de la répartition manuelle, **afin de** vérifier l'enchaînement complet jusqu'au démarrage.
- **Exigences :** FR-9, FR-10, FR-11, FR-12 (UJ-2).
- **Dépendances :** S-E3-06, S-E4-05.
- **Estimation :** 2.
- **Fichiers :** `e2e/manual-allocation.spec.ts`, `e2e/fixtures.ts`.
- **Tests :** ce spec.
- **Critères d'acceptation :**
  1. Given l'équipe de UJ-1 (6 Membres, 15 min), When Thomas est réglé à 04:00 et les 5 autres à 02:12, Then le total affiché est « 15:00 / 15:00 ».
  2. Given cette répartition, When « Démarrer la session » est activé, Then `/session` s'affiche avec Camille en Membre courant et le focus sur « Suivant ».
  3. Given une somme de 16:30, Then « Démarrer la session » est désactivé.
  4. Given le parcours, Then la garde réseau ne signale aucune requête externe.

### 4.4 Epic E4 : Session et minuteur d'Intervention

#### S-E4-01 : Calcul du temps parlé et garde de régression d'horloge

- **En tant que** Scrum Master, **je veux** un temps de parole exact même si l'onglet est masqué ou l'écran en veille, **afin de** avoir un bilan juste.
- **Exigences :** FR-14 ; NFR-6 ; SM-4 ; ADR-06 ; A17.
- **Dépendances :** S-E1-01.
- **Estimation :** 3.
- **Fichiers :** `src/app/core/domain/clock-time.ts`, `src/app/core/domain/clock-time.spec.ts`, `src/app/core/domain/model.ts`, `src/app/core/ports/clock.port.ts`, `src/app/core/adapters/system-clock.adapter.ts`.
- **Tests :** unitaires à horloge simulée (`FakeClockPort`).
- **Critères d'acceptation :**
  1. Given une Intervention débutée à 0 et `now` à 5 000 ms, When `elapsedOf` est appelée, Then elle renvoie 5 000.
  2. Given une pause ouverte depuis 3 000 ms (`pausedAt`) et `now` à 5 000 ms, Then elle renvoie 3 000.
  3. Given une Intervention dont la durée calculée est négative, Then elle renvoie 0.
  4. Given un `now` qui recule de 2 s, When la garde s'applique, Then le temps effectif ne recule pas et le décalage `clockOffsetMs` augmente de l'écart ; un événement `CLOCK_REGRESSION` est renvoyé.
  5. Given une Session simulée de 15 minutes dont 5 minutes passées onglet masqué (saut unique de l'horloge), Then le temps parlé calculé diffère du temps réel de moins de 1 seconde.

#### S-E4-02 : Transitions de Session : démarrer, passer la parole, choisir un Membre

- **En tant que** Scrum Master, **je veux** que la Session démarre, avance et change de Membre de façon prévisible, **afin de** dérouler le Daily sans surprise.
- **Exigences :** FR-10, FR-11, FR-12 ; H-6 ; D2.
- **Dépendances :** S-E4-01, S-E3-02.
- **Estimation :** 3.
- **Fichiers :** `src/app/core/domain/session.reducer.ts` (+spec), `src/app/core/domain/errors.ts`.
- **Tests :** une ligne par transition (tableau 4.3 de l'architecture) ; unitaires purs.
- **Critères d'acceptation :**
  1. Given une équipe valide et aucune Session, When `START` est appliqué, Then la Session est `running`, le premier Membre est Membre courant, et son Intervention commence.
  2. Given une Session en cours, When `START` est appliqué, Then l'erreur est `ALREADY_RUNNING`. Given aucune équipe, Then `NO_TEAM`.
  3. Given `NEXT` sur le Membre 1 après 40 s, Then le Membre 1 a 40 s parlées cumulées et le Membre 2 est courant ; après le dernier Membre, `NEXT` revient au premier (cycle).
  4. Given `SELECT_MEMBER` sur le Membre déjà courant, Then l'état ne change pas. Given un identifiant inconnu, Then `UNKNOWN_MEMBER`.
  5. Given une Session `finished`, When `START` est appliqué, Then la Session précédente est remplacée (FR-23).

#### S-E4-03 : Transitions de Session : pause et fin

- **En tant que** Scrum Master, **je veux** mettre une Intervention en pause et terminer la Session proprement, **afin de** gérer une discussion hors parole.
- **Exigences :** FR-13, FR-15 ; D3 ; INV-12, INV-13.
- **Dépendances :** S-E4-02.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/session.reducer.ts` (+spec).
- **Tests :** unitaires purs.
- **Critères d'acceptation :**
  1. Given une Intervention active à 20 s, When `TOGGLE_PAUSE` est appliqué, Then `pausedAt` vaut `now` ; given une reprise 10 s plus tard, Then `pausedTotalMs` vaut 10 000 et le temps parlé ne compte pas la pause.
  2. Given `NEXT` pendant une pause, Then l'Intervention se clôt avec le temps écoulé jusqu'au début de la pause.
  3. Given `TOGGLE_PAUSE` sans Intervention, Then `NO_CURRENT_INTERVENTION`.
  4. Given `FINISH`, Then l'Intervention est clôturée, `status` vaut `finished`, `endedAt` est renseigné, `current` vaut `null`. Given un second `FINISH`, Then `NOT_RUNNING`.
  5. Given `TICK`, Then aucun changement d'état n'est produit.

#### S-E4-04 : Persistance de la Session et checkpoints

- **En tant que** Scrum Master, **je veux** que la Session survive à un rechargement, **afin de** ne pas perdre le temps d'un Daily.
- **Exigences :** FR-16 ; FR-24 ; ADR-05 ; ADR-06 (point 6).
- **Dépendances :** S-E4-03, S-E2-03.
- **Estimation :** 3.
- **Fichiers :** `src/app/services/session.service.ts` (+spec), `src/app/services/persistence.service.ts` (`checkpoint`, +spec), `src/app/core/domain/storage-schema.ts` (session).
- **Tests :** unitaires à horloge et timers simulés.
- **Critères d'acceptation :**
  1. Given un événement de Session, When il est appliqué, Then l'état `running` ou `finished` est écrit dans `scrum-timer:v1`.
  2. Given une Intervention en cours, When 5 secondes passent, Then `lastCheckpointAt` est écrit.
  3. Given `pagehide` ou `visibilitychange` avec l'onglet masqué, Then un checkpoint immédiat est écrit.
  4. Given un échec d'écriture, Then `health` passe à `degraded` et la Session continue en mémoire.

#### S-E4-05 : Démarrer la Session et afficher le minuteur

- **En tant que** Scrum Master, **je veux** lancer la Session et voir le temps restant du Membre qui parle, **afin de** commencer le Daily immédiatement.
- **Exigences :** FR-10, FR-14 ; NFR-6 (affichage au moins une fois par seconde) ; DESIGN 8.4.
- **Dépendances :** S-E4-01, S-E4-02, S-E2-12, S-E1-03.
- **Estimation :** 3.
- **Fichiers :** `src/app/services/clock.service.ts` (+spec), `src/app/services/session.service.ts` (+spec), `src/app/features/preparation/preparation.page.ts` (bouton Démarrer), `src/app/features/session/session.page.ts` (+spec), `session.page.html`, `session.page.css`, `src/app/core/domain/format.ts`.
- **Tests :** unitaire `ClockService` (tick 250 ms seulement en `running`) ; composant de la page Session.
- **Critères d'acceptation :**
  1. Given une équipe valide, When « Démarrer la session » est activé, Then l'application affiche `/session`, le premier Membre en `h2`, un libellé « Temps restant » et le minuteur en mm:ss, et le bouton « Suivant » a le focus.
  2. Given la Session `running`, Then le `ClockService` publie `now` toutes les 250 ms ; given `finished`, Then le tick est arrêté.
  3. Given une équipe invalide, Then « Démarrer la session » est désactivé et le motif s'affiche.
  4. Given la Session active, Then le minuteur est mis à jour au moins une fois par seconde à l'écran.

#### S-E4-06 : Passer la parole au Membre suivant

- **En tant que** Scrum Master, **je veux** passer la parole d'un clic, **afin de** garder le rythme du Daily.
- **Exigences :** FR-11 ; NFR-7.
- **Dépendances :** S-E4-05.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/session/session.page.ts` (+spec), `session.page.html`, `src/app/services/session.service.ts`.
- **Tests :** composant ; E2E de mesure du délai (NFR-7) dans S-E6-11.
- **Critères d'acceptation :**
  1. Given Camille courante, When « Suivant » est activé, Then Camille est clôturée, Thomas devient courant (`aria-current="true"`) et son minuteur affiche son temps restant (temps alloué moins temps parlé cumulé).
  2. Given le dernier Membre courant, When « Suivant » est activé, Then le premier Membre redevient courant.
  3. Given « Suivant », Then le focus reste sur « Suivant ».
  4. Given un clic sur « Suivant », Then l'affichage est mis à jour sans attendre la persistance (signal synchrone, objectif inférieur à 200 ms).

#### S-E4-07 : Donner la parole à un Membre précis

- **En tant que** Scrum Master, **je veux** donner la parole à quelqu'un hors ordre, **afin de** répondre à une question en direct.
- **Exigences :** FR-12 ; NFR-12 ; E-9.
- **Dépendances :** S-E4-06.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/session/member-picker.ts` (+spec), `session.page.html`.
- **Tests :** composant ; clavier.
- **Critères d'acceptation :**
  1. Given Camille courante, When « Donner la parole à Thomas » est activé, Then Camille est clôturée et Thomas démarre, le cycle « Suivant » reprend à partir de Thomas.
  2. Given le Membre courant, Then son bouton n'a aucune action et porte `aria-current="true"`.
  3. Given le focus sur un bouton de Membre, When Entrée ou Espace est pressé, Then la parole est donnée et le focus reste sur ce bouton.
  4. Given un Membre qui a déjà parlé, Then il peut reprendre la parole (H-7).

#### S-E4-08 : Pause et reprise de l'Intervention

- **En tant que** Scrum Master, **je veux** figer le minuteur pendant une discussion, **afin que** la pause ne soit pas comptée comme parole.
- **Exigences :** FR-13 ; D3.
- **Dépendances :** S-E4-06, S-E4-03.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/session/session.page.ts` (+spec), `session.page.html`.
- **Tests :** composant.
- **Critères d'acceptation :**
  1. Given une Intervention active, When « Pause » est activé, Then le minuteur est figé, le libellé « En pause » avec l'icône ‖ s'affiche et le bouton devient « Reprendre ».
  2. Given la pause, When « Reprendre » est activé, Then le minuteur repart sans perte du temps accumulé.
  3. Given aucune Intervention en cours, Then « Pause » est désactivé.
  4. Given la pause, Then « Suivant » et le choix d'un Membre restent actifs, et la Session elle-même n'est pas suspendue.

#### S-E4-09 : Terminer la Session avec confirmation inline

- **En tant que** Scrum Master, **je veux** terminer la Session sans risque de clic accidentel, **afin de** ne pas clore le Daily par erreur.
- **Exigences :** FR-15 ; E-3 (exception à FR-19).
- **Dépendances :** S-E4-06, S-E4-03.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/session/session.page.ts` (+spec), `session.page.html`.
- **Tests :** composant.
- **Critères d'acceptation :**
  1. Given la Session, When « Terminer la session » est activé, Then un bandeau inline affiche « Terminer la session ? L'intervention en cours sera arrêtée. » avec « Terminer » et « Continuer », focus sur « Continuer ».
  2. Given « Continuer » ou Échap, Then le bandeau disparaît et rien ne change.
  3. Given « Terminer », Then l'Intervention est clôturée, la Session passe à `finished` et l'application affiche `/bilan`.
  4. Given le bandeau, Then aucun fond masquant n'est affiché et le minuteur reste visible.

#### S-E4-10 : Restaurer la Session après rechargement ou fermeture

- **En tant que** Scrum Master, **je veux** retrouver ma Session après un rechargement, **afin de** reprendre le Daily là où il s'était arrêté.
- **Exigences :** FR-16 ; H-15 ; E-4.
- **Dépendances :** S-E4-04, S-E4-05.
- **Estimation :** 3.
- **Fichiers :** `src/app/core/domain/session.reducer.ts` (`restoreSession`, +spec), `src/app/services/session.service.ts` (+spec), `src/app/features/session/session.page.ts`, `src/app/features/shared/status-banner.ts`.
- **Tests :** unitaires (`restoreSession`) ; composant (bandeau B-3).
- **Critères d'acceptation :**
  1. Given une Intervention en cours avec un checkpoint à T, When la page est rouverte après 3 minutes, Then l'application ouvre `/session`, l'Intervention est en pause à T et seul le temps jusqu'à T est compté.
  2. Given la restauration, Then le bandeau B-3 affiche « Session restaurée. L'intervention en cours a été mise en pause : reprenez-la quand vous voulez. ».
  3. Given la session restaurée, Then « Reprendre », « Suivant » et « Terminer la session » sont utilisables.
  4. Given une Session `finished` au rechargement, Then elle n'est pas restaurée comme Session en cours et l'application ouvre `/preparation`.

#### S-E4-11 : Gardes de route par phase de Session

- **En tant que** Scrum Master, **je veux** que chaque adresse ouvre le bon écran selon l'état, **afin de** ne jamais voir un écran incohérent.
- **Exigences :** FR-6, FR-16 ; ADR-04.
- **Dépendances :** S-E4-05, S-E4-04, S-E1-03.
- **Estimation :** 2.
- **Fichiers :** `src/app/app.guards.ts` (+spec), `src/app/app.routes.ts`.
- **Tests :** unitaires des gardes avec états simulés.
- **Critères d'acceptation :**
  1. Given aucune Session `running`, When `/session` est ouvert, Then la garde redirige vers `/preparation`.
  2. Given aucune Session `finished`, When `/bilan` est ouvert, Then la garde redirige vers `/preparation`.
  3. Given aucune équipe, When `/preparation` est ouvert, Then la garde redirige vers `/equipe`.
  4. Given la route vide, Then elle résout vers `/session` si une Session est en cours, vers `/preparation` si une équipe existe, sinon vers `/equipe`.

#### S-E4-12 : Verrouiller l'équipe pendant une Session

- **En tant que** Scrum Master, **je veux** que l'équipe ne change pas pendant le Daily, **afin de** garder un bilan fidèle.
- **Exigences :** FR-5 ; INV-15 ; A8.
- **Dépendances :** S-E4-05, S-E2-11.
- **Estimation :** 2.
- **Fichiers :** `src/app/services/team.service.ts` (`locked`, `commit`, +spec), `src/app/features/team-editor/team-editor.page.ts`, `src/app/features/preparation/preparation.page.ts`.
- **Tests :** unitaires ; composant.
- **Critères d'acceptation :**
  1. Given une Session `running`, When l'écran Équipe est ouvert par l'adresse, Then le texte « Session en cours : modification impossible. » est affiché et les champs sont désactivés.
  2. Given une Session `running`, Then le lien « Modifier l'équipe » est absent de E-2 et « Monter » et « Descendre » sont désactivés.
  3. Given une Session `running`, When `TeamService.commit` est appelé, Then il renvoie `SESSION_IN_PROGRESS`.

#### S-E4-13 : Annonces pour lecteurs d'écran pendant la Session

- **En tant que** utilisateur de lecteur d'écran, **je veux** être informé du changement de Membre, de la pause et de la reprise, **afin de** suivre le Daily sans voir l'écran.
- **Exigences :** NFR-13 ; E-10 (pour la partie polie).
- **Dépendances :** S-E4-06, S-E4-08.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/shared/live-region.ts` (+spec), `src/app/features/session/session.page.ts` (+spec).
- **Tests :** composant (contenu des zones aria-live).
- **Critères d'acceptation :**
  1. Given un changement de Membre courant, When il survient, Then la zone `role="status"` annonce « Au tour de [Prénom]. » une seule fois.
  2. Given une pause, Then l'annonce « En pause » est faite une fois ; given une reprise, Then « Reprise de l'intervention. ».
  3. Given trois ticks d'horloge sans événement, Then le contenu des zones aria-live ne change pas (le chronomètre n'est pas annoncé).

#### S-E4-14 : E2E de l'horloge en arrière-plan

- **En tant que** testeur, **je veux** un test qui simule un onglet masqué pendant 5 minutes, **afin de** prouver la précision du minuteur (SM-4).
- **Exigences :** NFR-6 ; FR-14 ; SM-4.
- **Dépendances :** S-E4-05, S-E1-05.
- **Estimation :** 2.
- **Fichiers :** `e2e/timer-background.spec.ts`.
- **Tests :** ce spec.
- **Critères d'acceptation :**
  1. Given une Session démarrée avec `page.clock`, When l'onglet est masqué et l'horloge avance de 5 minutes, Then le temps parlé affiché est différent du temps simulé d'au plus 1 seconde.
  2. Given 15 minutes de Session au total, Then l'écart mesuré reste inférieur à 1 seconde.

#### S-E4-15 : E2E de la restauration après rechargement

- **En tant que** testeur, **je veux** vérifier la restauration à la réouverture, **afin de** valider FR-16 de bout en bout.
- **Exigences :** FR-16 ; H-15.
- **Dépendances :** S-E4-10, S-E1-05.
- **Estimation :** 2.
- **Fichiers :** `e2e/restore-after-reload.spec.ts`.
- **Tests :** ce spec.
- **Critères d'acceptation :**
  1. Given une Intervention en cours, When la page est rechargée après une avance d'horloge de 3 minutes, Then le bandeau B-3 est visible et l'Intervention est en pause.
  2. Given la restauration, Then « Reprendre », « Suivant » et « Terminer la session » fonctionnent.

### 4.5 Epic E5 : Alerte de dépassement

#### S-E5-01 : Détection du dépassement, une fois par Membre et par Session

- **En tant que** Scrum Master, **je veux** que chaque dépassement ne soit signalé qu'une fois, **afin de** ne pas saturer l'équipe d'alertes.
- **Exigences :** FR-17 ; INV-14 ; D2 ; A4 ; E-15.
- **Dépendances :** S-E4-02, S-E4-01.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/session.reducer.ts` (effet `OVERRUN`, +spec), `src/app/core/domain/model.ts` (`overrunAt`).
- **Tests :** unitaires purs.
- **Critères d'acceptation :**
  1. Given un Membre alloué à 240 s et un temps parlé de 240 s exactement, Then aucun `OVERRUN`.
  2. Given un temps parlé qui dépasse 240 s, When `TICK` est appliqué, Then un seul effet `OVERRUN` est émis pour ce Membre.
  3. Given un Membre déjà en dépassement, When il reprend la parole et dépasse à nouveau, Then aucun nouvel effet `OVERRUN` n'est émis.
  4. Given deux Membres qui dépassent, Then chacun reçoit son propre effet.

#### S-E5-02 : Affichage visuel et textuel du dépassement

- **En tant que** Thomas, membre de l'équipe, **je veux** voir clairement que mon temps est dépassé, **afin de** conclure sans être le seul à être interrompu.
- **Exigences :** FR-17 ; NFR-13 ; NFR-14 ; E-10 ; DESIGN 6.2, 8.4.
- **Dépendances :** S-E5-01, S-E4-05.
- **Estimation :** 3.
- **Fichiers :** `src/app/features/session/session.page.ts` (+spec), `session.page.html`, `session.page.css`, `src/app/features/shared/live-region.ts`, `src/app/core/domain/format.ts`.
- **Tests :** composant ; unitaire de `formatOverrun`.
- **Critères d'acceptation :**
  1. Given le franchissement du temps alloué, When l'effet est reçu, Then le minuteur passe en couleur `--color-danger`, affiche le symbole ⚠, le libellé « Temps dépassé » et « +00:01 ».
  2. Given le dépassement, Then un élément `role="alert"` affiche « [Prénom] : Temps dépassé » une seule fois.
  3. Given un dépassement de 1 minute 04 secondes, Then le minuteur affiche « +01:04 ».
  4. Given la carte du Membre, Then elle prend le fond `--color-danger-soft` et l'information reste lisible sans la couleur (libellé et symbole).

#### S-E5-03 : Message d'alerte fermable, sans blocage

- **En tant que** Scrum Master, **je veux** fermer le message d'alerte sans perdre le minuteur, **afin de** garder l'écran propre.
- **Exigences :** FR-19 ; E-8.
- **Dépendances :** S-E5-02.
- **Estimation :** 1.
- **Fichiers :** `src/app/features/session/session.page.ts` (+spec), `session.page.html`.
- **Tests :** composant.
- **Critères d'acceptation :**
  1. Given le message d'alerte affiché, When « Fermer le message » est activé, Then seul le message disparaît ; le libellé « Temps dépassé » du minuteur reste.
  2. Given une Intervention en dépassement, Then aucune boîte modale (`role="dialog"` ou `aria-modal`) n'apparaît.
  3. Given l'alerte affichée, Then « Suivant » reste visible et actif.

#### S-E5-04 : Signal sonore unique et silencieux en cas de blocage

- **En tant que** Scrum Master, **je veux** un son bref au dépassement quand le navigateur l'autorise, **afin d'** attirer l'attention sans bloquer l'écran.
- **Exigences :** FR-18 ; ADR-09 ; H-12 ; R4.
- **Dépendances :** S-E5-01, S-E4-05.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/ports/audio.port.ts`, `src/app/core/adapters/web-audio.adapter.ts` (+spec), `src/app/services/alert.service.ts` (+spec).
- **Tests :** unitaires avec `AudioPort` simulé.
- **Critères d'acceptation :**
  1. Given le bouton « Démarrer la session » activé, When la Session démarre, Then `unlock()` est appelé.
  2. Given un effet `OVERRUN` et le son activé, Then `beep()` est appelé une seule fois pour ce Membre.
  3. Given le son désactivé, Then `beep()` n'est jamais appelé.
  4. Given `beep()` qui renvoie `blocked` ou `unsupported`, Then aucun message d'erreur n'est affiché et l'alerte visuelle reste en place.
  5. Given le son, Then aucun fichier audio n'est chargé (oscillateur 880 Hz, 250 ms).

#### S-E5-05 : Réglage « Son d'alerte » enregistré

- **En tant que** Scrum Master, **je veux** couper le son d'alerte et retrouver ce réglage à la visite suivante, **afin de** travailler en salle silencieuse.
- **Exigences :** FR-18 ; FR-24 ; DESIGN 8.9.
- **Dépendances :** S-E5-04, S-E2-03.
- **Estimation :** 2.
- **Fichiers :** `src/app/services/settings.service.ts` (+spec), `src/app/features/session/session.page.ts` (+spec), `session.page.html`.
- **Tests :** unitaire ; composant.
- **Critères d'acceptation :**
  1. Given un premier usage, Then le son est activé par défaut.
  2. Given le bouton dans l'en-tête de E-3, Then son libellé est « Son d'alerte : activé » ou « Son d'alerte : désactivé » selon l'état.
  3. Given un changement de réglage, When la page est rechargée, Then le réglage est conservé.

#### S-E5-06 : Reprise de parole après dépassement sans nouvelle alerte

- **En tant que** Thomas, **je veux** que mon retour à la parole ne déclenche pas une nouvelle alerte, **afin de** ne pas être sollicité une seconde fois.
- **Exigences :** FR-17 (dernière puce) ; E-15.
- **Dépendances :** S-E5-02.
- **Estimation :** 1.
- **Fichiers :** `src/app/features/session/session.page.ts` (+spec).
- **Tests :** composant.
- **Critères d'acceptation :**
  1. Given un Membre déjà en dépassement, When il reprend la parole, Then le minuteur affiche directement « Temps dépassé » et « +mm:ss ».
  2. Given cette reprise, Then aucun élément `role="alert"` nouveau n'est créé et aucun son n'est joué.

#### S-E5-07 : E2E de l'alerte de dépassement (UJ-3)

- **En tant que** testeur, **je veux** un test de bout en bout du dépassement, **afin de** valider FR-17 à FR-19 dans un parcours réel.
- **Exigences :** FR-17, FR-18, FR-19 (UJ-3).
- **Dépendances :** S-E5-03, S-E5-04, S-E5-05, S-E4-06.
- **Estimation :** 2.
- **Fichiers :** `e2e/overrun-alert.spec.ts`.
- **Tests :** ce spec (AudioContext simulé par `addInitScript` pour compter les bips).
- **Critères d'acceptation :**
  1. Given Thomas alloué à 4 min et parlant 4 min 20 s, When le franchissement a lieu, Then le message « Thomas : Temps dépassé » est dans un `role="alert"` et le minuteur affiche « +00:20 » à la fin.
  2. Given le son activé, Then un seul bip est joué pour Thomas.
  3. Given le son désactivé, Then aucun bip n'est joué et l'alerte visuelle reste.
  4. Given le dépassement, Then aucune boîte modale n'apparaît et « Suivant » est cliquable.

### 4.6 Epic E6 : Bilan, partage et portabilité

#### S-E6-01 : Calcul du Bilan

- **En tant que** développeur, **je veux** un calcul du bilan pur et testé, **afin que** l'écran et le texte copié donnent les mêmes chiffres.
- **Exigences :** FR-20 ; INV-13 ; INV-15.
- **Dépendances :** S-E4-03.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/summary.ts`, `src/app/core/domain/summary.spec.ts`.
- **Tests :** unitaires purs.
- **Critères d'acceptation :**
  1. Given un Membre alloué à 132 s et ayant parlé 125 s, Then la ligne a le statut `within` et « Dans le temps ».
  2. Given un Membre alloué à 240 s et ayant parlé 260 s, Then le statut est `over` et le dépassement arrondi au supérieur vaut 20 s.
  3. Given un dépassement de 0,4 s, Then il vaut au moins 1 s.
  4. Given la liste des Membres, Then les lignes suivent l'ordre de l'équipe, et les totaux sont les sommes.
  5. Given une Session sans Intervention, Then tous les Membres ont 0 s parlées (garde-fou A19).

#### S-E6-02 : Écran Bilan

- **En tant que** Inès, observatrice, **je veux** lire le bilan à l'écran, **afin de** voir le temps réel de chacun sans poser de question.
- **Exigences :** FR-20 ; NFR-14 ; NFR-20 ; DESIGN 8.5.
- **Dépendances :** S-E6-01, S-E4-09, S-E1-03.
- **Estimation :** 3.
- **Fichiers :** `src/app/features/summary/summary.page.ts` (+spec), `summary.page.html`, `summary.page.css`.
- **Tests :** composant ; E2E dans S-E6-10.
- **Critères d'acceptation :**
  1. Given une Session terminée, When `/bilan` s'affiche, Then il présente « Bilan de la session » en `h1`, le nom d'équipe, la date au format jj/mm/aaaa et les colonnes Prénom, Temps parlé, Temps alloué, Écart, Statut.
  2. Given un Membre en dépassement, Then sa ligne affiche « Dépassement de 00:20 » avec le symbole ⚠ et un fond `--color-danger-soft`.
  3. Given un Membre dans le temps, Then son statut est « Dans le temps » avec la coche.
  4. Given la ligne de total, Then elle affiche la somme parlée, la somme allouée, la durée prévue et la durée réelle.
  5. Given une largeur inférieure à 600 px, Then le même contenu s'affiche en cartes, dans le même ordre.

#### S-E6-03 : Texte brut du Bilan

- **En tant que** Scrum Master, **je veux** un texte prêt à coller dans le canal de l'équipe, **afin de** partager le résultat en une action.
- **Exigences :** FR-21 ; E-11 ; NFR-10 (pas de HTML ni de Markdown).
- **Dépendances :** S-E6-01.
- **Estimation :** 1.
- **Fichiers :** `src/app/core/domain/summary.ts` (`buildSummaryText`), `src/app/core/domain/summary.spec.ts`.
- **Tests :** unitaires.
- **Critères d'acceptation :**
  1. Given le bilan, When `buildSummaryText` est appelée, Then la première ligne est « Bilan : [Nom] (jj/mm/aaaa) », suivie de « Durée prévue : mm:ss - Durée réelle : mm:ss ».
  2. Given chaque Membre, Then une ligne « [Prénom] : parlé mm:ss / alloué mm:ss - Dans le temps » ou « - Dépassement de mm:ss ».
  3. Given le texte, Then il ne contient aucun caractère de Markdown ou de HTML (`#`, `*`, `|`, `<`, `>`).

#### S-E6-04 : Copier le Bilan

- **En tant que** Scrum Master, **je veux** copier le bilan d'un clic, **afin de** le coller dans le compte rendu.
- **Exigences :** FR-21 ; NFR-10 ; E-11.
- **Dépendances :** S-E6-03, S-E6-02.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/ports/clipboard.port.ts`, `src/app/core/adapters/clipboard.adapter.ts` (+spec), `src/app/features/summary/summary.page.ts` (+spec).
- **Tests :** unitaires avec `navigator.clipboard` simulé ; composant.
- **Critères d'acceptation :**
  1. Given « Copier le bilan » activé, When la copie réussit, Then `writeText` est appelé avec le texte de S-E6-03 et le bouton affiche « Copié ! » pendant 2 secondes.
  2. Given la copie réussie, Then « Copié ! » est annoncé par une zone `aria-live="polite"`.
  3. Given l'application, Then `navigator.clipboard.readText` n'est jamais appelé.

#### S-E6-05 : Copie de repli en lecture seule

- **En tant que** Scrum Master, **je veux** pouvoir copier le texte même si le presse-papiers est refusé, **afin de** ne pas perdre le bilan.
- **Exigences :** FR-22 ; ADR-10.
- **Dépendances :** S-E6-04.
- **Estimation :** 1.
- **Fichiers :** `src/app/features/summary/summary.page.ts` (+spec), `summary.page.html`.
- **Tests :** composant.
- **Critères d'acceptation :**
  1. Given une copie refusée, Then un champ `<textarea readonly>` contenant le bilan s'affiche avec « Copie automatique impossible. Sélectionnez le texte ci-dessous et copiez-le. ».
  2. Given l'affichage du champ, Then son contenu est présélectionné et il a le focus.
  3. Given un texte long sur 320 px, Then le champ défile sans élargir la page.

#### S-E6-06 : Conserver le dernier Bilan

- **En tant que** Scrum Master, **je veux** retrouver le bilan de la dernière Session tant que je n'en ai pas lancé une nouvelle, **afin de** le copier plus tard.
- **Exigences :** FR-23 ; H-16 ; E-4.
- **Dépendances :** S-E6-02, S-E4-04, S-E2-12.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/preparation/preparation.page.ts` (+spec), `src/app/features/summary/summary.page.ts` (+spec), `src/app/services/session.service.ts`.
- **Tests :** composant ; unitaire.
- **Critères d'acceptation :**
  1. Given un bilan existant, When E-2 s'affiche, Then le lien « Voir le dernier bilan » est visible et ouvre `/bilan` en lecture seule.
  2. Given « Nouvelle session » sur E-4, Then le bilan précédent est supprimé et E-2 s'affiche avec le focus sur son titre.
  3. Given un démarrage de nouvelle Session, Then le bilan précédent est effacé.

#### S-E6-07 : Exporter l'équipe en JSON

- **En tant que** Scrum Master, **je veux** sauvegarder mon équipe dans un fichier, **afin de** la restaurer après un changement d'ordinateur.
- **Exigences :** FR-26 ; FR-24 ; ADR-19 ; section 3.5 de l'architecture.
- **Dépendances :** S-E2-03, S-E2-05.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/export-schema.ts` (+spec), `src/app/core/domain/export.schema.json`, `src/app/core/ports/file.port.ts`, `src/app/core/adapters/browser-file.adapter.ts` (+spec), `src/app/services/export-import.service.ts` (+spec), `src/app/features/preparation/preparation.page.ts`.
- **Tests :** unitaires ; validation du fichier produit contre le JSON Schema ; garde réseau.
- **Critères d'acceptation :**
  1. Given « Exporter l'équipe » sur E-2, When il est activé, Then un fichier nommé `equipe-<slug>-AAAA-MM-JJ.json` est téléchargé.
  2. Given le nom « Équipe Plateforme », Then le slug est `equipe-plateforme` ; given un nom vide ou sans caractère valable, Then le slug est `equipe`. Le slug fait au maximum 40 caractères.
  3. Given le contenu, Then il contient l'équipe, la durée, le mode de répartition, l'ordre et le réglage du son, et ne contient ni session ni bilan.
  4. Given l'export, Then aucune requête réseau n'est émise.

#### S-E6-08 : Valider un fichier d'import

- **En tant que** Scrum Master, **je veux** qu'un fichier invalide soit refusé avec un motif précis, **afin de** ne jamais écraser mon équipe par une mauvaise sauvegarde.
- **Exigences :** FR-27 ; section 6.6 ; ADR-19.
- **Dépendances :** S-E6-07, S-E3-02.
- **Estimation :** 2.
- **Fichiers :** `src/app/core/domain/export-schema.ts` (`parseExport`, +spec), `src/app/services/export-import.service.ts` (`importFile`, +spec).
- **Tests :** unitaires avec fichiers valides et invalides.
- **Critères d'acceptation :**
  1. Given un fichier `.txt`, Then « Choisissez un fichier .json exporté par l'application. ».
  2. Given un fichier de plus de 100 Ko, Then « Fichier trop volumineux (max 100 Ko). », et la taille est vérifiée avant lecture.
  3. Given un JSON invalide, Then « Le fichier est illisible (JSON invalide). » ; given `schemaVersion` 2, Then « Version du fichier non prise en charge. ».
  4. Given une équipe qui viole les invariants (prénoms en doublon, somme manuelle inexacte), Then « Le fichier ne contient pas d'équipe valide. ».
  5. Given un fichier valide en répartition égale, Then les temps sont recalculés, et les identifiants sont régénérés.

#### S-E6-09 : Importer une équipe depuis l'écran de préparation

- **En tant que** Scrum Master, **je veux** restaurer mon équipe depuis un fichier, **afin de** reprendre là où je m'étais arrêté.
- **Exigences :** FR-27 ; FR-1 (confirmation de remplacement) ; A9.
- **Dépendances :** S-E6-08, S-E2-04, S-E4-12.
- **Estimation :** 2.
- **Fichiers :** `src/app/features/preparation/preparation.page.ts` (+spec), `preparation.page.html`, `src/app/services/team.service.ts` (`replaceFromImport`, +spec).
- **Tests :** composant ; unitaire.
- **Critères d'acceptation :**
  1. Given une équipe existante, When un fichier valide est choisi, Then D-4 s'ouvre avec « Remplacer l'équipe actuelle par celle du fichier ? », boutons « Remplacer » et « Annuler », focus sur « Annuler ».
  2. Given « Remplacer », Then l'équipe est remplacée, les réglages du son sont importés et E-2 s'affiche.
  3. Given un fichier invalide, Then le message de S-E6-08 s'affiche dans une zone `role="alert"` et l'équipe actuelle est inchangée.
  4. Given une Session en cours, Then l'import est refusé avec « Terminez la session en cours avant d'importer une équipe. » [À VALIDER : texte proposé par l'architecture, A9].

#### S-E6-10 : E2E du parcours complet (UJ-1 à UJ-4)

- **En tant que** testeur, **je veux** un test du parcours complet, **afin de** valider la V1 de bout en bout, hors ligne compris.
- **Exigences :** NFR-2, NFR-8, NFR-21 ; SM-3, SM-5, SM-8 ; UJ-1 à UJ-4 ; NFR-9 (réinitialisation).
- **Dépendances :** S-E6-04, S-E6-06, S-E4-09, S-E5-07, S-E3-09, S-E6-09.
- **Estimation :** 3.
- **Fichiers :** `e2e/daily-happy-path.spec.ts`, `e2e/fixtures.ts`, `e2e/offline.spec.ts` (variante complète).
- **Tests :** ce spec ; exécuté sur `chromium` en PR.
- **Critères d'acceptation :**
  1. Given une application vide, When l'équipe de UJ-1 est créée, démarrée, passée de Membre en Membre, avec un dépassement de Thomas, puis terminée, Then le bilan affiche « Thomas : Dépassement de 00:20 » et le total.
  2. Given le bilan, When « Copier le bilan » est activé avec la permission presse-papiers, Then « Copié ! » est affiché.
  3. Given « Nouvelle session », Then le bilan précédent n'est plus accessible.
  4. Given le parcours complet, Then la garde réseau ne voit aucune requête hors origine (SM-8).
  5. Given le parcours, When le réseau est coupé après le premier chargement, Then le parcours complet se déroule sans erreur (NFR-2, SM-5).
  6. Given la réinitialisation de D-5, Then la clé `scrum-timer:v1` n'existe plus.

#### S-E6-11 : Accessibilité vérifiée par axe-core et au clavier

- **En tant que** utilisateur au clavier ou avec lecteur d'écran, **je veux** que les écrans Équipe, Session et Bilan soient accessibles, **afin d'** utiliser l'outil sans souris.
- **Exigences :** NFR-11, NFR-12, NFR-13, NFR-17 ; SM-6.
- **Dépendances :** S-E6-02, S-E5-07, S-E4-07.
- **Estimation :** 2.
- **Fichiers :** `e2e/responsive-a11y.spec.ts` (partie axe et clavier), `package.json` (`@axe-core/playwright`).
- **Tests :** ce spec ; axe-core sur E-1, E-3 et E-4.
- **Critères d'acceptation :**
  1. Given chacun des trois écrans, When axe-core est lancé, Then aucune violation de niveau critique ou grave n'est trouvée.
  2. Given `lang="fr"` sur la page, Then la règle `html-has-lang` passe.
  3. Given UJ-1 et UJ-2 réalisés uniquement avec Tab, Entrée et Espace, Then le parcours est complet et le focus est toujours visible.
  4. Given l'écran Session, Then la zone aria-live du Membre courant et celle du dépassement sont présentes.

#### S-E6-12 : Vérifier 320 px et les cibles de 44 px

- **En tant que** utilisateur de téléphone, **je veux** que chaque écran tienne à 320 px, **afin d'** utiliser l'outil sur un petit écran.
- **Exigences :** NFR-15, NFR-18 ; DESIGN 5.1.
- **Dépendances :** S-E1-07, S-E6-02.
- **Estimation :** 1.
- **Fichiers :** `e2e/responsive-a11y.spec.ts` (partie 320 px).
- **Tests :** ce spec.
- **Critères d'acceptation :**
  1. Given une largeur de 320 px, When E-1, E-2, E-3 et E-4 sont affichés, Then aucun défilement horizontal n'apparaît.
  2. Given les contrôles principaux, Then leur zone cliquable mesure au moins 44 × 44 px.
  3. Given une largeur inférieure à 480 px, Then le chronomètre s'affiche à 48 px.

#### S-E6-13 : Navigateurs cibles et contrôle iOS

- **En tant que** Scrum Master, **je veux** que l'outil fonctionne sur les navigateurs de l'équipe, **afin de** ne pas découvrir un bug le jour du Daily.
- **Exigences :** NFR-19 ; H-9.
- **Dépendances :** S-E1-16.
- **Estimation :** 2.
- **Fichiers :** `playwright.config.ts` (projets `firefox`, `webkit`), `.github/workflows/ci.yml` (job `e2e` sur `main`), `_bmad-output/planning-artifacts/` (liste de contrôle iOS, à produire par le testeur).
- **Tests :** E2E sur les trois navigateurs ; test manuel sur iOS 16.4.
- **Critères d'acceptation :**
  1. Given une fusion sur `main`, When le job `e2e` s'exécute, Then les projets `chromium`, `firefox` et `webkit` passent.
  2. Given un iPhone ou iPad iOS 16.4, When le parcours UJ-1 est joué manuellement, Then le résultat est consigné.
  3. Given un échec sur un navigateur, Then la porte G2 est bloquée.

#### S-E6-14 : Protocole de pilote

- **En tant que** PO, **je veux** un protocole de pilote mesurable, **afin de** vérifier les KPI SM-1 à SM-3 avant la V1.
- **Exigences :** SM-1, SM-3 ; R6 ; porte G3.
- **Dépendances :** S-E6-10, S-E1-17.
- **Estimation :** 1.
- **Fichiers :** protocole de pilote à rédiger par le PO (hors code applicatif).
- **Tests :** revue par le client ; mesure manuelle.
- **Critères d'acceptation :**
  1. Given deux équipes pilotes et quatre semaines, When le pilote démarre, Then le protocole précise l'auto-déclaration SM-1 après chaque Daily.
  2. Given le test chronométré de SM-2 (6 Membres, moins de 2 minutes) avec 5 personnes, Then le protocole décrit les conditions.
  3. Given la règle R6, Then le protocole interdit tout classement des Membres et toute utilisation de SM-C1 comme objectif individuel.

---

## 5. Ordre d'exécution

Le premier lot est le spike. Chaque lot est livrable de bout en bout ; un jalon marque une livraison utilisable. Les épics sont entrelacés quand une dépendance l'exige (par exemple la durée et l'allocation sont nécessaires à la création d'équipe). Il n'existe aucune dépendance circulaire ; chaque story n'a que des prédécesseurs déjà listés.

### Lot 1 : Fondations

1. S-E1-01 : spike S0 (Karma et routage hash sur build prod)
2. S-E1-02 : shell PWA
3. S-E1-03 : routes hash et base href
4. S-E1-04 : CSP et contrôle de confidentialité
5. S-E1-06 : jetons de couleur et contrastes
6. S-E1-08 : formatage et messages
7. S-E1-05 : Playwright et garde réseau
8. S-E3-02 : répartition égale (domaine)
9. S-E3-01 : validation de la durée

### Lot 2 : Créer et retrouver une équipe (jalon J1)

10. S-E2-01 : nom d'équipe
11. S-E2-02 : prénoms
12. S-E2-03 : stockage versionné
13. S-E2-04 : confirmation et bandeau partagés
14. S-E2-05 : créer une équipe et la retrouver
15. S-E2-12 : écran de préparation et garde
16. S-E2-07 : limite de 15 Membres
17. S-E2-06 : remplacer l'équipe existante

### Lot 3 : Gérer l'équipe et la répartition

18. S-E3-03 : champ durée et temps moyen
19. S-E3-04 : répartition égale affichée
20. S-E2-08 : renommer
21. S-E2-09 : supprimer
22. S-E2-10 : ordonner
23. S-E2-11 : modifier nom et durée
24. S-E2-13 : bandeaux de stockage
25. S-E2-14 : réinitialisation
26. S-E3-05 : répartition manuelle
27. S-E3-06 : indicateur de total
28. S-E3-07 : revenir à l'égalité
29. S-E3-08 : membres et durée en manuel

### Lot 4 : Socle hors ligne et déploiement (jalon J2)

30. S-E1-07 : responsive et cibles
31. S-E1-09 : service worker
32. S-E1-10 : mise à jour non interruptive
33. S-E1-11 : Docker et Compose
34. S-E1-13 : contrôles de build
35. S-E1-15 : CI qualité
36. S-E1-14 : Lighthouse
37. S-E1-12 : test hors ligne
38. S-E1-16 : CI e2e et Lighthouse
39. S-E1-17 : déploiement GitHub Pages (jalon J2, sous réserve de `gh auth login`)

### Lot 5 : Session et minuteur

40. S-E4-01 : calcul du temps et garde d'horloge
41. S-E4-02 : démarrer, suivant, choisir
42. S-E4-03 : pause et fin (domaine)
43. S-E5-01 : détection du dépassement (domaine)
44. S-E4-04 : persistance de la Session
45. S-E4-05 : démarrage et minuteur
46. S-E4-06 : passer la parole
47. S-E4-07 : donner la parole à un Membre
48. S-E4-08 : pause UI
49. S-E4-09 : terminer la Session
50. S-E4-10 : restauration
51. S-E4-11 : gardes de route
52. S-E4-12 : verrouillage de l'équipe
53. S-E4-13 : annonces lecteur d'écran
54. S-E3-09 : E2E UJ-2
55. S-E4-14 : E2E horloge en arrière-plan
56. S-E4-15 : E2E restauration

### Lot 6 : Alerte de dépassement

57. S-E5-02 : affichage du dépassement
58. S-E5-03 : message fermable
59. S-E5-06 : reprise sans alerte
60. S-E5-04 : signal sonore
61. S-E5-05 : réglage du son
62. S-E5-07 : E2E UJ-3

### Lot 7 : Bilan et portabilité (jalon J3)

63. S-E6-01 : calcul du bilan
64. S-E6-02 : écran Bilan
65. S-E6-03 : texte brut
66. S-E6-04 : copier le bilan
67. S-E6-05 : copie de repli
68. S-E6-06 : dernier bilan
69. S-E6-07 : export JSON
70. S-E6-08 : validation d'import
71. S-E6-09 : import depuis la préparation
72. S-E6-12 : 320 px et cibles
73. S-E6-11 : accessibilité axe et clavier
74. S-E6-13 : navigateurs cibles
75. S-E6-10 : E2E parcours complet, hors ligne compris
76. S-E6-14 : protocole de pilote

---

## 6. Définition de terminé commune

Une story n'est terminée que si tous les points suivants sont vrais. Ils s'appliquent en plus des critères propres à chaque story.

1. **Tests verts :** tous les tests unitaires, de composant et E2E listés dans la story passent. Les tests du domaine `core/domain` couvrent au moins 90 % des lignes et des branches (porte G1). Aucun test existant n'est désactivé.
2. **Build de production vert :** `npm run build:prod` réussit avec `APP_BASE_HREF=/scrum-speaking-timer/`, puis `check:privacy`, `check:bundle` et `check:base-href` passent.
3. **Qualité statique :** lint et vérification du format passent ; `core/domain` n'importe rien d'Angular.
4. **Revue indépendante approuvée :** la pull request est relue par un pair ou par l'agent reviewer (porte G1). La checklist ADR de la pull request est cochée, ou le changement modifie explicitement l'ADR concerné.
5. **Accessibilité vérifiée sur le parcours concerné :** axe-core ne remonte aucune violation critique ou grave, le parcours est réalisable au clavier seul, le focus est visible, les annonces `aria-live` ont le texte prévu, et aucune information n'est portée par la couleur seule.
6. **Confidentialité :** aucune requête hors origine n'apparaît dans la garde réseau.
7. **Taille :** la story tient dans une session de travail. Si ce n'est pas le cas, elle est découpée avant d'être reprise.
8. **Documentation :** si un schéma persisté, un schéma d'export ou un ADR change, l'architecture est mise à jour et le test de migration est présent (ADR-15).

Pour les stories qui touchent `main` : les porte G2 s'appliquent (E2E `firefox` et `webkit`, Lighthouse accessibilité ≥ 0,95, test de fumée après déploiement).

---

## 7. Points ouverts et écarts documentaires

Ces points n'empêchent pas le démarrage du lot 1. Ils doivent être tranchés avant les lots indiqués.

| # | Point | Effet sur les stories | Avant |
|---|---|---|---|
| 1 | PRD section 8.2 et ADR-13 citent Vitest ; la décision retenue est Karma et Jasmine | Les stories utilisent Karma et Jasmine. Le PRD et l'ADR-13 sont à mettre à jour après S-E1-01. | Lot 1 |
| 2 | FR-17 et H-14 prévoient une nouvelle alerte par Intervention ; INV-14 et D2 prévoient une seule alerte par Membre et par Session | Les stories suivent INV-14 et D2 (S-E5-01, S-E5-06). | Lot 5 |
| 3 | EXPERIENCE E-5 prévoit un champ vide pour un Membre ajouté en manuel ; ADR-08 prévoit 30 s | Les stories suivent ADR-08 ; le champ vide n'existe que si l'utilisateur vide la valeur (S-E3-08). | Lot 3 |
| 4 | Point d'entrée « Nouvelle équipe » non défini | S-E2-06 l'ajoute avec libellé à valider. | Lot 2 |
| 5 | Textes marqués [À VALIDER] : import pendant une Session (S-E6-09), champ vide en manuel (S-E3-08), point d'entrée de création (S-E2-06) | Textes à faire valider par le client. | Lot 3 et lot 7 |
| 6 | Chronomètre de Session « Session : 07:12 / 15:00 » (E-7) | Non planifié : décision client requise, hors lot. | Décision client |
| 7 | Raccourci clavier pour « Suivant » (Q5) et wake lock (Q6), avertissement à 30 s (Q7), ordre aléatoire (Q8) | Non retenus en V1 (A13 à A15). Aucune story. | — |
| 8 | Angular 20 arrive en fin de support LTS pendant le projet (risque T1, ADR-01) | Aucune story dédiée. Un contrôle de version est à prévoir avant le lot 7. | Avant lot 7 |
| 9 | Déploiement : `gh auth login`, source Pages et environnement `github-pages` | Bloquent S-E1-17 seulement. | Lot 4 |
| 10 | Fichiers existants à la racine (`Dockerfile`, `nginx.conf`, `docker-compose.yml`) qui ne suivent pas l'arborescence cible | Traités dans S-E1-11. | Lot 4 |
| 11 | Icônes PNG maskables non générées (DESIGN 10.1) | Traité dans S-E1-02. | Lot 1 |

---

## 8. Résultat du spike S-E1-01

*À remplir par le développeur qui réalise le spike. Ne pas renseigner avant exécution.*

- Version Angular exacte :
- Commande de test et résultat :
- Résultat du build de production avec `--base-href /scrum-speaking-timer/` :
- Résultat du routage en hash après rechargement direct :
- Décision zoneless (architecture 5.1) :
- Anomalies et escalades :

---

*Fin du document. Aucun code applicatif n'a été écrit. Ce document est la référence de découpage ; le PRD et l'architecture restent les sources des règles.*
