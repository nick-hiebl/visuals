var thatCanvas;

function setupThat() {
    thatCanvas = new Canvas('that');

    addUpdate(updateThat);
}

function updateThat() {
    thatCanvas.color('black');
    thatCanvas.background();
    thatCanvas.color('white');
    for (var v of points) {
        thatCanvas.fillArc(v.x, v.y, 4);
    }

    thatCanvas.lineWidth(2);
    let mine = population[Math.floor(Math.random() * population.length)];
    for (var i = 0; i < num - 1; i++) {
        let c1 = points[mine.route[i]];
        let c2 = points[mine.route[i+1]];

        thatCanvas.line(c1.x, c1.y, c2.x, c2.y);
    }

    let c1 = points[mine.route[0]];
    let c2 = points[mine.route[num - 1]];

    thatCanvas.line(c1.x, c1.y, c2.x, c2.y);
}
