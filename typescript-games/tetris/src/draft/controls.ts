const canvas = document.querySelector<HTMLCanvasElement>('#tetris')!;

let leftKeyPressed: boolean = false;
let leftKeyPressedTime: number;

let rightKeyPressed: boolean = false;
let rightKeyPressedTime: number;

window.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft' && !leftKeyPressed) {
    leftKeyPressed = true;
    leftKeyPressedTime = performance.now();

    console.log('keyDown', e.key);
  }

  if (e.key === 'ArrowRight' && !rightKeyPressed) {
    rightKeyPressed = true;
    rightKeyPressedTime = performance.now();

    console.log('keyDown', e.key);
  }
});

window.addEventListener('keyup', (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    leftKeyPressed = false;
    const leftKeyStop = performance.now();
    const leftKeyElapsed = leftKeyStop - leftKeyPressedTime;

    console.log('keyUp', e.key, 'for', leftKeyElapsed);
  }

  if (e.key === 'ArrowRight') {
    rightKeyPressed = false;
    const rightKeyStop = performance.now();
    const rightKeyElapsed = rightKeyStop - rightKeyPressedTime;

    console.log('keyUp', e.key, 'for', rightKeyElapsed);
  }
});
