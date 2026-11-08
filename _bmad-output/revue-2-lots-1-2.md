CHANGEMENTS DEMANDÉS

# Revue 2 : lots 1 et 2 (Scrum Speaking Timer)

**Périmètre :** les 9 commits 704d5fc à ecf8d47 (corrections de la revue `revue-lots-1-2.md`), puis `git diff 11ae0ab..HEAD -- src public e2e scripts angular.json karma.conf.js package.json`.
**Méthode :** lecture du diff de chaque commit de correction, puis du code complet des domaines `core/domain`, `core/adapters`, `services`, `features`, `app.*`, `styles.css`, `index.html`, `manifest`, `scripts/` et `e2e/`. Les messages de commit n'ont pas servi de preuve : chaque affirmation renvoie au code ou à une exécution. Le développeur n'a rien modifié ; je n'ai rien committé ni poussé. Le seul fichier du dépôt écrit est ce rapport (les journaux d'exécution sont dans le dossier scratchpad de la session). Le build de production a régénéré `dist/` (ignoré par git), sans déploiement.

## Verdict et décompte

| Gravité | Nombre |
|---|---|
| Bloquant | 0 |
| Important | 3 |
| Mineur | 4 |

Le verdict reste **CHANGEMENTS DEMANDÉS** : trois points importants restent ouverts (N-1 à N-3), et le lot ne peut être approuvé tant qu'ils ne sont pas traités ou explicitement reportés. Les corrections de C-1, C-2, I-1, I-2, I-3 et I-4 sont réelles et prouvées. C-3, I-5 et I-6 sont corrigées pour le scénario d'origine, mais chacune laisse un constat ouvert (N-1, N-2, N-3).

La décision client « jEAN » (épopée) contre « JEAN » (PRD 6.3) n'est pas jugée. Le code suit le PRD.

---

## Vérification des corrections

| Constat | Commit | Correction réelle | Le test prouve le défaut | Échoue sans la correction | Statut |
|---|---|---|---|---|---|
| C-1 (320 px, cibles 44 px, mouvement réduit) | 704d5fc | Oui : `minmax(0, 1fr)` et `min-width: 0` (`team-editor.page.ts`), lien `inline-flex` de 44 px (`preparation.page.ts`) | Oui : `e2e/responsive-a11y.spec.ts`, 8 tests de mise en page à 320 px et un test de transition à 0 s | Oui pour le débordement et la cible du lien, d'après le commit. Non rejoué (je n'ai pas restauré l'ancien CSS) | Corrigé et prouvé |
| C-2 (motif sous le bouton) | 84b6661 | Oui : le `<p id="start-help">` suit le `div.actions` | Oui : `compareDocumentPosition` sur l'ordre dans le DOM | Oui : avec l'ancien ordre, le motif précède le conteneur, donc l'assertion échoue | Corrigé et prouvé |
| C-3 (message de données illisibles affiché) | 7cfab14 | Oui pour le message FR-25 : `app.html` et `app.ts` affichent `app-status-banner` avec le texte exact | Oui : `app.spec.ts` vérifie le texte dans le bandeau et son absence sans donnée illisible | Oui : l'ancien code n'a aucun bandeau, `querySelector` renvoie null | Corrigé et prouvé pour S-E2-03 n°3. Le bandeau B-1 (écriture refusée, FR-25) reste absent : voir N-1 |
| I-1 (thème sombre `prefers-color-scheme`) | d34dce5 | Pas de changement de CSS : le bloc `@media` (`styles.css`) était déjà correct | Oui : `e2e/theme.spec.ts`, 4 cas, dont un système en sombre sans `data-theme` qui attend `#111827` | Oui : si le bloc `@media` est retiré, `--color-bg` reste `#FFFFFF` et le test échoue | Corrigé et prouvé |
| I-2 (19 messages contre PRD 6) | 83bf136 | Oui : table `ATTENDU` typée `Record<ValidationCode, …>`, un test par code | Oui : j'ai comparé les 19 textes de `messages.ts` à PRD 6.1 à 6.5, ils sont identiques | Oui : toute altération d'un texte casse un `toBe` | Corrigé et prouvé |
| I-3 (URL sans schéma et WebSocket) | ee11993 | Oui : `URL_PATTERN` élargi à `wss?` et `//hôte.tld` | Oui : j'ai appliqué l'ancien motif aux entrées des tests, il ne trouve rien. Le nouveau trouve `//cdn.example.com/lib.js` et `wss://relay.example.com/ws` | Oui | Corrigé et prouvé. Contournements restants : N-4 |
| I-4 (favicon et logo non versionnés) | 385a47b | Oui : `git ls-files public` liste `favicon.svg` et `icons/logo.svg` | Oui : `index-html.test.mjs` vérifie l'index git | Oui : un fichier non suivi fait échouer l'assertion. Limite : le test est ignoré hors dépôt git (`skip`, pas un échec) | Corrigé et prouvé |
| I-5 (prénom saisi perdu à l'enregistrement) | 82c8d0a | Oui : `onSubmit` ajoute le prénom saisi, ou bloque avec son erreur | Oui : deux tests (prénom valide ajouté, prénom invalide bloque sans sauvegarde) | Oui : l'ancien code sauvegarde sans « Léa » et enregistre malgré « Jean3 » | Corrigé et prouvé pour le scénario. Régression de focus introduite : N-2 |
| I-6 (données illisibles successives) | ecf8d47 | Oui : trois emplacements `backup`, `backup-2`, `backup-3` (`persistence.service.ts`, `storage-schema.ts`) | Oui pour deux corruptions : `BACKUP_KEYS[1]` doit valoir la seconde donnée ; test d'échec d'écriture (santé `unavailable`) | Oui : l'ancien code ne garde pas la seconde donnée et ne change pas la santé | Corrigé et prouvé pour le scénario à deux corruptions. Décision non consignée dans l'ADR-05 et le cas à quatre corruptions : N-3 |

---

## Nouveaux constats

### Bloquant

Aucun.

### Important

**N-1. Échec de stockage silencieux : bandeau FR-25 (B-1) absent**
- **Fichiers :** `src/app/services/team.service.ts` l.47 (le résultat de `persistence.save` est ignoré) ; `src/app/services/persistence.service.ts` (`health` est écrit, jamais lu : aucune lecture dans `src/` hors spec) ; `src/app/app.html`.
- **Scénario d'échec :** navigation privée stricte, ou quota dépassé. Le Scrum Master crée son équipe, l'écran passe à `/preparation` sans aucun message, puis il ferme l'onglet : l'équipe est perdue. PRD FR-25 et ADR-05 exigent le bandeau « Vos données ne seront pas conservées après fermeture. Exportez votre équipe pour la sauvegarder. ». Ce texte n'existe pas dans `src/`.
- **Correction :** un bandeau `warning` fermable, texte exact, affiché quand `health()` vaut `degraded` ou `unavailable`, dans `app.html` à côté du bandeau B-2. Un test de composant : écriture en échec, puis texte présent. Si le PO reporte ce bandeau à S-E2-13 (qui le prévoit, hors du lot 1-2), la section 8 doit marquer S-E2-03 (FR-25) comme « partiel ». Le constat reste important tant que ce report n'est pas acté.

**N-2. Régression de focus à l'enregistrement (introduite par I-5)**
- **Fichier :** `src/app/features/team-editor/team-editor.page.ts`, `onSubmit`, l.247.
- **Scénario d'échec :** nom d'équipe vide, deux Membres, « Jean3 » dans le champ d'ajout, clic sur « Enregistrer ». `addMember()` refuse le prénom et place le focus sur `#member-name`, alors que la première erreur est le nom (« Donnez un nom à votre équipe. » est affiché). Avant I-5, `focusFirstInvalid()` plaçait le focus sur le nom. PRD section 6, en introduction : « la première erreur reçoit le focus à l'enregistrement ».
- **Correction :** dans `onSubmit`, traiter l'ordre nom, durée, prénom : si le nom ou la durée sont invalides, appeler `focusFirstInvalid()` avant de traiter le champ d'ajout. Ajouter un test : nom vide, prénom invalide, focus sur `#team-name`.

**N-3. Politique des données illisibles non consignée, et perte silencieuse à la quatrième occurrence (ADR-05)**
- **Fichiers :** `src/app/services/persistence.service.ts` (`keepBackup`, l.48-67) ; `src/app/core/domain/storage-schema.ts` l.9 ; `_bmad-output/planning-artifacts/architecture.md` l.147 (« copié une fois dans `scrum-timer:v1:backup` »), l.491 (« une fois ») et l.1050 (« Les données ne sont jamais écrasées sans sauvegarde ») ; `epics-et-stories.md`, S-E2-03 n°3 (« copié une seule fois ») ; `persistence.service.spec.ts` l.50 (titre du test, devenu faux).
- **Scénario d'échec :** quatre données illisibles successives A, B, C, D. Après A, B et C, les trois emplacements sont pris. Quand D arrive, il écrase C dans `backup-3` sans copie : C disparaît sans trace. C'est exactement la perte silencieuse que I-6 voulait supprimer, reportée à la quatrième occurrence. Aucun test ne couvre ce cas.
- **Correction :** choisir et consigner. (a) Garder la rotation à trois emplacements, l'écrire dans l'ADR-05 et dans S-E2-03 n°3, ajouter un test à quatre cas et corriger le titre l.50. (b) Ne jamais écraser une copie existante : signaler l'impossibilité de sauvegarder (bandeau, voir N-1). Dans les deux cas, la future réinitialisation (S-E2-14, FR-28) devra supprimer les trois clés, pas seulement `:backup`.

### Mineur

**N-4. Garde de build contournable (`check-privacy`)**
- **Fichier :** `scripts/check-privacy.mjs`, constante `URL_PATTERN`.
- **Scénario d'échec :** j'ai vérifié avec `node scripts/check-privacy.mjs` sur un dossier de test : `const u="https:\/\/evil.com/x";` donne « aucune URL externe », code 0. Une adresse `//10.0.0.1/x.js` ou `//localhost/x.js` passe aussi. La CSP et la garde E2E limitent le risque à l'exécution, mais la garde de build de NFR-8 est incomplète.
- **Correction :** remplacer `\/` par `/` avant le test, accepter `//` suivi d'une adresse IP ou de `localhost`, et ajouter ces cas à `scripts/tests/check-privacy.test.mjs`.

**N-5. Annonces d'état et lien d'erreur (reprise de M-6, toujours ouvert)**
- **Fichiers :** `team-editor.page.ts` l.92 (`role="status"` créé avec son texte), bloc `@if (!canSave())` et bloc `start-help` de `preparation.page.ts`, `team-editor.page.ts` l.69 (`#limit-error` non relié au champ d'ajout).
- **Scénario d'échec :** la plupart des lecteurs d'écran n'annoncent pas une région live créée avec son contenu. L'erreur « Une équipe ne peut pas dépasser 15 membres. » n'est pas lue au moment où le 15e Membre est ajouté.
- **Correction :** conteneur `role="status"` présent en permanence, dont le texte change ensuite. `aria-describedby` du champ d'ajout pointe vers `#limit-error` quand `atLimit()`.

**N-6. Copie de sauvegarde en échec : le message reste affiché sans trace de l'échec**
- **Fichier :** `persistence.service.ts`, `load()` (l.31-34) et `keepBackup` (l.56-66).
- **Scénario d'échec :** si l'écriture de la copie échoue, `health` passe à `unavailable`, mais `dataIssue` reste `unreadable`. Le message « ignorées » est affiché, sans indiquer que la donnée n'est pas conservée. Au premier enregistrement, la donnée est écrasée.
- **Correction :** traiter avec N-1 : afficher l'échec de copie, et le journaliser côté état.

**N-7. Documents de référence non versionnés**
- **Fichiers :** `_bmad-output/planning-artifacts/prd.md`, `epics-et-stories.md`, `DESIGN.md`, `EXPERIENCE.md` (non suivis), `architecture.md` (modifié, non commité), `_bmad-output/dev-notes.md`.
- **Constat :** les références de cette revue (sections du PRD, critères des stories, ADR-05) ne sont pas reproductibles depuis `HEAD`. Le code et les tests, eux, sont reproductibles.
- **Correction :** versionner ces documents lors de la prochaine livraison, sur demande explicite (rien n'a été committé ici).

---

## Points non traités de la revue précédente

Les mineurs M-1 à M-12 ne font pas partie des 9 commits de correction. Restent ouverts : M-6 (repris en N-5), M-7 (piège de focus de `confirm-dialog.ts`, Tab hors de la boîte), M-10 (`e2e/fixtures.ts` ne capte que les requêtes de page), M-11 (huit anciennes icônes `icon-72x72` à `icon-384x384` toujours présentes dans `public/icons/`, conservées volontairement d'après `dev-notes.md`). M-1 est une décision client.

Le prototype supprimé (`timer.logic`, `session.service`, `storage.service`, leurs specs) est un retrait voulu, consigné dans `dev-notes.md` point 6. Ce n'est pas une régression.

---

## Vérifications exécutées

- **`npx ng test --watch=false`** : 124 SUCCESS sur 124, code 0 (ChromeHeadless). Il y en avait 98 lors de la première revue. Aucun `fit`, `fdescribe`, `xit`, `xdescribe`, `.only` ni `.skip` dans `src/`, `e2e/`, `scripts/`.
- **`npm run e2e`** (`ng serve` lancé par Playwright, navigateur `chrome`) : 18 passed, 0 failed, code 0. Détail : 8 tests de mise en page 320 px et cibles (C-1), 1 test de transition réduite, 4 tests de thème (I-1), 5 tests de confidentialité réseau.
- **`npx ng build --configuration production`** puis **`npm run check:privacy`** : 11 fichiers analysés, aucune URL externe, code 0. Le build était à jour : `main-ZPECTQSR.js` a le même hash qu'avant.
- **`npm run test:scripts`** : 11 pass, 0 fail.
- **Recherche dans `src/`** (hors spec) : aucun `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `HttpClient`, `innerHTML`, `eval`, `sessionStorage` ni `indexedDB`. Un seul `console.error`, dans `main.ts`. `localStorage` n'est accédé que via `LocalStorageAdapter`.
- **Contrôle des messages** : les 19 textes de `messages.ts` sont identiques à PRD section 6.1 à 6.5, y compris les virgules, les espaces et les apostrophes droites.

Journaux complets des exécutions : `C:\Users\HP840G~1\AppData\Local\Temp\claude\C--Users-HP-840-G6--claude-spares-spare-2TQxWZ\b358034a-27c9-4f14-ae6e-3134506ba772\scratchpad\ngtest.txt` (unitaires) et `C:\Users\HP840G~1\AppData\Local\Temp\claude\C--Users-HP-840-G6--claude-spares-spare-2TQxWZ\b358034a-27c9-4f14-ae6e-3134506ba772\scratchpad\e2e.txt` (e2e).
