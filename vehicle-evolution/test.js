var canvas;
var vehicle;

var target;
var t;

function setup() {
    canvas = new Canvas('canvas');
    vehicle = new Vehicle(canvas.width/2, canvas.height/2);
    target = new Vector(300, 300);
    t = 0;
    addUpdate(update);
}

function update() {
    t += 0.01;
    target.heading = Math.PI/4 + Math.sin(t) / 2;
    // vehicle.seek(target);
    vehicle.boundary(canvas.width, canvas.height);
    vehicle.flee(target, 100/target.dist(vehicle.position));
    vehicle.roam();
    vehicle.update();
    draw();
}

function draw() {
    canvas.color('black');
    canvas.background();
    canvas.color('white');
    canvas.fillArc(target.x, target.y, 10);
    vehicle.draw(canvas);
}

addSetup(setup);
