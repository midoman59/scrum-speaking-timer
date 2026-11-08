# EXPERIENCE : Scrum Speaking Timer

**Auteure :** Sally, UX Designer (BMAD `bmad-agent-ux-designer`)
**Réf. :** [PRD](./prd.md) (sections 2.3, 4, 6, 7 ; UJ-1 à UJ-4), [Charte graphique](./DESIGN.md), [Parcours UX/UI](./ux.md)
**Statut :** Brouillon v1, à valider avec le client avant l'epic E2
**Langue :** Français

---

## 0. Conventions de lecture

- Les textes entre guillemets français sont les **messages exacts du PRD**, sans modification.
- Les textes marqués **[NOUVEAU]** n'existent pas dans le PRD. Ils sont proposés ici pour combler un manque ; chacun est listé dans la section 1.
- Les identifiants d'écran (E-1 à E-4), de dialogue (D-1 à D-6) et de bandeau (B-1 à B-3) servent de référence aux développeurs et aux testeurs.
- Les identifiants d'écart (E-1 à E-15, section 1) renvoient aux points où la proposition diffère du PRD ou le complète.
- Le clavier suit l'ordre de lecture ; les champs ont un libellé visible ; les erreurs sont liées par `aria-describedby` et la première erreur reçoit le focus à l'enregistrement (PRD, section 6).

---

## 1. Écarts entre le PRD et la proposition

Cette section est à lire en premier. Chaque écart indique ce que dit le PRD, ce que propose cette charte, et ce qu'il faut décider.

| Réf. | Source PRD | Problème | Proposition | Décision à prendre |
|---|---|---|---|---|
| **E-1** | UJ-2 (section 2.3) | Arithmétique fausse : 15 min pour 6 Membres donnent 2 min 30 s (150 s) par personne, pas 1 min 30 s. | Exemple corrigé : Thomas à 4 min 00 s (240 s), les 5 autres à 2 min 12 s (132 s). Somme : 240 + 5 × 132 = 900 s. | Corriger UJ-2 dans le PRD. |
| **E-2** | FR-1 (« Enregistrer l'équipe ») contre FR-24 (« sans bouton Sauvegarder ») | Deux règles de sauvegarde se contredisent. | Le bouton « Enregistrer l'équipe » n'existe qu'à la création ou au remplacement (E-1). Les modifications faites ensuite sur E-2 (répartition, ordre, Membres) sont enregistrées immédiatement, sans bouton. | Confirmer ce comportement. |
| **E-3** | FR-15 (confirmation de « Terminer la session ») contre FR-19 (aucune boîte modale pendant une Intervention) | La confirmation de fin peut survenir pendant une Intervention, donc pendant qu'un dialogue modal serait interdit. | La confirmation est un bandeau inline sous la barre d'actions de E-3 : même texte, mêmes boutons « Terminer » et « Continuer », sans fond masquant. Le chronomètre reste visible. | Confirmer l'exception à FR-19. |
| **E-4** | FR-6 (écran de préparation à chaque visite) contre FR-16 (Session En cours restaurée) | Quelle est la première page à la réouverture si une Session est En cours ? | Si une Session est En cours, l'application ouvre E-3 (Session), avec le bandeau B-3. Sinon elle ouvre E-2. | Confirmer. |
| **E-5** | FR-2 et FR-9 (Répartition manuelle) | Le PRD ne dit pas quel Temps alloué reçoit un Membre ajouté en Répartition manuelle. La somme doit rester exacte. | Le nouveau Membre a un champ Temps alloué vide, visible au retour sur E-2. L'indicateur de total (FR-9) affiche « Il manque X s pour atteindre la durée », et « Enregistrer » reste désactivé. Aucun nouveau message n'est créé : on réutilise ceux de la section 6. | Confirmer. |
| **E-6** | FR-2 et FR-7 (temps moyen de 30 s minimum) | Le PRD bloque l'enregistrement pour un temps moyen inférieur à 30 s, mais ne dit pas ce qui se passe quand on ajoute un Membre. | L'ajout reste possible. La règle s'applique au moment d'enregistrer : « Enregistrer l'équipe » est bloqué avec le message FR-7 et la durée affichée reste inchangée. | Confirmer. |
| **E-7** | Persona Inès (section 2.1) : « le temps restant de la session » | La demande de l'observatrice n'est couverte par aucune FR. Le PRD ne prévoit qu'un chronomètre par Membre. | Ajout d'un chronomètre de Session discret, dans l'en-tête de E-3 : « Session : 07:12 / 15:00 ». Ce compteur ne sert ni à mesurer le temps de parole ni à alerter. | Ajouter une FR ou refuser. |
| **E-8** | FR-19 (le message d'alerte « peut être fermé ») | Aucun libellé de bouton de fermeture n'est donné. | Bouton « Fermer le message » [NOUVEAU], icône ✕. Il ne ferme que le message ; le libellé « Temps dépassé » du minuteur reste. | Valider le libellé. |
| **E-9** | FR-12 (« en cliquant sur son nom dans la liste ») et 7.1 (action « Choisir un membre ») | Un nom cliquable n'est pas accessible au clavier. Deux actions désignent la même chose. | Chaque ligne de la liste d'ordre est un bouton nommé « Donner la parole à [Prénom] » [NOUVEAU]. La liste remplace l'action « Choisir un membre » : son titre de section est « Choisir un membre ». | Valider. |
| **E-10** | FR-17 (élément `role="alert"`) et NFR-13 (annonce `aria-live` assertive) | Risque d'annoncer deux fois le même dépassement. NFR-13 demande une seule annonce par événement. | Une seule annonce : le message `role="alert"` de E-3. Son texte lu est « [Prénom] : Temps dépassé » [NOUVEAU], ce qui donne le nom du Membre que le texte visible n'indique pas. Pas de zone `aria-live` assertive séparée. | Valider. |
| **E-11** | FR-21 (contenu du Bilan copié) | Le PRD liste les données à copier, sans format exact. | Format proposé à la section 4.5, en texte brut, sans Markdown. | Valider le format. |
| **E-12** | Export, import, réinitialisation et bandeau de restauration : emplacement non précisé | Le PRD ne dit pas où ces actions se trouvent. | Export, import et réinitialisation sont dans le pied de E-2, séparés du bouton principal (FR-28). Le bandeau B-3 est en haut de E-3. | Valider. |
| **E-13** | D-3 (« Revenir à la répartition égale ») et D-5 (réinitialisation) | Le PRD donne le texte du message mais pas les libellés des boutons. | D-3 : boutons « Revenir à l'égalité » et « Annuler » [NOUVEAU]. D-5 : boutons « Effacer » et « Annuler » [NOUVEAU]. | Valider. |
| **E-14** | 6.5 (saisie « en secondes ou en mm:ss ») contre FR-9 (« secondes entières ») | Deux formats de saisie annoncés. | La saisie accepte les deux formats et les convertit en secondes, comme 6.5 le demande. | Confirmer 6.5. |
| **E-15** | FR-17 (« un nouveau dépassement est signalé à nouveau lors de la nouvelle Intervention ») contre H-7 (temps alloué total de Session) et H-14 (« une fois par dépassement et par Intervention ») | Avec un total de Session, un Membre déjà en dépassement ne peut plus « franchir » son Temps alloué. La règle de re-alerte est ambiguë. | Une alerte par Membre et par Session, au moment du franchissement. Une reprise de parole après dépassement affiche « Temps dépassé » et « +mm:ss » sans alerte ni son (dernière puce de FR-17). | Trancher H-14 : alerte par Intervention ou par Session. |

Autres points, sans écart de fond :
- Le PRD emploie « Dépassement de mm:ss » dans le Bilan et « +mm:ss » sur le minuteur. Ce n'est pas une incohérence : les deux formes sont gardées, chacune dans son contexte.
- Le raccourci clavier pour « Suivant » (Q5) n'est **pas** implémenté en V1 dans cette proposition, en attente de la décision du client. « Suivant » reste activable par Entrée ou Espace quand il a le focus (voir section 5.2).

---

## 2. Inventaire des écrans, dialogues et bandeaux

| Réf. | Nom | Accès | Page de référence |
|---|---|---|---|
| E-1 | Équipe (création, modification) | Première ouverture ; « Modifier l'équipe » depuis E-2 | PRD 7.1 étapes 1-2 |
| E-2 | Préparation de Session | Après « Enregistrer l'équipe » ; à chaque visite si pas de Session En cours | PRD 7.1 étape 3 |
| E-3 | Session | « Démarrer la session » ; réouverture pendant une Session En cours (FR-16, écart E-4) | PRD 7.1 étape 4 |
| E-4 | Bilan | Fin de Session confirmée ; « Voir le dernier bilan » depuis E-2 | PRD 7.1 étape 6 |
| D-1 | Remplacer l'équipe existante | Création si une Équipe existe (FR-1) | Dialogue modal |
| D-2 | Supprimer un Membre | Action « Supprimer » d'un Membre (FR-3) | Dialogue modal |
| D-3 | Revenir à la répartition égale | Bouton dans E-2 en Répartition manuelle (FR-9) | Dialogue modal |
| D-4 | Remplacer l'équipe par le fichier | Import d'un fichier valide (FR-27) | Dialogue modal |
| D-5 | Réinitialisation | Bouton dans le pied de E-2 (FR-28) | Dialogue modal |
| D-6 | Terminer la session | Bouton « Terminer la session » de E-3 (FR-15) | Bandeau inline (E-3) |
| B-1 | Stockage refusé | Bandeau global (FR-25), fermable | Bandeau |
| B-2 | Données illisibles | Bandeau global au démarrage (FR-25) | Bandeau |
| B-3 | Session restaurée | Bandeau haut de E-3 (FR-16), fermable | Bandeau |

Les dialogues D-1 à D-5 sont modaux : ils ne s'ouvrent jamais pendant une Intervention, puisque E-1, E-2 et les actions de reprise hors Session n'y sont pas accessibles. D-6 est inline (E-3).

---

## 3. Écrans

### 3.1 E-1 : Équipe (création et modification)

**Objectif :** saisir ou corriger le Nom d'équipe, la Durée de cérémonie et la liste des Membres, en une page.

**Titre (h1) :** « Créer votre équipe » (création) ou « Modifier l'équipe » (modification) [NOUVEAU : titres].

**Éléments, dans l'ordre de tabulation :**
1. Champ « Nom d'équipe » (texte, obligatoire, 50 caractères).
2. Champ « Durée de cérémonie » (nombre entier, en minutes, valeur 15).
3. Indicateur « Temps moyen par membre : mm:ss », mis à jour en direct (FR-7).
4. Titre de section « Membres (N sur 15) » [NOUVEAU : compteur].
5. Liste ordonnée des Membres. Chaque ligne : Prénom, boutons « Monter », « Descendre », « Renommer », « Supprimer ».
6. Champ « Ajouter un membre » (Prénom) et bouton « Ajouter ».
7. Bouton primaire « Enregistrer l'équipe ».
8. Lien « Annuler » (modification uniquement) : retour à E-2 sans enregistrer.

**Actions :**
- Saisir ; l'indicateur de temps moyen se met à jour à chaque frappe.
- « Ajouter » ou Entrée dans le champ d'ajout (FR-2).
- « Monter » et « Descendre » changent l'ordre (FR-4). Sur le premier Membre, « Monter » est désactivé ; sur le dernier, « Descendre » est désactivé. Le désactivé est indiqué par l'attribut `disabled`, pas seulement par la couleur.
- « Supprimer » ouvre D-2 (si l'Équipe a exactement 2 Membres, le message « Une équipe doit compter au moins 2 membres. » est affiché au lieu d'ouvrir D-2, FR-3).
- « Enregistrer l'équipe » enregistre et ouvre E-2. En création sur un appareil avec une Équipe existante, il ouvre d'abord D-1.

**Champ d'ajout désactivé au 15e Membre :** le champ et « Ajouter » sont désactivés, et le message « Une équipe ne peut pas dépasser 15 membres. » est affiché sous la liste (PRD 6.2).

**États :**

| État | Affichage |
|---|---|
| **Vide (première ouverture)** | Champs vides. Durée à 15. Liste vide avec le texte : « Ajoutez au moins 2 membres pour lancer une session. » (PRD 6.2, affiché comme état). « Enregistrer l'équipe » désactivé. Aucun message d'erreur. |
| **Chargement** | Aucun état de chargement n'est affiché : la lecture de la Mémoire est synchrone. Si elle dépasse 1 seconde (NFR-5), l'écran reste vide sans message. |
| **Erreur de champ** | Message sous le champ, lié par `aria-describedby`, bordure `--color-danger`. Textes de la section 6 du PRD (voir 3.1.1). À l'enregistrement, le focus va sur le premier champ en erreur. |
| **Erreur de stockage** | Bandeau B-1 en haut de la page. La saisie continue en mémoire vive. |
| **Succès** | Passage à E-2, focus sur le titre (h1) de E-2. Pas de message supplémentaire. |
| **Modification, Session En cours** | Impossible : E-1 n'est pas accessible pendant une Session En cours. Le lien « Modifier l'équipe » de E-2 est absent, et les champs de E-3 ne sont pas éditables. Le texte « Session en cours : modification impossible. » s'affiche si l'on tente d'y accéder (FR-5). |

#### 3.1.1 Messages de E-1 (textes exacts du PRD)

| Champ | Cas | Message |
|---|---|---|
| Nom d'équipe | vide | « Donnez un nom à votre équipe. » |
| Nom d'équipe | plus de 50 caractères | « Le nom ne doit pas dépasser 50 caractères. » |
| Nom d'équipe | caractère refusé | « Caractères non autorisés dans le nom de l'équipe. » |
| Durée | vide | « Indiquez la durée de la cérémonie. » |
| Durée | décimale (ex. 7,5) | « Saisissez un nombre entier de minutes. » |
| Durée | inférieure à 1 | « La durée minimale est de 1 minute. » |
| Durée | supérieure à 120 | « La durée maximale est de 120 minutes. » |
| Durée et Membres | temps moyen inférieur à 30 s | « Avec N membres, chacun aurait moins de 30 secondes. Augmentez la durée ou retirez des membres. » |
| Prénom | vide | « Saisissez un prénom. » |
| Prénom | plus de 30 caractères | « Le prénom ne doit pas dépasser 30 caractères. » |
| Prénom | caractère refusé | « Un prénom ne peut contenir que des lettres, espaces, traits d'union et apostrophes. » |
| Prénom | doublon | « Ce prénom existe déjà dans l'équipe. » |
| Liste | moins de 2 Membres | « Ajoutez au moins 2 membres pour lancer une session. » |
| Liste | 15 Membres atteints | « Une équipe ne peut pas dépasser 15 membres. » |

Note : une erreur de Durée et une erreur de Membres peuvent être affichées en même temps ; la règle du temps moyen (30 s) n'est évaluée que si la Durée et le nombre de Membres sont valides.

#### 3.1.2 Dialogues ouverts depuis E-1

**D-1 : Remplacer l'équipe existante** (création alors qu'une Équipe existe)
- Texte : « Remplacer l'équipe existante ? Cette action supprime l'équipe actuelle et son réglage. »
- Boutons : « Remplacer » et « Annuler ».
- Focus à l'ouverture : « Annuler » (action non destructive).
- « Annuler » ferme sans changement. Escape équivaut à « Annuler ».

**D-2 : Supprimer un Membre**
- Texte : « Supprimer [Prénom] de l'équipe ? »
- Boutons : « Supprimer » et « Annuler ». Focus sur « Annuler ».

### 3.2 E-2 : Préparation de Session

**Objectif :** vérifier l'équipe, choisir la répartition, ajuster l'ordre, lancer la Session.

**Titre (h1) :** « Préparer la session ».

**Éléments, dans l'ordre de tabulation :**
1. Bandeau B-1 ou B-2, si applicable.
2. Bloc Équipe : Nom d'équipe (h2), Durée de cérémonie « 15 min », lien « Modifier l'équipe » (absent si une Session est En cours).
3. Groupe « Répartition » (radio) : « Répartition égale » (par défaut) et « Répartition manuelle » [NOUVEAU : libellés des options, cohérents avec le glossaire PRD].
4. Liste ordonnée des Membres. Chaque ligne : position, Prénom, champ « Temps alloué » (saisie en Répartition manuelle, affichage en Répartition égale), boutons « Monter » et « Descendre ».
5. Indicateur « Total alloué : MM:SS / MM:SS » (FR-9), sous la liste.
6. Lien « Revenir à la répartition égale » (visible en Répartition manuelle, ouvre D-3).
7. Bouton primaire « Démarrer la session ».
8. Lien « Voir le dernier bilan » (si un Bilan existe, FR-23).
9. Pied de page, séparé du bouton principal (FR-28) : « Exporter l'équipe », « Importer une équipe », « Réinitialiser les données ».

**Actions :**
- Choisir la répartition. Passer en manuelle conserve les valeurs égales calculées au moment du changement (FR-9) ; aucun dialogue.
- Modifier un Temps alloué (manuel) : la somme est recalculée en direct, l'indicateur se met à jour.
- « Démarrer la session » : possible uniquement si l'Équipe est valide (FR-10). Passe à E-3.
- « Revenir à la répartition égale » : ouvre D-3.

**États :**

| État | Affichage |
|---|---|
| **Vide** | Impossible : E-2 n'existe qu'avec une Équipe. Sans Équipe, l'application ouvre E-1 (PRD 7.3). |
| **Chargement** | Aucun (voir E-1). |
| **Erreur (démarrage bloqué)** | « Démarrer la session » désactivé. Le motif est affiché sous le bouton : « Ajoutez au moins 2 membres pour lancer une session. » (PRD 7.3) ou le message de la somme (3.2.1). |
| **Erreur d'import** | Dans la zone d'import, message `role="alert"` (6.6). L'équipe actuelle reste inchangée. |
| **Succès** | Démarrage : passage à E-3, focus sur « Suivant ». |
| **Dépassement** | Non applicable. |

#### 3.2.1 Indicateur de total (Répartition manuelle, FR-9)

| Cas | Affichage | Texte exact |
|---|---|---|
| Somme exacte | Vert, icône ✓ | « Total alloué : 15:00 / 15:00 » |
| Somme inférieure | Rouge, icône ⚠ | « Total alloué : 13:20 / 15:00 » et « Il manque 100 s pour atteindre la durée » |
| Somme supérieure | Rouge, icône ⚠ | « Total alloué : 15:30 / 15:00 » et « Il y a 30 s de trop » |
| Membre sans temps (E-5) | Rouge | Message du champ : « Indiquez le temps alloué à [Prénom]. » |
| Temps hors plage (6.5) | Rouge | « Le temps minimum est de 30 secondes. » ou « Le temps dépasse la durée de la cérémonie. » |
| Format invalide (6.5) | Rouge | « Format attendu : secondes (ex. 90) ou mm:ss (ex. 01:30). » |

En Répartition égale, l'indicateur affiche le total en vert, sans message d'erreur, car la somme est toujours exacte (FR-8).

Le libellé de l'indicateur est en `role="status"` : il est annoncé quand il change, sans annonce à chaque frappe (la mise à jour est différée à la fin de la saisie ou à la perte du focus).

#### 3.2.2 Dialogues et bandeaux ouverts depuis E-2

**D-3 : Revenir à la répartition égale**
- Texte : « Revenir à une répartition égale ? Vos valeurs manuelles seront remplacées. »
- Boutons : « Revenir à l'égalité » et « Annuler » [NOUVEAU : libellé du bouton].
- Focus à l'ouverture : « Annuler ».

**D-4 : Remplacer l'équipe par le fichier** (import, si une Équipe existe)
- Texte : « Remplacer l'équipe actuelle par celle du fichier ? »
- Boutons : « Remplacer » et « Annuler ». Focus sur « Annuler ».

**D-5 : Réinitialisation**
- Texte : « Effacer toutes les données de l'application sur cet appareil ? Cette action est définitive. »
- Boutons : « Effacer » et « Annuler » [NOUVEAU : libellés]. Focus sur « Annuler ».
- Effet : l'Équipe, le réglage du son, la Session et le Bilan sont supprimés. L'application affiche E-1 vide.

**Import, messages de la section 6.6 (zone d'import, `role="alert"`) :**
- « Choisissez un fichier .json exporté par l'application. »
- « Fichier trop volumineux (max 100 Ko). »
- « Le fichier est illisible (JSON invalide). »
- « Version du fichier non prise en charge. »
- « Le fichier ne contient pas d'équipe valide. »
- « Ce fichier n'est pas une sauvegarde valide de l'application. » (motif générique)

**Export :** téléchargement immédiat, nom du fichier `equipe-<nom-normalisé>-AAAA-MM-JJ.json` (FR-26). Pas de message de succès : le navigateur gère le téléchargement.

### 3.3 E-3 : Session

**Objectif :** dérouler la parole ; afficher le Membre courant et son temps restant ; signaler le dépassement sans bloquer.

**Titre (h1) :** « Session en cours » ; le nom d'équipe est en sous-titre.

**Éléments, dans l'ordre de tabulation :**
1. Bandeau B-3 si la Session a été restaurée (fermable).
2. En-tête : Nom d'équipe, « Session : 07:12 / 15:00 » [NOUVEAU, écart E-7], bouton « Son d'alerte : activé » ou « Son d'alerte : désactivé » (FR-18).
3. Zone centrale (landmark `<section aria-labelledby>`) :
   - Prénom du Membre courant (h2).
   - Chronomètre du Membre courant (FR-14).
   - Libellé d'état (« Temps restant », « Temps dépassé », « En pause »).
   - Message d'alerte `role="alert"` (visible uniquement pendant un dépassement, fermable, voir E-8).
4. Bouton primaire plein « Suivant » (le seul bouton plein).
5. Bouton secondaire « Pause » (libellé « Reprendre » pendant la pause). Désactivé s'il n'y a pas d'Intervention en cours (FR-13 : la Pause ne concerne que l'Intervention).
6. Liste « Choisir un membre » (E-9) : chaque Membre est un bouton « Donner la parole à [Prénom] ». Le Membre courant porte l'attribut `aria-current="true"` et est sans action.
7. Lien ou bouton « Terminer la session » (texte, couleur `--color-danger`).
8. Confirmation D-6 (inline, affichée seulement après clic sur « Terminer la session », écart E-3).

**Actions :**
- « Suivant » : termine l'Intervention en cours, passe la parole au Membre suivant dans l'ordre circulaire (FR-11). Le focus reste sur « Suivant ».
- Clic sur un Membre de la liste : termine l'Intervention en cours et démarre celle du Membre choisi (FR-12). Le focus reste sur le bouton du Membre choisi.
- « Pause » : fige le minuteur ; le libellé devient « Reprendre ». « Reprendre » relance sans perte (FR-13).
- « Son d'alerte » : active ou désactive le son ; le réglage est enregistré (FR-18).
- « Terminer la session » : affiche D-6.

**États :**

| État | Affichage |
|---|---|
| **Intervention active** | Prénom, chronomètre (blanc / texte normal), libellé « Temps restant ». Bouton « Pause » disponible. |
| **Pause** | Chronomètre figé, icône ‖, libellé « En pause ». Bouton « Reprendre ». Chiffres inchangés, aucune couleur d'alerte. |
| **Dépassement** | Chronomètre en `--color-danger`, icône ⚠, libellé « Temps dépassé », puis « +mm:ss ». Message `role="alert"` affiché une fois (E-10). Carte du Membre en `--color-danger-soft`. |
| **Dépassement déjà acquis** | Membre qui reprend la parole alors que son Temps alloué est déjà dépassé : le minuteur affiche directement « Temps dépassé » et « +mm:ss ». Aucun nouveau message `role="alert"`, aucun son (FR-17). Point ouvert E-15. |
| **Son bloqué par le navigateur** | Aucune erreur affichée (FR-18). L'alerte visuelle reste la seule. |
| **Restaurée** | Bandeau B-3 en haut. Intervention mise en Pause automatiquement. |
| **Erreur de stockage** | Bandeau B-1, Session continue en mémoire vive. |
| **Horloge système en recul** | Aucun message affiché (FR-14) ; journal en console uniquement. |
| **Vide (aucune Intervention)** | Le premier Membre est le Membre courant dès le démarrage (FR-10) ; son Intervention démarre immédiatement. |
| **Succès** | Non applicable : la fin de Session passe à E-4. |

#### 3.3.1 Messages de E-3 (textes exacts du PRD)

- « Temps dépassé » (libellé du minuteur et du message d'alerte).
- « +mm:ss » (format du dépassement, FR-17).
- « En pause » (libellé pendant la pause, FR-13).
- « Session restaurée. L'intervention en cours a été mise en pause : reprenez-la quand vous voulez. » (B-3, FR-16).
- « Son d'alerte : activé » / « Son d'alerte : désactivé » (FR-18).
- « Session : modification impossible » : texte exact du PRD : « Session en cours : modification impossible. » (affiché si l'on tente de modifier l'Équipe, FR-5).

#### 3.3.2 Messages nouveaux de E-3 [NOUVEAU]

- « Fermer le message » : libellé du bouton de fermeture du message d'alerte (E-8).
- « [Prénom] : Temps dépassé » : texte lu par le lecteur d'écran pour l'alerte (E-10). Le texte visible reste « Temps dépassé ».
- « Session : 07:12 / 15:00 » : compteur de Session (E-7). Format « mm:ss » (ou « h:mm:ss » au-delà de 59 minutes).
- « Donner la parole à [Prénom] » : libellé accessible de chaque ligne de la liste (E-9).

#### 3.3.3 D-6 : Terminer la session (inline, écart E-3)

- Affichage : bandeau sous la barre d'actions. Il ne couvre ni le chronomètre ni le nom du Membre.
- Texte exact du PRD : « Terminer la session ? L'intervention en cours sera arrêtée. »
- Boutons : « Terminer » (style destructif) et « Continuer » (style secondaire).
- Focus à l'affichage : « Continuer » (action non destructive).
- « Terminer » : arrête et enregistre l'Intervention en cours, passe à E-4 (FR-15), focus sur le titre de E-4.
- « Continuer » ou Échap : ferme le bandeau, rien ne change.

#### 3.3.4 Dépassement de 1 minute ou plus (PRD 7.3)

Le minuteur reste en « +mm:ss » en rouge, sans blocage. Le format passe à « +01:04 », par exemple. Aucun autre message n'est ajouté.

### 3.4 E-4 : Bilan

**Objectif :** présenter le temps réellement parlé par Membre, le copier pour le compte rendu.

**Titre (h1) :** « Bilan de la session ». Sous-titre : Nom d'équipe et date au format jj/mm/aaaa (NFR-20).

**Éléments, dans l'ordre de tabulation :**
1. Durée de cérémonie prévue et durée réelle (ligne d'en-tête) [NOUVEAU : libellés « Prévue » et « Réelle »].
2. Tableau : Prénom, Temps parlé, Temps alloué, Écart, Statut (FR-20). Lignes dans l'ordre de la liste de l'Équipe.
3. Ligne de total : somme du Temps parlé et somme du Temps alloué.
4. Bouton primaire « Copier le bilan ».
5. Bouton secondaire « Nouvelle session ».
6. Zone de repli (B-4, voir 3.4.2), affichée seulement si la copie échoue.

**Actions :**
- « Copier le bilan » : copie le texte brut (section 4.5). Affiche « Copié ! » pendant 2 secondes ; l'annonce est lue par la zone `aria-live="polite"`.
- « Nouvelle session » : supprime le Bilan précédent et ouvre E-2 (FR-23). Le focus va sur le titre de E-2.

**Lignes du tableau :**
- **Dans le temps :** statut « Dans le temps », icône ✓, couleur `--color-success`. Pour un Temps parlé inférieur ou égal au Temps alloué.
- **Dépassement :** statut « Dépassement de mm:ss », icône ⚠, fond `--color-danger-soft`, texte `--color-danger`. Le statut est lisible sans la couleur.

**États :**

| État | Affichage |
|---|---|
| **Vide (Session sans Intervention)** | Tous les Membres à « 00:00 » parlé, statut « Dans le temps ». Le total est « 00:00 / 15:00 » (FR-15). |
| **Chargement** | Aucun. |
| **Erreur de copie** | Zone de repli (3.4.2). |
| **Succès** | « Copié ! » pendant 2 secondes, lu par `aria-live="polite"`, puis retour à « Copier le bilan ». |
| **Dépassement** | Ligne en `--color-danger-soft` avec texte, icône et statut. |
| **Lecture seule** | Le Bilan reste accessible tant qu'aucune nouvelle Session n'a démarré (FR-23). |

#### 3.4.1 Messages de E-4

- « Copié ! » (2 secondes).
- « Dépassement de mm:ss » (statut de ligne, FR-20).
- « Dans le temps » (statut de ligne, FR-20).
- Le lien « Voir le dernier bilan » figure sur E-2 (FR-23).

#### 3.4.2 Zone de repli (FR-22)

- Texte exact : « Copie automatique impossible. Sélectionnez le texte ci-dessous et copiez-le. »
- Champ en lecture seule (`<textarea readonly>`), contenant le texte de la section 4.5, pré-sélectionné à l'affichage.
- Focus : sur le champ, à l'affichage.
- Le champ est assez haut pour afficher le texte sans défilement sur 320 px (environ 12 lignes), et se défile sinon.

---

## 4. Parcours détaillés (UJ-1 à UJ-4)

Chaque étape indique l'écran, l'action, ce que voit l'utilisateur, ce qu'entend le lecteur d'écran, et le déplacement du focus.

### 4.1 UJ-1 : Camille crée l'équipe et règle la durée (première utilisation)

**Persona :** Camille, Scrum Master. **Données :** Nom « Équipe Plateforme » ; Durée 15 ; 6 Membres (Camille, Thomas, Inès, Léa, Karim, Sofia). **Attendu (PRD) :** FR-1 à FR-9, FR-24.

| Étape | Écran | Action | Affichage | Lecteur d'écran | Focus |
|---|---|---|---|---|---|
| 1 | E-1 vide | Ouverture de l'application | Titre « Créer votre équipe », champs vides, Durée 15, liste vide | Titre de page annoncé ; « Nom d'équipe, champ obligatoire » | Premier champ (Nom d'équipe) |
| 2 | E-1 | Saisie « Équipe Plateforme » | Aucun message d'erreur | Rien (pas d'annonce à chaque frappe) | Reste sur le champ |
| 3 | E-1 | Saisie de la Durée (15 par défaut, aucune modification) | Indicateur : « Temps moyen par membre : 00:00 » (aucun Membre) | Aucune annonce (zone `aria-live="polite"` non utilisée ici) | Reste |
| 4 | E-1 | Ajout de « Camille » puis Entrée | Membre ajouté en fin de liste ; indicateur à « 00:00 » (moins de 2 Membres) ; le champ garde le focus | « Camille ajouté » est lu via le compteur « Membres (1 sur 15) » en `role="status"` [NOUVEAU] | Champ d'ajout |
| 5 | E-1 | Ajout de Thomas, Inès, Léa, Karim, Sofia | Liste de 6 ; indicateur « 02:30 » | Compteur mis à jour à chaque ajout | Champ d'ajout |
| 6 | E-1 | Tentative d'ajout « Thomas » en doublon | « Ce prénom existe déjà dans l'équipe. » sous le champ, champ non vidé | Message annoncé via `aria-describedby` au focus | Champ d'ajout |
| 7 | E-1 | Saisie d'une Durée « 7,5 » | « Saisissez un nombre entier de minutes. » ; « Enregistrer l'équipe » désactivé | Message lu | Champ Durée |
| 8 | E-1 | Correction : « 15 » | Message disparaît, indicateur « 02:30 » | Rien | Champ Durée |
| 9 | E-1 | Clic « Enregistrer l'équipe » | Passage à E-2 | Titre de E-2 « Préparer la session » annoncé | Titre (h1) de E-2 |
| 10 | E-2 | Lecture de la liste | Équipe, Durée « 15 min », répartition égale, 6 lignes à « 02:30 », total « 15:00 / 15:00 » | Liste annoncée comme liste ordonnée de 6 éléments | Titre |
| 11 | E-2 | Clic « Démarrer la session » | Passage à E-3 | Titre « Session en cours » ; « Camille, au tour de parler » [NOUVEAU : annonce] en `role="status"` ; voir UJ-2 | Bouton « Suivant » |

**Vérification :** à l'étape 3, l'indicateur n'affiche rien de faux. Les Membres sont en Répartition égale (FR-8) : 900 s / 6 = 150 s ; la somme est exacte ; les 6 valeurs sont « 02:30 ».

**Cas limite (PRD 6.3) :** « thomas » est mis en majuscule à l'enregistrement (« Thomas ») ; « Léa » et « Lea » ne sont pas en doublon.

**Option, si l'application a déjà une Équipe :** D-1 s'ouvre à l'enregistrement. Focus sur « Annuler ». Le texte exact est « Remplacer l'équipe existante ? Cette action supprime l'équipe actuelle et son réglage. ».

### 4.2 UJ-2 : Camille lance un Daily en répartition manuelle

**Persona :** Camille. **Données :** équipe de UJ-1 ; Thomas doit présenter une migration. **Attendu (PRD) :** FR-9 à FR-12. **Correction :** écart E-1 (150 s, pas 90 s).

**Répartition cible :** Thomas 240 s (04:00), les 5 autres 132 s (02:12). Somme : 900 s.

| Étape | Écran | Action | Affichage | Lecteur d'écran | Focus |
|---|---|---|---|---|---|
| 1 | E-2 | Ouverture (équipe enregistrée en Mémoire) | Bandeau B-3 absent ; E-2 directement (FR-6) | Titre « Préparer la session » | Titre |
| 2 | E-2 | Choix « Répartition manuelle » | Champs « Temps alloué » apparaissent, valeurs égales conservées (02:30) ; total « 15:00 / 15:00 » | « Répartition manuelle sélectionnée » [NOUVEAU : annonce du radio] | Groupe Répartition |
| 3 | E-2 | Saisie « 04:00 » pour Thomas (les 5 autres restent à « 02:30 ») | Total « 16:30 / 15:00 » ; « Il y a 90 s de trop » ; bouton « Démarrer la session » désactivé | Total annoncé à la fin de la saisie (`role="status"`) | Champ Thomas |
| 4 | E-2 | Saisie « 02:12 » pour les 5 autres (un par un) | Le total baisse à chaque saisie (72 s de trop après la première, 18 s après la quatrième) ; après la cinquième, « Total alloué : 15:00 / 15:00 » en vert | Annonce du total à la sortie du champ | Champ suivant |
| 5 | E-2 | Saisie d'un format invalide (« 4min ») | « Format attendu : secondes (ex. 90) ou mm:ss (ex. 01:30). » ; valeur non enregistrée | Message lu | Champ |
| 6 | E-2 | Clic « Démarrer la session » | Passage à E-3 ; Thomas premier si l'ordre de liste le veut (ici Camille est premier) | « Session en cours. Au tour de Camille. » | « Suivant » |

**Variante : suppression d'un Membre en manuel (FR-3).** Si Léa est supprimée, D-2 s'ouvre. Après confirmation, son temps disparaît du calcul, la somme est recontrôlée : « Il manque 132 s pour atteindre la durée ». « Enregistrer » reste désactivé.

**Variante : retour en répartition égale (D-3).** Clic « Revenir à la répartition égale » : D-3 avec le texte exact « Revenir à une répartition égale ? Vos valeurs manuelles seront remplacées. » ; « Revenir à l'égalité » recalcule (FR-8). Focus de départ : « Annuler ».

**Variante : ajout en manuel (écart E-5).** Le nouveau Membre a un champ vide. Message : « Indiquez le temps alloué à [Prénom]. » L'indicateur indique « Il manque X s pour atteindre la durée » tant que le total n'est pas exact.

### 4.3 UJ-3 : Thomas dépasse son temps pendant son intervention

**Persona :** Thomas, membre d'équipe ; Camille anime. **Données :** Thomas a 4 min 00 s de Temps alloué (répartition de UJ-2) ; il parle 4 min 20 s (dépassement de 20 s). **Attendu (PRD) :** FR-14 à FR-18.

| Étape | Écran | Action | Affichage | Lecteur d'écran | Focus |
|---|---|---|---|---|---|
| 1 | E-3 | Camille passe la parole à Thomas (« Suivant » ou clic sur « Donner la parole à Thomas ») | Carte « Thomas » en Membre courant (`aria-current`) ; minuteur « Temps restant 04:00 » en décompte | Annonce « Au tour de Thomas. » [NOUVEAU, en `role="status"`] (NFR-13 : annonce polie, pas à chaque seconde) | « Suivant » (après « Suivant ») ou le bouton du Membre choisi |
| 2 | E-3 | Thomas parle ; le minuteur descend | « 00:45 », « 00:01 » ; mise à jour chaque seconde, sans annonce | Rien | Reste |
| 3 | E-3 | Temps alloué atteint (0) : passage à « +00:01 » | Minuteur en `--color-danger`, icône ⚠, « Temps dépassé » ; message `role="alert"` : « Temps dépassé » ; fond de carte `--color-danger-soft` ; son si activé (une seule fois, FR-18) | Annonce « Thomas : Temps dépassé » (E-10), une seule fois | Reste sur « Suivant » |
| 4 | E-3 | Dépassement continue, +00:20 à la fin | Minuteur « +00:20 », « Temps dépassé » toujours visible ; message fermable ; « Suivant » et le minuteur restent visibles (FR-19) | Aucune nouvelle annonce | Reste |
| 5 | E-3 | Clic « Fermer le message » (optionnel) | Message `role="alert"` retiré ; minuteur et libellé « Temps dépassé » restent | Rien | Retour sur « Fermer le message » puis « Suivant » |
| 6 | E-3 | Thomas conclut ; Camille clique « Suivant » | Intervention arrêtée, temps enregistré (4 min 20 s) ; Membre suivant en Membre courant | « Au tour de [Prénom suivant]. » | « Suivant » |
| 7 | E-3 | Thomas reprend la parole plus tard | Minuteur affiche directement « Temps dépassé » ; aucun nouveau message ni son (FR-17) | Rien | Reste |

**Ce que voit Thomas :** le Membre courant en grand (prénom et chronomètre) est sur l'écran partagé. Il lit « Temps restant » sans rien toucher (persona Thomas). La couleur, le libellé et l'icône indiquent le dépassement ensemble.

**Cas limite : pause pendant une intervention (FR-13).** Camille clique « Pause » : le chronomètre est figé, « En pause » s'affiche, aucune couleur d'alerte n'apparaît (même si le dépassement était déjà affiché, le libellé « Temps dépassé » reste jusqu'à la fin de l'Intervention). « Reprendre » relance sans perte.

**Cas limite : son bloqué.** Le navigateur refuse le son : l'alerte visuelle seule, aucun message d'erreur (FR-18).

### 4.4 UJ-4 : Inès consulte le bilan et l'équipe copie le résultat

**Persona :** Inès, observatrice ; Camille termine. **Données :** fin de session avec Thomas en dépassement de 20 s. **Attendu (PRD) :** FR-15, FR-20 à FR-22.

| Étape | Écran | Action | Affichage | Lecteur d'écran | Focus |
|---|---|---|---|---|---|
| 1 | E-3 | Camille clique « Terminer la session » | Bandeau D-6 inline : « Terminer la session ? L'intervention en cours sera arrêtée. » ; boutons « Terminer » et « Continuer » | Texte annoncé (`role="status"`) | « Continuer » |
| 2 | E-3 | Camille clique « Terminer » | Intervention arrêtée ; passage à E-4 | Titre « Bilan de la session » | Titre de E-4 |
| 3 | E-4 | Inès lit le tableau | Lignes : « Camille : 02:05 / 02:12 Dans le temps » ; « Thomas : 04:20 / 04:00 Dépassement de 00:20 » en `--color-danger-soft` ; ligne de total ; durée prévue 15:00 et réelle | Tableau annoncé ; la ligne en dépassement porte le statut en texte | Titre |
| 4 | E-4 | Camille clique « Copier le bilan » | « Copié ! » pendant 2 secondes ; texte dans le presse-papiers | « Copié » annoncé (`aria-live="polite"`) | Reste sur « Copier le bilan » |
| 5 | E-4 (si copie impossible) | Clic sur « Copier le bilan » | Zone de repli avec « Copie automatique impossible. Sélectionnez le texte ci-dessous et copiez-le. », texte pré-sélectionné | Message lu ; zone de texte annoncée | Zone de texte |
| 6 | Hors appli | Camille colle le texte dans le canal de l'équipe | Texte brut, lisible (section 4.5) | — | — |
| 7 | E-4 | Clic « Nouvelle session » | Bilan supprimé (FR-23), passage à E-2 | Titre « Préparer la session » | Titre de E-2 |

**Cas limite : Session sans Intervention (FR-15).** Camille termine tout de suite : tous les Membres à « 00:00 », statut « Dans le temps », total « 00:00 / 15:00 ».

### 4.5 Texte copié (FR-21, écart E-11) [NOUVEAU : format proposé]

Texte brut, une ligne par Membre, sans Markdown ni HTML, en français, sans caractères de mise en forme :

```
Bilan : Équipe Plateforme (08/11/2026)
Durée prévue : 15:00 - Durée réelle : 15:31

Camille : parlé 02:05 / alloué 02:12 - Dans le temps
Thomas : parlé 04:20 / alloué 04:00 - Dépassement de 00:20
Inès : parlé 01:58 / alloué 02:12 - Dans le temps
Léa : parlé 02:00 / alloué 02:12 - Dans le temps
Karim : parlé 02:12 / alloué 02:12 - Dans le temps
Sofia : parlé 02:50 / alloué 02:12 - Dépassement de 00:38

Total : parlé 15:25 / alloué 15:00
```

Règles : le nom d'équipe et la date viennent de l'Équipe et du jour ; les durées sont en « mm:ss » ou « h:mm:ss » au-delà de 59 minutes ; le total alloué est la somme des Temps alloués (la durée prévue reste sur la ligne d'en-tête). Ne pas copier de nom de catégorie « Classement » ou ordre de temps, pour rester dans le cadre de R6 (pas de classement).

Ce texte illustre le format ; les chiffres sont fictifs.

---

## 5. Accessibilité : règles transversales

### 5.1 Ordre de tabulation et focus

- Ordre de lecture : titre, bloc principal, action principale, actions secondaires, pied de page.
- Chaque bouton et champ a un libellé visible ou un `aria-label` explicite.
- Anneau de focus 3 px `--color-focus` sur tous les éléments interactifs (DESIGN.md, 6.1).
- Ouverture d'un dialogue : focus sur le bouton non destructif ; fermeture : retour à l'élément déclencheur.
- Dialogues D-1 à D-5 : piège de focus (Tab reste dans le dialogue) ; Échap ferme comme « Annuler ».
- Cible minimale 44 × 44 px (NFR-15).

### 5.2 Clavier pendant la Session

| Touche | Effet |
|---|---|
| Tab / Maj+Tab | Parcourt les boutons dans l'ordre : Son, Pause, liste des Membres, Terminer. |
| Entrée ou Espace sur « Suivant » | Passe la parole (natif, car c'est un bouton). |
| Entrée ou Espace sur un Membre | Donne la parole à ce Membre (E-9). |
| Échap | Ferme le bandeau D-6 (comme « Continuer »). Ne ferme pas le message d'alerte, qui se ferme par « Fermer le message ». |

**Risque (à valider, Q5) :** après « Suivant », le focus reste sur « Suivant ». Un Entrée répété passe la parole à chaque appui. La proposition ne change pas ce comportement (il est attendu, FR-10), mais le client doit confirmer que l'équipe accepte ce risque. Le raccourci global (Espace ou Entrée hors champ) est exclu en V1 tant que Q5 n'est pas tranchée.

### 5.3 Lecteur d'écran : annonces

| Événement | Région | Politesse | Texte | Une seule fois |
|---|---|---|---|---|
| Changement de Membre courant | `role="status"` | polite | « Au tour de [Prénom]. » [NOUVEAU] | Oui |
| Dépassement commence | `role="alert"` | assertive (implicite) | « [Prénom] : Temps dépassé » [NOUVEAU, E-10] | Oui, une fois par Intervention |
| Pause | `role="status"` | polite | « En pause » [NOUVEAU : annonce] | Oui |
| Reprise | `role="status"` | polite | « Reprise de l'intervention. » [NOUVEAU] | Oui |
| Total alloué change (manuel) | `role="status"` | polite | Texte de l'indicateur (3.2.1) | À la sortie du champ |
| Copie réussie | `aria-live="polite"` | polite | « Copié ! » | Oui |
| Chronomètre | — | — | Non annoncé (NFR-13) | Jamais |

### 5.4 Contraste et couleur

- Tous les états (dépassement, pause, membre courant, statut du Bilan) ont un texte et une icône. La couleur ne suffit jamais (NFR-14).
- Les couples de couleurs sont ceux de DESIGN.md, section 3 (ratio minimal relevé : 4,83 : 1 ; texte : 5,11 : 1).

### 5.5 Mouvement et écrans réduits

- Aucune animation de dépassement. Le passage d'état est instantané.
- Avec `prefers-reduced-motion`, toutes les transitions sont désactivées (NFR-16).
- En mobile (320 px), E-1 à E-4 sont en colonne unique, marges de 16 px, sans défilement horizontal (NFR-18). Le chronomètre passe à 48 px sous 480 px de largeur.

### 5.6 Langue

- `lang="fr"` sur la page (NFR-17).
- Dates au format jj/mm/aaaa dans l'interface et le Bilan ; format AAAA-MM-JJ uniquement dans le nom de fichier d'export (FR-26).

---

## 6. Points à valider avec le client

1. E-1 à E-15 de la section 1, en priorité E-2 (sauvegarde), E-3 (confirmation de fin), E-7 (temps de Session pour l'observatrice).
2. Textes marqués [NOUVEAU] (section 1 et 3 ; sections 3.3.2, 3.4.1, 4.5, 5.3).
3. Format du texte copié (section 4.5).
4. Q5 : raccourci clavier et risque d'Entrée répété sur « Suivant » (section 5.2).

---

**Fin du document.** La charte graphique est dans [DESIGN.md](./DESIGN.md).
