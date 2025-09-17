import { Tetrimino } from './tetriminos';

type TetriminoConstructor = new () => Tetrimino;

export class HoldManager {
  private heldPieceClass: TetriminoConstructor | null = null;
  private ctx: CanvasRenderingContext2D;

  constructor(holdCanvas: HTMLCanvasElement) {
    this.ctx = holdCanvas.getContext('2d')!;
  }

  holdPiece(piece: Tetrimino): Tetrimino | null {
    const pieceClassToDrop = this.heldPieceClass;

    // Store the constructor
    this.heldPieceClass = piece.constructor as TetriminoConstructor;

    return pieceClassToDrop ? new pieceClassToDrop() : null;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    const piece = this.heldPieceClass ? new this.heldPieceClass() : null;
    if (!piece) return;

    const canvasWidth = this.ctx.canvas.width; // 128px from HTML
    const canvasHeight = this.ctx.canvas.height; // 128px from HTML
    const blockSize = Math.min(canvasWidth / 6, canvasHeight / 6); // Size of each tetrimino block

    const minCol = Math.min(...piece.coords.map((coord) => coord.col));
    const maxCol = Math.max(...piece.coords.map((coord) => coord.col));
    const minRow = Math.min(...piece.coords.map((coord) => coord.row));
    const maxRow = Math.max(...piece.coords.map((coord) => coord.row));

    const pieceWidth = (maxCol - minCol + 1) * blockSize;
    const pieceHeight = (maxRow - minRow + 1) * blockSize;

    // Center the piece horizontally and vertically
    const offsetX = (canvasWidth - pieceWidth) / 2;
    const offsetY = (canvasHeight - pieceHeight) / 2;

    piece.coords.forEach((coord) => {
      const x = offsetX + (coord.col - minCol) * blockSize;
      const y = offsetY + (coord.row - minRow) * blockSize;

      this.ctx.fillStyle = piece.COLOR;
      this.ctx.fillRect(x + 1, y + 1, blockSize - 0.5, blockSize - 0.5); // 1px gap like main board
    });
  }
}
