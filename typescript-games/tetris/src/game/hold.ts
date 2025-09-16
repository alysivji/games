import { Tetrimino } from './tetriminos';

export class HoldManager {
  private heldPiece: Tetrimino | null = null;

  holdPiece(piece: Tetrimino): Tetrimino | null {
    const pieceToDrop = this.heldPiece;

    // reset piece for next drop
    // piece.coords = [...piece.initialCoords];
    this.heldPiece = piece;

    return pieceToDrop;
  }
}
