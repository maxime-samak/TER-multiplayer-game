const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server); // , {pingInterval: 200}

// Port 3000
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "..", "js");

app.use(express.static(publicDirectoryPath));

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

    socket.on("disconnect", () => {
        console.log(`Player ${socket.id} disconnected`);
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


