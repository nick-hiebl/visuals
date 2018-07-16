var Population = function(size, len) {
    this.size = size;
    this.generations = 0;
    this.pop = [];
    this.len = len;

    for (var i = 0; i < size; i++) {
        this.pop.push(new Agent(len));
    }

    this.update = function(states, n) {
        for (var i = 0; i < this.size; i++) {
            if (states[i].alive)
                states[i].pos.add(this.pop[i].getStep(n));
        }
    }

    this.rate = function(i, v) {
        this.pop[i].rating = v;
    }

    this.nextGeneration = function() {
        this.generations++;
        this.pop.sort(function(a, b) {
            return -(a.rating - b.rating);
        });
        var newPop = [];
        newPop.push(this.pop[0]);
        while (newPop.length < this.size) {
            var r = Math.random() * Math.random();
            var m = Math.floor(r * this.size);
            newPop.push(this.pop[m].child());
        }
        this.pop = newPop;
    }
}
