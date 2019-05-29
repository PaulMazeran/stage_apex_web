<?php
//Centralisation de la connexion à la base de données
    require "../connexionBDD.php";



    foreach ( $_POST as $post => $val )  {
        $post = $val;
    };

    if ($_POST['structuretoupdatetxt'] !=""){
        // Creation requete SQL "modifier le nom de la stucture"
        $sql = "UPDATE user SET structure = "."'".$_POST['structuretoupdatetxt']."'"." WHERE email = "."'".$_POST['email']."'"."";
        $result = mysqli_query($link, $sql);
        echo json_encode($sql);
        }
    

    if ($_POST['usernametoupgradetxt'] !=""){
        // Creation requete SQL "modifier le nom d'utilisateur"
            $sql = "UPDATE user SET name = "."'".$_POST['usernametoupgradetxt']."'"." WHERE email = "."'".$_POST['email']."'"."";
            $result = mysqli_query($link, $sql);
            echo json_encode($sql);
        }
    


    if ($_POST['emailtoupgradetxt'] !=""){
        // Creation requete SQL "modifier le nom d'utilisateur"
        $sql = "UPDATE user SET email = "."'".$_POST['emailtoupgradetxt']."'"." WHERE email = "."'".$_POST['email']."'"."";
        $result = mysqli_query($link, $sql);
        echo json_encode($sql);
        }







?>
