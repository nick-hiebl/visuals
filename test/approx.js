var parent;
var edges;
var potentialEdges;
var approxCanvas;

var neighbours;

var cycle;

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

function setupApprox() {
    parent = [];
    edges = [];
    potentialEdges = [];
    approxCanvas = new Canvas('mst');

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

    while (edges.length < (num - 1)) {
        var nextEdge = potentialEdges.pop();
        if (get_root(nextEdge.a) != get_root(nextEdge.b)) {
            edges.push(nextEdge);
            merge(nextEdge.a, nextEdge.b);
            neighbours[nextEdge.a].push(nextEdge.b);
            neighbours[nextEdge.b].push(nextEdge.a);
        }
    }
    // Ideally empty up some memory
    potentialEdges = [];

    generate_cycle();

    draw();
}

function dfs(node) {
    if (cycle.indexOf(node) != -1) {
        return;
    }
    cycle.push(node);
    for (var n of neighbours[node]) {
        dfs(n);
    }
}

function generate_cycle() {
    cycle = [];
    dfs(0);
    console.log(cycle);
}

function draw() {
    approxCanvas.color('black');
    approxCanvas.background();

    approxCanvas.lineWidth(1);
    approxCanvas.color('green');
    for (var e of edges) {
        approxCanvas.line(points[e.a].x, points[e.a].y,
            points[e.b].x, points[e.b].y);
    }
    approxCanvas.color('white');
    approxCanvas.lineWidth(2);

    let total = 0;
    for (var i = 0; i < num - 1; i++) {
        let c1 = points[cycle[i]];
        let c2 = points[cycle[i+1]];
        total += dist(c1, c2);

        approxCanvas.line(c1.x, c1.y, c2.x, c2.y);
    }

    let c1 = points[cycle[0]];
    let c2 = points[cycle[num - 1]];
    total += dist(c1, c2);

    approxCanvas.line(c1.x, c1.y, c2.x, c2.y);

    approxCanvas.color('white');
    for (var i = 0; i < num; i++) {
        approxCanvas.fillArc(points[i].x, points[i].y, i == 0 ? 8 : 4);
    }
    
    approxCanvas.ctx.fillText(total.toLocaleString(), 5, 15);
}
