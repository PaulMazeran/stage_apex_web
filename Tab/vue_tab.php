<?php
/* Ce php construit les élements html du tableau contenant les informations sur les parcelles de l'utilisateur */

//Centralisation de la connexion à la base de données
require "../connexionBDD.php";



    /* Récupération de l'adresse mail de l'utilisateur */
    foreach ( $_POST as $post => $val )  {
         $$post = $val;
     };
    /* Récupération de l'id de l'utilisateur */
    $sql1 = "SELECT u.idUser FROM user u WHERE email = '$val'";
    $result1 = mysqli_query($link, $sql1);
    if($result1){
       while($ligne1=mysqli_fetch_assoc($result1))
       {
         $id = $ligne1['idUser'];
      }
    }
    /*Création d'une sortie contenant les élements html à inserer directement dans la div (dans le js) prévue pour le tableau */
    $out = "</div>";
    $out .= "<div id = 'info_parcelle'>";
    $out .= "<h3> Informations sur vos parcelles : </h3>";
    $out .= "<table class='table table-striped' id = 'table'>";
    $out .= "<thead class='thead-dark'>";
    $out .= "<tr>";
    $out .= "<th id = 'parcelle' name ='entete' style ='display:table-cell'> Parcelle  </th>";
    $out .= "<th name = 'entete' id ='date' style ='display:table-cell'> Date  </th>";
    $out .= "<th name = 'entete' id ='nombre_apexP'style ='display:table-cell' > Nombre apexP  </th>";
    $out .= "<th name= 'entete' id ='nombre_apexR' style ='display:table-cell'> Nombre apexR  </th>";
    $out .= "<th name = 'entete' id ='nombre_apexC' style ='display:table-cell'> Nombre apexC  </th>";
    $out .= "<th name = 'entete' id ='moyenne' style ='display:table-cell'> Moyenne  </th>";
    $out .= "<th name = 'entete' id ='taux_apexP' style ='display:table-cell'> tauxApexP (%) </th>";
    $out .= "<th name = 'entete' id ='taux_apexR' style ='display:table-cell'> tauxApexR (%) </th>";
    $out .= "<th name = 'entete' id ='taux_apexC' style ='display:table-cell'> tauxApexC (%) </th>";
    $out .= "</tr>";
    $out .= "</thead>";
    $out .= "<tbody>";

    /* Récupération des infos sur les parcelles de l'utilisateur*/
    $sql2 = "SELECT s.nomParcelle,s.date,s.moyenne,s.tauxApexP,s.apexP,s.apexR,s.apexC FROM user u LEFT JOIN session s ON s.userId = u.idUser  WHERE  idUser = '$id' ORDER BY s.nomParcelle";


    $result2 = mysqli_query($link, $sql2);

    if($result2){

        while($ligne2=mysqli_fetch_assoc($result2))
        {
        $somme = $ligne2['apexP'] + $ligne2['apexR'] + $ligne2['apexC'];
        if ($somme == 0) {

          $taux_apexP =  0;
          $taux_apexR = 0;
          $taux_apexC = 0;
        } else {

          $taux_apexP =  (int)(($ligne2['apexP']/$somme)*100);
          $taux_apexR = (int)(($ligne2['apexR']/$somme)*100);
          $taux_apexC = (int)(($ligne2['apexC']/$somme)*100);
        };
        // Remplissage du tableau dont la formation a commencé précédemment
        $ides = ($ligne2['nomParcelle']);
        $ide =str_replace(' ','',$ides);
        $out.= "<tr id =".($ide).">";
        $out.= "<td id ='parcelle' name ='parcelle' style ='display:table-cell' class =".($ide).">".($ligne2['nomParcelle'])."</td>";
        $out.= "<td id = 'date' name = 'date' style ='display:table-cell' class =".($ide).">".(date('d/m/y h:m:s',$ligne2['date']))."</td>";
        $out.= "<td id = 'nombre_apexP' name ='nombre_apexP' style ='display:table-cell' class =".($ide).">".($ligne2['apexP'])."</td>";
        $out.= "<td id = 'nombre_apexR' name = 'nombre_apexR' style ='display:table-cell' class =".($ide).">".($ligne2['apexR'])."</td>";
        $out.= "<td id = 'nombre_apexC' name = 'nombre_apexC' style ='display:table-cell' class =".($ide).">".($ligne2['apexC'])."</td>";
        $out.= "<td id = 'moyenne' name = 'moyenne' style ='display:table-cell' class =".($ide).">".($ligne2['moyenne'])."</td>";
        $out.= "<td id = 'taux_apexP' name = 'taux_apexP' style ='display:table-cell' class =".($ide).">".($taux_apexP)."</td>";
        $out.= "<td id = 'taux_apexR' name = 'taux_apexR' style ='display:table-cell' class =".($ide).">".($taux_apexR)."</td>";
        $out.= "<td id = 'taux_apexC' name = 'taux_apexC' style ='display:table-cell' class =".($ide).">".($taux_apexC)."</td>";
       }
    }


    $out.= "</tbody>";
    $out.= "</table>";
    $out.= "</div>";
    echo $out;




?>
