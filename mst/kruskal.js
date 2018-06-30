var parent = [];
var edges = [];
var potentialEdges = [];
var kCanvas;

var longN;
var longO;
var nConsidered;

function get_root(x) {
    if (parent[x] == x) return x;
    let root = get_root(parent[x]);
    parent[x] = root;
    return root;
}

function merge(x, y) {
    let root = get_root(x);
    parent[root] = get_root(y);
}

function setupKruskal() {
    parent = [];
    edges = [];
    potentialEdges = [];
    kCanvas = new Canvas('kruskal');

    neighbours = [];

    for (let n = 0; n < num; n++) {
        neighbours.push([]);
        parent.push(n);
        for (let o = 0; o < n; o++) {
            potentialEdges.push({a: n, b: o,
                dist: dist(points[n], points[o])});
        }
    }
    potentialEdges.sort(function(a, b) {
        // Reverse order
        return b.dist - a.dist;
    });

    nConsidered = 0;

    longN = 0;
    longO = -1;

    updateKruskal();
}

function updateKruskal() {
    var nextEdge;
    if (longN < num) {
        nConsidered += longO + 5 > longN ? longN - longO : 5;
        longO += 5;
        if (longO >= longN) {
            longO = 0;
            longN++;
        }
    } else {
        if (edges.length < (num - 1)) {
            nextEdge = potentialEdges.pop();
            if (get_root(nextEdge.a) != get_root(nextEdge.b)) {
                edges.push(nextEdge);
                merge(nextEdge.a, nextEdge.b);
                neighbours[nextEdge.a].push(nextEdge.b);
                neighbours[nextEdge.b].push(nextEdge.a);
            }
        }
    }

    kCanvas.color('black');
    kCanvas.background();

    kCanvas.lineWidth(2);

    if (longN < num) {
        kCanvas.color('red');
        kCanvas.fillRect(5, 5, (600 - 10) * (nConsidered)/(num*(num-1)/2), 5);
        kCanvas.line(points[longN].x, points[longN].y,
            points[longO].x, points[longO].y);
    } else {
        if (nextEdge) {
            kCanvas.color('red');
            kCanvas.line(points[nextEdge.a].x, points[nextEdge.a].y,
                points[nextEdge.b].x, points[nextEdge.b].y);
            }
    }

    kCanvas.color('white');

    for (var e of edges) {
        kCanvas.line(points[e.a].x, points[e.a].y, points[e.b].x, points[e.b].y);
    }

    for (var p of points) {
        kCanvas.fillArc(p.x, p.y, 5);
    }
}
