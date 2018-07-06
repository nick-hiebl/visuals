var vehicles;
var canvas;
var origin;

var DISTANCE_STEERING = 50;

var ROTATIONAL_STEERING = 3;

var SPEED_LIMIT = 5;
var STEERING_LIMIT = 5;

function newVehicle() {
    return {
        pos: new Vector(Math.random() * 800,
                        Math.random() * 800),
        vel: new Vector(0, 0)
    };
}

function setup() {
    canvas = new Canvas('canvas');
    origin = new Vector(400, 400);
    vehicles = [];
    for (var i = 0; i < 60; i++) {
        vehicles.push(newVehicle());
    }

    addUpdate(update);
}

function distanceSteering(vehicle) {
    var way = origin.copy();
    way.sub(vehicle.pos);
    var v = vehicle.vel.copy();
    v.mul(5);
    way.sub(v);
    var m = map(way.magnitude - 300, -300, 300, -DISTANCE_STEERING, DISTANCE_STEERING);
    way.magnitude = m;
    way.sub(vehicle.vel);
    return way;
}

function rotationalSteering(vehicle) {
    var steering = vehicle.pos.copy();
    steering.sub(origin);
    steering.heading += Math.PI / 2;
    steering.magnitude = ROTATIONAL_STEERING;
    steering.sub(vehicle.vel);
    return steering;
}

function dontBump(vehicle, others) {
    var desired = new Vector();
    for (var other of others) {
        let d = vehicle.pos.dist(other.pos);
        if (0 < d && d < 20) {
            let t = vehicle.pos.copy();
            t.sub(other.pos);
            t.magnitude = map(t.magnitude, 0, 20, 0, 1);
            desired.add(t);
        }
    }
    desired.sub(vehicle.vel);
    return desired;
}

function updateVelocity(vehicle) {
    var acc = new Vector(0, 0);
    acc.add(distanceSteering(vehicle));
    acc.add(rotationalSteering(vehicle));
    acc.add(dontBump(vehicle, vehicles));
    if (acc.magnitude > STEERING_LIMIT) {
        acc.magnitude = STEERING_LIMIT;
    }
    vehicle.vel.add(acc);
    if (vehicle.vel.magnitude > SPEED_LIMIT) {
        vehicle.vel.magnitude = SPEED_LIMIT;
    }
}

function update() {
    for (var v of vehicles) {
        updateVelocity(v);
        v.pos.add(v.vel);
    }
    draw();
}

function draw() {
    canvas.color('black');
    canvas.background();
    canvas.color('white');
    canvas.fillArc(400, 400, 300);
    canvas.color('black');
    canvas.fillArc(400, 400, 299);
    canvas.color('white');
    for (var v of vehicles) {
        canvas.fillArc(v.pos.x, v.pos.y, 5);
        canvas.line(v.pos.x, v.pos.y, v.pos.x + 5 * v.vel.x, v.pos.y + 5 * v.vel.y);
    }
}

addSetup(setup);