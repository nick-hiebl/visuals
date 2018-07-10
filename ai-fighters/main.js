var canvas;
var agent;
var target;

var t;

function setup() {
    canvas = new Canvas("canvas");
    agent = new Agent(canvas.width/2, canvas.height/2);
    t = -1;
    target = {
        position: new Vector(300, 300)
    };

    addUpdate(update);
}

function update() {
    t += 0.003;
    // agent.turn(Math.sin(0.3282 * t) / 120 + Math.sin(t) / 100 + Math.sin(2.8834 * t) / 200);
    // agent.forward(0.5 + Math.cos(t));
    // agent.strafe(0.5 - Math.cos(t));
    // agent.boundary(canvas.width, canvas.height, 2);
    target.position.heading = t;
    // console.log(target.position.heading);
    target.position.magnitude = 100 + (Math.sin(t * 0.4) * 0.4 + Math.sin(t) * 0.6) * 80;
    target.position.x += 400;
    target.position.y += 400;
    agent.update(target);

    draw();
}

function draw() {
    canvas.color('black');
    canvas.background();

    canvas.color('white');
    canvas.fillRect(1, 1, canvas.width-2, canvas.height-2);

    agent.draw(canvas);

    canvas.color('black');
    canvas.fillArc(target.position.x, target.position.y, 3);
}

addSetup(setup);
