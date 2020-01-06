let n = 0.16312498;

const drawShape = ({ scale, tiles }) => {
  const size = scale * tiles;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);

  const hue = Math.random() * 360;

  ctx.fillStyle = `hsl(${hue}, 100%, 60%)`
  
  const mid = Math.ceil(tiles / 2)
  
  for (let i = 0; i < mid; i += 1) {
    for (let j = 0; j < tiles; j += 1) {
      if (Math.random() < 0.5) {
        ctx.fillRect(i * scale, j * scale, scale, scale);
        ctx.fillRect(size - (i + 1) * scale, j * scale, scale, scale);
      }
    }
  }
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