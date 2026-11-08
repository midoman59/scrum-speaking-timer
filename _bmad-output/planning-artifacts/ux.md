# Parcours UX/UI : Scrum Speaking Timer

**Auteur :** Agent UX/UI (BMAD `bmad-agent-ux-designer`)
**Réf. :** [brief](./product-brief.md), [architecture](./architecture.md)

## Parcours principal (Scrum Master)

1. **Équipe** : saisir le nom de l'équipe, la durée (15 min par défaut) et les prénoms. Le temps par personne s'affiche en direct.
2. **Session** : appuyer sur « Démarrer ». Le prénom et le chronomètre du membre en cours sont au centre de l'écran.
3. **Suivant** : passer la parole. Le chronomètre repart à la durée allouée restante.
4. **Pause / Reprendre** : suspendre le temps d'une intervention (discussion hors parole).
5. **Bilan** : tableau « parlé / alloué » par membre, en rouge si dépassement, et bouton « Copier ».

## Règles d'interface

- **Une action principale par écran** : le bouton « Suivant » est le seul bouton plein pendant une session.
- **Dépassement visible sans être alarmant** : chiffres en rouge et message texte « Temps dépassé », pas seulement une couleur.
- **Lisible à distance** : chronomètre en grand format (4 rem).
- **Mobile d'abord** : colonne unique, marge de 16 px, aucun défilement horizontal.
- **Clavier** : tous les boutons sont atteignables à la tabulation ; les champs ont un libellé.

## Accessibilité

- Contraste minimum AA sur les boutons et le texte.
- Zone `aria-live` sur le chronomètre pour les lecteurs d'écran.
- L'alerte de dépassement combine couleur, texte et rôle `alert`.

## Hors périmètre UX V1

Thème personnalisé, animations, sons personnalisables.
