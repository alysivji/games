export class Tetrimino {

}

export class IPiece implements Tetrimino {
  COLOR = "#00ffff"

  pointsToDraw = [
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
  ]
}

export class OPiece implements Tetrimino {
  COLOR = "#ffff00"

  pointsToDraw = [
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
  ]
}

export class TPiece implements Tetrimino {
  COLOR = "#800080"

  pointsToDraw = [
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 4, y: 1 },
  ]
}

export class SPiece implements Tetrimino {
  COLOR = "#00ff00"

  pointsToDraw = [
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 5, y: 1 },
    { x: 4, y: 1 },
  ]
}

export class ZPiece implements Tetrimino {
  COLOR = "#ff0000"

  pointsToDraw = [
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
  ]
}

export class JPiece implements Tetrimino {
  COLOR = "#0000ff"

  pointsToDraw = [
    { x: 5, y: 0 },
    { x: 5, y: 1 },
    { x: 5, y: 2 },
    { x: 4, y: 2 },
  ]
}


export class LPiece implements Tetrimino {
  COLOR = "#ff7f00"

  pointsToDraw = [
    { x: 4, y: 0 },
    { x: 4, y: 1 },
    { x: 4, y: 2 },
    { x: 5, y: 2 },
  ]
}
