import { dictionary } from "./dictionary.js";

// currently a mistake where you'll multiple yellows if a letter in the
// secret word shows up twice
const tdictionary = [
  "planet",
  "cosmos",
  "galaxy",
  "saturn",
  "nebula",
  "axioms",
  "hijack",
];

const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(6).fill("")),
  currentRow: 0,
  currentCol: 0,
};

console.log(state.secret);

function drawBox(container, row, col, letter = "") {
  const box = document.createElement("div");
  box.className = "box";
  box.id = `box${row}${col}`;
  box.textContent = letter;
  container.appendChild(box);
  return box;
}

//Synchronising UI with game state
function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      //Note how we're retrieving box elements one by one from DOM
      //Then sitting the .textContent to the state.grid values
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawGrid(container) {
  const grid = document.createElement("div");
  grid.className = "grid";

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      drawBox(grid, i, j);
    }
  }
  container.appendChild(grid);
}

function registerKeyboardEvents() {
  //Creating an event listener for the keydown event
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === "Enter") {
      if (state.currentCol === 6) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else {
          alert(
            "INVALID (it might be actually just text me and ill add it to the dictionary lmaoo)."
          );
        }
      }
    }
    if (key === "Backspace") {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentWord() {
  return state.grid[state.currentRow].join("");
}

function isWordValid(word) {
  return dictionary.includes(word);
}

function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 500;

  for (let i = 0; i < 6; i++) {
    //looping over every letter in row
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;

    //CRUCIAL NOTE. The code below changes colours of boxes
    //Note the delay. It's the box number * the animation duration / 2
    setTimeout(() => {
      if (letter === state.secret[i]) {
        box.classList.add("right-position");
      } else if (state.secret.includes(letter)) {
        box.classList.add("wrong-position");
      } else {
        box.classList.add("wrong");
      }
    }, ((i + 1) * animation_duration) / 2);
    box.classList.add("animated");
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      alert("CONGRATS NIGGA");
    } else if (isGameOver) {
      alert("you FUCKED UP");
    }
  }),
    100 * animation_duration;
}

function isLetter(key) {
  //the i flag allows for case insensitivity
  return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
  if (state.currentCol === 6) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = "";
  state.currentCol--;
}

function startup() {
  const game = document.getElementById("game");
  drawGrid(game);

  registerKeyboardEvents();
}

startup();
