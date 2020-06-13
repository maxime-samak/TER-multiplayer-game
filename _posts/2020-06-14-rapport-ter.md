---
title: RAPPORT TER
layout: default
---


## Introduction
### Présentation du groupe ###
Encadrant : Michel Buffa 

    SAMAK Maxime
    MUNIER Rémy
    VASSEUR Adrien
    HALLACI Sabri


### Présentation du sujet ###

Le but de ce TER est de mettre en place des algorithmes de détection et de correction de latence, sur un jeu multijoueur réactif en ligne, puis de tester leurs efficacités et leurs limites. Pour ce faire, nous avons recréé un jeu de type "argar.io" et allons travailler dessus. Nous utiliserons des algorithmes tel que "Prediction" et "Interpolation", nous les testerons avec des latences élevées et/ou variables, ainsi qu'avec une multitude de joueurs pour découvrir leurs limites.

## Technologies utilisés ##

### socket.io ###
 <a href="http://socket.io">socket.io</a> est un outil puissant permettant la communication  en temps réel entre un serveur et un ou plusieurs clients. Sa compatibilité avec des technologies récentes tel que les web sockets, mais aussi avec des basiques du networking comme JSON, ... le rende très flexible.

 Sa simplicité d'utilisation et notre familiarité avec cette technologie (utilisation lors de différents projets) nous ont poussés à son utilisation pour ce TER.

### node.js ###
 <a href="https://nodejs.org/fr/">node.js</a> est un outil facile d'accès et polyvalent, il est en effet aisé d'héberger un projet node.js de par son support par la plupart des fournisseurs d'hébergement, de même son déploiement sur un serveur personnel ne présente pas de difficultés. 
Un grand nombre de modules sont disponibles pour node.js et parmi ces derniers on fera surtout mention d'<a href="http://expressjs.com/">Express</a> couvrant pour nous la totalité des interactions entre notre client et le serveur.


### p5.js ###
 <a href="https://p5js.org/">p5.js</a> est une librairie permettant une certaine facilité dans le développement de contenu créatif, ainsi elle est toute indiquée pour l'élaboration d'un jeu.
 

### Heroku ###
 <a href="https://www.heroku.com/">Heroku</a> est une plateforme d'hébergement orientée cloud, qui nous permet d'héberger notre projet node.js sur un serveur distant, permettant un réel impact sur les vitesses de connections et le multijoueurs de notre projet.

## Jeu multijoueurs en temps réel ##
 Un jeu multijoueur dit "en temps réel" est un jeu ou les joueurs jouent simultanément, ainsi si l'un se déplace, il doit se déplacer "instantanément" aussi sur les écrans des autres joueurs. Ex : FPS, Mario Kart, agar.io ...

### Networking client-serveur ###

Le jeu tourne à l'aide de nodes.js utilisant socket.io pour créer une communication websocket avec un ou plusieurs clients se connectant sur le port 3000 (par défaut).

![connection](/assets/images/client_server_com.png)

On peut séparer la communication d'un client au serveur en trois étapes distinctes:

1. Le client qui se connecte se voit affecter un identifiant unique, et est ajouté à la liste des joueurs actuellement connectés au serveur. On lui attribue également une position de départ ainsi que des informations pour la représentation de son personnage (taille, couleur, ...)
2. Le client va ensuite communiquer au serveur la direction vers laquelle il souhaite se déplacer (via tracking de la souris). Le serveur reçoit ces informations les traites et procède aux différentes modifications sur l'état du jeu.
3. Périodiquement le serveur va broadcaster la liste des joueurs avec leurs informations mises à jour ainsi que l'état courant du jeu.

Les étapes 2 et 3 sont reproduites 10 fois par seconde (par défaut), le taux de rafraîchissement du serveur est modifiable via un curseur sur l'interface client.


#### Client ####
 Le client est la partie du jeu qui s'ouvre dans votre browser, il a la charge de communiquer avec le serveur et de toute la partie graphique du jeu à savoir :
    
1. Le rendu visuel du jeu sur un canvas 
2. La gestion du menu pour les options 
3. Le rendu visuel de la courbe de latence 
    

 De plus c'est le client qui à l'aide d'algorithmes de prédiction va permettre à l'utilisateur d'avoir une sensation d'agir sur le jeu instantanément à partir d'une dizaine (voir moins) d'updates du serveur à la seconde. Ainsi on pourra même conserver une impression d'avoir 60 fps avec seulement 3 ou 4 updates dans le pire des cas. 

#### Serveur ####
 C'est sur le serveur que toute la logique du jeu va s'opérer, à partir des directions envoyés par les clients, il va calculer les nouvelles positions des joueurs et changer l'état du jeu en conséquence. 
 
 A chaque update le serveur procède aux opérations suivantes:
 
* Calcul des nouvelles positions des joueurs à l'aide des vecteurs de position envoyés
* Recherche de collisions entre joueurs
* Recherche de collisions entre les joueurs et les éléments du jeu
* Mise à jour des informations des joueurs
* Broadcast des nouvelles informations

 La centralisation de la logique permet à la fois d'éviter toute triche de la part des joueurs, ainsi que de limiter les échanges nécessaires pour faire tourner correctement le jeu (ce choix d'architecture sera détaillé ultérieurement dans le rapport). 

### Hardware et Browser ###
 Toutes les machines ne sont pas équivalentes en termes de puissance et donc de rapidité, il en va de même pour les browsers qui de par leurs spécificités propres n'auront pas toujours la même efficacité pour une tâche donnée. 
 Une étape essentielle du développement d'un jeu web est donc de pallier à ces inégalités qui toucheront les utilisateurs. 

#### Frame rate ####
 Prenons un exemple simple pour illustrer ce phénomène : un block se trouve sur un axe X, il se déplace sur cet axe de +1 pixel par frame. Ainsi le joueur A qui fait tourner son jeu à 30 fps verra se déplacer ce block de 30 pixels sur l'axe X en 1 seconde, seulement le joueur B ayant un ordinateur plus performant et ayant 60 fps verra ce même block se déplacer de 60 pixels en 1 seconde. 

 Il y a là un véritable problème !

 Solution : pour s'assurer que notre block se déplace toujours à la même vitesse nous allons introduire un concept de delta de temps entre deux rafraîchissements. Cette valeur, exprimée en millisecondes, représente le temps écoulé entre deux itérations de notre boucle de rendu graphique. 
 À 30 fps on a donc un delta d'environ 33.3 ms, et à 60 fps on obtient environ 16.66 ms pour notre delta, on peut désormais multiplier notre valeur de déplacement (+1 sur l'axe x) par nos delta pour obtenir un mouvement à 1 pixel par seconde pour nos deux joueurs.

![delta](/assets/images/deltatime.png)

 Si cet exemple porte uniquement sur les frames rate il ne faut pas oublier que le même principe devrait être appliqué pour toutes valeurs subissant un changement au cours du temps de manière a assurer une cohérence du jeu pour l'ensemble des joueurs. 

#### Calcul de la latence ####

![RTT](/assets/images/RTT.png)

### Autre ###
On pourra également noter la présence d'un panneau de contrôle permettant d'activer/désactiver les codes de prédiction/interpolation/... à la volée ainsi que de modifier certains attributs du serveur.