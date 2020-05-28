function prediction(players) {
    for(let i = 0; i < players.length; i++) {
        if (players[i].id != bubble.id || !alive) { continue; }

        else {
            bubble.predict() // provisoire
        }
    }
}

function interpolation(players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == bubble.id) { continue; }
        else {

            players[i].previousX = lerp(players[i].previousX, players[i].x, (0.2 * (delta / 10))); //travel 10% of the distance per frame
            players[i].previousY = lerp(players[i].previousY, players[i].y, (0.2 * (delta / 10))); //travel 10% of the distance per frame

            fill(players[i].color.r, players[i].color.g, players[i].color.b);
            ellipse(players[i].previousX, players[i].previousY, players[i].radius * 2);
        }
    }
}

function defaultDraw(players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == bubble.id && alive) {
            bubble.position = createVector(players[i].x, players[i].y);
            bubble.radius = players[i].radius;
        }
        else {
            fill(players[i].color.r, players[i].color.g, players[i].color.b);
            ellipse(players[i].x, players[i].y, players[i].radius * 2);
        }
    }
}
