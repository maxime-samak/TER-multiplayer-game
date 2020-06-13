# TER développement d'un jeu multijoueur

## Introduction 

Le but de ce TER est de mettre en place des algorithmes de détection et de correction de latence, sur un jeu multijoueur réactif en ligne, puis de tester leurs efficacités et leurs limites. Pour ce faire nous avons recréer un jeu de type "argar.io" et allons travailler dessus. Nous utiliserons des algoritmes tel que "Client prediction" et "Client interpolation", nous les testerons avec des latences élevées et/ou variables, ainsi qu'avec une multitude de joueurs pour découvrir leurs limites.

## Technologies utilisés

### Socket.io

[socket.io](http://socket.io) est un outil puissant permettant la communication  en temps réel entre un serveur et un ou plusieurs clients. Sa compatibilité avec des technologies récentes tel que les web sockets, mais aussi avec des basiques du networking comme JSON, ... le rende très flexible.
Sa simplicité d'utilisation et notre familiarité avec cette technologie (utilisation lors de différents projets) nous ont poussés à son utilisation pour ce TER.

### Node.js

[node.js](http://nodejs.org/) est un outil facile d'accès et polyvalent, il est en effet aisé d'héberger un projet Node.js de par son support par la plupart des fournisseurs d'hébergement, de même son déploiement sur un serveur personnel ne présente pas de difficultés.
Un grand nombre de modules sont disponibles pour Node.js et parmi ces derniers on fera surtout mention d'[Express](http://expressjs.com/) couvrant pour nous la totalité des interactions entre notre client et [socket.io](http://socket.io).

### p5.js
[p5.js](https://p5js.org/) est une librairie permettant une certaine facilité dans le développement de contenu créatif, ainsi elle est tout indiqué pour l'élaboration d'un jeu.

### Heroku
[Heroku](https://www.heroku.com/) est une plateforme d'hébergement orientée cloud, qui nous permet d'héberger notre projet Node.js sur un serveur distant, permettant un réel impact sur les vitesses de connections et le multijoueurs de notre projet.

## Utilisation et "quick start"
Toutes les étapes de l’utilisation du projet seront disponibles [ici](https://github.com/maxime-samak/TER-multiplayer-game#quick-start).
Le projet est utilisable en ligne [ici](https://ter-jeux-multijoueurs.herokuapp.com/).

## Jeu multijoueurs en temps réel
Un jeu multijoueur dis "en temps réel" est un jeu ou les joueurs jouent simultanément, ainsi si l'un se déplace, il doit se déplacé "instentanément" aussi sur les écrans des autres joueurs. Ex : FPS, agario..

#### Networking serveur-client
Notre façon de gérer les connections est assez simple. Pour commencer nous allumons le serveur, ensuite chaque client qui s'allume se connectera et s'attribue une "bulle",il envoie alors son nom et sa bulle au serveur. La liste des joueurs est mise à jour avec cette nouvelle bulle par le serveur, il l'enverra alors la nouvelle liste a tout le joueur qui recevrons les informations de cette nouvelle bulle (position, taille, couleur). Pendant la partie, les clients continue d'envoyer leurs informations, et le serveur continue de mettre a jour ses données et de les distribuer a tous les joueurs.


## Le jeu à proprement parler
La création d'un jeu simple, nécessitant une connexion à un serveur en temps réel a été l'une des premières étapes abordées lors de ce TER.
[agar.io](https://agar.io) regroupant ces différentes caractéristiques, notre jeu se base sur les concepts proposés par celui-ci.

### Un peu de gameplay
#### [WIP]

### Hardware et Browser
Toutes les machines ne sont pas équivalentes en termes de puissance et donc de rapidité, il en va de même pour les browsers qui de par leurs spécificités propres n'auront pas toujours la même efficacité pour une tâche donnée.
Une étape essentielle du développement d'un jeu web est donc de pallier à ces inégalités qui toucheront les utilisateurs.

#### Frame rate
Prenons un exemple simple pour illustrer ce phénomène : un block se trouve sur un axe X, il se déplace sur cet axe de +1 pixel par frame. Ainsi le joueur A faisant tourner son jeu à 30 fps verra se déplacer ce block de 30 pixels sur l'axe X en 1 seconde, seulement le joueur B ayant un ordinateur plus performant et ayant 60 fps verra ce même block se déplacer de 60 pixels en 1 seconde.
Il y a là un véritable problème !

Solution : pour s'assurer que notre block se déplace toujours à la même vitesse nous allons introduire le concept d'un delta de temps entre deux rafraîchissements. Cette valeur exprimé en millisecondes représente le temps écoulé entre deux itérations de notre boucle de rendu graphique.
A 30 fps on a donc un delta d'environ 33.3ms, et à 60 fps on obtient environ 16.66ms pour notre delta on peut désormais multiplier notre valeur de déplacement (+1 sur l'axe x) par nos delta pour obtenir un mouvement à 1 pixel par seconde pour nos deux joueurs.

![Frame rate independeance](https://github.com/maxime-samak/TER-multiplayer-game/blob/master/doc/assets/deltatime.png)

Si cet exemple porte uniquement sur les frames rate il ne faut pas oublier que le même principe devrait être appliqué pour toutes valeurs subissant un changement au cours du temps de manière a assurer une cohérence du jeu pour ses joueurs.

### Modulité
Dans notre jeu se situe a droite un menu, celui si permets de moduler les variables du client afin de pouvoir tester nos algorithmes à la volée. Ainsi il nous sera possible de simuler, dans le client, des paramètres comme la variation de latence, le type d'algortihme ou bien encore le nombre d'update qu'effectuera le serveur par seconde. 

### Le client
Le client se connecte au serveur par socket.io, il reçoit les informations nécessaires au lancement de sa partie. Par la suite, il reçoit à chaque update serveur, la liste des joueurs et leurs positions, la liste des Food, il met alors à jour ces informations. La boucle client est effectuée une fois par seconde, sa seule utilité est de calculer le vecteur de mouvement et de le transmettre au serveur pour le calcul des positions. Le calcul de ce vecteur à partir du positionnement de la souris est la seule responsabilité du client.

### Le Serveur
Le serveur est responsable de la quasi-totalité des fonctionnalités du jeu. Pour commencer, il utilise socket.io pour recevoir de nouveaux clients, leur créer un joueur et plus tard communiquer avec eux. Lorsqu'un joueur est créé le client envoi, sa position, son radius et sa couleur, en échange le serveur ajoute ces informations dans la liste des joueurs et réponds avec l'id du client et la liste de Food.
À chaque update le serveur doit envoyer à tous les joueurs la liste des joueurs mise à jour avec les nouvelles positions et la liste de Food. Il est aussi responsable de vérifier les collisions entre joueurs et avec les Food , ainsi, il doit vérifier a chaque update si un joueur est en collision avec une Food, supprimer les Food mangées de la liste et en créer de nouvelles. Il doit aussi vérifier si deux joueurs sont en collision, le plus petit est absorbé et notifié de sa mort part la socket, le plus gros et notifié de son gain de taille.
Il est aussi responsable du déplacement des joueurs, lorsqu'un client envoie son vecteur de mouvement ( la position de la souris), le serveur va alors calculer sa position et va mettre à jour ses infos.

#### La boucle d'update (HeartBeat)
La boucle principale du serveur est responsable des updates, c'est elle qui lance les fonctions de vérification des collisions et qui distribue les informations aux joueurs. Par défaut, cette boucle effectue 10 updates par seconde. Ce nombre d'update est paramétrable dans le menu du jeu et est uniformisé entre tout les joueurs. Un nombre faible d'updates est synonymes de peu d'information pour les clients, il est donc naturel de voir les autres joueurs saccader ou les Food être supprimées un instant après être passé dessus. Au contraire, un nombre élevé permet aux clients d'être plus précis et plus fluide, mais le nombre trop important de calculs et de requête ralentis le serveur créant ainsi des décalages entre client et serveur.

### Hébergement sur Heroku

#### Première version
Lors de notre premier déploiement du jeu sur Heroku, l'architecture que nous utilisions était différente, le client vaait beaucoup plus de responsabilités. En enffet c'est lui qui calculer le mouvement et l'envoyais, avec le vecteur de mouvement, une fois par seconde au serveur. C'était aussi le client qui calculais les collisions entre joueurs et entre Food, et qui à chaque fois envoyais les informations au serveur. Cette architechure a soulevé un problème, les clients envoyais trop de requete au serveur, le serveur cloud Heroku était alors très rapidement surchargé et avec seulement deux joueurs nous nous retrouvions avec des décalages entre serveur et clients allant jusqu'a 10 secondes ou plus. Nous avons donc repenser notre couple serveur-client pour le passer sur l'architechure que nous avons maintenant, où le serveur est le principal responsable des fonctionnalités.

#### Seconde version
Grâce au changement pour l'architechure, présentée précédemment, le nombre de reqêtes envoyées au serveur a largement baissé, des décalages entre serveur et clients peuvent toujours se créer en particulier avec un nombre d'updates serveur elevé.
 

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
Le but de la réconciliation est de rendre plus fluide les déplacements du joueur, elle permet d'avoir un mouvement fluide entre la postion actuelle et la position désirée, cela évite au joueur d'avoir de trop gros "sauts" lors des updtaes du serveur. Couplée avec la prédiction client, la réconciliation permets de corriger les erreurs de prédiction de manière plus fluide, évitant ainsi les saccades.

Réconciliation :
```javascript
if (alive) {
        let serverPosition = createVector(self.x, self.y);
        let clientPosition = createVector(bubble.position.x, bubble.position.y);

        let nextPosition = p5.Vector.lerp(clientPosition, serverPosition, 0.1);

        bubble.position = nextPosition;
    }
```

###


## Notes et références
Cette étude est basé en partie sur les travaux de [Sven Bergström](https://underscorediscovery.com/#home)

[Références complémentaires](https://github.com/maxime-samak/TER-multiplayer-game/blob/master/doc/ref.md)

