---
title: RAPPORT TER
layout: default
---


## Introduction ###
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

<img src="{{site.baseurl}}/assets/images/client_server_com.png" alt="connection">

On peut séparer la communication d'un client au serveur en trois étapes distinctes:

1. Le client qui se connecte se voit affecter un identifiant unique, et est ajouté à la liste des joueurs actuellement connectés au serveur. On lui attribue également une position de départ ainsi que des informations pour la représentation de son personnage (taille, couleur, ...)
2. Le client va ensuite communiquer au serveur la direction vers laquelle il souhaite se déplacer (via tracking de la souris). Le serveur reçoit ces informations les traites et procède aux différentes modifications sur l'état du jeu.
3. Périodiquement le serveur va broadcaster la liste des joueurs avec leurs informations mises à jour ainsi que l'état courant du jeu.

Les étapes 2 et 3 sont reproduites 10 fois par seconde (par défaut), le taux de rafraîchissement du serveur est modifiable via un curseur sur l'interface client.


### Client ####
 Le client est la partie du jeu qui s'ouvre dans votre browser, il a la charge de communiquer avec le serveur et de toute la partie graphique du jeu à savoir :
    
1. Le rendu visuel du jeu sur un canvas 
2. La gestion du menu pour les options 
3. Le rendu visuel de la courbe de latence 
    

 De plus c'est le client qui à l'aide d'algorithmes de prédiction va permettre à l'utilisateur d'avoir une sensation d'agir sur le jeu instantanément à partir d'une dizaine (voir moins) d'updates du serveur à la seconde. Ainsi on pourra même conserver une impression d'avoir 60 fps avec seulement 3 ou 4 updates dans le pire des cas. 

### Serveur ####
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

<img src="{{site.baseurl}}/assets/images/deltatime.png" alt="Delta">

 Si cet exemple porte uniquement sur les frames rate il ne faut pas oublier que le même principe devrait être appliqué pour toutes valeurs subissant un changement au cours du temps de manière a assurer une cohérence du jeu pour l'ensemble des joueurs. 

#### Calcul de la latence ####


<img src="{{site.baseurl}}/assets/images/RTT.png" alt="Round trip time (RTT)">

### Autre ###
On pourra également noter la présence d'un panneau de contrôle permettant d'activer/désactiver les codes de prédiction/interpolation/... à la volée ainsi que de modifier certains attributs du serveur.

## Algorithmes

### Prédiction client
Comme nous l'avons dis, c'est le serveur qui calcule la position des joueurs, le client va envoyer son vecteur de mouvement lors de sa boucle, ce message va arriver au serveur après un décalage équivalent au temps de latence, le serveur calcule puis renvoie la position au client dans sa prochaine boucle d'update, le message arrive après un nouveau décalage. Il est donc équivalent qu'en utilisant cette méthode pour calculer la position un long décalage et le joueur va bouger bien après avoir bougé la souris.
C'est ici qu'entre en fonction l'algorithme de prédiction client:
Le client va calculer lui-même sa position avec son vecteur de mouvement, tout en continuant à envoyer ce vecteur au serveur. Le client met à jour sa position seul ce qui évite les décalages et les "sauts" dûs à la latence.
De son côté, le serveur calcule la position de ce même joueurs, en prenant en compte le moment de l'envoi, ainsi lorsque le serveur notifie le joueur de sa nouvelle position, celui-ci devrait déjà s'y trouver, si non, sa position est corrigé côté client, ce qui évite les différence de position entre client et serveur.

Prédiciton client :
```javascript
if (alive) {
        //speed
        let sp = 20;

        let newPosition = createVector(mouseX - width / 2, mouseY - height / 2);
        newPosition.setMag(4);
        newPosition.x = newPosition.x * (delta / sp);
        newPosition.y = newPosition.y * (delta / sp);

        bubble.position.x += newPosition.x;
        bubble.position.y += newPosition.y;

        //bubble.position = createVector(self.x, self.y);
        bubble.radius = self.radius;

        if (bubble.position.x > 3000 - bubble.radius) { bubble.position.x = 3000 - bubble.radius}
        else if (bubble.position.x < -3000 + bubble.radius) { bubble.position.x = -3000 + bubble.radius}
        if (bubble.position.y > 3000 - bubble.radius) { bubble.position.y = 3000 - bubble.radius}
        else if (bubble.position.y < -3000 + bubble.radius) { bubble.position.y = -3000 + bubble.radius}
    }
```

### Interpolation
L'interpolation s'utilise sur les autres joueurs, une implémentation naïve des autres joueurs serait de tout simplement afficher les joueurs à leur nouvelle position a chaque update du serveur, mais cela mène à un rendu très saccadé. La solution apportée est d'enregistrer la dernière position des joueurs et celle tout juste obtenue du serveur et d'interpoler entre les deux pour afficher le mouvement. Cela veut dire que nous affichons les joueurs adverses légèrement en retard par rapport au serveur, mais cet algorithme nous permet de rendre le jeu plus fluide et de réduire les saccades.

Interpolation :
```javascript
for (let i = 0; i < players.length; i++) {
        if (players[i].id === bubble.id) { continue; }
        else {
            let amount = 1 / (60 / document.getElementById("nbUpdate").value);

            let lastPosition = createVector(players[i].previousX, players[i].previousY);
            let newPosition = createVector(players[i].x, players[i].y);

            let currentPosition = p5.Vector.lerp(lastPosition, newPosition, amount);

            players[i].previousX = currentPosition.x;
            players[i].previousY = currentPosition.y;

            fill(players[i].color.r, players[i].color.g, players[i].color.b);
            ellipse(players[i].previousX, players[i].previousY, players[i].radius * 2);
        }
    }
```

### Réconciliation
Le but de la réconciliation est de rendre plus fluide les déplacements du joueur, elle permet d'avoir un mouvement fluide entre la positon actuelle et la position désirée, cela évite au joueur d'avoir de trop gros "sauts" lors des updates du serveur. Couplée avec la prédiction client, la réconciliation permet de corriger les erreurs de prédiction de manière plus fluide, évitant ainsi les saccades.

Réconciliation :
```javascript
if (alive) {
        let serverPosition = createVector(self.x, self.y);
        let clientPosition = createVector(bubble.position.x, bubble.position.y);

        let nextPosition = p5.Vector.lerp(clientPosition, serverPosition, 0.1);

        bubble.position = nextPosition;
    }
```

### Démo ###

{% include demo.html %}
{{ includeGuts | replace: '    ', ''}}

