import { GridCoordinate, GridMap } from "./grid";
import { Tetrimino, ALL_TETRIMINOS } from "./tetriminos";

const BOX_SIZE = 40;
const N_COLS = 10;
const N_ROWS = 20;

const canvas = document.querySelector<HTMLCanvasElement>("#tetris")!;
canvas.width = N_COLS * (BOX_SIZE + 1);
canvas.height = N_ROWS * (BOX_SIZE + 1);

const ctx = canvas.getContext("2d")!;

export class Tetris {
  level: number;
  lastTick: number;

  board: GridMap;

  currentPiece: Tetrimino;
  lastGravityTick: number;
  lastLockTick: number;

  tickLength: number = 1 / 60 * 1000;  // 60 Hz
  stopGameLoop: number;

  constructor({ level }: { level: number }) {
    this.level = level;

    this.board = new GridMap();
    for (let row = 0; row < N_ROWS; row++) {
      for (let col = 0; col < N_COLS; col++) {
        const coord = new GridCoordinate({ row, col })
        this.board.set(coord, null);
      }
    }
  }

  start({ tick }: { tick: number }) {
    this.lastTick = tick;
    this.lastGravityTick = tick;

    this.dropRrandomizePiece();
    this.drawBoard();
  }

  stop() {
    window.cancelAnimationFrame(this.stopGameLoop);
  }

  update(deltaTime: number) {
    this.lastTick += deltaTime;

    // TODO exit early maybe to un-nest this?
    const timeElapsedSinceLastTick = this.lastTick - this.lastGravityTick;
    if (timeElapsedSinceLastTick >= this.levelThresholdInMs()) {
      this.lastGravityTick = this.lastTick

      if (this.canMoveDown()) {
        this.currentPiece.step();
      } else {
        this.lastLockTick = this.lastTick;

        // end game state
        if (this.currentPiece.coords.some(coord => coord.row < 0)) {
          alert("Game Over");
          this.stop();
          return;
        }

        this.currentPiece.coords.forEach(coord => {
          this.board.set(coord, this.currentPiece.COLOR);
        })
        this.dropRrandomizePiece();
      }
    }
  }

  draw() {
    for (let row = 0; row < N_ROWS; row++) {
      for (let col = 0; col < N_COLS; col++) {
        this.clearRectangle(row, col)
      }
    }

    for (const filledCoord of this.board.filledCoordinates) {
      const color = this.board.get(filledCoord)!;
      this.drawRectangle(filledCoord.row, filledCoord.col, color);
    }

    this.drawPiece(this.currentPiece);
  }

  private levelThresholdInMs() {
    return 1000 - (this.level - 1) * 100;
  }

  private drawBoard() {
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 1;
    ctx.beginPath()

    // column lines
    for (let i = 1; i < N_COLS; i++) {
      const x = (BOX_SIZE + 1) * i;
      ctx.moveTo(x, 0);

      const bottomY = (BOX_SIZE + 1) * N_ROWS;
      ctx.lineTo(x, bottomY);
    }

    // row lines
    for (let j = 1; j < N_ROWS; j++) {
      const y = (BOX_SIZE + 1) * j
      ctx.moveTo(0, y);

      const rightX = (BOX_SIZE + 1) * N_COLS;
      ctx.lineTo(rightX, y)
    }

    ctx.stroke();
  }

  private drawPiece(piece) {
    for (const point of piece.coords) {
      this.drawRectangle(point.row, point.col, piece.COLOR);
    }
  }

  private drawRectangle(row: number, col: number, color: string) {
    ctx.fillStyle = color;

    const topLeftX = col * (BOX_SIZE + 1) + 1;
    const topLeftY = row * (BOX_SIZE + 1) + 1;
    ctx.fillRect(topLeftX, topLeftY, BOX_SIZE, BOX_SIZE)
  }

  private clearRectangle(row: number, col: number) {
    const topLeftX = col * (BOX_SIZE + 1) + 1;
    const topLeftY = row * (BOX_SIZE + 1) + 1;
    ctx.clearRect(topLeftX, topLeftY, BOX_SIZE, BOX_SIZE);
  }

  private dropRrandomizePiece() {
    const randomIndex = Math.floor(Math.random() * ALL_TETRIMINOS.length);
    this.currentPiece = new ALL_TETRIMINOS[randomIndex];
  }

  private canMoveDown(): boolean {
    const bottomRowValue = Math.max(... this.currentPiece.coords.map(coord => coord.row));

    // is it going below the floor?
    if (bottomRowValue + 1 >= N_ROWS) {
      return false;
    }

    // is the row below empty?
    const bottomRowBlocks = this.currentPiece.coords.filter(coord => coord.row === bottomRowValue);
    const bottomRowBlocksMovedDownOneRow = bottomRowBlocks.map(coord => new GridCoordinate({ row: coord.row + 1, col: coord.col }));
    return !bottomRowBlocksMovedDownOneRow.map(coord => this.board.get(coord)).some(color => color !== null)
  }
}
