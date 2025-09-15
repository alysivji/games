export class GridCoordinate {
  row: number;
  col: number;

  constructor({ row, col }: { row: number; col: number }) {
    this.row = row;
    this.col = col;
  }
}

export class GridMap {
  numCols: number;
  numRows: number;

  map: Map<string, string | null>;

  constructor({ numCols, numRows }: { numCols: number; numRows: number }) {
    this.map = new Map();
    this.numCols = numCols;
    this.numRows = numRows;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const coord = new GridCoordinate({ row, col });
        this.set(coord, null);
      }
    }
  }

  set(key: GridCoordinate, value: string | null) {
    const keyToUse = GridMap.coordToStringKey(key);
    return this.map.set(keyToUse, value);
  }

  get(key: GridCoordinate) {
    const keyToUse = GridMap.coordToStringKey(key);
    return this.map.get(keyToUse);
  }

  has(key: GridCoordinate) {
    const keyToUse = GridMap.coordToStringKey(key);
    return this.map.has(keyToUse);
  }

  get filledCoordinates() {
    const filledCoordinates: GridCoordinate[] = [];

    for (const key of this.map.keys()) {
      const value = this.map.get(key);
      if (typeof value === 'string') {
        filledCoordinates.push(GridMap.fromCoordString(key));
      }
    }

    return filledCoordinates;
  }

  get rowsToClear() {
    const fullRows: number[] = [];

    for (let row = 0; row < this.numRows; row++) {
      const rowValues: Array<string | null> = [];

      for (let col = 0; col < this.numCols; col++) {
        const coord = new GridCoordinate({ row: row, col: col });
        rowValues.push(this.get(coord)!);
      }

      if (rowValues.every((value) => value !== null)) {
        fullRows.push(row);
      }
    }

    return fullRows.sort((a, b) => b - a);
  }

  clearRow(row: number) {
    for (let col = 0; col < this.numCols; col++) {
      const coord = new GridCoordinate({ row: row, col: col });
      this.set(coord, null);
    }
  }

  private static coordToStringKey(key: GridCoordinate) {
    return `row=${key.row},col=${key.col}`;
  }

  private static fromCoordString(coordString: string): GridCoordinate {
    const regex = /row=(-?\d+),col=(-?\d+)/;
    const match = coordString.match(regex);

    if (!match) {
      throw new Error('should not get here');
    }

    const row = parseInt(match[1], 10);
    const col = parseInt(match[2], 10);
    return new GridCoordinate({ row, col });
  }
}
