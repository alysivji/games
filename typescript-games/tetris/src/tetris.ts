import { GridCoordinate, GridMap } from "./grid";
import { Tetrimino, ALL_TETRIMINOS } from "./tetriminos";

const BOX_SIZE = 40;
const N_COLS = 10;
const N_ROWS = 20;

export class Tetris {
  ctx: CanvasRenderingContext2D;

  level: number;
  lastTick: number;

  matrix: GridMap;

  currentPiece: Tetrimino;
  lastGravityTick: number;
  lastLockTick: number;

  tickLength: number = 1 / 60 * 1000;  // 60 frames per second
  stopGameLoop: number;

  lastKeyPressTick: number;

  leftKeyPressed: boolean;
  leftKeyPressedTime: number;

  rightKeyPressed: boolean;
  rightKeyPressedTime: number;

  rotateClockwise: boolean;
  rotateCounterClockwise: boolean;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    canvas.width = N_COLS * (BOX_SIZE + 1);
    canvas.height = N_ROWS * (BOX_SIZE + 1);
    this.ctx = canvas.getContext("2d")!;

    this.level = 10;

    this.matrix = new GridMap();
    for (let row = 0; row < N_ROWS; row++) {
      for (let col = 0; col < N_COLS; col++) {
        const coord = new GridCoordinate({ row, col })
        this.matrix.set(coord, null);
      }
    }

    this.leftKeyPressed = false
    this.rightKeyPressed = false;
    this.rotateClockwise = false;
    this.rotateCounterClockwise = false;

    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  start({ tick }: { tick: number }) {
    this.lastTick = tick;
    this.lastGravityTick = tick;
    this.lastKeyPressTick = tick;

    this.dropRrandomizePiece();
    this.drawMatrix();
  }

  stop() {
    window.cancelAnimationFrame(this.stopGameLoop);
  }

  update(deltaTime: number) {
    this.lastTick += deltaTime;

    const timeElapsedSinceLastKeyPressTick = this.lastTick - this.lastKeyPressTick;
    if (timeElapsedSinceLastKeyPressTick >= 60) { // 60ms is the key press window
      this.lastKeyPressTick = this.lastTick;

      // TODO -- if we are holding down both left and right -- how to handle
      if (this.leftKeyPressed && this.canMoveLeft()) {
        this.currentPiece.moveLeft();
      }

      if (this.rightKeyPressed && this.canMoveRight()) {
        this.currentPiece.moveRight();
      }
    }

    // TODO
    // [ ] check if rotation is valid
    // [ ] kick matrix
    // [ ] can't hold rotate down
    if (this.rotateClockwise) {
      this.currentPiece.rotateClockwise();
      this.rotateClockwise = false;
    }
    if (this.rotateCounterClockwise) {
      this.currentPiece.rotateCounterClockwise();
      this.rotateCounterClockwise = false;
    }

    const timeElapsedSinceLastGravityTick = this.lastTick - this.lastGravityTick;
    if (timeElapsedSinceLastGravityTick < this.levelThresholdInMs()) return

    this.lastGravityTick = this.lastTick

    if (this.canMoveDown()) {
      this.currentPiece.moveDown();
    } else {
      // lock the piece -- feels like we need to move this somewhere else
      // TODO -- don't lock piece right away
      // we should let the piece slide around after it hits the bottom
      this.lastLockTick = this.lastTick;

      // end game state
      if (this.currentPiece.coords.some(coord => coord.row < 0)) {
        alert("Game Over");
        this.stop();
        return;
      }

      this.currentPiece.coords.forEach(coord => {
        this.matrix.set(coord, this.currentPiece.COLOR);
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

    for (const filledCoord of this.matrix.filledCoordinates) {
      const color = this.matrix.get(filledCoord)!;
      this.drawRectangle(filledCoord.row, filledCoord.col, color);
    }

    this.drawCurrentPiece(this.currentPiece);
  }

  private levelThresholdInMs() {
    return 1000 - (this.level - 1) * 100;
  }

  private drawMatrix() {
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

  private drawCurrentPiece(piece) {
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
    const newPieceLocation = this.currentPiece.downOne();

    const isBelowWall = newPieceLocation.some(coord => coord.row >= N_ROWS)
    if (isBelowWall) {
      return false;
    }

    // filter out the blocks that are above the field of play
    return newPieceLocation.filter(coord => coord.row >= 0).every(coord => this.matrix.get(coord) === null);
  }

  private canMoveLeft(): boolean {
    const newPieceLocation = this.currentPiece.leftOne();

    const isLeftOfWall = newPieceLocation.some(coord => coord.col < 0);
    if (isLeftOfWall) {
      return false;
    }

    return newPieceLocation.every(coord => this.matrix.get(coord) === null)
  }

  private canMoveRight(): boolean {
    const newPieceLocation = this.currentPiece.rightOne();

    const isRightOfWall = newPieceLocation.some(coord => coord.col >= N_COLS);
    if (isRightOfWall) {
      return false;
    }

    return newPieceLocation.every(coord => this.matrix.get(coord) === null);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.code === "ArrowLeft" && !this.leftKeyPressed) {
      this.leftKeyPressed = true;
      this.leftKeyPressedTime = performance.now();
    }

    if (e.code === "ArrowRight" && !this.rightKeyPressed) {
      this.rightKeyPressed = true;
      this.rightKeyPressedTime = performance.now();
    }

    if (e.code === "KeyX" && !this.rotateClockwise) {
      this.rotateClockwise = true;
    }

    if (e.code === "KeyZ" && !this.rotateCounterClockwise) {
      this.rotateCounterClockwise = true;
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
