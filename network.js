function signedRand() {
    return 2 * Math.random() - 1;
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

var Perceptron = function(inputs) {
    this.weights = [];
    for (var i = 0; i < inputs; i++) {
        this.weights.push(signedRand());
    }
    this.bias = signedRand();

    this.result = 0;

    this.calculate = function(input) {
        var total = this.bias;
        for (var i = 0; i < input.length; i++) {
            total += input[i] * this.weights[i];
        }
        this.result = sigmoid(total);
        return this.result;
    }
}

var Network = function(inputs, outputs) {
    this.inputs = [];
    for (var i = 0; i < inputs; i++) {
        this.inputs.push(new Perceptron(1));
    }
    this.outputs = [];
    for (var i = 0; i < outputs; i++) {
        this.outputs.push(new Perceptron(inputs));
    }

    this.process = function(inputs) {
        var values = [];
        for (var i = 0; i < inputs.length; i++) {
            values[i] = this.inputs[i].calculate([inputs[i]]);
        }
        var results = [];
        for (var i = 0; i < this.outputs.length; i++) {
            results[i] = this.outputs[i].calculate(values);
        }

        return results;
    }
}
