var self;
var flag = false;

/* Find client's player values in the data sent by the server */
function findSelf(players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === bubble.id) {
            self = players[i];
        }
    }
}

/* Replicate the server movement behavior to draw a visual representation of it on the client (at 60 fps) */
function prediction() {
    if (alive) {
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
}

/* Correct the client predicted movements to match the servers*/
function reconciliation() {
    if (alive) {
        let serverPosition = createVector(self.x, self.y);
        let clientPosition = createVector(bubble.position.x, bubble.position.y);

        let nextPosition = p5.Vector.lerp(clientPosition, serverPosition, 0.1);

        bubble.position = nextPosition;
    }
}

/* Draw other players movements at 60 fps but at t-1 */
function interpolation(players) {
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
}

/* Draw client on server update */
function selfDefaultDraw() {
    if (alive) {
        bubble.position = createVector(self.x, self.y);
        bubble.radius = self.radius;
    }
}

/* Draw other players on server update */
function defaultDraw(players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === bubble.id) { continue; }
        else {
            fill(players[i].color.r, players[i].color.g, players[i].color.b);
            ellipse(players[i].x, players[i].y, players[i].radius * 2);
        }
    }
}
