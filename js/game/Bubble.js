/**
 * This class represents a bubble in our game (a player / food)
 * @param x Spawning position on x axis
 * @param y Spawning position on y axis
 * @param radius Starting radius
 * @param r Color
 * @param g Color
 * @param b Color
 * @constructor Create a bubble on the canvas
 */
function Bubble(x, y, radius, r = random(255), g = random(255), b = random(255)) {
    this.position = createVector(x, y);
    this.radius = radius;
    this.r = r;
    this.g = g;
    this.b = b;
    this.nextX = this.position.x;
    this.nextY = this.position.y;

    this.grow = function(foodRadius) {
        let surfaceArea = (PI * (this.radius ** 2)) + (PI * (foodRadius ** 2));
        this.radius = sqrt(surfaceArea / PI);
    };

    this.update = function(boundaries) {
        let newPosition = createVector(mouseX - width / 2, mouseY - height / 2);
        let data = {
            x: newPosition.x.toFixed(0),
            y: newPosition.y.toFixed(0)
        };

        send("playerNewTarget", data);
    };

    this.show = function() {
        fill(this.r, this.g, this.b);
        ellipse(this.position.x, this.position.y, this.radius * 2)
    }
}
