import { Tetris } from './game';

const canvas = document.querySelector<HTMLCanvasElement>('#tetris')!;
const tetris = new Tetris({ canvas });

(() => {
  function gameLoop(currentTime: number) {
    tetris.stopGameLoop = window.requestAnimationFrame(gameLoop);

    const deltaTime = currentTime - tetris.lastTick;

    tetris.update(deltaTime);
    tetris.draw();
  }

  tetris.start({ tick: performance.now() });
  gameLoop(performance.now());
})();
