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
		
		var numToModify = Math.floor(Math.random() * mutationRate * this.size);
		var numToSmooth = Math.floor(Math.random() * smoothRate * this.size);
		
		for (var i = 0; i < numToModify; i++) {
			var j = Math.floor(Math.random() * this.size);
			this.moves[j].x += (2 * Math.random() - 1) * mutationAmount;
			this.moves[j].y += (2 * Math.random() - 1) * mutationAmount;
			this.moves[j].limit(2);
		}
		for (var i = 0; i < numToSmooth; i++) {
			var j = Math.floor(Math.random() * (this.size - 2)) + 1;
			var v = this.moves[j-1].copy();
			v.add(this.moves[j+1]);
			v.limit(2);
			this.moves[j] = v;
		}
		
		var numToOverwrite = Math.floor(Math.random() * mutationRate/2);
		for (var i = 0; i < numToOverwrite; i++) {
			var j = Math.floor(Math.random() * this.size);
			this.moves[j] = Vector.rand(Math.random() * 1 + 1);
		}
    }
	
	this.clone = function() {
		var clone = new Agent(this.size);
		clone.moves = [];
		for (var v of this.moves) {
			clone.moves.push(v.copy());
		}
		return clone;
	}

    this.child = function() {
        var child = this.clone();
        child.mutate();

        return child;
    }
	
	this.crossover = function(other) {
		var child = other.clone();
		
		// Choose section to overwrite
		var left = Math.floor(Math.random() * this.size);
		var right = Math.floor(Math.random() * this.size);
		
		if (left > right) {
			right += this.size;
		}
		// Overwrite that range
		for (var i = left; i < right; i++) {
			// Wrap to actual range
			let t = i % this.size;
			child.moves[t] = this.moves[t].copy();
		}
		
		return child;
	}
}
