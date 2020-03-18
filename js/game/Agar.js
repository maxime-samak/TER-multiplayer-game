const socket = io();

let bubble;

let food = [];
const maxFood = 1500;

let currentScale = 1;

/* The map size (not related with the canvas size) */
let boundaries = {
    width: 3000,
    height: 3000
};

let corners = {};

/* Manage the initial setup of foods on the map */
function foodSetup() {
    for (var i = 0; i < maxFood; i++) {
        let radius = random(12, 15);
        let x = random(- boundaries.width + radius, boundaries.width - radius);
        let y = random(- boundaries.height + radius, boundaries.height - radius);
        food[i] = new Bubble(x, y, radius);
    }
}

/* Manage de refresh rate of the foods on the map */
function foodManagement() {
    let foodNumber = food.length;
    let newFood = random(foodNumber, maxFood);

    for (var i = foodNumber; i < newFood; i++) {
        let radius = random(12, 20);
        let x = random(- boundaries.width + radius, boundaries.width - radius);
        let y = random(- boundaries.height + radius, boundaries.height - radius);
        food[i] = new Bubble(x, y, radius);
    }
}

/* Manage the process of food being eaten by a player */
function foodConsumption() {
    for (var i = food.length - 1; i >= 0; i--) {
        food[i].show();

        if (bubble.eats(food[i])) {
            console.log("food at pos: ", food[i].position, " was eaten")
            food.splice(i, 1);
        }
    }
}

/* Manage de translation of the canvas according to the player's current size */
function canvasTranslation() {
    translate(width / 2 , height / 2);
    let newScale = 64 / bubble.radius;
    currentScale = lerp(currentScale, newScale, 0.1);
    scale(currentScale);
    translate(- bubble.position.x, - bubble.position.y);
}


function setup() {
    createCanvas(800, 800);

    /* to fix later: wrong names */
    corners.topLeft = createVector(-boundaries.width, boundaries.height);
    corners.topRight = createVector(boundaries.width, boundaries.height);
    corners.bottomLeft = createVector(-boundaries.width, -boundaries.height);
    corners.bottomRight= createVector(boundaries.width, -boundaries.height);

    bubble = new Bubble(0, 0, 64);
    foodSetup();
}

function draw() {
    background(0);

    canvasTranslation();

    bubble.show();
    bubble.update();

    foodManagement();
    foodConsumption();

    /* Visual representation of the boundaries of the map */
    stroke(255);
    strokeWeight(10);
    line(corners.topLeft.x, corners.topLeft.y, corners.topRight.x, corners.topRight.y);
    line(corners.topRight.x, corners.topRight.y, corners.bottomRight.x, corners.bottomRight.y);
    line(corners.bottomRight.x, corners.bottomRight.y, corners.bottomLeft.x, corners.bottomLeft.y);
    line(corners.bottomLeft.x, corners.bottomLeft.y, corners.topLeft.x, corners.topLeft.y);
    strokeWeight(1)
}