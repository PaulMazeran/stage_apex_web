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
var user = auth.currentUser ;





const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: 'http://localhost/projet_dev_apex/Accueil/accueil.html',
  // This must be true.
  handleCodeInApp: true
};

/**
  * Ecoute les changements possible sur le statut utilisateur Firebase
  *
  * @param user L utilisateur Firebase
*/
auth.onAuthStateChanged(function(user) {
  // Ecoute les changements de statuts d authentification
  if(user) {
    // Si user connecte
    console.log("logged in (authConf)");
    console.log("user:" ,user);

    

    if (document.getElementById("Deconnexion")) {
      // Affichage du bouton de Deconnexion et du menu deroulant
      document.getElementById("Deconnexion").classList.remove('invisible');
      document.getElementById("menuDeroulant").classList.remove('invisible');
      if ((document.getElementById("btnAccueilLogIn"))) {
        // Mise en place bouton accueil
        document.getElementById("btnAccueilLogIn").innerHTML = "Accueil" ;
      }
    }

  }
  else {
    // Si user pas connecte : gestion redirection dans le chargement page
    console.log('not logged in (authConf)');
  }



})






  /**
    * Gestion de la connexion par mail a l ecoute du bouton "Se deconnecter"
    *
  */
  const btnLogout = document.getElementById('btnLogout');

  btnLogout.addEventListener('click', e => {
    // Log out
    const promise = auth.signOut();
    // Si succes
    promise.then(function() {
      console.log(user);
      // Redirection
      document.location.href="../Authentification"
    });;
    // Si erreur
    promise.catch(function(error){
      // Renseignement des erreurs
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log (errorCode + " " + errorMessage);
    });
  })


  /**
    * Ecoute les changements possible sur le statut utilisateur Firebase
    *
    * @param user L utilisateur Firebase
  */
  auth.onAuthStateChanged(function(user) {
    // Ecoute les changements de statuts d authentification
    if(!user) {
      // Si user pas detecte / connecte
      console.log('processus connexion par mail');

      // Confirmation du lien en tant que sign-in par lien mail
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        // Recuperation du mail enregistre dans la fenetre
        var email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          email = window.prompt('Entrez votre email pour vérification.');
        }
        // Le SDK client parse le code du lien pour nous.
        firebase.auth().signInWithEmailLink(email, window.location.href)
          .then(function(result) {
            // On efface le mail du stockage de la fenêtre.
            window.localStorage.removeItem('emailForSignIn');
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
          })
          .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log (errorCode + " " + errorMessage);

            // Des erreurs seront surement a gerer.
            alert("Problème avec la connexion, veuillez fermer la fenêtre et ovus identifiez autrement. N'hésitez pas à reporter le problème aux administrateurs.")
          });
      }
      else {
        // Si user pas connecte et pas en demande de connexion par mail
        // Et si on est pas sur la page d authentification
        console.log("ni user mail, ni user mdp : deconnecte.")

        // On enleve le bouton de deconnexion
        if (document.getElementById("Deconnexion")) {
          document.getElementById("Deconnexion").classList.add('invisible');
        }
        if (document.getElementById("menuDeroulant")) {
          document.getElementById("menuDeroulant").classList.add('invisible');
        }

        // On redirige l utilisateur vers la page de deconnexion qui ainsi bloque l acces a l application pour les personnes non identifiees.
        if (document.getElementById('ifLoggedIn')) {
          console.log("redirection");
          document.location.href="../Authentification/deconnecte.html";
        }

      }

    }
  })




 


