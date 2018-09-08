var canvas;
var items = [];

var index;
var progress;

var W;
var N = 300;

function swap(i, j) {
    let x = items[i];
    items[i] = items[j];
    items[j] = x;
}

function update() {

    for (var i = 0; i < 10; i++) {
        if (items[index].value < items[index+1].value) {
            swap(index, index+1);
        }
        index++;
        if (index > N - progress - 1) {
            progress += 1;
            index = 0;
        }
    }

    for (var i = 0; i < N; i++) {
        canvas.color(items[i].color);
        canvas.fillRect(i*W, 0, W, canvas.height);
    }
}

function setup() {
    canvas = new Canvas('canvas');
    canvas.color('black');
    canvas.background();

    for (var i = 0; i < N; i++) {
        items.push({
            value: i,
            color: 'hsl(' + Math.floor(i/N * 360) + ', 80%, 40%)'
        });
    }

    W = canvas.width / N;

    for (var i = N-1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        swap(i, j);
    }

    index = 0;
    progress = 1;

}

addUpdate(update);
addSetup(setup);
