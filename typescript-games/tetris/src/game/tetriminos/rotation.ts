// Super Rotation System (SRS)
// https://harddrop.com/wiki/SRS

import { GridCoordinate, GridMap } from '../grid';
import { Tetrimino } from './pieces';

export enum ROTATION {
  _0, // spawn state
  _R, // one clockwise rotation from spawn
  _2, // two successive rotations from spawn in either direction
  _L, // one counter clockwise rotation from spawn
}

export const CLOCKWISE_ROTATION_MAP = {
  [ROTATION._0]: ROTATION._R,
  [ROTATION._R]: ROTATION._2,
  [ROTATION._2]: ROTATION._L,
  [ROTATION._L]: ROTATION._0,
};

export const COUNTER_CLOCKWISE_ROTATION_MAP = {
  [ROTATION._0]: ROTATION._L,
  [ROTATION._L]: ROTATION._2,
  [ROTATION._2]: ROTATION._R,
  [ROTATION._R]: ROTATION._0,
};

export abstract class RotationStrategy {
  piece: Tetrimino;
  WALLKICK_TRANSITIONS: Record<string, GridCoordinate[]>;

  constructor(piece: Tetrimino) {
    this.piece = piece;
  }

  abstract rotateClockwise(matrix: GridMap): void;

  abstract rotateCounterClockwise(matrix: GridMap): void;
}

export class OPieceRotationStrategy extends RotationStrategy {
  rotateClockwise(matrix: GridMap) {}

  rotateCounterClockwise(matrix: GridMap) {}
}

export class IPieceRotationStrategy extends RotationStrategy {
  WALLKICK_TRANSITIONS: Record<string, GridCoordinate[]> = {
    [`${ROTATION._0}->${ROTATION._R}`]: [
      { col: +0, row: +0 },
      { col: -2, row: +0 },
      { col: +1, row: +0 },
      { col: -2, row: +1 },
      { col: +1, row: -2 },
    ],
    [`${ROTATION._R}->${ROTATION._0}`]: [
      { col: +0, row: +0 },
      { col: +2, row: +0 },
      { col: -1, row: +0 },
      { col: +2, row: -1 },
      { col: -1, row: +2 },
    ],
    [`${ROTATION._R}->${ROTATION._2}`]: [
      { col: +0, row: +0 },
      { col: -1, row: +0 },
      { col: +2, row: +0 },
      { col: -1, row: -2 },
      { col: +2, row: +1 },
    ],
    [`${ROTATION._2}->${ROTATION._R}`]: [
      { col: +0, row: +0 },
      { col: +1, row: +0 },
      { col: -2, row: +0 },
      { col: +1, row: +2 },
      { col: -2, row: -1 },
    ],
    [`${ROTATION._2}->${ROTATION._L}`]: [
      { col: +0, row: +0 },
      { col: +2, row: +0 },
      { col: -1, row: +0 },
      { col: +2, row: -1 },
      { col: -1, row: +2 },
    ],
    [`${ROTATION._L}->${ROTATION._2}`]: [
      { col: +0, row: +0 },
      { col: -2, row: +0 },
      { col: +1, row: +0 },
      { col: -2, row: +1 },
      { col: +1, row: -2 },
    ],
    [`${ROTATION._L}->${ROTATION._0}`]: [
      { col: +0, row: +0 },
      { col: +1, row: +0 },
      { col: -2, row: +0 },
      { col: +1, row: +2 },
      { col: -2, row: -1 },
    ],
    [`${ROTATION._0}->${ROTATION._L}`]: [
      { col: +0, row: +0 },
      { col: -1, row: +0 },
      { col: +2, row: +0 },
      { col: -1, row: -2 },
      { col: +2, row: +1 },
    ],
  };

  rotateCounterClockwise(matrix: GridMap) {
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
        row: rotatedCoord.row + this.piece.pivot.row - 1,
      });
    });

    const next_direction = COUNTER_CLOCKWISE_ROTATION_MAP[this.piece.DIRECTION];
    const rotation_string = `${this.piece.DIRECTION}->${next_direction}`;
    for (const transition of this.WALLKICK_TRANSITIONS[rotation_string]) {
      const possibleCoords = rotatedCoordinates.map((coord) => {
        return new GridCoordinate({
          col: coord.col + transition.col,
          row: coord.row + transition.row,
        });
      });

      const isMovePossible = possibleCoords.every(
        (coord) => matrix.get(coord) === null
      );

      if (isMovePossible) {
        this.piece.DIRECTION = next_direction;
        this.piece.coords = possibleCoords;
        this.piece.pivot = new GridCoordinate({
          col: this.piece.pivot.col + transition.col,
          row: this.piece.pivot.row + transition.row,
        });
        return;
      }
    }
  }

  rotateClockwise(matrix: GridMap) {
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

    const next_direction = CLOCKWISE_ROTATION_MAP[this.piece.DIRECTION];
    const rotation_string = `${this.piece.DIRECTION}->${next_direction}`;
    for (const transition of this.WALLKICK_TRANSITIONS[rotation_string]) {
      const possibleCoords = rotatedCoordinates.map((coord) => {
        return new GridCoordinate({
          col: coord.col + transition.col,
          row: coord.row + transition.row,
        });
      });

      const isMovePossible = possibleCoords.every(
        (coord) => matrix.get(coord) === null
      );

      if (isMovePossible) {
        this.piece.DIRECTION = next_direction;
        this.piece.coords = possibleCoords;
        this.piece.pivot = new GridCoordinate({
          col: this.piece.pivot.col + transition.col,
          row: this.piece.pivot.row + transition.row,
        });
        return;
      }
    }
  }
}

export class JLSTZPieceRotationStrategy extends RotationStrategy {
  WALLKICK_TRANSITIONS: Record<string, GridCoordinate[]> = {
    [`${ROTATION._0}->${ROTATION._R}`]: [
      { col: +0, row: +0 },
      { col: -1, row: +0 },
      { col: -1, row: -1 },
      { col: +0, row: +2 },
      { col: -1, row: +2 },
    ],
    [`${ROTATION._R}->${ROTATION._0}`]: [
      { col: +0, row: +0 },
      { col: +1, row: +0 },
      { col: +1, row: +1 },
      { col: +0, row: -2 },
      { col: +1, row: -2 },
    ],
    [`${ROTATION._R}->${ROTATION._2}`]: [
      { col: +0, row: +0 },
      { col: +1, row: +0 },
      { col: +1, row: +1 },
      { col: +0, row: -2 },
      { col: +1, row: -2 },
    ],
    [`${ROTATION._2}->${ROTATION._R}`]: [
      { col: +0, row: +0 },
      { col: -1, row: +0 },
      { col: -1, row: -1 },
      { col: +0, row: +2 },
      { col: -1, row: +2 },
    ],
    [`${ROTATION._2}->${ROTATION._L}`]: [
      { col: +0, row: +0 },
      { col: +1, row: +0 },
      { col: +1, row: -1 },
      { col: +0, row: +2 },
      { col: +1, row: +2 },
    ],
    [`${ROTATION._L}->${ROTATION._2}`]: [
      { col: +0, row: +0 },
      { col: -1, row: +0 },
      { col: -1, row: +1 },
      { col: +0, row: -2 },
      { col: -1, row: -2 },
    ],
    [`${ROTATION._L}->${ROTATION._0}`]: [
      { col: +0, row: +0 },
      { col: -1, row: +0 },
      { col: -1, row: +1 },
      { col: +0, row: -2 },
      { col: +1, row: -2 },
    ],
    [`${ROTATION._0}->${ROTATION._L}`]: [
      { col: +0, row: +0 },
      { col: +1, row: +0 },
      { col: +1, row: -1 },
      { col: +0, row: +2 },
      { col: +1, row: +2 },
    ],
  };

  rotateCounterClockwise(matrix: GridMap) {
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

    const next_direction = COUNTER_CLOCKWISE_ROTATION_MAP[this.piece.DIRECTION];
    const rotation_string = `${this.piece.DIRECTION}->${next_direction}`;
    for (const transition of this.WALLKICK_TRANSITIONS[rotation_string]) {
      const possibleCoords = rotatedCoordinates.map((coord) => {
        return new GridCoordinate({
          col: coord.col + transition.col,
          row: coord.row + transition.row,
        });
      });

      const isMovePossible = possibleCoords.every(
        (coord) => matrix.get(coord) === null
      );

      if (isMovePossible) {
        this.piece.DIRECTION = next_direction;
        this.piece.coords = possibleCoords;
        this.piece.pivot = new GridCoordinate({
          col: this.piece.pivot.col + transition.col,
          row: this.piece.pivot.row + transition.row,
        });
        return;
      }
    }
  }

  rotateClockwise(matrix: GridMap) {
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

    const next_direction = CLOCKWISE_ROTATION_MAP[this.piece.DIRECTION];
    const rotation_string = `${this.piece.DIRECTION}->${next_direction}`;
    for (const transition of this.WALLKICK_TRANSITIONS[rotation_string]) {
      const possibleCoords = rotatedCoordinates.map((coord) => {
        return new GridCoordinate({
          col: coord.col + transition.col,
          row: coord.row + transition.row,
        });
      });

      const isMovePossible = possibleCoords.every(
        (coord) => matrix.get(coord) === null
      );

      if (isMovePossible) {
        this.piece.DIRECTION = next_direction;
        this.piece.coords = possibleCoords;
        this.piece.pivot = new GridCoordinate({
          col: this.piece.pivot.col + transition.col,
          row: this.piece.pivot.row + transition.row,
        });
        return;
      }
    }
  }
}
