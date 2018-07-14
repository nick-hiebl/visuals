var t;
var row;
var canvas;
var offset;

var rule;

function generate_rule(n) {
    return function(a, b, c) {
        if (a && b && c) {
            return (n & 128) > 0;
        } else if (a && b && !c) {
            return (n & 64) > 0;
        } else if (a && !b && c) {
            return (n & 32) > 0;
        } else if (a && !b && !c) {
            return (n & 16) > 0;
        } else if (!a && b && c) {
            return (n & 8) > 0;
        } else if (!a && b && !c) {
            return (n & 4) > 0;
        } else if (!a && !b && c) {
            return (n & 2) > 0;
        } else if (!a && !b && !c) {
            return (n & 1) > 0;
        }
    }
}

function setup(n) {
    canvas = new Canvas('canvas');
    canvas.resize(window.innerWidth, window.innerHeight);
    t = 0;
    var len = canvas.width + canvas.height * 2 + 3;
    row = new Array(len).fill(0);
    row[Math.floor(len/2)] = 1;
    offset = canvas.width / 2 - Math.floor(len/2);

    canvas.color('white');
    canvas.background();

    draw();

    rule = generate_rule(n || 110);

    addUpdate(update);
}

function step() {
    t++;
    if (t < canvas.height + 3) {
        var temp = [0];
        for (var i = 1; i < row.length - 1; i++) {
            temp.push(rule(row[i-1], row[i], row[i+1]));
        }
        temp.push(0);
        row = temp;
        draw();
    }
}

function update() {
    if (document.getElementById("fast").checked) {
        for (var i = 0; i < 15; i++) {
            step();
        }
    } else {
        step();
    }
}

function draw() {
    canvas.color('black');
    for (var i = -offset; i < canvas.width - offset; i++) {
        if (row[i])
            canvas.fillRect(i + offset, t, 1, 1);
    }
}

addSetup(setup);
