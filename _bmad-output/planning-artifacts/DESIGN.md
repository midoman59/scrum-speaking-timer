# DESIGN : Scrum Speaking Timer

**Auteure :** Sally, UX Designer (BMAD `bmad-agent-ux-designer`)
**Réf. :** [PRD](./prd.md), [Parcours UX/UI](./ux.md), [Parcours détaillés](./EXPERIENCE.md)
**Statut :** Brouillon v1, à valider avec le client
**Langue :** Français

---

## 1. Principes visuels

1. **Lisible à distance.** L'écran est partagé pendant le Daily. Le prénom et le chronomètre du Membre courant sont les éléments les plus grands de l'écran.
2. **Un seul bouton plein à la fois.** « Suivant » est le seul bouton plein pendant une Session (ux.md, règles d'interface). Les autres actions sont en contour ou en texte.
3. **Le dépassement se voit sans alarmer.** Il combine trois signaux : la couleur, un libellé texte (« Temps dépassé ») et une icône. La couleur n'est jamais le seul signal (NFR-14).
4. **Sobre et neutre.** Pas de classement, pas de couleur qui désigne une personne. L'interface doit paraître un outil partagé, pas un outil de surveillance (R6).
5. **Zéro dépendance externe.** Pas de Google Fonts, pas de CDN, pas d'icônes chargées depuis le réseau (NFR-8). Les icônes sont des SVG en ligne.

---

## 2. Palette

Les valeurs sont données en hexadécimal. Chaque token existe en mode clair et en mode sombre. Le mode sombre suit `prefers-color-scheme` ; le mode clair est forcé par `data-theme="light"` et le mode sombre par `data-theme="dark"`.

### 2.1 Tokens

| Token | Rôle | Clair | Sombre |
|---|---|---|---|
| `--color-bg` | Fond de page | `#FFFFFF` | `#111827` |
| `--color-surface` | Cartes, panneaux, lignes de tableau | `#F5F7FA` | `#1F2937` |
| `--color-surface-hover` | Survol d'une ligne ou d'un bouton fantôme | `#EDF2F7` | `#374151` |
| `--color-text` | Texte principal | `#1A202C` | `#F3F4F6` |
| `--color-text-muted` | Libellés secondaires, aides | `#4A5568` | `#B0B8C4` |
| `--color-border` | Bordure des champs (composant) | `#6B7280` | `#9CA3AF` |
| `--color-border-subtle` | Séparateurs décoratifs | `#CBD5E0` | `#374151` |
| `--color-primary` | Action principale, Membre courant | `#4338CA` | `#A5B4FC` (texte) / `#A5B4FC` (fond du bouton) |
| `--color-primary-hover` | Survol de l'action principale | `#3730A3` | `#C7D2FE` |
| `--color-on-primary` | Texte sur fond primary | `#FFFFFF` | `#1E1B4B` |
| `--color-primary-soft` | Fond du Membre courant, survol secondaire | `#E0E7FF` | `#312E81` |
| `--color-on-primary-soft` | Texte sur primary-soft | `#1A202C` | `#F3F4F6` |
| `--color-secondary` | Action secondaire pleine (rare) | `#0F766E` | `#5EEAD4` |
| `--color-secondary-hover` | Survol action secondaire pleine | `#115E59` | `#99F6E4` |
| `--color-on-secondary` | Texte sur secondary | `#FFFFFF` | `#042F2E` |
| `--color-success` | Dans le temps, total correct | `#276749` | `#4ADE80` |
| `--color-success-soft` | Fond de statut succès | `#F0FFF4` | `#14532D` |
| `--color-warning` | Avertissement (bandeau de stockage) | `#92400E` | `#FCD34D` |
| `--color-warning-soft` | Fond de bandeau avertissement | `#FFFBEB` | `#2A2208` |
| `--color-danger` | Dépassement, erreur, action destructive | `#C53030` | `#F87171` |
| `--color-danger-hover` | Survol action destructive | `#9B2C2C` | `#FCA5A5` |
| `--color-on-danger` | Texte sur danger | `#FFFFFF` | `#111827` |
| `--color-danger-soft` | Fond de ligne en dépassement, fond d'erreur | `#FFF5F5` | `#3B0D0D` |
| `--color-focus` | Anneau de focus | `#3730A3` | `#C7D2FE` |
| `--color-disabled-bg` | Fond d'un élément désactivé | `#E5E7EB` | `#374151` |
| `--color-disabled-text` | Texte d'un élément désactivé | `#6B7280` | `#9CA3AF` |

Les couleurs sémantiques (succès, alerte, dépassement) ont toujours un libellé et une icône à côté (voir section 7).

### 2.2 Code des tokens

```css
:root {
  color-scheme: light dark;
  --color-bg: #FFFFFF;
  --color-surface: #F5F7FA;
  --color-surface-hover: #EDF2F7;
  --color-text: #1A202C;
  --color-text-muted: #4A5568;
  --color-border: #6B7280;
  --color-border-subtle: #CBD5E0;
  --color-primary: #4338CA;
  --color-primary-hover: #3730A3;
  --color-on-primary: #FFFFFF;
  --color-primary-soft: #E0E7FF;
  --color-on-primary-soft: #1A202C;
  --color-secondary: #0F766E;
  --color-secondary-hover: #115E59;
  --color-on-secondary: #FFFFFF;
  --color-success: #276749;
  --color-success-soft: #F0FFF4;
  --color-warning: #92400E;
  --color-warning-soft: #FFFBEB;
  --color-danger: #C53030;
  --color-danger-hover: #9B2C2C;
  --color-on-danger: #FFFFFF;
  --color-danger-soft: #FFF5F5;
  --color-focus: #3730A3;
  --color-disabled-bg: #E5E7EB;
  --color-disabled-text: #6B7280;
  --color-bg-body: var(--color-bg);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #111827;
    --color-surface: #1F2937;
    --color-surface-hover: #374151;
    --color-text: #F3F4F6;
    --color-text-muted: #B0B8C4;
    --color-border: #9CA3AF;
    --color-border-subtle: #374151;
    --color-primary: #A5B4FC;
    --color-primary-hover: #C7D2FE;
    --color-on-primary: #1E1B4B;
    --color-primary-soft: #312E81;
    --color-on-primary-soft: #F3F4F6;
    --color-secondary: #5EEAD4;
    --color-secondary-hover: #99F6E4;
    --color-on-secondary: #042F2E;
    --color-success: #4ADE80;
    --color-success-soft: #14532D;
    --color-warning: #FCD34D;
    --color-warning-soft: #2A2208;
    --color-danger: #F87171;
    --color-danger-hover: #FCA5A5;
    --color-on-danger: #111827;
    --color-danger-soft: #3B0D0D;
    --color-focus: #C7D2FE;
    --color-disabled-bg: #374151;
    --color-disabled-text: #9CA3AF;
  }
}

:root[data-theme="dark"] {
  --color-bg: #111827;
  --color-surface: #1F2937;
  --color-surface-hover: #374151;
  --color-text: #F3F4F6;
  --color-text-muted: #B0B8C4;
  --color-border: #9CA3AF;
  --color-border-subtle: #374151;
  --color-primary: #A5B4FC;
  --color-primary-hover: #C7D2FE;
  --color-on-primary: #1E1B4B;
  --color-primary-soft: #312E81;
  --color-on-primary-soft: #F3F4F6;
  --color-secondary: #5EEAD4;
  --color-secondary-hover: #99F6E4;
  --color-on-secondary: #042F2E;
  --color-success: #4ADE80;
  --color-success-soft: #14532D;
  --color-warning: #FCD34D;
  --color-warning-soft: #2A2208;
  --color-danger: #F87171;
  --color-danger-hover: #FCA5A5;
  --color-on-danger: #111827;
  --color-danger-soft: #3B0D0D;
  --color-focus: #C7D2FE;
  --color-disabled-bg: #374151;
  --color-disabled-text: #9CA3AF;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}
```

Note : `--color-bg-body` est un alias de confort ; il peut être supprimé à l'implémentation.

---

## 3. Contrastes WCAG 2.1 AA vérifiés

Calcul du ratio selon la formule WCAG (luminance relative). Seuils : 4,5 : 1 pour le texte normal, 3 : 1 pour le texte large (au moins 24 px, ou 18,66 px en gras) et les composants d'interface et graphiques (NFR-11). Le texte du chronomètre et les titres sont larges, mais les seuils de 4,5 : 1 sont appliqués partout où c'est possible.

### 3.1 Clair

| Couple (texte / fond) | Usage | Ratio | Seuil | Résultat |
|---|---|---|---|---|
| `#1A202C` / `#FFFFFF` | Texte principal | 16,32 | 4,5 | OK |
| `#1A202C` / `#F5F7FA` | Texte sur surface | 15,20 | 4,5 | OK |
| `#4A5568` / `#FFFFFF` | Texte secondaire | 7,53 | 4,5 | OK |
| `#4A5568` / `#F5F7FA` | Texte secondaire sur surface | 7,01 | 4,5 | OK |
| `#4338CA` / `#FFFFFF` | Lien, bouton secondaire (texte et contour) | 7,90 | 4,5 | OK |
| `#4338CA` / `#F5F7FA` | Titre accent sur surface | 7,36 | 4,5 | OK |
| `#FFFFFF` / `#4338CA` | Bouton primaire | 7,90 | 4,5 | OK |
| `#FFFFFF` / `#3730A3` | Bouton primaire, survol | 9,93 | 4,5 | OK |
| `#312E81` / `#E0E7FF` | Texte du bouton secondaire, survol | 9,27 | 4,5 | OK |
| `#1A202C` / `#E0E7FF` | Membre courant | 13,24 | 4,5 | OK |
| `#1A202C` / `#EDF2F7` | Bouton fantôme, survol | 14,49 | 4,5 | OK |
| `#FFFFFF` / `#0F766E` | Action secondaire pleine | 5,47 | 4,5 | OK |
| `#FFFFFF` / `#115E59` | Action secondaire pleine, survol | 7,58 | 4,5 | OK |
| `#FFFFFF` / `#C53030` | Bouton destructif | 5,47 | 4,5 | OK |
| `#FFFFFF` / `#9B2C2C` | Bouton destructif, survol | 7,53 | 4,5 | OK |
| `#276749` / `#FFFFFF` | Statut « Dans le temps » | 6,73 | 4,5 | OK |
| `#276749` / `#F0FFF4` | Statut succès sur fond succès | 6,51 | 4,5 | OK |
| `#C53030` / `#FFFFFF` | Dépassement, message d'erreur | 5,47 | 4,5 | OK |
| `#C53030` / `#FFF5F5` | Ligne de dépassement du Bilan, erreur de champ | 5,11 | 4,5 | OK |
| `#92400E` / `#FFFBEB` | Bandeau d'avertissement | 6,84 | 4,5 | OK |
| `#991B1B` / `#FEF2F2` | Bandeau d'erreur (variante) | 7,60 | 4,5 | OK |
| `#6B7280` / `#FFFFFF` | Placeholder, bordure de champ (composant) | 4,83 | 3 (composant) / 4,5 (texte) | OK |
| `#6B7280` / `#F5F7FA` | Placeholder sur surface | 4,50 | 4,5 | Limite : les champs sont toujours sur fond blanc (voir 6.3) |
| `#C53030` / `#FFFFFF` | Bordure de champ en erreur (composant) | 5,47 | 3 | OK |
| `#3730A3` / `#FFFFFF` | Anneau de focus | 9,93 | 3 | OK |
| `#3730A3` / `#F5F7FA` | Anneau de focus sur surface | 9,26 | 3 | OK |
| `#6B7280` / `#E5E7EB` | Texte désactivé | 3,90 | exempt (WCAG 1.4.3) | Non soumis, mais lisible |

### 3.2 Sombre

| Couple (texte / fond) | Usage | Ratio | Seuil | Résultat |
|---|---|---|---|---|
| `#F3F4F6` / `#111827` | Texte principal | 16,12 | 4,5 | OK |
| `#F3F4F6` / `#1F2937` | Texte sur surface | 13,34 | 4,5 | OK |
| `#B0B8C4` / `#111827` | Texte secondaire | 8,87 | 4,5 | OK |
| `#B0B8C4` / `#1F2937` | Texte secondaire sur surface | 7,34 | 4,5 | OK |
| `#B0B8C4` / `#374151` | Texte secondaire, survol | 5,15 | 4,5 | OK |
| `#A5B4FC` / `#111827` | Lien, titre accent | 8,90 | 4,5 | OK |
| `#A5B4FC` / `#1F2937` | Bouton secondaire sur surface | 7,36 | 4,5 | OK |
| `#1E1B4B` / `#A5B4FC` | Bouton primaire | 8,02 | 4,5 | OK |
| `#1E1B4B` / `#C7D2FE` | Bouton primaire, survol | 10,72 | 4,5 | OK |
| `#F3F4F6` / `#312E81` | Membre courant, bouton secondaire survol | 10,38 | 4,5 | OK |
| `#F3F4F6` / `#374151` | Bouton fantôme, survol | 9,37 | 4,5 | OK |
| `#042F2E` / `#5EEAD4` | Action secondaire pleine | 9,78 | 4,5 | OK |
| `#111827` / `#F87171` | Bouton destructif | 6,41 | 4,5 | OK |
| `#F87171` / `#111827` | Dépassement (texte) | 6,41 | 4,5 | OK |
| `#F87171` / `#1F2937` | Dépassement sur carte ou Bilan | 5,31 | 4,5 | OK |
| `#FCA5A5` / `#111827` | Message d'erreur de champ | 9,35 | 4,5 | OK |
| `#FCA5A5` / `#3B0D0D` | Bandeau d'erreur | 8,86 | 4,5 | OK |
| `#4ADE80` / `#111827` | Statut succès | 10,18 | 4,5 | OK |
| `#4ADE80` / `#1F2937` | Statut succès sur carte | 8,42 | 4,5 | OK |
| `#FCD34D` / `#111827` | Avertissement | 12,30 | 4,5 | OK |
| `#FCD34D` / `#2A2208` | Bandeau d'avertissement | 10,94 | 4,5 | OK |
| `#9CA3AF` / `#111827` | Bordure de champ (composant), placeholder | 6,99 | 3 / 4,5 | OK |
| `#9CA3AF` / `#1F2937` | Placeholder sur surface | 5,78 | 4,5 | OK |
| `#F87171` / `#111827` | Bordure de champ en erreur | 6,41 | 3 | OK |
| `#C7D2FE` / `#111827` | Anneau de focus | 11,89 | 3 | OK |
| `#C7D2FE` / `#1F2937` | Anneau de focus sur surface | 9,84 | 3 | OK |
| `#F3F4F6` / `#312E81` | Membre courant | 10,38 | 4,5 | OK |
| `#9CA3AF` / `#374151` | Texte désactivé | 4,06 | exempt | Non soumis, mais lisible |

### 3.3 Bilan des contrôles

- **Ratio minimal relevé sur les composants et les textes :** 4,83 : 1 (bordure de champ, clair ; seuil 3 : 1).
- **Ratio minimal relevé sur le texte (seuil 4,5 : 1) :** 5,11 : 1 (message d'erreur et ligne de dépassement, clair).
- **Seul écart au seuil 4,5 : 1 :** placeholder `#6B7280` sur `#F5F7FA` (4,50 : 1, arrondi). Ce cas n'existe pas dans le design : les champs sont toujours sur fond `--color-bg`. Règle imposée : aucun champ n'est posé sur une surface.
- Les textes désactivés ne sont pas soumis au seuil (WCAG 1.4.3). Ils restent au-dessus de 3,9 : 1 et sont accompagnés d'un état désactivé perceptible (voir 5.3).
- Les couleurs de statut et de dépassement ont toujours un libellé et une icône (NFR-14).

---

## 4. Typographie

### 4.1 Police

Police système, sans téléchargement :

```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono-digits: var(--font-sans); /* chiffres tabulaires, voir 4.3 */
```

Google Fonts est écarté : NFR-8 interdit tout service tiers pour les polices, et NFR-2 impose le fonctionnement hors ligne.

### 4.2 Échelle

| Token | Taille (rem / px) | Interligne | Graisse | Usage |
|---|---|---|---|---|
| `--text-xs` | 0,75 / 12 | 1,4 | 400 | Légendes, horodatage, aide très secondaire |
| `--text-sm` | 0,875 / 14 | 1,45 | 600 | Libellés de champ, messages d'erreur, statuts |
| `--text-base` | 1 / 16 | 1,5 | 400 et 600 | Corps de texte, saisie (taille minimale des champs, évite le zoom iOS) |
| `--text-lg` | 1,25 / 20 | 1,4 | 600 | Prénom du Membre dans la liste, titre de carte |
| `--text-xl` | 1,5 / 24 | 1,3 | 700 | Titres de section (h2) |
| `--text-2xl` | 2 / 32 | 1,2 | 700 | Titre d'écran (h1) |
| `--text-timer` | 4 / 64 (bureau), 3 / 48 (moins de 480 px) | 1 | 700 | Chronomètre du Membre courant, lisible à distance |
| `--text-timer-sm` | 2 / 32 | 1 | 700 | Chronomètre dans une ligne de liste (rare) |

Règles :
- Pas de texte en dessous de 12 px.
- Les textes sont en français ; `lang="fr"` est sur la page (NFR-17).
- La longueur de ligne est limitée à 65 caractères pour les paragraphes (aides, messages longs).

### 4.3 Chiffres

- `font-variant-numeric: tabular-nums` sur tous les chiffres animés (chronomètre, Temps alloué, Total) pour que les chiffres ne bougent pas à chaque seconde.
- Format « mm:ss », « h:mm:ss » au-delà de 59 minutes (FR-14). Dépassement : « +mm:ss ».

---

## 5. Espacements, rayons, ombres, mouvement

### 5.1 Espacements (base 4 px)

| Token | Valeur | Usage |
|---|---|---|
| `--space-1` | 4 px | Écart icône / texte |
| `--space-2` | 8 px | Écart dans un groupe serré |
| `--space-3` | 12 px | Padding interne d'une ligne de liste |
| `--space-4` | 16 px | Marge latérale mobile (NFR-18), padding de carte |
| `--space-5` | 24 px | Marge latérale bureau, écart entre blocs |
| `--space-6` | 32 px | Écart entre sections |
| `--space-7` | 48 px | Espace autour du chronomètre |
| `--space-8` | 64 px | Espace de tête d'écran (bureau) |

Mise en page : colonne unique, largeur maximale de 720 px pour Session et Bilan, 560 px pour les formulaires. Marge latérale de 16 px sous 600 px, 24 px au-delà. Aucun défilement horizontal entre 320 px et 1920 px (NFR-18).

### 5.2 Tailles de cible et de focus

| Token | Valeur | Usage |
|---|---|---|
| `--target-min` | 44 px | Hauteur et largeur minimales de tout bouton, case et zone cliquable (NFR-15) |
| `--focus-width` | 3 px | Épaisseur de l'anneau de focus |
| `--focus-offset` | 2 px | Écart entre l'élément et l'anneau |

### 5.3 Rayons et ombres

| Token | Valeur clair | Valeur sombre | Usage |
|---|---|---|---|
| `--radius-sm` | 4 px | 4 px | Badges, cases |
| `--radius-md` | 8 px | 8 px | Boutons, champs |
| `--radius-lg` | 12 px | 12 px | Cartes, panneaux, bilan |
| `--radius-full` | 9999 px | 9999 px | Pastilles de statut |
| `--shadow-sm` | `0 1px 2px rgba(17, 24, 39, 0.08)` | `0 1px 2px rgba(0, 0, 0, 0.5)` | Carte membre |
| `--shadow-md` | `0 4px 12px rgba(17, 24, 39, 0.12)` | `0 4px 12px rgba(0, 0, 0, 0.6)` | Boîte de confirmation (dialogue) |

Les ombres sont décoratives : aucune information n'y est portée.

### 5.4 Mouvement

- Durée des transitions : 150 ms pour la couleur et le fond des boutons ; aucune animation sur le chronomètre (il change chaque seconde sans effet).
- `@media (prefers-reduced-motion: reduce)` : toutes les transitions passent à 0 ms (NFR-16).
- Le clignotement d'alerte est interdit (risque pour l'attention et pour la lisibilité). Le passage en dépassement est un changement de couleur, d'icône et de libellé, effectué une seule fois.

---

## 6. Règles transversales

### 6.1 Focus

- Tout élément interactif a un anneau de focus visible : `outline: var(--focus-width) solid var(--color-focus); outline-offset: var(--focus-offset);`.
- Le focus n'est jamais retiré par `outline: none` sans remplacement.
- Ratio de l'anneau : 9,93 : 1 sur blanc (clair), 11,89 : 1 sur `#111827` (sombre).

### 6.2 Dépassement et messages

- Une seule forme de dépassement dans l'interface : icône ⚠ (SVG), libellé « Temps dépassé » ou « Dépassement de mm:ss », couleur `--color-danger`.
- Les messages d'alerte utilisent `role="alert"` ; les messages d'état utilisent `role="status"`.

### 6.3 Champs

- Les champs sont toujours posés sur `--color-bg`, jamais sur `--color-surface`, pour que le placeholder et la bordure gardent un contraste suffisant.

### 6.4 Icônes

- Icônes en SVG en ligne, `aria-hidden="true"` quand un libellé texte existe à côté.
- Taille 20 px dans les boutons et les libellés, 24 px dans les bandeaux, 32 px sur le chronomètre (indicateur de pause ou de dépassement).
- Jeu d'icônes retenu : ⏸ pause (deux barres), ▶ reprise (triangle), ⚠ dépassement (triangle avec point d'exclamation), ✓ succès (coche), ✕ fermeture (croix), cloche (SVG) pour le son. Aucun emoji dans l'interface : les symboles ci-dessus sont des SVG en ligne, pas des caractères.

---

## 7. États des composants

Référence : les états sont décrits pour le mode clair ; le mode sombre utilise les tokens de la section 2.

| Composant | Défaut | Survol | Focus | Désactivé | Erreur |
|---|---|---|---|---|---|
| Bouton primaire | Fond `--color-primary`, texte `--color-on-primary` | Fond `--color-primary-hover` | Anneau 3 px `--color-focus` | Fond `--color-disabled-bg`, texte `--color-disabled-text`, curseur non autorisé | n/a |
| Bouton secondaire (contour) | Contour 2 px `--color-primary`, texte `--color-primary`, fond transparent | Fond `--color-primary-soft`, texte `#312E81` (clair) / `--color-text` (sombre) | Anneau 3 px | Contour et texte `--color-disabled-text` | n/a |
| Bouton fantôme (texte) | Texte `--color-primary` | Fond `--color-surface-hover` | Anneau 3 px | Texte `--color-disabled-text` | n/a |
| Bouton destructif | Fond `--color-danger`, texte `--color-on-danger` | Fond `--color-danger-hover` | Anneau 3 px | Fond `--color-disabled-bg` | n/a |
| Bouton « Suivant » (Session) | Comme bouton primaire, taille 64 px de haut | Comme primaire | Anneau 3 px, déjà focalisé à l'affichage (FR-10) | Non utilisé (toujours actif en Session) | n/a |
| Champ de texte | Fond `--color-bg`, bordure 1 px `--color-border`, texte `--color-text`, hauteur 44 px | Bordure `--color-text-muted` | Bordure 2 px `--color-primary` + anneau 3 px | Fond `--color-disabled-bg`, texte `--color-disabled-text` | Bordure 2 px `--color-danger`, message en dessous (6.5) |
| Case à cocher | Contour 2 px `--color-border` | Contour `--color-text-muted` | Anneau 3 px | Contour `--color-disabled-text` | n/a |
| Lien / bouton de liste (choisir un Membre) | Texte `--color-primary`, souligné | Fond `--color-surface-hover` | Anneau 3 px | n/a | n/a |

### 7.1 Règles de focus à l'écran

- Au passage à l'écran Session, le focus va sur « Suivant » (FR-10).
- À l'ouverture d'un dialogue (confirmation), le focus va sur le bouton de sortie non destructif (« Continuer », « Annuler »). Le focus revient à l'élément qui a ouvert le dialogue à la fermeture.

---

## 8. Composants

### 8.1 Bouton

- Hauteur minimale 44 px, padding horizontal 20 px, rayon `--radius-md`, texte `--text-base` graisse 600.
- Une icône à gauche, 20 px, est optionnelle.
- Trois niveaux seulement : primaire (plein), secondaire (contour), fantôme (texte). Le destructif est une variante du plein.
- Un écran contient au plus un bouton primaire visible (ux.md).

### 8.2 Champ de formulaire avec message d'erreur

Anatomie, de haut en bas :
1. Libellé visible, `--text-sm` graisse 600, couleur `--color-text`. Obligatoire : le libellé est toujours visible (pas seulement un placeholder).
2. Champ : hauteur 44 px, rayon `--radius-md`, fond `--color-bg`, bordure 1 px `--color-border`.
3. Aide (optionnelle) : `--text-sm`, `--color-text-muted`, par exemple « 1 à 50 caractères ».
4. Message d'erreur : `--text-sm` graisse 600, `--color-danger`, précédé de l'icône ⚠ (16 px), lié au champ par `aria-describedby`.

Exemple d'état erreur (structure) :

```html
<label for="team-name">Nom de l'équipe</label>
<input id="team-name" type="text" aria-invalid="true" aria-describedby="team-name-error" />
<p id="team-name-error" class="field-error">
  <svg aria-hidden="true">…</svg>
  Donnez un nom à votre équipe.
</p>
```

Messages : les textes exacts sont ceux de la section 6 du PRD. Aucun message n'est ajouté par cette charte.

### 8.3 Carte Membre

Contenu d'une carte (ligne de la liste d'équipe, de préparation, ou de Session) :
- Position dans la liste (« 1 », « 2 »…), `--text-xs`, `--color-text-muted`.
- Prénom, `--text-lg`, graisse 600.
- Temps alloué au format « mm:ss », `--text-sm`, tabular-nums.
- Temps parlé (Session et Bilan), même format.
- Statut textuel (Session) : « Membre courant », « Temps dépassé », « +mm:ss ».

États :
- **Défaut :** fond `--color-surface`, ombre `--shadow-sm`, rayon `--radius-lg`, padding `--space-3` `--space-4`.
- **Membre courant :** fond `--color-primary-soft`, texte `--color-on-primary-soft`, barre verticale gauche de 6 px en `--color-primary`, libellé « Membre courant ». Attribut `aria-current="true"`.
- **Survol (liste cliquable pour choisir un Membre) :** fond `--color-surface-hover`.
- **Focus :** anneau 3 px.
- **Dépassement :** fond `--color-danger-soft`, icône ⚠, texte « Temps dépassé », temps en `--color-danger`.
- **Désactivé (liste en Session terminée) :** non interactive, texte normal (aucune désactivation de l'information).

Boutons d'ordre (FR-4) : deux boutons « Monter » et « Descendre » de 44 px, icône flèche, libellé accessible « Monter [Prénom] » et « Descendre [Prénom] ».

### 8.4 Chronomètre

- Chiffres `--text-timer`, graisse 700, tabular-nums, centré.
- Au-dessus : le prénom du Membre courant (`--text-2xl`).
- Au-dessous : le libellé d'état, `--text-base` graisse 600 :
  - **Temps restant :** « Temps restant », `--color-text-muted`.
  - **Dépassement :** icône ⚠, « Temps dépassé », puis « +mm:ss » en `--color-danger`.
  - **Pause :** icône ‖ et libellé « En pause », chiffres inchangés (la pause ne doit pas être confondue avec un dépassement).
- Le chronomètre n'est pas annoncé chaque seconde (NFR-13). Il est lu à la demande par la zone `aria-live` dédiée à l'état.

### 8.5 Bilan

Présentation : tableau sur bureau, liste de cartes en dessous de 600 px (même contenu, même ordre).

Colonnes : Prénom | Temps parlé | Temps alloué | Écart | Statut.

- En-tête : fond `--color-surface`, texte `--color-text-muted`, graisse 600.
- Ligne normale : statut « Dans le temps » en `--color-success`, précédé de ✓.
- Ligne en dépassement : fond `--color-danger-soft`, statut « Dépassement de mm:ss » en `--color-danger`, précédé de ⚠. Le dépassement n'est jamais seulement une couleur (FR-20).
- Ligne de total : graisse 700, bordure supérieure 2 px `--color-border`. Affiche la somme du Temps parlé, la somme du Temps alloué, la Durée de cérémonie prévue et la durée réelle.
- Bloc d'en-tête du Bilan : Nom d'équipe, date (jj/mm/aaaa, NFR-20).

### 8.6 Bandeaux et messages d'état

| Variante | Fond | Texte | Bordure gauche | Icône | Rôle |
|---|---|---|---|---|---|
| Information (session restaurée) | `#EEF2FF` (clair) / `--color-primary-soft` (sombre) | `#312E81` (clair, 10,22 : 1) / `--color-text` (sombre) | 4 px `--color-primary` | ▶ ou ℹ | `role="status"` |
| Avertissement (stockage refusé, FR-25) | `--color-warning-soft` | `--color-warning` | 4 px `--color-warning` | ⚠ | `role="status"`, fermable |
| Erreur (import refusé, illisible) | `--color-danger-soft` | `--color-danger` (clair : 5,11 : 1) | 4 px `--color-danger` | ⚠ | `role="alert"` |
| Succès (copie réussie) | `--color-success-soft` | `--color-success` | 4 px `--color-success` | ✓ | `role="status"` |

Dans le bandeau d'information, le texte est en `#312E81` sur `#EEF2FF` (10,22 : 1) pour le mode clair (valeur calculée ; ce couple n'est pas dans le tableau de la section 3).

### 8.7 Indicateur de total (Répartition manuelle, FR-9)

- Ligne fixe sous la liste : « Total alloué : MM:SS / MM:SS ».
- Valide : texte `--color-success`, icône ✓, libellé « Total alloué : 15:00 / 15:00 ».
- Invalide : texte `--color-danger`, icône ⚠, libellé « Il manque X s pour atteindre la durée » ou « Il y a X s de trop ». Le libellé s'annonce en `role="status"` quand il change.

### 8.8 Dialogue de confirmation

- Surface `--color-surface`, ombre `--shadow-md`, rayon `--radius-lg`, largeur 480 px maximum, marge 16 px.
- Titre `--text-xl` graisse 700, texte `--text-base`, deux boutons à droite (sur mobile, pleine largeur, empilés). Le bouton de sortie non destructif est à gauche sur bureau.
- Fond derrière : `rgba(17, 24, 39, 0.6)` en clair, `rgba(0, 0, 0, 0.7)` en sombre.
- **Exception en Session :** FR-19 interdit toute boîte modale pendant une Intervention, alors que FR-15 demande une confirmation pour « Terminer la session ». La confirmation de fin de Session n'est donc pas un dialogue modal : elle s'affiche en bandeau inline sous la barre d'actions, sans fond masquant, et le chronomètre reste visible. Voir EXPERIENCE.md, écart E-3.

### 8.9 Bouton « Son d'alerte »

- Bouton fantôme avec icône cloche SVG et libellé « Son d'alerte : activé » ou « Son d'alerte : désactivé » (libellé complet, pas seulement l'icône).
- `aria-pressed` n'est pas utilisé ; le libellé change avec l'état.

---

## 9. Logo et icônes

Fichiers :
- [`public/icons/logo.svg`](../../public/icons/logo.svg) : icône et nom « Scrum Speaking Timer », 480 × 96.
- [`public/favicon.svg`](../../public/favicon.svg) : icône seule, 32 × 32.

Concept : un chronomètre (anneau, couronne, aiguille) surmonté d'une bulle de parole. Le chronomètre rappelle la mesure du temps, la bulle rappelle la parole.

Couleurs : `#4338CA` (clair) et `#A5B4FC` (sombre), via `prefers-color-scheme` dans le fichier SVG. Les points de la bulle sont découpés par un masque, pour que le logo reste lisible en monochrome.

Lisibilité :
- Favicon rendu à 16 × 16 px : le chronomètre et la bulle restent identifiables (vérifié par rastérisation).
- Logo monochrome : une seule couleur, sans dégradé, sans trait fin inférieur à 2,5 unités de la grille 96.
- Zone de protection : un espace égal à la hauteur de la couronne autour du logo.

Usage :
- Ne pas étirer le logo, ne pas changer l'ordre des éléments.
- Sur fond coloré, utiliser la variante monochrome blanche (`fill` ou `stroke` à `#FFFFFF`).
- Les icônes de l'application (`public/icons/icon-*.png`) restent à régénérer à partir de ce logo (voir section 10).

Manifeste : le fichier `public/manifest.webmanifest` référence encore les PNG existants. Les PNG ne sont pas régénérés par cette charte ; l'architecte ou le développeur décide de les régénérer depuis le SVG (NFR-1 impose des icônes 192 et 512 px).

---

## 10. Points ouverts pour l'architecte et les développeurs

1. **Icônes PWA :** générer les PNG 72 à 512 px et une version « maskable » à partir de `logo.svg` (zone de sécurité de 80 %). Non fait dans cette livraison.
2. **Couleur de thème :** la couleur `theme_color` du manifeste n'est pas encore définie. Proposition : `#4338CA` (clair). `background_color` : `#FFFFFF`.
3. **Mode sombre du manifeste :** non géré par le manifeste ; le navigateur ne propose pas de variante.
4. **Icônes ⚠, ✓, ▶, ‖ :** à fournir en SVG en ligne dans l'application (pas de police d'icônes, NFR-8).
