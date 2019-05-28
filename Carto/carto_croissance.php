<?php
/* Ce fichier php renvoie les informations des dernieres sessions réalisées sur chaque parcelle de l'utilisateur connecté*/

//Centralisation de la connexion à la base de données
require "../connexionBDD.php";


// Récupération de l'adresse mail de l'utilisateur stocké dans le $_POST
foreach ( $_POST as $post => $val )  {
    $$post = $val;
};

// Récupération de l'id de l'utilisateur, lié à son mail
$sql1 = "SELECT u.idUser FROM user u WHERE email = '$val'";
$result1 = mysqli_query($link, $sql1);
if($result1){
   while($ligne1=mysqli_fetch_assoc($result1))
   {
     $id = $ligne1['idUser'];
  }
}

// Récupération des noms des différentes parcelles de cet utilisateur
$requete = "SELECT distinct s.nomParcelle FROM user u LEFT JOIN session s ON s.userId = u.idUser  WHERE  idUser = '$id'";
$result2 = mysqli_query($link, $requete);

// Formatage des résultats pour un retour en JSON
$array = array();

if ($result2) {
  while ($data = mysqli_fetch_assoc($result2)) {
     array_push($array,$data);
   }
}

$array_infos = array();

for ($i = 1; $i <= sizeof($array); $i++){ //on parcours l'ensemble des parcelles de l'utilisateur
  //on récupère le nom
  $nomP = $array[$i - 1]['nomParcelle'];
  //on récupère les informations sur la dernière session réalisée sur la parcelle
  $requete_info = "SELECT s.nomParcelle, globalLatitude, globalLongitude, apexP, apexC, apexR, s.date,moyenne FROM user u LEFT JOIN session s ON s.userId = u.idUser  WHERE  s.nomParcelle = '$nomP' ORDER BY s.date DESC LIMIT 1";
  $result = mysqli_query($link, $requete_info);


  if ($result) {
    while ($data = mysqli_fetch_assoc($result)) {
         array_push($array_infos,$data);
    }
  }
}
echo (json_encode($array_infos));

?>
