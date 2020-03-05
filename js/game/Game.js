const socket = io();

const canvas = document.getElementById('c');
const context = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

let gameOver = false;
let diff = 30;
let maxFood = 15;

let player = {
    'x' : w / 2,
    'y' : h / 2,
    'size' : 20,
    'speed' : 10,
    'score' : 0,
    'mvt' : {
        'mz' : false,
        'mq' : false,
        'ms' : false,
        'md' : false
    }
};

class Food{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 10
    }
    collides(p){
        return(
            (p.x - this.x) * (p.x - this.x)
            +
            (p.y - this.y) * (p.y - this.y)
            <=
            (p.size - this.size) * (p.size - this.size) + this.size
        )
    }
}
let food = [new Food(300, 300)];

//--------

update();
document.addEventListener('keydown', function keyDown(e){
    switch(e.key){
        case 'z':
            player.mvt.mz = true;
            break;
        case 'q':
            player.mvt.mq = true;
            break;
        case 's':
            player.mvt.ms = true;
            break;
        case 'd':
            player.mvt.md = true;
            break;
        default:
            break;
    }
    update()
});

document.addEventListener('keyup', function keyUp(e){
    switch(e.key){
        case 'z':
            player.mvt.mz = false;
            break;
        case 'q':
            player.mvt.mq = false;
            break;
        case 's':
            player.mvt.ms = false;
            break;
        case 'd':
            player.mvt.md = false;
            break;
        default:
            break;
    }
    update()
});

function move(player) {
    let mvt = player.mvt;
    let slow =  1;
    if (mvt.mz && mvt.mq || mvt.mz && mvt.md) {
        slow = 2;
    }
    if (mvt.ms && mvt.mq || mvt.ms && mvt.md) {
        slow = 2;
    }
    player.x += (mvt.md - mvt.mq) * player.speed / slow;
    player.y += (mvt.ms - mvt.mz) * player.speed / slow;
}

setInterval(function(){
    food.push(new Food(Math.floor(Math.random() * w), Math.floor(Math.random() * h)));
    update()
}, 1000);

//--------

function drawCircle(x, y, size, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.fill()
}

function write(text, x, y){
    context.fillStyle = 'black';
    context.font = '15px Arial';
    context.fillText(text, x, y)
}

function reset(){
    context.fillStyle = 'white';
    context.fillRect(0, 0, w, h)
}

function update(){
    if(!gameOver && player.score < diff){
        if(food.length >= maxFood){
            gameOver = true
        }
        reset();
        food.forEach(function(e){
            drawCircle(e.x, e.y, e.size, 'red');
            if(e.collides(player)){
                player.size += 3;
                player.speed -= 0.1;
                player.score += 1;
                let index = food.indexOf(e);
                if(index > -1){
                    food.splice(index, 1)
                }
            }
        });
        move(player);
        drawCircle(player.x, player.y, player.size, 'green');
        write('score: ' + player.score + ' /' + diff, 10, 20)
    }
    if(gameOver){
        document.removeEventListener('keydown', key);
        reset();
        write('GAME OVER', w/2-20, h/2)
    }
    if(player.score >= diff){
        document.removeEventListener('keydown', key);
        reset();
        write('YOU WIN', w/2-20, h/2)
    }
}
