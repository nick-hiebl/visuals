var Agent = function(x, y) {
    this.position = new Vector(x, y);
    this.heading = 0;
    this.zones = [{
        a: 0,
        r: 1,
        l: Math.random() * 50 + 100
    }, {
        a: Math.random() * Math.PI * 2,
        r: Math.random(),
        l: Math.random() * 50 + 100
    }, {
        a: Math.random() * Math.PI * 2,
        r: Math.random(),
        l: Math.random() * 50 + 100
    }];

    this.draw = function(canvas) {
        canvas.lineWidth(1);
        canvas.color('green');
        for (var zone of this.zones) {
            var zone_r = zone.l;
            v = new Vector(zone_r, 0);
            v.heading = this.heading + zone.a - zone.r/2;
            v.add(this.position);
            canvas.line(this.position.x, this.position.y, v.x, v.y);

            v = new Vector(zone_r, 0);
            v.heading = this.heading + zone.a + zone.r/2;
            v.add(this.position);
            canvas.line(this.position.x, this.position.y, v.x, v.y);

            canvas.strokeArc(this.position.x, this.position.y,
                zone_r, zone_r, 0, this.heading + zone.a - zone.r/2, this.heading + zone.a + zone.r/2);
        }

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
