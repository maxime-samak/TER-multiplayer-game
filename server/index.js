const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Port 3000
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "..", "js", "game");

app.use(express.static(publicDirectoryPath));

io.on("connection", socket => {
    console.log(`Player ${socket.id} joined`);


    socket.on("disconnect", () => {
        console.log(`Player ${socket.id} disconnected`);
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
