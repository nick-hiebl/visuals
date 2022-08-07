class Snake {
  constructor(head) {
    this.head = head;
  }

  move(mousePos, pressed, delta) {
    this.head.followAll(mousePos, pressed, delta);
  }

  eatItem(battleState, item) {
    this.head.eatItem(battleState, item);
  }

  draw(canvas) {
    this.head.drawAll(canvas);
  }
}

const COLORS = {
  shoot: '#f08',
  blank: 'gray',
};

class Segment {
  /**
   * We guarantee:
   * - A position
   * - A dir (that should only be meaningfully used for its heading)
   * - An item property
   * - A doAction
   **/
  constructor(length, parent, action = () => {}) {
    // Create dir and position from parent position
    this.dir = new Vector(length, 0);
    this.dir.heading = parent.dir.heading;
    this.position = Vector.diff(parent.position, this.dir);

    this.parent = parent;
    this.action = action;
    
    this.child = undefined;
    this.item = undefined;
  }

  // Override for multi-child-havers
  addChild(child) {
    this.child = child;
  }

  // Override for multi-child-havers
  allChildren(callback) {
    if (this.child) {
      callback(this.child);
    }
  }

  // DO NOT OVERRIDE
  doAction(battleState) {
    if (!this.item) {
      return;
    }

    this.action(battleState, this, this.item);
  } 

  // Override for different follow styles
  follow() {
    // Slight momentum
    this.position.add(this.dir.copy().mul(0.4));

    // Point to parent
    this.dir.heading = Vector.diff(this.parent.position, this.position).heading;

    // Back up from parent
    this.position = Vector.diff(this.parent.position, this.dir);
  }

  followAll() {
    this.follow();

    this.allChildren((child) => child.followAll());
  }

  // Override for multi-child-havers
  eatToChild(battleState, item) {
    if (this.child) {
      this.child.eatItem(battleState, item);
    }
  }

  eatItem(battleState, item) {
    const oldItem = this.item;

    this.item = item;
    this.doAction(battleState);

    this.eatToChild(battleState, oldItem);
  }

  // Override for different appearances
  draw(canvas) {
    canvas.color('black');
    canvas.fillArc(this.position.x, this.position.y, BAUBLE_WIDTH * 1.2);
    canvas.color(COLORS.shoot);
    canvas.fillArc(this.position.x, this.position.y, BAUBLE_WIDTH);

    if (this.item) {
      canvas.color('black');
      canvas.fillArc(this.position.x, this.position.y, BAUBLE_WIDTH * 0.8);
      canvas.color(this.item.color);
      canvas.fillArc(this.position.x, this.position.y, BAUBLE_WIDTH * 0.5);
  }
  }

  drawAll(canvas) {
    this.allChildren((child) => child.drawAll(canvas));

    this.draw(canvas);
  }
}

class BendSegment extends Segment {
  constructor(length, parent, action, bend = choice([-Math.PI / 2, -Math.PI / 4, Math.PI / 4, Math.PI / 2])) {
    super(length, parent, action);

    // Create dir and position based off parent position
    this.dir = new Vector(length, 0);
    this.dir.heading = parent.dir.heading + bend;
    this.position = Vector.diff(parent.position, this.dir);

    this.bend = bend;
  }

  follow() {
    // Point to correct angle
    this.dir.heading = this.parent.dir.heading + this.bend;

    // Back up from parent
    this.position = Vector.diff(this.parent.position, this.dir);
  }
}

class HeadSegment extends Segment {
  constructor(position, action) {
    super(1, { position: new Vector(0, 0), dir: new Vector(0, 0) }, action);
    this.position = position;
    this.action = action;
    this.dir = new Vector(1, 0);
    
    this.child = undefined;
    this.item = undefined;
  }

  follow(mousePos, pressed, delta) {
    // Calculate constants
    const speed = (pressed ? FAST_VEL : VEL) * delta;
    const turnRate = STEER_RATE * delta * speed;

    // Get the direction to the mouse in the frame of reference of the head
    const headToMouse = Vector.diff(mousePos, this.position);
    headToMouse.heading -= this.dir.heading;
    const relativeDirToMouse = headToMouse.heading;

    // Clamp the turn-able amount and add a slight amount of clock-wise jitter
    this.dir.heading += clamp(relativeDirToMouse, -turnRate, turnRate) + Math.random() * 0.001 - 0.0005;
    // console.log(delta);

    // Move position based on velocity
    this.position.add(this.dir.copy().mul(speed));
  }

  followAll(mousePos, pressed, delta) {
    this.follow(mousePos, pressed, delta);

    this.allChildren((child) => child.followAll());
  }

  draw(canvas) {
    super.draw(canvas);
    // canvas.line(this.position.x, this.position.y, this.position.x + this.dir.x * 20, this.position.y + this.dir.y * 20);
  }
}

function action(battleState, segment, item) {
  if (!item) {
    return;
  }

  switch (item.itemType) {
    case 0: // RED
      const targetedEnemy = closestEnemy(battleState, segment.position);

      if (!targetedEnemy) {
        return;
      }

      const vel = Vector.diff(targetedEnemy.pos, segment.position);
      vel.magnitude = PROJECTILE_SPEED;
      battleState.projectiles.push({
        pos: segment.position.copy(),
        vel,
      });
      return;
    default:
      return;
  }
}

function makeSnake(headPosition) {
  const head = new HeadSegment(headPosition, action);
  // let tail = new Segment(SEGMENT_LENGTH, head);
  // head.addChild(tail);
  let tail = head;

  for (let i = 0; i < 20; i++) {
    const SegType = choice([Segment, Segment, Segment, Segment, BendSegment]);
    const newSegment = new Segment(SEGMENT_LENGTH, tail, action);
    tail.addChild(newSegment);
    tail = newSegment;
  }

  return new Snake(head);
}
