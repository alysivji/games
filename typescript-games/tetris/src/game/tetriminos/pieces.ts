import { GridCoordinate } from '../grid';
import {
  BaseRotationStrategy,
  IPieceRotationStrategy,
  OPieceRotationStrategy,
  TSZJLPieceRotationStrategy,
} from './rotation';

enum ROTATION {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

const CLOCKWISE_ROTATION_MAP = {
  [ROTATION.NORTH]: ROTATION.EAST,
  [ROTATION.EAST]: ROTATION.SOUTH,
  [ROTATION.SOUTH]: ROTATION.WEST,
  [ROTATION.WEST]: ROTATION.NORTH,
};

const COUNTER_CLOCKWISE_ROTATION_MAP = {
  [ROTATION.NORTH]: ROTATION.WEST,
  [ROTATION.WEST]: ROTATION.SOUTH,
  [ROTATION.SOUTH]: ROTATION.EAST,
  [ROTATION.EAST]: ROTATION.NORTH,
};

export abstract class Tetrimino {
  coords: GridCoordinate[];
  pivot = new GridCoordinate({ col: 4, row: -1 });
  COLOR: string;
  DIRECTION: ROTATION = ROTATION.NORTH;
  ROTATION_STRATEGY: BaseRotationStrategy;

  downOne() {
    return this.coords.map(
      (coord) => new GridCoordinate({ row: coord.row + 1, col: coord.col })
    );
  }

  moveDown() {
    this.pivot = new GridCoordinate({
      row: this.pivot.row + 1,
      col: this.pivot.col,
    });
    this.coords = this.downOne();
  }

  leftOne() {
    return this.coords.map(
      (coord) => new GridCoordinate({ row: coord.row, col: coord.col - 1 })
    );
  }

  moveLeft() {
    this.pivot = new GridCoordinate({
      row: this.pivot.row,
      col: this.pivot.col - 1,
    });
    this.coords = this.leftOne();
  }

  rightOne() {
    return this.coords.map(
      (coord) => new GridCoordinate({ row: coord.row, col: coord.col + 1 })
    );
  }

  moveRight() {
    this.pivot = new GridCoordinate({
      row: this.pivot.row,
      col: this.pivot.col + 1,
    });
    this.coords = this.rightOne();
  }

  rotateClockwise() {
    this.DIRECTION = CLOCKWISE_ROTATION_MAP[this.DIRECTION];
    this.ROTATION_STRATEGY.rotateClockwise();
  }

  rotateCounterClockwise() {
    this.DIRECTION = COUNTER_CLOCKWISE_ROTATION_MAP[this.DIRECTION];
    this.ROTATION_STRATEGY.rotateCounterClockwise();
  }
}

export class IPiece extends Tetrimino {
  COLOR = '#00ffff';
  ROTATION_STRATEGY = new IPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
    new GridCoordinate({ col: 6, row: -1 }),
  ];
}

export class OPiece extends Tetrimino {
  COLOR = '#ffff00';
  ROTATION_STRATEGY = new OPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}

export class TPiece extends Tetrimino {
  COLOR = '#800080';
  ROTATION_STRATEGY = new TSZJLPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}

export class SPiece extends Tetrimino {
  COLOR = '#00ff00';
  ROTATION_STRATEGY = new TSZJLPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
  ];
}

export class ZPiece extends Tetrimino {
  COLOR = '#ff0000';
  ROTATION_STRATEGY = new TSZJLPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 3, row: -2 }),
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}

export class JPiece extends Tetrimino {
  COLOR = '#0000ff';
  ROTATION_STRATEGY = new TSZJLPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 3, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}

export class LPiece extends Tetrimino {
  COLOR = '#ff7f00';
  ROTATION_STRATEGY = new TSZJLPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}
