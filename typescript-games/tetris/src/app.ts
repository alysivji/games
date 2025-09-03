import { IPiece, JPiece, LPiece, OPiece, SPiece, Tetrimino, TPiece, ZPiece } from "./tetriminos";

const BOX_SIZE = 40;
const N_COLS = 10;
const N_ROWS = 20;

const canvas = document.querySelector<HTMLCanvasElement>("#tetris")!;
const ctx = canvas.getContext("2d")!;

function drawGrid() {
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

function drawBlocks(piece) {
  ctx.fillStyle = piece.COLOR;
  for (const point of piece.pointsToDraw) {
    const x = point.x * (BOX_SIZE + 1) + 1;
    const y = point.y * (BOX_SIZE + 1) + 1;
    ctx.fillRect(x, y, BOX_SIZE, BOX_SIZE)
  }
}

function gameLoop() {
  window.requestAnimationFrame(gameLoop);


  canvas.width = N_COLS * (BOX_SIZE + 1);
  canvas.height = N_ROWS * (BOX_SIZE + 1);

  drawGrid();

  let piece: Tetrimino;

  piece = new IPiece();
  piece = new OPiece();
  piece = new TPiece();
  piece = new SPiece();
  piece = new ZPiece();
  piece = new JPiece();
  piece = new LPiece();

  drawBlocks(piece);
}

gameLoop(performance.now());
