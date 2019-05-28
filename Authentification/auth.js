
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

  
  /* Recuperation des elements */
  const txtEmail = document.getElementById('txtEmail');

  const txtFirstMdp = document.getElementById('txtFirstMdp');
  const txtMdp = document.getElementById('txtMdp');

  const connexionBlock = document.getElementById('connexionBlock');
  const divUnknownUser = document.getElementById('UnknownUser');
  const divInfos = document.getElementById('infos');

  const btnValidEmail = document.getElementById('btnValidEmail') ;
  const btnLogin = document.getElementById('btnLogin');
  const btnLoginByMail = document.getElementById('btnLoginByMail');
  const btnSignUp = document.getElementById('btnSignUp');
  const btnResetPassword = document.getElementById('btnResetPassword');


  /* Initialisation des variables */
  var email = "";
  var pass = "" ;
  var name = "" ;


  /**
    * Ecoute les changements possible sur le statut utilisateur Firebase
    *
    * @param user L utilisateur Firebase
  */

  auth.onAuthStateChanged(function(user) {
    // Ecoute les changements de statuts d authentification
    if(user) {
      // si user connecte
      console.log("logged in (auth)");
      console.log(user);


      // Redirection vers page accueil a la connexion
      document.location.href="../Accueil/accueil.html";

    }
    else {
      // Si pas connecte => La gestion se fait plus loin dans le code
      console.log('not logged in (auth)');
    }
  })

  /**
    * Lance la verification de l email de connexion a l ecoute du bouton "Rechercher"
    *
  */
  btnValidEmail.addEventListener('click', e => {
    // Initialisation des statuts erreur
    document.getElementById("errorStatusLogIn").innerHTML = "";
    document.getElementById("errorStatusSignUp").innerHTML = "";

    // Recuperation valeur du champ email
    email = txtEmail.value;

    if (email == "") {
      // Verifie qu un email est bien donne
      console.log("Entre ton email");
    }
    else {
      // Verifie si email dans BD Apex
      test_email(email);
    }
  });


  /**
    * Gestion de la premiere connexion a l ecoute du bouton "S'inscrire"
    *
  */
  btnSignUp.addEventListener('click', e => {
    // Affichage du spinner temoin d une action
    var spinner = document.getElementById("spinnerSignUp");
    spinner.classList.remove("invisible");
    // Remise a zero du message d erreur
    var errorStatus = document.getElementById("errorStatusSignUp");
    errorStatus.innerHTML = "" ;

    // Recuperation mdp entre

    // mettre : var pass ???
    pass = txtFirstMdp.value;

    // Sign in
    const promise = auth.createUserWithEmailAndPassword(email,pass);
    // Si succes
    promise.then(function() {
      console.log(user);
    });;
    // Si erreur
    promise.catch(function(error){
      // On cache le spinner
      spinner.classList.add("invisible");

      // Recuperation des infos sur l erreur
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log (errorCode + " " + errorMessage);

      //  Si erreur de reseau
      if (errorCode == "auth/network-request-failed") {
        console.log("network request failed");
        // Renseignement du message d erreur
        errorStatus.innerHTML = 'Problème de réseau, vérifiez votre connexion ou réessayez plus tard.';
      }
      // Si utilisateur deja connue dans Firebase
      if (errorCode == "auth/email-already-in-use") {
        console.log("user already known");
        // Renseignement du message d erreur
        errorStatus.innerHTML = 'Vous êtes déjà enregistré sur ApeXweb, veuillez vous connectez via la fenêtre "Se connecter".';
      }

    });
  });

  /**
    * Gestion de la connexion par mdp a l ecoute du bouton "Se Connecter"
    *
  */
  btnLogin.addEventListener('click', e => {
    // Affichage du spinner temoin d une action
    var spinner = document.getElementById("spinnerLogIn");
    spinner.classList.remove("invisible");
    // Remise a zero du message d erreur
    var errorStatus = document.getElementById("errorStatusLogIn");
    errorStatus.innerHTML = "" ;

    // Recuperation mdp entre
    pass = txtMdp.value;

    // Sign in
    const promise = auth.signInWithEmailAndPassword(email,pass);
    // Si succes
    promise.then(function() {
      console.log("toto");
      console.log(user);
      console.log("toto");
    });;
    // Si erreur
    promise.catch(function(error){
      // On cache le spinner
      spinner.classList.add("invisible");

      // Recuperation des infos sur l erreur
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log ("errorCode : " + errorCode);
      console.log ("errorMessage : " + errorMessage);

      // Si mauvais mdp
      if (errorCode == "auth/wrong-password") {
        console.log("wrong password");
        // Renseignement du message d erreur
        errorStatus.innerHTML = 'Mot de passe éronné.';
      }
      // Si trop de tentative de connexion avec mauvais mdp
      if (errorCode == "auth/too-many-requests") {
        console.log("too many attempts");
        // Renseignement du message d erreur
        errorStatus.innerHTML = 'Vous avez atteint la limite de tentatives de connexion, veuillez réessayer plus tard.';
      }
      // Si erreur de reseau
      if (errorCode == "auth/network-request-failed") {
        console.log("network request failed");
        // Renseignement du message d erreur
        errorStatus.innerHTML = 'Problème de réseau, vérifiez votre connexion ou réessayez plus tard.';
      }

    });
  })

  /**
    * Gestion de la connexion par mail a l ecoute du bouton "Recevoir par mail"
    *
  */
  btnLoginByMail.addEventListener('click', e => {
    // Affichage du spinner temoin d une action
    var spinner = document.getElementById("spinnerMail");
    spinner.classList.remove("invisible");
    // Remise a zero du message d erreur
    var errorStatus = document.getElementById("errorStatusMail");
    errorStatus.innerHTML = "" ;

    // Mail
    auth.sendSignInLinkToEmail(email,actionCodeSettings).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log (errorCode + " " + errorMessage);

      if (errorCode == "auth/network-request-failed") {
        console.log("network request failed");
        // Renseignement du message d erreur
        errorStatus.innerHTML = 'Problème de réseau, vérifiez votre connexion ou réessayez plus tard.';
      }
    }).then(function() {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
      spinner.classList.add("invisible");
      alert("Veuillez consulter vos mails. \n Un lien de connexion vous a été envoyé par mail.");
    });
  });

  /**
    *@author Paul Mazeran   
    * Gestion de la réinitialistion du mot de passe a l ecoute du bouton "Réinitialiser son mot de passe"
    *
  */
  btnResetPassword.addEventListener('click', e => {
    // Affichage du spinner temoin d une action
    var spinner = document.getElementById("spinnerResetPassword");
    spinner.classList.remove("invisible");

    // Remise a zero du message d erreur
    var errorStatus = document.getElementById("errorStatusResetPassword");
    errorStatus.innerHTML = "" ;


    //Reset by email
    auth.sendPasswordResetEmail(email).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log (errorCode + " " + errorMessage);

      if (errorCode == "auth/network-request-failed") {
        console.log("network request failed");
        // Renseignement du message d erreur
        errorStatus.innerHTML = 'Problème de réseau, vérifiez votre connexion ou réessayez plus tard.';
      }

    }).then(function() {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
      spinner.classList.add("invisible");
      alert("Veuillez consulter vos mails. \n Un lien de réinitialisation vous a été envoyé par mail.");
  });
  });


  /* Autres fonctions */

  /**
    * Verifie existence email dans BD ApeX.
    *
    * @param {string} email Le mail a verifier par la BD ApeX
  */
  function test_email(email){

    var ajax = new XMLHttpRequest();
    ajax.open('POST', 'auth.php');
    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    ajax.addEventListener('load', function () {
      // Requete BDD sur existence utilisateur
      result = JSON.parse(ajax.response);
      console.log(result);
      console.log("email" + result.email);

      if (result.email == email){
        //Si oui, affiche les possibilites de connexion
        connexionBlock.classList.remove( 'invisible' );
        // Affichage div infos connexion
        divInfos.classList.remove("invisible") ;
        // Masquage div d erreur
        divUnknownUser.classList.add('invisible');
      }
      else {
        //Si non, affiche l erreur
        divUnknownUser.classList.remove('invisible');
        console.log("pas dans la BDD, créer un compte SU");
        // Cache la div infos connexion
        divInfos.classList.add(invisble) ;

      }
      
    });

    var data = 'email=' + email;
    ajax.send(data);
  };


