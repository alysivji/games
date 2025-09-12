import { GridCoordinate } from "./grid";

enum ROTATION {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

const CLOCKWISE_ROTATION_MAP = {
  [ROTATION.NORTH]: ROTATION.EAST,
  [ROTATION.EAST]: ROTATION.SOUTH,
  [ROTATION.SOUTH]: ROTATION.WEST,
  [ROTATION.WEST]: ROTATION.NORTH
}

const COUNTER_CLOCKWISE_ROTATION_MAP = {
  [ROTATION.NORTH]: ROTATION.WEST,
  [ROTATION.WEST]: ROTATION.SOUTH,
  [ROTATION.SOUTH]: ROTATION.EAST,
  [ROTATION.EAST]: ROTATION.NORTH,
}


export abstract class Tetrimino {
  coords: GridCoordinate[];
  pivot = new GridCoordinate({ col: 4, row: -1 });
  COLOR: string;
  DIRECTION: ROTATION = ROTATION.NORTH;

  downOne() {
    return this.coords.map(coord => new GridCoordinate({ row: coord.row + 1, col: coord.col }));
  }

  moveDown() {
    this.pivot = new GridCoordinate({ row: this.pivot.row + 1, col: this.pivot.col })
    this.coords = this.downOne();
  }

  leftOne() {
    return this.coords.map(coord => new GridCoordinate({ row: coord.row, col: coord.col - 1 }));
  }

  moveLeft() {
    this.pivot = new GridCoordinate({ row: this.pivot.row, col: this.pivot.col - 1 })
    this.coords = this.leftOne();
  }

  rightOne() {
    return this.coords.map(coord => new GridCoordinate({ row: coord.row, col: coord.col + 1 }));
  }

  moveRight() {
    this.pivot = new GridCoordinate({ row: this.pivot.row, col: this.pivot.col + 1 })
    this.coords = this.rightOne();
  }

  rotateClockwise() {
    this.DIRECTION = CLOCKWISE_ROTATION_MAP[this.DIRECTION];
  }

  rotateCounterClockwise() {
    this.DIRECTION = COUNTER_CLOCKWISE_ROTATION_MAP[this.DIRECTION];
  }
}

class IPiece extends Tetrimino {
  COLOR = "#00ffff"

  coords = [
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
    new GridCoordinate({ col: 6, row: -1 }),
  ]

  // TODO -- we'll need to do this properly
  rotateClockwise() { }

  rotateCounterClockwise() { }
}

class OPiece extends Tetrimino {
  COLOR = "#ffff00"

  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]

  rotateClockwise() { }

  rotateCounterClockwise() { }
}

class TSZJLPiece extends Tetrimino {
  rotateCounterClockwise() {
    super.rotateCounterClockwise();

    const rotatedCoordinates = this.coords.map(
      coord => {
        const transposedCoord = new GridCoordinate({ col: coord.col - this.pivot.col, row: coord.row - this.pivot.row });
        const rotatedCoord = new GridCoordinate({ col: transposedCoord.row, row: - transposedCoord.col });
        return new GridCoordinate({ col: rotatedCoord.col + this.pivot.col, row: rotatedCoord.row + this.pivot.row })
      });

    // go through all 5 transformations to see
    this.coords = rotatedCoordinates;
  }

  rotateClockwise() {
    super.rotateClockwise();

    const rotatedCoordinates = this.coords.map(
      coord => {
        const transposedCoord = new GridCoordinate({ col: coord.col - this.pivot.col, row: coord.row - this.pivot.row });
        const rotatedCoord = new GridCoordinate({ col: - transposedCoord.row, row: transposedCoord.col });
        return new GridCoordinate({ col: rotatedCoord.col + this.pivot.col, row: rotatedCoord.row + this.pivot.row })
      });

    // go through all 5 transformations to see
    this.coords = rotatedCoordinates;
  }
}

class TPiece extends TSZJLPiece {
  COLOR = "#800080"

  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]
}

class SPiece extends TSZJLPiece {
  COLOR = "#00ff00"

  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
  ]

  rotateClockwise() {
    super.rotateClockwise();
  }

  rotateCounterClockwise() {
    super.rotateCounterClockwise();
  }
}

class ZPiece extends TSZJLPiece {
  COLOR = "#ff0000"

  coords = [
    new GridCoordinate({ col: 3, row: -2 }),
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]

  rotateClockwise() {
    super.rotateClockwise();
  }

  rotateCounterClockwise() {
    super.rotateCounterClockwise();
  }
}

class JPiece extends TSZJLPiece {
  COLOR = "#0000ff"

  coords = [
    new GridCoordinate({ col: 3, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]

  rotateClockwise() {
    super.rotateClockwise();
  }

  rotateCounterClockwise() {
    super.rotateCounterClockwise();
  }
}


class LPiece extends TSZJLPiece {
  COLOR = "#ff7f00"

  coords = [
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]

  rotateClockwise() {
    super.rotateClockwise();
  }

  rotateCounterClockwise() {
    super.rotateCounterClockwise();
  }
}

export const ALL_TETRIMINOS = [
  IPiece,
  JPiece,
  LPiece,
  OPiece,
  SPiece,
  TPiece,
  ZPiece,
]
