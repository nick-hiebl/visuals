var points = [];
var num = 50;

function dist(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function setup() {
    for (var i = 0; i < num; i++) {
        points.push({x: Math.random() * 360 + 20,
            y: Math.random() * 360 + 20});
    }

    setupKruskal();
    setupPrim();

    addUpdate(updateKruskal);
    addUpdate(updatePrim);
}

addSetup(setup);
