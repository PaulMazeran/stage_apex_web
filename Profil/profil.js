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

    const btnUpdateUser = document.getElementById("modifier");

    var emailtoupgradetxt = "";
    var usernametoupgradetxt = "";

    /**
    * Ecoute les changements possible sur le statut utilisateur Firebase
    *
    * @param user L utilisateur Firebase
    */
auth.onAuthStateChanged(function(user) {
      

    // Ecoute les changements de statuts d authentification
    if(user) {
      // Si user connecte
      console.log("logged in (profil.js)");
      btnUpdateUser.addEventListener('click', e =>    {

        var emailtoupgradetxt = emailtoupgrade.value;
        var usernametoupgradetxt = usernametoupgrade.value;
    
         
        console.log("user in fct",auth.currentUser.email);
        console.log("toto");
        console.log(emailtoupgradetxt);
        console.log("titi");
        console.log(usernametoupgradetxt);
        console.log("tutu");
        console.log(emailtoupgradetxt=="" && usernametoupgradetxt=="");
    
        if(emailtoupgradetxt=="" && usernametoupgradetxt==""){
    
            console.log("Veuillez remplir au moins un champs à modifier")
        }
        else{
          console.log("modifié")
            }
      });
    


    }   
        

    else {
      // Si user pas connecte : gestion redirection dans le chargement page
      console.log('not logged in (profil.js)');
    }
});
  
 
  
  
// });

 /**
    *@author Paul Mazeran   
    * Gestion de la mise à jour des information de l'utilisateur a l ecoute du bouton "Modifier mes informations"
    *
  */

/* Initialisation des variables */






             
  
  
  
  
  
 











   // Remise a zero du message d erreur
   // var errorStatus = document.getElementById("errorStatusUpdateUser");
   // errorStatus.innerHTML = "" ;
//    firebase.auth()
//    .signInWithEmailAndPassword('paul.mazeran@ensg.eu', '04041996')
//    .then(function(userCredential) {
//        userCredential.user.updateEmail('paul-mazeran@orange.fr')

//    });
//  });





  