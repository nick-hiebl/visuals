var parent = [];
var edges = [];
var potentialEdges = [];
var kCanvas;

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

    // while (edges.length < (num - 1)) {
    //     var nextEdge = potentialEdges.pop();
    //     if (get_root(nextEdge.a) != get_root(nextEdge.b)) {
    //         edges.push(nextEdge);
    //         merge(nextEdge.a, nextEdge.b);
    //         neighbours[nextEdge.a].push(nextEdge.b);
    //         neighbours[nextEdge.b].push(nextEdge.a);
    //     }
    // }
    // Ideally empty up some memory
    // potentialEdges = [];

    updateKruskal();
}

function updateKruskal() {
    var nextEdge;
    if (edges.length < (num - 1)) {
        nextEdge = potentialEdges.pop();
        if (get_root(nextEdge.a) != get_root(nextEdge.b)) {
            edges.push(nextEdge);
            merge(nextEdge.a, nextEdge.b);
            neighbours[nextEdge.a].push(nextEdge.b);
            neighbours[nextEdge.b].push(nextEdge.a);
        }
    }

    kCanvas.color('black');
    kCanvas.background();

    kCanvas.lineWidth(2);

    if (nextEdge) {
        kCanvas.color('red');
        kCanvas.line(points[nextEdge.a].x, points[nextEdge.a].y,
            points[nextEdge.b].x, points[nextEdge.b].y);
    }

    kCanvas.color('white');

    for (var e of edges) {
        kCanvas.line(points[e.a].x, points[e.a].y, points[e.b].x, points[e.b].y);
    }

    for (var p of points) {
        kCanvas.fillArc(p.x, p.y, 5);
    }
}
