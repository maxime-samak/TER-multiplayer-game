function prediction(players) {
    for(let i = 0; i < players.length; i++) {
        if (players[i].id !== bubble.id || !alive) { continue; }


        else {
            let newPosition = createVector(mouseX - width / 2, mouseY - height / 2);
            newPosition.setMag(4);
            newPosition.x = newPosition.x * (delta / 50);
            newPosition.y = newPosition.y * (delta / 50);
            bubble.position.add(newPosition);
            bubble.position = createVector(players[i].x, players[i].y);
            bubble.radius = players[i].radius;
        }
    }
}

function interpolation(players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === bubble.id) { continue; }
        else {

            let amount = 0.1 * (delta / 50);

            let lastPosition = createVector(players[i].previousX, players[i].previousY);
            let newPosition = createVector(players[i].x, players[i].y);

            let currentPosition = p5.Vector.lerp(lastPosition, newPosition, amount);

            players[i].previousX = currentPosition.x;
            players[i].previousY = currentPosition.y;

            fill(players[i].color.r, players[i].color.g, players[i].color.b);
            ellipse(players[i].previousX, players[i].previousY, players[i].radius * 2);
        }
    }
}

function selfDefaultDraw(players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === bubble.id && alive) {
            bubble.position = createVector(players[i].x, players[i].y);
            bubble.radius = players[i].radius;
        }
    }
}

function defaultDraw(players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === bubble.id) { continue; }
        else {
            fill(players[i].color.r, players[i].color.g, players[i].color.b);
            ellipse(players[i].x, players[i].y, players[i].radius * 2);
        }
    }
}
