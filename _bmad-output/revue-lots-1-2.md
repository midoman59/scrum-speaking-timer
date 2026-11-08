CHANGEMENTS DEMANDÉS

# Revue indépendante : lots 1 et 2 (Scrum Speaking Timer)

**Périmètre :** `git diff 11ae0ab..HEAD -- src public angular.json karma.conf.js package.json`, plus les scripts de contrôle (`scripts/`, `scripts/tests/`, `e2e/`, `playwright.config.ts`).
**Critères :** stories S-E1-01 à S-E1-08, S-E2-01 à S-E2-07 et S-E2-12 (`_bmad-output/planning-artifacts/epics-et-stories.md`, section 4), règles du `prd.md` (sections 4 et 6), `architecture.md` (ADR-05, ADR-12), `DESIGN.md`.
**Méthode :** lecture complète du code et des specs, contrôle que chaque critère est couvert et qu'un test casserait si le comportement l'était. Lentilles : exactitude, cas limites, confidentialité, persistance, accessibilité, simplicité. Le workflow interactif de la skill `bmad-code-review` n'a pas été lancé (il exige une validation humaine à chaque étape) ; seul son esprit a été appliqué.

**Exécution des tests :**
- `npx ng test --watch=false` : 98 SUCCESS sur 98, code de sortie 0 (ChromeHeadless).
- `npm run test:scripts` : 7 pass, 0 fail.
- Aucun test sauté (`xit`, `xdescribe`, `fit`, `pending`) dans `src/`, `e2e/`, `scripts/`.
- Non exécutés : `npm run e2e` (Playwright, Chrome et `ng serve` requis) et le build de production avec `--base-href`.

**Confidentialité :** aucun appel réseau dans `src/` hors fichiers de spec (pas de `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `HttpClient`). Aucune URL absolue ni chemin `/scrum-speaking-timer` dans `src/`. La CSP de `src/index.html` (ligne 8) est identique à celle de l'ADR-12, caractère pour caractère.

## Verdict et décompte

| Gravité | Nombre |
|---|---|
| Bloquant | 3 |
| Important | 6 |
| Mineur | 12 |

---

## Constats bloquants

### C-1. S-E1-07 n'a aucun test (3 critères non couverts)
- **Fichiers :** absence de `e2e/responsive-a11y.spec.ts` (prévu par la story, « partie 320 px »), absence de test de composant pour la classe de cible. Le code existe (`src/styles.css` l.56, `--target-min` ; l.147-154, `prefers-reduced-motion`), mais rien ne le vérifie.
- **Description :** les trois critères Given/When/Then (`scrollWidth <= clientWidth` à 320 px avec marge de 16 px ; zone cliquable de 44 × 44 px ; transition à 0 ms en mouvement réduit) ne sont testés nulle part.
- **Scénario d'échec :** un défilement horizontal apparaît à 320 px après un ajout de style (par exemple une largeur fixe sur `.member-list li`), ou la transition des boutons reste à 150 ms (`styles.css` l.169). Aucun test ne le signale, et la CI ne peut pas le détecter.
- **Correction :** ajouter `e2e/responsive-a11y.spec.ts` avec `setViewportSize({width: 320, height: 640})` sur `#/equipe`, `#/preparation`, `#/session`, `#/bilan` (contrôle `scrollWidth <= clientWidth`, marge latérale de 16 px), un contrôle des `getBoundingClientRect` des boutons et des lignes de Membre (au moins 44 px), et un test d'émulation `page.emulateMedia({reducedMotion: 'reduce'})` qui lit `getComputedStyle(button).transitionDuration`.

### C-2. S-E2-12 critère 3 : le motif n'est pas « sous le bouton »
- **Fichier :** `src/app/features/preparation/preparation.page.ts` l.30-43.
- **Description :** le `<p id="start-help">` (motif) est placé avant le `<div class="actions">` qui contient le bouton. Le critère exige « le motif affiché sous le bouton ».
- **Scénario d'échec :** une équipe à un seul Membre affiche le motif au-dessus du bouton désactivé. Le lecteur d'écran l'annonce avant le bouton, et le visuel ne correspond pas à la spécification.
- **Test :** `preparation.page.spec.ts` l.53-67 vérifie seulement la présence du texte et l'état `disabled`. Il n'échouerait donc pas sur la position.
- **Correction :** déplacer le `@if (reason(); as text)` après le `div.actions`, puis ajouter une assertion sur l'ordre des éléments (`button.compareDocumentPosition(p)` ou index dans `children`).

### C-3. S-E2-03 critère 3 : le message de données illisibles n'est jamais affiché
- **Fichiers :** `src/app/services/persistence.service.ts` l.9-11 (constante `UNREADABLE_DATA_MESSAGE`) et l.19 (`dataIssue`). Aucun composant ne lit `dataIssue`, `health` ou la constante (vérification par recherche dans `src/`). `src/app/app.html` ne contient aucun bandeau.
- **Description :** le critère exige que, pour des données illisibles, « le message est « Les données enregistrées sont illisibles et ont été ignorées. Vous pouvez importer un fichier de sauvegarde. » ». Le service positionne un état, mais l'utilisateur ne voit rien. Le même défaut vaut pour FR-25 (« Vos données ne seront pas conservées… ») : un échec d'écriture est silencieux pour l'utilisateur. Le composant `app-status-banner` existe mais n'est utilisé nulle part.
- **Test :** `persistence.service.spec.ts` l.50-60 vérifie `dataIssue() === 'unreadable'`, pas le texte affiché. Aucun test n'échouerait si le message disparaissait de l'interface.
- **Scénario d'échec :** un Scrum Master ouvre l'application avec une sauvegarde corrompue. L'équipe est vide sans aucune explication, et il ne sait pas qu'un import de sauvegarde est possible.
- **Correction :** afficher dans `app.ts` (ou `app.html`) un `<app-status-banner variant="warning" role="status">` relié à `persistence.dataIssue()` et `persistence.health()`, avec le texte exact. Ajouter un test de composant sur `App` qui vérifie la présence du texte. Si le PO reporte ce bandeau à S-E2-13, le critère 3 de S-E2-03 doit être explicitement marqué « partiel » dans la section 8 du document.

---

## Constats importants

### I-1. S-E1-06 critère 1 : le bloc `@media (prefers-color-scheme: dark)` n'est testé par rien
- **Fichiers :** `src/styles.css` l.67-98 ; `src/app/core/design/contrast.spec.ts` l.84-115 (les tests de jetons ne fixent que `data-theme`).
- **Scénario d'échec :** la suppression du bloc `@media` (ou une faute de frappe dans la garde `:root:not([data-theme="light"])`) ne fait échouer aucun test. Un utilisateur dont le système est en sombre obtient alors le thème clair, sans alerte.
- **Correction :** un test qui fixe `window.matchMedia` ou émule `prefers-color-scheme` (Playwright `emulateMedia({colorScheme: 'dark'})` dans un E2E), puis vérifie `--color-bg` = `#111827`, et un test de non-régression pour `data-theme="light"` qui force le clair.

### I-2. S-E1-08 critère 5 : la table de messages n'est vérifiée que pour 6 codes sur 19
- **Fichier :** `src/app/core/domain/messages.spec.ts` l.6-11 (vérifie seulement que chaque texte est non vide) et l.13-22 (six textes exacts).
- **Scénario d'échec :** une coquille dans `TEAM_NAME_TOO_LONG`, `MEMBER_NAME_TOO_LONG`, `MEMBER_COUNT_MAX` ou `ALLOCATION_TOO_LONG` passe la CI. Le critère demande « identique à PRD section 6 » pour chaque code.
- **Correction :** une table `attendu: Record<ValidationCode, string>` recopiée de la section 6 du PRD, et une assertion `toBe` pour chacun des 19 codes. Vérifié à la main dans ce rapport : les textes de `messages.ts` correspondent au PRD ; seul le test manque.

### I-3. check-privacy ne détecte pas les URL sans schéma (`//hôte/…`) ni les WebSocket
- **Fichier :** `scripts/check-privacy.mjs` l.25 (`URL_PATTERN = /https?:\/\/…/g`). Aucun test ne couvre ce cas (`scripts/tests/check-privacy.test.mjs`).
- **Scénario d'échec :** `<script src="//cdn.example.com/lib.js"></script>` dans `src/index.html` passe le contrôle de build avec le code 0. La CSP bloque bien la requête à l'exécution, mais la garde de build de NFR-8 est contournée.
- **Correction :** élargir le motif à `/(?:https?:|wss?:)?\/\/[^\s"'\`<>)]+/g`, ajouter un test `//cdn.example.com` (code 1 attendu). Vérifier les faux positifs éventuels sur `//` dans le code minifié.

### I-4. `public/favicon.svg` est référencé par `src/index.html` mais n'est pas versionné
- **Fichiers :** `src/index.html` l.11 (`<link rel="icon" type="image/svg+xml" href="favicon.svg">`). `git ls-files public` ne liste pas `favicon.svg` (il apparaît en `??` dans `git status`). Idem pour `public/icons/logo.svg`, source des icônes de S-E1-02.
- **Scénario d'échec :** un clone propre ou la CI Docker produit un build sans favicon SVG, avec une erreur 404 dans la console. Le dépôt HEAD n'est pas autosuffisant.
- **Correction :** `git add public/favicon.svg public/icons/logo.svg` lors de la prochaine livraison (ne pas committer sans demande explicite).

### I-5. Saisie d'un prénom non ajouté : perdue silencieusement à l'enregistrement
- **Fichiers :** `src/app/features/team-editor/team-editor.page.ts` l.242-271 (`onSubmit` et `save`) : `save()` construit l'équipe uniquement à partir de `this.members()` et ignore `form.controls.member`.
- **Scénario d'échec :** le Scrum Master a deux Membres, tape « Thomas » dans le champ d'ajout sans appuyer sur Entrée ni sur « Ajouter », puis clique « Enregistrer l'équipe ». L'équipe est enregistrée à deux Membres, « Thomas » disparaît, et rien ne l'indique. Aucun test ne couvre ce cas.
- **Correction :** au choix, (a) à l'enregistrement, si le champ contient une saisie non vide, la valider et l'ajouter (ou bloquer avec « Ajoutez ou effacez le prénom saisi » et le focus sur le champ) ; (b) ajouter un test qui vérifie le comportement retenu.

### I-6. Sauvegarde des données illisibles : une seule copie, la suivante est perdue en silence
- **Fichier :** `src/app/services/persistence.service.ts` l.48-54 (`keepBackup` n'écrit que si la clé de sauvegarde est absente ; l'erreur d'écriture est ignorée).
- **Scénario d'échec :** (1) une première donnée corrompue est copiée dans `scrum-timer:v1:backup`. (2) Le Scrum Master crée une équipe, ce qui écrase la clé principale. (3) Une seconde corruption survient : `keepBackup` ne fait rien car la sauvegarde existe déjà, puis la prochaine sauvegarde écrase la seconde donnée corrompue sans copie. ADR-05 prévoit « copié une fois » et « ignorer sans sauvegarde perd la donnée » : le comportement actuel va à l'encontre de cette intention.
- **Correction :** décider explicitement et le consigner dans l'ADR-05 : soit une rotation (`scrum-timer:v1:backup`, puis `…:backup-2`, ou écraser seulement si identique), soit une copie horodatée. Ajouter un test pour le scénario à deux corruptions. Signaler aussi l'échec d'écriture de la sauvegarde (aujourd'hui silencieux).

---

## Constats mineurs

### M-1. Critère S-E2-02 n°1 contredit le PRD
- **Fichier :** `_bmad-output/planning-artifacts/epics-et-stories.md` l.418 : « Given « jEAN », Then il reste « jEAN » ». Le PRD 6.3 (l.494) dit que seule la première lettre est mise en majuscule, donc « JEAN ». Le code et `normalize.spec.ts` l.14 suivent le PRD. Corriger le critère de la story, pas le code.

### M-2. Résultats du spike S-E1-01 non consignés à l'endroit prévu
- **Fichier :** `_bmad-output/planning-artifacts/epics-et-stories.md` l.1362-1369 (section 8 vide, « À remplir »). Les résultats (Angular 20.3.35, 98 specs) figurent dans `_bmad-output/dev-notes.md`. Renvoyer ou recopier dans la section 8, critère 5 de S-E1-01.

### M-3. Jetons sombres dupliqués dans `src/styles.css`
- **Fichier :** `src/styles.css` l.76-97 et l.101-128 : 22 jetons recopiés à l'identique. Risque de dérive entre les deux blocs. Solution : un seul sélecteur `:root:not([data-theme="light"])` et `:root[data-theme="dark"]` partageant une règle commune (ou une classe), ou accepter explicitement la duplication avec un test d'égalité.

### M-4. `MemoryStorage` dupliqué dans deux specs
- **Fichiers :** `src/app/services/persistence.service.spec.ts` l.8-26 et `src/app/services/team.service.spec.ts` l.8-21, alors que `src/app/testing/memory-storage.ts` existe. Utiliser le helper commun (la version du service ajoute `readFailure` et `writeFailure`, à déplacer dans le helper).

### M-5. Valeurs magiques dans `addMember`
- **Fichier :** `src/app/features/team-editor/team-editor.page.ts` l.212-216 : `durationSec: 900` et `allocationMode: 'equal'` codés en dur pour un brouillon factice. Le brouillon ne sert qu'à valider le prénom : le commenter, ou passer directement par `validateMemberName` avec `this.members()`.

### M-6. Accessibilité : annonces et liens des messages
- **Fichiers :** `src/app/features/team-editor/team-editor.page.ts` l.91-93 (`role="status"` rendu dynamiquement : beaucoup de lecteurs d'écran ne l'annoncent pas à l'apparition) et l.68-70 (message de limite de 15 Membres non relié au champ). Les messages d'erreur liés au champ sont bien traités (`aria-describedby`, l.82).

### M-7. Piège de focus incomplet dans la boîte de confirmation
- **Fichier :** `src/app/features/shared/confirm-dialog.ts` l.116-138. Le Tab n'est traité que sur le `keydown` de la boîte. Si le focus se trouve sur `body` (par exemple après un clic sur le fond), Tab ne revient pas dans la boîte. Ajouter un gestionnaire `keydown` au niveau du document, ou rendre le reste de la page `inert`. Le test `confirm-dialog.spec.ts` ne couvre pas ce cas.

### M-8. Structure de fichiers différente de la story
- **Fichiers :** les stories S-E2-05, S-E2-07 et S-E2-12 prévoient `team-editor.page.html/.css` et `preparation.page.html/.css`. Les templates sont inline dans les `.ts`. Fonctionnellement acceptable ; à acter dans la story ou dans l'architecture.

### M-9. Test du manifeste : présence des fichiers d'icônes non vérifiée
- **Fichier :** `src/app/core/pwa/manifest.spec.ts` l.31-35. Le critère 2 de S-E1-02 demande que les PNG soient présents dans `public/icons/`. Le test vérifie les tailles déclarées, pas l'existence (seule l'icône maskable est récupérée par `fetch`, l.37-42).

### M-10. Garde réseau E2E : le câblage n'est pas testé
- **Fichier :** `e2e/fixtures.ts` l.8-22 (`page.on('request')` et levée d'erreur à la fin du test). Seul le helper pur `e2e/network-guard.mjs` est testé (`scripts/tests/network-guard.test.mjs`). Le critère 2 de S-E1-05 (le test échoue en nommant l'URL) n'est donc démontré que pour la fonction d'assemblage du message, non pour la fixture.

### M-11. Icônes obsolètes versionnées
- **Fichiers :** `public/icons/icon-72x72.png`, `icon-96x96.png`, `icon-128x128.png`, `icon-144x144.png`, `icon-152x152.png`, `icon-384x384.png`, `icon-192x192.png`, `icon-512x512.png` : plus référencés par le manifeste (qui utilise `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`). Les supprimer, ou les garder explicitement.

### M-12. Options de lancement Chrome des tests
- **Fichier :** `karma.conf.js` l.9 : `--no-sandbox` et `--disable-dev-shm-usage` appliqués à tous les lancements. Acceptable en conteneur ou en CI, mais à réserver à ce contexte si la suite est lancée en local.

---

## Critères vérifiés

Chaque critère indiqué comme vérifié est couvert par un test qui échouerait si le comportement était cassé, ou correspond à une vérification de code confirmée.

- **S-E1-02** : critères 1, 2 (présence des tailles, réserve M-9), 3 (`index-html.test.mjs`), 4 (`manifest.spec.ts`, maskable accessible).
- **S-E1-03** : critères 1 (`app.config.spec.ts`, instance de `HashLocationStrategy`), 2 (`app.routes.spec.ts`, titres h1 par route), 3 (redirection de `''` vers `/equipe`), 4 (`no-hardcoded-base.test.mjs`).
- **S-E1-04** : critères 1 (`csp.test.mjs`, égalité exacte avec l'ADR-12), 2 et 3 (`check-privacy.test.mjs`, code 1 et code 0). Réserve I-3 pour les URL sans schéma.
- **S-E1-06** : critère 2 (`contrast.spec.ts`, 17 couples clairs et 17 sombres, seuils 4,5 et 3), critère 3 (règle `:focus-visible` sans `outline: none`, test structurel), critère 4 (`body` en blanc calculé). Critère 1 partiel, voir I-1.
- **S-E1-08** : critère 1 (`format.spec.ts` : 225 s, 7 380 s), 2 (3 599 et 3 600 s), 3 (20 000 ms, 1 ms), 4 (08/11/2026). Critère 5 partiel, voir I-2.
- **S-E2-01** : critères 1 à 4 (`validation.spec.ts`, `normalize.spec.ts`, `messages.spec.ts` pour le texte de « Donnez un nom… »). Textes de 50 et 51 caractères vérifiés à la main.
- **S-E2-02** : critères 2 à 6 (`validation.spec.ts`, Léa / Lea, doublon, Jean3, emoji, 30 / 31 caractères, forme NFD, renommage vers soi-même). Critère 1 vérifié avec la correction de M-1.
- **S-E2-03** : critère 1 (`persistence.service.spec.ts`, clé absente), 2 (`storage-schema.spec.ts` et persistance restaurée), 4 (`STORAGE_QUOTA`, `health = degraded`, pas d'exception), 5 (`local-storage.adapter.spec.ts`, `SecurityError`). Critère 3 : état vérifié, message non affiché (C-3) et sauvegarde unique à reconsidérer (I-6).
- **S-E2-04** : critères 1 (focus initial sur « Annuler »), 2 (Échap), 3 (piège Tab et retour du focus au déclencheur) dans `confirm-dialog.spec.ts`, 4 (`role` selon la gravité et bouton « Fermer le message », `status-banner.spec.ts`).
- **S-E2-05** : critères 1 (`team-editor.page.spec.ts`), 2 (`team-editor.page.spec.ts` et `team.service.spec.ts`, `allocationMode: "equal"` et 450 s), 3 (texte d'état à un Membre), 5 (Entrée, focus et ajout en fin de liste). Critère 4 : restauration vérifiée (`app.routes.spec.ts`), durée de moins d'une seconde non mesurée (voir ci-dessous).
- **S-E2-06** : critères 1 (texte exact de D-1 et focus sur « Annuler »), 2 (« Annuler » ne change rien, vérifié sur le stockage), 3 (« Remplacer » remplace et navigue), 4 (lien « Nouvelle équipe » vers `#/equipe`, `preparation.page.spec.ts`). Échap couvert par le test générique de `confirm-dialog.spec.ts`.
- **S-E2-07** : critères 1 (15e Membre, champ et bouton désactivés, message), 2 (`aria-describedby`, prénom gardé, Membre non ajouté), 3 (focus après erreur). Testés en composant et en unitaire (`draft.spec.ts`).
- **S-E2-12** : critère 1 (`preparation.page.spec.ts`, h1, nom, « 15 min », lignes « 1 Camille 07:30 »), 2 (garde vers `/equipe`), 3 pour l'état désactivé et le texte du motif. Position non conforme : C-2.

## Critères non vérifiés

- **S-E1-01** : critère 1 (`ng test` code 0) vérifié par exécution. Critères 2 (build de production sous `/scrum-speaking-timer/`), 3 (routage hash après rechargement sur le build servi) et 5 (résultats consignés dans la section 8) non vérifiés. Voir M-2.
- **S-E1-04** : critère 4 (aucune police ou feuille de style CDN) non testé. La CSP (`style-src 'self' 'unsafe-inline'`, `font-src 'self'`) l'empêche à l'exécution, mais aucun test ne le vérifie.
- **S-E1-05** : critère 1 (`npm run e2e` passe avec `chromium`) non exécuté. Critères 2 et 3 : câblage de la garde non testé (M-10) ; le spec `privacy-network.spec.ts` n'a pas été lancé.
- **S-E1-07** : aucun critère couvert (C-1).
- **S-E2-05** : critère 4, « en moins d'une seconde », non mesuré.
- **S-E2-03** : critère 3, affichage du message (C-3), non vérifiable tant que le bandeau n'existe pas.

## Rappel

Aucun fichier de `src/` n'a été modifié. Le seul fichier écrit est ce rapport. Aucun déploiement n'a été lancé. Le build de production et `npm run e2e` restent à faire par le développeur ou la CI.
