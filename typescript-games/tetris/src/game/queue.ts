import { Tetrimino } from './tetriminos';

type PieceQueueProps = {
  size: number;
  randomizer: () => Generator<Tetrimino, void, unknown>;
  nextPieceCanvas: HTMLCanvasElement;
};

export class PieceQueue {
  ctx: CanvasRenderingContext2D;

  private elements: Tetrimino[] = [];
  private randomizer: () => Generator<Tetrimino, void, unknown>;

  constructor({ size, randomizer, nextPieceCanvas }: PieceQueueProps) {
    this.ctx = nextPieceCanvas.getContext('2d')!;

    this.randomizer = randomizer;

    // Create size + 1 pieces so after first dequeue we still have 'size' pieces to show
    for (let i = 0; i < size + 1; i++) {
      this.elements.push(this.selectRandomTetromino());
    }

    this.draw(); // Show all pieces initially
  }

  dequeue() {
    const pieceToDrop = this.elements.shift()!;
    this.elements.push(this.selectRandomTetromino());
    this.draw();
    return pieceToDrop;
  }


  private draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    const piecesToShow = Math.min(5, this.elements.length); // Show up to 5 pieces, or however many we have
    if (piecesToShow === 0) return;

    const canvasWidth = this.ctx.canvas.width;   // 128px from HTML
    const canvasHeight = this.ctx.canvas.height; // 400px from HTML
    const availableHeight = canvasHeight / piecesToShow; // Height per piece
    const blockSize = Math.min(canvasWidth / 6, availableHeight / 6); // Size of each tetrimino block

    console.log(`Drawing ${piecesToShow} pieces, blockSize: ${blockSize}`);
    console.log('Total elements in queue:', this.elements.length);

    // Draw the first piecesToShow pieces
    this.elements.slice(0, piecesToShow).forEach((tetrimino, index) => {
      const minCol = Math.min(...tetrimino.coords.map(coord => coord.col));
      const maxCol = Math.max(...tetrimino.coords.map(coord => coord.col));
      const minRow = Math.min(...tetrimino.coords.map(coord => coord.row));
      const maxRow = Math.max(...tetrimino.coords.map(coord => coord.row));

      const pieceWidth = (maxCol - minCol + 1) * blockSize;
      const pieceHeight = (maxRow - minRow + 1) * blockSize;

      // Center the piece horizontally and position vertically
      const offsetX = (canvasWidth - pieceWidth) / 2;
      const offsetY = index * availableHeight + (availableHeight - pieceHeight) / 2;

      console.log(`Drawing piece ${index} at offsetX: ${offsetX}, offsetY: ${offsetY}`);

      tetrimino.coords.forEach(coord => {
        const x = offsetX + (coord.col - minCol) * blockSize;
        const y = offsetY + (coord.row - minRow) * blockSize;

        this.ctx.fillStyle = tetrimino.COLOR;
        this.ctx.fillRect(x + 1, y + 1, blockSize - 0.5, blockSize - 0.5); // 1px gap like main board
      });
    });
  }

  private selectRandomTetromino() {
    return this.randomizer().next().value!;
  }
}
