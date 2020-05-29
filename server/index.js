const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {Player} = require("./player");
const {addPlayer, removePlayer, getPlayer, getPlayers} = require("./players");
const {removeFood, addFood, getFoodList, foodManagement} = require("./food");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "..", "js");

app.use(express.static(publicDirectoryPath));

let nbUpdates = 10;

function heartbeat() {
    playerEatsFoodCheck();
    io.emit("sendFoodList", getFoodList());

    playerEatsPlayerCheck();
    io.emit("heartbeat", getPlayers());
}

io.on("connection", socket => {
    let connectionStamp = Date.now();
    let emitStamp = -1;
    let time = Date.now();
    socket.emit("changedNbUpdates",nbUpdates);

    console.log(`Player ${socket.id} joined`);

    socket.on("pongo", () => { // "pong" is a reserved event name
        let timeStamp = Date.now();
        socket.emit("data", timeStamp, timeStamp - emitStamp, Date.now() - connectionStamp)
    });

    /* When client connects for the first time */
    socket.on("start", data => {
        console.log(`ID: ${socket.id}, x: ${data.x}, y: ${data.y}, radius: ${data.radius}`);
        const player = new Player(socket.id, data.x, data.y, data.radius, data.color);
        addPlayer(player);
        socket.emit("setClientId", socket.id);
        socket.emit("sendFoodList", getFoodList());
    });

    /* On player update move the player according to the desired direction (data) */
    socket.on("playerNewTarget", data => {
        let currentTime = Date.now();
        let deltaTime = currentTime - time;
        time = currentTime;

        const player = getPlayer(socket.id);

        move(player, data, deltaTime);
    });

    socket.on("changeNbUpdates", data => {
        nbUpdates= data;
        clearInterval(interval);
        interval = setInterval(heartbeat, 1000/nbUpdates);
        io.emit("changedNbUpdates",nbUpdates);
    });

    socket.on("disconnect", () => {
        console.log(`Player ${socket.id} disconnected`);
        removePlayer(socket.id);
        console.log(getPlayers());
    });

    setInterval(() => {
        emitStamp = Date.now();
        socket.emit("ping");
    },500);

});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

function playerEatsPlayerCheck() {
    players = getPlayers();
    for(let i = 0; i < players.length-1 ; i++){
        for(let j = i+1; j < players.length ; j++){
            let distance = (Math.sqrt(Math.pow(players[j].x-players[i].x,2)+Math.pow(players[j].y-players[i].y,2)));
            let surfaceArea = (Math.PI * (players[i].radius ** 2)) + (Math.PI  * (players[j].radius ** 2));
            if (distance < players[i].radius && players[i].radius > players[j].radius && players[j].radius > 64) {
                players[i].updatePosition(players[i].x, players[i].y, Math.sqrt(surfaceArea / Math.PI));
                players[j].updatePosition(-3000,3000,64);
                io.emit("death", players[j]);
                removePlayer(players[j].id);
                io.emit("kill", players[i]);
            }
            else if(distance < players[j].radius && players[i].radius < players[j].radius && players[i].radius > 64) {
                players[j].updatePosition(players[j].x, players[j].y, Math.sqrt(surfaceArea / Math.PI));
                players[i].updatePosition(-3000,3000,64);
                io.emit("death", players[i]);
                removePlayer(players[i].id);
                io.emit("kill", players[j]);
            }
        }
    }
}

function playerEatsFoodCheck() {
    players = getPlayers();
    foods = getFoodList();
    for(let i = 0; i < players.length; i++){
        foods.forEach(function(item, index, object) {
            let distance = (Math.sqrt(Math.pow(players[i].x - item.x,2) + Math.pow(players[i].y - item.y,2)));

            if (distance < players[i].radius) {
                let surfaceArea = (Math.PI * (item.radius ** 2)) + (Math.PI  * (players[i].radius ** 2));
                players[i].updatePosition(players[i].x, players[i].y, Math.sqrt(surfaceArea / Math.PI));

                removeFood(index);
                addFood();
            }
        })
    }
}

function move(player, data, deltaTime) {
    if (player !== undefined) {
        let mag = Math.sqrt(data.x * data.x + data.y * data.y);
        mag.toFixed(0);
        let newMag = 10; // this is the velocity we are trying to achieve

        let newX = player.x + (data.x * newMag / mag) * (deltaTime / 50);
        newX.toFixed(0);
        let newY = player.y + (data.y * newMag / mag) * (deltaTime / 50);
        newY.toFixed(0);

        let radius = player.radius;
        if (newY + radius >= 3000) { newY = 3000 - radius; }
        else if (newY - radius <= -3000) { newY = -3000 + radius; }

        if (newX + radius >= 3000) { newX = 3000 - radius; }
        else if (newX - radius <= -3000) { newX = -3000 + radius; }

        player.updatePosition(newX,  newY, radius);
    }
    else { console.log("Couldn't fetch player (undefined)");}
}

var interval = setInterval(heartbeat, 1000/nbUpdates);
