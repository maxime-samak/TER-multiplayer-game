const socket = io();
const connectionStamp = Date.now();
let delay = 0;

let pings = new circularBuffer(10);

function send(msg, data) {
    setTimeout(() => {
        socket.emit(msg, data)
    }, delay);
}

function nbUpdateChanged() {
    setTimeout(() => {
        socket.emit("changeNbUpdates",document.getElementById("nbUpdate").value);
    }, delay);
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

    if(~~(ping / 2) + 1 >= parseInt(document.getElementById("delay").value)) {
        delay = 0;
    }
    else {
        delay = parseInt(document.getElementById("delay").value) - ~~(ping / 2); // << << <<
    }

});

socket.on("setClientId", id => {
    bubble.id = id;
});

socket.on("sendFoodList", foodList => {
    setTimeout(() => {
        food = [];
        for (let i = 0 ; i < foodList.length ; i++) {
            const tempBubble = new Bubble(foodList[i].x, foodList[i].y, foodList[i].radius, foodList[i].color.r, foodList[i].color.g, foodList[i].color.b);
            tempBubble.id = foodList[i].id;
            food.push(tempBubble);
        }
    }, delay);

});

socket.on("grow", foodRadius => bubble.grow(foodRadius));

socket.on("kill", data => {
    setTimeout(() => {
        if(data.id == socket.id)
            bubble.radius = data.radius;
    }, delay);
});

socket.on("death", data => {
    setTimeout(() => {
        if(data.id == socket.id) {
            alive = false;
            currentScale = 0.08;
        }
    }, delay);
});

socket.on("changedNbUpdates", data => {
    document.getElementById("nbUpdate").value=data;
    document.getElementById("textInput").innerHTML=data;
});

socket.on("heartbeat", data => {
    setTimeout(() => {
        players = data;
        for(let i = 0; i < players.length; i++) {
            players[i].interpolX = players[i].x;
            players[i].interpolY = players[i].y;
        }
    }, delay);
});

/**
 *   A circular buffer class.
 *   @To push new value -> bufferObject.push(xValue, yValue);
 *   @To get the First-in value use -> bufferObject.getValue(0);
 *   @To get the Last-in value use -> bufferObject.last();
 **/
function circularBuffer(size) {

    let bufferSize = size;
    let buffer = new Array(bufferSize);
    buffer.fill({x:null, y:null});

    let last = 0;

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

