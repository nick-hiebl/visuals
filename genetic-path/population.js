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
            states[i].pos.add(this.pop[i].getStep(n));
        }
    }
}
