import { GridCoordinate, GridMap } from '../grid';
import {
  RotationStrategy,
  IPieceRotationStrategy,
  OPieceRotationStrategy,
  JLSTZPieceRotationStrategy,
  ROTATION,
} from './rotation';

export class Tetrimino {
  coords: GridCoordinate[];
  pivot = new GridCoordinate({ col: 4, row: -1 });
  COLOR: string;
  DIRECTION: ROTATION = ROTATION._0;
  ROTATION_STRATEGY: RotationStrategy;

  isVisible() {
    // return true;
    return this.coords.some((coord) => coord.row >= 0);
  }

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

  rotateClockwise(matrix: GridMap) {
    this.ROTATION_STRATEGY.rotateClockwise(matrix);
  }

  rotateCounterClockwise(matrix: GridMap) {
    this.ROTATION_STRATEGY.rotateCounterClockwise(matrix);
  }
}

export class IPiece extends Tetrimino {
  COLOR = '#00ffff';
  ROTATION_STRATEGY = new IPieceRotationStrategy(this);
  pivot = new GridCoordinate({ col: 5, row: 0 });
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
  pivot = new GridCoordinate({ col: 5, row: -1 });
  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}

export class TPiece extends Tetrimino {
  COLOR = '#800080';
  ROTATION_STRATEGY = new JLSTZPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}

export class SPiece extends Tetrimino {
  COLOR = '#00ff00';
  ROTATION_STRATEGY = new JLSTZPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
  ];
}

export class ZPiece extends Tetrimino {
  COLOR = '#ff0000';
  ROTATION_STRATEGY = new JLSTZPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 3, row: -2 }),
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}

export class JPiece extends Tetrimino {
  COLOR = '#0000ff';
  ROTATION_STRATEGY = new JLSTZPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 3, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}

export class LPiece extends Tetrimino {
  COLOR = '#ff7f00';
  ROTATION_STRATEGY = new JLSTZPieceRotationStrategy(this);
  coords = [
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ];
}
