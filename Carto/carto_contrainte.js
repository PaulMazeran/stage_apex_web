console.log('carto contrainte: ' + auth.currentUser);
/* Recuperation de Firebase */
var auth = firebase.auth();
var user = auth.currentUser;

//CHARGEMENT CARTE
var mymap = L.map('mapid').setView([44.1725, 4.81], 8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
}).addTo(mymap);

//DEFINTION DES DIFFERENTS MARQUEURS UTILISES
var bleuIcon = L.icon({     //paramètres pour l'icone
 iconUrl: '../images/marker_bleu.png',
 iconSize: [50,50]
 });
var orangeIcon = L.icon({     //paramètres pour l'icone
 iconUrl: '../images/marker_orange.png',
 iconSize: [50,50]
 });
var redIcon = L.icon({   //paramètres pour l'icone
  iconUrl: '../images/marker_rouge.png',
  iconSize: [50, 50]
 });
var yellowIcon = L.icon({   //paramètres pour l'icone
  iconUrl: '../images/marker_jaune.png',
  iconSize: [50, 50]
 });

// INITIALISATION DIAGRAMME
var myPieChart = setPieGraph();
var myLineChart = setLineGraph();

/**
  * Ecoute les changements possible sur le statut utilisateur Firebase
  *
  * @param user L utilisateur Firebase
*/
auth.onAuthStateChanged(function(user) {
  // Ecoute les changements de statuts d'authentification
  if(user) {
    console.log('carto contrainte 2: ');
    console.log(user);

    // Identification de l'utilisateur par son adresse mail
    var email = user.email;
    
    var data = 'email' + '=' + email;

    group = {}; //Initialisation du groupe de marqueurs

    var liste_parcelle_utilisateur; //initialisation d'une variable qui stocke le nom des parcelles d'un utilisateur

    /*AFFICHAGE DES MARQUEURS (ils sont initialement positionnés à l'endroit où a été réalisée la dernière session sur chaque parcelle)*/
    var ajax = new XMLHttpRequest();
    ajax.open('POST', '../Carto/carto_croissance.php'); // fichier php à renommer ultérieurement du coup (ex: 'infos_parcelles_user.php')
    ajax.setRequestHeader('content-type','application/x-www-form-urlencoded');
    ajax.addEventListener('load', function() {

      fichier = JSON.parse(ajax.response);
      liste_parcelle_utilisateur = new Array(fichier.length);
      for (var i = 0; i < fichier.length; i++) { //parcours du fichier

          liste_parcelle_utilisateur[i] = fichier[i]['nomParcelle'];

          var stockage_info = fichier[i]; //création d'une variable dans laquelle on stocke les infos sur la parcelle et la session

          group[i] = L.marker([fichier[i]["globalLatitude"],fichier[i]["globalLongitude"]], {feat:stockage_info}).addTo(mymap);  //on insère dans le marqueur les infos

          etat = calcContrainte(fichier[i],false);

          if (etat=="absente"){
            group[i].setIcon(bleuIcon);

          }
          else if (etat=="modérée"){
            group[i].setIcon(yellowIcon);

          }
          else if (etat=="importante"){
            group[i].setIcon(orangeIcon);
          }

          else if (etat=="forte"){
            group[i].setIcon(redIcon);
          }

          group[i].on('click',onClick);

        }
    });
    ajax.send(data);
  }
});

var marker; //initialisation d'une variable qui stocke le dernier marqueur sur lequel l'utilisateur a cliqué
var nomParcelle; //initialisation d'une varibale qui stocke le nom de la dernière parcelle sur laquelle l'utilisateur a cliqué

/** Fonction qui se déclenche quand l'utilisateur clique sur un marqueur
zoom sur le maqueur, affichage des informations à droite de la carte, préparation du diagramme temporel
*/

var onClick = function(e) {
  marker = e.target; //stockage du marqueur dans une variable
  var feat = marker.options.feat; //on récupère les infos du marqueur qu'on a stocké dans stockage_info inséré dans le paramètre feat du marqueur

  mymap.flyTo([feat["globalLatitude"],feat["globalLongitude"]],17); //la carte est zommée sur le marqueurs

  /* Préparation de l'affichage des informations*/
  nomParcelle = feat['nomParcelle']; //stockage du nom de la parcelle


  var d = convertedDate(feat['date']); //date de la dernière session ([unix_timestamp format, fr-FR format])

  dates_parcelle(nomParcelle); //récupéreration des dates de toutes les sessions faites sur cette nomParcelle et insertion dans le menu déroulant
  var menu = document.getElementById('form_date');
  menu.style.display = 'inline';     //on rend le menu déroulant des dates visible

  document.getElementById("au_debut").innerHTML = "Pour la parcelle <strong>" + nomParcelle + "</strong> à la date du <strong>" + d[1]+"</strong> <em>"+d[2]+"</em>";

  etat = calcContrainte(feat,true); //calcul de la contrainte et insertion dans l'encart prévu

  // Préparation du diagramme temporel associé à la parcelle sur laquelle l'utilisateur a cliqué
  infos_parcelle(nomParcelle);

};





/** Mise à jour des données affichées à droite de la carte, calcul de la contrainte à partir des informations d'une session
@param {feat} : les informations stockées dans l'attribut feat d'un marqueur: informations d'une session **/
function calcContrainte(feat,graph) {
  // nombres respectifs d'apexs
  var apexP = feat['apexP'];
  var apexR = feat['apexR'];
  var apexC = feat['apexC'];
  // indice de croissance (ex-moyenne)
  var moyenne = feat['moyenne'];
  // nombre total d'observations pour la session
  var total_apex = parseInt(apexP) + parseInt(apexR) + parseInt(apexC);
  // proportions respectives d'apexs
  var t_apexC = apexC / total_apex;
  var t_apexR = apexR / total_apex;
  var t_apexP = apexP / total_apex;
  var prop = new Array(t_apexP,t_apexR,t_apexC);
  // affichage des propotions sous forme d'un diagramme circulaire type 'camembert'
  if ((prop!=null || prop!=undefined) && graph) {
    updatePieGraph(prop);
  }
  // détermination de l'état de contrainte hydrique de la vigne
  var etat = "";

  if (moyenne/2 > 0.75){
    etat = "absente";
  }
  else if (t_apexP > 0.05) {
    etat = "modérée";
  }

  else  if (t_apexC < 0.9) {
    etat = "importante";
  }
  else {
    etat = "forte";
  }

  var ch = document.getElementById("inf_ch");
  ch.innerHTML = etat; //insertion du résultat dans la div prévue à cet effet

  // retour pour traitement ultérieur
  return etat;

}

/* Ecoute de l'évenement changement de date dans le menu déroulant */
document.getElementById('dates_select_contrainte').addEventListener('change',function(ele){
  var date_c = ele.target.value;  // on récupère la valeur choisie par l'utilisateur dans le menu déroulant
  console.log("changement de date");
  infos_parcelle_date(fichier_i,marker,date_c);
});


var fichier_i;  //stocke toutes les informations sur les différentes sessions effectuées sur la parcelle (une ligne = une session)

/**
Cette fonction permet de remplir fichier_i avec toutes les informations sur les différentes sessions effectuées sur la parcelle (une ligne = une session)
*@param {string}: nomParcelle
*/
function infos_parcelle(nomParcelle){
      // Appel à la BDD pour récuperer des informations sur toutes les sessions réalisées sur la parcelle et affichage du graphe (pas de date particuière choisie)
      var ajax_i = new XMLHttpRequest();
      ajax_i.open('POST', '../Carto/infos_parcelle.php');
      ajax_i.addEventListener('load', function() {

      fichier_i = JSON.parse(ajax_i.response); //stockage dans une variable des informations sur toutes les sessions réalisées sur la parcelle

      updateLineGraph(fichier_i); //fonction qui gère l'affichage du graph, dans fichier_i les infos sur toutes les sessions faites sur la pacelle
    });

    var data = new FormData();
    data.append("nomParcelle", nomParcelle);
    ajax_i.send(data);

};



/** Fonction qui permet de récupérer les informations de la session dont la date est celle choisie par l'utilisateur dans le menu déroulant
Appel une fonction qui met à jour les informations à droite de la carte (information sur la session) et met à jour la position du marqueur en fonction de l'endroit où a été réalisé la session
*@param {json}: fichier_i variable qui stocke les informations sur toutes les sessions réalisées sur une parcelle
*@param {marker}: marker dont on veut modifier le feat (marqueur de la parcelle à laquelle l'utilisateur s'interesse)
*/
function infos_parcelle_date(fichier_i,marker,date_choisie){
  for (var i = 0; i < fichier_i.length; i++) { //parcours du fichier_i
    //selection de la session qui a été réalisée à la date choisie par l'utilisateur
    if (fichier_i[i]["date"] == date_choisie){
      var d = convertedDate(fichier_i[i]["date"]); //date de la session ([unix_timestamp format, fr-FR format]
      document.getElementById("au_debut").innerHTML = "Pour la parcelle <strong>" + nomParcelle + "</strong> à la date du <strong>" + d[1]+"</strong> <em>"+d[2]+"</em>";
      marker.options.feat = fichier_i[i];  //remplacement du feat du marqueur par les nouvelles informations de session
      modif_marqueur(marker); //modification de la position du marqueur et de l'état de la contrainte hydrique
      return 1; //on s'arrete à la premiere date rencontrée qui correspond, voir comment faire si deux dates identiques
    }
  }
}

/** Fonction qui ajuste la position du marqueur sur la parcelle en fonction de la date selectionnée
*@param {marker}: marqueur à ajuster
*/
function modif_marqueur(marker){

  feat = marker.options.feat;
  var newLatLng = new L.LatLng(feat["globalLatitude"],feat["globalLongitude"]);
  if (feat["globalLatitude"] == 0 && feat["globalLongitude"] ==0 ){
    alert('Erreur : les coordonnées sont à ( 0.0°N ; 0.0°E )'); //alerte lorsque les coordonnées renseignées dans la BDD sont à 0.0 pour la session choisie
  }
  mymap.flyTo([feat["globalLatitude"],feat["globalLongitude"]],17); //la map se déplace et se centre sur le marqueur
  marker.setLatLng(newLatLng);

  //détermination de la contrainte hydrique
  etat = calcContrainte(feat,true);

  //modification de l'aspect du marqueur en fonction de la contrainte hydrique
  if (etat=="absente"){
    marker.setIcon(bleuIcon);
  }
  else if (etat=="modérée"){
    marker.setIcon(yellowIcon);
  }
  else if (etat=="importante"){
    marker.setIcon(orangeIcon);
  }
  else if (etat=="forte"){
    marker.setIcon(redIcon);
  }

};

/** Fonction qui insère dans le menu déroulant de droite les dates de toutes les sessions réalisées sur une parcelle
 * en en changeant le format
 * @param {string}: nomParcelle le nom de la parcelle
*/
function dates_parcelle(nomParcelle){

  var ajax_d = new XMLHttpRequest();
  ajax_d.open('POST','../Carto/dates_parcelle.php');
  ajax_d.addEventListener('load', function() {
    fichier = ajax_d.response.split(";"); // séparation des différentes dates (entiers sous forme de chaine de caractères)
    s = ""; // initialisation des options correspondant aux dates

    for (var i=0; i<fichier.length-1; i++) {
      d = convertedDate(parseInt(fichier[i]));  // conversion des dates : timestamp (integer) -> local date & time (string)
      s += '<option value='+d[0]+'>'+d[1]+"  "+d[2]+'</option>'; // ajout de l'option correspondant à cette nouvelle date
    }
    form = document.getElementById('dates_select_contrainte');
    form.innerHTML = s;   //on insère les options dans le formulaire
  });
  var data = new FormData();
  data.append("nomParcelle", nomParcelle);
  ajax_d.send(data);
};


/** Fonction créant un diagramme circulaire type 'camembert' illustrant la répartition des observations
 * dans les trois classes : pleine croissance (P), croissance ralentie (R), croissance arrêtée (C).
 * Par défaut, lors de la création le diagramme affiche les valeurs 1/3  1/3 et 1/3.
 * @return {Chart} : l'objet chart généré, à l'emplacement défini dans le html
*/
function setPieGraph() {

  ctx = document.getElementById("myPieChart"); // récupération de l'emplacement du diagramme
  var chart = new Chart(ctx, {
    type: 'pie',  // choix du type de diagramme (line, pie, bar, ...)
    data: {
          labels: ["% Pleine croissance", "% Croissance ralentie", "% Croissance arrêtée"], // légende des différentes catégories
          datasets: [{  // les différents jeux de données affichés (un seul ici)
            label: "Répartition des observations",  // titre du jeu de données
            backgroundColor: ['#2C6109','#6E9624','#C5DC68'], // couleurs des différentes portions du diagramme (ordre important !)
            borderColor: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 1)'], // couleurs des bordures : cercle extérieur & délimitations entre catégories
            data: new Array(1/3,1/3,1/3), // données par défaut
            borderWidth: 1  // taille des bordures
          }]
     },
     options: {
      responsive: true,
      maintainAspectRatio: false, // rapport longueur/largeur constant
      legend: { // paramétrage de la légende
        position: 'bottom',
        labels: {
          fontColor: 'rgba(255,255,255,1)' // couleur du texte de la légende
        }
      }}
  });
  return chart;
};

/**
 * Fonction qui modifie les données affichées par le diagramme 'camembert' à partir de la répartition des observations.
 * @param {Array} prop : liste des proportions respectives des apexs P, R et C (dans l'ordre)
 */
function updatePieGraph(prop) {
  myPieChart.data = {
    labels: ["% Pleine croissance", "% Croissance ralentie", "% Croissance arrêtée"], // ... pas de modifs à cette ligne mais plus pratique de modifier .data que .datasets
    datasets: [{
         label: "Répartition des observations",
         backgroundColor: ['#2C6109','#6E9624','#C5DC68'],
         borderColor: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 1)'],
         data: prop, // redéfinition des données (unique véritable modification)
         borderWidth: 1
       }]
     };
  myPieChart.update(); // enregistrement des modifications
};

/**
 * Fonction qui définie un graphique par défaut pour le suivi de la contrainte hydrique
 * @return {Chart} : l'objet graphique généré par défaut (vide de toute donnée)
 */
function setLineGraph() {
  // Définition des paramètre du graphique
  var myChartConfig = {
    type: 'bar',   // Choix du type de diagramme : courbe
    data: {
      labels: ['Dates'],  // Données sur l'axe des abcisses
      datasets: []    // Ensemble des jeux de données à afficher en fonction des 'labels' : vide au départ
    },
    options: {
        title: {
          text: 'Indicateur de contrainte hydrique', // texte du titre
          fontSize: 20, // taille du titre
          display: true // affichage du titre (false par défaut)
        },
        responsive: true,
        maintainAspectRatio: true, // rapport longueur/largeur constant
        layout: {
            padding: {  // écart entre le bord de la page et le bord du graphique pour lisibilité des légendes des axes
                left: 25,
                right: 50,
                top: 0,
                bottom: 0
            }
        },
        legend: {
          position: 'top'
        },
        scales: {
          xAxes:[{
            scaleLabel: { // légende de l'axe des abcisses (dates)
              display: true,
              labelString: 'Dates',
              fontSize: 15
            },
            barPercentage: 1.0, // pour emprise maximale des barres en largeur dans le graphique
            categoryPercentage: 1.0,  // idem car 1 category = 1 bar ici (mais pas une nécessité)
          }],
          yAxes: [{
            id: 'CH', // identification du seul jeu de données à afficher
            type: 'linear', // type du jeu de données (plusieurs types possibles sur un même graphique)
            position: 'left', // position de l'axe dans le graphique
            scaleLabel: { // légende de l'axe
              display: true,
              labelString: 'Classes',
              fontSize: 15
            },
            ticks: { // valeurs autorisées pour le jeu de données
              max: 3,
              min: 0,
              stepSize: 1
            }
          }]
        }
      }
  };

  // CREATION DU GRAPHIQUE VIDE
  var myContext = document.getElementById('myChart');
  var myLineChart = new Chart(myContext, myChartConfig);

  return myLineChart;
};

/**
 * Fonction qui récupère les paramètres choisis par l'utilisateur et fait appelle à une fonction de mise à jour du graphique en fonction de ces paramètres
 * @param {Object} fichier_i : ensemble des informations disponibles pour une parcelle donnée
 */
function updateLineGraph(fichier_i){
  // initialisation des dates limites d'affichage
  var toDisplay = {
    startDate: 0,
    endDate: 0
  };

  // Récupération des différents éléments du formulaire
  var listDateMin = document.getElementById('selectDateMin');
  var listDateMax = document.getElementById('selectDateMax');

  // Remise à zéro des champs 'Date de début' et 'Date de fin'
  listDateMin.innerHTML = '<option selected disabled>Date initiale</option>';
  listDateMax.innerHTML = '<option selected disabled>Date finale</option>';
  // Création du menu déroulant des dates de sessions disponibles pour la parcelle
  for (var i=0; i<fichier_i.length; i++) {
    d = convertedDate(fichier_i[i]['date']);
    listDateMin.innerHTML += '<option value='+d[0]+'>'+d[1]+"  "+d[2]+'</option>'; // ajouts successifs des <option> dans le menu déroulant
  }

  // Ecoute de la date du début de l'affichage
  listDateMin.addEventListener('change',eventDateMin);
  function eventDateMin() {
    // Mise à jour de la date de départ sélectionnée
    toDisplay['startDate']=listDateMin.options[listDateMin.selectedIndex].value;
    // Remise à zéro du champs 'Date de fin'
    listDateMax.innerHTML = '<option selected disabled>Date finale</option>';
    // Création du menu déroulant des dates de sessions disponibles pour la parcelle
    for (var i=0; i<fichier_i.length; i++) {
      if (fichier_i[i]['date']>=toDisplay['startDate']) {
        d = convertedDate(fichier_i[i]['date']);
        listDateMax.innerHTML += '<option value='+d[0]+'>'+d[1]+"  "+d[2]+'</option>'; // ajouts successifs des <option> dans le menu déroulant
      }
    }
    // Mise à jour de l'affichage
    setGraph(fichier_i);
  };

  // Ecoute de la date de la fin de l'affichage
  listDateMax.addEventListener('change',eventDateMax);
  function eventDateMax() {
    // Mise à jour de la date de départ sélectionnée
    toDisplay['endDate']=listDateMax.options[listDateMax.selectedIndex].value;
    // Mise à jour de l'affichage
    setGraph(fichier_i);
  };

  /**
   * Fonction qui met à jour le graphique de suivi de la contrainte hydrique
   * 'toDisplay' est considérée comme une variable globale pour cette fonction
   * @param {Object} fichier_i : ensemble des informations disponibles pour une parcelle donnée
   */
  function setGraph(fichier_i) {
  // initialisation des données à afficher
  dates = new Array();
  ch = new Array();
  for (var i=0; i<fichier_i.length; i++) {
    var r = fichier_i[i];
    var date = r["date"];
    if (date>=toDisplay['startDate'] && date<=toDisplay['endDate']) { // on affiche uniquement les informations pour les dates que l'utilisateur souhaite
      dates.push(convertedDate(date)[1]+" "+convertedDate(date)[2]); // on convertie la date dans un format date-heure lisible par l'utilisateur
      var total_apexs = parseInt(r["apexP"]) + parseInt(r["apexR"]) + parseInt(r["apexC"]);
      // Regle d'interpretation n°1
      if (r['moyenne']/2>0.75) { // /!\ /2 pour la v1 de la bdd uniquement !!
        ch.push(0);
      }
      // Regle d'interpretation n°2
      else if (r['apexP']/total_apexs>0.05) {
        ch.push(1);
      }
      // Regle d'interpretation n°3
      else if (r['apexC']/total_apexs<0.9) {
        ch.push(2);
      }
      // Au-dela des 3 premières
      else {
        ch.push(3);
      }
    }
  }
  // on renverse l'ordre pour être chronologique dans l'affichage
  dates.reverse();
  ch.reverse();

  // AJOUT DYNAMIQUE DES DONNEES DANS LE GRAPHIQUE
  displayAll(myLineChart,dates);

  //###############################################################################
  // o--------------------------o
  // | Sous-fonctions utilisées |
  // o--------------------------o

  /**
   * Fonction qui ajoute un jeu de données à l'affichage
   * @param {Chart} chart : objet graphique à modifier
   * @param {Array} newDates : ensemble des dates considérées
   * @param {String} newLabel : titre du jeu de données
   * @param {String} newYAxis : identifiant de l'axe des ordonnées correspondant
   * @param {Array} newData : nouvelles données à afficher
   * @param {String} newColor : couleurs des données
   * @param {Integer} newWidth : épaisseur du trait
   * @param {Array} newDash : style du trait
   * @param {Boolean} newFill : aire sous la courbe colorée ou non
   */
  function addData(chart,newDates,newLabel,newYAxis,newData,newColor,newWidth,newDash,newFill) {
    // Formatage du dataset pour correspondre avec Chart.js
    var newDataset = {
      label: newLabel,
      data: newData,
      yAxisID: newYAxis,
      lineTension: 0.1,
      borderColor: 'rgba('+newColor+',1)',
      borderWidth: newWidth,
      borderCapStyle: 'square',
      borderDash: newDash,
      backgroundColor: 'rgba('+newColor+',0.5)',
      fill: newFill,
    };
    // Mise à jour de l'ensemble des jeux de données du graphique
    chart.data = {
      labels: newDates,
      datasets: [newDataset] // unique jeu de données pour la contrainte
    };
    chart.update(); // mise à jour du graphique
  };

  /**
   * Fonction ajoutant tous les jeux de données nécessaires au graphique
   * @param {Chart} chart :objet graphique à modifier
   * @param {*} dates : dates à afficher
   */
  function displayAll(chart,dates) {
    addData(chart,dates,'Contrainte hydrique','CH',ch,'151,162,191',1,[],true);
  };
}

};

/**
 * Fonction qui convertie une date d'un format entier à un format intelligible pour l'utilisateur
 * @param {Integer} unixDate : nombre de SECONDES écoulées depuis le 01/01/1970 00:00:00
 * @returns {Array} : [le timestamp, la date locale correspondante, l'heure locale correspondante]
 */
function convertedDate(unixDate) {
  var d = new Date(unixDate*1000); // les fonctions js travaillent avec le nombre de MILLISECONDES !!!
  return [unixDate,d.toLocaleDateString("fr-FR"),d.toLocaleTimeString("fr-FR")];
}


// Code pour écouter le bouton de popup et pour afficher le texte associer
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
