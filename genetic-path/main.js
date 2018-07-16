var canvas;
var pop;

var POP_SIZE = 160;
var GAME_LENGTH = 300;

var states;
var tick;

var goal;
var endAtStep;

var obstacles = [
    {x: 60, y: 100, w: 400, h: 20}
];

function evaluate() {
    for (var i = 0; i < POP_SIZE; i++) {
        var s = this.states[i];
        var v = map(s.pos.dist(goal), 0, canvas.width + canvas.height, 100, 0);
        if (s.alive) {
            v += map(s.endedOn, 0, GAME_LENGTH, 100, -100);
        } else {
            v += map(s.endedOn, 0, GAME_LENGTH, -200, -100);
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
            pos: new Vector(canvas.width/2, 10),
            alive: true,
            endedOn: -1
        });
    }
    tick = 0;
}

function setup() {
    canvas = new Canvas('canvas');
    goal = new Vector(canvas.width/2, canvas.height - 10);

    endAtStep = 300;

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
        else {
            for (var o of obstacles) {
                if (s.pos.x > o.x && s.pos.x < o.x + o.w &&
                        s.pos.y > o.y && s.pos.y < o.y + o.h) {
                    s.alive = false;
                    s.endedOn = tick;
                }
            }
        }
    }

    draw();

    tick++;
    if (tick >= endAtStep || tick >= GAME_LENGTH) {
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
    canvas.fillArc(states[0].pos.x, states[0].pos.y, 2);
    canvas.fillArc(goal.x, goal.y, 5);

    canvas.color('#05d');
    for (var o of obstacles) {
        canvas.fillRect(o.x, o.y, o.w, o.h);
    }
}

addSetup(setup);
