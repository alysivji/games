import { Tetrimino } from './tetriminos';

type TetriminoConstructor = new () => Tetrimino;

export class HoldManager {
  private heldPieceClass: TetriminoConstructor | null = null;

  holdPiece(piece: Tetrimino): Tetrimino | null {
    const pieceClassToDrop = this.heldPieceClass;

    // Store the constructor
    this.heldPieceClass = piece.constructor as TetriminoConstructor;

    return pieceClassToDrop ? new pieceClassToDrop() : null;
  }
}
