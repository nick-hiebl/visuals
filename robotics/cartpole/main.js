let canvas;

const charts = {};

const dimns = {
    trackRelativeY: .75,
    cartWidth: 50,
    cartHeight: 20,
    trackThickness: 3,
};

const userSettings = {
    initialTheta: 0.2,
    enableErrorIntegral: 1,
    dampness: 0.2,
};

const initialState = () => ({
    cartX: 0,
    cartMass: 2,
    cartVelocity: 0,
    rodLength: 60,
    rodMass: 1,
    theta: userSettings.initialTheta,
    dtheta: 0,
    errorIntegral: 0,

    gravity: 9.8,
});

const state = initialState();

function reset() {
    userSettings.enableErrorIntegral = document.getElementById('error-integral').checked ? 1 : 0;
    userSettings.initialTheta = document.getElementById('initial-offset').value / 50;
    userSettings.dampness = document.getElementById('dampness').value / 100;
    console.log('Read value', userSettings);

    Object.assign(state, initialState());
    state.cartX = canvas.width / 8;
    Object.values(charts).forEach(({ clear }) => clear());
}

function createChart(id, scale, colors = ['white']) {
    const rawCanvas = document.createElement('canvas');
    rawCanvas.id = id;
    rawCanvas.width = 300;
    rawCanvas.height = 200;
    document.body.appendChild(rawCanvas);
    const canvas = new Canvas(id);
    const RETAIN_ELEMENTS = 300;
    const data = [];

    const draw = () => {
        canvas.color('black');
        canvas.background();
        // const previous = canvas.height / 2;
        canvas.color('white');
        canvas.fillRect(0, canvas.height / 2, canvas.width, 1);
        if (Array.isArray(data[0])) {
            for (let j = 0; j < data[0].length; j++) {
                canvas.color(colors[j])
                for (let i = 0; i < data.length; i++) {
                    canvas.fillArc(i / RETAIN_ELEMENTS * canvas.width, canvas.height / 2 - data[i][j] * scale[j], 3, 3);
                }
            }
        } else {
            canvas.color(colors[0])
            for (let i = data.length - 1; i >= 0; i--) {
                canvas.fillArc(i / RETAIN_ELEMENTS * canvas.width, canvas.height / 2 - data[i] * scale, 3, 3);
            }
        }
    };

    const addData = (item) => {
        data.push(item);
        if (data.length > RETAIN_ELEMENTS) {
            data.splice(0, data.length - RETAIN_ELEMENTS);
        }
    };

    const clear = () => {
        data.splice(0, data.length);
    };

    return { draw, addData, clear };
}

function setup() {
    canvas = new Canvas('canvas');

    state.cartX = canvas.width / 2;

    charts.dtheta = createChart('dtheta', [1000, 500], ['white', 'yellow']);
    // charts.theta = createChart('theta', 100);
    charts.errorIntegral = createChart('error', 100);
    charts.vx = createChart('vx', 10, ['#0cf']);

    addUpdate(update);
}

function sq(x) {
    return x * x;
}

const poleFriction = 2;
const cartFriction = 0.02;

// Formulas taken from:
// https://sharpneat.sourceforge.io/research/cart-pole/cart-pole-equations.html
function computeXAccel(m, g, q, f, l, dq, dx, M) {
    const sinQ = Math.sin(q);
    const cosQ = Math.cos(q);
    const num = m * g * sinQ * cosQ - 7 / 3 * (f + m * l * sq(dq) * sinQ - cartFriction * dx) - poleFriction * dq * cosQ / l;
    const denom = m * sq(cosQ) - 7 / 3 * M;

    return num / denom;
}

function computeQAccel(l, g, q, ddx, dq, m) {
    return 3 / (7 * l) * (g * Math.sin(q) - ddx * Math.cos(q) - poleFriction * dq / (m * l));
}

const timestep = 0.1;

let round = 0;

function boundsCheck() {
    if (state.theta > Math.PI) {
        state.theta -= 2 * Math.PI;
    } else if (state.theta < -Math.PI) {
        state.theta += 2 * Math.PI;
    }

    if (state.cartX > canvas.width + dimns.cartWidth) {
        state.cartX -= canvas.width + dimns.cartWidth * 2;
    } else if (state.cartY < -dimns.cartWidth) {
        state.cartX += canvas.width + dimns.cartWidth * 2;
    }
}

function stepPhysics() {
    state.errorIntegral += state.theta * timestep;

    const forceScale = 50;

    const P = forceScale * state.theta;
    const I = forceScale / (50) * state.errorIntegral;
    const D = forceScale * userSettings.dampness * state.dtheta;

    const computedF = P + userSettings.enableErrorIntegral * I + D;

    const xAccel = computeXAccel(
        state.rodMass,
        state.gravity,
        state.theta,
        computedF,
        state.rodLength / 2,
        state.dtheta,
        state.cartVelocity,
        state.rodMass + state.cartMass,
    );
    const qAccel = computeQAccel(
        state.rodLength / 2,
        state.gravity,
        state.theta,
        xAccel,
        state.dtheta,
        state.rodMass,
    );

    state.cartVelocity += xAccel * timestep;
    state.dtheta += qAccel * timestep;
    state.cartX += state.cartVelocity * timestep;
    state.theta += state.dtheta * timestep;
}

function plotData() {
    charts.dtheta.addData([state.dtheta, state.theta]);
    charts.errorIntegral.addData(state.errorIntegral);
    charts.vx.addData(state.cartVelocity);

    drawCharts();
}

function update() {
    round += 1;
    boundsCheck();

    stepPhysics();

    if (round === 3) {
        round = 0;
        plotData();
    }

    draw();
}

function drawCharts() {
    for (const chart of Object.values(charts)) {
        chart.draw();
    }
}

function draw() {
    const trackHeight = canvas.height * dimns.trackRelativeY;
    canvas.color('black');
    canvas.background();
    canvas.color('white');
    canvas.fillRect(0, trackHeight, canvas.width, dimns.trackThickness);
    canvas.fillRect(state.cartX - dimns.cartWidth / 2, trackHeight - dimns.cartHeight / 2, dimns.cartWidth, dimns.cartHeight);
    canvas.lineWidth(2);
    const rodVector = new Vector(0, -state.rodLength);
    rodVector.rotate(state.theta);
    canvas.line(state.cartX, trackHeight, state.cartX + rodVector.x, trackHeight + rodVector.y);
}

addSetup(setup);
