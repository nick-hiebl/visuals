var Agent = function(x, y) {
    this.position = new Vector(x, y);
    this.heading = 0;

    this.draw = function(canvas) {
        canvas.color('red');
        canvas.fillArc(this.position.x, this.position.y, 10);
        var v = new Vector(20, 0);
        v.heading = this.heading;
        v.add(this.position);
        canvas.lineWidth(5);
        canvas.line(this.position.x, this.position.y, v.x, v.y);
    };

    this.turn = function(rate) {
        this.heading += rate;
    };

    this.forward = function(rate) {
        var v = new Vector(rate, 0);
        v.heading = this.heading;
        this.position.add(v);
    };

    this.strafe = function(rate) {
        var v = new Vector(0, rate);
        v.heading += this.heading;
        this.position.add(v);
    };

    this.boundary = function(width, height, rate) {
        var desired = new Vector(0, 0);
        var d = 50;
        if (this.position.x < d) {
            desired.add(new Vector(rate, 0));
        } else if (this.position.x > width - d) {
            desired.add(new Vector(-rate, 0));
        }
        if (this.position.y < d) {
            desired.add(new Vector(0, rate));
        } else if (this.position.y > height - d) {
            desired.add(new Vector(0, -rate));
        }

        this.position.add(desired);
    };

    this.update = function() {

    };
}
