var canvas;

var segments = [];

function draw() {
    canvas.color('white');
    canvas.background();
    canvas.color('red');
    for (var s of segments) {
        canvas.line(s.pos.x, s.pos.y,
            s.pos.x + s.dir.x, s.pos.y + s.dir.y);
    }
}

function update() {
    draw();
}

function newSegment(position, length) {
    return {
        pos: position,
        dir: new Vector(length, 0)
    }
}

function setup() {
    canvas = new Canvas('canvas');

    var total = 0;
    for (let i = 0; i < 10; i++) {
        var l = 20;
        segments.push(newSegment(
            new Vector(canvas.width/2 - total, canvas.height/2), l
        ));
        total += l;
    }

    addUpdate(update);
}

addSetup(setup);
