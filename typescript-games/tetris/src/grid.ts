export class GridCoordinate {
  row: number
  col: number

  constructor({ row, col }: { row: number, col: number }) {
    this.row = row;
    this.col = col;
  }
}

export class GridMap {
  _map: Map<string, string | null>

  constructor() {
    this._map = new Map();
  }

  set(key: GridCoordinate, value: string | null) {
    const keyToUse = GridMap.coordToStringKey(key);
    return this._map.set(keyToUse, value);
  }

  get(key: GridCoordinate) {
    const keyToUse = GridMap.coordToStringKey(key);
    return this._map.get(keyToUse);
  }

  has(key: GridCoordinate) {
    const keyToUse = GridMap.coordToStringKey(key);
    return this._map.has(keyToUse);
  }

  get filledCoordinates() {
    const filledCoordinates: GridCoordinate[] = [];

    for (const key of this._map.keys()) {
      const value = this._map.get(key);
      if (typeof (value) === "string") {
        filledCoordinates.push(GridMap.fromCoordString(key))
      }
    }

    return filledCoordinates
  }

  private static coordToStringKey(key: GridCoordinate) {
    return `row=${key.row},col=${key.col}`
  }

  private static fromCoordString(coordString: string): GridCoordinate {
    const regex = /row=(-?\d+),col=(-?\d+)/;
    const match = coordString.match(regex);

    if (!match) {
      throw new Error("should not get here")
    }

    const row = parseInt(match[1], 10);
    const col = parseInt(match[2], 10);
    return new GridCoordinate({ row, col });
  }
}
