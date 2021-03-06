# Projet_Dev_ApeX

<img src="./images/Logo_ApexWeb.png" alt="ApeX web Logo" width="150em" align="center"/>


Le projet "ApeX web" est un projet scolaire réalisé par quatre étudiants de l'Ecole Nationale des Sciences Géographiques :
*  Grégoire BONHOURE (chef de projet)
*  Etienne LEBRETON
*  Manon PAYOUX
*  Fanny VIGNOLLES

Encadré par Léo PICHON et Guilhem BRUNEL de la chaire AgroTIC, son objectif est de créer une plateforme web complémentaire à l'application Androïd "ApeX mobile" déjà existante. Ses deux outils numériques ont pour but de faciliter le suivi de l'évolution de la vigne.


## 1. Architecture

L'architecture de notre projet correspond à un dossier par gestion de pages :
1.  Accueil :
    *  avec les différentes pages html propre à l'accueil : Accueil, A propos, Contact
2.  Authentification :
    *  les pages html pour s'authentifier ou de renvoi si l'utilisateur n'est pas connecté,
    *  les javascripts et PHP associés,
    *  le CSS associé.
5.  Bootstrap :
    *  les outils pour l'utilisation de bootstrap.
4.  Carto :
    *  les HTML des deux pages de cartographie : croissance de la vigne et contrainte hydrique,
    *  les javascripts et PHP associés,
    *  les CSS associé.
5. Documentation :
    *  le rapport d'analyse du projet réalisé pour l'ENSG,
    *  le tutoriel de l'API Firebase pour ce projet.
6. images :
    *  les différentes images utilisées dans le site.
7.  Tab :
    *  le HTML de la vue tabulaire,
    *  les javascripts et PHP associés,
    *  les CSS associé.

De plus, divers fichiers se trouvent à la racine du projet :
*  `ìndex.css` : le css central du site.
*  `connexionBDD.php` : fichier central de connexion à la base de données ApeX via mySQL.
*  `demo_apex.sql` : la base de données tests.

## 2. Déploiement du site

Pour déployer le site fonctionnel, plusieurs actions sont à mener :
1. Mettre à jour les identifiants de la base de données :
    ```php
        $server = "localhost";  // nom du serveur
        $user= "root";          // nom de l'utilisateur
        $pass= "root";          // mot de passe
        $bdd= "gbrunel1_apex";  // nom de la base de données
    ```
2. Mettre à jour les informations du projet Firebase : consulter le TutoFirebase.pdf ou le README.md du dossier Authentification.
#   s t a g e _ a p e x _ w e b  
 