const socket = io();
const connectionStamp = Date.now();

socket.on("ping", function(ms) {
    console.log("+1");
    socket.emit("pongo");
});

socket.on("data", function(timeStamp, ping, serverTime) {
    document.getElementById("latency").innerText = ~~(ping / 2) + " ms";
    document.getElementById("ping").innerText = ping + " ms";

    document.getElementById("server-time").innerText = serverTime / 1000 + " s";
    document.getElementById("client-time").innerText = (Date.now() - connectionStamp) / 1000 + " s";
});