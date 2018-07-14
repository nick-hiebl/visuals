var t;
var row;
var canvas;
var offset;

var rule;

function generate_rule(n) {
    var x = [];
    // Generate n in base 3 in reverse digit order
    while (x.length < 8) {
        let k = n % 3;
        x.push(k);
        n = Math.floor(n / 3);
    }
    console.log(x);
    return function(a, b, c) {
        return x[a + b + c];
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

    rule = generate_rule(n || 1029);

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
        if (row[i] == 1) {
            canvas.color('#77f');
            canvas.fillRect(i + offset, t, 1, 1);
        } else if (row[i] == 2) {
            canvas.color('black');
            canvas.fillRect(i + offset, t, 1, 1);
        }
    }
}

var table = document.createElement("table");
var rules = [
    [ 993,  996, 1020, 1038],
    [1041, 1074, 1086, 1329],
    [ 948, 1749,  177,  912],
    [2040, 1635, 2049, 1599],
    [ 357,  600, 2058]
];
function make_onclick(n) {
    return function() {
        setup(n);
    }
}
for (var row of rules) {
    var r = document.createElement("tr");
    for (var item of row) {
        var td = document.createElement("td");
        var b = document.createElement("button");
        b.innerText = "Rule " + item;
        b.onclick = make_onclick(item);
        td.appendChild(b);
        r.appendChild(td);
    }
    table.appendChild(r);
}
document.getElementById("normal").appendChild(table);

addSetup(setup);
