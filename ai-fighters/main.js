var canvas;
var agent;

function setup() {
    canvas = new Canvas("canvas");
    agent = new Agent(canvas.width/2, canvas.height/2);

    addUpdate(update);
}

function update() {
    agent.turn(-0.01);
    // agent.forward(3);
    agent.strafe(3);
    agent.boundary(canvas.width, canvas.height, 2);
    agent.update();

    draw();
}

function draw() {
    canvas.color('black');
    canvas.background();

    canvas.color('white');
    canvas.fillRect(1, 1, canvas.width-2, canvas.height-2);

    agent.draw(canvas);
}

addSetup(setup);
