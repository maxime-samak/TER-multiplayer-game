const socket = io();
const connectionStamp = Date.now();

let pings = new circularBuffer(10);

function send(msg, data) {
    socket.emit(msg, data)
}

socket.on("ping", function(ms) {
    socket.emit("pongo");
});

socket.on("data", function(timeStamp, ping, serverTime) {
    document.getElementById("latency").innerText = ~~(ping / 2) + " ms";
    document.getElementById("ping").innerText = ping + " ms";
    pings.push({x :((Date.now() - connectionStamp) / 1000).toFixed(1), y: ping} );

    document.getElementById("server-time").innerText = serverTime / 1000 + " s";
    document.getElementById("client-time").innerText = (Date.now() - connectionStamp) / 1000 + " s";
});

socket.on("setClientId", id => {
    bubble.id = id;
});

socket.on("sendFoodList", foodList => {
    food = [];
    for (let i = 0 ; i < foodList.length ; i++) {
        const tempBubble = new Bubble(foodList[i].x, foodList[i].y, foodList[i].radius, foodList[i].color.r, foodList[i].color.g, foodList[i].color.b);
        tempBubble.id = foodList[i].id;
        food.push(tempBubble);
    }
});

socket.on("kill", data => {
    if(data.id == socket.id)
        bubble.radius = data.radius;
});

socket.on("death", data => {
    if(data.id == socket.id) {
        alive = false;
        currentScale = 0.08;
    }
});

socket.on("heartbeat", data => {
    players = data;
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
    buffer.fill({x:null, y:null});

    let last = 0;
    let end = buffer.push({x:0.5, y:1}); // initial push for correct chart rendering

    // Adds values to array in circular.
    this.push = function(obj) {
        end = buffer.push(obj);
        if (end >= bufferSize - 1) {
            buffer.shift()
        }
        else { last = end - 1; }
    };

    // Returns a value from the buffer
    this.get = function(index) {
        return buffer[index % bufferSize];
    };

    this.last = function() {
        return buffer[last]
    };

    this.data = function() {
        return buffer;
    };

    this.dataX = function () {
        let dataX = [];
        for (let i = 0; i < bufferSize; i++) {
            dataX.push(buffer[i].x)
        }
        return dataX;
    };

    this.dataY = function () {
        let dataY = [];
        for (let i = 0; i < bufferSize; i++) {
            dataY.push(buffer[i].y)
        }
        return dataY;
    };

    // Returns true if the buffer has been initialized.
    this.isInitialized = function() {
        return end !== 0;
    };
}

