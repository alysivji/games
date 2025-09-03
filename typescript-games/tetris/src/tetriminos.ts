export class Tetrimino {
  pointsToDraw: { x: number, y: number }[];

  step() {
    this.pointsToDraw = this.pointsToDraw.map(point => ({ x: point.x + 1, y: point.y }));
  }
}

export class IPiece extends Tetrimino {
  COLOR = "#00ffff"

  pointsToDraw = [
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
  ]
}

export class OPiece extends Tetrimino {
  COLOR = "#ffff00"

  pointsToDraw = [
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
  ]
}

export class TPiece extends Tetrimino {
  COLOR = "#800080"

  pointsToDraw = [
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 4, y: 1 },
  ]
}

export class SPiece extends Tetrimino {
  COLOR = "#00ff00"

  pointsToDraw = [
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 5, y: 1 },
    { x: 4, y: 1 },
  ]
}

export class ZPiece extends Tetrimino {
  COLOR = "#ff0000"

  pointsToDraw = [
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
  ]
}

export class JPiece extends Tetrimino {
  COLOR = "#0000ff"

  pointsToDraw = [
    { x: 5, y: 0 },
    { x: 5, y: 1 },
    { x: 5, y: 2 },
    { x: 4, y: 2 },
  ]
}


export class LPiece extends Tetrimino {
  COLOR = "#ff7f00"

  pointsToDraw = [
    { x: 4, y: 0 },
    { x: 4, y: 1 },
    { x: 4, y: 2 },
    { x: 5, y: 2 },
  ]
}
