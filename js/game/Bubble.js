function Bubble(x, y, radius) {
    this.position = createVector(x, y);
    this.radius = radius;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);

    this.eats = function(food) {
        let distance = p5.Vector.dist(this.position, food.position);
        if (distance < this.radius) {
            let surfaceArea = (PI * (this.radius ** 2)) + (PI * (food.radius ** 2));
            this.radius = sqrt(surfaceArea / PI);
            return true;
        }
        return false;
    };

    this.update = function() {


        let newPosition = createVector(mouseX - width / 2, mouseY - height / 2);
        newPosition.setMag(4);
        this.position.add(newPosition);
    };

    this.show = function() {
        fill(this.r, this.g, this.b);
        ellipse(this.position.x, this.position.y, this.radius * 2)
    }
}