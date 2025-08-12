const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const ball = { x: 100, y: 100, r: 15, vx: 3, vy: 3 };

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const blocks = [];
const cols = 13;
const blockWidth = 60;
const blockHeight = 40;

letters.forEach((letter, i) => {
  const row = Math.floor(i / cols);
  const col = i % cols;
  blocks.push({
    letter,
    text: letter,
    x: 40 + col * ((canvas.width - 80) / cols),
    y: 40 + row * 80,
    width: blockWidth,
    height: blockHeight,
  });
});

const wordBank = {
  A: ['Apple', 'Arrow', 'Ant'],
  B: ['Ball', 'Book', 'Boat'],
  C: ['Cat', 'Cake', 'Car'],
  D: ['Dog', 'Door', 'Drum'],
  E: ['Egg', 'Earth', 'Engine'],
  F: ['Fish', 'Fork', 'Frog'],
  G: ['Goat', 'Game', 'Gate'],
  H: ['Hat', 'Horse', 'House'],
  I: ['Igloo', 'Iron', 'Ice'],
  J: ['Jam', 'Jar', 'Jet'],
  K: ['Kite', 'Key', 'Koala'],
  L: ['Lion', 'Leaf', 'Lamp'],
  M: ['Moon', 'Mouse', 'Map'],
  N: ['Nest', 'Nose', 'Net'],
  O: ['Owl', 'Ox', 'Orange'],
  P: ['Pig', 'Pen', 'Pot'],
  Q: ['Queen', 'Quilt', 'Quill'],
  R: ['Rat', 'Ring', 'Rose'],
  S: ['Sun', 'Star', 'Sock'],
  T: ['Tree', 'Truck', 'Tube'],
  U: ['Umbrella', 'Urn', 'Utensil'],
  V: ['Van', 'Vase', 'Violin'],
  W: ['Whale', 'Wolf', 'Window'],
  X: ['Xylophone', 'Xerus', 'X-ray'],
  Y: ['Yak', 'Yarn', 'Yacht'],
  Z: ['Zebra', 'Zip', 'Zoo'],
};

function rectCircleColliding(circle, rect) {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > rect.width / 2 + circle.r) return false;
  if (distY > rect.height / 2 + circle.r) return false;

  if (distX <= rect.width / 2) return true;
  if (distY <= rect.height / 2) return true;

  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return dx * dx + dy * dy <= circle.r * circle.r;
}

function update() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
  if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.vy *= -1;

  blocks.forEach((b) => {
    if (rectCircleColliding(ball, b)) {
      const words = wordBank[b.letter];
      const newWord = words[Math.floor(Math.random() * words.length)];
      b.text = newWord;
      ball.vx *= -1;
      ball.vy *= -1;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ball
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  // Blocks
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  blocks.forEach((b) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(b.x, b.y, b.width, b.height);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(b.x, b.y, b.width, b.height);
    ctx.fillStyle = '#000000';
    ctx.fillText(b.text, b.x + b.width / 2, b.y + b.height / 2);
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
