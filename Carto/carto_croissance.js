console.log('carto croissance: ' + auth.currentUser);
/* Recuperation de Firebase */
var auth = firebase.auth();
var user = auth.currentUser ;

/* CHARGEMENT CARTE */
var mymap = L.map('mapid').setView([44.1725, 4.81], 8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
}).addTo(mymap);

/*Initialisation des diagrammes */
var myPieChart = setPieGraph();
var myLineChart = setLineGraph();

/**
  * Ecoute les changements possible sur le statut utilisateur Firebase
  *
  * @param user L utilisateur Firebase
*/
auth.onAuthStateChanged(function(user) {
  // Ecoute les changements de statuts d authentification
  if(user) {
    console.log('carto croissance 2: ');
    console.log(user);

    // Identification de l'utilisateur par son adresse mail
    var email = user.email;

    var data = 'email' + '=' + email;



    group = {}; //Initialisation du groupe de marqueurs

    var liste_parcelle_utilisateur;

    /*AFFICHAGE DES MARQUEURS (correspondent à la position des dernières sessions sur chaque parcelle)*/

    var ajax = new XMLHttpRequest();
    ajax.open('POST', '../Carto/carto_croissance.php');
    ajax.setRequestHeader('content-type','application/x-www-form-urlencoded');
    ajax.addEventListener('load', function() {

      fichier = JSON.parse(ajax.response);
      liste_parcelle_utilisateur = new Array(fichier.length);

      var greenIcon = L.icon({     //paramètres pour l'icone
        iconUrl: '../images/marker.png',
        iconSize: [35, 40] // dimensions du marqueur
        });
      for (var i = 0; i < fichier.length; i++) { //parcours du fichier


          liste_parcelle_utilisateur[i] = fichier[i]['nomParcelle'];
          // création d'une variable dans laquelle on stocke les infos sur la parcelle et la session
          var stockage_info = fichier[i];
          // on insère dans le marqueur les infos
          group[i] = L.marker([fichier[i]["globalLatitude"],fichier[i]["globalLongitude"]], {icon : greenIcon, feat:stockage_info}).addTo(mymap);
          // on écoute le click sur le marqueur
          group[i].on('click',onClick);
        }
    });
    ajax.send(data);
  }
});

var marker; //initialisation d'une variable qui stocke le dernier marqueur sur lequel l'utilisateur a cliqué
var nomParcelle; //initialisation d'une varibale qui stocke le nom de la dernière parcelle sur laquelle l'utilisateur a cliqué

/** Fonction qui écoute l'évenement de clique sur un marqueur pour se déclencher
Elle permet de centrer la map sur le maqueur sur lequel a cliqué l'utilisateur et d'afficher les informations à droite correspondantes à la session à laquelle le marqueur correspond
*/
var onClick = function(e){
  console.log("click sur un nouveau marqueur");
  // on identifie le marqueur cliqué
  marker = e.target;
  // on récupère ses infos qu'on a stocké dans stockage_info insérées dans le paramètre feat du marqueur
  var feat = marker.options.feat;
  // zoom sur le marqueur
  mymap.flyTo([feat["globalLatitude"],feat["globalLongitude"]],17);
  nomParcelle = feat['nomParcelle']; //nom de la parcelle

  var d = convertedDate(feat['date']); //date de la dernière session ([unix_timestamp format, fr-FR format])

  // Récupéreration des dates de toutes les sessions faites sur cette nomParcelle et insertion dans le menu déroulant
  dates_parcelle(nomParcelle);

  var menu = document.getElementById('form_date');
  menu.style.display = 'inline';     //on rend le menu déroulant des dates visible

  document.getElementById("au_debut").innerHTML = "Pour la parcelle <strong>" + nomParcelle + "</strong> à la date du <strong>" + d[1]+"</strong> <em>"+d[2]+"</em>";

  affichData(feat);

  // Création du diagramme associé à la parcelle du marqueur cliqué
  infos_parcelle(nomParcelle);
}

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

/* Ecoute de l'évenement changement de date dans le menu déroulant */
document.getElementById('dates_select').addEventListener('change',function(ele){
  var date_c = ele.target.value;  // on récupère la valeur choisie par l'utilisateur dans le menu déroulant
  console.log("changement de date");
  infos_parcelle_date(date_c);
});

/** Fonction qui permet de récupérer les informations de la session dont la date est celle choisie par l'utilisateur dans le menu déroulant
*@param {json}: fichier_i variable qui stocke les informations sur toutes les sessions réalisées sur une parcelle
*@param {marker}: marker dont on veut modifier le feat (marqueur de la parcelle à laquelle l'utilisateur s'interesse)
*/
function infos_parcelle_date(date_choisie){


  for (var i = 0; i < fichier_i.length; i++) { //parcours du fichier
    if (fichier_i[i]["date"] == date_choisie){
      var d = convertedDate(fichier_i[i]["date"]); //date de la session ([unix_timestamp format, fr-FR format]
      document.getElementById("au_debut").innerHTML = "Pour la parcelle <strong>" + nomParcelle + "</strong> à la date du <strong>" + d[1]+"</strong> <em>"+d[2]+"</em>";
      marker.options.feat = fichier_i[i];
      modif_marqueur(marker);
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

  affichData(feat);

};

/** Fonction qui insère dans le menu déroulant de droite les dates de toutes les sessions réalisées sur une parcelle
 * en en changeant le format
 * @param {string}: nomParcelle le nom de la parcelle
*/
function dates_parcelle(nomParcelle){
  var ajax_d = new XMLHttpRequest();
  ajax_d.open('POST', '../Carto/dates_parcelle.php');
  ajax_d.addEventListener('load', function() {
    fichier = ajax_d.response.split(";"); // séparation des différentes dates (entiers sous forme de chaine de caractères)
    s = ""; // initialisation des options correspondant aux dates
    for (var i=0; i<fichier.length-1; i++) {
      d = convertedDate(parseInt(fichier[i]));  // conversion des dates : timestamp (integer) -> local date & time (string)
      s += '<option value='+d[0]+'>'+d[1]+"  "+d[2]+'</option>';  // ajout de l'option correspondant à cette nouvelle date
    }
    form = document.getElementById('dates_select');
    form.innerHTML = s;   //on insère les dates dans le formulaire
  });
  var data = new FormData();
  data.append("nomParcelle", nomParcelle);
  ajax_d.send(data);
};
/** Mise à jour des données affichées à droite de la carte
insertion des nombres d'apex et appel de la fonction qui met en place le camembert
*/
function affichData(feat) {
  // nombres respetifs d'apexs
  var apexP = feat['apexP'];
  document.getElementById('inf_nb_P').innerHTML = apexP;
  var apexR = feat['apexR'];
  document.getElementById('inf_nb_R').innerHTML = apexR;
  var apexC = feat['apexC'];
  document.getElementById('inf_nb_C').innerHTML = apexC;
  var moy = feat['moyenne'];
  document.getElementById('inf_moy').innerHTML = moy;
  // nombre total d'observation pour la session
  var total_apex = parseInt(apexP) + parseInt(apexR) + parseInt(apexC);
  // proportions respectives d'apexs
  var t_apexP = parseInt(apexP) / total_apex;
  var t_apexR = parseInt(apexR) / total_apex;
  var t_apexC = parseInt(apexC)/ total_apex;
  var proportions = new Array(t_apexP,t_apexR,t_apexC);
  // affichage des proportions sous forme d'un diagramme circulaire type 'camembert'
  updatePieGraph(proportions);
}


/** Fonction créant un diagramme circulaire type 'camembert' illustrant la répartition des observations
 * dans les trois classes : pleine croissance (P), croissance ralentie (R), croissance arrêtée (C).
 * Par défaut, lors de la création le diagramme affiche les valeurs 1/3  1/3 et 1/3.
 * @return {Chart} : l'objet chart généré, à l'emplacement défini dans le html
*/
function setPieGraph() {

  ctx = document.getElementById("myPieChart");
  var chart = new Chart(ctx, {
    type: 'pie',
    data: {
          labels: ["% Pleine croissance", "% Croissance ralentie", "% Croissance arrêtée"],
          datasets: [{
            label: "Répartition des observations",
            backgroundColor: ['#2C6109','#6E9624','#C5DC68'],
            borderColor: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 1)'],
            data: new Array(1/3,1/3,1/3), // définition des données par défaut
            borderWidth: 1
          }]
     },
     options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
        labels: {
          fontColor: 'rgba(255,255,255,1)'
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
    labels: ["% Pleine croissance", "% Croissance ralentie", "% Croissance arrêtée"],
    datasets: [{
         label: "Répartition des observations",
         backgroundColor: ['#2C6109','#6E9624','#C5DC68'],
         borderColor: ['rgba(255, 255, 255, 1)','rgba(255, 255, 255, 1)'],
         data: prop, // définition des données
         borderWidth: 1
       }]
     };
  myPieChart.update();
};

/**
 * Fonction qui définie un graphique par défaut pour le suivi de la contrainte hydrique
 * @return {Chart} : l'objet graphique généré par défaut (vide de toute donnée)
 */
function setLineGraph() {
  /* Définition des paramètre globaux du graphique */
  var myChartConfig = {
    type: 'line',   // Choix du type de diagramme : courbe
    data: {
      labels: ['Dates'],  // Données sur l'axe des abcisses
      datasets: []    // Ensemble des jeux de données à afficher en fonction des 'labels' : vide au départ
    },
    options: {
        title: { // titre du graphique
          text: 'Evolution temporelle des indicateurs de croissance de la vigne',
          fontSize: 20,
          display: true
        },
        responsive: true,
        maintainAspectRatio: true, // rapport longueur/largeur constant
        layout: {
            padding: { // retrait du graphique par rapport aux extrémités de la largeur de la fenêtre
                left: 25,
                right: 50,
                top: 0,
                bottom: 0
            }
        },
        legend: {
          position: 'top' // position de la légende des données
        },
        scales: {
          xAxes:[{
            scaleLabel: { // titre de l'axe des abcisses
              display: true,
              labelString: 'Dates',
              fontSize: 15
            },
            ticks:{
              suggestedMax: 5
            }
          }],
          yAxes: [{
            id: 'A', // identification du 1er axe des ordonnées
            type: 'linear',
            position: 'left', // position de l'axe dans le graphique (à gauche)
            scaleLabel: { // légende de l'axe
              display: true,
              labelString: 'Indice croiss.',
              fontSize: 15
            },
            ticks: { // valeurs affichées sur l'axes
              max: 1,
              min: 0,
              stepSize: 0.2
            }
          }, {
            id: 'B', // identification du 2e axe des ordonnées
            type: 'linear',
            position: 'right', // position de l'axe dans le graphique (à droite)
            scaleLabel: { // légende de l'axe
              display: true,
              labelString: '% Apex',
              fontSize: 15
            },
            ticks: { // valeurs affichées sur l'axe
              max: 100,
              min: 0,
              stepSize: 20
            }
          }]
        }
      }
  };

  // CREATION DU GRAPHIQUE VIDE
  var myContext = document.getElementById('myChart');
  var myLineChart = new Chart(myContext, myChartConfig);

  return myLineChart;
}

/**
 * Fonction qui récupère les paramètres choisis par l'utilisateur et fait appelle à une fonction de mise à jour du graphique en fonction de ces paramètres
 * @param {Object} fichier_i : ensemble des informations disponibles pour une parcelle donnée
 */
function updateLineGraph(fichier_i){
  var toDisplay = {
    startDate: 0,
    endDate: 0
  }

  // Récupération des différents éléments du formulaire
  var listDateMin = document.getElementById('selectDateMin');
  var listDateMax = document.getElementById('selectDateMax');

  // Affichage de la trame du graphique
  setGraph(fichier_i);

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
  // Formatage des données
  dates = new Array();
  prop_R = new Array();
  prop_P = new Array();
  prop_C = new Array();
  moyenne = new Array();
  for (var i=0; i<fichier_i.length; i++) {
    var r = fichier_i[i];
    var date = r["date"];
    if (date>=toDisplay['startDate'] && date<=toDisplay['endDate']) {
      dates.push(convertedDate(date)[1]+" "+convertedDate(date)[2]);
      var total_apexs = parseInt(r["apexP"]) + parseInt(r["apexR"]) + parseInt(r["apexC"]);
      prop_R.push(100*parseInt(r["apexR"])/total_apexs);
      prop_P.push(100*parseInt(r["apexP"])/total_apexs);
      prop_C.push(100*parseInt(r["apexC"])/total_apexs);
      moyenne.push(r["moyenne"]/2); // /!\ '/2' pour la v1 de la bdd, pas pour la v2 !!!!
    }
  }
  dates.reverse();
  prop_P.reverse();
  prop_C.reverse();
  prop_R.reverse();
  moyenne.reverse();

  // AJOUT DYNAMIQUE DES DONNEES DANS LE GRAPHIQUE
  displayAll(myLineChart);

  //###############################################################################
  // o--------------------------o
  // | Sous-fonctions utilisées |
  // o--------------------------o

  /**
   * Fonction qui ajoute un jeu de données à ceux déjà existants
   * @param {Array} datasets : ensemble des jeux de données avant ajout
   * @param {String} newLabel : titre du jeu de données
   * @param {String} newYAxis : identifiant de l'axe des ordonnées correspondant
   * @param {Array} newData : nouvelles données à afficher
   * @param {String} newColor : couleurs des données
   * @param {Integer} newWidth : épaisseur du trait
   * @param {Array} newDash : style du trait
   * @param {Boolean} newFill : aire sous la courbe colorée ou non
   * @return {Array} : ensemble des jeux de données après ajout
   */
  function addDataset(datasets,newLabel,newYAxis,newData,newColor,newWidth,newDash,newFill) {
    // Formatage du dataset pour correspondre avec Chart.js
    var newDataset = {
      label: newLabel,
      data: newData,
      yAxisID: newYAxis,
      steppedLine: false,
      borderColor: 'rgba('+newColor+',1)',
      borderWidth: newWidth,
      borderDash: newDash,
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      backgroundColor: 'rgba('+newColor+',0.2)',
      fill: newFill,
      pointBorderColor: "black",
      pointBackgroundColor: "white",
      pointBorderWidth: 1,
      pointRadius: 4,
      pointHitRadius: 10
    };
    datasets.push(newDataset); // ajout du nouveau jeu de données
    return datasets;
  };

  /**
   * Fonction ajoutant tous les jeux de données nécessaires au graphique
   * @param {Chart} chart :objet graphique à modifier
   */
  function displayAll(chart) {
    var datasets = new Array();
    datasets = addDataset(datasets,'% pleine croissance','B',prop_P,'247,201,161',2,[5,5],true);
    datasets = addDataset(datasets,'% croissance ralentie','B',prop_R,'144,190,184',2,[5,5],true);
    datasets = addDataset(datasets,'% croissance arrêtée','B',prop_C,'105,134,143',2,[5,5],true);
    datasets = addDataset(datasets,'Indice de croissance','A',moyenne,'242,142,146',2,[],false);
    // Mise à jour de l'ensemble des jeux de données du graphique
    chart.data = {
      labels: dates,
      datasets: datasets
    };
    chart.update(); // mise à jour du graphique
  };
}};

/**
 * Fonction qui convertie une date d'un format entier à un format intelligible pour l'utilisateur
 * @param {Integer} unixDate : nombre de SECONDES écoulées depuis le 01/01/1970 00:00:00
 * @returns {Array} : [le timestamp, la date locale correspondante, l'heure locale correspondante]
 */
function convertedDate(unixDate) {
  var d = new Date(unixDate*1000);
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
