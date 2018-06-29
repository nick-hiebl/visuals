var canvas;

var Route = function(n) {
    this.num = n;
    this.route = [];
    this.fitness = 100000;
    seen = [];
    for (var i = 0; i < n; i++) {
        this.route.push(i);
    }
    var i = n, t, r;
    while (0 !== i) {
        r = Math.floor(Math.random() * i);
        i--;

        t = this.route[i];
        this.route[i] = this.route[r];
        this.route[r] = t;
    }
    this.mutate = function() {
        if (Math.random() < 0.2) {
            let a = Math.floor(Math.random() * this.num);
            let b = Math.floor(Math.random() * this.num);
            let temp = this.route[b];
            this.route[b] = this.route[a];
            this.route[a] = temp;
        }

        if (Math.random() < 0.5) {
            let a = Math.floor(Math.random() * this.num);
            let b = Math.floor(Math.random() * this.num);

            var i = a;
            var t = this.route[b];

            while (i != b) {
                let temp = this.route[i];
                this.route[i] = t;
                t = temp;
                i = (i + 1) % this.num;
            }

            this.route[b] = t;
        }
    }

    this.reproduce = function(other) {
        new_route = [];
        for (var i = 0; i < this.num; i++) {
            if (Math.random() < 0.7) {
                new_route.push(this.route[i]);
            } else {
                new_route.push(-1);
            }
        }

        for (var i = 0; i < other.num; i++) {
            if (new_route.indexOf(other.route[i]) !== -1) {
                continue;
            } else {
                new_route[new_route.indexOf(-1)] = other.route[i];
            }
        }

        var child = new Route(this.num);
        child.route = new_route;

        return child;
    }

    this.calcFitness = function() {
        var total = 0;
        for (var i = 1; i < this.num; i++) {
            total += dist(points[this.route[i-1]], points[this.route[i]]);
        }
        total += dist(points[this.route[0]], points[this.route[this.num-1]]);
        this.fitness = total;
    }
}

function dist(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

var popsize = 500;
var population = [];

var num = 150;
var points = [];

function setup() {
    canvas = new Canvas('canvas');
    canvas.background();

    for (var i = 0; i < num; i++) {
        points.push({x: 20 + Math.random() * 360,
            y: 20 + Math.random() * 360});
    }

    console.log(points);

    for (var i = 0; i < popsize; i++) {
        population.push(new Route(num));
    }

    setupThat();
    addUpdate(update);
    setupApprox();
}

function randBias(num) {
    let x = Math.random();
    return Math.floor(x * num);
}

function update() {
    var newPop = [];

    for (var i = 0; i < num * 0.02; i++) {
        newPop.push(population[i]);
    }

    newPop.push(new Route(num));

    while (newPop.length < popsize) {
        let p1 = population[randBias(num)];
        let p2 = population[randBias(num)];

        let c = p1.reproduce(p2);
        c.mutate();

        newPop.push(c);
    }

    population = newPop;

    for (var i = 0; i < population.length; i++) {
        population[i].calcFitness();
    }
    population.sort(function(a, b) {
        return a.fitness - b.fitness;
    });

    canvas.color('black');
    canvas.background();
    canvas.color('white');
    for (var v of points) {
        canvas.fillArc(v.x, v.y, 4);
    }

    canvas.lineWidth(2);
    let best = population[0];

    let total = 0;
    for (var i = 0; i < num - 1; i++) {
        let c1 = points[best.route[i]];
        let c2 = points[best.route[i+1]];
        total += dist(c1, c2);

        canvas.line(c1.x, c1.y, c2.x, c2.y);
    }

    let c1 = points[best.route[0]];
    let c2 = points[best.route[num - 1]];
    total += dist(c1, c2);

    canvas.ctx.fillText(total.toLocaleString(), 5, 15);
}

addSetup(setup);
