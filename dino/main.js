var obstacles;
var canvas;
var dino;

var offset;

var last;

var speed = 6;

function setup() {
    initGame();
    canvas = new Canvas('game');

    draw();
    addUpdate(update);
}

function addObstacle() {
    var x = last + 200 + Math.floor(Math.random() * 400);

    last = x;
    obstacles.push({
        x: x,
        y: 0
    });
}

function initGame() {
    obstacles = [];
    last = 400;
    for (var i = 0; i < 10; i++) {
        addObstacle();
    }

    dino = {
        x: 0,
        y: 0
    };
    offset = {
        x: 100,
        y: 250
    };
}

function update() {
    offset.x -= speed;
    dino.x += speed;

    draw();
}

function draw() {
    canvas.color('white');
    canvas.background();
    canvas.color('black');
    canvas.line(0, offset.y - 10, 800, offset.y - 10);
    canvas.color('green');
    canvas.fillRect(dino.x + offset.x, dino.y + offset.y, -50, -80);
    canvas.color('red');
    for (var o of obstacles) {
        canvas.fillRect(o.x + offset.x, o.y + offset.y, 50, -80);
    }
}

addSetup(setup);
