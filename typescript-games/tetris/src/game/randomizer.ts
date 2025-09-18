import { ALL_TETRIMINOS, Tetrimino } from './tetriminos';

export function* simpleRandomizer() {
  while (true) {
    const randomIndex = Math.floor(Math.random() * ALL_TETRIMINOS.length);
    const TetriminoClass = ALL_TETRIMINOS[randomIndex];
    yield new TetriminoClass();
  }
}

export function* sevenBagRandomizer() {
  // reocmmended in the tetris guideline

  const queue: (typeof Tetrimino)[] = [];
  while (true) {
    if (queue.length === 0) {
      const shuffledBag = shuffleArray([...ALL_TETRIMINOS]);
      queue.push(...shuffledBag);
    }

    const TetriminoClass = queue.shift()!;
    yield new TetriminoClass();
  }
}

function shuffleArray<T>(array: Array<T>) {
  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  // Got this from Google search -- AI results

  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
