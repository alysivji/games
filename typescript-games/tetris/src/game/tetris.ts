import { GridCoordinate, GridMap } from './grid';
import { PieceQueue } from './queue';
import { sevenBagRandomizer } from './randomizer';
import { Tetrimino } from './tetriminos';

const STEP = 30; // visual cell step (matches CSS --cell)
const GAP = 1; // 1px between cells
const BOX_SIZE = STEP - GAP;
const N_COLS = 10;
const N_ROWS = 20;

type TetrisProps = {
  tetrisCanvas: HTMLCanvasElement;
  holdPieceCanvas: HTMLCanvasElement;
  nextPieceCanvas: HTMLCanvasElement;
};

export class Tetris {
  tetrisCanvasCtx: CanvasRenderingContext2D;

  level: number;
  lastTick: number;

  matrix: GridMap;
  pieceQueue: PieceQueue;

  currentPiece: Tetrimino;
  lastGravityTick: number;
  lastLockTick: number;

  tickLength: number = (1 / 60) * 1000; // 60 frames per second
  stopGameLoop: number;

  lastLateralMovementKeyPressTick: number;
  leftKeyPressed: boolean;
  rightKeyPressed: boolean;

  lastDownwardMovementKeyPressTick: number;
  downKeyPressed: boolean;

  rotateClockwiseKeyPressed: boolean;
  rotateCounterClockwiseKeyPressed: boolean;

  constructor({ tetrisCanvas }: TetrisProps) {
    tetrisCanvas.width = N_COLS * (BOX_SIZE + 1);
    tetrisCanvas.height = N_ROWS * (BOX_SIZE + 1);
    this.tetrisCanvasCtx = tetrisCanvas.getContext('2d')!;

    tetrisCanvas;

    this.level = 8;

    this.matrix = new GridMap({ numRows: N_ROWS, numCols: N_COLS });
    this.pieceQueue = new PieceQueue({
      size: 5,
      randomizer: sevenBagRandomizer,
    });

    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.rotateClockwiseKeyPressed = false;
    this.rotateCounterClockwiseKeyPressed = false;

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  start({ tick }: { tick: number }) {
    this.lastTick = tick;

    // TODO -- do we need to reset these when new pieces show up
    this.lastGravityTick = tick;
    this.lastLateralMovementKeyPressTick = tick;
    this.lastDownwardMovementKeyPressTick = tick;

    this.currentPiece = this.pieceQueue.dequeue();
    this.drawMatrix();
  }

  stop() {
    window.cancelAnimationFrame(this.stopGameLoop);
  }

  update(deltaTime: number) {
    this.lastTick += deltaTime;

    const timeElapsedSinceLastLateralMovementKeyPressTick =
      this.lastTick - this.lastLateralMovementKeyPressTick;
    if (timeElapsedSinceLastLateralMovementKeyPressTick >= 60) {
      // 60ms is the key press window
      this.lastLateralMovementKeyPressTick = this.lastTick;

      // TODO -- if we are holding down both left and right -- how to handle
      if (this.leftKeyPressed && this.canMoveLeft()) {
        this.currentPiece.moveLeft();
      }

      if (this.rightKeyPressed && this.canMoveRight()) {
        this.currentPiece.moveRight();
      }
    }

    const timeElapsedSinceLastDownward =
      this.lastTick - this.lastDownwardMovementKeyPressTick;
    if (
      this.downKeyPressed &&
      this.canMoveDown() &&
      this.currentPiece.isVisible() &&
      timeElapsedSinceLastDownward >= 20
    ) {
      this.lastDownwardMovementKeyPressTick = this.lastTick;
      this.currentPiece.moveDown();
      this.lastGravityTick = this.lastGravityTick;
    }

    // TODO
    // [ ] check if rotation is valid
    // [ ] kick matrix
    if (this.rotateClockwiseKeyPressed) {
      this.currentPiece.rotateClockwise(this.matrix);
      this.rotateClockwiseKeyPressed = false;
    }

    if (this.rotateCounterClockwiseKeyPressed) {
      this.currentPiece.rotateCounterClockwise(this.matrix);
      this.rotateCounterClockwiseKeyPressed = false;
    }

    const timeElapsedSinceLastGravityTick =
      this.lastTick - this.lastGravityTick;
    if (timeElapsedSinceLastGravityTick < this.levelThresholdInMs()) return;
    // return;
    this.lastGravityTick = this.lastTick;
    if (this.canMoveDown()) {
      this.currentPiece.moveDown();
    } else {
      // lock the piece -- feels like we need to move this somewhere else
      // TODO -- don't lock piece right away
      // we should let the piece slide around after it hits the bottom
      this.lastLockTick = this.lastTick;

      // check end game state
      if (this.currentPiece.coords.some((coord) => coord.row < 0)) {
        alert('Game Over');
        this.stop();
        return;
      }

      this.currentPiece.coords.forEach((coord) => {
        this.matrix.set(coord, this.currentPiece.COLOR);
      });
      this.clearLines();
      this.currentPiece = this.pieceQueue.dequeue();
    }
  }

  clearLines() {
    const rowsToClear = this.matrix.rowsToClear;
    let numLinesToShift = 0;

    for (const rowToClear of rowsToClear) {
      this.matrix.clearRow(rowToClear);
      numLinesToShift++;

      for (
        let rowToShiftDown = rowToClear - 1;
        rowToShiftDown >= 0;
        rowToShiftDown--
      ) {
        if (rowsToClear.includes(rowToShiftDown)) break;

        for (let col = 0; col < N_COLS; col++) {
          const coordToShiftDown = new GridCoordinate({
            row: rowToShiftDown,
            col,
          });
          const coordRowBelow = new GridCoordinate({
            row: rowToShiftDown + numLinesToShift,
            col,
          });

          this.matrix.set(coordRowBelow, this.matrix.get(coordToShiftDown)!);
          this.matrix.set(coordToShiftDown, null);
        }
      }
    }
  }

  draw() {
    for (let row = 0; row < N_ROWS; row++) {
      for (let col = 0; col < N_COLS; col++) {
        this.clearRectangle(row, col);
      }
    }

    for (const filledCoord of this.matrix.filledCoordinates) {
      const color = this.matrix.get(filledCoord)!;
      this.drawRectangle(filledCoord.row, filledCoord.col, color);
    }

    this.drawCurrentPiece();
  }

  private levelThresholdInMs() {
    return 1000 - (this.level - 1) * 100;
  }

  private drawMatrix() {
    this.tetrisCanvasCtx.strokeStyle = 'grey';
    this.tetrisCanvasCtx.lineWidth = 1;
    this.tetrisCanvasCtx.beginPath();

    // column lines
    for (let i = 1; i < N_COLS; i++) {
      const x = i * STEP + 0.5;
      this.tetrisCanvasCtx.moveTo(x, 0);
      this.tetrisCanvasCtx.lineTo(x, STEP * N_ROWS + 0.5);
    }

    // row lines
    for (let j = 1; j < N_ROWS; j++) {
      const y = j * STEP + 0.5;
      this.tetrisCanvasCtx.moveTo(0, y);
      this.tetrisCanvasCtx.lineTo(STEP * N_COLS + 0.5, y);
    }

    this.tetrisCanvasCtx.stroke();
  }

  private drawCurrentPiece() {
    for (const point of this.currentPiece.coords) {
      this.drawRectangle(point.row, point.col, this.currentPiece.COLOR);
    }
  }

  private drawRectangle(row: number, col: number, color: string) {
    this.tetrisCanvasCtx.fillStyle = color;

    const topLeftX = col * (BOX_SIZE + 1) + 1;
    const topLeftY = row * (BOX_SIZE + 1) + 1;
    this.tetrisCanvasCtx.fillRect(topLeftX, topLeftY, BOX_SIZE, BOX_SIZE);
  }

  private clearRectangle(row: number, col: number) {
    const topLeftX = col * (BOX_SIZE + 1) + 1;
    const topLeftY = row * (BOX_SIZE + 1) + 1;
    this.tetrisCanvasCtx.clearRect(topLeftX, topLeftY, BOX_SIZE, BOX_SIZE);
  }

  private canMoveDown(): boolean {
    const newPieceLocation = this.currentPiece.downOne();

    const isBelowWall = newPieceLocation.some((coord) => coord.row >= N_ROWS);
    if (isBelowWall) {
      return false;
    }

    // filter out the blocks that are above the field of play
    return newPieceLocation
      .filter((coord) => coord.row >= 0)
      .every((coord) => this.matrix.get(coord) === null);
  }

  private canMoveLeft(): boolean {
    const newPieceLocation = this.currentPiece.leftOne();

    const isLeftOfWall = newPieceLocation.some((coord) => coord.col < 0);
    if (isLeftOfWall) {
      return false;
    }

    return newPieceLocation.every((coord) => this.matrix.get(coord) === null);
  }

  private canMoveRight(): boolean {
    const newPieceLocation = this.currentPiece.rightOne();

    const isRightOfWall = newPieceLocation.some((coord) => coord.col >= N_COLS);
    if (isRightOfWall) {
      return false;
    }

    return newPieceLocation.every((coord) => this.matrix.get(coord) === null);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'ArrowLeft' && !e.repeat) {
      this.leftKeyPressed = true;
    }

    if (e.code === 'ArrowRight' && !e.repeat) {
      this.rightKeyPressed = true;
    }

    if (e.code === 'ArrowDown' && !e.repeat) {
      this.downKeyPressed = true;
    }

    if (e.code === 'KeyX' && !e.repeat) {
      this.rotateClockwiseKeyPressed = true;
    }

    if (e.code === 'KeyZ' && !e.repeat) {
      this.rotateCounterClockwiseKeyPressed = true;
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.leftKeyPressed = false;
    }

    if (e.key === 'ArrowRight') {
      this.rightKeyPressed = false;
    }

    if (e.key === 'ArrowDown') {
      this.downKeyPressed = false;
    }
  }
}
