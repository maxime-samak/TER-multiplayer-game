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

    this.eats = function(food) {
        let distance = p5.Vector.dist(this.position, food.position);
        if (distance < this.radius) {
            let surfaceArea = (PI * (this.radius ** 2)) + (PI * (food.radius ** 2));
            this.radius = sqrt(surfaceArea / PI);
            return true;
        }
        return false;
    };

    this.update = function(boundaries) {
        let newPosition = createVector(mouseX - width / 2, mouseY - height / 2);
        newPosition.setMag(4);
        this.position.add(newPosition);

        let nextPosition = createVector(mouseX - width / 2, mouseY - height / 2);
        this.nextX = nextPosition.x;
        this.nextY = nextPosition.y;


        if(this.position.x+this.radius>boundaries.width)
            this.position.x=boundaries.width-this.radius;
        else if (this.position.x-this.radius<-boundaries.width)
            this.position.x=-boundaries.width+this.radius;
        if(this.position.y+this.radius>boundaries.height)
            this.position.y=boundaries.height-this.radius;
        else if (this.position.y-this.radius<-boundaries.height)
            this.position.y=-boundaries.height+this.radius;

    };

    this.show = function() {
        fill(this.r, this.g, this.b);
        ellipse(this.position.x, this.position.y, this.radius * 2)
    }
}
