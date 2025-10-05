// 🎨 ETCH-A-SKETCH GAME WITH FOOD + SELF-COLLISION DETECTION

// =========================
// 🔹 ELEMENT SELECTION
// =========================
const canvas = document.querySelector('#etch-a-sketch');
const ctx = canvas.getContext('2d');
const shakeButton = document.querySelector('.shake');
const scoreLabel = document.querySelector('#score-label');

// =========================
// 🔹 CONSTANTS & VARIABLES
// =========================
const MOVE_AMOUNT = 50;
const { width, height } = canvas;

let x = Math.floor(Math.random() * width);
let y = Math.floor(Math.random() * height);
let hue = 0;
let score = 0;

let foodX = Math.floor(Math.random() * width);
let foodY = Math.floor(Math.random() * height);

const visited = new Set();
visited.add(`${x},${y}`);

// =========================
// 🔹 INITIAL CANVAS SETUP
// =========================
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = MOVE_AMOUNT;

function startPoint() {
  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y);
  ctx.stroke();
}

startPoint();
drawFood();

// =========================
// 🔹 DRAW FOOD FUNCTION
// =========================
function drawFood() {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(foodX, foodY, 10, 0, Math.PI * 2);
  ctx.fill();
}

// =========================
// 🔹 DRAW FUNCTION
// =========================
function draw({ key }) {
  hue += 1;
  ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
  ctx.beginPath();
  ctx.moveTo(x, y);

  switch (key) {
    case 'ArrowUp':
      y -= MOVE_AMOUNT;
      break;
    case 'ArrowRight':
      x += MOVE_AMOUNT;
      break;
    case 'ArrowDown':
      y += MOVE_AMOUNT;
      break;
    case 'ArrowLeft':
      x -= MOVE_AMOUNT;
      break;
    default:
      return;
  }

  const coord = `${x},${y}`;

  // 🟥 Self-collision check
  if (visited.has(coord)) {
    alert('Game Over! You crossed your own path.');
    window.removeEventListener('keydown', handleKey);
    clearCanvas(true); // true → redraw both food & point
    return;
  }

  visited.add(coord);
  ctx.lineTo(x, y);
  ctx.stroke();

  // 🍎 Food collision check
  const distance = Math.hypot(x - foodX, y - foodY);
  if (distance < MOVE_AMOUNT / 2) {
    score += 1;
    scoreLabel.textContent = `Score: ${score}`;

    // Generate new food
    foodX = Math.floor(Math.random() * width);
    foodY = Math.floor(Math.random() * height);
    drawFood();
  }
}

// =========================
// 🔹 KEY HANDLER
// =========================
function handleKey(e) {
  if (e.key.includes('Arrow')) {
    e.preventDefault();
    draw({ key: e.key });
  }
}

// =========================
// 🔹 CLEAR / SHAKE FUNCTION
// =========================
function clearCanvas(redrawAll = false) {
  canvas.classList.add('shake');
  ctx.clearRect(0, 0, width, height);

  canvas.addEventListener(
    'animationend',
    () => canvas.classList.remove('shake'),
    { once: true }
  );

  // Reset visited path
  visited.clear();
  visited.add(`${x},${y}`);

  // Redraw current point
  startPoint();

  // If game over, redraw food too
  if (redrawAll) {
    drawFood();
    window.addEventListener('keydown', handleKey); // re-enable controls
  }
}

// =========================
// 🔹 EVENT LISTENERS
// =========================
window.addEventListener('keydown', handleKey);
shakeButton.addEventListener('click', clearCanvas);
