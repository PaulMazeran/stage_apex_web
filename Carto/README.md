#  CARTOGRAPHIE DE LA CROISSANCE ET DE LA CONTRAINTE HYDRIQUE


**Les deux pages fonctionnent sur le même principe.** Exemple avec la page de cartographie de la croissance

##### 1. Affichage des marqueurs sur la carte
---
Une première partie du code, après le chargement de la carte, concerne l'affichage des marqueurs sur la carte.
Chaque marqueur affiché est localisé à l'endroit où a été réalisé la dernière session sur chaque parcelle, il n'y a donc qu'un marqueur par parcelle.

Pour afficher les marqueurs le code fait appel au fichier 'carto_croissance.php' qui récupère dans la base de données les informations de la dernière session effectuée sur chaque parcelle.
La réponse de cette requête AJAX (un fichier JSON) est parcourue, et pour chaque ligne du JSON (chaque parcelle) un marqueur est affiché et les données de la dernière session sont stockées dans l'élément 'feat' du marqueur. 

##### 2. Clique sur un marqueur
---
Lorsque l'utilisateur clique sur un des marqueurs affichés une fonction permet d'afficher à droite des informations sur la dernière session. Pour afficher ces informations, la fonction 'affichData()' utilise les informations contenues dans l'élément 'feat' du marker.
Un menu déroulant est aussi rempli avec les dates des différentes sessions effectuées sur la parcelle. La fonction 'infos_parcelle()', prépare l'affichage d'un diagramme associé à la parcelle et récupère dans la base de données via une requête AJAX et un fichier JSON toutes les informations liées aux sessions réalisées sur la parcelle. Ce fichier est stocké dans une variable globale 'fichier_i'.

##### 3. Changement de date dans le menu déroulant
---
Lorsque l'utilisateur choisi une autre date dans le menu déroulant, la fonction 'infos_parcelle()' selectionne la ligne dans 'fichier_i' qui correspond aux informations sur la session réalisée à la date choisie par l'utilisateur et remplace le 'feat' du marqueur par ces informations. Cette fonction en lance alors une autre qui modifie la position du marqueur pour l'afficher à l'endroit où a été réalisé la session sélectionnée. 

##### 4. Affichage du graphique temporel
---
Le graphique de suivi temporel de la croissance ou de la contrainte hydrique est situé sous la carte. Sa structure existe au chargement de la page et est définie grâce à la fonction 'setLineGraph()'. Deux menus déroulants sont placés juste avant le graphique et vont permettre à l'utilisateur de sélectionner l'étendue temporelle qu'il souhaite visualiser.

Lorsque ce dernier clique sur un marqueur, le premier menu déroulant (date de début) est rempli avec les dates de toutes les sessions réalisées sur la dite parcelle, de la même manière que celui présent pour les observations (cf supra). Une fois la date de début choisie, le deuxième menu déroulant se rempli lui aussi mais ne propose que les dates ultérieures à celle choisie par l'utilisateur (inclue). Lorque les dates de début et de fin ont été sélectionnées par l'utilisateur, la fonction 'updateLineGraph()' s'exécute pour générer/modifier les données affichées dans le graphique.

Il est possible pour l'utilisateur de modifier l'étendue temporelle de deux manières :
a) En changeant la date de fin dans le deuxième menu déroulant. Cela ne change pas la date de début et le graphique se re-génère directement.
b) En changeant la date de début dans le premier menu déroulant. Il faudra alors sélectionner de nouveau une date de fin parmis les nouvelles dates proposées. Une fois cette dernière choisie, le graphique se re-génère automatiquement.

Enfin, la librairie Chart.js utilisée permet à l'utilisateur de masquer des jeux de données parmis ceux déjà affichés en cliquant simplement sur leurs légendes respectives. Un nouveau click permet de les afficher de nouveaux (ici on ne modifie pas l'étendue temporelle).