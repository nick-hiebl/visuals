var canvas;
var pop;

var POP_SIZE = 10;
var GAME_LENGTH = 300;

var states;
var tick;

function setup() {
    canvas = new Canvas('canvas');
    pop = new Population(POP_SIZE, GAME_LENGTH);

    states = [];
    for (var i = 0; i < POP_SIZE; i++) {
        states.push({
            pos: new Vector(10, 10)
        });
    }
    tick = 0;

    addUpdate(update);
}

function update() {
    pop.update(states, tick);
    draw();

    tick++;
}

function draw() {
    canvas.color('black');
    canvas.background();
    canvas.color('white');
    for (var s of states) {
        canvas.fillArc(s.pos.x, s.pos.y, 3);
    }
}

addSetup(setup);
