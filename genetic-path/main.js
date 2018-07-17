var canvas;
var pops;

var POP_SIZE = 50;
var GAME_LENGTH = 300;
var NUM_POPS = 3;

var statess;
var tick;

var goal;
var endAtStep;

var obstacles = [
    {x: 60, y: 100, w: 400, h: 20}
];

function evaluate() {
	for (var j = 0; j < NUM_POPS; j++) {
		var states = statess[j];
		var pop = pops[j];
		for (var i = 0; i < POP_SIZE; i++) {
			var s = states[i];
			var v = map(s.pos.dist(goal), 0, canvas.width + canvas.height, 100, 0);
			if (s.alive) {
				v += map(s.endedOn, 0, GAME_LENGTH, 100, -100);
			} else {
				v += map(s.endedOn, 0, GAME_LENGTH, -200, -100);
			}
			pop.rate(i, v);
		}
	}
}

function reset() {
	for (var j = 0; j < NUM_POPS; j++) {
		var pop = pops[j];
		if (pop) {
			evaluate();
			pop.nextGeneration();
		} else {
			pops[j] = new Population(POP_SIZE, GAME_LENGTH);
		}
		statess[j] = [];
		var states = statess[j];
		for (var i = 0; i < POP_SIZE; i++) {
			states.push({
				pos: new Vector(canvas.width/2, 10),
				alive: true,
				endedOn: -1
			});
		}
	}
    tick = 0;
}

function setup() {
    canvas = new Canvas('canvas');
    goal = new Vector(canvas.width/4 * 3, canvas.height/2 - 10);

    endAtStep = 300;
	
	statess = [];
	pops = [];
	for (var j = 0; j < NUM_POPS; j++) {
		statess.push([]);
		pops.push(null);
	}

    reset();

    addUpdate(update);
}

function update() {
	var anySuccess = false;
	for (var j = 0; j < NUM_POPS; j++) {
		var pop = pops[j];
		var states = statess[j];
		pop.update(states, tick);

		for (var s of states) {
			if (s.pos.dist(goal) < 3) {
				s.endedOn = tick;
				anySuccess = true;
			}
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
	}

    draw();

    tick++;
	if (anySuccess) {
		console.log("Goal reached in " + tick + " steps");
		reset();
	}
    if (tick >= endAtStep || tick >= GAME_LENGTH) {
        reset();
    }
}

function draw() {
    canvas.color('white');
    canvas.background();
	for (var j = 0; j < NUM_POPS; j++) {
		var aliveCol = 'hsl(' + Math.floor(j / NUM_POPS * 360) + ', 90%, 70%)';
		var states = statess[j];
		for (var s of states) {
			var c = s.alive ? aliveCol : 'red';
			canvas.color(c);
			canvas.fillArc(s.pos.x, s.pos.y, 2);
		}
		canvas.color('green');
		canvas.fillArc(states[0].pos.x, states[0].pos.y, 2);
	}
    canvas.color('green');
    canvas.fillArc(goal.x, goal.y, 5);

    canvas.color('#05d');
    for (var o of obstacles) {
        canvas.fillRect(o.x, o.y, o.w, o.h);
    }
}

addSetup(setup);
