var reconciliating = false;
var self;

function findSelf(players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === bubble.id) {
            self = players[i];
        }
    }
}

function prediction() {
    if (alive) {
        let sp = 25;

        let newPosition = createVector(mouseX - width / 2, mouseY - height / 2);
        newPosition.setMag(4);
        newPosition.x = newPosition.x * (delta / sp);
        newPosition.y = newPosition.y * (delta / sp);

        self.x += newPosition.x;
        self.y += newPosition.y;

        bubble.position = createVector(self.x, self.y);
        bubble.radius = self.radius;
    }
}

function reconciliation() {
    reconciliating = true;


}

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

function selfDefaultDraw() {
    if (alive) {
        bubble.position = createVector(self.x, self.y);
        bubble.radius = self.radius;
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
