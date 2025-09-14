import { GridCoordinate } from '../grid';
import { Tetrimino } from './pieces';

export abstract class BaseRotationStrategy {
  piece: Tetrimino;

  constructor(piece: Tetrimino) {
    this.piece = piece;
  }

  abstract rotateClockwise(): void;

  abstract rotateCounterClockwise(): void;
}

export class OPieceRotationStrategy extends BaseRotationStrategy {
  rotateClockwise() {}

  rotateCounterClockwise() {}
}

export class IPieceRotationStrategy extends BaseRotationStrategy {
  rotateCounterClockwise() {
    const rotatedCoordinates = this.piece.coords.map((coord) => {
      const transposedCoord = new GridCoordinate({
        col: coord.col - this.piece.pivot.col,
        row: coord.row - this.piece.pivot.row,
      });
      const rotatedCoord = new GridCoordinate({
        col: transposedCoord.row,
        row: -transposedCoord.col,
      });
      return new GridCoordinate({
        col: rotatedCoord.col + this.piece.pivot.col,
        row: rotatedCoord.row + this.piece.pivot.row,
      });
    });

    // go through all 5 transformations to see
    this.piece.coords = rotatedCoordinates;
  }

  rotateClockwise() {
    const rotatedCoordinates = this.piece.coords.map((coord) => {
      const transposedCoord = new GridCoordinate({
        col: coord.col - this.piece.pivot.col,
        row: coord.row - this.piece.pivot.row,
      });
      const rotatedCoord = new GridCoordinate({
        col: -transposedCoord.row,
        row: transposedCoord.col,
      });
      return new GridCoordinate({
        col: rotatedCoord.col + this.piece.pivot.col - 1,
        row: rotatedCoord.row + this.piece.pivot.row,
      });
    });

    // go through all 5 transformations to see
    this.piece.coords = rotatedCoordinates;
  }
}

export class TSZJLPieceRotationStrategy extends BaseRotationStrategy {
  rotateCounterClockwise() {
    const rotatedCoordinates = this.piece.coords.map((coord) => {
      const transposedCoord = new GridCoordinate({
        col: coord.col - this.piece.pivot.col,
        row: coord.row - this.piece.pivot.row,
      });
      const rotatedCoord = new GridCoordinate({
        col: transposedCoord.row,
        row: -transposedCoord.col,
      });
      return new GridCoordinate({
        col: rotatedCoord.col + this.piece.pivot.col,
        row: rotatedCoord.row + this.piece.pivot.row,
      });
    });

    // go through all 5 transformations to see
    this.piece.coords = rotatedCoordinates;
  }

  rotateClockwise() {
    const rotatedCoordinates = this.piece.coords.map((coord) => {
      const transposedCoord = new GridCoordinate({
        col: coord.col - this.piece.pivot.col,
        row: coord.row - this.piece.pivot.row,
      });
      const rotatedCoord = new GridCoordinate({
        col: -transposedCoord.row,
        row: transposedCoord.col,
      });
      return new GridCoordinate({
        col: rotatedCoord.col + this.piece.pivot.col,
        row: rotatedCoord.row + this.piece.pivot.row,
      });
    });

    // go through all 5 transformations to see
    this.piece.coords = rotatedCoordinates;
  }
}
