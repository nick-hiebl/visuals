var canvas;

function within(w = canvas.width, h = canvas.height) {
  return ({ x, y }) => 0 <= x && x <= w && 0 <= y && y <= h;
}

function rand() {
  return Math.random();
}

function centeredData(center, n = 100) {
  const data = [];

  for (let i = 0; i < n; i++) {
    const r = Math.sqrt(rand()) * 90;
    const p = Vector.rand(r);
    data.push(Vector.sum(center, p));
  }

  return data.filter(within());
}

function randScreenPoint() {
  return new Vector(rand() * canvas.width, rand() * canvas.height);
}

function separatedCenters(n = 2) {
  const centers = [randScreenPoint()];

  let tolerance = 120;

  for (let i = 1; i < n; i++) {
    const nextCenter = randScreenPoint();

    if (centers.some(c => c.dist(nextCenter) < tolerance)) {
      tolerance *= 0.99;
      i--;
      continue;
    }

    centers.push(nextCenter);
  }

  return centers;
}

function exampleDataSet(k = 3) {
  const centers = separatedCenters(k);

  const points = centers.map((p) => centeredData(p)).flat();
  shuffle(points);

  return points;
}

let data;
let means;
let groups;

function setup() {
  canvas = new Canvas("canvas");

  data = exampleDataSet(7);
  means = initialMeans(data, 7);
  groups = partition(means, data);
  draw();

  addUpdate(loop);
}

let t = 0;

function loop(elapsed) {
  t += elapsed;

  if (t >= 300) {
    t = 0;
    update();
  }

  draw();
}

function update() {
  means = nextMeans(groups);
  groups = partition(means, data);
}

function nextMeans(groups) {
  const means = [];

  for (const group of groups) {
    if (!group.length) {
      continue;
    }

    let p = new Vector(0, 0);

    for (const point of group) {
      p.add(point);
    }

    p.mul(1 / group.length);

    means.push(p);
  }

  return means;
}

function partition(means, data) {
  const groups = means.map(() => []);
  for (const point of data) {
    let bestIndex = 0;
    let bestDist = canvas.width * canvas.width * 4;

    means.forEach((mean, index) => {
      const dist = point.dist(mean);

      if (dist < bestDist) {
        bestIndex = index;
        bestDist = dist;
      }
    });

    groups[bestIndex].push(point);
  }

  return groups;
}

function initialMeans(data, k = 3) {
  return data.slice(0, k);
}

const COLORS = [
  'hsl(0, 100%, 70%)',
  'hsl(80, 100%, 70%)',
  'hsl(160, 100%, 70%)',
  'hsl(240, 100%, 70%)',
  'hsl(320, 100%, 70%)',
  'hsl(40, 100%, 70%)',
  'hsl(120, 100%, 70%)',
  'hsl(200, 100%, 70%)',
];

function draw() {
  console.log('drawing');
  canvas.color('black');
  canvas.background();

  canvas.color('white');

  groups.forEach((group, groupIndex) => {
    canvas.color(COLORS[groupIndex]);

    group.forEach((point) => {
      canvas.fillRect(point.x, point.y, 3, 3);
    });

    const mean = means[groupIndex];

    canvas.fillArc(mean.x, mean.y, 5, 5);
  });
}

addSetup(setup);
