**AUTHENTIFICATION**
---

## 1. Se connecter au site

L'authentification du site est gérée par l'API Firebase de Google.

La page d'identification pour un utilisateur est auth.html.

Elle se déroule en deux temps :

1.  Entrer son adresse mail :
    * Vérification de son existence dans la BDD ApeX car il faut être utilisateur de l'application ApeX mobile pour pouvoir utiliser ApeX web.
    * Si le mail n'est pas dans la BD ApeX : accès à la connexion par mot de passe (stable) ou par un token envoyé par mail (instable).
    * Si le mail n'existe pas, un message d'avertissement s'affiche.
    Ceci laisse place à la création d'un module de gestion pour ajouter des super utilisateurs par la suite.
2.  Se connecter :
    * Si c'est la première utilisation de la plateforme web :
        * Entrer son mdp => Création du user dans la BDD Firebase et redirection vers l'acceuil du site ApeX web.
    * Si l'utilisateur a déjà utilisé l'application web :
        * Connexion avec son mdp et redirection vers l'acceuil du site ApeX web.
        * Connexion par un token envoyé par mail.

## 2. Redirection pour utilisateur non connecté
Une redirection vers la page `deconnecte.html` a lieu lorsque l'utilisateur tente d'accéder à une page via son URL sans être connecté.

Pour faciliter le développement, la redirection peut être désactivé :
  1. Aller dans `authConfiguration.js`
  1. Commenter la ligne 132 :
    ```javascript
        document.location.href="../Authentification/deconnecte.html";
    ```





**FIREBASE**
---

## 1. Les objets Firebase :
  * `firebase.auth()` ou la variable `auth` : est l'élement permettant d'accéder aux fonctionnalités firebase.
  * `firebase.auth().currentUser` ou la variable `user` : donne le JSON des informations de l'utilisateur connecté ou null si il n'y a pas d'utilisateur connecté.
  * `firebase.auth().currentUser.email` : donne l'email de l'utilisateur courant.


## 2. Déploiement du site :

Pour pouvoir déployer le site fonctionnel avec l'authentification, quelques étapes sont nécessaire.

### 2.1 Dans Firebase :

*  Créer un projet Firebase à partir d'une adresse mail Google.
*  Autoriser la connexion par mail + mot de passe et par mail :
    1.  Aller dans la console Firebase
    2.  Séléctionner le projet
    3.  Aller dans l'onglet Authentification
    4.  Onglet "Modes de connexion"
    5.  Sélectionner ""
    6.  Activer les deux options.

*  Ajouter le domaine du site dans le projet Firebase :
    1.  Aller dans la console Firebase
    2.  Séléctionner le projet
    3.  Aller dans l'onglet Authentification
    4.  Onglet "Modes de connexion"
    5.  "Ajouter un domaine"



### 2.2 Dans le code du projet :

#### 2.2.1  Modifier la clé API de projet :
1.  Aller dans `authConfiguration.js`
2.  Modifier les infos sur la clé dans la partie :

    ```javascript
    const config = {
      // A modifier a la creation du projet firebase sur l adresse mail de gestion d ApeX
        apiKey: "AIzaSyAwQ57ydwZH_wGht0fd6ml4KhYDHHsb6xo",
        authDomain: "apexweb-authentification.firebaseapp.com",
        databaseURL: "https://apexweb-authentification.firebaseio.com",
        projectId: "apexweb-authentification",
        storageBucket: "apexweb-authentification.appspot.com",
        messagingSenderId: "750280712215"
    };
    ```

#### 2.2.2  Modifier l'url vers lequel le lien mail devra renvoyer l'utilisateur (connecté) :
1.  Aller dans `authConfiguration.js`
2.  Modifier l'URL dans la partie :

    ```javascript
        const actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be whitelisted in the Firebase Console.
          url: 'http://localhost:8888/projet_dev_apex/Accueil/accueil.html',
          // This must be true.
          handleCodeInApp: true
        };
    ```
