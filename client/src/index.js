import './index.css';
import { gameSettings, canvasSettings } from './settings';
import { getVelocityFromKey } from './snek/handlers';
import registerServiceWorker from './serviceWorker';
import SnekGame from './snek/Game';

const root = document.getElementById('root');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const { tickTime, tileCount } = gameSettings;
const { width, height } = canvasSettings.canvas;
const tileSize = {
  x: Math.floor(width / tileCount.x),
  y: Math.floor(width / tileCount.y),
};

registerServiceWorker();

canvas.width = width;
canvas.height = height;
window.canvas = canvas;
root.appendChild(canvas);
root.addEventListener('keydown', handleKey);

setInterval(drawGame, tickTime);

const snekInstance = new SnekGame();
const { apple, snakes } = snekInstance;

function handleKey(event) {
  const { x, y } = getVelocityFromKey(event.code);
  snakes.forEach((snake) => snake.setDirection(x, y));
}

function drawObject(pos, color) {
  const pad = 2;
  ctx.fillStyle = color;
  const [x, w] = [pos.x, 1].map(n => n * tileSize.x);
  const [y, h] = [pos.y, 1].map(n => n * tileSize.y);
  ctx.fillRect(x + pad, y + pad, w - pad, h - pad);

}

function drawSnake(snake) {
  drawObject(snake.head, '#8BC34A');
  snake.body.forEach((pos) => drawObject(pos, '#689F38'));
}

function drawGame() {
  // Draw Background
  ctx.fillStyle = '#212121';
  ctx.fillRect(0, 0, width, height);

  // Draw Snakes
  snakes.forEach((snake) => drawSnake(snake));

  // Draw Apple
  drawObject(apple.position, '#FF0000');

  // process game tick
  processGame();
}

function processGame() {
  snekInstance.tick();
}
