# Tetris

## Game Loop

[link](https://developer.mozilla.org/en-US/docs/Games)

- games are constantly looping thru the following stages until a condition (such as winning, losing, etc) happen
  - **present** the user(s) with a situation
  - **accept** their input
  - **interpret** those signals into actions
  - **calculate** a new situation resulting from those acts
- game loops are advanced by
  - user input and sleeps until they provide it (turn-based)
  - others depend on time, each frame of the animation process the cycle
    - window.requestAnimationFrame
- javaScript works best with events and callback function

## Resources

- MDN: [Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- MDN: [Game Development](https://developer.mozilla.org/en-US/docs/Games)
  - [ ] [Anatomy of a Video Game](https://developer.mozilla.org/en-US/docs/Games/Anatomy)
  - [ ] [Implementing controls using the Gamepad API](https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API)
- Stanford: [CS 100 Level OOP Tetris Handout](https://web.stanford.edu/class/archive/cs/cs108/cs108.1092/handouts/11HW2Tetris.pdf)
- Toolkits
  - [Easel.js](https://createjs.com/easeljs)
  - [pixi.js: The HTML5 Creation Engine](https://pixijs.com/)
- Tetris
  - [Spawn location](https://harddrop.com/wiki/Spawn_Location)

## Notes

- Spawn on line 0 and then we can worry about spawning above the field
