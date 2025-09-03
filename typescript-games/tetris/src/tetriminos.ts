import { GridCoordinate } from "./grid";


export class Tetrimino {
  coords: GridCoordinate[];

  step() {
    this.coords = this.coords.map(coord => new GridCoordinate({ row: coord.row + 1, col: coord.col }));
  }
}

export class IPiece extends Tetrimino {
  COLOR = "#00ffff"

  coords = [
    new GridCoordinate({ col: 2, row: 0 }),
    new GridCoordinate({ col: 3, row: 0 }),
    new GridCoordinate({ col: 4, row: 0 }),
    new GridCoordinate({ col: 5, row: 0 }),
  ]
}

export class OPiece extends Tetrimino {
  COLOR = "#ffff00"

  coords = [
    new GridCoordinate({ col: 4, row: 0 }),
    new GridCoordinate({ col: 5, row: 0 }),
    new GridCoordinate({ col: 4, row: 1 }),
    new GridCoordinate({ col: 5, row: 1 }),
  ]
}

export class TPiece extends Tetrimino {
  COLOR = "#80008093"

  coords = [
    new GridCoordinate({ col: 3, row: 0 }),
    new GridCoordinate({ col: 4, row: 0 }),
    new GridCoordinate({ col: 5, row: 0 }),
    new GridCoordinate({ col: 4, row: 1 }),
  ]
}

export class SPiece extends Tetrimino {
  COLOR = "#00ff00"

  coords = [
    new GridCoordinate({ col: 5, row: 0 }),
    new GridCoordinate({ col: 6, row: 0 }),
    new GridCoordinate({ col: 5, row: 1 }),
    new GridCoordinate({ col: 4, row: 1 }),
  ]
}

export class ZPiece extends Tetrimino {
  COLOR = "#ff0000"

  coords = [
    new GridCoordinate({ col: 4, row: 0 }),
    new GridCoordinate({ col: 5, row: 0 }),
    new GridCoordinate({ col: 5, row: 1 }),
    new GridCoordinate({ col: 6, row: 1 }),
  ]
}

export class JPiece extends Tetrimino {
  COLOR = "#0000ff"

  coords = [
    new GridCoordinate({ col: 5, row: 0 }),
    new GridCoordinate({ col: 5, row: 1 }),
    new GridCoordinate({ col: 5, row: 2 }),
    new GridCoordinate({ col: 4, row: 2 }),
  ]
}


export class LPiece extends Tetrimino {
  COLOR = "#ff7f00"

  coords = [
    new GridCoordinate({ col: 4, row: 0 }),
    new GridCoordinate({ col: 4, row: 1 }),
    new GridCoordinate({ col: 4, row: 2 }),
    new GridCoordinate({ col: 5, row: 2 }),
  ]
}
