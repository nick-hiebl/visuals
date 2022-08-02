let n = 0.16312498;

function randInt(max) {
  return Math.floor(Math.random() * max)
}

function randSign() {
  return randInt(3) - 1
}

function line(ctx, x1, y1, x2, y2, scale) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.arc(x1, y1, scale / 4, 0, 2 * Math.PI)
  ctx.arc(x2, y2, scale / 4, 0, 2 * Math.PI)
  ctx.fill()
}

function dot(ctx, x, y, scale) {
  ctx.beginPath()
  ctx.arc(x, y, scale / 3, 0, 2 * Math.PI)
  ctx.fill()
}

function randomLine(ctx, scale, tiles) {
  const startX = randInt(tiles) * scale
  const startY = randInt(tiles) * scale

  const endX = randInt(tiles) * scale
  const endY = randInt(tiles) * scale

  line(ctx, startX, startY, endX, endY, scale)
}

function outside(x, y, tiles) {
  return x < 0 || x >= tiles || y < 0 || y >= tiles
}

// function square(x) {
//   return x * x
// }

// function outside(x, y, tiles) {
//   return Math.pow(square(x - tiles / 2) + square(y - tiles / 2), 0.5) > tiles / 2
// }

function drawLine(ctx, feature, tiles, scale) {
  const { x1, y1, x2, y2 } = feature

  if (outside(x1, y1, tiles) || outside(x2, y2, tiles)) return

  line(ctx, x1 * scale, y1 * scale, x2 * scale, y2 * scale, scale)
}

function drawDot(ctx, feature, tiles, scale) {
  const { x, y } = feature

  if (outside(x, y, tiles)) return

  dot(ctx, x * scale, y * scale, scale)
}

function drawFeatures(ctx, features, tiles, scale) {
  features.forEach(feature => {
    if (feature.name === 'line') {
      drawLine(ctx, feature, tiles, scale)
    } else {
      drawDot(ctx, feature, tiles, scale)
    }
  })
}

function cw(dx, dy) {
  return {
    x: Math.round(0.7 * dx - 0.7 * dy),
    y: Math.round(0.7 * dx + 0.7 * dy),
  }
}

function ccw(dx, dy) {
  return {
    x: Math.round(0.7 * dx + 0.7 * dy),
    y: Math.round(-0.7 * dx + 0.7 * dy),
  }
}

function oneRot(dx, dy) {
  if (randInt(2)) {
    return ccw(dx, dy)
  }
  return cw(dx, dy)
}

function maybeFlip({ x, y }) {
  if (randInt(2)) {
    return [ -x, -y ]
  }
  return [ x, y ]
}

function generateFeatures(tiles) {
  const features = []

  while (features.length < 25) {
    if (randInt(8)) {
      // Line
      const [sx, sy] = [randInt(tiles), randInt(tiles)]
      const [dx, dy] = [randSign(), randSign()]
      const dist = randInt(tiles * 3 / 4)
      const [ex, ey] = [sx + dx * dist, sy + dy * dist]
      features.push({
        name: 'line',
        x1: sx,
        y1: sy,
        x2: ex,
        y2: ey,
      })

      if (!randInt(3)) {
        const dir = oneRot(dx, dy)
        const [ x, y ] = maybeFlip(dir)
        features.push({
          name: 'line',
          x1: sx,
          y1: sy,
          x2: sx + x,
          y2: sy + y,
        })
      }
      if (!randInt(3)) {
        const dir = oneRot(dx, dy)
        const [ x, y ] = maybeFlip(dir)
        features.push({
          name: 'line',
          x1: ex,
          y1: ey,
          x2: ex + x,
          y2: ey + y,
        })
      }
    } else {
      // Dot
      features.push({
        name: 'dot',
        x: randInt(tiles),
        y: randInt(tiles),
      })
    }
  }

  return features
}

const drawShape = ({ scale, tiles }) => {
  const size = scale * tiles;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle =`hsl(180, 100%, 10%)`;
  ctx.fillRect(0, 0, size, size);

  // const hue = Math.random() * 360
  const hue = 180

  const color = `hsl(${hue}, 100%, 60%)`

  ctx.translate(scale / 2, scale / 2)

  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineWidth = scale * 2/4

  const features = generateFeatures(tiles)
  drawFeatures(ctx, features, tiles, scale)

  return canvas;
}

const generateImage = (settings) => {
  const img = document.createElement("img");
  img.src = drawShape(settings).toDataURL();
  img.alt = "Randomly generated grid image";
  return img;
}

const defaultSettings = { scale: 11, tiles: 10, count: 100 };

const readParameters = () => {
  const params = new URLSearchParams(window.location.search);
  let settings = {};
  for (const field of ["scale", "tiles", "count"]) {
    const value = parseInt(params.get(field));
    if (params.has(field)) {
      if (isNaN(value)) {
        setText("errors", `Invalid query parameter in field: ${field}`);
        return {};
      }
      document.getElementById(`form-${field}`).value = params.get(field);
      settings[field] = value;
    }
  }
  return settings;
}

const setText = (id, text) => {
  const span = document.getElementById(id);
  span.innerText = text;
}

const bindForm = () => {
  const a = document.getElementById("link");
  const count = document.getElementById("form-count");
  const tiles = document.getElementById("form-tiles");
  const scale = document.getElementById("form-scale");
  const update = () => {
    const params = new URLSearchParams();
    if (count.value) {
      params.append("count", count.value);
    }
    if (tiles.value) {
      params.append("tiles", tiles.value);
    }
    if (scale.value) {
      params.append("scale", scale.value);
    }
    a.href = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }
  count.onchange = update;
  tiles.onchange = update;
  scale.onchange = update;
}

window.onload = () => {
  bindForm();
  const settings = { ...defaultSettings, ...readParameters() };
  setText("count", settings.count === 1 ? '1 icon' : `${settings.count} icons`);
  setText("grid", `${settings.tiles} x ${settings.tiles}`);
  setText("scale", `${settings.scale}`);
  const container = document.getElementById("container");
  function drawOne() {
    container.appendChild(generateImage(settings));
    if (container.children.length < settings.count) {
      window.setTimeout(drawOne, 0);
    }
  }
  drawOne();
}