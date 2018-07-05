var obstacles;
var canvas;
var dino;

var offset;

var last;

var speed = 6;
var jumpDistance = 50;
var jumpVelocity = 12;
var gravity = 0.625;

function setup() {
    initGame();
    canvas = new Canvas('game');

    draw();
    addUpdate(update);
}

function addObstacle() {
    var x = last + 300 + Math.floor(Math.random() * 300);

    last = x;
    obstacles.push({
        x: x,
        y: 0,
        w: Math.floor(20 + Math.random() * 30),
        h: Math.floor(40 + Math.random() * 30)
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
        y: 0,
        vx: speed,
        vy: 0
    };
    offset = {
        x: 100,
        y: 250
    };
}

function update() {
    offset.x -= speed;
    dino.x += dino.vx;

    dino.y += dino.vy;
    if (dino.y < 0) {
        dino.vy += gravity;
    }
    if (dino.y > 0) {
        dino.y = 0;
        dino.vy = 0;
    }
    if (dino.y == 0) {
        for (var o of obstacles) {
            if (dino.x < o.x && dino.x + jumpDistance >= o.x) {
                dino.vy -= jumpVelocity;
                break;
            }
        }
    }

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
    for (var i = 0; i < obstacles.length; i++) {
        var o = obstacles[i];
        if (o.x + o.w + offset.x < 0) {
            obstacles.splice(i, 1);
            i--;
            addObstacle();
        } else {
            canvas.fillRect(o.x + offset.x, o.y + offset.y, o.w, -o.h);
        }
    }
}

addSetup(setup);
