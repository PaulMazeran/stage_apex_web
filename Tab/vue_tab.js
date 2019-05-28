console.log('vue tab: ' + auth.currentUser);
/* Recuperation de Firebase */
var auth = firebase.auth();
var user = auth.currentUser ;

/**
  * Ecoute les changements possible sur le statut utilisateur Firebase
  *
  * @param user L utilisateur Firebase
*/
auth.onAuthStateChanged(function(user){
  // Ecoute les changements de statuts d authentification
  if(user) {
    console.log('vue tab 2: ');
    console.log(user);

    // Identification de l'utilisateur par son adresse mail
    var email = user.email;

    var data = 'email' + '=' + email;

    /** Cette fonction affiche un tableau qui contient différentes informations sur des parcelles pour des sessions différentes
    *@param {string}: l'email de l'utilisateur connecté
    */
    function affiche_tab(email){
      var ajax = new XMLHttpRequest();
      ajax.open('POST', 'vue_tab.php');
      ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      ajax.addEventListener('load', function () {

        document.getElementById("tableau").innerHTML = ajax.response;

        //Affichage des checkboxs pour cocher le nom des parcelles sur lesquelles l'utlisateur veut visualiser des informations
        affiche_checkbox_parcelle(email);

        $(document).ready(function(){
          $("#export").click(function(){
            $("#table").table2csv({

              escapeContent:true,
              filename: 'mes-parcelles.csv',
              separator: ' '
            });
          });

          /* Cette partie concerne le fonctionnement des écouteurs d'évenenement sur les checkboxs des colonnes.
          A savoir : Dans le tableau, chaque élément possède un attribut id et un attribut name qui font référence à la colonne (nombre d'apexP etc..)
          et un attribut name qui fait référence au nom de la parcelle qu'il concerne.

          Il faut faire attention à la chose suivante :
          Lorsque l'utilisateur décide d'afficher un indice qui n'était précédemment pas afficher dans le tableau, il faut rajouter des éléments dans le tableau mais il faut afficher seulement les lignes des parcelles dont les checkboxs sont actives, selectionnées.

          Exemple : dans le tableau il y a seulement la colonne "nombe d'Apex P" et ces valeurs pour la parcelle 1. Si l'utilisateut active la checkbox de la parcelle 2, il faut rendre visible toutes les lignes concernant la parcelle 2 mais seulement la colonne "nombre d'apex P"
          C'est là que vont être utisé les id, name et class.

          Les checkboxs sur les colonnes sont définies dans le fichier html.
          */


        //Parcours de tout les élements html qui ont pour class 'checkbox colonne' = toutes les checbox qui gèrent les colonnes
        $(".checkbox_colonne").each(function(){


          this.onchange = function() { //lorsque une checkbox est activée ou désactivée


            var id_check = this.id; //id_check stocke l'id de la checkbox qui a changé d'état (exemple d'id : "nombre_Apex_P")
            var check = this.checked; //check stocke la valeur true ou false qui détermine l'état de la checkbox (active ou non)

            //Gestion des entetes
            entete = document.getElementsByName('entete'); //récupération de toutes les entetes du tableau (elles ont toutes pour name : "entete")

            length = entete.length;


            for (var i = 0 ; i < elementsLength ; i++) {
              if (entete.item(i) != null){


                if (entete.item(i).id == id_check){  //entete.item(i).id est par exemple : "nombre_Apex_P", si il s'agit de l'entete de la colonne dont la checkbox vient d'être modifiée

                  if (check == false){ //si l'état de la checkbox est devenue false
                  entete.item(i).style.display = 'none' //on masque l'entete (on ne veut plus afficher la colonne donc on commence par masquer l'entete)
                  }
                  else { //si l'état de la checkbox est devenue true
                  entete.item(i).style.display = 'table-cell' //on affiche l'entete (on veut afficher la colonne donc on commence par afficher l'entete)
                  }
                }
              }
            }

            //Affichage ou masquage de la colonne dont l'état de la checkbox a été modifiée
            //Attention : Si la checkbox concernant la colonne "nombre_Apex_P" est devenue true on veut afficher seulement les valeurs du "nombre_Apex_P" pour les parcelles dont les chekcboxs sont activées.
            $(".checkbox_parcelle").each(function(){ //parcours des checkboxs des parcelles

              if (this.checked == true){ //Si la checkbox est checkée

                var child = document.getElementsByClassName(this.id); //on récupère toutes les informations sur la parcelle, un élément de child = un élément du tableau (à ne pas confondre avec une ligne ou une colonne entière). La classe de l'élement = le nom de la parcelle, c'est comme ca qu'on le récupère ici
                elementsLength = child.length;

                for (var i = 0 ; i < elementsLength ; i++) { //parcours des éléments de child

                if (child[i].id == id_check){ // si l'élément a le même id que la checkbox qui vient d'etre activée ou désactivée. Par exemple, id_check = "nombre_Apex_P", pour rappel c'est l'id de la checkbox dont l'état a changé.

                   if (check == true){ //Si la checkbox a été cochée
                     child[i].style.display = 'table-cell'; //on affiche l'élément

                   }
                   else {child[i].style.display = 'none';} //inversement


                }
              }
            }});
          };
        });



      });
    });
    var data = 'email' + '=' + email;
    ajax.send(data);
    };

  }

affiche_tab(email);

});

/** Cette fonction affiche les checkbox permettant de cocher ou non certaines colonnes
*@param {string}: l'email de l'utilisateur connecté
*/
function affiche_checkbox_parcelle(email){
  var ajax = new XMLHttpRequest();
  ajax.open('POST', 'checkbox_parcelle.php');
  ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  ajax.addEventListener('load', function () {

    document.getElementById("checkbox_parcelle").innerHTML = ajax.response;

    /* Cette partie concerne le fonctionnement des écouteurs d'évenenement sur les checkboxs des colonnes.
    A savoir : Dans le tableau, chaque élément possède un attribut id et un attribut name qui font référence à la colonne (nombre d'apexP etc..)
    et un attribut name qui fait référence au nom de la parcelle qu'il concerne.

    Il faut faire attention à la chose suivante :
    Lorsque l'utilisateur décide d'afficher une nouvelle parcelle dans le tableau il faut n'afficher que les colonnes dont les checkboxs sont actives, selectionnées.


    Les checkboxs sur les parcelles sont définies dans le fichier checkbox_parcelle.php.
    */


    $(".checkbox_parcelle").each(function(){ //lorsque une checkbox est activée ou désactivée

      this.onchange = function() {
        var id_check = this.id; //id_check stocke l'id de la checkbox qui a changé d'état (exemple d'id : "parcelle 1")
        var check = this.checked; //check stocke la valeur true ou false qui détermine l'état de la checkbox (active ou non)

        //Affichage ou masquage de la parcelle dont l'état de la checkbox a été modifiée

        //Peu importe les colonnes checkées ou non, on veut afficher/masquer le nom de la parcelle et la date des sessions correspondant à la checkboxs qui a été activée ou désactivée.
        var parcelle = document.getElementsByName('parcelle');
        lengthP = parcelle.length;
        for (var i = 0 ; i < lengthP ; i++) {
          if (parcelle[i].className == id_check){ // si l'élément concerne une parcele cochée

            if (check == true){
              parcelle[i].style.display = 'table-cell';

            }
            else {parcelle[i].style.display = 'none';}
            }
          }

        var date = document.getElementsByName('date');
        lengthD = date.length;
        for (var i = 0 ; i < lengthD ; i++) {
          if (date[i].className == id_check){

            if (check == true){
              date[i].style.display = 'table-cell';

            }
            else {date[i].style.display = 'none';}
          }
        }

        $(".checkbox_colonne").each(function(){ //parcours des checkboxs des colonnes
        //Si seules les checkboxs nombre d'apex P et nombre d'apex C sont checkées alors on va afficher/masquer seulement ces valeurs (pas les autres colonnes !) dans le tableau pour toutes les sessions pour la parcelle 1 (autant de ligne ajoutées/masquer que de sessions)


          if (this.checked == true){ //Si la checkbox (de la colonne) est checkée (car on se s'occupe pas d'afficher des éléments concernant les colonnes que l'utilisateur n'a pas checkées)
                                     //par exemple : "Nombre d'apex P est checkée"

            var child = document.getElementsByName(this.id); //on récupère toutes les informations lié à un indice, un élément de child = un élément du tableau (à ne pas confondre avec une ligne ou une colonne entière). L'id de l'élement = le nom de l'indice qu'il cocnerne (le nom de la colonne qu'il concerne), c'est ainsi qu'on l'identifie et qu'on le selectionne.
                                                             //on récupère toutes les valeurs de nombre d'apex P
            elementsLength = child.length;

            for (var i = 0 ; i < elementsLength ; i++) { //parcours des éléments de child

              // AFFICHAGE OU MASQUAGE DES INFORMATIONS SUR LA PARCELLE DONT L'UTILISATEUR VIENT DE MODIFIER L'ETAT DE LA CHECKBOX (dans l'exemple : parcelle 1)

              if (child[i].className == id_check){ // si l'élément a la même classe que la checkbox qui vient d'etre activée ou désactivée = Si l'élément concerne la parcelle dont la checkbox vient d'être checkée ou dé-checkée
                                                  // on ne va s'interesser qu'aux valeurs de nombre d'apex P associées à la parcelle 1 dont l'utilisateur vient de checker ou non la checkbox

                if (check == true){ //Si la checkbox (concernant les parcelles a été cochée
                  child[i].style.display = 'table-cell'; //on affiche l'élément

                }
                else {child[i].style.display = 'none';}


              }
            }
        }});

      };

    });
    /*
    Ecoute du bouton qui permet d'afficher d'un coup toutes les parcelles dans le tableau

    Attention : lorsque l'utilisateur décide d'afficher les informations sur toutes les parcelles, on n'affiche pas les valeurs correspondantes aux colonnes décochées (menu checkboxs des colonnes)

    */

    $(".switch_all").each(function(){

      this.onchange = function() { //ecouteur de l'évenement 'le bouton switch_all est modifié'
      var check = this.checked;  //check stocke la valeur true ou false qui détermine l'état de la checkbox (active ou non)


          $(".checkbox_parcelle").each(function(){ //on applique un traitement à toutes les checkbox des parcelles
            this.checked = check;}) //on modifie l'attribut checked : booleen de la checkbox

          if (check == true){ //Si la checkbox "sitch all" est devenue checkée

          //AFFICHAGE DU NOM DE LA PARCELLE ET DE LA DATE POUR CHAQUE SESSION (Rappel : une ligne = une session)
           var parcelle = document.getElementsByName('parcelle');
           lengthP = parcelle.length;
           for (var i = 0 ; i < lengthP ; i++) {
           parcelle[i].style.display = 'table-cell';}

           var date = document.getElementsByName('date');
           lengthD = date.length;
           for (var i = 0 ; i < lengthD ; i++) {
           date[i].style.display = 'table-cell';}

           //Quelles colonnes sont checkées ? (on n'affiche pas les valeurs concernant les colonnes non checkées)
           $(".checkbox_colonne").each(function(){
             if (this.checked ==true){ // //Si la checkbox (de la colonne) est checkée (car on se s'occupe pas d'afficher des éléments concernant les colonnes que l'utilisateur n'a pas checkées)

               var child = document.getElementsByName(this.id);  //on récupère toutes les informations lié à un indice, un élément de child = un élément du tableau (à ne pas confondre avec une ligne ou une colonne entière). L'id de l'élement = le nom de l'indice qu'il cocnerne (le nom de la colonne qu'il concerne), c'est ainsi qu'on l'identifie et qu'on le selectionne.
               elementsLength = child.length;

               for (var i = 0 ; i < elementsLength ; i++) { //on affiche l'élement peût importe la parcelle qu'il concerne car on veut afficher les informations sur TOUTES les parcelles
                 child[i].style.display = 'table-cell';

                }
              }
            });
           }


           if (check == false){ //Si la checkbox "sitch all" est devenue non checkée

             //MASQUAGE DU NOM DE LA PARCELLE ET DE LA DATE POUR CHAQUE SESSION (Rappel : une ligne = une session)
             var parcelle = document.getElementsByName('parcelle');
             lengthP = parcelle.length;
             for (var i = 0 ; i < lengthP ; i++) {
             parcelle[i].style.display = 'none';}

             var date = document.getElementsByName('date');
             lengthD = date.length;
             for (var i = 0 ; i < lengthD ; i++) {
             date[i].style.display = 'none';}

             $(".checkbox_colonne").each(function(){
             var child = document.getElementsByName(this.id);
             elementsLength = child.length;
             for (var i = 0 ; i < elementsLength ; i++) {
                   child[i].style.display = 'none';
                 }
               });
             }

         };
       });
   });
  var data = 'email' + '=' + email;
  ajax.send(data);
};


function convertedDate(unixDate) {
  var d = new Date(unixDate*1000);
  return [unixDate,d.toLocaleDateString("fr-FR"),d.toLocaleTimeString("fr-FR")];
}
