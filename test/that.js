var thatCanvas;

function setupThat() {
    thatCanvas = new Canvas('that');
}

function updateThat() {
    thatCanvas.fillRect(Math.random() * 100, Math.random() * 100, 10, 10);
}

addSetup(setupThat);
addUpdate(updateThat);
