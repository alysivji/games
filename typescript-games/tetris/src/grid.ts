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
    const keyToUse = GridMap.transformed_key(key);
    return this._map.set(keyToUse, value);
  }

  get(key: GridCoordinate) {
    const keyToUse = GridMap.transformed_key(key);
    return this._map.get(keyToUse);
  }

  has(key: GridCoordinate) {
    const keyToUse = GridMap.transformed_key(key);
    return this._map.has(keyToUse);
  }

  private static transformed_key(key: GridCoordinate) {
    return `row=${key.row},col=${key.col}`
  }
}
