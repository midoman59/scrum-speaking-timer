CHANGEMENTS DEMANDÉS

# Revue 3 : lots 1 et 2 (Scrum Speaking Timer)

**Périmètre :** commits 704d5fc à 2b966e2 ; `git diff 11ae0ab..HEAD -- src public e2e scripts angular.json karma.conf.js package.json`. Contrôle des constats N-1 à N-3 (revue 2), I-5 et I-6 (revue 1), puis recherche de régressions et de nouveaux défauts.
**Méthode :** lecture du code courant (`app.ts`, `app.html`, `persistence.service.ts`, `storage-schema.ts`, `team-editor.page.ts`, `status-banner.ts`), des specs associées, des diffs des trois derniers commits de correction, et des textes des documents (`epics-et-stories.md`, `architecture.md`, `EXPERIENCE.md`, `prd.md`). Aucun fichier de `src/` n'a été modifié. Les tests de mutation (retirer une correction et voir le test échouer) n'ont pas été rejoués, faute de droit d'écriture dans `src/` : l'échec sans correction est établi par lecture du code.

## Verdict et décompte

| Gravité | Nombre |
|---|---|
| Bloquant | 0 |
| Important | 2 |
| Mineur | 1 |

Le verdict est **CHANGEMENTS DEMANDÉS** : deux points importants restent ouverts. Les corrections de N-1, N-2 et N-3 sont réelles pour le scénario visé. Les tests et contrôles passent tous. Le lot ne peut pas être approuvé tant que I-A et I-B ne sont pas traités, ou explicitement reportés par le PO.

Décisions laissées au client, non jugées ici : le prénom « jEAN » contre « JEAN » ; le texte du bandeau de perte de sauvegarde (`BACKUP_LOST_MESSAGE`, marqué « à valider par le PO ») ; les mineurs N-4 à N-7 restent ouverts (acceptés).

---

## Vérification des constats précédents

| Constat | Commit | Correction dans le code | Test qui la prouve | Statut |
|---|---|---|---|---|
| **N-1** bandeau B-1 (écriture refusée, FR-25) | c011f71 | `app.ts` l.37-41 (`showStorageRefused` = `health() !== 'ok'` et non fermé) ; `app.html` l.2-6 ; `persistence.service.ts` l.54 (`degraded` pour quota, `unavailable` sinon) | `app.spec.ts` l.43-74 : quota, stockage indisponible, et absence du bandeau quand l'écriture réussit. Sans le bandeau, le texte exact n'existe nulle part dans `src/` : le test échoue. | **Corrigé et prouvé** pour l'écriture refusée. Réouverture après fermeture du bandeau : voir I-A. |
| **N-2** focus sur la première erreur à la soumission | a9553b9 | `team-editor.page.ts` l.244-250 : `focusFirstInvalid()` est appelé avant le traitement du prénom ; nom et durée passent en premier | `team-editor.page.spec.ts` l.164-180 : nom vide et prénom « Jean3 » ; le focus doit aller sur `#team-name`. Avant le correctif, `addMember()` était appelé en premier et plaçait le focus sur `#member-name` : le test échoue. | **Corrigé et prouvé** |
| **N-3** politique de sauvegarde et perte signalée | 2b966e2 | `persistence.service.ts` l.58-78 : `backupLost` passe à vrai quand les trois emplacements sont pris ; `app.ts` l.29-34 et `app.html` l.12-16 : bandeau dédié ; `architecture.md` l.147 consigne la rotation | `persistence.service.spec.ts` l.78-100 (quatre données, perte signalée ; données déjà conservées sans perte) ; `app.spec.ts` l.97-108 (bandeau de perte affiché après quatre données) | **Corrigé et prouvé** pour le code. Consignation incomplète : voir I-B. Message exact sur écriture en échec : voir M-A. |
| **I-5** prénom saisi sans « Ajouter » | 82c8d0a | `team-editor.page.ts` l.252 : le prénom saisi est ajouté, ou bloque l'enregistrement | `team-editor.page.spec.ts` l.127-162 : prénom valide ajouté ; prénom invalide bloque et garde le focus. Pas de régression constatée (le correctif N-2 ne modifie pas ce chemin). | **Corrigé et prouvé, pas de régression** |
| **I-6** données illisibles successives | ecf8d47 | `persistence.service.ts` l.63-78 ; `storage-schema.ts` l.7-9 : trois emplacements | `persistence.service.spec.ts` l.62-76 (deux corruptions, pas de recopie) et l.102-107 (échec d'écriture : santé `unavailable`). Pas de régression. | **Corrigé et prouvé, pas de régression** |

Constat lié, corrigé par N-1 : **N-6** (copie en échec sans trace). `persistence.service.ts` l.77 passe la santé à `unavailable` quand la copie échoue, ce qui affiche le bandeau B-1.

---

## Nouveaux constats

### Bloquant

Aucun.

### Important

**I-A. Bandeau B-1 fermé une fois : les échecs suivants deviennent silencieux**
- **Fichiers :** `src/app/app.ts` l.37 (`storageRefusedDismissed`, jamais réinitialisé) et l.39-41 (`showStorageRefused`) ; `src/app/app.html` l.2-6.
- **Scénario d'échec :** le stockage est plein. La création d'équipe échoue, le bandeau B-1 apparaît. Le Scrum Master le ferme (`EXPERIENCE.md`, B-1 : « fermable »). Il remplace ensuite l'équipe (dialogue D-1). La nouvelle écriture échoue : `health` reste `degraded`, mais `showStorageRefused` reste faux parce que `storageRefusedDismissed` est vrai. Aucun signal n'est affiché : l'équipe n'existe qu'en mémoire vive, et elle disparaît à la fermeture de l'onglet. Même effet si le stockage repasse à `ok` puis retombe en panne : le bandeau ne revient jamais pendant la session.
- **Correction proposée :** remplacer le booléen par un compteur d'incidents. `PersistenceService` incrémente un signal `failures` à chaque échec d'écriture (quota ou indisponible). `App` affiche le bandeau tant que `failures() > dismissedAt()`, et `storageRefusedDismissed` mémorise `failures()` au moment de la fermeture. Test à ajouter dans `app.spec.ts` : écriture en échec, fermeture du bandeau, nouvelle écriture en échec, bandeau de nouveau présent avec le texte exact.

**I-B. Consignation de la politique N-3 incomplète : trois passages contradictoires**
- **Fichiers :** `_bmad-output/planning-artifacts/epics-et-stories.md` l.436 (S-E2-03, critère 3 : « le brut est copié une seule fois dans `scrum-timer:v1:backup` ») ; `_bmad-output/planning-artifacts/architecture.md` l.491 (table des clés : « une fois ») et l.1050 (« Les données ne sont jamais écrasées sans sauvegarde »).
- **Scénario d'échec :** le code remplace la troisième copie après quatre données illisibles (`persistence.service.ts` l.74-76), ce qui contredit l.1050 de l'architecture. La revue 2 demandait de « choisir et consigner » ce comportement dans l'ADR-05 et dans S-E2-03 n°3. L'ADR-05 (l.147) est à jour, mais les deux autres passages décrivent encore le comportement d'avant I-6. Un développeur qui suit l'épic ou la table des clés pour la réinitialisation future (S-E2-14) ou pour un test E2E ne trouvera pas la règle appliquée.
- **Correction proposée :** dans `epics-et-stories.md` l.436, écrire « copié dans la première case libre parmi trois (`…:backup`, `…:backup-2`, `…:backup-3`) ; quand les trois sont prises, la troisième est remplacée et la perte est signalée (N-3) ». Dans `architecture.md` l.491, remplacer « une fois » par « trois emplacements ». Dans l.1050, préciser « sans sauvegarde, ou avec signalement de perte après trois copies ». Rien de code à changer.

### Mineur

**M-A. Message « a été remplacée » affiché même si l'écriture de la copie échoue**
- **Fichier :** `src/app/services/persistence.service.ts` l.74-77.
- **Scénario d'échec :** les trois emplacements sont pris (A, B, C). Une donnée D arrive et l'écriture de `backup-3` échoue (quota). `backupLost` est mis à vrai avant l'écriture (l.74). Le bandeau dit que C « a été remplacée dans la sauvegarde », alors que C est toujours là et que D n'est pas conservé. Le bandeau B-1 s'affiche aussi (l.77), mais le message de perte est faux.
- **Correction proposée :** déplacer `this.backupLost.set(true)` après `if (written.ok)`, et ne le mettre à vrai que si l'écriture a réussi.

---

## Constats mineurs restés ouverts (acceptés, non jugés)

- **N-4** (`scripts/check-privacy.mjs`, `URL_PATTERN`) : toujours ouvert. `//10.0.0.1/x.js` n'est pas détecté (l'adresse IP ne correspond pas à `[\w-]+\.[a-z]`).
- **N-5** (annonces `role="status"` créées avec leur contenu, `team-editor.page.ts` l.92 et l.69 ; bandeaux `status-banner.ts`) : toujours ouvert. Les bandeaux B-1 et de perte sont créés avec leur texte, ce qui relève du même défaut.
- **N-7** (documents de référence non versionnés) : toujours ouvert.

---

## Vérifications exécutées

| Vérification | Résultat | Code de sortie |
|---|---|---|
| `npx ng test --watch=false` | 131 SUCCESS sur 131 (ChromeHeadless). Il y en avait 124 à la revue 2. | 0 |
| `npm run check:privacy` (après `npx ng build --configuration production`, build OK) | 11 fichiers analysés, aucune URL externe | 0 |
| `npm run e2e` (Playwright, `ng serve` lancé par Playwright) | 18 passed, 0 failed | 0 |
| `npm run test:scripts` | 11 pass, 0 fail | 0 |

Journaux complets dans le dossier scratchpad de la session :
- `C:\Users\HP840G~1\AppData\Local\Temp\claude\C--Users-HP-840-G6--claude-spares-spare-2TQxWZ\b358034a-27c9-4f14-ae6e-3134506ba772\scratchpad\rev3-ngtest.txt`
- `C:\Users\HP840G~1\AppData\Local\Temp\claude\C--Users-HP-840-G6--claude-spares-spare-2TQxWZ\b358034a-27c9-4f14-ae6e-3134506ba772\scratchpad\rev3-privacy.txt`
- `C:\Users\HP840G~1\AppData\Local\Temp\claude\C--Users-HP-840-G6--claude-spares-spare-2TQxWZ\b358034a-27c9-4f14-ae6e-3134506ba772\scratchpad\rev3-e2e.txt`
- `C:\Users\HP840G~1\AppData\Local\Temp\claude\C--Users-HP-840-G6--claude-spares-spare-2TQxWZ\b358034a-27c9-4f14-ae6e-3134506ba772\scratchpad\rev3-build.txt`

Confidentialité : aucun appel réseau ajouté dans `src/` hors specs. Les nouveaux bandeaux n'envoient rien.
