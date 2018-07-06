function sqr(x) {
    return x * x;
}

function map(x, a, b, c, d) {
    return (x - a) * (d - c) / (b - a) + c
}

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static unit() {
        return new Vector(1, 0);
    }

    static randUnit() {
        return new Vector(1, 0).rotate(Math.random() * 2 * Math.PI);
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    mul(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    mag() {
        return Math.pow(sqr(this.x) + sqr(this.y), 0.5);
    }

    normalise(n = 1) {
        var mag = this.magnitude;
        mag /= n;

        if (mag != 0) {
            this.x /= mag;
            this.y /= mag;
        }
        return this;
    }

    get magnitude() {
        return Math.sqrt(sqr(this.x) + sqr(this.y));
    }

    set magnitude(n) {
        this.normalise(n);
        return this.magnitude;
    }

    rotate(theta) {
        var x = this.x;
        var y = this.y;
        this.x = x * Math.cos(theta) - y * Math.sin(theta);
        this.y = x * Math.sin(theta) + y * Math.cos(theta);
        return this;
    }

    get heading() {
        return Math.atan2(this.y, this.x);
    }

    set heading(target) {
        var h = this.heading;
        this.rotate(target - h);
        return this.heading;
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    dist(other) {
        var x = this.x - other.x;
        var y = this.y - other.y;
        return Math.sqrt(x * x + y * y);
    }

    static dist(a, b) {
        return a.dist(b);
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}
