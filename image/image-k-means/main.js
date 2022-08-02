var pixCanvas;
var imgCanvas;

function within(w = pixCanvas.width, h = pixCanvas.height) {
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
  return new Vector(rand() * pixCanvas.width, rand() * pixCanvas.height);
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

function dataSetFromImage(rawPixels) {
  const points = [];

  for (let i = 0; i < rawPixels.length; i += 4) {
    points.push(new Vector(
      rawPixels[i + 1] * pixCanvas.width / 255,
      rawPixels[i + 0] * pixCanvas.height / 255,
    ));
  }

  shuffle(points);

  return points;
}

let data;
let means;
let groups;

function setup() {
  pixCanvas = new Canvas("pixCanvas");
  imgCanvas = new Canvas("imgCanvas");

  imgCanvas.resize(image.width, image.height);
  imgCanvas.ctx.drawImage(image, 0, 0);
  const imageData = imgCanvas.ctx.getImageData(0, 0, imgCanvas.width, imgCanvas.height).data;

  data = dataSetFromImage(imageData);
  means = initialMeans(data, 6);
  groups = partition(means, data);

  draw();

  addUpdate(loop);
}

let t = 10000000;
let k = 0;

function loop(elapsed) {
  t += elapsed;

  if (t >= 1000) {
    t = 0;
    k += 1;

    if (k < 40) {
      update();
      draw();
    }
  }
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

function findBestMean(point, means) {
  let bestIndex = 0;
  let bestDist = pixCanvas.width * pixCanvas.width * 4;

  means.forEach((mean, index) => {
    const dist = point.dist(mean);

    if (dist < bestDist) {
      bestIndex = index;
      bestDist = dist;
    }
  });

  return bestIndex;
}

function partition(means, data) {
  const groups = means.map(() => []);
  for (const point of data) {
    const bestIndex = findBestMean(point, means);
    groups[bestIndex].push(point);
  }

  return groups;
}

function initialMeans(data, k = 3) {
  return data.slice(0, k);
}

const COLORS = [
  'hsl(0, 100%, 70%)',
  'hsl(20, 100%, 70%)',
  'hsl(40, 100%, 70%)',
  'hsl(60, 100%, 70%)',
  'hsl(80, 100%, 70%)',
  'hsl(100, 100%, 70%)',
  'hsl(120, 100%, 70%)',
  'hsl(140, 100%, 70%)',
  'hsl(160, 100%, 70%)',
  'hsl(180, 100%, 70%)',
  'hsl(200, 100%, 70%)',
  'hsl(220, 100%, 70%)',
  'hsl(240, 100%, 70%)',
  'hsl(260, 100%, 70%)',
  'hsl(280, 100%, 70%)',
  'hsl(300, 100%, 70%)',
];

const COL2 = [
  [203, 67, 51],
  [136, 78, 160],
  [36, 113, 163],
  [46, 134, 193],
  [23, 165, 137],
  [40, 180, 99],
  [241, 196, 15],
  [211, 84, 0],
  [52, 73, 94],
];

const image = new Image();
image.src = 'corgi-05.webp';
// image.crossOrigin = 'anonymous';

function draw() {
  console.log('drawing');
  pixCanvas.color('black');
  pixCanvas.background();

  imgCanvas.ctx.drawImage(image, 0, 0);

  groups.forEach((group, groupIndex) => {
    pixCanvas.color(COLORS[groupIndex]);

    group.forEach((point) => {
      pixCanvas.fillRect(point.x, point.y, 3, 3);
    });

    const mean = means[groupIndex];

    pixCanvas.color('black');
    pixCanvas.fillArc(mean.x, mean.y, 7, 7);
    pixCanvas.color(COLORS[groupIndex]);
    pixCanvas.fillArc(mean.x, mean.y, 5, 5);
  });

  drawImageWithMeans(means);
}

function drawImageWithMeans(means) {
  imgCanvas.ctx.drawImage(image, 0, 0);
  const imageData = imgCanvas.ctx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const p = new Vector(
      imageData.data[i + 1] * pixCanvas.width / 255,
      imageData.data[i + 0] * pixCanvas.height / 255,
    );

    const bestMean = means[findBestMean(p, means)];

    imageData.data[i + 2] = bestMean.x / pixCanvas.width * 255;
    imageData.data[i + 1] = bestMean.x / pixCanvas.width * 255;
    imageData.data[i + 0] = bestMean.y / pixCanvas.width * 255;

    // const [r,g,b] = COL2[findBestMean(p, means)];
    // imageData.data[i + 2] = b;
    // imageData.data[i + 1] = g;
    // imageData.data[i + 0] = r;
  }

  imgCanvas.ctx.putImageData(imageData, 0, 0);
}

addSetup(setup);
