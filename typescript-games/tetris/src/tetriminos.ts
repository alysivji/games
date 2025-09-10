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
  COLOR: string;
  DIRECTION: ROTATION = ROTATION.NORTH;

  downOne() {
    return this.coords.map(coord => new GridCoordinate({ row: coord.row + 1, col: coord.col }));
  }

  moveDown() {
    this.coords = this.downOne();
  }

  leftOne() {
    return this.coords.map(coord => new GridCoordinate({ row: coord.row, col: coord.col - 1 }));
  }

  moveLeft() {
    this.coords = this.leftOne();
  }

  rightOne() {
    return this.coords.map(coord => new GridCoordinate({ row: coord.row, col: coord.col + 1 }));
  }

  moveRight() {
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

  rotateClockwise() {
    super.rotateClockwise();
  }

  rotateCounterClockwise() {
    super.rotateCounterClockwise();
  }
}

class OPiece extends Tetrimino {
  COLOR = "#ffff00"

  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 5, row: -2 }),
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

class TPiece extends Tetrimino {
  COLOR = "#800080"

  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
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

class SPiece extends Tetrimino {
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

class ZPiece extends Tetrimino {
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

class JPiece extends Tetrimino {
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


class LPiece extends Tetrimino {
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
