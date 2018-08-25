var canvas;
var target;

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
    // segments[0].pos.y += 1;
    var target = new Vector(canvas.width/2, canvas.height/2);
    for (var i = 1; i < segments.length; i++) {
        let curr = segments[i];
        let n;
        if (i == 0) {
            n = target;
        } else {
            n = segments[i - 1];
        }

        let d = n.pos.copy().sub(curr.pos);

        curr.dir.heading = d.heading;
        curr.pos.add(d);
        curr.pos.sub(curr.dir);
    }

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
