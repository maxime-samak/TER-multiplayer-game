const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {Player} = require("./player");
const {addPlayer, removePlayer, getPlayer, getPlayers} = require("./players");
const {removeFood, addFood, getFoodList, foodManagement} = require("./food");

const app = express();
const server = http.createServer(app);
const io = socketio(server); // , {pingInterval: 200}

// Port 3000
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "..", "js");

app.use(express.static(publicDirectoryPath));

setInterval(heartbeat, 100);
function heartbeat() {
    io.emit("heartbeat", getPlayers());
}

io.on("connection", socket => {
    let connectionStamp = Date.now();
    let emitStamp = -1;
    console.log(`Player ${socket.id} joined`);

    setInterval(() => {
        emitStamp = Date.now();
        socket.emit("ping");
    },500);

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
            player.updateState(data.x, data.y, data.radius);
        } else {
            console.log("Couldn't fetch player (undefined)");
        }
        //console.log(`ID: ${socket.id}, x: ${data.x}, y: ${data.y}, radius: ${data.radius}`);
    });

    // When a client eats a food point
    socket.on("clientEatsFood", foodId => {
        if (removeFood(foodId) !== -1) {
            const newFood = addFood();
            io.emit("sendFoodList", getFoodList());
        }
    });

    socket.on("disconnect", () => {
        console.log(`Player ${socket.id} disconnected`);
        removePlayer(socket.id);
        console.log(getPlayers());
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


