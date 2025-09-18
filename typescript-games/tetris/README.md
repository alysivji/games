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

## Keyboard events

- for rotation keys, we want to use `edge triggers`
- for lateral and downward movement keys, we want to use `edge triggers` for first movement so it feels reponsive
  - holding down lateral movement keys triggers DAS and ARR
  - holding down down key should be constant speed vs getting faster by pressing down

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
  - Piece Randomization
    - Tetris Wiki: [https://tetris.wiki/Random_Generator]
    - Blog: [The history of Tetris randomizers](https://simon.lc/the-history-of-tetris-randomizers) | [HackerNews discussion](https://news.ycombinator.com/item?id=20872110)
    - Blog: [Is Tetris Biased?](https://babeheim.com/blog/2020-12-29-is-tetris-biased/)
  - [Clearing Lines](https://tetris.wiki/Line_clear)
- Other Projects
  - [tetrigo](https://github.com/Broderick-Westrope/tetrigo)

### AI

- Google: [how to train a neural network to play tetris](https://www.google.com/search?client=firefox-b-1-d&q=how+to+train+a+neural+network+to+play+tetris)
- Reddit: [I created a Tetris AI! I'm still working on making it able to do t-spins, and the parameters aren't fine-tuned yet.](https://www.reddit.com/r/Tetris/comments/na4dqm/i_created_a_tetris_ai_im_still_working_on_making/)
- Reddit: [Machine Learning: How I made an AI that learns to play Tetris using Convolutional Neural Network (article, video, live demo)](https://www.reddit.com/r/compsci/comments/fvboab/machine_learning_how_i_made_an_ai_that_learns_to/)

## Todo

- [x] end game state
  - spawn in level rows and figure out how to handle
- [x] controls
  - [x] key press left and right
  - [x] rotate
  - [x] hard drop
- [x] clearing lines
- [x] 7 bag randomize piece
- [x] show next queue
  - [x] next piece
  - [x] next 5 pieces
- [x] hold piece
- [ ] ui -- ghost where the pieces ends up
- [ ] das / arr
  - https://tetris.wiki/DAS
  - https://tetrisconcept.net/threads/nes-tetris-das.3035/
- [ ] slide piece before it locks
- [ ] score
- [ ] reach: gamepad API
- [ ] collect stats for things like # rotations, # drops, pieces seen
- [ ] other rotation systems
  - [ ] https://harddrop.com/wiki/Nintendo_Rotation_System
  - [ ] https://harddrop.com/wiki/ARS

## Chat GPT suggestions

- [ ] how to handle both left and right being pushed together
- [ ] how to handle both rotates being pushed together
- [ ] maybe use an edge trigger on left and right so it's more responsive

## State Machine

With XState, we can reduce a lot of the race conditions.

Let's figure out how to move input into xstate and then we can build state machines for other things.
