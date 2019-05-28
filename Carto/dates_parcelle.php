<?php
/* Ce fichier php renvoie les dates où on été réalisées les sessions sur une parcelle*/

// Centralisation de la connexion à la base de données
require "../connexionBDD.php";


if(!$link) {
  die('ERREUR DE CONNECTION');
}else {
  $nomParcelle = $_POST['nomParcelle']; //parcelle à laquelle on s'interesse

// On récupère les différentes dates de mesure sur cette parcelle
$requete_info = "SELECT s.date FROM session as s WHERE s.nomParcelle = '$nomParcelle' ORDER BY s.date DESC" ;
$result = mysqli_query($link, $requete_info);

$array_infos = array();

  if ($result) {
    $out = "";
    while ($data = mysqli_fetch_assoc($result)) {
      // On rajoute dynamiquement des options contenant les dates au menu déroulant
      $out .= $data["date"].";";
      }
} echo $out;
}

?>
