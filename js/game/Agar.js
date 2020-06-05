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
    let newScale=1;
    if(bubble.radius<350)
        newScale = 64 / bubble.radius;
    else
        newScale = 0.18;
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

/* Activate spectator mode on death */
function spectatorMode() {
    translate(width / 2 , height / 2);
    scale(currentScale);
    textSize(500);
    fill(255);
    text("Spectator Mode", -1500, 3500);
}

/* Setup for p5 drawings */
function setup() {
    let canvas = createCanvas(windowWidth * 0.6, windowHeight * 0.8);
    canvas.parent('game');

    /* to fix later: wrong names */
    corners.topLeft = createVector(-boundaries.width, boundaries.height);
    corners.topRight = createVector(boundaries.width, boundaries.height);
    corners.bottomLeft = createVector(-boundaries.width, -boundaries.height);
    corners.bottomRight= createVector(boundaries.width, -boundaries.height);

    let r = Math.floor(Math.random() * 4);
    switch (r) {
        case 0:
            bubble = new Bubble(corners.topLeft.x, corners.topLeft.y, 64);
            break;
        case 1:
            bubble = new Bubble(corners.topRight.x, corners.topRight.y, 64);
            break;
        case 2:
            bubble = new Bubble(corners.bottomLeft.x, corners.bottomLeft.y, 64);
            break;
        case 3:
            bubble = new Bubble(corners.bottomRight.x, corners.bottomRight.y, 64);
            break;
        default:
            break;
    }

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

/* Draw on each frame (gameloop) */
function draw() {
    delta = deltaTime;
    background(0);

    if(!alive){ spectatorMode(); }

    if(alive) {
        canvasTranslation();
        bubble.show();
    }

    findSelf(players);
    if (document.getElementById('prediction').checked) {prediction(players);}
    //reconciliation();
    if (document.getElementById('interpolation').checked) {interpolation(players);}
    if (document.getElementById('default').checked) {defaultDraw(players);}
    if (document.getElementById('self-default').checked) {selfDefaultDraw(players);}

    foodDraw();
    drawBoundaries();

}

/* When the user resize its browser window, rescales the canvas to match the new size */
function windowResized() {
    resizeCanvas(windowWidth * 0.6, windowHeight * 0.8);
}

/* Send data to the server x times per second */
setInterval(() => {
    if(alive) {
        bubble.update(boundaries);
    }}, 100);
