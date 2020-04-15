class Player {
    constructor(id, x, y, radius, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.nextX = x;
        this.nextY = y;
        this.previousX = x;
        this.previousY = y;
    }

    updateState(x, y, radius, nextX, nextY) {
        this.previousX = this.x;
        this.previousY = this.y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.nextX = nextX;
        this.nextY = nextY;
    }
}

module.exports = {Player};
