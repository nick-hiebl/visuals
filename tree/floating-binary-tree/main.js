var canvas

var state = null

const QUERY_OP = 20
const MUT_OP = 200
const MOVE_RATE = 0.9

const makeNode = (value, parent) => {
  return {
    value,
    left: null,
    right: null,
    trueX: parent ? parent.trueX + (value < parent.value ? -50 : 50) : 0,
    trueY: parent ? parent.trueY + 50 : 0,
    currX: parent ? parent.currX : 0,
    currY: parent ? parent.currY : 0,
    width: 0,
    active: false,
    depth: 1,
  }
}

const insert = async (node, value, parent) => {
  if (!node) {
    await sleep(MUT_OP)
    return makeNode(value, parent)
  }

  node.active = true

  const relFromParent = parent ? (node.value < parent.value ? 'left' : 'right') : undefined

  if (value < node.value) {
    await sleep(QUERY_OP)
    node.left = await insert(node.left, value, node)
  } else {
    await sleep(QUERY_OP)
    node.right = await insert(node.right, value, node)
  }

  node.active = false

  const lDepth = node.left?.depth ?? 0
  const rDepth = node.right?.depth ?? 0
  if (lDepth + 1 < rDepth) {
    // return await rotateLeft(node)
    const v = await rotateLeft(node)
    if (relFromParent) {
      parent[relFromParent] = v
      await sleep(MUT_OP)
    }
    return v
  } else if (lDepth > rDepth + 1) {
    // return await rotateRight(node)
    const v = await rotateRight(node)
    if (relFromParent) {
      parent[relFromParent] = v
      await sleep(MUT_OP)
    }
    return v
  }

  setDepth(node)

  return node
}

const setDepth = (node) => {
  if (!node) {
    return
  }

  const lDepth = node.left?.depth ?? 0
  const rDepth = node.right?.depth ?? 0
  node.depth = 1 + Math.max(lDepth, rDepth)
}

const rotateLeft = async (node) => {
  if (!node.right) {
    await sleep(QUERY_OP)
    return
  }

  const X = node
  const Y = node.right
  X.right = Y.left
  Y.left = X
  
  // await sleep(MUT_OP)
  setDepth(X)
  setDepth(Y)
  return Y
}

const rotateRight = async (node) => {
  if (!node.left) {
    await sleep(QUERY_OP)
    return
  }

  const X = node
  const Y = node.left
  X.left = Y.right
  Y.right = X

  await sleep(MUT_OP)
  setDepth(X)
  setDepth(Y)
  return Y
}

const drawNode = (node) => {
  if (!node) {
    return
  }
  
  if (node.left) {
    canvas.color('white')
    canvas.line(node.currX, node.currY, node.left.currX, node.left.currY)
    drawNode(node.left)
  }
  if (node.right) {
    canvas.color('white')
    canvas.line(node.currX, node.currY, node.right.currX, node.right.currY)
    drawNode(node.right)
  }
  canvas.color(node.active ? '#88ffaa' : 'white')
  canvas.fillArc(node.currX, node.currY, 20, 20)

  canvas.color('black')
  canvas.ctx.fillText(node.value, node.currX - 10, node.currY)
}

const draw = () => {
  calculateWidths(state)
  canvas.lineWidth(4)
  updateNode(state)
  canvas.color('black')
  canvas.background()
  canvas.color('white')
  drawNode(state)
}

const calculateWidths = (node) => {
  if (!node) {
    return 0
  }

  const lWidth = calculateWidths(node.left)
  const rWidth = calculateWidths(node.right)

  node.width = lWidth + 1 + rWidth
  return node.width
}

const updateNode = (node, parent) => {
  if (!node) {
    return
  }

  if (!parent) {
    node.trueX = canvas.width / 2
    node.trueY = 50
    // node.currX = node.trueX
    // node.currY = node.trueY
  } else if (node.value < parent.value) {
    const offset = node.right?.width ?? 0
    node.trueX = parent.trueX - (offset + 1) * 22
    node.trueY = parent.trueY + 60
  } else {
    const offset = node.left?.width ?? 0
    node.trueX = parent.trueX + (offset + 1) * 22
    node.trueY = parent.trueY + 60
  }

  node.currX = node.currX * MOVE_RATE + node.trueX * (1 - MOVE_RATE)
  node.currY = node.currY * MOVE_RATE + node.trueY * (1 - MOVE_RATE)
  if (Math.abs(node.currX - node.trueX) < 1) {
    node.currX = node.trueX
  }
  if (Math.abs(node.currY - node.trueY) < 1) {
    node.currY = node.trueY
  }

  updateNode(node.left, node)
  updateNode(node.right, node)
}

const values = [5020, 5019, 5018, 5017]

const makeTree = async () => {
  state = insert(state, 5000)
  for (let i = 0; i < 100; i++) {
    const newValue = Math.round(Math.random() * 10000)
    // if (!values.length) break
    // const newValue = values.pop(0)
    await sleep(500)
    state = await insert(state, newValue)
  }
}

const setup = () => {
  canvas = new Canvas('canvas')
  canvas.resize(window.innerWidth, window.innerHeight)

  makeTree()
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(() => resolve(), ms))
}

addUpdate(draw);
addSetup(setup);
