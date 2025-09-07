import { GridCoordinate, GridMap } from "./grid";
import { Tetrimino, ALL_TETRIMINOS } from "./tetriminos";

const BOX_SIZE = 40;
const N_COLS = 10;
const N_ROWS = 20;

export class Tetris {
  ctx: CanvasRenderingContext2D;

  level: number;
  lastTick: number;

  board: GridMap;

  currentPiece: Tetrimino;
  lastGravityTick: number;
  lastLockTick: number;

  tickLength: number = 1 / 60 * 1000;  // 60 frames per second
  stopGameLoop: number;

  leftKeyPressed: boolean;
  leftKeyPressedTime: number;

  rightKeyPressed: boolean;
  rightKeyPressedTime: number;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    canvas.width = N_COLS * (BOX_SIZE + 1);
    canvas.height = N_ROWS * (BOX_SIZE + 1);
    this.ctx = canvas.getContext("2d")!;

    this.level = 10;

    this.board = new GridMap();
    for (let row = 0; row < N_ROWS; row++) {
      for (let col = 0; col < N_COLS; col++) {
        const coord = new GridCoordinate({ row, col })
        this.board.set(coord, null);
      }
    }

    this.leftKeyPressed = false
    this.rightKeyPressed = false;

    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
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

    const timeElapsedSinceLastTick = this.lastTick - this.lastGravityTick;
    if (!(timeElapsedSinceLastTick >= this.levelThresholdInMs())) return

    this.lastGravityTick = this.lastTick

    // TODO -- if we are holding down both left and right -- how to handle
    // TODO -- probably need to move the left and right outside the gravity tick

    if (this.leftKeyPressed && this.canMoveLeft()) {
      this.currentPiece.moveLeft();
    }

    if (this.rightKeyPressed && this.canMoveRight()) {
      this.currentPiece.moveRight();
    }

    if (this.canMoveDown()) {
      this.currentPiece.moveDown();
    } else {
      // lock the piece -- feels like we need to move this somewhere else
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
    this.ctx.strokeStyle = "grey";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath()

    // column lines
    for (let i = 1; i < N_COLS; i++) {
      const x = (BOX_SIZE + 1) * i;
      this.ctx.moveTo(x, 0);

      const bottomY = (BOX_SIZE + 1) * N_ROWS;
      this.ctx.lineTo(x, bottomY);
    }

    // row lines
    for (let j = 1; j < N_ROWS; j++) {
      const y = (BOX_SIZE + 1) * j
      this.ctx.moveTo(0, y);

      const rightX = (BOX_SIZE + 1) * N_COLS;
      this.ctx.lineTo(rightX, y)
    }

    this.ctx.stroke();
  }

  private drawPiece(piece) {
    for (const point of piece.coords) {
      this.drawRectangle(point.row, point.col, piece.COLOR);
    }
  }

  private drawRectangle(row: number, col: number, color: string) {
    this.ctx.fillStyle = color;

    const topLeftX = col * (BOX_SIZE + 1) + 1;
    const topLeftY = row * (BOX_SIZE + 1) + 1;
    this.ctx.fillRect(topLeftX, topLeftY, BOX_SIZE, BOX_SIZE)
  }

  private clearRectangle(row: number, col: number) {
    const topLeftX = col * (BOX_SIZE + 1) + 1;
    const topLeftY = row * (BOX_SIZE + 1) + 1;
    this.ctx.clearRect(topLeftX, topLeftY, BOX_SIZE, BOX_SIZE);
  }

  private dropRrandomizePiece() {
    const randomIndex = Math.floor(Math.random() * ALL_TETRIMINOS.length);
    this.currentPiece = new ALL_TETRIMINOS[randomIndex];
  }

  private canMoveDown(): boolean {
    const bottomRowValue = Math.max(... this.currentPiece.coords.map(coord => coord.row));

    // is it going below the floor?
    if (bottomRowValue > N_ROWS) {
      return false;
    }

    // is the row below empty?
    const bottomRowBlocks = this.currentPiece.coords.filter(coord => coord.row === bottomRowValue);
    const bottomRowBlocksMovedDownOneRow = bottomRowBlocks.map(coord => new GridCoordinate({ row: coord.row + 1, col: coord.col }));
    return !bottomRowBlocksMovedDownOneRow.map(coord => this.board.get(coord)).some(color => color !== null)
  }

  private canMoveLeft(): boolean {
    const leftmostCol = Math.min(... this.currentPiece.coords.map(coord => coord.col));
    if (leftmostCol <= 0) {
      return false
    }

    // is col to the left empty?
    const leftmostBlocks = this.currentPiece.coords.filter(coord => coord.col === leftmostCol);
    const leftmostBlocksMovedLeftOneCol = leftmostBlocks.map(coord => new GridCoordinate({ row: coord.row, col: coord.col - 1 }));
    return !leftmostBlocksMovedLeftOneCol.map(coord => this.board.get(coord)).some(color => color !== null)
  }

  private canMoveRight(): boolean {
    const rightMostCol = Math.max(... this.currentPiece.coords.map(coord => coord.col));
    if (rightMostCol >= N_COLS) {
      return false
    }

    // is col to the right empty?
    const rightmostBlocks = this.currentPiece.coords.filter(coord => coord.col === rightMostCol);
    const rightmostBlocksMovedRightOneCol = rightmostBlocks.map(coord => new GridCoordinate({ row: coord.row, col: coord.col + 1 }));
    return !rightmostBlocksMovedRightOneCol.map(coord => this.board.get(coord)).some(color => color !== null)
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft" && !this.leftKeyPressed) {
      this.leftKeyPressed = true;
      this.leftKeyPressedTime = performance.now();
    }

    if (e.key === "ArrowRight" && !this.rightKeyPressed) {
      this.rightKeyPressed = true;
      this.rightKeyPressedTime = performance.now();
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      this.leftKeyPressed = false;
      const leftKeyStop = performance.now();
      const leftKeyElapsed = leftKeyStop - this.leftKeyPressedTime;
    }

    if (e.key === "ArrowRight") {
      this.rightKeyPressed = false;
      const rightKeyStop = performance.now();
      const rightKeyElapsed = rightKeyStop - this.rightKeyPressedTime;
    }
  }
}
