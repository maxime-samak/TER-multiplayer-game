# TER-multiplayer-game

## Sujet du projet

### Jeux multijoueurs sur le Web

    Nombre d’étudiants souhaité : 3-4.
    Encadrant : Michel Buffa
    Méthodes, langages ou technologies envisagés : JS/NodeJS.

Dans ce TER je vous propose d’étudier comment on peut implémenter des jeux multijoueurs sur le Web. Par exemple, vous hébergez un jeu multijoueur dans le cloud et vous voulez :

- Gérer plusieurs parties simultanément,
- Faire un jeu d’action temps réel où la latence ne doit pas être perceptible,
- Gérer des collisions, des mouvements de joueurs sans à coup, de la manière la plus efficace possible, alors que les joueurs sont distants et que leur connexions sont de qualité différentes et variables d’une seconde à l’autre.

Pour cela je vous propose d’étudier cet article en particulier les parties situées à la fin, qui traitent des problèmes classiques (mais je pense non étudiés dans votre cursus, ou en tout cas non implémenté) de “compensation de latence” et “prédiction côté client” des mouvements des entités distantes dans les jeux multis.

Vous pouvez tester cette démo à plusieurs par exemple (ouvrez le même URL depuis plusieurs machines), chaque joueur déplace un petit carré de couleur. Le serveur est dans le cloud, sur heroku.com. Ca devrait fonctionner pas trop mal. Maintenant, dans le menu sur la droite, ouvrez la section “Methods” et désactivez l’option “client prediction”, et testez. Faites de même avec “client smoothing”…

Le but de ce projet consistera à développer, en vous inspirant de l’article précité et du code de cette démonstration, un jeu multijoueurs à 60 images/secondes, le plus réactif possible. Par exemple (ce n’est qu’une suggestion), reprendre l’idée d’un jeu développé par des master infos il y a quelques années où les joueurs sont représentés par des carrés de couleur, et doivent aller le plus vite possible d’un point de départ sur la gauche de l’écran, et atteindre un point sur la droite, en évitant des obstacles (qui peuvent être animés)… Le jeu sera hébergé dans le cloud et devra être jouable dans les salles de cours par plusieurs joueurs (jq 16 dans une partie). Vous devrez également fournir des mesures de latence et de bande passante précises pour évaluer le nombre de joueurs maximal (ou plug généralement d’entités synchronisées) pour une bande passante donnée, avant que ce ne soit injouable, même avec les meilleurs algorithmes.

Ce livre reprend également de manière très détaillée, les concepts évoqués et pourra vous aider à mieux les appréhender (chap 7, 8 et 9) et contient par ailleurs, pour ceux qui veulent une bonne culture générale sur le sujet, un historique complet des algos utilisés depuis les premiers jeux multi, une étude sur la sécurité, sur la scalabilité, compare les approches classiques et P2P, étudier les offres “multiplay as a service” etc.

L’implémentation sera en NodeJS/Socket.io côté serveur, et libre côté client (pur JS, frameworks comme PhaserJS, BabylonJS etc.).

## Constitution de l'équipe de développement

- MUNIER Rémy
- HALLACI Sabri
- VASSEUR Adrien
- SAMAK Maxime

## [Milestones](https://github.com/maxime-samak/TER-multiplayer-game/milestones)

### [Milestone 1](https://github.com/maxime-samak/TER-multiplayer-game/milestone/1)
#### Objectifs de livraison
- [x] Analyse du sujet
- [x] Mise en place d'une première version du jeu proposé (dans un but de démonstration)
- [x] Mise en place d'un serveur Socket.io
- [x] Création d'un github et découpage des tâches à réaliser

### [Milestone 1.2](https://github.com/maxime-samak/TER-multiplayer-game/milestone/2)
#### Objectifs de livraison
- [x] Amélioration du jeu
- [x] Récupération et affichage de la latence coté client
- [x] Plusieurs joueurs peuvent désormais se connecter sur un même serveur de jeu

### [Milestone 2](https://github.com/maxime-samak/TER-multiplayer-game/milestone/3)
#### Objectifs de livraison
- [ ] Amélioration du jeu
- [ ] Mise en place d'algorithmes de prévision de mouvements coté client
- [ ] Mise en place d'algorithmes de correction de latence
- [ ] Premières analyses des effets de la latence sur la jouabilité du jeu

### [Milestone 3](https://github.com/maxime-samak/TER-multiplayer-game/milestone/4)
#### Objectifs de livraison
- [ ] Mise en place de graphiques pour visualiser la latence
- [ ] 
- [ ] 
- [ ] 

### [Milestone 4](https://github.com/maxime-samak/TER-multiplayer-game/milestone/5)
#### Objectifs de livraison
- [ ] 
- [ ] 
- [ ] 
- [ ] 


## Quick Start

Dans la console à la racine du projet :  
**npm install** pour installer les dépendances ([Express](https://expressjs.com/), et [socket.io](https://socket.io/)).  
**npm start** pour lancer le serveur sur le [port 3000](http://localhost:3000/).
Enfin taper localhost:3000 sur un navigateur pour ouvrir un client en local.
