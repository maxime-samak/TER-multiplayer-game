const foodList = [];
const maxFood = 1500;
let foodId = 1;

/* The map size (not related with the canvas size) */
let boundaries = {
    width: 3000,
    height: 3000
};

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Food list setup
for (let i = 0; i < maxFood; i++) {
    const radius = random(12, 15);
    const x = random(- boundaries.width + radius, boundaries.width - radius);
    const y = random(- boundaries.height + radius, boundaries.height - radius);
    const color = {
        r: random(0, 255),
        g: random(0, 255),
        b: random(0, 255)
    };
    foodList[i] = {
        x,
        y,
        radius,
        id: foodId,
        color
    };
    foodId++;
}

function removeFood(index) {
    foodList.splice(index, 1);
}

function addFood() {
    const radius = random(12, 20);
    const x = random(- boundaries.width + radius, boundaries.width - radius);
    const y = random(- boundaries.height + radius, boundaries.height - radius);
    const color = {
        r: random(0, 255),
        g: random(0, 255),
        b: random(0, 255)
    };
    const temp = {x, y, radius, id: foodId, color};
    foodList.push(temp);
    foodId++;
    return temp;
}

function getFoodList() {
    return foodList;
}

module.exports = {
    removeFood,
    addFood,
    getFoodList,
};

