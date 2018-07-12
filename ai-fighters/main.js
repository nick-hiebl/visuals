var canvas;
var agent1, agent2;
var nn1, nn2;

var agentProperties = {
    turnRate: 0.1,
    forwardRate: 3,
    strafeRate: 3
}

function setup() {
    canvas = new Canvas("canvas");
    agent1 = new Agent(canvas.width/2 + 100, canvas.height/2 - 100);
    agent2 = new Agent(canvas.width/2 - 100, canvas.height/2 + 100);

    // turn, forward, strafe, shoot
    nn1 = new Network(8, 4);
    nn2 = new Network(8, 4);

    addUpdate(update);
}

function updateAgent(agent, nn, target) {
    var input = agent.getCollision(target);
    for (var i = 0; i < input.length; i++) {
        input[i] = input[i] ? 1 : 0;
    }
    console.log(input);
    var action = nn.process(input);
    var turn = (action[0] - 0.5) * 2 * agentProperties.turnRate;
    var forward = (action[1] - 0.5) * 2 * agentProperties.forwardRate;
    var strafe = (action[2] - 0.5) * 2 * agentProperties.strafeRate;
    var shoot = action[3] > 0.5;

    agent.turn(turn);
    agent.forward(forward);
    agent.strafe(strafe);
}

function update() {
    updateAgent(agent1, nn1, agent2);
    updateAgent(agent2, nn2, agent1);

    draw();
}

function draw() {
    canvas.color('black');
    canvas.background();

    canvas.color('white');
    canvas.fillRect(1, 1, canvas.width-2, canvas.height-2);

    agent1.draw(canvas, 'red');
    agent2.draw(canvas, 'blue');
}

addSetup(setup);
