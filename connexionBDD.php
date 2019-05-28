<?php

// En fonction du serveur web utilise, pensez a changer les parametres :
// MamP ou EasyPHP

    //Connexion à la base de données
    $server = "localhost";  // localhost  // "127.0.0.1"
    $user= "root";           // "root"      // "root"
    $pass= "";           // "root"      // ""
    $bdd= "stageapexweb";
    $link = mysqli_connect($server, $user, $pass, $bdd);

    // if(!$link) {
    //   die('ERREUR DE CONNECTION');
    // }else {
    //   echo 'SUCCES';
    // }


    mysqli_set_charset($link,"utf8");

?>
