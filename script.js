const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetButton = document.querySelector("#resetButton");
const startButton = document.querySelector("#startButton");
//Directional buttons for touch devices
const buttonUp = document.querySelector("#button-up");
const buttonLeft = document.querySelector("#button-left");
const buttonDown = document.querySelector("#button-down");
const buttonRight = document.querySelector("#button-right");
//Variables
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "black";
const snakeColor = "pink";
const snakeBorder = "black";
const unitSize = 30;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];
let tickInterval = 140;
const speedIncrease = 5;
let foodCounter = 0;
const foodColors = ["red", "blue", "purple", "coral", "green"];
const foodEmojis = ["🍎", "🍭"];

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);
//Prevents possible scrolling when using arrowbuttons,
document.body.addEventListener("touchstart", (e) => {
  if (e.target.classList.contains("button-arrows")) {
    e.preventDefault();
  }
});

// Starts the game
function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
  resetButton.textContent = "Playing Game";
}

// Loops the game
function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      moveSnake();
      checkGameOver();
      drawFood();
      drawSnake();
      nextTick();
    }, tickInterval);
  } else {
    displayGameOver();
  }
}

// Clears the gameboard
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

// Finds a random spot on gameboard to place the food.
function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
  drawFood();
}
// Makes the emojis that represents food
function drawFood() {
  const foodFillColor = foodColors[foodCounter % foodColors.length];
  let foodEmoji = foodEmojis[0]; // Default to apple

  if (foodCounter % 5 === 0) {
    foodEmoji = foodEmojis[1]; // Change to banana
  }

  const textWidth = ctx.measureText(foodEmoji).width;
  const textHeight = ctx.measureText("M").width; // Approximation of height

  const centerX = foodX + unitSize / 2 - textWidth / 2;
  const centerY = foodY + unitSize / 2 + textHeight / 2;

  ctx.font = `${unitSize}px sans-serif`;
  ctx.fillStyle = foodFillColor;
  ctx.fillText(foodEmoji, centerX, centerY);
}

// Makes the snake move
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);
  // If food is eaten
  if (snake[0].x === foodX && snake[0].y === foodY) {
    score += 1;
    scoreText.textContent = score;
    foodCounter += 1;
    createFood();
    if (foodCounter % 5 === 0) {
      increaseSpeed();
    }
  } else {
    snake.pop();
  }
}
function increaseSpeed() {
  tickInterval -= speedIncrease;
  if (tickInterval < 0) {
    tickInterval = 0;
  }
}

//Snake as squares:
function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
//Snake as circles:
// function drawSnake() {
//   ctx.fillStyle = snakeColor;
//   ctx.strokeStyle = snakeBorder;
//   snake.forEach((snakePart) => {
//     ctx.beginPath();
//     ctx.arc(
//       snakePart.x + unitSize / 2,
//       snakePart.y + unitSize / 2,
//       unitSize / 2,
//       0,
//       2 * Math.PI
//     );
//     ctx.fill();
//     ctx.stroke();
//   });
// }
// Decreasing snake design:
// function drawSnake() {
//   ctx.fillStyle = snakeColor;
//   ctx.strokeStyle = snakeBorder;

//   snake.forEach((snakePart, index) => {
//     const maxRadius = unitSize / 2;
//     const minRadius = 2;
//     const radius = maxRadius - (index * (maxRadius - minRadius)) / snake.length;
//     const x = snakePart.x + unitSize / 2;
//     const y = snakePart.y + unitSize / 2;

//     ctx.beginPath();
//     ctx.arc(x, y, radius, 0, 2 * Math.PI);
//     ctx.fill();
//     ctx.stroke();
//   });
// }

// Snake event handlers
function changeDirection(event) {
  const keyPressed = event.keyCode;
  const directionMap = {
    37: { x: -unitSize, y: 0 }, // LEFT
    38: { x: 0, y: -unitSize }, // UP
    39: { x: unitSize, y: 0 }, // RIGHT
    40: { x: 0, y: unitSize }, // DOWN
  };

  const newVelocity = directionMap[keyPressed];
  if (newVelocity) {
    const { x, y } = newVelocity;
    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    if (
      (x !== 0 && !goingRight) ||
      !goingLeft ||
      (y !== 0 && !goingUp) ||
      !goingDown
    ) {
      xVelocity = x;
      yVelocity = y;
    }
  }
}

// Checks game status
function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
    case snake[0].x >= gameWidth:
    case snake[0].y < 0:
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      running = false;
      break;
    }
  }
}
// When game is over
function displayGameOver() {
  ctx.font = "50px Tektur";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
  resetButton.textContent = "Play Again";
}

// Function to reset game
function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  tickInterval = 140;
  foodCounter = 0;

  gameStart();
}

//Starts the game instantly by load
gameStart();
//Click Event Handlers
buttonUp.addEventListener("click", () => changeDirection({ keyCode: 38 }));
buttonLeft.addEventListener("click", () => changeDirection({ keyCode: 37 }));
buttonDown.addEventListener("click", () => changeDirection({ keyCode: 40 }));
buttonRight.addEventListener("click", () => changeDirection({ keyCode: 39 }));
//Touch Event Handlers
buttonUp.addEventListener("touchstart", () => changeDirection({ keyCode: 38 }));
buttonLeft.addEventListener("touchstart", () =>
  changeDirection({ keyCode: 37 })
);
buttonDown.addEventListener("touchstart", () =>
  changeDirection({ keyCode: 40 })
);
buttonRight.addEventListener("touchstart", () =>
  changeDirection({ keyCode: 39 })
);
