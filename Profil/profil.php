<?php
//Centralisation de la connexion à la base de données
    require "../connexionBDD.php";

    foreach ( $_POST as $post => $val )  {
        $post = $val;
    };

    if("emailtoupgrade"!=""){

    // Creation requete SQL
    $sql = "SELECT email, name FROM user WHERE email = '$val'";
    $result = mysqli_query($link, $sql);

    // Initialisation variable resultat
    $data = [];

    // si un resultat existe
    if($result){

        while($ligne = mysqli_fetch_assoc($result)){
        $data = $ligne ;
       }
       // Envoie resultat
       echo json_encode($data);
     }



        }


?>
