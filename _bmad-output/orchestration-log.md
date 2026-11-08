# Journal d'orchestration : Scrum Speaking Timer

## Étape 1 : Métier
- Agent : Analyste métier (BMAD `bmad-agent-analyst`)
- Statut : validé
- Preuve : [product-brief.md](./planning-artifacts/product-brief.md) : périmètre V1 et critères de succès rédigés
- Décision : V1 limitée à une fonctionnalité complète (minuteur de parole par membre), sans backend

## Étape 2 : Architecture
- Agent : Architecte (BMAD `bmad-agent-architect`)
- Statut : validé
- Preuve : [architecture.md](./planning-artifacts/architecture.md) : Angular standalone, signals, `localStorage`, PWA
- Décision : temps mesuré par horodatage et non par compteur, pour résister à la mise en veille

## Étape 3 : Développement
- Agent : Développeur
- Statut : validé
- Preuve : build de production réussi avec `ng build --configuration production`
- Décision : routes `/equipe`, `/session`, `/bilan` ; export et import JSON pour sauvegarder l'équipe

## Étape 4 : Tests
- Agent : Testeur
- Statut : validé
- Preuve : `ng test` : 7 tests, 7 réussis (Chrome headless)
- Décision : logique de temps isolée dans `timer.logic.ts` pour être testable sans navigateur

## Étape 5 : Revue
- Statut : en attente

## Étape 6 : Conteneurisation et pipeline
- Statut : fichiers écrits (`Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`), exécution à vérifier

## Étape 7 : Déploiement
- Statut : en attente (dépôt GitHub à créer, `gh auth login` requis)
