var Agent = function(size) {
    this.size = size;
    this.moves = [];
    for (var i = 0; i < size; i++) {
        this.moves.push(Vector.rand(3));
    }
    this.rating = -1;

    this.getStep = function(i) {
        return this.moves[i];
    }

    this.mutate = function() {
        var mutationRate = 0.01;
        var mutationAmount = 0.2;
        for (var i = 0; i < this.size; i++) {
            if (Math.random() < mutationRate) {
                this.moves[i].x += (2 * Math.random() - 1) * mutationAmount;
                this.moves[i].y += (2 * Math.random() - 1) * mutationAmount;
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
