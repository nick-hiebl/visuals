var t;
var row;
var canvas;
var offset;

var rule;

var pos;
var left, right;

function generate_rule(n) {
    return function(a, b, c) {
        if (a && b && c) {
            return (n >> 14) & 3;
        } else if (a && b && !c) {
            return (n >> 12) & 3;
        } else if (a && !b && c) {
            return (n >> 10) & 3;
        } else if (a && !b && !c) {
            return (n >> 8) & 3;
        } else if (!a && b && c) {
            return (n >> 6) & 3;
        } else if (!a && b && !c) {
            return (n >> 4) & 3;
        } else if (!a && !b && c) {
            return (n >> 2) & 3;
        } else if (!a && !b && !c) {
            return (n >> 0) & 3;
        }
    }
}

function makeRule(a, b, c, d, e, f, g, h) {
    return (a << 14) + (b << 12) + (c << 10) + (d << 8) + (e << 6) + (f << 4) + (g << 2) + (h << 0);
}

function setup(n) {
    canvas = new Canvas('canvas');
    canvas.resize(window.innerWidth, window.innerHeight);
    t = 0;
    var len = canvas.width + canvas.height * 2 + 3;
    pos = Math.floor(len / 2);
    left = pos;
    right = pos;
    row = new Array(len).fill(0);
    offset = Math.floor(canvas.width / 2) - Math.floor(len / 2);

    canvas.color('white');
    canvas.background();

    draw();

    var ruleNo = makeRule(0, 2, 1, 1, 2, 1, 3, 3);

    rule = generate_rule(n || ruleNo);

    addUpdate(update);
}

function step() {
    t++;
    var res = rule(row[pos-1], row[pos], row[pos+1]);
    row[pos] = res & 1;
    if (res & 2) {
        pos += 1;
    } else {
        pos -= 1;
    }
    left = Math.min(pos, left);
    right = Math.max(pos, right);
    draw();
}

function update() {
    if (t < canvas.height) {
        if (document.getElementById("fast").checked) {
            for (var i = 0; i < 15; i++) {
                step();
            }
        } else {
            step();
        }
    }
}

function draw() {
    canvas.color('black');
    for (var i = -offset; i < canvas.width - offset; i++) {
        if (row[i])
            canvas.fillRect(i + offset, t, 1, 1);
    }
}

var table = document.createElement("table");
var rules = [
    [ 9631, 42637, 32147],
    [42029, 41629, 44303]
];
function make_onclick(n) {
    return function() {
        setup(n);
    }
}

for (var row of rules) {
    var tr = document.createElement("tr");
    for (var item of row) {
        var td = document.createElement("td");
        var b = document.createElement("button");
        b.innerText = "Rule " + item;
        b.onclick = make_onclick(item);
        td.appendChild(b);
        tr.appendChild(td);
    }
    table.appendChild(tr);
}
document.getElementById("normal").appendChild(table);


addSetup(setup);
