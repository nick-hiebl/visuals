let canvas;

const uiState = {
    mousePos: new Vector(0, 0),
    pressed: false,
}

const battleState = {
    head: new Vector(0, 0),
    headItem: undefined,
    segments: [],
    loopTime: 0,
    items: [],
    projectiles: [],
};

function clamp(x, low, high) {
    return Math.min(high, Math.max(low, x));
}

const BAUBLE_WIDTH = 10;

const COLORS = {
    normal: '#f08',
    bend: 'gray',
}

function baseFollow(segment, goal) {
    let d = Vector.diff(goal, segment.pos);
    segment.dir.heading = d.heading;
    segment.pos.add(d);
    segment.pos.sub(segment.dir);
}

function normalFollow(segment, goal) {
    segment.pos.add(segment.dir.copy().mul(0.4));
    baseFollow(segment, goal);
}

function bendFollow(segment, goal, prevSegment) {
    if (!prevSegment) {
        normalFollow(segment, goal);
        return;
    }

    segment.dir.heading = prevSegment.dir.heading + segment.bendOffset;
    segment.pos = Vector.diff(prevSegment.pos, segment.dir);
}

let indicatedError = false;

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

function actionSegment(battleState, pos, item) {
    if (!item) {
        return;
    }

    console.log('processing item');

    switch (item.itemType) {
        case 0:
            const targetedEnemy = closestEnemy(battleState, pos);
            const vel = Vector.diff(targetedEnemy.pos, pos);
            vel.magnitude = PROJECTILE_SPEED;
            battleState.projectiles.push({
                pos: pos.copy(),
                vel,
            });
            return;
        default:
            return;
    }
}

function eatItem(battleState, newItem) {
    let previousItem = battleState.headItem;

    for (const segment of battleState.segments) {
        const swallowingItem = segment.item;
        segment.item = previousItem;
        actionSegment(battleState, segment.pos, segment.item);
        previousItem = swallowingItem;
    }

    battleState.headItem = newItem;
    actionSegment(battleState, battleState.head, newItem);
}

let VEL = 180;
let FAST_VEL = 360;
const STEER_RATE = 20;
const ENEMY_SPEED = VEL * 0.6;
const PROJECTILE_SPEED = 500;

function update(dur) {
    // Calculate basic parameters
    const delta = Math.min(dur / 1000, 1 / 20);
    const turnRate = STEER_RATE * delta;
    const speed = (uiState.pressed ? FAST_VEL : VEL) * delta;

    battleState.loopTime += delta;

    // Calculate head movement
    const { head, segments } = battleState;

    const vel = segments[0].dir.copy();
    vel.magnitude = speed;
    const angle = vel.heading;
    const headToMouse = Vector.diff(uiState.mousePos, head);
    headToMouse.heading -= angle;
    vel.heading += clamp(headToMouse.heading, -turnRate, turnRate) + Math.random() * 0.001;

    // for (const segment of segments.slice(2)) {
    //     const diff = Vector.diff(battleState.head, segment.pos);
    //     const dist = diff.magnitude;
    //     const f = 20 / (1 + Math.exp(-(2 * BAUBLE_WIDTH - dist)));
    //     if (f < 0 && Math.random() < 0.1) {
    //         console.log('!!');
    //     }
    //     diff.magnitude = Math.max(0, f);
    //     vel.add(diff);
    // }

    head.add(vel);

    // Follow tail
    let previous = head;
    let prevSegment = undefined;
    for (const segment of segments) {
        switch (segment.kind) {
            case 'normal':
                normalFollow(segment, previous);
                break;
            case 'bend':
                bendFollow(segment, previous, prevSegment);
                break;
            default:
                if (!indicatedError) {
                    console.error('Handling unexpected segment type:', segment.kind);
                    indicatedError = true;
                }
                normalFollow(segument, previous);
                break;
        }
        normalFollow(segment, previous);

        previous = segment.pos;
        prevSegment = segment;
    }

    let loopActivated = battleState.loopTime > getLoopMax();
    if (loopActivated) {
        battleState.loopTime = 0;
        eatItem(battleState, undefined);
    }

    for (const [item, remove] of iterWithRemoval(battleState.items)) {
        // If colliding
        const dist = item.pos.sqrDist(head);
        if (dist < BAUBLE_WIDTH * BAUBLE_WIDTH * 1.6 * 1.6) {
            remove();
            eatItem(battleState, item);
        }
    }

    const avgPlayerPos = segments.reduce((sum, { pos }) => Vector.sum(sum, pos), new Vector(0, 0)).mul(1 / segments.length);

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

    for (const [projectile, remove] of iterWithRemoval(battleState.projectiles)) {
        const step = projectile.vel.copy();
        step.mul(delta);
        projectile.pos.add(step);

        if (isOffscreen(projectile.pos)) {
            remove();
        }
    }

    draw(canvas, battleState);
}

function choice(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function newSegment(position, length, kind = 'normal') {
    return {
        pos: position,
        dir: new Vector(length, 0),
        kind,
        bendOffset: choice([-Math.PI / 2, -Math.PI / 4, Math.PI / 4, Math.PI / 2]),
        item: undefined,
    };
}

const NUM_SEGMENTS = 8;
const SEGMENT_LENGTH = BAUBLE_WIDTH * 2.5;

function isOffscreen(pos) {
    return pos.x < 0 || pos.x >= canvas.width || pos.y < 0 || pos.y >= canvas.height;
}

function initSnake() {
    battleState.head = new Vector(canvas.width / 2 + 30, canvas.height / 2);

    const bentIndex = Math.floor(Math.random() * (NUM_SEGMENTS - 1)) + 1;
    const bentIndex2 = Math.random() > 0.7 ? Math.floor(Math.random() * (NUM_SEGMENTS - 1) + 1) : -10;
    for (let i = 0; i < NUM_SEGMENTS; i++) {
        battleState.segments.push(newSegment(
            new Vector(canvas.width/2 - i * SEGMENT_LENGTH, canvas.height/2),
            SEGMENT_LENGTH,
            (i == bentIndex || i == bentIndex2) ? 'bend' : undefined,
        ));
    }
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
    const ROWS = 5;
    const COLS = 8;
    const ROW_H = canvas.height / ROWS;
    const COL_W = canvas.width / COLS;
    for (const [i, j] of range2D(ROWS, COLS)) {
        const x = i * COL_W + (0.5 * 0.56 + Math.random() * 0.44) * COL_W;
        const y = j * ROW_H + (0.5 * 0.56 + Math.random() * 0.44) * ROW_H;

        const hue = choice([0, 90, 180, 270]);
        battleState.items.push({
            pos: new Vector(x, y),
            color: `hsl(${hue}, 100%, 70%)`,
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

function initEnemies() {
    battleState.enemies = [];

    for (let i = 0; i < 10; i++) {
        battleState.enemies.push({
            pos: randomEdgePosition(canvas),
            timer: 0,
            maxTime: Math.random() * 3 + 2,
        });
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
