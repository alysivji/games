# Tetris

## Instructions

1. `git clone` repo
1. `npm install`
1. `npm run start`

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
  - [x] [Anatomy of a Video Game](https://developer.mozilla.org/en-US/docs/Games/Anatomy)
  - [ ] [Implementing controls using the Gamepad API](https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API)
  - Events
    - [keydown](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event)
    - [keyup](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event)
- Stanford: [CS 100 Level OOP Tetris Handout](https://web.stanford.edu/class/archive/cs/cs108/cs108.1092/handouts/11HW2Tetris.pdf)
- Toolkits
  - [Easel.js](https://createjs.com/easeljs)
  - [pixi.js: The HTML5 Creation Engine](https://pixijs.com/)
- Tetris
  - [2009 Design Guidelines](https://archive.org/details/2009-tetris-variant-concepts_202201/2009%20Tetris%20Design%20Guideline/)
    - [Summary](https://tetris.fandom.com/wiki/Tetris_Guideline)
  - [Spawn location](https://harddrop.com/wiki/Spawn_Location)
- Other Projects
  - [tetrigo](https://github.com/Broderick-Westrope/tetrigo)

### AI

- Google: [how to train a neural network to play tetris](https://www.google.com/search?client=firefox-b-1-d&q=how+to+train+a+neural+network+to+play+tetris)
- Reddit: [I created a Tetris AI! I'm still working on making it able to do t-spins, and the parameters aren't fine-tuned yet.](https://www.reddit.com/r/Tetris/comments/na4dqm/i_created_a_tetris_ai_im_still_working_on_making/)
- Reddit: [Machine Learning: How I made an AI that learns to play Tetris using Convolutional Neural Network (article, video, live demo)](https://www.reddit.com/r/compsci/comments/fvboab/machine_learning_how_i_made_an_ai_that_learns_to/)

## Todo

- [x] end game state
  - spawn in level rows and figure out how to handle
- [ ] controls
  - [x] key press left and right
  - [ ] rotate
    - https://harddrop.com/wiki/SRS
  - [ ] reach: move pieces down faster, drop pieces
- [ ] das / arr
  - https://tetris.wiki/DAS
  - https://tetrisconcept.net/threads/nes-tetris-das.3035/
- [ ] clearing lines
  - keep score
- [ ] ui -- ghost where the pieces ends up
- [ ] 7 bag randomize piece
- [ ] next queue
  - [ ] next piece
  - [ ] next 5 pieces
- [ ] hold piece
- [ ] reach: gamepad API
