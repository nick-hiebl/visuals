var canvases = [];
var vehicles = [];
var actions = [];

var source;

var coolOff;
var SPEED_LIMIT = 10;

function newVehicle() {
    return {
        pos: new Vector(100, 250),
        vel: new Vector(0, 0)
    };
}

function setup() {
    canvases = [new Canvas('seek'), new Canvas('aggression'), new Canvas('fear'), new Canvas('explore')];
    vehicles = [newVehicle(), newVehicle(), newVehicle(), newVehicle()];
    actions = [seek, aggression, fear, explore];

    source = new Vector(200, 200);
    coolOff = 0;

    addUpdate(update);
}

function wrap(vehicle) {
    if (vehicle.pos.x < 0) {
        vehicle.pos.x += 400;
    }
    if (vehicle.pos.y < 0) {
        vehicle.pos.y += 400;
    }
    if (vehicle.pos.x > 400) {
        vehicle.pos.x -= 400;
    }
    if (vehicle.pos.y > 400) {
        vehicle.pos.y -= 400;
    }
}

function seek(target, vehicle) {
    var desired = target.copy();
    desired.magnitude = map(target.magnitude, 0, 400, 0, SPEED_LIMIT);

    return desired;
}

function aggression(target, vehicle) {
    var desired = target.copy();
    if (desired.magnitude < 30 && desired.dot(vehicle.vel) < -0.1) {
        desired = vehicle.vel.copy();
    }
    desired.magnitude = map(desired.magnitude, 0, 400, SPEED_LIMIT, 0);

    return desired;
}

function fear(target, vehicle) {
    if (target.magnitude > 150) {
        return Vector.randUnit();
    }
    var desired = target.copy();
    desired.magnitude = map(target.magnitude, 0, 400, -SPEED_LIMIT, 0);

    return desired;
}

function explore(target, vehicle) {
    var desired = target.copy();
    desired.magnitude = map(target.magnitude, 0, 400, 0, -SPEED_LIMIT);

    return desired;
}

function update() {
    if (coolOff > 40 && Math.random() < 0.03) {
        console.log("moving");
        source = new Vector(
            50 * (Math.floor(Math.random() * 6) + 1),
            50 * (Math.floor(Math.random() * 6) + 1)
        );
        coolOff = 0;
    }
    coolOff++;

    for (var i = 0; i < vehicles.length; i++) {
        var vehicle = vehicles[i];

        var target = source.copy();
        target.sub(vehicle.pos);

        var desired = actions[i](target, vehicle);

        var steering = desired.copy();
        steering.sub(vehicle.vel);
        steering.mul(0.05);

        vehicle.vel.add(steering);
        if (vehicle.vel.magnitude > SPEED_LIMIT) {
            vehicle.vel.magnitude = SPEED_LIMIT;
        }
        vehicle.pos.add(vehicle.vel);
        wrap(vehicle);
    }


    draw();
}

function draw() {
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var vehicle = vehicles[i];
        canvas.color('black');
        canvas.background();
        canvas.color('red');
        canvas.fillArc(source.x, source.y, 5);
        canvas.color('white');
        canvas.fillArc(vehicle.pos.x, vehicle.pos.y, 10);
    }
}

addSetup(setup);
