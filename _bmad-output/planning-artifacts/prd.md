---
title: Scrum Speaking Timer
created: 2026-11-08
updated: 2026-11-08
statut: Brouillon v2 - à valider par le client avant passage à l'architecture détaillée
langue: Français
---

# PRD : Scrum Speaking Timer

*Nom de travail. À confirmer avec le client.*

## 0. Objet du document

Ce PRD décrit ce que la V1 du Scrum Speaking Timer doit faire, pour qui, avec quelles règles de gestion et selon quels critères d'acceptation. Il s'adresse à l'architecte (choix techniques, modèle de données, service worker), au concepteur UX (parcours, états, accessibilité) et aux développeurs et testeurs (règles testables, messages exacts, cas limites).

Il s'appuie sur deux documents existants, qu'il ne duplique pas et dont il reprend les identifiants :

- [Brief produit](./product-brief.md) : problème, objectif, première version du périmètre. Ce PRD le complète et tranche plusieurs points qu'il laissait ouverts.
- [Parcours UX/UI](./ux.md) : parcours principal, règles d'interface, accessibilité.
- [Architecture](./architecture.md) : Angular standalone, signals, `localStorage`, PWA. Ce PRD impose des règles de comportement ; l'architecture choisit comment les réaliser.

Les points où ce PRD corrige ou précise un document existant sont signalés par **[ARBITRAGE]**. Les hypothèses non confirmées par le client sont signalées par **[HYPOTHÈSE H-n]** et listées à la section 9.

Le vocabulaire de la section 3 (Glossaire) est obligatoire : les termes définis y sont employés tels quels dans tout le document et dans le code.

---

## 1. Vision

Pendant une cérémonie Scrum, surtout le Daily, la parole n'est pas répartie : quelques personnes parlent longtemps, d'autres n'ont pas la parole, la réunion dépasse le créneau et le Scrum Master doit interrompre à la main, souvent au prix d'une tension dans l'équipe. Le problème n'est pas la bonne volonté ; il manque un outil neutre et visible de tous qui dit combien de temps chacun a, combien il lui reste, et quand il dépasse.

Le Scrum Speaking Timer est une application web installable (PWA) qui gère ce temps de parole. Le Scrum Master crée une équipe une fois, fixe la durée de la cérémonie, répartit le temps entre les membres (à égalité ou à la main), puis lance la session. Pour chaque intervention, un minuteur affiche le temps restant du membre qui parle. Quand le temps est dépassé, l'application le signale par un message et un signal visuel et sonore, sans bloquer l'écran. À la fin, un bilan indique le temps réellement parlé par chacun, copiable en texte pour le compte rendu.

La valeur tient en trois points. Le temps est mesuré, pas seulement prévu : l'outil dit qui a réellement parlé combien de temps. L'alerte est objective et partagée : le dépassement se voit sur l'écran, il n'est plus porté par la voix du Scrum Master. L'équipe est mémorisée : on ne ressaisit pas les prénoms à chaque Daily. L'application fonctionne sans serveur et sans compte, ce qui la rend simple à déployer sur GitHub Pages et sûre pour la confidentialité des données de l'équipe.

---

## 2. Utilisateurs cibles

### 2.1 Personas

Les trois personas ci-dessous sont fictifs et représentent des profils types. Ils servent à arbitrer les règles, pas à définir des fonctionnalités par personne.

**Persona 1 : Camille, Scrum Master (rôle principal)**

- **Contexte :** anime 3 à 4 équipes de 5 à 9 personnes ; anime le Daily chaque matin, souvent depuis un ordinateur portable posé sur une table ou partagé en visioconférence.
- **Objectifs :** finir le Daily dans les 15 minutes ; que chacun ait la parole de façon équitable ; ne plus avoir à jouer le « gendarme du temps » ; pouvoir lancer la session en moins de deux minutes.
- **Frustrations :** les interruptions manuelles qui créent des tensions ; les Daily qui glissent à 25 minutes ; la liste des prénoms retapée chaque matin ; les outils de minuterie qui se mettent en veille ou perdent le compte quand l'onglet n'est pas au premier plan.
- **Scénario type :** Camille ouvre l'application sur son ordinateur, retrouve l'équipe de la veille, vérifie que la durée est de 15 minutes, lance la session, clique « Suivant » à chaque fin d'intervention, et termine par le bilan qu'elle copie dans le canal de l'équipe.
- **Attente clé :** un seul bouton principal à la fois, des chiffres lisibles à distance, aucune manipulation complexe pendant que l'équipe parle.

**Persona 2 : Thomas, membre d'équipe (utilisateur secondaire, très fréquent)**

- **Contexte :** développeur dans l'équipe de Camille, parle en général après la moitié des membres, quand il a déjà oublié ce qu'il voulait dire ; participe depuis son ordinateur ou son téléphone.
- **Objectifs :** savoir combien de temps il lui reste quand c'est son tour ; ne pas être le seul qu'on interrompt ; comprendre où en est l'équipe.
- **Frustrations :** sentir le regard des autres quand il dépasse ; ne pas savoir si le temps qu'il prend est excessif par rapport aux autres.
- **Scénario type :** pendant son intervention, Thomas regarde l'écran partagé par Camille, voit son prénom et son temps restant en grand, finit à temps ; l'alerte ne se déclenche pas pour lui. Une autre fois, il dépasse de 20 secondes : le message « Temps dépassé » apparaît, il conclut en une phrase.
- **Attente clé :** lire son temps restant sans rien toucher ; comprendre un dépassement sans qu'il soit culpabilisant.
- **Remarque :** Thomas n'utilise pas l'application seul. Il la voit en général sur l'écran partagé par le Scrum Master (voir H-2).

**Persona 3 : Inès, observatrice (Product Owner ou parte prenante)**

- **Contexte :** assiste au Daily sans prendre la parole, ou seulement pour répondre à une question ; veut suivre le déroulé et les décisions sans gêner l'équipe.
- **Objectifs :** voir le déroulement, le temps restant de la session et le bilan final ; savoir si l'équipe respecte son créneau.
- **Frustrations :** ne rien voir de l'état de la session quand elle n'est pas en charge de la minuterie ; avoir à demander « combien de temps reste-t-il ? ».
- **Scénario type :** Inès suit le Daily sur l'écran partagé. Elle lit le chronomètre de session et le membre en cours. À la fin, elle lit le bilan affiché à l'écran, sans toucher à l'application.
- **Attente clé :** lisibilité de l'écran à distance ; aucune action requise de sa part.
- **Limite V1 :** Inès ne peut pas consulter la session depuis son propre appareil, car il n'existe pas de synchronisation (voir Non-objectifs et question Q1).

### 2.2 Non-utilisateurs en V1

- Les équipes qui ont besoin d'un suivi sur plusieurs appareils en même temps (synchronisation, vue distante pour les observateurs à distance).
- Les équipes qui veulent des statistiques sur plusieurs semaines ou plusieurs mois.
- Les équipes qui font leurs cérémonies de manière asynchrone (écrit uniquement) : l'outil mesure du temps de parole oral.
- Les utilisateurs qui ont besoin d'une interface dans une langue autre que le français.
- Les utilisateurs qui gèrent plusieurs équipes au même appareil de façon simultanée (voir H-1).

### 2.3 Parcours utilisateurs clés

Les parcours détaillés, avec leurs états d'erreur, sont en section 7. Les quatre parcours ci-dessous réalisent les FR de la section 4.

- **UJ-1. Camille crée l'équipe et règle la durée pour la première fois.** Première utilisation sur un appareil vierge. Elle saisit le nom de l'équipe, la durée 15 minutes et les prénoms de 6 membres. Le temps par personne s'affiche en direct. Elle enregistre ; l'équipe est mémorisée. Réalise FR-1 à FR-9, FR-24.
- **UJ-2. Camille lance un Daily avec une répartition manuelle.** Elle reprend l'équipe mémorisée, passe en répartition manuelle car Thomas doit présenter une migration (4 minutes au lieu de 1 min 30). La somme des temps est égale à la durée, elle lance la session. Réalise FR-9, FR-10, FR-11, FR-12.
- **UJ-3. Thomas dépasse son temps pendant son intervention.** Pendant le Daily, Thomas dépasse de 20 secondes. L'alerte apparaît (texte, couleur, son si activé) ; Camille ne bloque rien, Thomas conclut, Camille clique « Suivant ». Réalise FR-14 à FR-18.
- **UJ-4. Inès consulte le bilan et l'équipe copie le résultat.** En fin de session, le bilan affiche le temps parlé / alloué par membre, en rouge pour les dépassements. Camille clique « Copier le bilan » et colle le texte dans le canal de l'équipe. Réalise FR-20, FR-21, FR-22.

---

## 3. Glossaire

*Ces termes sont employés exactement ainsi dans tout le document, dans l'interface et dans le code.*

- **Équipe** : groupe de Membres réunis pour une cérémonie. Possède un Nom d'équipe, une Durée de cérémonie et une liste ordonnée de Membres. Une seule Équipe active par appareil en V1 (H-1).
- **Nom d'équipe** : libellé de l'Équipe, affiché en haut des écrans et dans le Bilan.
- **Membre** : personne de l'Équipe, identifiée par un Prénom et un Temps alloué. Une Équipe compte entre 2 et 15 Membres.
- **Prénom** : libellé d'un Membre. Unique au sein d'une Équipe (règles en section 6).
- **Durée de cérémonie** : durée totale prévue de la Session, en minutes entières. Valeur par défaut : 15 minutes.
- **Répartition** : mode de calcul des Temps alloués. Deux modes : **Répartition égale** (calcul automatique) et **Répartition manuelle** (saisie par Membre).
- **Temps alloué** : durée totale de parole attribuée à un Membre pour la Session, en secondes entières. Ce n'est pas une durée par Intervention (H-7).
- **Session** : une exécution de la cérémonie, du démarrage jusqu'à la fin. Possède un état : **Non démarrée**, **En cours** ou **Terminée**.
- **Intervention** : période pendant laquelle un Membre a la parole, de son début à la fin choisie par « Suivant » ou par le choix d'un autre Membre. Une Session comporte plusieurs Interventions ; un même Membre peut en avoir plusieurs.
- **Membre courant** : le Membre dont l'Intervention est en cours.
- **Minuteur d'Intervention** : affichage du temps restant du Membre courant (Temps alloué moins Temps parlé). Devient un dépassement quand il passe sous zéro.
- **Temps parlé** : somme des durées des Interventions d'un Membre pendant la Session. Calculé à partir de l'horodatage, jamais par décrément (section 4.3, FR-14).
- **Pause** : suspension de l'Intervention en cours. Le temps passé en Pause n'est pas compté comme Temps parlé. Ne concerne que l'Intervention, pas la Session (voir [ARBITRAGE] FR-13).
- **Dépassement** : situation où le Temps parlé d'un Membre est supérieur à son Temps alloué.
- **Alerte de dépassement** : signal déclenché une fois au moment où un Dépassement commence (visuel, textuel et sonore si le son est activé).
- **Bilan** : écran de fin de Session présentant, par Membre, le Temps parlé et le Temps alloué, et le statut de chacun.
- **Mémoire** : données conservées sur l'appareil entre deux visites : Équipe, Durée de cérémonie, Répartition, réglage du son. Stockage local uniquement.
- **Export / Import** : opérations qui sauvegardent l'Équipe dans un fichier JSON téléchargé par l'utilisateur, puis la restaurent depuis ce fichier.

---

## 4. Fonctionnalités

Les exigences sont regroupées par fonctionnalité. Chaque FR porte un identifiant global, une règle testable et, si nécessaire, des hors-périmètre. Les messages d'erreur sont les textes exacts à afficher.

### 4.1 Gestion de l'Équipe

**Description :** le Scrum Master crée l'Équipe une fois, ajoute, modifie et supprime des Membres, et retrouve l'Équipe à chaque visite. Cette fonctionnalité réalise UJ-1 et UJ-2. Les règles de validation champ par champ sont en section 6.

**Exigences fonctionnelles :**

#### FR-1 : Créer une Équipe

Le Scrum Master peut créer une Équipe en renseignant un Nom d'équipe, une Durée de cérémonie et au moins deux Membres. Réalise UJ-1.

**Conséquences (testables) :**
- Le bouton « Enregistrer l'équipe » reste désactivé tant que le Nom d'équipe est vide, que moins de 2 Membres sont saisis, ou qu'une règle de la section 6 n'est pas respectée.
- Après enregistrement, l'Équipe est présente en Mémoire (FR-24) et l'application affiche l'écran de préparation de Session.
- Si une Équipe existe déjà sur l'appareil, la création demande une confirmation : « Remplacer l'équipe existante ? Cette action supprime l'équipe actuelle et son réglage. » Boutons : « Remplacer » et « Annuler ». Sans confirmation, rien ne change.

**Hors-périmètre :** plusieurs Équipes actives sur le même appareil (H-1, question Q4).

#### FR-2 : Ajouter un Membre

Le Scrum Master peut ajouter un Membre en saisissant un Prénom, jusqu'à 15 Membres au total.

**Conséquences (testables) :**
- Le Membre est ajouté en fin de liste, avec la valeur de Temps alloué recalculée selon la Répartition en cours (FR-8 ou FR-9).
- Au 15e Membre, le champ d'ajout est désactivé et le message « Une équipe ne peut pas dépasser 15 membres. » s'affiche.
- Un Prénom invalide ou en doublon bloque l'ajout avec le message d'erreur correspondant à la section 6. Le Prénom saisi reste dans le champ pour correction.
- La touche Entrée valide l'ajout.

#### FR-3 : Modifier ou supprimer un Membre

Le Scrum Master peut renommer ou supprimer un Membre de l'Équipe.

**Conséquences (testables) :**
- Renommer applique les règles de la section 6 (dont l'unicité du Prénom).
- Supprimer demande une confirmation : « Supprimer [Prénom] de l'équipe ? » Boutons : « Supprimer » et « Annuler ».
- Il est impossible de descendre sous 2 Membres. Si la suppression amène l'Équipe à 1 Membre, elle est refusée avec le message « Une équipe doit compter au moins 2 membres. »
- La suppression recalcule les Temps alloués selon la Répartition en vigueur. En Répartition manuelle, les Temps alloués des autres Membres ne changent pas et la somme est recontrôlée (FR-9) ; si elle ne correspond plus, le message de la section 6 s'affiche et l'enregistrement est bloqué jusqu'à correction.

#### FR-4 : Ordonner les Membres

Le Scrum Master peut modifier l'ordre des Membres dans la liste.

**Conséquences (testables) :**
- L'ordre de la liste est l'ordre de passage par défaut (FR-12).
- Le réordonnancement se fait par boutons « Monter » et « Descendre » sur chaque ligne, accessibles au clavier. Le glisser-déposer n'est pas requis.
- L'ordre est conservé en Mémoire (FR-24).

#### FR-5 : Modifier le Nom d'équipe et la Durée de cérémonie

Le Scrum Master peut modifier le Nom d'équipe et la Durée de cérémonie à tout moment en dehors d'une Session en cours.

**Conséquences (testables) :**
- Pendant une Session En cours, ces champs sont en lecture seule, avec le texte « Session en cours : modification impossible. »
- Une modification de la Durée de cérémonie recalcule les Temps alloués en Répartition égale ; en Répartition manuelle, la somme est recontrôlée (FR-9).

#### FR-6 : Reprendre l'Équipe à chaque visite

À l'ouverture de l'application, si une Équipe est en Mémoire, l'écran de préparation de Session est affiché directement avec cette Équipe.

**Conséquences (testables) :**
- Le délai entre l'ouverture et l'affichage de l'Équipe est inférieur à 1 seconde sur un appareil de milieu de gamme (NFR-5).
- Aucune ressaisie n'est demandée.

#### FR-7 : Fixer la Durée de cérémonie

Le Scrum Master fixe la Durée de cérémonie en minutes entières, entre 1 et 120 minutes. Valeur par défaut : 15 minutes (H-4).

**Conséquences (testables) :**
- Le champ n'accepte que des nombres entiers. Une valeur vide, nulle, négative, décimale ou supérieure à 120 est refusée (section 6).
- Le temps moyen par Membre (durée divisée par le nombre de Membres) est affiché en direct sous le champ, au format « mm:ss ».
- Si le temps moyen par Membre est inférieur à 30 secondes (H-5), l'enregistrement est bloqué avec le message : « Avec N membres, chacun aurait moins de 30 secondes. Augmentez la durée ou retirez des membres. »

**Hors-périmètre :** durée non entière (secondes), durée supérieure à 120 minutes.

### 4.2 Répartition du temps

**Description :** avant la Session, le Scrum Master choisit comment la Durée de cérémonie est partagée entre les Membres. Deux modes existent : la Répartition égale, calculée automatiquement, et la Répartition manuelle, saisie par Membre. Cette fonctionnalité réalise UJ-1 et UJ-2.

#### FR-8 : Répartition égale

En Répartition égale, chaque Membre reçoit le même Temps alloué, calculé automatiquement.

**Conséquences (testables) :**
- Le calcul est : partie entière de (Durée en secondes / nombre de Membres) pour chaque Membre ; le reliquat en secondes (Durée en secondes modulo nombre de Membres) est attribué +1 seconde aux premiers Membres de la liste, dans l'ordre.
- Exemples de contrôle : 15 minutes pour 4 Membres donne 225 secondes chacun. 15 minutes (900 s) pour 7 Membres donne 129 secondes aux 4 premiers (reliquat de 4 s) et 128 secondes aux 3 derniers ; la somme reste exactement 900 secondes, c'est l'invariant à tester.
- La somme des Temps alloués est toujours égale à la Durée de cérémonie en secondes.
- Modifier le nombre de Membres ou la Durée recalcule immédiatement les valeurs affichées.
- Les valeurs sont affichées au format « mm:ss » (exemple : 3 min 45 s s'affiche « 03:45 »).

#### FR-9 : Répartition manuelle

En Répartition manuelle, le Scrum Master saisit le Temps alloué de chaque Membre.

**Conséquences (testables) :**
- Chaque Temps alloué est saisi en secondes entières, entre 30 et la Durée de cérémonie en secondes (H-5).
- La somme des Temps alloués doit être exactement égale à la Durée de cérémonie en secondes ([ARBITRAGE] Q3 : somme exacte ou reliquat non alloué à valider).
- Un indicateur sous la liste affiche en permanence « Total alloué : MM:SS / MM:SS ». Il passe en rouge et affiche le message « Il manque X s pour atteindre la durée » ou « Il y a X s de trop » tant que la somme n'est pas exacte.
- Le bouton « Enregistrer » est désactivé tant que la somme n'est pas exacte.
- Passer à la Répartition manuelle conserve les valeurs égales calculées au moment de la bascule, pour que le Scrum Master n'ait qu'à corriger.
- Le bouton « Revenir à la répartition égale » recalcule les valeurs (FR-8) après confirmation : « Revenir à une répartition égale ? Vos valeurs manuelles seront remplacées. »

**Hors-périmètre :** répartition par pourcentage, répartition par rôle ou ancienneté.

### 4.3 Session et minuteur d'Intervention

**Description :** la Session guide le Scrum Master pas à pas. Le Membre courant et son minuteur sont au centre de l'écran ; un seul bouton principal, « Suivant », est plein. Cette fonctionnalité réalise UJ-2, UJ-3. Les règles de mesure sont en FR-14. Les états de la Session et d'une Intervention sont décrits en section 7.

#### FR-10 : Démarrer la Session

Le Scrum Master démarre la Session depuis l'écran de préparation.

**Conséquences (testables) :**
- Démarrer est possible uniquement si l'Équipe est valide (sections 4.1 et 4.2).
- Au démarrage, la Session passe à l'état **En cours**, le premier Membre de la liste devient Membre courant et son Intervention commence immédiatement.
- Une seule Session peut être En cours à la fois. L'état de la Session est enregistré en Mémoire (FR-16).
- L'écran de Session est affiché et le bouton « Suivant » a le focus à l'affichage.

#### FR-11 : Passer la parole au Membre suivant

Le Scrum Master clique « Suivant » pour terminer l'Intervention en cours et passer la parole au Membre suivant dans l'ordre (FR-4).

**Conséquences (testables) :**
- L'Intervention en cours est arrêtée et son temps est ajouté au Temps parlé du Membre concerné.
- Le Membre suivant devient Membre courant ; son minuteur affiche son Temps restant (Temps alloué moins Temps parlé cumulé), et son Intervention démarre.
- Après le dernier Membre de la liste, « Suivant » revient au premier Membre (ordre circulaire). Un Membre ayant déjà parlé reste dans le cycle.
- Si l'Intervention précédente était en Pause, elle est arrêtée avec le temps accumulé jusqu'à la Pause ; la nouvelle Intervention démarre en marche.

#### FR-12 : Choisir le Membre courant

Le Scrum Master peut donner la parole à un Membre précis, en cliquant sur son nom dans la liste.

**Conséquences (testables) :**
- Choisir un Membre termine l'Intervention en cours (comme FR-11) et démarre celle du Membre choisi.
- Choisir le Membre déjà courant ne fait rien.
- Le Membre choisi n'a pas à avoir parlé auparavant : un Membre peut avoir plusieurs Interventions dans la Session (H-7).
- Le cycle « Suivant » reprend à partir du Membre choisi.

#### FR-13 : Mettre en Pause et reprendre une Intervention

Le Scrum Master met en Pause l'Intervention du Membre courant, par exemple pour une discussion hors parole, puis la reprend.

**Conséquences (testables) :**
- Pendant la Pause, le minuteur est figé, le temps ne s'écoule pas, et le libellé « En pause » est affiché.
- Reprendre relance le minuteur sans perte du temps accumulé.
- « Suivant » et le choix d'un autre Membre sont possibles pendant la Pause ; l'Intervention se termine et son temps accumulé est enregistré.
- La Pause n'est disponible que si une Intervention est en cours ; elle ne met pas la Session en pause.

**[ARBITRAGE]** Le brief (RF2) disait : « la session démarre, se met en pause et se termine ». Ce PRD limite la Pause à l'Intervention, conformément au parcours UX (« suspendre le temps d'une intervention »). La mise en pause de la Session elle-même est hors périmètre V1, car elle n'apporte pas de valeur distincte pour la cérémonie (question Q2).

#### FR-14 : Mesurer le temps de parole

Le Temps parlé d'un Membre est mesuré à partir des horodatages, jamais par décrément d'un compteur.

**Conséquences (testables) :**
- Pour chaque Intervention, la durée est calculée comme la différence entre l'instant d'arrêt et l'instant de début, moins les durées de Pause.
- Un test à horloge simulée doit donner, après 15 minutes de Session avec un onglet mis en arrière-plan pendant 5 minutes, un écart inférieur à 1 seconde par rapport au temps réel (NFR-6).
- Si l'écran se met en veille, à la reprise, le temps écoulé est compté selon l'horloge et non selon le nombre de ticks d'affichage.
- Si l'horloge système recule (durée négative calculée), la durée est ramenée à 0 pour cette Intervention et une erreur est journalisée en console. Aucun message n'est affiché à l'utilisateur.
- Le minuteur est mis à jour au moins une fois par seconde à l'écran.
- Le format affiché est « mm:ss » ; au-delà de 59 minutes, « h:mm:ss ».

**Hors-périmètre :** précision infra-seconde à l'écran (les données restent en millisecondes en interne).

#### FR-15 : Terminer la Session

Le Scrum Master termine la Session à tout moment.

**Conséquences (testables) :**
- Le bouton « Terminer la session » demande une confirmation : « Terminer la session ? L'intervention en cours sera arrêtée. » Boutons : « Terminer » et « Continuer ».
- À la confirmation, l'Intervention en cours est arrêtée et enregistrée, la Session passe à l'état **Terminée**, et l'écran Bilan (FR-20) s'affiche.
- Une Session Terminée n'est plus modifiable. Pour une nouvelle Session, le Scrum Master revient à l'écran de préparation (FR-10).
- Si la Session n'a aucune Intervention enregistrée, le bilan affiche tous les Membres à 0 seconde parlée.

#### FR-16 : Reprise après rechargement ou fermeture

Si la page est rechargée, fermée ou mise en arrière-plan pendant une Session En cours, la Session est restaurée.

**Conséquences (testables) :**
- L'état de la Session (Membre courant, Temps parlé par Membre, Intervention en cours) est enregistré à chaque changement (FR-24).
- À la réouverture, si une Intervention était en cours, elle est automatiquement mise en Pause, et le message « Session restaurée. L'intervention en cours a été mise en pause : reprenez-la quand vous voulez. » s'affiche. Le temps écoulé pendant la fermeture n'est pas compté (H-15).
- Le Scrum Master peut reprendre, passer au suivant, ou terminer.
- Une Session Terminée n'est pas restaurée comme Session En cours : elle n'est accessible que via le Bilan (FR-23).

### 4.4 Alerte de dépassement

**Description :** le dépassement doit se voir sans être alarmant, et ne doit jamais bloquer l'écran ni interrompre la parole. Cette fonctionnalité réalise UJ-3.

#### FR-17 : Signaler le dépassement

Quand le Temps parlé d'un Membre dépasse son Temps alloué, l'application le signale, une seule fois par dépassement.

**Conséquences (testables) :**
- Au moment du franchissement, le minuteur passe en rouge, le libellé « Temps dépassé » est affiché, et le temps de dépassement est affiché sous la forme « +mm:ss ».
- Le message est porté par un élément `role="alert"` annoncé aux lecteurs d'écran ; la couleur n'est jamais le seul moyen de signaler l'état (UX, section Accessibilité).
- Un dépassement ne se déclenche qu'une fois par Intervention ; il ne se répète pas à chaque seconde.
- Si le Membre a déjà dépassé lors d'une Intervention précédente, un nouveau dépassement est signalé à nouveau lors de la nouvelle Intervention où il franchit son Temps alloué.
- Si le Temps alloué a déjà été dépassé et que le Membre reprend la parole, le minuteur affiche directement « Temps dépassé » sans attendre une nouvelle alerte sonore.

#### FR-18 : Alerte sonore

Un signal sonore accompagne l'alerte de dépassement, si le son est activé.

**Conséquences (testables) :**
- Le son est activé par défaut ; il peut être désactivé et réactivé depuis l'écran de Session (bouton « Son d'alerte : activé / désactivé »). Le réglage est enregistré en Mémoire.
- Le son est joué une seule fois par dépassement (FR-17).
- Les navigateurs peuvent bloquer l'audio tant qu'il n'y a pas eu d'interaction. Le son est initialisé lors du clic sur « Démarrer » (FR-10). Si le son reste bloqué, l'alerte visuelle reste affichée et aucun message d'erreur n'est montré.
- Le son ne doit pas bloquer le navigateur ni l'interface.

#### FR-19 : Alerte non bloquante

L'alerte ne doit pas empêcher d'agir.

**Conséquences (testables) :**
- Aucune boîte de dialogue modale n'apparaît pendant une Intervention.
- L'alerte ne fait pas disparaître le bouton « Suivant » ni le minuteur.
- Le message d'alerte peut être fermé, mais le minuteur continue d'afficher « Temps dépassé » jusqu'à la fin de l'Intervention.

### 4.5 Bilan

**Description :** le bilan est l'écran de fin de Session. Il sert à la fois de compte rendu visuel et de texte à copier. Cette fonctionnalité réalise UJ-4.

#### FR-20 : Afficher le Bilan

À la fin de la Session, le Bilan présente, par Membre : Prénom, Temps parlé, Temps alloué, écart et statut.

**Conséquences (testables) :**
- Les lignes sont affichées dans l'ordre de la liste de l'Équipe.
- Le statut est « Dans le temps » si le Temps parlé est inférieur ou égal au Temps alloué ; sinon « Dépassement de mm:ss ». Le dépassement est aussi indiqué en rouge et par le texte (pas seulement la couleur).
- Une ligne de total affiche la somme du Temps parlé et la somme du Temps alloué, ainsi que la Durée de cérémonie prévue et la durée réelle de la Session (du démarrage à la fin).
- Le Bilan est accessible en lecture seule tant qu'une nouvelle Session n'a pas démarré (FR-23).

#### FR-21 : Copier le Bilan en texte

Le Scrum Master peut copier le Bilan en texte brut, pour le coller dans un canal de discussion ou un compte rendu.

**Conséquences (testables) :**
- Le bouton « Copier le bilan » copie dans le presse-papiers un texte brut, une ligne par Membre, avec le nom de l'Équipe, la date, le Temps parlé et le Temps alloué, et le statut.
- Le texte est en français et ne contient pas de mise en forme (pas de HTML ni de Markdown).
- Après copie réussie, le bouton affiche « Copié ! » pendant 2 secondes et l'annonce est lue par les lecteurs d'écran (zone `aria-live`).

#### FR-22 : Copie de repli

Si le presse-papiers n'est pas disponible, le texte est affiché pour une copie manuelle.

**Conséquences (testables) :**
- Si l'API de copie échoue ou n'est pas disponible, un champ de texte en lecture seule contenant le bilan est affiché avec le message « Copie automatique impossible. Sélectionnez le texte ci-dessous et copiez-le. »
- Le champ est pré-sélectionné à l'affichage.

#### FR-23 : Conserver le dernier Bilan

Le dernier Bilan reste accessible depuis l'écran de préparation jusqu'au démarrage d'une nouvelle Session (H-16).

**Conséquences (testables) :**
- Un lien « Voir le dernier bilan » est affiché sur l'écran de préparation si un Bilan existe.
- Le démarrage d'une nouvelle Session efface le Bilan précédent.
- Le Bilan n'est pas conservé au-delà d'une nouvelle Session ; il n'y a pas d'historique en V1 (non-objectif).

### 4.6 Mémoire, sauvegarde et portabilité

**Description :** l'équipe et ses réglages sont conservés entre les visites sur le même appareil. Le Scrum Master peut sauvegarder l'équipe dans un fichier et la restaurer, par exemple après un changement d'ordinateur. Aucune donnée ne quitte l'appareil.

#### FR-24 : Conserver l'Équipe et les réglages

L'Équipe, la Durée de cérémonie, la Répartition, l'ordre des Membres, le réglage du son et l'état de la Session En cours sont enregistrés en Mémoire après chaque modification.

**Conséquences (testables) :**
- L'enregistrement est effectué à chaque changement, sans bouton « Sauvegarder ».
- La clé de stockage est `scrum-timer:v1` (architecture, section 3) ; la version du schéma est stockée dans les données pour permettre une migration.
- Les données restent après rechargement, fermeture du navigateur et redémarrage de l'appareil.
- Les données ne sont jamais envoyées à un serveur (NFR-6).

#### FR-25 : Erreurs de stockage

Si la Mémoire est indisponible ou pleine, l'application le signale sans perdre la Session en cours.

**Conséquences (testables) :**
- Si le stockage local est refusé (navigation privée stricte, quota dépassé), un bandeau est affiché : « Vos données ne seront pas conservées après fermeture. Exportez votre équipe pour la sauvegarder. » Le bandeau est fermable.
- La Session continue de fonctionner en mémoire vive.
- Si les données enregistrées sont illisibles (JSON invalide, version inconnue), elles sont ignorées, l'application démarre sans Équipe, et le message « Les données enregistrées sont illisibles et ont été ignorées. Vous pouvez importer un fichier de sauvegarde. » est affiché. L'application ne plante pas.

#### FR-26 : Exporter l'Équipe

Le Scrum Master peut télécharger l'Équipe et ses réglages dans un fichier JSON.

**Conséquences (testables) :**
- Le bouton « Exporter l'équipe » télécharge un fichier nommé `equipe-<nom-normalisé>-AAAA-MM-JJ.json`.
- Le fichier contient l'Équipe, la Durée de cérémonie, la Répartition, l'ordre et le réglage du son. Il ne contient pas le Bilan ni l'historique.
- Le téléchargement se fait sans appel réseau.

**Hors-périmètre :** export du Bilan au format CSV ou PDF.

#### FR-27 : Importer une Équipe

Le Scrum Master peut restaurer une Équipe depuis un fichier JSON produit par l'export.

**Conséquences (testables) :**
- Le fichier doit être du JSON valide, de la version de schéma supportée, avec une Équipe respectant les règles de la section 6. Sinon, l'import est refusé avec le message « Ce fichier n'est pas une sauvegarde valide de l'application. » (ou un message plus précis selon le motif, section 6.6).
- Un fichier de plus de 100 Ko est refusé avec le message « Fichier trop volumineux (max 100 Ko). »
- Si une Équipe existe déjà, l'import demande confirmation : « Remplacer l'équipe actuelle par celle du fichier ? » (FR-1).
- Après import valide, l'Équipe est en Mémoire et l'écran de préparation est affiché.

### 4.7 Exigences d'installation et de hors ligne

Les exigences PWA et hors ligne sont décrites en section 5 (NFR-1 à NFR-4), car elles sont transversales. Elles réalisent la demande du client : une application installable, utilisable hors connexion et publiée sur GitHub Pages.

---

## 5. Exigences non fonctionnelles

Les exigences ci-dessous s'appliquent à l'ensemble de l'application. Leur niveau de détail permet de les vérifier avec des outils (Lighthouse, axe-core, Playwright, tests unitaires).

### 5.1 PWA, installation et hors ligne

- **NFR-1 (installation)** : l'application est installable depuis Chrome, Edge (ordinateur et Android) et Safari (iOS, via « Ajouter à l'écran d'accueil »). Le manifeste définit un nom, un nom court, une icône 192 et 512 px, une couleur de thème et un affichage `standalone`. Le score Lighthouse « Installable » est validé en CI.
- **NFR-2 (hors ligne)** : après le premier chargement, toutes les fonctionnalités (équipe, répartition, Session, Bilan, export et import) fonctionnent sans connexion. Un test E2E coupe le réseau et exécute le parcours complet. Aucune ressource n'est chargée depuis un réseau tiers (voir NFR-6).
- **NFR-3 (mise à jour)** : une nouvelle version publiée est disponible au prochain rechargement. Si une Session est En cours pendant la mise à jour, la mise à jour n'interrompt pas la Session : elle est appliquée au prochain démarrage de l'application.
- **NFR-4 (déploiement)** : l'application est servie sous `/<nom-du-depot>/` sur GitHub Pages. La base href est configurée au build. Les chemins de l'application et du manifeste fonctionnent sous ce préfixe (architecture, section 7).

### 5.2 Performance

- **NFR-5 (performance)** : sur un appareil de milieu de gamme avec réseau 4G simulé, le premier affichage utilisable (LCP) est inférieur à 2,5 secondes. Le poids initial du JavaScript téléchargé est communiqué par l'architecte ; cible proposée : 300 Ko compressés maximum [HYPOTHÈSE H-17].
- **NFR-6 (fiabilité du minuteur)** : voir FR-14. Précision de la mesure : écart inférieur à 1 seconde sur 15 minutes, onglet en arrière-plan inclus.
- **NFR-7 (réactivité)** : une action utilisateur (Suivant, Pause, choix d'un Membre) met à jour l'affichage en moins de 200 ms.

### 5.3 Confidentialité

- **NFR-8 (aucune donnée sur serveur)** : l'application ne transmet aucune donnée à un serveur. Pas de compte, pas de cookie de suivi, pas d'analytics, pas de publicité, pas de service tiers pour les polices ou les scripts. Vérification : test automatisé qui intercepte les requêtes sortantes pendant le parcours complet et échoue à la moindre requête vers un domaine autre que l'origine de l'application.
- **NFR-9 (données locales)** : les données de l'équipe sont stockées uniquement dans le stockage local du navigateur. Elles sont supprimables par l'utilisateur via la réinitialisation (FR-28).
- **NFR-10 (presse-papiers)** : la copie du Bilan n'envoie rien au réseau et ne lit pas le presse-papiers.

### 5.4 Accessibilité (WCAG 2.1 niveau AA)

- **NFR-11 (contrastes)** : contraste minimum 4,5 : 1 pour le texte normal et 3 : 1 pour le texte large et les composants d'interface (boutons, bordures de champs, état du minuteur).
- **NFR-12 (clavier)** : tous les contrôles sont atteignables et utilisables au clavier, dans un ordre de tabulation logique. Un indicateur de focus visible est présent sur tous les éléments interactifs. Raccourci clavier optionnel pour « Suivant » (Espace ou Entrée) hors champ de saisie, à confirmer par le client (Q5).
- **NFR-13 (lecteurs d'écran)** : le Membre courant et le statut de dépassement sont annoncés via `aria-live` (polite pour le changement de Membre, assertive pour le dépassement, une seule annonce par événement). Le chronomètre n'est pas annoncé chaque seconde.
- **NFR-14 (non-couleur)** : toute information transmise par la couleur (dépassement, alerte) est aussi portée par un texte et une icône ou un libellé.
- **NFR-15 (cibles tactiles)** : les boutons et cases ont une zone cliquable d'au moins 44 x 44 px.
- **NFR-16 (mouvement)** : les animations sont désactivées si l'utilisateur a demandé une réduction des mouvements (`prefers-reduced-motion`).
- **NFR-17 (langue)** : `lang="fr"` sur la page ; les libellés et messages sont en français.

### 5.5 Responsive et compatibilité

- **NFR-18 (responsive)** : l'interface est utilisable de 320 px à 1920 px de large, en colonne unique sur mobile avec une marge latérale de 16 px. Aucun défilement horizontal n'apparaît à 320 px.
- **NFR-19 (navigateurs)** : les deux dernières versions de Chrome, Edge, Firefox, Safari macOS et Safari iOS 16.4 ou plus récent [HYPOTHÈSE H-9].
- **NFR-20 (langue de l'interface)** : interface en français uniquement en V1 ; format des durées « mm:ss », format des dates jj/mm/aaaa.

### 5.6 Qualité et maintenance

- **NFR-21 (tests)** : la logique de temps et de répartition est couverte par des tests unitaires ; le parcours complet par des tests E2E (Playwright) ; ces tests passent dans le pipeline GitHub Actions avant tout déploiement.
- **NFR-22 (déploiement reproductible)** : le projet se lance à l'identique via Docker Compose (architecture, section 2).

---

## 6. Règles de validation des formulaires

Les règles ci-dessous s'appliquent à chaque champ. Elles sont vérifiées à la saisie (en direct) et à l'enregistrement. Les messages sont les textes exacts à afficher. Les espaces en début et fin de saisie sont retirés avant validation. Un champ invalide est signalé par un libellé d'erreur lié au champ (`aria-describedby`) et la première erreur reçoit le focus à l'enregistrement.

### 6.1 Nom d'équipe

- **Obligatoire.** Vide ou uniquement des espaces : « Donnez un nom à votre équipe. »
- **Longueur :** 1 à 50 caractères. Au-delà : « Le nom ne doit pas dépasser 50 caractères. »
- **Caractères autorisés :** lettres, chiffres, espaces, apostrophes, tirets, points, parenthèses. Caractères refusés : « Caractères non autorisés dans le nom de l'équipe. »
- Les espaces multiples internes sont réduits à un seul.

### 6.2 Nombre de Membres

- **Minimum 2 et maximum 15** (brief, RF1).
- Moins de 2 : « Ajoutez au moins 2 membres pour lancer une session. » (affiché comme état, n'empêche pas la saisie).
- Plus de 15 : « Une équipe ne peut pas dépasser 15 membres. » (le champ d'ajout est désactivé).

### 6.3 Prénom d'un Membre

- **Obligatoire.** Vide après retrait des espaces : « Saisissez un prénom. »
- **Longueur :** 1 à 30 caractères. Au-delà : « Le prénom ne doit pas dépasser 30 caractères. »
- **Caractères autorisés :** lettres de toutes langues (y compris accentuées), apostrophe (`'` et `’`), trait d'union, espace. Pas de chiffres, pas de symboles, pas d'emoji. Message : « Un prénom ne peut contenir que des lettres, espaces, traits d'union et apostrophes. »
- **Espaces :** un seul espace entre deux mots ; retirés en début et fin.
- **Casse :** la première lettre est mise en majuscule à l'enregistrement uniquement si elle est minuscule (« thomas » devient « Thomas »). Les autres lettres ne sont pas modifiées.
- **Unicité (doublons) :** deux Prénoms sont en doublon si, après retrait des espaces, réduction des espaces multiples et passage en minuscules, ils sont identiques. Les accents comptent : « Léa » et « Lea » ne sont pas en doublon (H-13). Message : « Ce prénom existe déjà dans l'équipe. » Le Prénom saisi n'est pas ajouté.
- Le doublon est comparé au Prénom du même Membre en cas de renommage : renommer « Thomas » en « Thomas » ne déclenche pas d'erreur.

### 6.4 Durée de cérémonie

- **Obligatoire**, entier en minutes, sans décimales. Valeur par défaut : 15.
- **Plage :** 1 à 120 minutes (H-4).
  - Vide : « Indiquez la durée de la cérémonie. »
  - Non entier ou décimal (ex. 7,5) : « Saisissez un nombre entier de minutes. »
  - Inférieur à 1 : « La durée minimale est de 1 minute. »
  - Supérieur à 120 : « La durée maximale est de 120 minutes. »
- **Cohérence avec le nombre de Membres :** durée en secondes / nombre de Membres doit être au moins égal à 30 secondes (H-5). Sinon : « Avec N membres, chacun aurait moins de 30 secondes. Augmentez la durée ou retirez des membres. »

### 6.5 Temps alloué manuel (un Membre)

- **Obligatoire** en Répartition manuelle, entier en secondes. Saisie en secondes ou en « mm:ss » (le format est normalisé en secondes).
- **Plage :** 30 secondes minimum et au maximum la Durée de cérémonie en secondes.
  - Vide : « Indiquez le temps alloué à [Prénom]. »
  - Inférieur à 30 s : « Le temps minimum est de 30 secondes. »
  - Supérieur à la durée : « Le temps dépasse la durée de la cérémonie. »
  - Format invalide : « Format attendu : secondes (ex. 90) ou mm:ss (ex. 01:30). »
- **Somme :** la somme des Temps alloués doit être égale à la Durée de cérémonie en secondes (voir FR-9 et Q3). Message : « Il manque X s pour atteindre la durée » ou « Il y a X s de trop ».

### 6.6 Fichier d'import (sauvegarde)

- **Type :** fichier `.json` uniquement. Autre extension : « Choisissez un fichier .json exporté par l'application. »
- **Taille :** 100 Ko maximum (FR-27).
- **Contenu :** JSON valide, version de schéma connue, Équipe valide selon les règles 6.1 à 6.5. Motif d'échec affiché : « Le fichier est illisible (JSON invalide). », « Version du fichier non prise en charge. », « Le fichier ne contient pas d'équipe valide. ».

---

## 7. Parcours utilisateurs et états d'erreur

### 7.1 Parcours principal (Scrum Master)

1. **Première ouverture :** écran Équipe vide. Saisie du Nom d'équipe, de la Durée (15 min par défaut), puis des Prénoms. Le temps moyen par Membre s'affiche en direct.
2. **Enregistrement :** le bouton « Enregistrer l'équipe » devient actif quand les règles sont respectées. L'écran de préparation de Session s'affiche.
3. **Préparation :** vérification de la liste, choix de la Répartition (égale par défaut), ordre des Membres. Bouton principal : « Démarrer la session ».
4. **Session :** le Membre courant et son minuteur sont au centre. Bouton plein : « Suivant ». Actions secondaires : « Pause », « Choisir un membre », « Son d'alerte », « Terminer la session ».
5. **Alerte :** au dépassement, le message « Temps dépassé » et le signal s'affichent, sans bloquer l'écran.
6. **Fin :** confirmation, puis Bilan. Actions : « Copier le bilan », « Nouvelle session ».

### 7.2 Machine d'états de la Session

| État | Entrée | Actions possibles | Sortie |
|---|---|---|---|
| Non démarrée | Équipe valide, bouton Démarrer | Démarrer, modifier l'équipe | Démarrer → En cours |
| En cours, intervention active | Démarrer, Suivant, Choisir un membre, Reprendre | Suivant, Choisir un membre, Pause, Terminer | Pause → Intervention en pause ; Terminer → Terminée |
| En cours, intervention en pause | Pause | Reprendre, Suivant, Choisir un membre, Terminer | Reprendre → Intervention active ; Terminer → Terminée |
| Terminée | Terminer confirmé | Copier le bilan, Nouvelle session | Nouvelle session → Non démarrée |

### 7.3 Parcours d'erreur et états vides

| Situation | Affichage et comportement |
|---|---|
| Équipe absente en Mémoire | Écran Équipe vide, aucun message d'erreur. |
| Moins de 2 Membres au démarrage | Bouton Démarrer désactivé, message « Ajoutez au moins 2 membres pour lancer une session. » |
| Stockage indisponible | Bandeau FR-25, Session utilisable en mémoire vive. |
| Données illisibles en Mémoire | Démarrage sans Équipe, message FR-25, proposition d'import. |
| Rechargement pendant une Intervention | Intervention mise en Pause automatiquement, message FR-16. |
| Import invalide | Message du motif (section 6.6), Équipe actuelle inchangée. |
| Presse-papiers indisponible | Champ de repli (FR-22). |
| Son bloqué par le navigateur | Alerte visuelle seule, aucun message (FR-18). |
| Horloge système qui recule | Durée ramenée à 0 pour l'Intervention, journalisée en console (FR-14). |
| Dépassement de 1 min ou plus pendant une Intervention | Le minuteur reste en « +mm:ss » en rouge ; pas de blocage. |
| Clic sur « Terminer » par erreur | Confirmation requise (FR-15). |
| Réinitialisation de l'application | Confirmation : « Effacer toutes les données de l'application sur cet appareil ? Cette action est définitive. » (FR-28). |

#### FR-28 : Réinitialiser les données

Le Scrum Master peut effacer toutes les données de l'application sur l'appareil.

**Conséquences (testables) :**
- Le bouton est accessible depuis l'écran de préparation, à l'écart du bouton principal.
- Une confirmation est demandée (voir 7.3). Sans confirmation, rien ne change.
- Après réinitialisation, l'Équipe, le réglage du son, la Session et le Bilan sont supprimés de la Mémoire. L'écran Équipe vide est affiché.

---

## 8. Risques, dépendances et questions ouvertes

### 8.1 Risques

| # | Risque | Impact | Probabilité | Mesure |
|---|---|---|---|---|
| R1 | Dérive du minuteur en arrière-plan ou en veille (mobile) | Temps de parole faux, contestation | Élevée | Mesure par horodatage (FR-14), test à horloge simulée, test E2E onglet masqué. |
| R2 | Perte des données (fermeture, quota, navigation privée) | Ressaisie, frustration | Moyenne | Enregistrement à chaque changement, bandeau FR-25, export (FR-26). |
| R3 | Chemins cassés sur GitHub Pages | Application inaccessible en ligne | Moyenne | Base href au build, test de déploiement en CI (NFR-4). |
| R4 | Son bloqué par les navigateurs (notamment iOS) | Alerte non entendue | Élevée | Alerte visuelle principale, son en amélioration, initialisation au clic (FR-18). |
| R5 | Écran qui se met en veille pendant la Session | Session interrompue, temps perdu | Élevée | Reprise automatique (FR-16) ; wake lock hors V1 (Q6). |
| R6 | Usage perçu comme de la surveillance ou de la pression | Rejet par l'équipe, climat dégradé | Moyenne | Ne pas afficher de classement ; bilan présenté comme information partagée ; pilote avec l'équipe avant déploiement (section 9, epic E6). |
| R7 | Attentes de synchronisation multi-appareils | Déception de l'observateur distant | Élevée | Non-objectif V1 explicite, question Q1. |
| R8 | Incohérences entre brief, architecture et UX | Retards, rework | Moyenne | Arbitrages listés en section 9 et validation par le client. |
| R9 | Mesure des KPI sans télémétrie | KPI non vérifiables | Élevée | Protocole de pilote manuel (section 9.2, « Mesure ») ; pas de collecte automatique. |

### 8.2 Dépendances

- **Techniques :** Angular 20 (standalone, signals), `@angular/pwa` (service worker et manifeste), Vitest (unitaire), Playwright (E2E), Docker et Docker Compose, GitHub Actions, GitHub Pages.
- **Navigateurs :** APIs Web Storage (`localStorage`), Clipboard, Web Audio, Service Worker, Blob (export), FileReader (import).
- **Plateforme :** un dépôt GitHub public ou un plan permettant GitHub Pages, et `gh auth login` pour le déploiement automatique (état actuel : en attente).
- **Client :** validation des arbitrages et des questions ouvertes (section 8.3) avant la fin de l'epic E3.

### 8.3 Questions ouvertes

Ces questions doivent être tranchées par le client. Les plus importantes sont numérotées en premier.

1. **Q1 (vue des observateurs) :** la V1 suffit-elle avec un seul appareil partagé à l'écran, ou faut-il qu'un observateur consulte la Session depuis son propre appareil, même en lecture seule ? Cette seconde option implique un serveur ou une synchronisation, donc une refonte d'architecture et de l'hypothèse de confidentialité NFR-8.
2. **Q2 (temps alloué et interventions multiples) :** le Temps alloué est-il un total de session par Membre (comportement de ce PRD, H-7), ou une durée par intervention ? Et la Pause doit-elle être disponible au niveau de la Session entière, comme le brief le suggérait (RF2) ?
3. **Q3 (répartition manuelle) :** la somme des temps saisis doit-elle être exactement égale à la Durée de cérémonie (règle actuelle), ou accepte-t-on un reliquat non alloué (utile si le Scrum Master veut garder du temps libre pour une annonce) ?
4. **Q4 (plusieurs équipes) :** une seule Équipe par appareil suffit-elle en V1 (H-1), ou faut-il gérer plusieurs équipes (par exemple une par Scrum Master sur le même poste) ?
5. **Q5 (raccourci clavier) :** un raccourci pour « Suivant » (Espace ou Entrée hors champ de saisie) est-il souhaité, malgré le risque d'appui accidentel ?
6. **Q6 (veille de l'écran) :** faut-il empêcher la mise en veille pendant la Session (API Wake Lock, prise en charge partielle selon les navigateurs) ? Non prévu en V1.
7. **Q7 (avertissement avant dépassement) :** un signal à 30 secondes de la fin de l'Intervention est-il souhaité ? Non prévu en V1 pour limiter le périmètre.
8. **Q8 (ordre de passage) :** l'ordre est-il toujours celui de la liste, ou le Scrum Master préfère-t-il un tirage aléatoire au début de la Session ?

### 8.4 Incohérences et arbitrages entre documents

- **Pause (brief RF2 contre UX) :** arbitré en FR-13 : Pause par Intervention, pas par Session. Soumis à Q2.
- **Export/import :** présent dans la décision 2 de l'architecture, absent de la liste de périmètre du brief. Retenu en V1 (FR-26, FR-27), car il répond à la question de persistance du brief et au besoin de sauvegarde sans serveur.
- **Taille de l'équipe :** le brief fixe 2 à 15 membres sans justification. Conservé (H-3), à confirmer avec le client sur des équipes réelles.
- **Affichage de la Durée moyenne :** le brief parle de durée « par défaut 15 minutes » ; le UX dit « le temps par personne s'affiche en direct ». Précisé en FR-7 et FR-8.
- **Horodatage :** l'architecture impose `Date.now()`. Ce PRD l'accepte pour la persistance, mais constate que `Date.now()` peut sauter si l'horloge système est modifiée. L'architecte peut combiner `performance.now()` pour les durées en cours et `Date.now()` pour la persistance (FR-14, H-10).

### 8.5 Non-objectifs (hors périmètre V1, avec justification)

- **Comptes utilisateurs et authentification :** pas de serveur en V1 ; la valeur de l'outil ne dépend pas d'un compte.
- **Synchronisation entre appareils :** dépend de Q1 ; incompatible avec NFR-8 sans serveur.
- **Intégration Jira, Teams, Slack ou Zoom :** hors cœur de métier (la mesure du temps). À reconsidérer après pilote.
- **Statistiques sur plusieurs semaines :** demande un historique et une éthique à définir ; non prioritaire pour la V1.
- **Notifications système, vibrations, wake lock :** dépendent de Q6 et des capacités de chaque plateforme.
- **Thème personnalisé, animations, sons personnalisables :** cités comme hors périmètre UX V1.
- **Classement ou comparaison des Membres :** volontairement exclu pour limiter la pression sociale (voir R6 et SM-C2).
- **Traduction en d'autres langues :** interface française uniquement.

---

## 9. Périmètre V1, objectifs et découpage en epics

### 9.1 Périmètre V1

**Dans le périmètre :**
- Gestion de l'Équipe, des Membres et de leur ordre (FR-1 à FR-6).
- Durée de cérémonie et deux modes de Répartition (FR-7 à FR-9).
- Session avec passage de parole, choix d'un Membre, Pause, minuteur et fin de Session (FR-10 à FR-16).
- Alerte visuelle, textuelle et sonore, non bloquante (FR-17 à FR-19).
- Bilan, copie texte et copie de repli, conservation du dernier bilan (FR-20 à FR-23).
- Mémoire locale, erreurs de stockage, export et import, réinitialisation (FR-24 à FR-28).
- PWA installable, hors ligne, responsive, accessible, déployée sur GitHub Pages (NFR-1 à NFR-22).

**Justification de l'export et de l'import :** ils ne sont pas dans le brief mais sont retenus par l'architecture (décision 2). Sans eux, une perte de données du navigateur fait perdre toute l'équipe, ce qui contredit l'objectif de mémoire.

### 9.2 Objectifs mesurables (KPI) et critères de succès

**Mesure :** l'application ne collecte aucune donnée (NFR-8). Les KPI sont donc mesurés par des tests automatisés pour ce qui est technique, et par un pilote encadré pour ce qui est d'usage (R9).

**Primaires**

- **SM-1 (respect du créneau) :** au moins 80 % des Daily pilotés se terminent dans la Durée de cérémonie, à 1 minute près. Mesure : auto-déclaration du Scrum Master après chaque Daily pendant 4 semaines, sur 2 équipes pilotes. Valide FR-10, FR-11, FR-17, FR-20.
- **SM-2 (temps de mise en route) :** un Scrum Master configure une équipe de 6 Membres et démarre une session en moins de 2 minutes, lors d'un test chronométré avec 5 personnes. Valide FR-1, FR-7, FR-8, FR-10.
- **SM-3 (autonomie) :** au moins 90 % des tests utilisateurs réussissent le parcours complet (créer, lancer, passer la parole, terminer, copier le bilan) sans aide. Valide UJ-1 à UJ-4.

**Secondaires**

- **SM-4 (justesse de la mesure) :** écart inférieur à 1 seconde sur 15 minutes de Session, onglet masqué inclus. Mesure : test automatisé à horloge simulée. Valide FR-14, NFR-6.
- **SM-5 (hors ligne) :** 100 % des parcours principaux réussis en mode hors ligne après le premier chargement. Mesure : test E2E réseau coupé. Valide NFR-2.
- **SM-6 (accessibilité) :** zéro violation de niveau critique ou grave dans axe-core sur les écrans Équipe, Session et Bilan ; score Lighthouse Accessibilité supérieur ou égal à 95. Valide NFR-11 à NFR-17.
- **SM-7 (installation) :** Lighthouse « Installable » validé en CI à chaque build de production. Valide NFR-1.
- **SM-8 (confidentialité) :** zéro requête sortante hors de l'origine pendant le parcours complet. Valide NFR-8.

**Contre-métriques (à ne pas optimiser)**

- **SM-C1 :** temps de parole moyen par Membre. Ne doit pas être utilisé comme objectif individuel ; il sert à voir l'équilibre de l'équipe, pas à évaluer une personne. Contrebalance SM-1.
- **SM-C2 :** nombre d'alertes déclenchées. Une alerte qui se déclenche souvent ne prouve pas l'efficacité de l'outil ; il ne faut pas la réduire en assouplissant la mesure. Contrebalance SM-1.
- **SM-C3 :** nombre de fonctionnalités. La V1 ne doit pas grossir pour améliorer les KPI d'usage ; toute demande passe par les non-objectifs de la section 8.5.

**Critère de succès global de la V1 :** SM-1 et SM-3 atteints sur le pilote, SM-4, SM-5, SM-7 et SM-8 validés automatiquement, et aucun blocage de l'équipe pilote pendant 4 semaines.

### 9.3 Découpage en epics

Chaque epic couvre un ensemble cohérent de FR. Le critère de fin de l'epic est la condition de passage à l'epic suivant.

**Epic E1 : Socle PWA, déploiement et hors ligne**
- **Objectif :** une application installable, hors ligne et publiée sur GitHub Pages, même vide.
- **FR couverts :** aucun FR fonctionnel ; NFR-1, NFR-2, NFR-3, NFR-4, NFR-8, NFR-9, NFR-17, NFR-18, NFR-20, NFR-21, NFR-22.
- **Critère de fin :** build de production installable, déployé sur GitHub Pages, test hors ligne et test d'absence de requête tierce verts en CI.

**Epic E2 : Équipe et Mémoire**
- **Objectif :** créer, modifier et retrouver une équipe.
- **FR couverts :** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-24, FR-25, FR-28.
- **Critère de fin :** une équipe créée est retrouvée après rechargement et après redémarrage du navigateur ; les règles de la section 6 (6.1 à 6.3) sont couvertes par des tests.

**Epic E3 : Durée et répartition du temps**
- **Objectif :** fixer la durée de cérémonie et répartir le temps à égalité ou à la main.
- **FR couverts :** FR-7, FR-8, FR-9 ; règles 6.4 et 6.5.
- **Critère de fin :** la somme des Temps alloués égale la Durée de cérémonie dans tous les cas testés (dont 15 min / 7 membres et 1 min / 2 membres) ; Q3 tranchée.

**Epic E4 : Session et minuteur d'Intervention**
- **Objectif :** dérouler la parole, mesurer le temps réel, gérer la Pause et la reprise.
- **FR couverts :** FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, FR-16.
- **Critère de fin :** test à horloge simulée (SM-4) vert ; reprise après rechargement vérifiée ; Q2 tranchée.

**Epic E5 : Alerte de dépassement**
- **Objectif :** signaler le dépassement sans bloquer, par un signal visuel, textuel et sonore.
- **FR couverts :** FR-17, FR-18, FR-19.
- **Critère de fin :** alerte annoncée par lecteur d'écran, son déclenché une seule fois par dépassement, aucun blocage d'interface testé.

**Epic E6 : Bilan, partage et portabilité**
- **Objectif :** présenter le bilan, le copier et sauvegarder l'équipe.
- **FR couverts :** FR-20, FR-21, FR-22, FR-23, FR-26, FR-27.
- **Critère de fin :** copie texte validée sur Chrome, Safari et Firefox ; import et export d'une équipe valides ; pilote de 4 semaines lancé avec 2 équipes (SM-1 à SM-3).

**Couverture :** les FR-1 à FR-28 sont tous couverts par au moins un epic :
E2 (FR-1 à FR-6, FR-24, FR-25, FR-28), E3 (FR-7 à FR-9), E4 (FR-10 à FR-16), E5 (FR-17 à FR-19), E6 (FR-20 à FR-23, FR-26, FR-27), E1 (socle non fonctionnel).

---

## Hypothèses

Les hypothèses ci-dessous sont à confirmer par le client. Chacune est référencée dans le texte.

- **H-1 :** une seule Équipe active par appareil en V1 (FR-1, Q4).
- **H-2 :** pas de synchronisation : une Session se déroule sur un seul appareil, éventuellement partagé à l'écran avec les observateurs (Q1).
- **H-3 :** taille d'équipe de 2 à 15 Membres, repris du brief sans validation terrain (FR-1, section 6.2).
- **H-4 :** Durée de cérémonie de 1 à 120 minutes, pas de 1 minute, valeur par défaut 15 minutes (FR-7).
- **H-5 :** Temps alloué minimal de 30 secondes par Membre (FR-7, FR-9, section 6.5).
- **H-6 :** ordre de passage = ordre de la liste, en cycle ; choix manuel d'un Membre possible (FR-11, FR-12, Q8).
- **H-7 :** le Temps alloué est un total de Session par Membre, cumulé sur toutes ses Interventions (FR-11, FR-17, Q2).
- **H-8 :** la Pause ne concerne que l'Intervention en cours (FR-13, Q2).
- **H-9 :** navigateurs cibles listés en NFR-19.
- **H-10 :** `Date.now()` est acceptable pour la persistance ; les durées en cours peuvent utiliser une horloge monotone (section 8.4, FR-14).
- **H-11 :** interface uniquement en français en V1 (NFR-17, NFR-20).
- **H-12 :** le son d'alerte est un signal court généré dans le navigateur, sans fichier audio externe (FR-18).
- **H-13 :** l'unicité des Prénoms est insensible à la casse et aux espaces, mais sensible aux accents (section 6.3).
- **H-14 :** l'alerte est déclenchée une fois par dépassement et par Intervention (FR-17).
- **H-15 :** à la réouverture, une Intervention en cours est mise en Pause et le temps de la fermeture n'est pas compté (FR-16).
- **H-16 :** le Bilan est conservé jusqu'au démarrage d'une nouvelle Session, sans historique (FR-23).
- **H-17 :** poids maximal de 300 Ko compressés pour le JavaScript initial, à valider par l'architecte (NFR-5).

---

## Index des questions ouvertes

| Réf. | Question | Impact si non tranchée | Epic concerné |
|---|---|---|---|
| Q1 | Observateurs sur un second appareil ? | Architecture et confidentialité | E1, E4 |
| Q2 | Temps alloué global ou par intervention ; Pause au niveau session ? | Modèle de données, bilan | E4, E6 |
| Q3 | Somme manuelle exacte ou reliquat autorisé ? | Règles de répartition | E3 |
| Q4 | Plusieurs équipes par appareil ? | Modèle de stockage | E2 |
| Q5 | Raccourci clavier pour « Suivant » ? | Accessibilité, ergonomie | E4 |
| Q6 | Empêcher la mise en veille ? | Compatibilité navigateurs | E4 |
| Q7 | Avertissement à 30 s de la fin ? | Périmètre | E5 |
| Q8 | Ordre de passage fixe ou aléatoire ? | Règles de passage | E4 |
