function drawItems(canvas, items) {
    for (const item of items) {
        canvas.color(item.color);
        canvas.fillArc(item.pos.x, item.pos.y, BAUBLE_WIDTH * 0.8);
    }
}

function squareOn(canvas, pos, radius) {
    canvas.fillRect(pos.x - radius, pos.y - radius, radius * 2, radius * 2);
}

function strokeRectOn(canvas, x, y, width, height) {
    canvas.strokeRect(x - width, y - height, width * 2, height * 2);
}

function rectOn(canvas, x, y, width, height) {
    canvas.fillRect(x - width, y - height, width * 2, height * 2);
}

function drawEnemies(canvas, battleState) {
    for (const enemy of battleState.enemies) {
        canvas.color('white');
        squareOn(canvas, enemy.pos, BAUBLE_WIDTH * 0.9);
        canvas.color('black');
        squareOn(canvas, enemy.pos, BAUBLE_WIDTH * 0.7);

        // Health bar
        if (enemy.hp < enemy.maxHp) {
            canvas.color('white');
            strokeRectOn(canvas, enemy.pos.x, enemy.pos.y + BAUBLE_WIDTH * 1.5, BAUBLE_WIDTH * 2, BAUBLE_WIDTH * 0.5);
            canvas.color('black');
            rectOn(canvas, enemy.pos.x, enemy.pos.y + BAUBLE_WIDTH * 1.5, BAUBLE_WIDTH * 2, BAUBLE_WIDTH * 0.5);
            canvas.color('red');
            canvas.fillRect(enemy.pos.x - BAUBLE_WIDTH * 2, enemy.pos.y + BAUBLE_WIDTH * 1, BAUBLE_WIDTH * 4 * enemy.hp / enemy.maxHp, BAUBLE_WIDTH);
        }
    }
}

function drawSegment(canvas, pos, item, segment) {
    canvas.color(COLORS[segment ? segment.actionType : 'shoot']);
    canvas.fillArc(pos.x, pos.y, BAUBLE_WIDTH);
    if (segment && segment.connectionType === 'bend') {
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

function drawSnake(canvas, battleState) {
    battleState.snake.draw(canvas);
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
    drawSnake(canvas, battleState);
    drawProjectiles(canvas, battleState);

    drawTimer(canvas, battleState);
}
