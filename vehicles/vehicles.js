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
    actions = [seek, aggression, fear, observe];

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
        var v = Vector.randUnit();
        v.mul(5);
        return v;
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

function observe(target, vehicle) {
    var desired = target.copy();
    desired.heading += 0;
    var mag = desired.magnitude * SPEED_LIMIT + 0.01;
    var mul = map(desired.dot(vehicle.vel), -mag, mag, -SPEED_LIMIT, SPEED_LIMIT);
    desired.mul(mul);
    var v = Vector.randUnit();
    // v.mul(5);
    desired.add(v);

    var offset = target.copy();
    offset.heading += Math.PI/2;
    offset.magnitude = SPEED_LIMIT/3;

    desired.mul(map(target.magnitude, 0, 400, -SPEED_LIMIT/8, SPEED_LIMIT));

    desired.add(offset);

    if (desired.magnitude > SPEED_LIMIT) {
        desired.magnitude = SPEED_LIMIT;
    }

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
        canvas.fillArc(vehicle.pos.x, vehicle.pos.y, 5);
        canvas.lineWidth(2);
        canvas.line(vehicle.pos.x, vehicle.pos.y,
            vehicle.pos.x + 4 * vehicle.vel.x, vehicle.pos.y + 4 * vehicle.vel.y);
    }
}

addSetup(setup);
