# Notes de développement : Scrum Speaking Timer

**Tenu par :** Amelia, Senior Software Engineer (BMAD `bmad-agent-dev`)
**Périmètre :** lots 1 et 2 de `epics-et-stories.md` (jalon J1)

---

## Spike S-E1-01 : résultats

- Angular 20.3.35 (`@angular/cli` 20.3.42), Karma 6.4.4 et Jasmine. Karma/Jasmine conservés, pas de migration de runner.
- `ng test --watch=false` : Karma exécute les specs en ChromeHeadless (nécessite `CHROME_BIN`, voir plus bas), durée d'exécution d'environ 1 s pour la suite complète.
- Routage en mode hash (`withHashLocation()`) : test de configuration rouge puis vert. Le build servi sous `/scrum-speaking-timer/` répond `/scrum-speaking-timer/#/session` (titre affiché) et redirige la racine ; hors préfixe, 404. Vérifié par un serveur statique de test sur `dist`.
- Aucun échec de Karma ou de routage : rien à escalader.

## Environnement

- `CHROME_BIN` doit pointer vers Chrome sous Windows, par exemple `C:/Program Files/Google/Chrome/Application/chrome.exe`.
- Sous Git Bash, préfixer les commandes ng par `MSYS_NO_PATHCONV=1` : sans cela, `--base-href "/scrum-speaking-timer/"` est converti en chemin Windows et la base href est fausse.

## Décisions

1. **S-E2-02, critère 1 (casse) :** l'épopée indique « jEAN » reste « jEAN ». Le PRD (6.3) et INV-07 disent que seule la première lettre est mise en majuscule si elle est minuscule, ce qui donne « JEAN ». Décision : suivre le PRD et INV-07. Le texte de l'épopée est probablement erroné. À confirmer avec le PO.
2. **S-E1-03, critère 3 (route vide) :** la route `''` redirige vers `/equipe` s'il n'y a pas d'équipe, et vers `/preparation` s'il y en a une. Cette règle vient d'ADR-04 et de S-E2-05 critère 4 (rechargement vers `/preparation`). Elle précise le texte « les règles selon l'état sont ajoutées en S-E4-11 ».
3. **S-E1-02, icônes :** `logo.svg` est un bandeau 480×96 et non une icône carrée. Les PNG 192 px, 512 px et 512 px maskable (`icon-512-maskable.png`, emblème à 60 % de la surface) sont générés à partir de l'emblème de `favicon.svg`, rendu par Chrome en mode headless. Les anciens PNG `icon-*x*.png` ne sont plus référencés et sont conservés.
4. **S-E1-04, liste blanche du contrôle de confidentialité :** `check-privacy` ignore les espaces de noms (w3.org, json-schema), les liens de licence du service worker d'Angular et les liens de documentation (`angular.dev/errors`, `angular.dev/best-practices/`) présents dans les messages du runtime. Ces URLs ne sont jamais demandées. La vraie garde est la garde réseau E2E.
5. **S-E1-05, navigateur E2E :** en local, Playwright utilise le Chrome installé (`channel: 'chrome'`). En CI (`CI=true`), il utilise le Chromium de Playwright. Les E2E tournent sur `ng serve` (base `/`). La vérification du préfixe est couverte par S-E1-03 et le smoke test manuel ci-dessus. La logique de garde est testée sous Node (`scripts/tests/network-guard.test.mjs`).
6. **Code prototype remplacé :** les anciens modèles, `StorageService`, `SessionService`, `timer.logic` (et son spec), et les pages prototypes ont été supprimés. La structure cible (`core/domain`, `core/ports`, `core/adapters`, `services`, `features`) les remplace. Les tests de `timer.logic.spec.ts` (répartition, temps écoulé) sont couverts par `allocation.spec.ts`.
7. **S-E2-05, formulaire de création :** l'écran `/equipe` affiche toujours un formulaire vide, même si une équipe existe. La modification d'une équipe existante est en lot 3 (S-E2-11).
8. **S-E2-05, durée et temps moyen :** le champ durée est validé (S-E3-01), mais le temps moyen en direct (S-E3-03) n'est pas affiché : il relève du lot 3.
9. **S-E2-12, bouton « Démarrer la session » :** il navigue vers la route provisoire `/session`. La Session elle-même (états, minuteur) est livrée par les epics E4 et E5.
10. **S-E2-06, point d'entrée « Nouvelle équipe » [À VALIDER] :** lien sur l'écran de préparation vers `/equipe`. Le libellé et l'emplacement sont à valider par le client.
11. **Persistance, schéma :** `session` vaut `null` dans `StoredRootV1` jusqu'à l'epic E4. Toute valeur différente de `null` rend la donnée illisible (sauvegardée dans la première case libre des trois emplacements `scrum-timer:v1:backup*`).
12. **Messages d'erreur :** la table `messages.ts` regroupe tous les codes de validation avec leurs textes exacts du PRD. Les textes sans source (ex. `ALLOCATION_REQUIRED`) suivent EXPERIENCE 3.2.1 et sont à valider.
13. **Répartition égale, recalcul :** `TeamService.commit` recalcule les temps alloués en répartition égale. Les valeurs saisies par le formulaire sont ignorées dans ce cas (INV-10, ADR-08).
14. **Infrastructure hors lot :** Docker, GitHub Actions, Lighthouse CI, `check:base-href`, `check:bundle` (lots 4 et suivants) ne sont pas traités, comme demandé.

## Commandes de contrôle (dernière exécution)

- `npx ng test --watch=false` : 98 SUCCESS.
- `npx ng build --configuration production --base-href "/scrum-speaking-timer/"` : build réussi, `<base href="/scrum-speaking-timer/">` vérifié.
- `npm run check:privacy` : 11 fichiers analysés, aucune URL externe.
- `npm run test:scripts` : 7 tests node pass.
- `npm run e2e` : 5 tests Playwright (Chrome) pass.
