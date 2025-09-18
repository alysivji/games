import { GridCoordinate, GridMap } from './grid';
import { HoldManager } from './hold';
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
  ctx: CanvasRenderingContext2D;

  level: number;
  lastTick: number;

  matrix: GridMap;
  pieceQueue: PieceQueue;
  holdManager: HoldManager;

  currentPiece: Tetrimino;
  lastGravityTick: number;
  lastLockTick: number;

  tickLength: number = (1 / 60) * 1000; // 60 frames per second
  stopGameLoop: number;

  lastLateralMovementKeyPressTick: number;
  leftKeyPressed: boolean = false;
  rightKeyPressed: boolean = false;

  lastDownwardMovementKeyPressTick: number;
  downKeyPressed: boolean = false;

  rotateClockwise: boolean = false;
  rotateCounterClockwise: boolean = false;

  holdPiece: boolean = false;
  hardDrop: boolean = false;

  constructor({ tetrisCanvas, holdPieceCanvas, nextPieceCanvas }: TetrisProps) {
    tetrisCanvas.width = N_COLS * STEP;
    tetrisCanvas.height = N_ROWS * STEP;
    this.ctx = tetrisCanvas.getContext('2d')!;

    tetrisCanvas;

    this.level = 8;

    this.matrix = new GridMap({ numRows: N_ROWS, numCols: N_COLS });
    this.pieceQueue = new PieceQueue({
      size: 5,
      randomizer: sevenBagRandomizer,
      nextPieceCanvas,
    });
    this.holdManager = new HoldManager(holdPieceCanvas);

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
    // edge triggered controls -- rotation + hold + hard drop
    if (this.holdPiece) {
      const pieceFromHold = this.holdManager.holdPiece(this.currentPiece);
      if (pieceFromHold) {
        this.currentPiece = pieceFromHold;
      } else {
        this.currentPiece = this.pieceQueue.dequeue();
      }

      this.holdManager.draw();

      this.holdPiece = false;
      return;
    }

    if (this.rotateClockwise) {
      this.currentPiece.rotateClockwise(this.matrix);
      this.rotateClockwise = false;
    }

    if (this.rotateCounterClockwise) {
      this.currentPiece.rotateCounterClockwise(this.matrix);
      this.rotateCounterClockwise = false;
    }

    if (this.hardDrop) {
      let pieceMoved;
      do {
        pieceMoved = this.currentPiece.moveDown(this.matrix);
      } while (this.currentPiece.isVisible() && pieceMoved);
      this.hardDrop = false;
    }

    // lateral movement + soft drop
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
      this.currentPiece.isVisible() &&
      timeElapsedSinceLastDownward >= 20
    ) {
      this.lastDownwardMovementKeyPressTick = this.lastTick;
      this.currentPiece.moveDown(this.matrix);
      this.lastGravityTick = this.lastTick;
      return;
    }

    // gravity
    const timeElapsedSinceLastGravityTick =
      this.lastTick - this.lastGravityTick;
    if (timeElapsedSinceLastGravityTick < this.levelThresholdInMs()) {
      return;
    }
    // return;
    this.lastGravityTick = this.lastTick;
    const movedDown = this.currentPiece.moveDown(this.matrix);

    if (!movedDown) {
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

  private clearLines() {
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

  private levelThresholdInMs() {
    return 1000 - (this.level - 1) * 100;
  }

  private drawMatrix() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    this.ctx.beginPath();
    for (let i = 1; i < N_COLS; i++) {
      const x = Math.floor(i * STEP) + 0.5;
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, N_ROWS * STEP);
    }
    this.ctx.stroke();

    // Draw horizontal lines
    this.ctx.beginPath();
    for (let j = 1; j < N_ROWS; j++) {
      const y = Math.floor(j * STEP) + 0.5;
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(N_COLS * STEP, y);
    }
    this.ctx.stroke();
  }

  private drawCurrentPiece() {
    if (!this.currentPiece.isVisible) {
      return;
    }

    for (const point of this.currentPiece.coords) {
      this.drawRectangle(point.row, point.col, this.currentPiece.COLOR);
    }

    // draw
    // const current = this.currentPiece.coords.map(
    //   (coord) => new GridCoordinate({ col: coord.col, row: coord.row })
    // );
    // while

    // draw ghost piece, but change the colour to be transparent
    const ghostPiece = this.currentPiece.copy();
    //
  }

  private drawRectangle(row: number, col: number, color: string) {
    this.ctx.fillStyle = color;

    const topLeftX = col * STEP + 1;
    const topLeftY = row * STEP + 1;
    this.ctx.fillRect(topLeftX, topLeftY, BOX_SIZE, BOX_SIZE);
  }

  private clearRectangle(row: number, col: number) {
    const topLeftX = col * STEP + 1;
    const topLeftY = row * STEP + 1;
    this.ctx.clearRect(topLeftX, topLeftY, BOX_SIZE, BOX_SIZE);
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
      this.rotateClockwise = true;
    }

    if (e.code === 'KeyZ' && !e.repeat) {
      this.rotateCounterClockwise = true;
    }

    if (e.code === 'KeyC' && !e.repeat) {
      this.holdPiece = true;
    }

    if (e.code === 'ShiftLeft' && !e.repeat) {
      this.holdPiece = true;
    }

    if (e.code === 'Space' && !e.repeat) {
      this.hardDrop = true;
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
