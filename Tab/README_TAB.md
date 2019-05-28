# VUE TABULAIRE 


##### 1. Choix des parcelles 

L'utilisateur peut faire un choix sur les parcelles qu'il veut afficher. 
La première partie du code permet donc de faire ce choix. Il faut noter que tous les boutons qui permettent de cocher une seule parcelle sont du code html issu du fichier php : checkbox_parcelle.html.
Tandis que le bouton qui permet de cocher toutes les parcelles d'un coup est écrit directement en html.
Le fichier checkbox_parcelles.php effectue les requêtes vers la Base de données. 

##### 2. Choix des indices

Contrairement à précédemment, le code html n'est pas issu du fichier php correspondant. Donc le tableau est codé directement dans le html car les indices sont toujours les mêmes et ne dépendent pas du nombre de parcelle de l'utilisateur. Les checkboxs sont traités dans le fichier JavaScript et permettent d'afficher les données sélectionnées dans le tableau.

##### 3. Affichage du tableau

Ici encore une fois le code html du tableau est issu du fichier php correspondant : vue_tab.php. Fichier qui fait également les appels à la base de données. On peut donc déterminer grâce aux checkboxs quelles indices et quelles parcelles l'utilisateur veut voir dans le tableau. 