var Agent = function(size) {
    this.size = size;
    this.moves = [];
    for (var i = 0; i < size; i++) {
        this.moves.push(Vector.rand(Math.random() * 1 + 1));
    }
    this.rating = -1;

    this.getStep = function(i) {
        return this.moves[i];
    }

    this.mutate = function() {
        var mutationRate = 0.1;
        var mutationAmount = 1;
        var smoothRate = 0.1;
        for (var i = 0; i < this.size; i++) {
            if (Math.random() < mutationRate) {
                this.moves[i].x += (2 * Math.random() - 1) * mutationAmount;
                this.moves[i].y += (2 * Math.random() - 1) * mutationAmount;
                this.moves[i].limit(2);
            } else if (i > 0 && i < this.size - 1 && Math.random() < smoothRate) {
                var v = this.moves[i-1];
                v.add(this.moves[i+1]);
                v.limit(2);
                this.moves[i] = v;
            }
        }
    }

    this.child = function() {
        var child = new Agent(this.size);
        child.moves = [];
        for (var v of this.moves) {
            child.moves.push(v.copy());
        }
        child.mutate();

        return child;
    }
}
