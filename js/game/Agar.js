let bubble;
let players = [];
let food = [];

let delta = 1;
let currentScale = 1;
let alive = true;

/* The map size (not related with the canvas size) */
let boundaries = {
    width: 3000,
    height: 3000
};

let corners = {};

/* Manage the process of food being eaten by a player */
function foodDraw() {
    food.forEach(function (item) {
        item.show();
    })
}

/* Manage de translation of the canvas according to the player's current size */
function canvasTranslation() {
    translate(width / 2 , height / 2);
    let newScale = 64 / bubble.radius;
    currentScale = lerp(currentScale, newScale, 0.1);
    scale(currentScale);
    translate(- bubble.position.x, - bubble.position.y);
}

/* Visual representation of the boundaries of the map */
function drawBoundaries() {
    stroke(255);
    strokeWeight(10);
    line(corners.topLeft.x, corners.topLeft.y, corners.topRight.x, corners.topRight.y);
    line(corners.topRight.x, corners.topRight.y, corners.bottomRight.x, corners.bottomRight.y);
    line(corners.bottomRight.x, corners.bottomRight.y, corners.bottomLeft.x, corners.bottomLeft.y);
    line(corners.bottomLeft.x, corners.bottomLeft.y, corners.topLeft.x, corners.topLeft.y);
    strokeWeight(1)
}

function spectatorMode() {
    translate(width / 2 , height / 2);
    scale(currentScale);
    textSize(500);
    fill(255);
    text("Spectator Mode", -1500, 3500);
}

function setup() {
    let canvas = createCanvas(windowWidth * 0.6, windowHeight * 0.8);
    canvas.parent('game');

    /* to fix later: wrong names */
    corners.topLeft = createVector(-boundaries.width, boundaries.height);
    corners.topRight = createVector(boundaries.width, boundaries.height);
    corners.bottomLeft = createVector(-boundaries.width, -boundaries.height);
    corners.bottomRight= createVector(boundaries.width, -boundaries.height);

    bubble = new Bubble(-3000, -3000, 64);

    const data = {
        x: bubble.position.x,
        y: bubble.position.y,
        radius: bubble.radius,
        color: {
            r: bubble.r,
            g: bubble.g,
            b: bubble.b
        },
    };

    send("start", data);
}

function draw() {
    delta = deltaTime;
    background(0);

    if(!alive){ spectatorMode(); }

    if(alive) {
        canvasTranslation();
        bubble.show();

    }

    if (document.getElementById('prediction').checked) {
        prediction(players);
    }
    else if (document.getElementById('interpolation').checked) {
        interpolation(players)
    }
    else { defaultDraw(players) }

    foodDraw();
    drawBoundaries();

}

function windowResized() {
    resizeCanvas(windowWidth * 0.6, windowHeight * 0.8);
}

setInterval(() => {
    if(alive) {
        bubble.update(boundaries);
    }}, 100);
