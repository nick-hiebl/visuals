var t;
var row;
var canvas;
var offset;

var rule;

function generate_rule(a, b) {
    return function(x, y, z) {
        var s = (x + y + z)/3;
        s = a * s + b;
        return s - Math.floor(s);
    }
}

function setup(m, b) {
    canvas = new Canvas('canvas');
    canvas.resize(window.innerWidth, window.innerHeight);
    t = 0;
    var len = canvas.width + canvas.height * 2 + 3;
    row = new Array(len).fill(0);
    row[Math.floor(len/2)] = 1;
    offset = Math.floor(canvas.width / 2) - Math.floor(len / 2);

    canvas.color('white');
    canvas.background();

    rule = generate_rule(m || 1, b || 0);
    draw_rule();
    draw();

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

function draw_rule() {
    var padding = 5;
    var x = canvas.width - 100 - padding;
    var y = padding;

    canvas.color('black');
    canvas.fillRect(x - 1, y - 1, 102, 102);
    canvas.color('white');
    canvas.fillRect(x, y, 100, 100);
    canvas.color('black');
    for (var i = 0; i <= 100; i++) {
        var r = Math.round(100 * rule(i/100, i/100, i/100));
        canvas.fillRect(x + i, y + 100 - r, 1, 1);
    }
}

function draw() {
    // canvas.color('black');
    for (var i = -offset; i < canvas.width - offset; i++) {
        canvas.color('hsl(0, 0%, ' + Math.floor(100 - 100 * row[i]) + '%)');
        canvas.fillRect(i + offset, t, 1, 1);
    }
    draw_rule();
}

var table = document.createElement("table");

function r(k, l) {
    return {
        m: k, b: l
    }
}
var rules = [
    [r(1,    0), r(1, 0.325), r(1,  0.25), r(1,  0.025)],
    [r(1, 0.45), r(1, 0.175), r(1, 0.475), r(1, 0.3229)],
    [r(1,  0.9), r(1,  0.35), r(1,   0.3), r(1,  0.495)],
    [r(1.5,    0), r(1.5, 0.199), r(1.1, 0.499), r(2, 0.495)],
    [r(  2,  0.9), r(  2,  0.35)]
];
function make_onclick(n) {
    return function() {
        setup(n.m, n.b);
    }
}
for (var row of rules) {
    var tr = document.createElement("tr");
    for (var item of row) {
        var td = document.createElement("td");
        var b = document.createElement("button");
        b.innerText = "y = " + item.m +"x + " + item.b;
        b.onclick = make_onclick(item);
        td.appendChild(b);
        tr.appendChild(td);
    }
    table.appendChild(tr);
}
document.getElementById("normal").appendChild(table);

addSetup(setup);
