import { Tetris } from "./tetris";

const tetris = new Tetris({ level: 10 });

(() => {
  function gameLoop(currentTime: number) {
    tetris.stopGameLoop = window.requestAnimationFrame(gameLoop);

    const deltaTime = currentTime - tetris.lastTick;

    tetris.update(deltaTime)
    tetris.draw();
  }

  tetris.start({ tick: performance.now() });
  gameLoop(performance.now());
})();
