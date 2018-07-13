function Vehicle(x, y) {
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.position = new Vector(x, y);

    this.maxSpeed = 8;
    this.maxForce = 0.2;

    this.update = function() {
        this.acceleration.limit(this.maxForce);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        this.acceleration.x = 0;
        this.acceleration.y = 0;
    };

    this.draw = function(canvas) {
        canvas.color('white');
        canvas.fillArc(this.position.x, this.position.y, 5);
        canvas.lineWidth(2);
        canvas.line(this.position.x, this.position.y,
            this.position.x + 3 * this.velocity.x,
            this.position.y + 3 * this.velocity.y);
    };

    this.applyDesired = function(desired, weight) {
        var steering = desired;
        steering.sub(this.velocity);

        if (weight != undefined) {
            steering.mul(weight);
        }

        this.acceleration.add(steering);
    }

    this.seek = function(target, weight) {
        if (target == null) return;
        var desired = target.copy();
        desired.sub(this.position);
        desired.magnitude = this.maxSpeed;

        this.applyDesired(desired, weight);
    };

    this.seekNearest = function(targets, weight) {
        var dist = Infinity;
        var best = null;
        for (var target of targets) {
            if (this.position.dist(target) < dist) {
                dist = this.position.dist(target);
                best = target;
            }
        }
        this.seek(best, weight);
    }

    this.flee = function(target, weight) {
        var desired = this.position.copy();
        desired.sub(target);
        desired.magnitude = this.maxSpeed;

        this.applyDesired(desired, weight);
    }

    this.roam = function(weight) {
        var desired = this.velocity.copy();
        if (desired.magnitude == 0) {
            desired = new Vector(this.maxSpeed, 0);
        } else {
            desired.magnitude = this.maxSpeed;
        }
        desired.add(Vector.randUnit());

        this.applyDesired(desired, weight);
    };

    this.boundary = function(width, height, weight) {
        var desired = new Vector(0, 0);
        if (this.position.x < 0) {
            desired.add(new Vector(this.maxSpeed, 0));
        } else if (this.position.x > width) {
            desired.add(new Vector(-this.maxSpeed, 0));
        }
        if (this.position.y < 0) {
            desired.add(new Vector(0, this.maxSpeed));
        } else if (this.position.y > height) {
            desired.add(new Vector(0, -this.maxSpeed));
        }

        this.applyDesired(desired, weight);
    };
}
