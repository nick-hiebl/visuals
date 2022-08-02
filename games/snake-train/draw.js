function drawItems(canvas, items) {
    for (const item of items) {
        canvas.color(item.color);
        canvas.fillArc(item.pos.x, item.pos.y, BAUBLE_WIDTH * 0.8);
    }
}

function squareOn(canvas, pos, radius) {
    canvas.strokeRect(pos.x - radius, pos.y - radius, radius * 2, radius * 2);
}

function drawEnemies(canvas, battleState) {
    canvas.color('white');
    for (const enemy of battleState.enemies) {
        squareOn(canvas, enemy.pos, BAUBLE_WIDTH * 0.9);
    }
}

function drawSegment(canvas, pos, item, segment) {
    canvas.color(COLORS.normal);
    canvas.fillArc(pos.x, pos.y, BAUBLE_WIDTH);
    if (segment && segment.kind === 'bend') {
        canvas.translate(pos.x, pos.y);
        const angle = segment.dir.heading;
        canvas.rotate(angle - Math.PI / 4);
        canvas.fillRect(0, 0, BAUBLE_WIDTH, BAUBLE_WIDTH);
        canvas.rotate(-angle + Math.PI / 4);
        canvas.translate(-pos.x, -pos.y);
    }

    if (item) {
        canvas.color('black');
        canvas.fillArc(pos.x, pos.y, BAUBLE_WIDTH * 0.8);
        canvas.color(item.color);
        canvas.fillArc(pos.x, pos.y, BAUBLE_WIDTH * 0.5);
    }
}

function drawSnake(canvas, head, headItem, segments) {
    canvas.color(COLORS['normal']);
    // const head = Vector.sum(segments[0].pos, segments[0].dir);
    // canvas.fillArc(head.x, head.y, BAUBLE_WIDTH);
    drawSegment(canvas, head, headItem);

    for (const segment of segments) {
        // canvas.color(COLORS[s.kind] || 'white');
        // canvas.line(s.pos.x, s.pos.y,
        //     s.pos.x + s.dir.x, s.pos.y + s.dir.y);
        // canvas.fillArc(s.pos.x, s.pos.y, BAUBLE_WIDTH);
        drawSegment(canvas, segment.pos, segment.item, segment);
    }
}

function drawProjectiles(canvas, battleState) {
    canvas.color('white');
    for (const projectile of battleState.projectiles) {
        canvas.fillArc(projectile.pos.x, projectile.pos.y, BAUBLE_WIDTH * 0.5, BAUBLE_WIDTH * 0.3, projectile.vel.heading);
    }
}

function drawTimer(canvas, battleState) {
    canvas.color('white');
    const loopPercent = battleState.loopTime / getLoopMax()
    canvas.lineWidth(3);
    canvas.strokeArc(30, 30, 25);
    canvas.fillSector(
        30, 30, 20, 20, -Math.PI / 2,
        0, 2 * Math.PI * loopPercent);
}

function draw(canvas, battleState) {
    canvas.color('black');
    canvas.background();
    
    drawItems(canvas, battleState.items);
    drawEnemies(canvas, battleState);
    drawSnake(canvas, battleState.head, battleState.headItem, battleState.segments);
    drawProjectiles(canvas, battleState);

    drawTimer(canvas, battleState);
}
