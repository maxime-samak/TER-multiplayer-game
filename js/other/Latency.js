function prediction(players) {

}

function interpolation(players) {
    for(let i = 0; i < players.length; i++) {
        if (players[i].id !== bubble.id) {

            let currentPosition = createVector(players[i].x, players[i].y);
            let nextPosition = createVector(players[i].nextX, players[i].nextY);
            nextPosition.setMag(1.5);
            currentPosition.add(nextPosition);
            players[i].x = currentPosition.x;
            players[i].y = currentPosition.y;

            //players[i].x = lerp(players[i].x, players[i].nextX, 0.01);
            //players[i].y = lerp(players[i].y, players[i].nextY, 0.01);

        }
    }


}