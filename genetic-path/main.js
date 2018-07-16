var canvas;
var pop;

var POP_SIZE = 60;
var GAME_LENGTH = 300;

var states;
var tick;

var goal;
var endAtStep;

function evaluate() {
    for (var i = 0; i < POP_SIZE; i++) {
        var s = this.states[i];
        var v = map(s.pos.dist(goal), 0, canvas.width + canvas.height, 100, 0);
        if (s.alive) {
            v += map(s.endedOn, 0, GAME_LENGTH, 100, 0);
        } else {
            v += map(s.endedOn, 0, GAME_LENGTH, 0, 100);
        }
        pop.rate(i, v);
    }
}

function reset() {
    if (pop) {
        evaluate();
        pop.nextGeneration();
    } else {
        pop = new Population(POP_SIZE, GAME_LENGTH);
    }
    states = [];
    for (var i = 0; i < POP_SIZE; i++) {
        states.push({
            pos: new Vector(10, 10),
            alive: true,
            endedOn: -1
        });
    }
    tick = 0;
}

function setup() {
    canvas = new Canvas('canvas');
    goal = new Vector(canvas.width/2, canvas.height/2);

    endAtStep = 20;

    reset();

    addUpdate(update);
}

function update() {
    pop.update(states, tick);

    for (var s of states) {
        if (s.pos.x < 0 || s.pos.x > canvas.width) {
            s.alive = false;
            s.endedOn = tick;
        }
        else if (s.pos.y < 0 || s.pos.y > canvas.height) {
            s.alive = false;
            s.endedOn = tick;
        }
    }

    draw();

    tick++;
    if (tick >= endAtStep || tick >= endAtStep) {
        if (pop.generations % 3 == 0) {
            endAtStep += 10;
        }
        reset();
    }
}

function draw() {
    canvas.color('white');
    canvas.background();
    for (var s of states) {
        var c = s.alive ? 'black' : 'red';
        canvas.color(c);
        canvas.fillArc(s.pos.x, s.pos.y, 2);
    }
    canvas.color('green');
    canvas.fillArc(goal.x, goal.y, 5);
}

addSetup(setup);
