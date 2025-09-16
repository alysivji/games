import { Tetrimino } from './tetriminos';

type PieceQueueProps = {
  size: number;
  randomizer: () => Generator<Tetrimino, void, unknown>;
};

export class PieceQueue {
  private elements: Tetrimino[] = [];
  private randomizer: () => Generator<Tetrimino, void, unknown>;

  constructor({ size, randomizer }: PieceQueueProps) {
    this.randomizer = randomizer;

    for (let i = 0; i < size; i++) {
      this.elements.push(this.selectRandomTetromino());
    }
  }

  get length() {
    return this.elements.length;
  }

  dequeue() {
    this.elements.push(this.selectRandomTetromino());
    return this.elements.shift()!;
  }

  private selectRandomTetromino() {
    return this.randomizer().next().value!;
  }
}
