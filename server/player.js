class Player {
    constructor(id, x, y, radius, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.previousX = x;
        this.previousY = y;
    }

    updatePosition(x, y, radius) {
        this.previousX = this.x;
        this.previousY = this.y;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

module.exports = {Player};
