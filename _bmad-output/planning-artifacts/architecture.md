# Architecture : Scrum Speaking Timer

**Auteur :** Winston, System Architect (BMAD `bmad-agent-architect`)
**Statut :** Révisée v2, proposée pour validation. Remplace la version « Validée pour la V1 » du 2026-11-08, qui ne couvrait ni le PRD v2 ni les décisions d'orchestration.
**Date :** 2026-11-08
**Sources :** [PRD v2](./prd.md) (référence pour les règles de comportement), [parcours UX](./ux.md), [brief produit](./product-brief.md)
**Dépôt :** `C:\Projects\Timer`, application Angular à la racine du dépôt, documentation dans `_bmad-output`

---

## 0. Synthèse

Le Scrum Speaking Timer est une PWA Angular 20 (standalone, signals) sans backend. Toutes les données restent dans le navigateur. Le PRD fixe le comportement ; ce document choisit comment le réaliser et de quelle façon le vérifier.

Décisions d'orchestration appliquées. Elles priment sur le PRD lorsque celui-ci diffère.

| # | Décision | Effet sur l'architecture |
|---|---|---|
| D1 | V1 sur un seul appareil partagé, sans serveur | Pas de synchronisation ni de compte. Q1 et Q4 sont tranchées (ADR-18). NFR-8 est tenable. |
| D2 | Le temps alloué est un total par Membre pour toute la Session | `allocatedSec` appartient au Membre de la Session. Le temps parlé est cumulé sur toutes les Interventions. L'alerte de dépassement est émise une fois par Membre et par Session (annexe A, A4). |
| D3 | La Pause se fait par Intervention | `pausedAt` est porté par `Intervention`. La Session n'a pas d'état « en pause ». |
| D4 | En répartition manuelle, la somme des temps égale la Durée de cérémonie | Invariant bloquant INV-04, vérifié au moment de l'enregistrement. Q3 est tranchée. |
| D5 | Export et import JSON font partie de la V1 | Schéma JSON versionné, validé à l'import (ADR-19). |

Changements majeurs par rapport à la v1 de ce document :

- la mesure du temps passe par l'horodatage `Date.now()` avec une garde contre les régressions d'horloge (ADR-06) ;
- la logique métier est une fonction pure (reducer) testée sans Angular (ADR-02, ADR-03) ;
- le routage passe en mode hash, faute de quoi un rechargement sur GitHub Pages renvoie une 404 (ADR-04) ;
- le stockage est versionné, et les données illisibles sont sauvegardées avant d'être ignorées (ADR-05) ;
- une CSP `meta` et une garde réseau en E2E vérifient l'absence de requête tierce (ADR-12) ;
- les portes de qualité sont explicites (G1 à G3, ADR-15) ;
- la section 9 liste les incohérences du PRD, avec la décision prise pour chacune.

---

## 1. Vue d'ensemble

### 1.1 Diagramme des couches

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 2. PRÉSENTATION  (Angular, standalone, OnPush, ReactiveForms)              │
│    TeamEditorPage (/equipe)   PreparationPage (/preparation)               │
│    SessionPage (/session)     SummaryPage (/bilan)                         │
│    Composants partagés : ConfirmDialog, LiveRegion, StatusBanner           │
│    Responsabilité : affichage, saisie, focus, annonces ARIA. Aucune règle. │
├────────────────────────────────────────────────────────────────────────────┤
│ 3. APPLICATION  (services Angular, état en signals)                        │
│    TeamService  SessionService  SettingsService  PersistenceService        │
│    AlertService  ClockService   ExportImportService  DataResetService      │
│    Responsabilité : tenir l'état, orchestrer, appeler le domaine, persister│
├────────────────────────────────────────────────────────────────────────────┤
│ 1. DOMAINE  (TypeScript pur, aucun import @angular, aucun DOM)             │
│    model · validation · allocation · draft · session.reducer · clock-time  │
│    format · summary · storage-schema · export-schema · normalize           │
│    Responsabilité : toutes les règles du PRD (invariants, calculs, bilan). │
├────────────────────────────────────────────────────────────────────────────┤
│ PORTS  (interfaces + InjectionToken, dans core/ports)                      │
│    StoragePort · ClockPort · ClipboardPort · AudioPort · FilePort          │
├────────────────────────────────────────────────────────────────────────────┤
│ 4. ADAPTATEURS  (implémentations navigateur, dans core/adapters)           │
│    LocalStorageAdapter · SystemClockAdapter · ClipboardAdapter             │
│    WebAudioAdapter · BrowserFileAdapter                                    │
├────────────────────────────────────────────────────────────────────────────┤
│ 5. PLATEFORME  GitHub Pages (HTTPS, statique) · Service Worker (ngsw)      │
│    Manifeste PWA · GitHub Actions · Docker (dev et test local)             │
└────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Règles de dépendance

- Une couche n'importe que les couches situées sous elle. Le domaine n'importe rien d'Angular ni du DOM. Cette règle est vérifiée par ESLint (`no-restricted-imports` sur `core/domain/**`).
- Les services dépendent des ports, jamais des adaptateurs. Les adaptateurs sont branchés dans `app.config.ts`. Les tests remplacent les adaptateurs par des faux (horloge pilotable, stockage en mémoire, audio muet).
- Le temps ne se lit qu'à travers `ClockPort`. Aucun appel à `Date.now()` ou `performance.now()` en dehors de l'adaptateur.
- Aucune règle métier dans les templates. Un template affiche des valeurs dérivées du domaine.

### 1.3 Flux principaux

- **Démarrage** : `APP_INITIALIZER` appelle `PersistenceService.load()`, qui lit `StoragePort`, valide le contenu avec `storage-schema`, puis initialise `TeamService`, `SettingsService` et `SessionService`. Si une Session est En cours, la restauration applique la Pause (ADR-06) et la route `/session` est choisie.
- **Action utilisateur** (Suivant, Pause, choix d'un Membre) : la page appelle un service. Le service appelle le reducer pur, met à jour le signal, puis appelle `PersistenceService.save()`. L'affichage se met à jour sans attendre la persistance.
- **Tick** : `ClockService` publie `now` toutes les 250 ms, uniquement pendant une Session En cours. Le tick ne fait qu'un affichage. Les durées sont recalculées à partir de `now` et de l'horodatage stocké. Un compteur n'est jamais décrémenté.
- **Fermeture** : `pagehide` ou `visibilitychange` (masquée) déclenche une sauvegarde immédiate. Un checkpoint est aussi écrit toutes les 5 s pendant une Intervention.

---

## 2. Décisions d'architecture (ADR)

Format : statut, contexte, décision, alternatives écartées, conséquences.

### ADR-01. Framework et version : Angular 20.3 standalone

- **Statut :** Acceptée, à réviser avant la release (voir la note sur le support).
- **Contexte :** le PRD et le dépôt existant utilisent Angular 20 (`@angular/core ^20.3.0`, `@angular/build ^20.3.42`, TypeScript 5.9). Le PRD demande des composants standalone et des signals.
- **Décision :** Angular 20.3.x, composants standalone, sans NgModule. Node 22 LTS pour la CI et les images Docker. Le fichier `.nvmrc` fixe la version.
- **Note sur le support :** selon la politique publiée par Angular (environ 6 mois de support actif, puis environ 12 mois de LTS), la v20 arrive en fin de support LTS vers la fin de l'année 2026. La date exacte est à vérifier sur angular.dev avant la release. Action : figer 20.3.x pendant les epics E1 à E5, puis monter vers la version majeure supportée avant la release V1 (epic E6). Cette montée fera l'objet d'une mise à jour de cet ADR.
- **Alternatives écartées :**
  - *Angular 21 ou plus récent dès maintenant* : le dépôt est déjà en 20.3 ; la montée en cours de projet coûte plus qu'elle n'apporte à ce stade.
  - *Un framework léger (Svelte, Preact)* : le PRD impose Angular.
- **Conséquences :** le code suit les conventions Angular 20 (`@if`, `@for`, `input()`, `computed()`). Une montée de version est prévue et planifiée.

### ADR-02. Découpage en couches : domaine pur, ports, adaptateurs

- **Statut :** Acceptée.
- **Contexte :** les règles du PRD (répartition, mesure, validation, bilan, format des fichiers) sont nombreuses et doivent être vérifiables sans navigateur. Le PRD exige aussi des tests à horloge simulée (FR-14, SM-4).
- **Décision :** toute règle est une fonction pure dans `core/domain`. Les accès au navigateur (stockage, horloge, presse-papiers, audio, fichiers) passent par des ports (`InjectionToken`) implémentés par des adaptateurs.
- **Alternatives écartées :**
  - *Règles dans les services ou les composants* : rend les tests dépendants d'Angular et duplique les règles entre pages.
  - *Librairie de domaine séparée (monorepo Nx)* : surdimensionné pour une application de quelques écrans.
- **Conséquences :** le domaine se teste avec Vitest ou Jasmine sans TestBed. Les règles de validation ne sont écrites qu'une fois, utilisées par les formulaires, le service, l'import et les tests E2E.

### ADR-03. Gestion d'état : signals et reducer pur

- **Statut :** Acceptée.
- **Contexte :** l'état tient en un petit nombre d'objets (équipe, session, réglages). Il n'est partagé que par quelques pages.
- **Décision :**
  - chaque service privé détient un `signal` d'état et expose des `computed` en lecture seule ;
  - la transition de Session est un reducer pur `reduceSession(state, event) → Result<{ state, effects }, SessionEventError>` (`core/domain/session.reducer.ts`). Les effets (`OVERRUN`, `ERROR`) sont renvoyés, jamais exécutés dans le reducer ;
  - la persistance est appelée explicitement après chaque mutation. Aucun `effect()` ne sert à persister : l'ordre et les tests restent lisibles.
- **Alternatives écartées :**
  - *NgRx ou un store* : trop lourd pour l'état V1.
  - *Un `effect()` qui persiste chaque signal* : rend l'ordre des écritures implicite et difficile à tester.
  - *Une classe mutable sans reducer* : les transitions invalides (ex. Pause sans Intervention) se vérifient moins bien.
- **Conséquences :** `SessionService` reste mince. Le reducer porte les transitions de la machine d'états du PRD (section 7.2), testables une par une.

### ADR-04. Routage : mode hash et gardes par phase

- **Statut :** Acceptée. Corrige le code existant (`app.routes.ts` utilise le mode chemin).
- **Contexte :** GitHub Pages sert `https://<owner>.github.io/<repo>/`. Un rechargement sur `/session` renvoie une 404 en mode chemin. FR-16 impose qu'un rechargement pendant une Session restaure la Session.
- **Décision :** `provideRouter(routes, withHashLocation())`. Les URLs sont de la forme `/<repo>/#/session`. Les routes sont `/equipe`, `/preparation`, `/session` et `/bilan`. Les gardes (`app.guards.ts`) lisent la phase de session :
  - `/session` exige une Session En cours, sinon redirection vers `/preparation` ;
  - `/bilan` exige une Session Terminée, sinon redirection vers `/preparation` ;
  - `/preparation` exige une Équipe, sinon redirection vers `/equipe` ;
  - `''` se résout selon l'état initial : `/session` si une Session est En cours, `/preparation` si une Équipe existe, `/equipe` sinon (FR-6, FR-16).
- **Alternatives écartées :**
  - *Mode chemin avec `404.html` copié de `index.html`* : fonctionne, mais le service worker et les liens profonds deviennent plus fragiles.
  - *Mode chemin avec un serveur Docker* : inutile, la cible de production est GitHub Pages.
- **Conséquences :** les URLs contiennent `#`. Ce n'est pas un problème, l'application n'est pas indexée.

### ADR-05. Persistance : localStorage versionné, validé, avec sauvegarde des données illisibles

- **Statut :** Acceptée.
- **Contexte :** FR-24 et FR-25 demandent une persistance entre visites, une tolérance aux erreurs de stockage et une récupération des données illisibles. Le PRD exige qu'une version plus récente de l'application (ou un retour arrière, voir section 6) ne détruise pas les données.
- **Décision :**
  - une seule clé, `scrum-timer:v1`, qui contient une enveloppe `StoredRootV1` avec `schemaVersion: 1` (section 3.4) ;
  - écriture à chaque mutation et checkpoint pendant une Intervention ;
  - à la lecture, `parseStoredRoot(raw)` valide la structure et les invariants. Si la lecture échoue (JSON invalide, schéma inconnu, version supérieure à 1, invariant violé), le brut est copié dans la première case libre de trois emplacements : `scrum-timer:v1:backup`, `scrum-timer:v1:backup-2`, `scrum-timer:v1:backup-3` (décision I-6). Une donnée déjà présente dans un emplacement n'est pas recopiée. Quand les trois emplacements sont pris, le brut remplace la troisième copie et la perte est signalée par un bandeau (N-3, texte à valider par le PO). L'application démarre ensuite sans équipe avec le message FR-25 ;
  - les erreurs d'écriture (`QuotaExceededError`, accès refusé) passent l'état de santé à `degraded`. La Session continue en mémoire et un bandeau est affiché (FR-25) ;
  - toutes les opérations `localStorage` passent par `LocalStorageAdapter`, qui encapsule `try/catch` et renvoie un `Result`.
- **Alternatives écartées :**
  - *IndexedDB* : asynchrone, plus complexe, sans bénéfice pour quelques Ko de données.
  - *Une clé par objet* : multiplie les écritures partielles et les états incohérents.
  - *Ignorer sans sauvegarde* : perd la donnée en cas de retour arrière ou de corruption.
- **Conséquences :** une migration future passe par une fonction pure `migrate(v1 → v2)` ou par une nouvelle clé `scrum-timer:v2`. Le test « version inconnue → sauvegarde + démarrage vide » est obligatoire en E2E. La réinitialisation future (FR-28, S-E2-14) supprime les trois clés de sauvegarde, pas seulement `…:backup`.

### ADR-06. Mesure du temps par horodatage avec garde de régression

- **Statut :** Acceptée. Modifie H-10 et la section 8.4 du PRD (voir annexe A, A5).
- **Contexte :** FR-14 demande un calcul selon l'horloge, sans décrément. Il impose une précision inférieure à 1 s sur 15 min, onglet masqué inclus (NFR-6). Il impose que la mise en veille soit comptée selon l'horloge. Le PRD (H-10) propose `performance.now()` pour les durées en cours. Or `performance.now()` ne progresse pas pendant la veille sur certaines plateformes, ce qui sous-compte le temps après une mise en veille.
- **Décision :**
  1. La source unique est `Date.now()` lue par `ClockPort`. Toutes les valeurs sont des entiers en millisecondes.
  2. Une Intervention a `startedAt`, `pausedAt` (nul hors pause) et `pausedTotalMs` (somme des pauses closes). Le temps parlé d'une Intervention est `(pausedAt ?? now) − startedAt − pausedTotalMs`, borné à 0 par le bas.
  3. À la clôture d'une Intervention, la durée est ajoutée à `stats.spokenMs`. Le temps parlé affiché est `stats.spokenMs + durée de l'Intervention en cours`.
  4. Garde de régression : `effectiveNow = max(Date.now() + clockOffsetMs, lastSeenMs)`. Si l'horloge système recule, `clockOffsetMs` est augmenté de l'écart. Le temps effectif ne recule donc jamais. Un événement `CLOCK_REGRESSION` est journalisé en console (`console.error`) et n'est pas affiché à l'utilisateur (FR-14).
  5. Le tick d'affichage (250 ms, `ClockService`) ne sert qu'à l'affichage. Une fenêtre masquée ralentit le tick, mais pas la mesure.
  6. Persistance : un checkpoint (`lastCheckpointAt`) est écrit toutes les 5 s pendant une Intervention, et immédiatement à `pagehide` ou à `visibilitychange` (masquée). À la restauration, l'Intervention est mise en pause à `lastCheckpointAt` (H-15). Le temps écoulé entre le checkpoint et la fermeture est donc compté, celui écoulé pendant la fermeture ne l'est pas. En cas de crash sans événement de fermeture, la perte est au plus de 5 s.
- **Alternatives écartées :**
  - *`performance.now()` pour les durées* (H-10) : rejeté, voir Contexte.
  - *Décrément d'un compteur chaque seconde* : rejeté par le PRD et par la dérive en arrière-plan.
  - *Web Worker avec compteur* : les workers sont aussi ralentis en arrière-plan sur certaines plateformes, et la solution ne règle pas la veille.
  - *Clôturer l'Intervention à `pagehide` seulement* : perd le temps en cas de crash.
- **Conséquences :** la logique est testée à horloge simulée (`FakeClockPort`), avec des cas de veille, de régression et de rechargement. Le test E2E utilise l'API `page.clock` de Playwright pour avancer de 5 min onglet masqué (NFR-6).

### ADR-07. Formulaires réactifs avec validateurs issus du domaine

- **Statut :** Acceptée.
- **Contexte :** la section 6 du PRD décrit des règles champ par champ, des messages exacts et une validation en direct et à l'enregistrement. La répartition manuelle a une règle inter-champs (somme exacte).
- **Décision :**
  - `ReactiveForms` typé (`FormGroup<…>`, `FormArray<FormControl<string>>`) pour l'écran Équipe ;
  - chaque validateur est un adaptateur mince autour d'une fonction de `core/domain/validation.ts` ou `allocation.ts`. Le même code valide le formulaire, `TeamService.commit()` et l'import. Un seul message par code, dans `messages.ts` ;
  - la validation s'affiche au blur et à l'enregistrement. Le champ porte `aria-invalid` et `aria-describedby` vers le message. La première erreur reçoit le focus à l'enregistrement ;
  - le bouton « Enregistrer » est désactivé tant que le formulaire est invalide (PRD). Pour éviter un bouton muet, un texte d'aide lié par `aria-describedby` énumère la première condition manquante ;
  - la répartition manuelle utilise des `computed` sur les saisies plutôt que des `valueChanges`, pour l'indicateur de total en direct.
- **Alternatives écartées :**
  - *Validation seulement côté service* : pas de retour immédiat, mauvais pour l'accessibilité.
  - *Validateurs de formulaire réécrits à la main* : divergence assurée entre formulaire, service et import.
- **Conséquences :** un changement de règle se fait dans le domaine, et les tests de domaine le couvrent. Le PRD est respecté tel quel sur les messages.

### ADR-08. Répartition : égale calculée, manuelle saisie et bornée

- **Statut :** Acceptée.
- **Contexte :** FR-8, FR-9, D4 et H-5 définissent les calculs et les bornes.
- **Décision :**
  - `allocateEqual(durationSec, n)` : chaque Membre reçoit `floor(durationSec / n)`, et les `durationSec mod n` premiers Membres de la liste reçoivent +1 s. La somme vaut exactement `durationSec` (INV-04). Exemples de contrôle : 900 s pour 4 → 225 ; 900 s pour 7 → 129 ×4 puis 128 ×3 ;
  - en mode `manual`, la somme des `allocatedSec` doit égaler `durationSec`. L'écart signé (`durationSec − Σ`) alimente les messages « Il manque X s » ou « Il y a X s de trop » ;
  - passer de `equal` à `manual` conserve les valeurs courantes. Revenir à `equal` recalcule après confirmation (FR-9) ;
  - ajouter un Membre en mode `manual` lui donne 30 s, le total devient invalide et l'enregistrement est bloqué jusqu'à correction (annexe A, A7) ;
  - en mode `equal`, toute modification du nombre de Membres ou de la durée recalcule tout.
- **Alternatives écartées :**
  - *Reliquat non alloué autorisé* : rejeté par D4.
  - *Arrondi au supérieur* : la somme ne serait plus égale à la durée.
- **Conséquences :** la règle `durationSec / n ≥ 30` garantit que chaque part égale respecte le minimum de 30 s (INV-09).

### ADR-09. Alerte sonore : Web Audio, déclenchée au geste utilisateur, sans fichier

- **Statut :** Acceptée.
- **Contexte :** FR-18, H-12, R4. Les navigateurs (notamment iOS) bloquent l'audio sans geste utilisateur.
- **Décision :**
  - `WebAudioAdapter` crée l'`AudioContext` au premier clic (« Démarrer » ou « Son d'alerte »), puis appelle `resume()` si besoin ;
  - le signal est un oscillateur sinus à 880 Hz, durée 250 ms, enveloppe de gain. Aucun fichier audio n'est chargé (pas de requête réseau, H-12) ;
  - un échec est silencieux : `AudioPort.beep()` renvoie `'played' | 'blocked' | 'unsupported'`, et l'alerte visuelle reste la principale (FR-18) ;
  - l'alerte sonore est émise par le reducer (effet `OVERRUN`) une seule fois par Membre et par Session (INV-14) ;
  - si le son est désactivé, aucun appel à `beep()` n'est fait.
- **Alternatives écartées :** *fichier MP3 ou WAV* (requête réseau et poids), *`HTMLAudioElement`* (lecture bloquée plus souvent).
- **Conséquences :** le son est un complément. Il n'est jamais testé comme une garantie, seulement comme un appel au port.

### ADR-10. Copie du bilan : presse-papiers avec repli en lecture seule

- **Statut :** Acceptée.
- **Contexte :** FR-21, FR-22, NFR-10.
- **Décision :** `ClipboardAdapter` appelle `navigator.clipboard.writeText`, qui exige un contexte sécurisé (HTTPS sur GitHub Pages, `localhost` en développement). En cas d'échec, la page affiche un champ `<textarea readonly>` contenant le texte, présélectionné à l'affichage (FR-22). L'application n'utilise ni `execCommand` (déprécié) ni `readText` (NFR-10). Le résultat (« Copié ! ») est annoncé par la zone `aria-live`.
- **Alternatives écartées :** *`document.execCommand('copy')`* (déprécié), *bibliothèque de copie* (dépendance tierce, rejetée par NFR-8).
- **Conséquences :** le repli est le même que celui du PRD. Il est testé en E2E en simulant un refus de permission.

### ADR-11. PWA et stratégie de cache

- **Statut :** Acceptée. Remplace la décision 3 de la v1 (cache « lazy » pour les ressources externes), devenue sans objet puisqu'il n'y a aucune ressource externe (NFR-8).
- **Contexte :** NFR-1 à NFR-3, NFR-2 (hors ligne après le premier chargement), NFR-3 (mise à jour non interruptive).
- **Décision :**
  - `@angular/pwa` pour le manifeste et le service worker (`ngsw-worker.js`). L'enregistrement reste `registerWhenStable:30000` (code existant) ;
  - `ngsw-config.json` : un seul `assetGroup` `app` en `prefetch` (`index.html`, `/*.js`, `/*.css`, `manifest.webmanifest`, icônes). `dataGroups` vide. Aucune ressource tierce ;
  - le manifeste utilise des chemins relatifs (`start_url: "./"`, `scope: "./"`) pour fonctionner sous le préfixe `/<repo>/` ;
  - mise à jour : le service worker télécharge la nouvelle version en arrière-plan. Elle est appliquée au prochain chargement complet de l'application. L'application n'appelle jamais `activateUpdate()` pendant une Session En cours, et n'affiche aucune invite de mise à jour en V1 (annexe A, A12) ;
  - icônes 192 et 512 px en PNG dans `public/icons/`.
- **Alternatives écartées :** *Workbox en direct* (double configuration), *cache `network-first` pour les pages* (casse le hors ligne quand le réseau est coupé mais le SW ne répond pas).
- **Conséquences :** la première visite nécessite le réseau. La mise à jour automatique n'est pas testable de bout en bout en CI sans deux builds successifs. Ce point est vérifié manuellement pendant le pilote (risque T6).

### ADR-12. Confidentialité et sécurité : CSP en balise `meta`, aucun service tiers

- **Statut :** Acceptée.
- **Contexte :** NFR-8 et SM-8 imposent zéro requête vers une autre origine. GitHub Pages ne permet pas de définir d'en-têtes HTTP.
- **Décision :**
  - CSP dans `src/index.html` : `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`.
    `style-src 'unsafe-inline'` est nécessaire car Angular injecte les styles de composants. `frame-ancestors` et `report-uri` sont ignorés dans une `meta` ;
  - polices système uniquement, pas de CDN, pas d'analytics, pas de cookie ;
  - `scripts/check-privacy.mjs` parcourt `dist/` et échoue si une URL absolue vers une origine autre que relative apparaît ;
  - test E2E `privacy-network.spec.ts` : toute requête hors origine de l'application fait échouer le test ;
  - aucun secret ni clé d'API dans le dépôt.
- **Alternatives écartées :** *en-têtes via un proxy* (hors GitHub Pages), *analytics anonymes* (rejetés par NFR-8).
- **Conséquences :** la CSP est un filet de sécurité. La vraie garantie est le test E2E de requêtes sortantes et le script de contrôle du build.

### ADR-13. Stratégie de tests

- **Statut :** Acceptée. Le runner unitaire est tranché par le spike S0 (voir ci-dessous).
- **Contexte :** NFR-21 demande des tests unitaires de la logique de temps et de répartition, des tests E2E du parcours complet, et des tests dans la CI avant tout déploiement. Le PRD et la v1 visent Vitest. Le dépôt existant utilise Karma et Jasmine (`ng test`).
- **Décision :**
  - *Unitaires (domaine, environ 60 % des tests)* : fonctions pures et reducer, sans Angular. Couverture minimale exigée sur `core/domain` : 90 % des lignes et des branches (porte G1) ;
  - *Services et composants (environ 25 %)* : `TestBed` avec faux ports, harnais de composants. Vérifient les messages, `role="alert"`, `aria-live`, le focus et les gardes de route ;
  - *E2E Playwright (environ 15 %)* : parcours UJ-1 à UJ-4, Session à horloge pilotée (`page.clock`), restauration après rechargement, hors ligne (`context.setOffline`), réseau (garde), 320 px sans défilement horizontal, axe-core sur les trois écrans, navigation au clavier seul. Projets `chromium` en PR ; `chromium`, `firefox`, `webkit` sur `main` (NFR-19) ;
  - *Non fonctionnel* : Lighthouse CI (accessibilité ≥ 0,95, installabilité, LCP), scripts `check-privacy`, `check-bundle` (JS initial gzip ≤ 300 Kio, H-17), `check-base-href` ;
  - *Spike S0 (0,5 j, avant E1)* : tenter Vitest via le builder `@angular/build:unit-test`. Si le builder est stable dans la version 20.3.x installée, Vitest est retenu. Sinon, Karma et Jasmine restent en place (aucune migration), et le PRD est corrigé en conséquence.
- **Alternatives écartées :** *tests E2E seuls* (lents, peu localisants), *Cypress* (un seul navigateur à la fois sur certaines configurations, moins adapté au contrôle de l'horloge).
- **Conséquences :** chaque FR a au moins un test. La matrice FR → test est tenue dans le fichier de test (`describe('FR-14 …')`).

### ADR-14. Conteneurisation : Docker multi-étapes et Compose

- **Statut :** Acceptée.
- **Contexte :** NFR-22 demande un lancement identique partout. La CI doit tester le build servi sous le préfixe `/<repo>/`, comme en production.
- **Décision :**
  - `Dockerfile` multi-étapes : étape `build` sur `node:22-alpine` (`npm ci`, `ng build --configuration production --base-href "$APP_BASE_HREF"`), étape `web` sur `nginx:1.27-alpine` qui copie `dist/<projet>/browser` dans `/usr/share/nginx/html/<repo>/` ;
  - `docker/nginx.conf` : redirection de `/` vers `/<repo>/`, `try_files $uri $uri/ /<repo>/index.html`, `Cache-Control: no-cache` sur `ngsw.json` et `index.html`, cache long sur les fichiers hachés ;
  - `docker-compose.yml` : service `web` (port 8080, build de production) et service `dev` (profil `dev`, `ng serve` sur 4200 avec volume). Les images sont épinglées par tag, et par digest lorsque la CI le permet ;
  - la CI lance `docker compose up -d web` puis Playwright sur `http://localhost:8080/<repo>/`.
- **Alternatives écartées :** *Playwright contre `ng serve`* (ne teste pas le préfixe ni le service worker de production), *image unique avec Node en production* (inutile, le site est statique).
- **Conséquences :** le service worker n'est actif qu'en production. Les tests hors ligne utilisent donc le service `web`, pas `dev`.

### ADR-15. CI/CD et porte de revue

- **Statut :** Acceptée.
- **Contexte :** le PRD impose que la CI passe avant tout déploiement (NFR-21), que Lighthouse soit validé à chaque build de production (SM-7) et que le déploiement soit automatique une fois `gh auth login` effectué (section 8.2 du PRD, état « en attente »).
- **Décision :** deux workflows.
  - `.github/workflows/ci.yml`, sur `pull_request` et `push` vers `main` :
    - `quality` : `npm ci`, lint et format (`ng lint`, Prettier en vérification), tests unitaires avec couverture, build de production avec `APP_BASE_HREF`, `check-privacy`, `check-bundle`, `check-base-href` ;
    - `e2e` (dépend de `quality`) : `docker compose up -d web`, Playwright (`chromium` en PR, trois navigateurs sur `main`), rapports en artefacts ;
    - `lighthouse` (dépend de `quality`) : `lhci autorun` sur le build servi ;
    - `deploy` (uniquement sur `main`, après les trois jobs) : appelle `deploy-pages.yml` par `workflow_call`.
  - `.github/workflows/deploy-pages.yml` : `workflow_call` et `workflow_dispatch` avec une entrée `ref` (utilisée pour le rollback, section 6.4). Il construit ou réutilise l'artefact du `ref`, le publie avec `actions/upload-pages-artifact`, puis `actions/deploy-pages` dans l'environnement `github-pages`. Il exécute un test de fumée (`smoke-prod.spec.ts`) contre l'URL publique.
  - Les actions tierces sont épinglées par SHA. Les permissions du workflow sont minimales (`contents: read`, `pages: write`, `id-token: write`).
  - Branch protection sur `main` : les jobs `quality`, `e2e` et `lighthouse` sont obligatoires.
- **Porte de revue :**

| Porte | Quand | Critères |
|---|---|---|
| G1, revue de PR | Avant fusion | Lint et format OK ; tests unitaires OK ; couverture `core/domain` ≥ 90 % ; E2E `chromium` OK ; axe sans violation critique ou grave ; `check-privacy`, `check-bundle`, `check-base-href` OK ; checklist ADR de la PR cochée (le changement respecte les ADR ou les modifie explicitement) ; revue par un pair ou par l'agent reviewer |
| G2, mise en production | Après fusion sur `main` | G1 ; E2E `firefox` et `webkit` ; Lighthouse accessibilité ≥ 0,95 et audits d'installabilité OK ; test de fumée post-déploiement OK |
| G3, passage au pilote | Fin de l'epic E6 | SM-4, SM-5, SM-7 et SM-8 validés automatiquement ; tests utilisateurs (SM-3) planifiés ; versions de navigateurs de NFR-19 vérifiées sur un iPhone ou un iPad iOS 16.4 |

- **Alternatives écartées :** *déploiement par branche `gh-pages`* (artefact moins traçable, pas de rollback propre), *semantic-release* (inutile à ce stade, les tags sont posés à la main).
- **Conséquences :** toute modification d'un schéma persisté ou exporté impose la mise à jour de cet ADR et des tests de migration (G1).

### ADR-16. Hébergement GitHub Pages et base href

- **Statut :** Acceptée. Le nom du dépôt est à confirmer (annexe A, A25).
- **Contexte :** NFR-4 demande un service sous `/<nom-du-depot>/`. Le dossier local s'appelle `Timer`.
- **Décision :**
  - le site est un *project site* : `https://<owner>.github.io/<repo>/` ;
  - la variable de dépôt `APP_BASE_HREF` vaut `/scrum-speaking-timer/` (nom réel du dépôt, confirmé) et est lue par la CI et par le `Dockerfile` (`ng build … --base-href "$APP_BASE_HREF"`). Le code ne contient aucun chemin en dur ;
  - `scripts/check-base-href.mjs` vérifie que `<base href>` de `dist/…/browser/index.html` est égal à `APP_BASE_HREF` et que le manifeste et `ngsw.json` ne contiennent aucun chemin absolu commençant par `/` hors préfixe ;
  - Pages est configuré avec la source « GitHub Actions ».
- **Alternatives écartées :** *base href `/`* (cassé sous le préfixe), *domaine personnalisé* (non demandé en V1, à reconsidérer après le pilote).
- **Conséquences :** si le dépôt est renommé, il suffit de changer la variable et de redéployer. Aucun code n'est à modifier.

### ADR-17. Identifiants

- **Statut :** Acceptée. Corrige le code existant (`id: \`${Date.now()}-${i}\``).
- **Contexte :** les identifiants de Membre doivent être uniques et stables pour les statistiques, la sélection et l'ordre, y compris lorsque deux Membres sont créés dans la même milliseconde.
- **Décision :** `crypto.randomUUID()` pour `Team.id`, `Member.id` et `SessionState.id`. Repli : `crypto.getRandomValues` formaté en UUID v4. Un identifiant n'est jamais réutilisé après suppression.
- **Alternatives écartées :** *index du tableau* (instable après réordonnancement), *horodatage* (collisions).
- **Conséquences :** les identifiants sont générés côté client uniquement. Ils ne sont pas exportés (l'import en génère de nouveaux).

### ADR-18. Périmètre V1 : un appareil, une équipe active

- **Statut :** Acceptée. Tranche Q1 et Q4 du PRD.
- **Contexte :** D1 (décision d'orchestration), H-1, H-2, persona Inès.
- **Décision :** l'application gère une seule Équipe par navigateur et une seule Session à la fois. Aucune synchronisation, aucun partage de session entre appareils. Un observateur suit la Session sur l'écran partagé par le Scrum Master.
- **Alternatives écartées :** *serveur de synchronisation ou WebSocket* (rompt NFR-8 et D1), *plusieurs équipes avec sélecteur* (complexifie l'import et le stockage pour un besoin non demandé en V1).
- **Conséquences :** la frustration de l'observatrice distante (risque R7) reste acceptée. Elle est explicitement hors périmètre (section 8.5 du PRD).

### ADR-19. Export et import JSON versionnés

- **Statut :** Acceptée. Répond à D5.
- **Contexte :** FR-26, FR-27, section 6.6 du PRD.
- **Décision :**
  - le fichier est un JSON au format décrit en section 3.5, de version `schemaVersion: 1` ;
  - le téléchargement se fait par `Blob` et une URL `blob:`, sans appel réseau (FR-26). Le nom est `equipe-<slug>-AAAA-MM-JJ.json` ; le slug est en minuscules ASCII (les accents sont retirés), les caractères hors `[a-z0-9]` deviennent `-`, longueur 40 maximum, repli `equipe` ;
  - l'import vérifie dans l'ordre : extension `.json`, taille ≤ 100 × 1024 octets (avant lecture), JSON valide, `format` et `schemaVersion` connus, équipe valide selon les invariants. En mode `equal`, les `allocatedSec` du fichier sont ignorés et recalculés. En mode `manual`, la somme doit être exacte ;
  - l'import est refusé pendant une Session En cours (annexe A, A9) ;
  - l'import remplace l'équipe après confirmation (FR-1), et les réglages (son) sont importés ;
  - la session et le bilan ne sont jamais exportés (FR-26).
- **Alternatives écartées :** *CSV* (perd les réglages et la version), *export du bilan* (hors périmètre, section 4.5 du PRD).
- **Conséquences :** le schéma JSON est versionné. Une version 2 du format impose un nouvel ADR et une fonction de migration.

---

## 3. Modèle de données

### 3.1 Types du domaine

Les montants sont en secondes (`Sec`) pour l'équipe et les répartitions, et en millisecondes (`Ms`) pour la mesure. Tous les nombres sont des entiers.

```ts
// core/domain/model.ts

export type AllocationMode = 'equal' | 'manual';

/** Membre de l'équipe. Son temps alloué couvre toute la Session (D2). */
export interface Member {
  readonly id: string;           // UUID v4, ADR-17
  readonly name: string;         // Prénom normalisé (INV-06, INV-07)
  readonly allocatedSec: number; // entier, 30 ≤ x ≤ durationSec (INV-05)
}

/** Équipe persistée. Invariants : section 3.2. */
export interface Team {
  readonly id: string;
  readonly name: string;          // 1 à 50 caractères après normalisation (INV-03)
  readonly durationSec: number;   // Durée de cérémonie : multiple de 60, 60 ≤ x ≤ 7200 (INV-08)
  readonly allocationMode: AllocationMode;
  readonly members: readonly Member[]; // ordre = ordre de passage (H-6), 2 à 15 (INV-01)
}

/** Brouillon d'édition : peut être invalide. Jamais persisté tel quel. */
export interface TeamDraft {
  readonly name: string;
  readonly durationSec: number;
  readonly allocationMode: AllocationMode;
  readonly members: readonly { readonly id: string; readonly name: string; readonly allocatedSec: number }[];
}

export interface AppSettings {
  readonly soundEnabled: boolean; // défaut true (FR-18)
}

/** Photo de l'équipe prise au démarrage de la Session. Figée pour le bilan (INV-15). */
export interface TeamSnapshot {
  readonly name: string;
  readonly durationSec: number;
  readonly members: readonly Member[];
}

/** Statistiques d'un Membre pendant la Session. Même ordre que TeamSnapshot.members. */
export interface MemberStats {
  readonly memberId: string;
  readonly spokenMs: number;          // interventions closes, entier ≥ 0 (INV-13)
  readonly overrunAt: number | null;  // instant de l'alerte, au plus une fois (INV-14)
}

/** Intervention en cours : une seule à la fois. */
export interface Intervention {
  readonly memberId: string;
  readonly startedAt: number;     // temps effectif, ms (ADR-06)
  readonly pausedAt: number | null;
  readonly pausedTotalMs: number; // somme des pauses closes de cette intervention
}

/** Session : en cours, ou terminée (dernier bilan, FR-23). */
export interface SessionState {
  readonly id: string;
  readonly status: 'running' | 'finished';
  readonly team: TeamSnapshot;
  readonly startedAt: number;
  readonly endedAt: number | null;
  readonly current: Intervention | null;  // null si finished (INV-12)
  readonly stats: readonly MemberStats[];
  readonly clockOffsetMs: number;         // décalage de garde de régression (ADR-06)
  readonly lastCheckpointAt: number;      // temps effectif du dernier checkpoint
}

/** Sortie du bilan, calculée, jamais stockée. */
export interface SummaryRow {
  readonly memberId: string;
  readonly name: string;
  readonly spokenSec: number;     // partie entière des secondes parlées (affichage)
  readonly allocatedSec: number;
  readonly overrunSec: number;    // 0 si dans le temps, sinon arrondi au supérieur (affichage)
  readonly status: 'within' | 'over';
}

export interface Summary {
  readonly teamName: string;
  readonly date: string;          // JJ/MM/AAAA, fuseau local
  readonly plannedDurationSec: number;
  readonly actualDurationSec: number;
  readonly rows: readonly SummaryRow[];
  readonly totalSpokenSec: number;
  readonly totalAllocatedSec: number;
}
```

### 3.2 Invariants

Chaque invariant a un identifiant utilisé dans les tests. Les invariants INV-01 à INV-10 sont vérifiés à l'enregistrement de l'équipe et à l'import. INV-11 à INV-15 sont vérifiés par le reducer et au chargement.

| ID | Invariant | Vérification |
|---|---|---|
| INV-01 | 2 ≤ nombre de Membres ≤ 15 | `validateTeam`, `MEMBER_COUNT_MIN` / `MEMBER_COUNT_MAX` |
| INV-02 | Pas de doublon de Prénom : `key(name)` unique dans l'équipe. `key` = NFC, espaces multiples réduits, retrait des espaces de bord, `toLowerCase()`. Les accents comptent (H-13) | `validateMemberName`, `MEMBER_NAME_DUPLICATE` |
| INV-03 | Nom d'équipe : 1 à 50 caractères après normalisation ; lettres (`\p{L}`), marques (`\p{M}`), chiffres (`\p{N}`), espace, apostrophe `'` et `’`, trait d'union, point, parenthèses | `validateTeamName` |
| INV-04 | Mode `equal` ou `manual` : `Σ allocatedSec = durationSec`, exact | `validateTeam` (`ALLOCATION_SUM_MISMATCH`, avec le delta signé) |
| INV-05 | 30 ≤ `allocatedSec` ≤ `durationSec`, pour chaque Membre | `ALLOCATION_TOO_SHORT`, `ALLOCATION_TOO_LONG` |
| INV-06 | Prénom : 1 à 30 caractères après normalisation ; motif `^[\p{L}\p{M}]+(?:[ '’\-][\p{L}\p{M}]+)*$` (lettres, séparateurs simples, pas de chiffre, pas d'emoji) | `validateMemberName` |
| INV-07 | Prénom normalisé : première lettre en majuscule si elle est minuscule ; le reste inchangé | `normalizeName` |
| INV-08 | `durationSec` multiple de 60, 60 ≤ `durationSec` ≤ 7200 (1 à 120 minutes, H-4). Saisie en minutes entières | `validateDurationMinutes` |
| INV-09 | `durationSec ≥ 30 × nombre de Membres` (H-5, FR-7). Garantit que la part égale est ≥ 30 s | `DURATION_PER_MEMBER_TOO_SHORT` |
| INV-10 | `allocationMode` ∈ {`equal`, `manual`} ; en `equal`, `allocatedSec` égale `allocateEqual(durationSec, n)[i]` | `validateTeam` |
| INV-11 | Au plus une Session stockée (en cours ou terminée) | `SessionService.start()` refuse si `running` ; un démarrage remplace un `finished` |
| INV-12 | `current.memberId` appartient à `team.members` ; `stats` a la même longueur et le même ordre que `team.members` ; `current` est `null` si `finished` | reducer, chargement |
| INV-13 | `spokenMs` est un entier ≥ 0 ; `pausedTotalMs` ≤ durée écoulée de l'Intervention | `clock-time`, reducer |
| INV-14 | `overrunAt` est renseigné au plus une fois par Membre et par Session | reducer (effet `OVERRUN` émis une seule fois) |
| INV-15 | Pendant `running`, l'équipe n'est pas modifiable. Le bilan utilise `team` (la photo), pas l'équipe stockée | `TeamService.commit()` refuse ; `SessionState.team` |

### 3.3 Règles de calcul

```ts
// core/domain/allocation.ts
/** Part égale : floor(d / n) pour tous, +1 s aux d mod n premiers. Σ = d (INV-04). */
export function allocateEqual(durationSec: number, count: number): number[];

// core/domain/clock-time.ts
/** Temps parlé d'un Membre à l'instant effectif `now`, en ms. */
export function spokenMsOf(state: SessionState, memberId: string, now: number): number;
/** Temps restant (négatif = dépassement), en ms. */
export function remainingMsOf(state: SessionState, memberId: string, now: number, allocatedMs: number): number;
/** Durée écoulée d'une Intervention à `now`, bornée à 0. */
export function elapsedOf(intervention: Intervention, now: number): number;
```

Formules, à implémenter et tester telles quelles :

- `elapsedOf(i, now) = max(0, (i.pausedAt ?? now) − i.startedAt − i.pausedTotalMs)`
- `spokenMsOf(s, m, now) = stats[m].spokenMs + (s.current?.memberId === m ? elapsedOf(s.current, now) : 0)`
- `remainingMs = allocatedSec × 1000 − spokenMs`. Une valeur négative est un dépassement.
- Dépassement déclenché si `spokenMs > allocatedSec × 1000` et `overrunAt === null` (INV-14).
- Affichage du temps parlé : partie entière des secondes. Affichage du dépassement : arrondi au supérieur des secondes, avec un minimum de 1 s. L'arrondi au supérieur évite d'afficher « Dépassement de 00:00 ».

### 3.4 Stockage

| Clé | Contenu | Écrit par | Lu par |
|---|---|---|---|
| `scrum-timer:v1` | `StoredRootV1` (ci-dessous) | `PersistenceService` | `PersistenceService.load()` au démarrage |
| `scrum-timer:v1:backup`, `scrum-timer:v1:backup-2`, `scrum-timer:v1:backup-3` | Texte brut d'un contenu illisible ou d'une version non prise en charge | `PersistenceService`, rotation sur trois emplacements | Jamais automatiquement ; à la quatrième donnée illisible, la dernière case est remplacée et la perte est signalée (ADR-05) |

```ts
// core/domain/storage-schema.ts
export interface StoredRootV1 {
  readonly schemaVersion: 1;
  readonly team: Team | null;
  readonly settings: AppSettings;
  readonly session: SessionState | null; // running, ou finished pour le bilan (FR-23)
}
```

Ce qui est persisté : l'équipe, les réglages, la session (en cours ou terminée). Ce qui ne l'est pas : le brouillon d'édition, les messages affichés, le signal `now`.

Cas de lecture (`parseStoredRoot`) :

| Cas | Comportement |
|---|---|
| Clé absente | Démarrage vide, pas de message |
| JSON invalide, structure invalide, invariant violé | Copie dans la première case libre des trois emplacements (`…:backup`, `…:backup-2`, `…:backup-3`), démarrage vide, message FR-25 : « Les données enregistrées sont illisibles et ont été ignorées. Vous pouvez importer un fichier de sauvegarde. » |
| `schemaVersion` absent ou différent de 1 | Même traitement. Le message est le même, pour ne pas inventer de texte (voir annexe A, A10) |
| Accès refusé ou stockage absent (`SecurityError`, `localStorage` nul) | Mémoire vive, bandeau FR-25 : « Vos données ne seront pas conservées après fermeture. Exportez votre équipe pour la sauvegarder. » |

Erreurs d'écriture : `STORAGE_QUOTA` et `STORAGE_UNAVAILABLE`. Elles passent `PersistenceService.health` à `degraded` et ne suspendent jamais la Session.

### 3.5 Schéma JSON d'export (version 1)

Exemple :

```json
{
  "format": "scrum-speaking-timer",
  "schemaVersion": 1,
  "exportedAt": "2026-11-08T09:30:00.000Z",
  "team": {
    "name": "Équipe Alpha",
    "durationSec": 900,
    "allocationMode": "manual",
    "members": [
      { "name": "Camille", "allocatedSec": 240 },
      { "name": "Thomas", "allocatedSec": 240 },
      { "name": "Inès", "allocatedSec": 420 }
    ]
  },
  "settings": { "soundEnabled": true }
}
```

Schéma JSON (draft 2020-12), fichier attendu `src/app/core/domain/export.schema.json` :

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "scrum-speaking-timer.export.v1",
  "type": "object",
  "required": ["format", "schemaVersion", "exportedAt", "team", "settings"],
  "additionalProperties": false,
  "properties": {
    "format": { "const": "scrum-speaking-timer" },
    "schemaVersion": { "const": 1 },
    "exportedAt": { "type": "string", "format": "date-time" },
    "team": {
      "type": "object",
      "required": ["name", "durationSec", "allocationMode", "members"],
      "additionalProperties": false,
      "properties": {
        "name": { "type": "string", "minLength": 1, "maxLength": 50 },
        "durationSec": { "type": "integer", "minimum": 60, "maximum": 7200, "multipleOf": 60 },
        "allocationMode": { "enum": ["equal", "manual"] },
        "members": {
          "type": "array", "minItems": 2, "maxItems": 15,
          "items": {
            "type": "object",
            "required": ["name", "allocatedSec"],
            "additionalProperties": false,
            "properties": {
              "name": { "type": "string", "minLength": 1, "maxLength": 30 },
              "allocatedSec": { "type": "integer", "minimum": 30, "maximum": 7200 }
            }
          }
        }
      }
    },
    "settings": {
      "type": "object",
      "required": ["soundEnabled"],
      "additionalProperties": false,
      "properties": { "soundEnabled": { "type": "boolean" } }
    }
  }
}
```

Le schéma JSON ne remplace pas les invariants. Les contraintes inter-champs (unicité des Prénoms, somme exacte, `durationSec ≥ 30 × n`) sont vérifiées par `validateTeam` après le schéma. Le schéma sert à la documentation et à la validation de l'exemple dans les tests.

---

## 4. Contrats des services

Conventions : `Result<T, E> = { ok: true; value: T } | { ok: false; error: E }`. Les méthodes ne lancent pas d'exception pour une erreur métier. Une exception n'est réservée qu'aux bugs. Les erreurs sont des codes stables (`ValidationCode`, `DomainErrorCode`) ; leurs textes sont dans `messages.ts`.

### 4.1 Erreurs

```ts
// core/domain/errors.ts
export type ValidationCode =
  | 'TEAM_NAME_REQUIRED' | 'TEAM_NAME_TOO_LONG' | 'TEAM_NAME_INVALID_CHARS'
  | 'MEMBER_NAME_REQUIRED' | 'MEMBER_NAME_TOO_LONG' | 'MEMBER_NAME_INVALID_CHARS' | 'MEMBER_NAME_DUPLICATE'
  | 'MEMBER_COUNT_MIN' | 'MEMBER_COUNT_MAX'
  | 'DURATION_REQUIRED' | 'DURATION_NOT_INTEGER' | 'DURATION_TOO_SHORT' | 'DURATION_TOO_LONG'
  | 'DURATION_PER_MEMBER_TOO_SHORT'
  | 'ALLOCATION_REQUIRED' | 'ALLOCATION_FORMAT' | 'ALLOCATION_TOO_SHORT' | 'ALLOCATION_TOO_LONG'
  | 'ALLOCATION_SUM_MISMATCH';

export interface ValidationError {
  readonly code: ValidationCode;
  readonly field: 'teamName' | 'duration' | 'member' | 'allocation' | 'members';
  readonly memberId?: string;
  readonly deltaSec?: number; // ALLOCATION_SUM_MISMATCH : durationSec − Σ (positif = il manque)
  readonly limit?: number;
  readonly count?: number;    // DURATION_PER_MEMBER_TOO_SHORT : nombre de Membres
}

export type DomainErrorCode =
  | 'SESSION_IN_PROGRESS'     // modification ou import pendant une Session En cours (INV-15, A9)
  | 'NO_TEAM'                 // démarrage sans équipe
  | 'TEAM_INVALID'            // démarrage avec une équipe invalide (porte les ValidationError)
  | 'ALREADY_RUNNING'         // démarrage d'une Session déjà en cours (INV-11)
  | 'NOT_RUNNING'             // action sur une Session non en cours
  | 'NO_CURRENT_INTERVENTION' // pause ou reprise sans Intervention
  | 'UNKNOWN_MEMBER'
  | 'CONFIRMATION_REQUIRED'   // remplacement d'équipe ou réinitialisation non confirmés
  | 'FILE_TYPE' | 'FILE_TOO_LARGE' | 'FILE_INVALID_JSON'
  | 'FILE_UNSUPPORTED_VERSION' | 'FILE_NO_VALID_TEAM'
  | 'STORAGE_UNAVAILABLE' | 'STORAGE_QUOTA';

export type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };
```

### 4.2 Fonctions pures du domaine

```ts
// core/domain/validation.ts
export function normalizeName(raw: string): string;                       // NFC, espaces, bords
export function memberKey(name: string): string;                          // INV-02
export function validateTeamName(raw: string): ValidationError[];
export function validateMemberName(raw: string, others: readonly Member[], selfId?: string): ValidationError[];
export function validateDurationMinutes(raw: string | number): Result<number, ValidationError>; // retourne durationSec
export function validateTeam(draft: TeamDraft): ValidationError[];         // INV-01 à INV-10, toutes erreurs

// core/domain/allocation.ts
export function parseAllocation(raw: string): Result<number, ValidationError>; // « 90 » ou « 01:30 »
export function allocationDelta(durationSec: number, members: readonly { allocatedSec: number }[]): number;

// core/domain/draft.ts  (opérations pures : Result sur TeamDraft)
export function draftFromTeam(team: Team): TeamDraft;
export function addMemberToDraft(d: TeamDraft, name: string, newId: string): Result<TeamDraft, ValidationError>;
export function renameMemberInDraft(d: TeamDraft, id: string, name: string): Result<TeamDraft, ValidationError>;
export function removeMemberFromDraft(d: TeamDraft, id: string): Result<TeamDraft, ValidationError>;
export function moveMemberInDraft(d: TeamDraft, id: string, dir: 'up' | 'down'): TeamDraft;
export function setDurationInDraft(d: TeamDraft, durationMinutes: number): TeamDraft;
export function setAllocationModeInDraft(d: TeamDraft, mode: AllocationMode): TeamDraft;
export function setManualAllocationInDraft(d: TeamDraft, id: string, raw: string): Result<TeamDraft, ValidationError>;
export function recomputeEqual(d: TeamDraft): TeamDraft;
```

Règles des opérations de brouillon :

- `addMemberToDraft` : refus si 15 Membres (`MEMBER_COUNT_MAX`) ou si le Prénom est invalide ou doublon. En mode `manual`, le nouveau Membre reçoit 30 s, le total est invalide, `validateTeam` le signalera.
- `removeMemberFromDraft` : refus si 2 Membres (`MEMBER_COUNT_MIN`). En mode `equal`, recalcul. En mode `manual`, les autres valeurs sont conservées (FR-3).
- `setDurationInDraft` : en mode `equal`, recalcul. En mode `manual`, les valeurs sont conservées (FR-5).

### 4.3 Reducer de session (pur)

```ts
// core/domain/session.reducer.ts
export type SessionEvent =
  | { type: 'START'; team: Team; id: string; now: number }
  | { type: 'NEXT'; now: number }
  | { type: 'SELECT_MEMBER'; memberId: string; now: number }
  | { type: 'TOGGLE_PAUSE'; now: number }
  | { type: 'FINISH'; now: number }
  | { type: 'TICK'; now: number }
  | { type: 'RESTORE'; now: number };

export type SessionEffect =
  | { type: 'OVERRUN'; memberId: string }   // émis une fois par Membre et par Session (INV-14)
  | { type: 'CLOCK_REGRESSION'; deltaMs: number };

export type SessionEventError =
  | { code: 'NO_TEAM' | 'TEAM_INVALID' | 'ALREADY_RUNNING' | 'NOT_RUNNING' | 'NO_CURRENT_INTERVENTION' | 'UNKNOWN_MEMBER'; detail?: ValidationError[] };

export function reduceSession(
  state: SessionState | null,
  event: SessionEvent,
): Result<{ state: SessionState | null; effects: SessionEffect[] }, SessionEventError>;

/** Restauration après rechargement : met l'Intervention en pause à lastCheckpointAt (H-15). */
export function restoreSession(state: SessionState): { state: SessionState; interventionPaused: boolean };
```

Transitions (machine d'états du PRD, section 7.2) :

| État avant | Événement | État après | Erreur si refusé |
|---|---|---|---|
| `null` ou `finished` | `START` avec équipe valide | `running`, première Intervention sur `members[0]`, ancien bilan effacé (FR-23) | `NO_TEAM`, `TEAM_INVALID`, `ALREADY_RUNNING` (si `running`) |
| `running`, Intervention active | `NEXT` | Clôture, Membre suivant (cycle, H-6) | `NOT_RUNNING`, `NO_CURRENT_INTERVENTION` |
| `running` | `SELECT_MEMBER` | Clôture, Intervention du Membre choisi. Pas d'effet si c'est le Membre courant | `UNKNOWN_MEMBER`, `NOT_RUNNING` |
| `running`, active | `TOGGLE_PAUSE` | `pausedAt = now` | `NO_CURRENT_INTERVENTION` |
| `running`, en pause | `TOGGLE_PAUSE` | Reprise : `pausedTotalMs += now − pausedAt`, `pausedAt = null` | idem |
| `running` | `FINISH` | Clôture de l'Intervention, `status = finished`, `endedAt = now`, `current = null` | `NOT_RUNNING` |
| `running` | `TICK` | Pas de changement d'état, seulement les effets `OVERRUN` | — |
| `running` | `RESTORE` | Pause à `lastCheckpointAt` si l'Intervention n'est pas déjà en pause | — |

Le reducer est la seule source de vérité pour ces transitions. Les services ne réécrivent aucune règle.

### 4.4 Services (couche Application)

```ts
// services/team.service.ts
@Injectable({ providedIn: 'root' })
export class TeamService {
  readonly team: Signal<Team | null>;
  readonly locked: Signal<boolean>;               // true si Session En cours (INV-15)
  readonly totals: Signal<{ allocatedSec: number; durationSec: number; deltaSec: number }>;
  readonly canStart: Signal<boolean>;             // équipe présente et valide

  /** Enregistre un brouillon valide. Erreurs : SESSION_IN_PROGRESS, CONFIRMATION_REQUIRED (si remplacement sans accord), validation. */
  commit(draft: TeamDraft, options?: { replaceExisting?: boolean }): Result<Team, DomainErrorOrValidation>;
  /** Remplace l'équipe importée (après confirmation). Erreurs : SESSION_IN_PROGRESS, CONFIRMATION_REQUIRED. */
  replaceFromImport(team: Team, settings: AppSettings, confirmed: boolean): Result<Team, DomainErrorCode>;
  /** Efface l'équipe. Erreurs : SESSION_IN_PROGRESS, CONFIRMATION_REQUIRED. */
  clear(confirmed: boolean): Result<void, DomainErrorCode>;
}

type DomainErrorOrValidation =
  | { kind: 'validation'; errors: ValidationError[] }
  | { kind: 'domain'; code: DomainErrorCode };
```

```ts
// services/session.service.ts
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly session: Signal<SessionState | null>;
  readonly phase: Signal<'none' | 'running' | 'paused' | 'finished'>; // dérivée : paused = running ∧ current.pausedAt ≠ null
  readonly currentMember: Signal<MemberView | null>;
  readonly members: Signal<MemberView[]>;      // ordre de la photo (FR-4)
  readonly elapsedSessionMs: Signal<number>;
  readonly summary: Signal<Summary | null>;    // dérivé de la session terminée
  readonly restoreNotice: Signal<boolean>;     // FR-16 : vrai après une restauration, jusqu'à fermeture du message

  start(): Result<void, DomainErrorCode | { code: 'TEAM_INVALID'; errors: ValidationError[] }>;
  next(): Result<void, DomainErrorCode>;
  selectMember(memberId: string): Result<void, DomainErrorCode>;
  togglePause(): Result<void, DomainErrorCode>;
  finish(): Result<void, DomainErrorCode>;     // la confirmation est faite par la page
  dismissRestoreNotice(): void;
}

export interface MemberView {
  readonly id: string;
  readonly name: string;
  readonly allocatedMs: number;
  readonly spokenMs: number;        // live
  readonly remainingMs: number;     // négatif = dépassement
  readonly overrun: boolean;
  readonly alerted: boolean;
}
```

```ts
// services/clock.service.ts
@Injectable({ providedIn: 'root' })
export class ClockService {
  readonly now: Signal<number>;     // mis à jour toutes les 250 ms uniquement si Session En cours
  /** Démarre ou arrête le tick selon la phase. Appelé par SessionService. */
  sync(running: boolean): void;
}
```

```ts
// services/persistence.service.ts
@Injectable({ providedIn: 'root' })
export class PersistenceService {
  readonly health: Signal<'ok' | 'degraded'>;   // degraded = STORAGE_QUOTA ou STORAGE_UNAVAILABLE
  readonly loadOutcome: Signal<'empty' | 'ok' | 'unreadable' | 'backed-up'>;

  /** Appelé par APP_INITIALIZER. Ne lance pas d'exception. */
  load(): LoadOutcome;
  /** Écrit l'état complet après mutation. Erreurs : STORAGE_UNAVAILABLE, STORAGE_QUOTA. */
  save(): Result<void, 'STORAGE_UNAVAILABLE' | 'STORAGE_QUOTA'>;
  /** Checkpoint pendant une Intervention, et à pagehide / visibilitychange masquée. */
  checkpoint(now: number): void;
}
```

```ts
// services/alert.service.ts
@Injectable({ providedIn: 'root' })
export class AlertService {
  readonly assertiveMessage: Signal<string>; // « Thomas : temps dépassé », annoncé une fois
  /** Traite un effet OVERRUN : son si activé (AudioPort.beep), message assertif. Ne lance jamais d'exception. */
  notifyOverrun(memberName: string): void;
}
```

```ts
// services/settings.service.ts
@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly settings: Signal<AppSettings>;
  setSoundEnabled(enabled: boolean): Result<void, 'STORAGE_UNAVAILABLE' | 'STORAGE_QUOTA'>;
}
```

```ts
// services/export-import.service.ts
@Injectable({ providedIn: 'root' })
export class ExportImportService {
  /** Construit le fichier. Pas d'appel réseau. */
  exportTeam(team: Team, settings: AppSettings, now: Date): { filename: string; blob: Blob };
  /** Lit et valide un fichier. Ordre : type, taille, JSON, format et version, invariants. */
  importFile(file: File): Promise<Result<{ team: Team; settings: AppSettings }, DomainErrorCode | { code: 'TEAM_INVALID'; errors: ValidationError[] }>>;
}
```

Messages d'import (section 6.6 du PRD) : `FILE_TYPE` → « Choisissez un fichier .json exporté par l'application. » ; `FILE_TOO_LARGE` → « Fichier trop volumineux (max 100 Ko). » ; `FILE_INVALID_JSON` → « Le fichier est illisible (JSON invalide). » ; `FILE_UNSUPPORTED_VERSION` → « Version du fichier non prise en charge. » ; `FILE_NO_VALID_TEAM` → « Le fichier ne contient pas d'équipe valide. ». Le message générique de FR-27 (« Ce fichier n'est pas une sauvegarde valide de l'application. ») n'est pas utilisé lorsqu'un motif précis est connu.

```ts
// services/data-reset.service.ts
@Injectable({ providedIn: 'root' })
export class DataResetService {
  /** FR-28. Supprime scrum-timer:v1 et les trois clés de sauvegarde (:backup, :backup-2, :backup-3), réinitialise tous les signaux. Erreurs : SESSION_IN_PROGRESS, CONFIRMATION_REQUIRED. */
  resetAll(confirmed: boolean): Result<void, DomainErrorCode>;
}
```

### 4.5 Ports et adaptateurs

```ts
// core/ports/*.ts
export interface StoragePort {
  get(key: string): Result<string | null, 'STORAGE_UNAVAILABLE'>;
  set(key: string, value: string): Result<void, 'STORAGE_UNAVAILABLE' | 'STORAGE_QUOTA'>;
  remove(key: string): Result<void, 'STORAGE_UNAVAILABLE'>;
}
export interface ClockPort { now(): number; }                       // Date.now() ; FakeClock en test
export interface ClipboardPort { writeText(text: string): Promise<Result<void, 'UNAVAILABLE' | 'DENIED'>>; }
export interface AudioPort {
  unlock(): void;                                                    // appelé sur geste utilisateur
  beep(): Promise<'played' | 'blocked' | 'unsupported'>;
}
export interface FilePort {
  download(blob: Blob, filename: string): void;
  readText(file: File): Promise<Result<string, 'READ_FAILED'>>;
}
```

---

## 5. Arborescence cible

### 5.1 Correspondance avec le code existant

| Fichier existant | Devenir |
|---|---|
| `src/app/models.ts` | Remplacé par `core/domain/model.ts` (types revus : `allocationMode`, `TeamDraft`, `SessionState`, `Summary`). |
| `src/app/timer.logic.ts` et `timer.logic.spec.ts` | Remplacé par `core/domain/clock-time.ts` et son spec. Les formules ont changé (section 3.3). |
| `src/app/storage.service.ts` | Remplacé par `core/adapters/local-storage.adapter.ts` et `services/persistence.service.ts`. Ne stocke que l'équipe ; la session et la validation sont à ajouter. |
| `src/app/session.service.ts` | Remplacé par `core/domain/session.reducer.ts` et `services/session.service.ts`. Corrige la répartition égale forcée au démarrage (manuel ignoré) et l'absence de checkpoint. |
| `src/app/pages/team-setup.component.ts` | Remplacé par `features/team-editor/team-editor.page.ts`. Corrige les identifiants `Date.now()` (ADR-17). |
| `src/app/pages/session.component.ts` | Remplacé par `features/session/session.page.ts`. Le `setInterval` de 250 ms est déplacé dans `ClockService`. |
| `src/app/pages/summary.component.ts` | Remplacé par `features/summary/summary.page.ts`. Calcul du bilan déplacé dans `core/domain/summary.ts`. |
| `src/app/app.routes.ts` | Réécrit : mode hash, quatre routes, gardes (ADR-04). |
| `src/app/app.config.ts` | Ajoute `withHashLocation()`, les ports, `APP_INITIALIZER`. Décision sur zoneless à prendre au spike S0 (le code utilise actuellement `zone.js`). |

### 5.2 Arbre complet (fichier par fichier)

```
Timer/
├── .dockerignore                    Exclut node_modules, dist, .git, rapports de test
├── .nvmrc                           Version Node 22 LTS (ADR-01)
├── .prettierrc.json                 Remplace le bloc "prettier" de package.json (printWidth 100, singleQuote)
├── Dockerfile                       Étape build (node:22-alpine) puis étape web (nginx:1.27-alpine) (ADR-14)
├── docker-compose.yml               Services web (8080, prod) et dev (profil dev, ng serve 4200)
├── docker/
│   └── nginx.conf                   Préfixe /<repo>/, try_files, Cache-Control no-cache sur index.html et ngsw.json
├── .github/
│   ├── pull_request_template.md     Checklist ADR et porte G1
│   └── workflows/
│       ├── ci.yml                   quality, e2e, lighthouse, puis deploy sur main (ADR-15)
│       └── deploy-pages.yml         workflow_call et workflow_dispatch(ref) : build, upload, deploy, smoke
├── angular.json                     Projet, builds production (outputPath, baseHref via option), budgets, tests
├── package.json                     Scripts : lint, format:check, test, test:coverage, build:prod, check:privacy, check:bundle, check:base-href, e2e, lhci
├── package-lock.json
├── tsconfig.json                    Configuration commune
├── tsconfig.app.json                Compilation de l'application
├── tsconfig.spec.json               Compilation des tests
├── eslint.config.mjs                angular-eslint ; no-restricted-imports : core/domain sans @angular ni DOM
├── ngsw-config.json                 assetGroup app en prefetch, dataGroups vide (ADR-11)
├── playwright.config.ts             Projets chromium, firefox, webkit ; baseURL ; trace on-first-retry
├── lighthouserc.json                Assertions : accessibilité ≥ 0,95, audits d'installabilité, LCP ≤ 2500 ms
├── scripts/
│   ├── check-privacy.mjs            Échoue si une URL absolue hors origine est trouvée dans dist/ (NFR-8)
│   ├── check-bundle.mjs             Échoue si le JS initial gzip dépasse 300 Kio (H-17, NFR-5)
│   └── check-base-href.mjs          Vérifie <base href>, chemins relatifs du manifeste, absence de chemins absolus
├── public/
│   ├── favicon.ico
│   └── icons/
│       ├── icon-192.png             Icône 192 px (NFR-1)
│       └── icon-512.png             Icône 512 px (NFR-1)
├── e2e/
│   ├── fixtures.ts                  Garde réseau (interception hors origine), helpers de parcours
│   ├── daily-happy-path.spec.ts     UJ-1 à UJ-4 (création, démarrage, Suivant, bilan, copie)
│   ├── manual-allocation.spec.ts    UJ-2 : répartition manuelle, somme exacte, bloquage
│   ├── overrun-alert.spec.ts        UJ-3 : role="alert", son activé et désactivé, une seule alerte
│   ├── timer-background.spec.ts     NFR-6 / SM-4 : page.clock, onglet masqué 5 min
│   ├── restore-after-reload.spec.ts FR-16 / H-15 : rechargement pendant une Intervention
│   ├── offline.spec.ts              NFR-2 / SM-5 : service worker prêt, réseau coupé, parcours complet
│   ├── privacy-network.spec.ts      NFR-8 / SM-8 : aucune requête hors origine
│   ├── responsive-a11y.spec.ts      NFR-18 (320 px), axe sur trois écrans, parcours clavier seul (NFR-12)
│   └── smoke-prod.spec.ts           Test de fumée après déploiement, sur l'URL publique
└── src/
    ├── index.html                   lang="fr", meta viewport, theme-color, lien manifeste, CSP (ADR-12)
    ├── main.ts                      bootstrapApplication(App, appConfig)
    ├── styles.css                   Jetons de couleur, indicateur de focus, cible ≥ 44 px, prefers-reduced-motion
    ├── manifest.webmanifest         name, short_name, start_url "./", scope "./", display standalone, icônes
    ├── app/
    │   ├── app.ts                   Composant racine : outlet, bandeau global (FR-25)
    │   ├── app.config.ts            Router hash, service worker, ports et adaptateurs, APP_INITIALIZER
    │   ├── app.routes.ts            /equipe, /preparation, /session, /bilan (lazy via loadComponent)
    │   ├── app.guards.ts            Gardes par phase de session (ADR-04)
    │   ├── core/
    │   │   ├── domain/              Pur TypeScript, sans @angular ni DOM
    │   │   │   ├── model.ts             Types Member, Team, TeamDraft, SessionState, Summary (section 3.1)
    │   │   │   ├── errors.ts            ValidationCode, DomainErrorCode, Result
    │   │   │   ├── messages.ts          Textes français exacts du PRD, un par code
    │   │   │   ├── normalize.ts         normalizeName, memberKey (INV-02, INV-07)
    │   │   │   ├── validation.ts        validateTeamName, validateMemberName, validateDurationMinutes, validateTeam
    │   │   │   ├── validation.spec.ts   Un test par règle de la section 6 du PRD
    │   │   │   ├── allocation.ts        allocateEqual, parseAllocation, allocationDelta
    │   │   │   ├── allocation.spec.ts   15 min / 4 (225 s), 15 min / 7 (129 ×4, 128 ×3), somme = durée
    │   │   │   ├── draft.ts             Opérations pures sur TeamDraft (FR-2 à FR-5, FR-9)
    │   │   │   ├── draft.spec.ts
    │   │   │   ├── clock-time.ts        elapsedOf, spokenMsOf, remainingMsOf, régression d'horloge
    │   │   │   ├── clock-time.spec.ts   Horloge simulée : veille, arrière-plan, régression, pause
    │   │   │   ├── session.reducer.ts   reduceSession, restoreSession (section 4.3)
    │   │   │   ├── session.reducer.spec.ts  Une ligne par transition du tableau 4.3
    │   │   │   ├── format.ts            formatClock (mm:ss, h:mm:ss), formatMmSs, formatOverrun (+mm:ss)
    │   │   │   ├── format.spec.ts
    │   │   │   ├── summary.ts           buildSummary, buildSummaryText (texte brut, sans Markdown)
    │   │   │   ├── summary.spec.ts
    │   │   │   ├── storage-schema.ts    StoredRootV1, parseStoredRoot, migrations (aucune en V1)
    │   │   │   ├── storage-schema.spec.ts   Données illisibles, version inconnue, invariant violé
    │   │   │   ├── export-schema.ts     ExportFileV1, serializeExport, parseExport, exportFilename
    │   │   │   ├── export-schema.spec.ts   Fichiers valides et invalides de la section 6.6
    │   │   │   └── export.schema.json  JSON Schema draft 2020-12 de la section 3.5
    │   │   ├── ports/
    │   │   │   ├── storage.port.ts      StoragePort + STORAGE token
    │   │   │   ├── clock.port.ts        ClockPort + CLOCK token
    │   │   │   ├── clipboard.port.ts    ClipboardPort + CLIPBOARD token
    │   │   │   ├── audio.port.ts        AudioPort + AUDIO token
    │   │   │   └── file.port.ts         FilePort + FILE token
    │   │   └── adapters/
    │   │       ├── local-storage.adapter.ts   try/catch, renvoie Result
    │   │       ├── system-clock.adapter.ts    Date.now()
    │   │       ├── clipboard.adapter.ts       navigator.clipboard.writeText
    │   │       ├── web-audio.adapter.ts       AudioContext, oscillateur 880 Hz, 250 ms
    │   │       └── browser-file.adapter.ts    Blob + URL.createObjectURL, File.text()
    │   ├── services/                Couche Application (signals, orchestration)
    │   │   ├── team.service.ts / team.service.spec.ts
    │   │   ├── session.service.ts / session.service.spec.ts
    │   │   ├── clock.service.ts / clock.service.spec.ts
    │   │   ├── persistence.service.ts / persistence.service.spec.ts
    │   │   ├── settings.service.ts
    │   │   ├── alert.service.ts / alert.service.spec.ts
    │   │   ├── export-import.service.ts / export-import.service.spec.ts
    │   │   └── data-reset.service.ts
    │   └── features/                Couche Présentation (Angular, sans règle métier)
    │       ├── shared/
    │       │   ├── confirm-dialog.ts    Dialogue natif <dialog>, focus piégé, boutons FR
    │       │   ├── live-region.ts       Deux zones aria-live : polite (membre courant), assertive (dépassement)
    │       │   └── status-banner.ts     Bandeau fermable (FR-25, FR-16)
    │       ├── team-editor/
    │       │   ├── team-editor.page.ts  /equipe : nom, durée, Prénoms (ReactiveForms), enregistrement
    │       │   ├── team-editor.page.html
    │       │   └── team-editor.page.css
    │       ├── preparation/
    │       │   ├── preparation.page.ts  /preparation : liste, ordre, répartition, démarrage, réinitialisation, lien bilan
    │       │   ├── preparation.page.html
    │       │   └── preparation.page.css
    │       ├── session/
    │       │   ├── session.page.ts     /session : Membre courant, minuteur, Suivant, Pause, choix, son, terminer
    │       │   ├── session.page.html
    │       │   ├── session.page.css
    │       │   └── member-picker.ts     Liste de choix d'un Membre (FR-12), clavier complet
    │       └── summary/
    │           ├── summary.page.ts     /bilan : tableau, Copier le bilan, repli en lecture seule, Nouvelle session
    │           ├── summary.page.html
    │           └── summary.page.css
```

Notes :

- Les fichiers `.page.ts` et `.page.html` sont explicites, pour la lisibilité. Les noms suivent les conventions du CLI de la version retenue, à confirmer au spike S0.
- Chaque fichier `*.spec.ts` est colocalisé avec sa cible. Les fichiers de `core/domain` sont testés sans TestBed.
- Les fichiers Angular de `features/` ne contiennent aucune règle : une règle manquante se corrige dans `core/domain`.

---

## 6. Plan de déploiement, rollback et configuration GitHub Pages

### 6.1 Prérequis

- Dépôt GitHub confirmé (nom à valider, A25) ; variable de dépôt `APP_BASE_HREF` = `/<repo>/`.
- Settings > Pages > Source : « GitHub Actions ».
- Environnement `github-pages` créé, avec ses règles de déploiement limitées à `main` et aux tags `v*`.
- Branch protection sur `main` : `quality`, `e2e`, `lighthouse` obligatoires.
- `gh auth login` effectué sur le poste de l'équipe (état « en attente » dans le PRD, section 8.2).
- Spike S0 terminé (runner des tests tranché, ADR-13).

### 6.2 Construction

```
npm ci
npx ng build --configuration production --base-href "$APP_BASE_HREF"
```

Sortie : `dist/<projet>/browser/` (builder d'application Angular 20). Contrôles automatiques :

1. `check-base-href` : `<base href>` = `APP_BASE_HREF` dans `index.html` ; manifeste et `ngsw.json` sans chemin absolu hors préfixe.
2. `check-privacy` : aucune URL absolue vers une autre origine dans `dist/`.
3. `check-bundle` : JS initial gzip ≤ 300 Kio.
4. Lighthouse CI sur le build servi par `docker compose` sous `/<repo>/`.

### 6.3 Déploiement

1. Fusion sur `main` après G1.
2. `ci.yml` exécute `e2e` et `lighthouse` (G2 : trois navigateurs).
3. `deploy-pages.yml` publie l'artefact `dist/<projet>/browser` (`upload-pages-artifact`), puis `deploy-pages`.
4. Test de fumée `smoke-prod.spec.ts` sur `https://<owner>.github.io/<repo>/` : la page répond 200, `manifest.webmanifest` et `ngsw.json` sont accessibles, l'équipe peut être créée et la Session démarrée, aucune requête hors origine.
5. Une étiquette Git `vX.Y.Z` est posée sur le commit déployé.

### 6.4 Rollback

Les rollbacks sont de deux types : rollback du code (Pages) et rollback des données (localStorage).

Rollback du code, procédure :

1. Identifier la dernière étiquette saine, par exemple `v1.0.0`.
2. Lancer `deploy-pages.yml` avec `workflow_dispatch` et `ref = v1.0.0`. Le workflow reconstruit l'artefact à partir de l'étiquette (sans rejouer les tests, le commit ayant passé les portes à l'époque), le publie, puis exécute le test de fumée.
3. Alternative : `git revert` du commit fautif sur `main`. Le pipeline complet s'exécute.
4. Objectif : service rétabli en 15 minutes au plus.

Effets sur le service worker : les navigateurs qui ont la version défectueuse téléchargent la version restaurée au prochain chargement. Une Session En cours n'est pas interrompue (NFR-3), et sa restauration se fait avec le code restauré.

Rollback des données et compatibilité du schéma :

- la version restaurée peut être plus ancienne que les données stockées. Si `schemaVersion` est supérieur à celui que l'application connaît, `parseStoredRoot` refuse les données, les copie dans la première case libre des trois emplacements et démarre vide, avec le message FR-25. Les données ne sont jamais écrasées sans sauvegarde ; à la quatrième donnée illisible, la troisième copie (`…:backup-3`) est remplacée et la perte est signalée (ADR-05) ;
- un schéma persisté ne doit jamais changer sans migration (ADR-05, ADR-19) ;
- le test de migration « v1 → version précédente refusée proprement » est au nombre des tests unitaires de `storage-schema.spec.ts`.

Critères de rollback : test de fumée en échec après déploiement ; régression du minuteur (SM-4 en échec) ; perte de données signalée sans cause de corruption connue ; faille de confidentialité (requête tierce).

### 6.5 Plan de release V1

| Étape | Contenu | Porte |
|---|---|---|
| S0 | Spike runner, version Angular, zoneless, nom du dépôt | Décision consignée dans ADR-01 et ADR-13 |
| E1 | Socle PWA, Pages, hors ligne, CSP | G2 |
| E2 à E5 | Équipe, répartition, session, alerte (un epic par lot de FR) | G1 par PR |
| E6 | Bilan, copie, export et import | G2 |
| Pilote | Deux équipes, quatre semaines (SM-1 à SM-3) | G3 |
| v1.0.0 | Étiquette et déploiement | G2 |

---

## 7. Exigences non fonctionnelles et choix vérifiables

| NFR | Choix technique | Vérification |
|---|---|---|
| NFR-1 Installable | `@angular/pwa`, manifeste avec icônes 192 et 512 px, `display: standalone`, `theme_color` | Lighthouse CI : audits d'installabilité. Si le score « Installable » n'existe plus dans la version figée de Lighthouse, le critère est remplacé par les audits équivalents (risque T5) |
| NFR-2 Hors ligne | Service worker, `assetGroup` en prefetch, aucune ressource tierce | E2E `offline.spec.ts` : `serviceWorker.ready`, `context.setOffline(true)`, parcours complet |
| NFR-3 Mise à jour | Application au chargement suivant, jamais pendant une Session (ADR-11) | Test unitaire de la règle (aucun `activateUpdate` pendant `running`) ; vérification manuelle au pilote (T6) |
| NFR-4 Base href | `--base-href "$APP_BASE_HREF"`, hash routing (ADR-04, ADR-16) | `check-base-href` ; E2E sur `docker compose` sous `/<repo>/` |
| NFR-5 Performance | Pas de bibliothèque d'interface, polices système, routes chargées à la demande, JS initial ≤ 300 Kio gzip | Lighthouse LCP ≤ 2 500 ms en profil mobile 4G simulé ; `check-bundle` |
| NFR-6 Fiabilité du minuteur | Horodatage `Date.now()`, garde de régression, checkpoints (ADR-06) | Unitaires à horloge simulée ; E2E `timer-background.spec.ts` avec `page.clock` (écart < 1 s sur 15 min) |
| NFR-7 Réactivité < 200 ms | Signals, `ChangeDetectionStrategy.OnPush`, calculs bornés (N ≤ 15) | E2E : mesure du délai clic → mise à jour du DOM ≤ 200 ms sur « Suivant » et « Pause » |
| NFR-8 Aucune donnée sur serveur | Pas de service tiers, CSP `connect-src 'self'`, pas d'analytics (ADR-12) | `privacy-network.spec.ts` ; `check-privacy` ; CSP meta |
| NFR-9 Données locales | `localStorage` uniquement ; réinitialisation FR-28 (`DataResetService`) | Test E2E : après réinitialisation, `localStorage` ne contient plus de clé `scrum-timer` |
| NFR-10 Presse-papiers | `writeText` seulement, pas de `readText` (ADR-10) | Revue de code ; test unitaire du `ClipboardAdapter` (mock) |
| NFR-11 Contrastes | Jetons de couleur dans `styles.css` ; 4,5:1 texte, 3:1 composants | axe-core (`color-contrast`) ; contrôle manuel des jetons |
| NFR-12 Clavier | Boutons et champs natifs, `:focus-visible` visible, pas de raccourci global en V1 (A13) | E2E parcours clavier seul ; axe |
| NFR-13 Lecteurs d'écran | `LiveRegion` : polite pour le Membre courant, assertive pour le dépassement, une annonce par événement | Test de composant (contenu des zones) ; test E2E du texte annoncé |
| NFR-14 Non-couleur | Libellé « Temps dépassé » et « +mm:ss » en plus de la couleur, icône | axe ; revue UX |
| NFR-15 Cibles 44 px | Jeton `--target-min: 44px` appliqué aux boutons, cases et lignes de Membre | E2E : `boundingBox` ≥ 44 × 44 sur les contrôles principaux |
| NFR-16 Mouvement | `@media (prefers-reduced-motion: reduce)` supprime transitions et animations | E2E avec `emulateMedia({ reducedMotion: 'reduce' })` |
| NFR-17 Langue | `lang="fr"` dans `index.html`, textes dans `messages.ts` | axe (`html-has-lang`) ; revue |
| NFR-18 Responsive | Colonne unique, marge 16 px, unités fluides | E2E à 320 px : `scrollWidth ≤ clientWidth` |
| NFR-19 Navigateurs | Deux dernières versions, Safari iOS 16.4 (H-9) | Playwright `chromium`, `firefox`, `webkit` sur `main` ; test manuel sur iOS 16.4 au pilote (non automatisable en V1) |
| NFR-20 Français, formats | `messages.ts`, `formatClock` et `formatMmSs` ; date JJ/MM/AAAA dans le bilan ; AAAA-MM-JJ dans le nom de fichier | Tests unitaires de `format.ts` et `summary.ts` |
| NFR-21 Tests | Pyramide de la section ADR-13 ; trois portes (ADR-15) | Pipeline CI |
| NFR-22 Docker | `Dockerfile` et `docker-compose.yml` ; CI sur `docker compose up web` | Job `e2e` de la CI |

---

## 8. Risques techniques et mesures

Les risques R1 à R9 reprennent ceux du PRD. Les risques T1 à T8 sont techniques et propres à l'architecture.

| # | Risque | Impact | Probabilité | Mesure |
|---|---|---|---|---|
| R1 | Dérive du minuteur en arrière-plan ou en veille | Temps faux, contestation | Élevée | Horodatage et garde (ADR-06), tests à horloge simulée et `page.clock` |
| R2 | Perte des données (fermeture, quota, navigation privée) | Ressaisie | Moyenne | Écriture à chaque mutation, checkpoints, bandeau FR-25, export (ADR-05, ADR-19) |
| R3 | Chemins cassés sur GitHub Pages | Application inaccessible | Moyenne | Base href variable et contrôlée (ADR-16), hash routing (ADR-04), test de fumée |
| R4 | Son bloqué par le navigateur, notamment sur iOS | Alerte non entendue | Élevée | Alerte visuelle principale, `unlock()` au clic (ADR-09), échec silencieux |
| R5 | Écran qui se met en veille pendant la Session | Session interrompue | Élevée | Reprise automatique (ADR-06 point 6). Wake Lock hors V1 (Q6) |
| R6 | Usage perçu comme de la surveillance | Rejet par l'équipe | Moyenne | Pas de classement affiché, bilan présenté comme information partagée, pilote (epic E6) |
| R7 | Attente de synchronisation multi-appareils | Déception de l'observatrice | Élevée | Non-objectif V1 explicite (ADR-18) |
| R8 | Incohérences PRD, architecture et UX | Retard, reprise | Moyenne | Annexe A, validation client avant E3 |
| R9 | KPI non mesurables sans télémétrie | KPI non vérifiables | Élevée | Mesures automatisées pour le technique, pilote manuel pour l'usage (PRD 9.2) |
| T1 | Angular 20 arrive en fin de support LTS pendant le projet | Dette de sécurité, montée forcée | Élevée | Note ADR-01 ; montée planifiée avant E6 ; contrôle de version au spike S0 |
| T2 | Builder Vitest encore expérimental dans 20.3.x | Retard d'outillage | Moyenne | Spike S0 avec repli Karma et Jasmine (ADR-13) |
| T3 | `performance.now()` non fiable pendant la veille selon la plateforme | Sous-comptage | Moyenne | Pas de `performance.now()` pour la mesure (ADR-06) |
| T4 | CSP en balise `meta` ignore certaines directives | Filet de sécurité partiel | Certaine | La garantie repose sur le test E2E et sur `check-privacy` |
| T5 | Lighthouse a retiré ou renommé le score « Installable » | Critère NFR-1 non vérifiable | Moyenne | Vérifier les audits de la version figée ; remplacer le critère par les audits équivalents |
| T6 | Mise à jour du service worker non testable de bout en bout en CI | Régression non détectée | Moyenne | Test manuel en pilote, deux builds successifs documentés |
| T7 | Données d'une version plus récente après un rollback | Données écrasées | Faible | Sauvegarde dans les trois emplacements `…:backup*` avant tout remplacement (ADR-05, section 6.4) |
| T8 | Noms de caractères accentués décomposés (NFD) saisis sur macOS | Prénom refusé à tort | Moyenne | `normalize('NFC')` avant validation, marques `\p{M}` acceptées (INV-06) |
| T9 | Régression d'horloge système pendant une Intervention | Temps faux | Faible | Garde de régression (ADR-06 point 4), journalisation |

---

## 9. Annexe A : incohérences du PRD et arbitrages

Les constats portent sur le PRD v2 (`prd.md`). « Action » indique ce qu'il faut corriger dans le PRD, pour que le document de référence soit cohérent.

| # | Constat (réf. PRD) | Décision d'architecture | Action sur le PRD |
|---|---|---|---|
| A1 | Q1 et H-2 laissent ouverte la vue d'un observateur sur un second appareil | Fermée par D1 : un seul appareil partagé (ADR-18). Le besoin de l'observatrice est accepté comme limite (R7) | Passer Q1 en « tranchée » ; retirer la mention « à arbitrer » de la persona Inès |
| A2 | Q2 demande si le temps alloué est par Session ou par Intervention. Le brief (RF2) prévoit une Pause au niveau de la Session | Fermée par D2 (total par Session) et D3 (Pause par Intervention). Le brief RF2 est superseded | Passer Q2 en « tranchée » ; mettre à jour la section 8.4 |
| A3 | Q3 : somme manuelle exacte ou reliquat | Fermée par D4 : somme exacte (INV-04). Le reliquat est rejeté | Passer Q3 en « tranchée » ; retirer « [ARBITRAGE] Q3 » de FR-9 |
| A4 | FR-17 et H-14 : une alerte « à nouveau » à chaque Intervention où le Membre franchit son temps. Or le temps est cumulé sur la Session (H-7), donc le franchissement ne se produit qu'une fois. Les deux textes se contredisent | Une alerte par Membre et par Session (INV-14, D2) | Réécrire les deux dernières puces de FR-17 et H-14 |
| A5 | H-10 et section 8.4 proposent `performance.now()` pour les durées en cours. FR-14 exige un calcul « selon l'horloge » après veille | `Date.now()` avec garde de régression (ADR-06). `performance.now()` écarté pour la mesure | Réécrire H-10 et la puce « Horodatage » de la section 8.4 |
| A6 | FR-24 n'enregistre qu'« après chaque modification ». FR-16 exige que le temps écoulé jusqu'à la fermeture soit compté. Une écriture seulement à la modification ne suffit pas | Checkpoint toutes les 5 s pendant une Intervention, et à `pagehide` ou `visibilitychange` masquée (ADR-06 point 6) | Ajouter le checkpoint à FR-24 et la précision « perte maximale 5 s en cas de crash » à FR-16 |
| A7 | FR-2 : le Membre ajouté prend « la valeur recalculée selon la Répartition en cours ». En répartition manuelle, il n'existe pas de valeur recalculée | En mode `manual`, le nouveau Membre reçoit 30 s ; la somme devient invalide et l'enregistrement est bloqué (ADR-08) | Préciser FR-2 |
| A8 | FR-4 ne dit rien de l'ordre pendant une Session | Ordre verrouillé pendant une Session En cours, comme les autres réglages (FR-5, INV-15) | Ajouter la règle à FR-4 |
| A9 | FR-27 ne dit rien d'un import pendant une Session | Import refusé pendant une Session En cours. Message proposé : « Terminez la session en cours avant d'importer une équipe. » (texte à valider) | Ajouter la règle et le message à FR-27 et à la section 7.3 |
| A10 | FR-24 n'inclut pas la Session terminée, alors que FR-23 et FR-16 supposent qu'elle est conservée | La Session terminée est persistée (dernier bilan) jusqu'au démarrage suivant. Messages de données d'une version non prise en charge : même message FR-25, faute de texte validé | Ajouter la Session terminée à FR-24 ; valider le texte de version non prise en charge |
| A11 | FR-28 est défini en section 7.3, alors que les autres exigences sont en section 4. NFR-9 le référence | Sans effet sur l'architecture | Déplacer FR-28 dans la section 4.6 |
| A12 | NFR-3 dit « disponible au prochain rechargement », puis « appliquée au prochain démarrage » | Application au prochain chargement complet de la page, jamais pendant une Session (ADR-11) | Harmoniser NFR-3 sur « prochain chargement complet » |
| A13 | NFR-12 et Q5 : raccourci « Suivant » non tranché | Pas de raccourci global en V1. Espace et Entrée agissent sur le bouton focalisé, comportement natif | Passer Q5 en « non retenu en V1 » |
| A14 | Q6 : empêcher la mise en veille | Hors V1, comme le PRD le prévoit. R5 est couvert par la reprise (FR-16) | Passer Q6 en « non retenu en V1 » |
| A15 | Q7 (avertissement à 30 s) et Q8 (ordre aléatoire) | Non retenus en V1. L'ordre suit la liste (H-6) | Passer Q7 et Q8 en « non retenus en V1 » |
| A16 | Q4 : plusieurs équipes par appareil | Une seule équipe (ADR-18) | Passer Q4 en « tranché » |
| A17 | FR-14 : une durée négative « ramenée à 0 pour cette Intervention » | Remplacé par une garde qui absorbe la régression : le temps ne recule jamais, et la régression est journalisée. Le résultat est au moins aussi juste | Réécrire la puce de FR-14 |
| A18 | Section 6.1 : « lettres, chiffres, espaces, apostrophes, tirets, points, parenthèses » sans définir les lettres. Section 6.3 : les lettres accentuées décomposées (NFD) seraient refusées | Lettres au sens Unicode (`\p{L}` et `\p{M}`), chiffres `\p{N}`, normalisation NFC (INV-03, INV-06, T8) | Préciser l'alphabet dans 6.1 et 6.3 |
| A19 | FR-15 : « si la Session n'a aucune Intervention, tous les Membres à 0 s ». FR-10 démarre toujours une Intervention, donc le cas ne se produit pas | Cas inatteignable, gardé comme garde-fou (le reducer renvoie 0 pour chaque Membre) | Retirer le cas, ou le marquer « garde-fou » |
| A20 | Le PRD (section 8.2) prévoit Vitest. Le dépôt utilise Karma et Jasmine | Spike S0, avec repli (ADR-13) | Mettre la section 8.2 à jour après S0 |
| A21 | Le PRD fixe Angular 20 sans tenir compte de la fin de support LTS (ADR-01) | Version figée en E1, montée planifiée avant E6 | Ajouter un point de contrôle de version dans le plan de release |
| A22 | Le PRD ne définit pas la règle de restauration si le stockage contient une version inconnue (FR-25 ne vise que « illisibles ») | Données copiées dans la première case libre des trois emplacements `…:backup*` avant de démarrer vide (ADR-05) | Étendre FR-25 au cas « version inconnue » |
| A23 | UX (ux.md, étape 4) : « le chronomètre repart à la durée allouée restante ». Le PRD mesure un temps parlé et un temps restant | Affichage du temps restant (`allocated − spoken`), dérivé des horodatages. Pas de compte à rebours autonome | Préciser la formule dans ux.md (sans changer le fond) |
| A24 | Le PRD décrit le « temps moyen par Membre » en mm:ss (FR-7), mais le bilan et la répartition utilisent aussi mm:ss avec des minutes pouvant dépasser 59 (120:00) | `formatMmSs` sans limite de minutes pour la répartition et le bilan ; `formatClock` (h:mm:ss au-delà de 59 min) pour le minuteur (FR-14) | Préciser les deux formats |
| A25 | NFR-4 : nom du dépôt inconnu (`/<nom-du-depot>/`) | `APP_BASE_HREF` = `/scrum-speaking-timer/` (ADR-16) | Nom confirmé par l'orchestrateur |
| A26 | NFR-5 : budget de 300 Ko « compressés » (H-17), mesure non définie | Mesure : gzip du JS initial (`check-bundle`), niveau de compression par défaut de Node | Préciser la méthode dans H-17 |

---

## 10. Points ouverts à valider

| Point | Qui | Quand |
|---|---|---|
| Nom du dépôt GitHub (base href, A25) | Client | Avant le premier déploiement |
| Version Angular retenue et date de fin de support (ADR-01) | Architecte | Spike S0 et avant E6 |
| Runner de tests (ADR-13) | Architecte | Spike S0 |
| Textes nouveaux : import pendant session, version non prise en charge, « Remplacer » pour l'import, message de réinitialisation | Concepteur UX et client | Avant l'epic E6 |
| Accord sur les décisions A4, A5, A7 à A9, A12 à A17 et A23 | Client et auteur du PRD | Avant l'epic E3 (exigence du PRD, section 9.3) |
| Test iOS 16.4 (H-9, NFR-19) | Testeur | Pilote |

---

*Fin du document. Aucun code applicatif n'a été écrit dans `src/`. Les exemples de code de ce document sont des signatures, à implémenter pendant les epics.*
