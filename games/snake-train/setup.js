let canvas;

const uiState = {
    mousePos: new Vector(0, 0),
    pressed: false,
}

const battleState = {
    snake: undefined,
    loopTime: 0,
    items: [],
    projectiles: [],
};

function clamp(x, low, high) {
    return Math.min(high, Math.max(low, x));
}

const BAUBLE_WIDTH = 10;

function getLoopMax() {
    return 5;
}

function closestEnemy({ enemies }, pos) {
    if (!enemies.length) {
        return undefined;
    }
    let bestDist = Infinity;
    let closest = enemies[0];
    for (const enemy of enemies) {
        let dist = Vector.dist(enemy.pos, pos);
        if (dist < bestDist) {
            bestDist = dist;
            closest = enemy;
        }
    }
    return closest;
}

let VEL = 180;
let FAST_VEL = 360;
const STEER_RATE = 0.6;
const ENEMY_SPEED = VEL * 0.6;
const PROJECTILE_SPEED = 500;

function update(dur) {
    // Calculate basic parameters
    const delta = Math.min(dur / 1000, 1 / 20);

    battleState.loopTime += delta;

    const { snake } = battleState;

    snake.move(uiState.mousePos, uiState.pressed, delta);

    let loopActivated = battleState.loopTime > getLoopMax();
    if (loopActivated) {
        battleState.loopTime = 0;
        snake.eatItem(battleState, undefined);
    }

    for (const [item, remove] of iterWithRemoval(battleState.items)) {
        // If colliding
        const dist = item.pos.sqrDist(snake.head.position);
        if (dist < BAUBLE_WIDTH * BAUBLE_WIDTH * 1.6 * 1.6) {
            remove();
            snake.eatItem(battleState, item);
        }
    }

    // TODO
    const avgPlayerPos = snake.head.position; //segments.reduce((sum, { pos }) => Vector.sum(sum, pos), new Vector(0, 0)).mul(1 / segments.length);

    for (const enemy of battleState.enemies) {
        enemy.timer += delta;

        const move = Vector.diff(avgPlayerPos, enemy.pos);
        const timePercent = enemy.timer / enemy.maxTime;
        if (timePercent > 0.2) {
            if (timePercent > 1) {
                enemy.timer = 0;
            }
            move.x = 0;
            move.y = 0;
        } else {
            move.magnitude = ENEMY_SPEED * delta;
        }

        enemy.pos.add(move);
    }

    for (const [{ pos, vel }, remove] of iterWithRemoval(battleState.projectiles)) {
        const step = vel.copy();
        step.mul(delta);
        pos.add(step);

        if (isOffscreen(pos)) {
            remove();
            continue;
        }

        const target = closestEnemy(battleState, pos);

        if (target && pos.sqrDist(target.pos) < BAUBLE_WIDTH * BAUBLE_WIDTH) {
            remove();
            // Strike enemy
            target.hp -= 1;
            if (target.hp <= 0) {
                battleState.enemies = battleState.enemies.filter((enemy) => enemy !== target);
            }
        }
    }

    draw(canvas, battleState);
}

function choice(list) {
    return list[Math.floor(Math.random() * list.length)];
}

const NUM_SEGMENTS = 8;
const SEGMENT_LENGTH = BAUBLE_WIDTH * 2.5;

function isOffscreen(pos) {
    return pos.x < 0 || pos.x >= canvas.width || pos.y < 0 || pos.y >= canvas.height;
}

function initSnake() {
    battleState.snake = makeSnake(new Vector(canvas.width / 2 + 50, canvas.height / 2));
}

function* range2D(rows, cols) {
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            yield [x, y];
        }
    }
}

function* iterWithRemoval(list) {
    for (let i = list.length - 1; i >= 0; i--) {
        yield [list[i], () => list.splice(i, 1)];
    }
}

function initItems() {
    const ROWS = 7;
    const COLS = 10;
    const ROW_H = canvas.height / ROWS;
    const COL_W = canvas.width / COLS;
    for (const [i, j] of range2D(ROWS, COLS)) {
        const x = i * COL_W + (0.5 * 0.2 + Math.random() * 0.8) * COL_W;
        const y = j * ROW_H + (0.5 * 0.2 + Math.random() * 0.8) * ROW_H;

        const hue = choice([0, 90, 270]);
        battleState.items.push({
            pos: new Vector(x, y),
            color: `hsl(${hue}, 100%, 50%)`,
            itemType: hue,
        });
    }
}

function randInRect(xLo, xHi, yLo, yHi) {
    return new Vector(
        Math.random() * (xHi - xLo) + xLo,
        Math.random() * (yHi - yLo) + yLo,
    );
}

function toCanvas(canvas, vector) {
    return new Vector(
        vector.x * canvas.width,
        vector.y * canvas.height,
    );
}

function randomEdgePosition(canvas) {
    if (Math.random() < 0.25) {
        return toCanvas(canvas, randInRect(0, 1, 0, 0.1));
    } else if (Math.random() < 0.33) {
        return toCanvas(canvas, randInRect(0.9, 1, 0, 1));
    } else if (Math.random() < 0.5) {
        return toCanvas(canvas, randInRect(0, 1, 0.9, 1));
    } else {
        return toCanvas(canvas, randInRect(0, 0.1, 0, 1));
    }
}

function createEnemy() {
    return {
        pos: randomEdgePosition(canvas),
        timer: Math.random() * 8,
        maxTime: Math.random() * 3 + 2,
        maxHp: 5,
        hp: 5,
    }
}

function initEnemies() {
    battleState.enemies = [];

    for (let i = 0; i < 10; i++) {
        battleState.enemies.push(createEnemy());
    }
}

function setup() {
    canvas = new Canvas('canvas');
    canvas.resize(1920, 1080);

    initItems();
    initEnemies();
    initSnake();

    addUpdate(update);

    setupMouseListeners(canvas, uiState);
}

addSetup(setup);
