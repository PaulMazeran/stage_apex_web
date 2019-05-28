<?php
/* ce php construit les élements html qui constituent les checkboxs sur les parcelles */

//Centralisation de la connexion à la base de données
require "../connexionBDD.php";



    /* Récupération de l'adresse mail de l'utilisateur */
    foreach ( $_POST as $post => $val )  {
         $$post = $val;
     };
    //Récupération de l'id de l'utilisateur
    $sql1 = "SELECT u.idUser FROM user u WHERE email = '$val'";
    $result1 = mysqli_query($link, $sql1);
    if($result1){
       while($ligne1=mysqli_fetch_assoc($result1))
       {
         $id = $ligne1['idUser'];
      }
    }

    /*Récupération des noms de toutes les parcelles de l'utilisateur */

    $sql3 = "SELECT DISTINCT s.nomParcelle FROM user u LEFT JOIN session s ON s.userId = u.idUser  WHERE  idUser = '$id' ";
    $result3 = mysqli_query($link, $sql3);

    /*Création d'une sortie contenant les élements html à inserer directement dans la div (dans le js) prévue pour accueillir les checkboxs */

    $out= "<div class='card'>";

    $out.= "<div class='card-header'>  Cochez les parcelles sur lesquelles vous souhaitez visualiser des informations: </div>";
    $out.= "<ul class='list-group list_group-flush'>";

    if($result3){

        while($ligne3=mysqli_fetch_assoc($result3))
        {
        $idese = ($ligne3['nomParcelle']);
        $idee =str_replace(' ','',$idese);


        $out.= "<li class='list-group-item'>".$idee;
        $out.="<label class='switch'>";
        $out.= "<input type='checkbox' id=".$idee." name='nomParcelle' value='nomParcelle' class='checkbox_parcelle info' checked>"; //l'id de chque checkboxs est le nom de la parcelle qu'elle concerne
        $out.= "<span class='slider round'></span>";
        $out.="</label>";
       }
    }
    $out.= "</ul>";
    $out.="</div>";


    echo $out;




?>
