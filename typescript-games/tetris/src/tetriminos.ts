import { GridCoordinate } from "./grid";


export class Tetrimino {
  coords: GridCoordinate[];
  COLOR: string;

  step() {
    this.coords = this.coords.map(coord => new GridCoordinate({ row: coord.row + 1, col: coord.col }));
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
}

class OPiece extends Tetrimino {
  COLOR = "#ffff00"

  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]
}

class TPiece extends Tetrimino {
  COLOR = "#800080"

  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]
}

class SPiece extends Tetrimino {
  COLOR = "#00ff00"

  coords = [
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
  ]
}

class ZPiece extends Tetrimino {
  COLOR = "#ff0000"

  coords = [
    new GridCoordinate({ col: 3, row: -2 }),
    new GridCoordinate({ col: 4, row: -2 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]
}

class JPiece extends Tetrimino {
  COLOR = "#0000ff"

  coords = [
    new GridCoordinate({ col: 3, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]
}


class LPiece extends Tetrimino {
  COLOR = "#ff7f00"

  coords = [
    new GridCoordinate({ col: 5, row: -2 }),
    new GridCoordinate({ col: 3, row: -1 }),
    new GridCoordinate({ col: 4, row: -1 }),
    new GridCoordinate({ col: 5, row: -1 }),
  ]
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
