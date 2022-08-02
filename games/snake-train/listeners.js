function setupMouseListeners(canvas, uiStateStore) {
    uiStateStore.mousePos = new Vector(canvas.width / 2, canvas.height / 2);

    function eventPosToCanvas(event) {
        const MUL = canvas.width / canvas.cnv.clientWidth;
        return new Vector(
            event.clientX - canvas.cnv.offsetLeft,
            event.clientY - canvas.cnv.offsetTop,
        ).mul(MUL);
    }

    document
        .addEventListener('mousemove', (event) => {
            uiStateStore.mousePos = eventPosToCanvas(event);
        });

    document.addEventListener('mousedown', () => {
        uiStateStore.pressed = true;
    });
    document.addEventListener('mouseup', () => {
        uiStateStore.pressed = false;
    });
    document.addEventListener('click', (event) => {
        // Do nothing for now
    });
}
