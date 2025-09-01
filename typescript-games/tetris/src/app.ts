const BOX_SIZE = 40;
const N_COLS = 10;
const N_ROWS = 20;

// tetriminos
// i, l, j, t, o, s, z
// 10 by 20

// #00ffff -- I -- blue
// #ffff00 -- O -- yellow
// #800080 -- T -- purple
// #00ff00 -- S -- green
// #ff0000 -- Z -- red
// #0000ff -- J -- blue
// #ff7f00 -- L -- orange

function draw() {
  const canvas = document.querySelector<HTMLCanvasElement>("#tetris")!;
  canvas.width = N_COLS * (BOX_SIZE + 1);
  canvas.height = N_ROWS * (BOX_SIZE + 1);

  const ctx = canvas.getContext("2d");
  drawGrid(ctx);
  // drawBlocks();
}
draw();

function drawGrid(ctx) {
  // draw grid
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 1;
  ctx.beginPath()

  // columns
  for (let i = 1; i < N_COLS; i++) {
    const x = (BOX_SIZE + 1) * i;
    ctx.moveTo(x, 0);

    const bottomY = (BOX_SIZE + 1) * N_ROWS;
    ctx.lineTo(x, bottomY);
  }

  // rows
  for (let j = 1; j < N_ROWS; j++) {
    const y = (BOX_SIZE + 1) * j
    ctx.moveTo(0, y);

    const rightX = (BOX_SIZE + 1) * N_COLS;
    ctx.lineTo(rightX, y)
  }

  ctx.stroke();
}
