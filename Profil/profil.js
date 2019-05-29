  /**
    *@author Paul Mazeran   
    * Gestion de la mise à jour des information de l'utilisateur a l ecoute du bouton "Modifier mes informations"
    *
  */

 
 /* Initialize Firebase */
const config = {
    // A modifier a la creation du projet firebase sur l adresse mail de gestion d ApeX
      apiKey: "AIzaSyD4dYPN7r_nVWR03mqSFs0nxDGEdz4TkM8",
      authDomain: "apexweb-1e799.firebaseapp.com",
      databaseURL: "https://apexweb-1e799.firebaseio.com",
      projectId: "apexweb-1e799",
      storageBucket: "apexweb-1e799.appspot.com",
      messagingSenderId: "750280712215"
  };
  firebase.initializeApp(config);
  var auth = firebase.auth();

  
    const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: 'http://localhost/projet_dev_apex/Accueil/accueil.html',
    // This must be true.
    handleCodeInApp: true
  };
  
  // Récupération des variables 

    var result;
    const emailtoupgrade = document.getElementById('emailtoupgrade');
    const usernametoupgrade = document.getElementById('usernametoupgrade');
    const structuretoupdate = document.getElementById('structuretoupdate');


    const btnUpdateUser = document.getElementById("modifier");

    var emailtoupgradetxt = "";
    var usernametoupgradetxt = "";
    var structuretoupdatetxt = "";




    /**
    * Ecoute les changements possible sur le statut utilisateur Firebase
    *
    * @param user L utilisateur Firebase
    */

function test_email(email){

  var ajax = new XMLHttpRequest();
  ajax.open('POST', '../Authentification/auth.php');
  ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  ajax.addEventListener('load', function () {
    // Requete BDD sur existence utilisateur
    result = JSON.parse(ajax.response);
    return result.email != "";
  
  });
  var data = 'email=' + email;
  ajax.send(data);
  };


auth.onAuthStateChanged(function(user) {

      
    // Ecoute les changements de statuts d authentification
    if(user) {
      // Si user connecte
      console.log("logged in (profil.js)");
      console.log(auth.currentUser.email);


      btnUpdateUser.addEventListener('click', e =>    {

        var emailtoupgradetxt = emailtoupgrade.value;
        var usernametoupgradetxt = usernametoupgrade.value;
        var structuretoupdatetxt = structuretoupdate.value;

 
        if(emailtoupgradetxt=="" && usernametoupgradetxt==""){
            alert("Veuillez remplir au moins un champs à modifier")
        }

        else{
          var ajax = new XMLHttpRequest();
          ajax.open('POST', 'profil.php');
          ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          ajax.addEventListener('load', function () {
            console.log(ajax.response);

          });
          var data = 'email=' + auth.currentUser.email + '&' + 'emailtoupgradetxt=' + emailtoupgradetxt + '&' + 'usernametoupgradetxt=' + usernametoupgradetxt + '&' + 'structuretoupdatetxt=' + structuretoupdatetxt;

          ajax.send(data);
          if(emailtoupgradetxt != ""){
            console.log(emailtoupgrade);
          // Remise a zero du message d erreur
          //     var errorStatus = document.getElementById("errorStatusUpdateUser");

              firebase.auth()
              //si changement de mdp, plus rien de marche if faut rentrer son mdp en temps reel!!!
                .signInWithEmailAndPassword(auth.currentUser.email, '04041996')
                .then(function(userCredential) {
                  userCredential.user.updateEmail(emailtoupgradetxt);
                });
//gerer la déconnexion

                //   // Log out
                // const promise = auth.signOut();
                // // Si succes
                // promise.then(function() {
                //   console.log(user);
                //   // Redirection
                //   document.location.href="../Authentification"
                // });;
                // // Si erreur
                // promise.catch(function(error){
                //   // Renseignement des erreurs
                //   var errorCode = error.code;
                //   var errorMessage = error.message;
                //   console.log (errorCode + " " + errorMessage);
                // });
                


          }
        }
      });
    }   
    else {
      // Si user pas connecte : gestion redirection dans le chargement page
      console.log('not logged in (profil.js)');
    }
});




  
 
  
  





             
  
  
  
  
  
 















  