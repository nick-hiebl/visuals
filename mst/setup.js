var points = [];
var num = 160;

function dist(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function setup() {
    for (var i = 0; i < num; i++) {
        points.push({x: Math.random() * 560 + 20,
            y: Math.random() * 560 + 20});
    }

    setupKruskal();
    setupPrim();

    addUpdate(updateKruskal);
    addUpdate(updatePrim);
}

addSetup(setup);
