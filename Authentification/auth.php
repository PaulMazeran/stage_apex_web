<?php
    // En fonction du serveur web utilise, pensez a changer les parametres :
    // EasyPHP ou MAMP

    //Centralisation de la connexion à la base de données
    require "../connexionBDD.php";

    // if(!$link) {
    //   die('ERREUR DE CONNECTION');
    // }else {
    //   echo 'SUCCES';
    // }

    foreach ( $_POST as $post => $val )  {
         $post = $val;
     };

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
?>
