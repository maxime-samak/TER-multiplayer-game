class Player {
    constructor(id, x, y, radius, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    updateState(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

module.exports = {Player};
