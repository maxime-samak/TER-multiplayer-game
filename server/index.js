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


function heartbeat() {
    playerEatsFoodCheck();
    io.emit("sendFoodList", getFoodList());

    playerEatsPlayerCheck();
    io.emit("heartbeat", getPlayers());
}

io.on("connection", socket => {
    let connectionStamp = Date.now();
    let emitStamp = -1;
    console.log(`Player ${socket.id} joined`);

    socket.on("pongo", () => { // "pong" is a reserved event name
        let timeStamp = Date.now();
        socket.emit("data", timeStamp, timeStamp - emitStamp, Date.now() - connectionStamp)
    });

    // When client connects for the first time
    socket.on("start", data => {
        console.log(`ID: ${socket.id}, x: ${data.x}, y: ${data.y}, radius: ${data.radius}`);
        const player = new Player(socket.id, data.x, data.y, data.radius, data.color);
        addPlayer(player);
        socket.emit("setClientId", socket.id);
        socket.emit("sendFoodList", getFoodList());
    });

    //On client update, send info to the server and update
    socket.on("update", data => {
        const player = getPlayer(socket.id);
        if (player !== undefined) {
            player.updatePosition(data.x, data.y);
        }
        else { console.log("Couldn't fetch player (undefined)");}
    });

    socket.on("playerNewTarget", data => {
        const player = getPlayer(socket.id);
        if (player !== undefined) {
            let mag = Math.sqrt(data.x * data.x + data.y * data.y);
            mag.toFixed(0);
            let newMag = 10; // this is the velocity we are trying to achieve

            let newX = player.x + (data.x * newMag / mag);
            newX.toFixed(0);
            let newY = player.y + (data.y * newMag / mag);
            newY.toFixed(0);

            player.updatePosition(newX,  newY);
        }
        else { console.log("Couldn't fetch player (undefined)");}
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
                players[i].updateState(players[i].x, players[i].y, Math.sqrt(surfaceArea / Math.PI), players[i].nextX, players[i].nextY);
                players[j].updateState(-3000,3000,64, -3000, 3000);
                io.emit("death", players[j]);
                removePlayer(players[j].id);
                io.emit("kill", players[i]);
            }
            else if(distance < players[j].radius && players[i].radius < players[j].radius && players[i].radius > 64) {
                players[j].updateState(players[j].x, players[j].y, Math.sqrt(surfaceArea / Math.PI), players[i].nextX, players[i].nextY);
                players[i].updateState(-3000,3000,64, -3000, 3000);
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
                players[i].updateState(players[i].x, players[i].y, Math.sqrt(surfaceArea / Math.PI), players[i].nextX, players[i].nextY);

                removeFood(index);
                addFood();
            }
        })
    }
}

setInterval(heartbeat, 100);
