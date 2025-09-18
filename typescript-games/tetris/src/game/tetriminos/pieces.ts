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

  private move({ col, row }: { col: number; row: number }) {
    return {
      pivot: new GridCoordinate({
        col: this.pivot.col + col,
        row: this.pivot.row + row,
      }),
      coords: this.coords.map(
        (coord) =>
          new GridCoordinate({ col: coord.col + col, row: coord.row + row })
      ),
    };
  }

  moveDown(matrix: GridMap) {
    const { pivot, coords: newPieceLocation } = this.move({ col: 0, row: 1 });

    const isMovePossible = newPieceLocation
      .filter((coord) => coord.row >= 0)
      .every((coord) => matrix.get(coord) === null);

    if (!isMovePossible) {
      return false;
    }

    this.pivot = pivot;
    this.coords = newPieceLocation;
    return true;
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

  copy(): this {
    const clone = Object.create(Object.getPrototypeOf(this)) as this;

    // Deep-copy the *data* of the instance, then assign onto the new shell.
    // You can swap `structuredClone` for your preferred deep-copy (e.g., lodash.cloneDeep).
    const data = structuredClone(this); // does not call constructors
    Object.assign(clone, data);
    clone.COLOR = `${clone.COLOR}50`;

    return clone;
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
