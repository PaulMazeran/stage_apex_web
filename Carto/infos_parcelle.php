<?php
/* Ce fichier php renvoie les informations des dernieres sessions réalisées sur chaque parcelle de l'utilisateur connecté*/

//Centralisation de la connexion à la base de données
require "../connexionBDD.php";

if(!$link) {
  die('ERREUR DE CONNECTION');
}else {

  $nomParcelle = $_POST['nomParcelle'];

  $requete_info = "SELECT nomParcelle,globalLatitude,globalLongitude,s.date,apexP,apexC,apexR,moyenne FROM session as s WHERE s.nomParcelle = '$nomParcelle' ORDER BY s.date DESC" ;
  $result = mysqli_query($link, $requete_info);

  $array_infos = array();

  if ($result) {
    while ($data = mysqli_fetch_assoc($result)) {
       array_push($array_infos,$data);
      }
  echo (json_encode($array_infos));
  }
}

?>
