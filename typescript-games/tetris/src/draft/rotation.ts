// https://en.wikipedia.org/wiki/Rotation_matrix

interface Point {
  x: number
  y: number
}

function rotateCounterClockwise(point: Point) {
  return {
    x: point.x * Math.cos(Math.PI / 2) - point.y * Math.sin(Math.PI / 2),
    y: point.x * Math.sin(Math.PI / 2) + point.y * Math.cos(Math.PI / 2)
  }
}

function rotateClockwise(point: Point) {
  return {
    x: point.x * Math.cos(- Math.PI / 2) - point.y * Math.sin(- Math.PI / 2),
    y: point.x * Math.sin(-Math.PI / 2) + point.y * Math.cos(- Math.PI / 2)
  }
}

const point = { x: 1, y: 1 };
console.log("point", point);

const pointRotatedClockwise = rotateClockwise(point);
console.log("rotated clockwise", pointRotatedClockwise);

const pointRotatedCounterClockwise = rotateCounterClockwise(point);
console.log("rotated counterclockwise", pointRotatedCounterClockwise);
