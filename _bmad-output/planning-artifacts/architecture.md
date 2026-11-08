# Architecture : Scrum Speaking Timer

**Auteur :** Agent architecte (BMAD `bmad-agent-architect`)
**Statut :** Validée pour la V1
**Réf. :** [brief produit](./product-brief.md)

## 1. Vue d'ensemble

Application Angular standalone, en PWA, sans backend.
Toutes les données sont stockées dans le navigateur (`localStorage`).

```
┌──────────────────────────────────────────┐
│ Navigateur / PWA installée               │
│                                          │
│  Pages (Angular)                         │
│   ├─ Équipe        (saisie des membres)  │
│   ├─ Session       (minuteur, parole)    │
│   └─ Bilan         (temps par personne)  │
│                                          │
│  Services                                │
│   ├─ TeamService    (équipe, mémoire)    │
│   ├─ SessionService (état du minuteur)   │
│   └─ StorageService (localStorage)       │
│                                          │
│  Service Worker (hors ligne)             │
└──────────────────────────────────────────┘
```

## 2. Choix techniques

| Sujet | Choix | Justification |
|-------|-------|---------------|
| Framework | Angular 20 (standalone) | Demandé ; composants sans NgModule |
| État | Signals Angular | Suffisant pour une V1 mono-page |
| Persistance | `localStorage` avec clé versionnée | Pas de serveur, données conservées au rechargement |
| PWA | `@angular/pwa` (service worker) | Installation et mode hors ligne natifs |
| Tests unitaires | Vitest (fourni par Angular) | Rapide, déjà configuré |
| Tests E2E | Playwright | Vérifie le parcours réel dans un navigateur |
| Conteneur | Docker Compose (image Node pour le dev, nginx pour servir le build) | Lancement identique partout |
| CI/CD | GitHub Actions | Tests, build, déploiement GitHub Pages |

## 3. Modèle de données

```ts
interface Member {
  id: string;          // uuid
  name: string;        // prénom
  allocatedSec: number;// temps alloué pour la session
  spokenSec: number;   // temps réellement parlé
}

interface Team {
  id: string;
  name: string;
  members: Member[];
  defaultDurationSec: number; // 900 par défaut (15 min)
}

interface Session {
  teamId: string;
  startedAt: number;     // timestamp (ms)
  currentMemberId: string | null;
  turnStartedAt: number | null;
  status: 'idle' | 'running' | 'paused' | 'finished';
}
```

**Clé de stockage :** `scrum-timer:v1` (le suffixe `v1` permet une migration future).

## 4. Règle de mesure du temps (point critique)

Le temps parlé n'est **jamais** calculé avec un compteur qui décrémente chaque seconde.
Il est calculé à partir de `Date.now()` :

```
spokenSec += (Date.now() - turnStartedAt) / 1000
```

Cette règle évite la dérive quand l'onglet est en arrière-plan ou que le téléphone se met en veille.

## 5. Découpage des composants

- `app.routes.ts` : trois routes (`/equipe`, `/session`, `/bilan`).
- `team-setup.component` : formulaire de saisie et répartition du temps.
- `session.component` : minuteur principal, boutons « Suivant » et « Pause ».
- `summary.component` : tableau du bilan et copie en texte.
- `alert.service` : déclenche le signal visuel et sonore au dépassement.

## 6. Décisions retenues

1. Pas de backend en V1 : réduit la complexité et permet le déploiement sur GitHub Pages.
2. Export/import JSON ajouté au périmètre pour sauvegarder l'équipe sans serveur (réponse à la question 1 du brief).
3. Stratégie de cache du service worker : `prefetch` pour l'application, `lazy` pour les ressources externes (réponse à la question 3).

## 7. Contraintes de déploiement

- GitHub Pages sert le site sous `/<nom-du-depot>/` : la base href doit être configurée au build (`--base-href`).
- Le service worker n'est actif qu'en production (`ng build`).
