var vehicles;
var canvas;
var origin;
var radius;
var t = 0;

var DISTANCE_STEERING = 5;

var ROTATIONAL_STEERING = 8;

var BUMP_STEERING = 5;

var SPEED_LIMIT = 10;
var STEERING_LIMIT = 0.1;

function newVehicle() {
    return {
        pos: new Vector(Math.random() * 800,
                        Math.random() * 800),
        vel: new Vector(0, 0)
    };
}

function setup() {
    radius = 300;
    canvas = new Canvas('canvas');
    origin = new Vector(400, 400);
    vehicles = [];
    for (var i = 0; i < 120; i++) {
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
    var m = map(way.magnitude - radius, -300, 300, -DISTANCE_STEERING, DISTANCE_STEERING);
    way.magnitude = m;
    way.sub(vehicle.vel);
    return way;
}

function rotationalSteering(vehicle) {
    var steering = vehicle.pos.copy();
    steering.sub(origin);
    steering.heading += Math.PI / 2;
    steering.magnitude = SPEED_LIMIT;
    steering.sub(vehicle.vel);
    steering.magnitude = map(steering.magnitude, 0, SPEED_LIMIT, 0, ROTATIONAL_STEERING);
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
    desired.magnitude = 5;
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
    SPEED_LIMIT = document.getElementById("myRange").value;
    t += 0.001;
    radius = 200 + 100 * Math.cos(t);
    for (var v of vehicles) {
        updateVelocity(v);
        v.pos.add(v.vel);
    }
    draw();
}

function draw() {
    var mul = document.getElementById("tadpole").checked ? -7 : 7;
    canvas.color('black');
    canvas.background();
    canvas.color('white');
    canvas.fillArc(400, 400, radius);
    canvas.color('black');
    canvas.fillArc(400, 400, radius-1);
    canvas.color('white');
    canvas.lineWidth(2);
    for (var v of vehicles) {
        canvas.fillArc(v.pos.x, v.pos.y, 5);
        canvas.line(v.pos.x, v.pos.y, v.pos.x + mul * v.vel.x, v.pos.y + mul * v.vel.y);
    }
}

addSetup(setup);
