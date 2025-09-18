import { Tetris } from './game';

const tetrisCanvas = document.querySelector<HTMLCanvasElement>('#tetris')!;
const holdPieceCanvas = document.querySelector<HTMLCanvasElement>('#hold')!;
const nextPieceCanvas = document.querySelector<HTMLCanvasElement>('#next')!;
const tetris = new Tetris({ tetrisCanvas, holdPieceCanvas, nextPieceCanvas });

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
