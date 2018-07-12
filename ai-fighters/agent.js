var Zone = function() {
    this.angle = Math.random() * Math.PI * 2;
    this.range = Math.random() + 0.05;
    this.radius = Math.random() * 350 + 100;
    this.active = false;

    this.draw = function(canvas, parent) {
        canvas.lineWidth(1);
        canvas.color(this.active ? 'blue' : 'green');

        var v = new Vector(this.radius, 0);
        v.heading = parent.heading + this.angle - this.range/2;
        v.add(parent.position);
        canvas.line(parent.position.x, parent.position.y, v.x, v.y);

        var v = new Vector(this.radius, 0);
        v.heading = parent.heading + this.angle + this.range/2;
        v.add(parent.position);
        canvas.line(parent.position.x, parent.position.y, v.x, v.y);

        canvas.strokeArc(parent.position.x, parent.position.y,
            this.radius, this.radius, 0,
            parent.heading + this.angle - this.range/2,
            parent.heading + this.angle + this.range/2);
    };

    this.collides = function(parent, target) {
        if (parent.position.dist(target) > this.radius) {
            return this.active = false;
        }
        var rel = target.copy();
        rel.sub(parent.position);
        rel.heading -= parent.heading;

        var h = rel.heading;
        if (Math.abs(h - this.angle) < this.range/2) {
            return this.active = true;
        }
        h += 2 * Math.PI;
        if (Math.abs(h - this.angle) < this.range/2) {
            return this.active = true;
        }
        h -= 4 * Math.PI;
        if (Math.abs(h - this.angle) < this.range/2) {
            return this.active = true;
        }
        return this.active = false;
    };
}

var Agent = function(x, y) {
    this.position = new Vector(x, y);
    this.heading = 0;
    this.zones = [];
    for (var i = 0; i < 8; i++) {
        this.zones.push(new Zone());
    }

    this.draw = function(canvas, color) {
        canvas.lineWidth(0.3);
        canvas.color('green');
        for (var zone of this.zones) {
            zone.draw(canvas, this);
        }

        canvas.color(color);
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

    this.shoot = function(target) {
        var rel = target.copy();
        rel.sub(this.position);
        rel.heading -= this.heading;

        if (Math.abs(rel.y) < 5) {
            return true;
        }
        return false;
    }

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

    this.getCollision = function(target) {
        var out = [];
        for (var zone of this.zones) {
            out.push(zone.collides(this, target.position));
        }
        return out;
    };
}
