var canvas;

function setup() {
    canvas = new Canvas('canvas');
    canvas.background();
}

function update() {
    canvas.color(Math.random() < 0.5 ? 'white' : 'black');
    canvas.fillRect(Math.random() * 400 - 15, Math.random() * 400 - 15, 30, 30);
}

addSetup(setup);
addUpdate(update);
