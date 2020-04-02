const socket = io();
const connectionStamp = Date.now();

let pings = new circularBuffer(10);

socket.on("ping", function(ms) {
    socket.emit("pongo");
});

socket.on("data", function(timeStamp, ping, serverTime) {
    document.getElementById("latency").innerText = ~~(ping / 2) + " ms";
    document.getElementById("ping").innerText = ping + " ms";
    pings.push(ping);

    document.getElementById("server-time").innerText = serverTime / 1000 + " s";
    document.getElementById("client-time").innerText = (Date.now() - connectionStamp) / 1000 + " s";
});

/**
 *   A circular buffer class.
 *   @To push new value -> bufferObject.push(xValue, yValue);
 *   @To get the First-in value use -> bufferObject.getValue(0);
 *   @To get the Last-in value use -> bufferObject.getValue(bufferObject.length);
 **/
function circularBuffer(size) {

    let bufferSize = size;
    let buffer = new Array(bufferSize);

    let end = 0;

    // Adds values to array in circular.
    this.push = function(obj) {
        buffer[end] = obj;
        if (end != bufferSize) end++; // advance
        else end = 0;
    };

    // Returns a value from the buffer
    this.get = function(index) {
        return buffer[index % bufferSize];
    };

    // Returns true if the buffer has been initialized.
    this.isInitialized = function() {
        return buffer[0] != null;
    };
}

