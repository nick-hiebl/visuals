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

  *iterate() {
    for (const segment of this.head.iterate()) {
      yield segment;
    }
  }
}

const COLORS = {
  shoot: '#f08',
  blank: 'gray',
};

const SEGMENT_CACHE = {};

function baseSegmentCache(baseColor, itemColor) {
  const cacheKey = `${baseColor}-${itemColor}`;

  if (cacheKey in SEGMENT_CACHE) {
    return SEGMENT_CACHE[cacheKey];
  }

  const newCanv = document.createElement('canvas');
  const r = Math.ceil(BAUBLE_WIDTH * 1.2);
  newCanv.width = r * 2;
  newCanv.height = r * 2;
  const ctx = newCanv.getContext('2d');

  function ellipse(radius) {
    ctx.beginPath();
    ctx.ellipse(r, r, radius, radius, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  ctx.fillStyle = 'black';
  ellipse(BAUBLE_WIDTH * 1.2);
  ctx.fillStyle = baseColor;
  ellipse(BAUBLE_WIDTH);

  if (itemColor) {
    ctx.fillStyle = 'black';
    ellipse(BAUBLE_WIDTH * 0.8);
    ctx.fillStyle = itemColor;
    ellipse(BAUBLE_WIDTH * 0.5);
  }

  SEGMENT_CACHE[cacheKey] = newCanv;

  return newCanv;
}

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

  *iterate() {
    yield this;

    if (this.child) {
      for (const segment of this.child.iterate()) {
        yield segment;
      }
    }
  }

  // DO NOT OVERRIDE
  doAction(battleState) {
    if (!this.item) {
      return;
    }

    this.action(battleState, this, this.item);
  }

  followAll(rigidity, bend, fallOff) {
    this.follow(rigidity, bend, fallOff);

    const nextRigidity = rigidity - fallOff;
    const childRigidity = nextRigidity <= 0 ? undefined : nextRigidity;
    this.allChildren((child) => child.followAll(childRigidity, 0, fallOff || 1));
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
    const img = baseSegmentCache(COLORS.shoot, this.item ? this.item.color : '');
    canvas.ctx.drawImage(img, (this.position.x - img.width / 2), this.position.y - img.height / 2);
  }

  drawAll(canvas) {
    this.allChildren((child) => child.drawAll(canvas));

    this.draw(canvas);
  }

  // Override for different follow styles
  follow(rigidity, bend, fallOff) {
    // Slight momentum
    this.position.add(this.dir.copy().mul(0.4));

    const realRigidity = rigidity || 0;

    if (realRigidity) {
      const t = realRigidity * realRigidity;
      const followDir = createFollowDir(this, this.parent);
      const bendDir = createBendDir(this, this.parent, bend);
      const combinedDir = bendDir.mul(t).add(followDir.mul(1 - t));

      this.dir.heading = combinedDir.heading;
    } else {
      // Point to parent
      this.dir.heading = Vector.diff(this.parent.position, this.position).heading;
    }

    // Back up from parent
    this.position = Vector.diff(this.parent.position, this.dir);
  }
}

function createFollowDir(segment, parentSegment) {
  // Point to parent
  const dist = Vector.diff(parentSegment.position, segment.position);

  const newDir = segment.dir.copy();
  newDir.heading = dist.heading;

  return newDir;
}

function createBendDir(segment, parentSegment, bend) {
  const newDir = segment.dir.copy();
  newDir.heading = parentSegment.dir.heading + bend;
  return newDir;
}

class BendSegment extends Segment {
  constructor(length, parent, action, bend = choice([-Math.PI / 8, -Math.PI / 4, Math.PI / 4, Math.PI / 8])) {
    super(length, parent, action);

    // Create dir and position based off parent position
    this.dir = new Vector(length, 0);
    this.dir.heading = parent.dir.heading + bend;
    this.position = Vector.diff(parent.position, this.dir);

    this.bend = bend;
  }

  follow() {
    // Point to correct angle
    this.dir = createBendDir(this, this.parent, this.bend);
    // this.dir.heading = this.parent.dir.heading + this.bend;

    // Back up from parent
    this.position = Vector.diff(this.parent.position, this.dir);
  }
}

class ForkSegment extends Segment {
  constructor(length, parent, action) {
    super(length, parent, action);

    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }

  allChildren(callback) {
    for (const child of this.children) {
      callback(child);
    }
  }

  *iterate() {
    yield this;

    for (const child of this.children) {
      for (const segment of child.iterate()) {
        yield segment;
      }
    }
  }

  followAll(rigidity, bend, fallOff) {
    this.follow(rigidity, bend, fallOff);

    let index = 1;
    this.allChildren((child) => {
      const bend = index / (this.children.length + 1) * Math.PI - Math.PI / 2;
      child.followAll(1, bend, 0.1);

      index++;
    });
  }

  // Override for multi-child-havers
  eatToChild(battleState, item) {
    const chosenChild = choice(this.children);
    for (const child of this.children) {
      if (child === chosenChild) {
        child.eatItem(battleState, item);
      } else {
        child.eatItem(battleState, undefined);
      }
    }
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

function makeLinearSnake(headPosition) {
  const head = new HeadSegment(headPosition, action);
  // let tail = new Segment(SEGMENT_LENGTH, head);
  // head.addChild(tail);
  let tail = head;

  for (let i = 0; i < 20; i++) {
    const SegType = choice([Segment, Segment, Segment, Segment, BendSegment]);
    const newSegment = new SegType(SEGMENT_LENGTH, tail, action);
    tail.addChild(newSegment);
    tail = newSegment;
  }

  return new Snake(head);
}

function appendLinearSection(head, n) {
  let tail = head;

  for (let i = 0; i < n; i++) {
    const newSegment = new Segment(SEGMENT_LENGTH, tail, action);
    tail.addChild(newSegment);
    tail = newSegment;
  }

  return tail;
}

function addFork(head) {
  const fork = new ForkSegment(SEGMENT_LENGTH, head, action);
  head.addChild(fork);
  return fork;
}

function makeRandomForks(head, n) {
  if (n <= 0) {
    return;
  }
  const l = Math.min(n, Math.floor(Math.random() * 8 + 3));
  let tail = appendLinearSection(head, l);

  if (Math.random() < (n - l) / 20 / 1.3) {
    const fork = addFork(tail);

    const paths = Math.floor(Math.random() * 4 + 2);

    for (let i = 0; i < paths; i++) {
      makeRandomForks(fork, n - l);
    }
  }
}

function makeForkSnake2(headPosition) {
  const head = new HeadSegment(headPosition, action);
  makeRandomForks(head, 20);

  return new Snake(head);
}

function makeForkSnake(headPosition) {
  const head = new HeadSegment(headPosition, action);
  let tail = appendLinearSection(head, 3);

  const fork = addFork(tail);
  appendLinearSection(fork, 4);
  const lInner = appendLinearSection(fork, 8);
  appendLinearSection(fork, 5);
  appendLinearSection(fork, 4);

  lInnerFork = addFork(lInner);
  appendLinearSection(lInnerFork, 3);
  appendLinearSection(lInnerFork, 2);

  return new Snake(head);
}

function makeSnake(headPosition) {
  return makeForkSnake2(headPosition);
}
