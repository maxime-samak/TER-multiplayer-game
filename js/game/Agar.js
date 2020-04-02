let bubble;
let players = [];

let food = [];
const maxFood = 1500;

let currentScale = 1;
let alive = true;

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
    let tempId = -1;
    for (var i = food.length - 1; i >= 0; i--) {
        food[i].show();
        if (bubble.eats(food[i])) {
            //console.log("food at pos: ", food[i].position, " was eaten")
            tempId = food[i].id; // Get the food id, send it to the server to process
            food.splice(i, 1);

        }
    }
    if (tempId !== -1) {
        socket.emit("clientEatsFood", tempId);
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

function spectatorMode() {
    translate(width / 2 , height / 2);
    scale(currentScale);
    textSize(500)
    fill(255);
    text("Spectator Mode", -1500, 3500);
}


function setup() {
    createCanvas(windowWidth * 0.6, windowHeight * 0.8);

    /* to fix later: wrong names */
    corners.topLeft = createVector(-boundaries.width, boundaries.height);
    corners.topRight = createVector(boundaries.width, boundaries.height);
    corners.bottomLeft = createVector(-boundaries.width, -boundaries.height);
    corners.bottomRight= createVector(boundaries.width, -boundaries.height);

    //bubble = new Bubble(random(boundaries.width), random(boundaries.height), 64);
    bubble = new Bubble(-3000, -3000, 64);
    //foodSetup();
    const data = {
        x: bubble.position.x,
        y: bubble.position.y,
        radius: bubble.radius,
        color: {
            r: bubble.r,
            g: bubble.g,
            b: bubble.b
        }
    };
    socket.emit("start", data);

    socket.on("setClientId", id => {
        bubble.id = id;
    });

    socket.on("sendFoodList", foodList => {
        food = [];
        for (let i=0 ; i<foodList.length ; i++) {
            const tempBubble = new Bubble(foodList[i].x, foodList[i].y, foodList[i].radius, foodList[i].color.r, foodList[i].color.g, foodList[i].color.b);
            tempBubble.id = foodList[i].id;
            food.push(tempBubble);
        }
        console.log(food.length);
    });

    socket.on("kill", data => {
        // console.log(data);
        if(data.id==socket.id)
            bubble.radius=data.radius;
    });

    socket.on("death", data => {
        // console.log(data);
        if(data.id==socket.id) {
            alive = false;
            currentScale = 0.08;

        }
    });

    socket.on("heartbeat", data => {
        // console.log(data);
        players = data;
    })
}

function draw() {
    background(0);

   if(!alive){
       spectatorMode();
       food.forEach(foodBubble => foodBubble.show());
   }

    if(alive) {
        canvasTranslation();
        bubble.show();
        bubble.update(boundaries);

        const data = {
            x: bubble.position.x,
            y: bubble.position.y,
            radius: bubble.radius
        };
        socket.emit("update", data);

        // foodManagement();
        // foodConsumption();

        // foodManagement();
        foodConsumption();
    }


    for (let i = 0 ; i < players.length; i++) {
        if (players[i].id !== bubble.id) {
            fill(players[i].color.r, players[i].color.g, players[i].color.b);
            ellipse(players[i].x, players[i].y, players[i].radius * 2);
        }
    }


    /* Visual representation of the boundaries of the map */
    stroke(255);
    strokeWeight(10);
    line(corners.topLeft.x, corners.topLeft.y, corners.topRight.x, corners.topRight.y);
    line(corners.topRight.x, corners.topRight.y, corners.bottomRight.x, corners.bottomRight.y);
    line(corners.bottomRight.x, corners.bottomRight.y, corners.bottomLeft.x, corners.bottomLeft.y);
    line(corners.bottomLeft.x, corners.bottomLeft.y, corners.topLeft.x, corners.topLeft.y);
    strokeWeight(1)
}

function windowResized() {
    resizeCanvas(windowWidth * 0.6, windowHeight * 0.8);
}
