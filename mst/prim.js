var connected = [];
var cheapest = [];
var from = [];
var pEdges;
var nextBest;
var considering;
var pCanvas;

function setupPrim() {
    pCanvas = new Canvas('prim');
    for (var i = 0; i < num; i++) {
        connected.push(false);
        cheapest.push(dist(points[0], points[i]));
        from.push(0);
    }
    connected[0] = true;
    considering = 0;
    nextBest = 0;
    pEdges = [];
}

function updatePrim() {
    pCanvas.color('black');
    pCanvas.background();

    if (pEdges.length < (num - 1)) {
        pCanvas.lineWidth(1);
        pCanvas.color('green');
        for (var n = 0; n < num; n++) {
            if (!connected[n]) {
                pCanvas.line(points[n].x, points[n].y,
                    points[from[n]].x, points[from[n]].y);
            }
        }

        while (considering < num && connected[considering]) {
            considering++;
        }

        if (considering >= num) {
            connected[nextBest] = true;
            pEdges.push({a: from[nextBest], b: nextBest});
            considering = 0;
            for (var n = 0; n < num; n++) {
                let d = dist(points[nextBest], points[n]);
                if (d < cheapest[n]) {
                    cheapest[n] = d;
                    from[n] = nextBest;
                }
            }
        } else {
            if (!connected[considering]) {
                let d = dist(points[considering],
                    points[from[considering]]);
                if (connected[nextBest] || d < cheapest[nextBest]) {
                    nextBest = considering;
                }
            }
            pCanvas.color('red');
            pCanvas.lineWidth(2);
            pCanvas.line(points[considering].x,
                points[considering].y, points[from[considering]].x,
                points[from[considering]].y);
            pCanvas.color('green');
            pCanvas.fillArc(points[nextBest].x,
                points[nextBest].y, 9);
            considering++;
        }
    }

    pCanvas.lineWidth(2);
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
