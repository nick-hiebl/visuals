var connected = [];
var pEdges;
var bestEdge = undefined;
var considering;
var pCanvas;

function setupPrim() {
    pCanvas = new Canvas('prim');
    for (var i = 0; i < num; i++) {
        connected.push(false);
    }
    connected[0] = true;
    considering = {node: 0, edge: 1};
    bestEdge = {node: 0, edge: 1, dist: 10000};
    pEdges = [];
}

function updatePrim() {
    pCanvas.color('black');
    pCanvas.background();

    pCanvas.lineWidth(2);

    if (considering.edge >= num) {
        considering.edge = 0;
        considering.node++;
        while (considering.node < num && !connected[considering.node]) {
            considering.node++;
        }
    }
    if (considering.node >= num) {
        pEdges.push({a: bestEdge.node, b: bestEdge.edge});
        connected[bestEdge.b] = true;
        bestEdge = {node: 0, edge: 1, dist: 10000};
        considering.edge = 0;
        considering.node = 1;
    }

    d = dist(points[considering.edge], points[considering.node]);
    if (!connected[considering.other] && d < bestEdge.dist) {
        bestEdge = {node: considering.node, edge: considering.edge,
            dist: d};
    }

    if (bestEdge != undefined) {
        pCanvas.color('red');
        pCanvas.line(points[bestEdge.node].x,
            points[bestEdge.node].y,
            points[bestEdge.edge].x,
            points[bestEdge.edge].y);
    }

    pCanvas.color('white');

    for (var e of pEdges) {
        pCanvas.line(points[e.a].x,
            points[e.a].y,
            points[e.b].x,
            points[e.b].y);
    }

    for (var p of points) {
        pCanvas.fillArc(p.x, p.y, 5);
    }
    considering.edge++;
}
