var canvas;
var vehicle;

var food;

var t;

function setup() {
    canvas = new Canvas('canvas');
    vehicle = new Vehicle(canvas.width/2, canvas.height/2);

    food = [];
    for (var i = 0; i < 20; i++) {
        food.push(new Vector(Math.random() * canvas.width,
                             Math.random() * canvas.height));
    }

    t = 0;
    addUpdate(update);
}

function update() {
    vehicle.boundary(canvas.width, canvas.height);
    vehicle.seekNearest(food, 0.2);
    vehicle.roam();
    vehicle.update();
    draw();
}

function draw() {
    canvas.color('black');
    canvas.background();
    canvas.color('green');
    for (var item of food) {
        canvas.fillArc(item.x, item.y, 3);
    }
    vehicle.draw(canvas);
}

addSetup(setup);
