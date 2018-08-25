var canvas;
var target;
var t;

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
    target = new Vector(canvas.width/2, canvas.height/2);
    let temp = new Vector(150 + 50 * Math.cos(3.193*t), 0);
    temp.heading = t;
    t += 0.02;
    target.add(temp);
    for (var i = 0; i < segments.length; i++) {
        let curr = segments[i];
        var n;
        if (i == 0) {
            n = target;
        } else {
            n = segments[i - 1].pos;
        }

        let d = n.copy().sub(curr.pos);

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

    t = 0;

    var total = 0;
    for (let i = 0; i < 20; i++) {
        var l = 20;
        segments.push(newSegment(
            new Vector(canvas.width/2 - total, canvas.height/2), l
        ));
        total += l;
    }

    addUpdate(update);
}

addSetup(setup);
