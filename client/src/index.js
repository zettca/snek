import './index.css';
import registerServiceWorker from './serviceWorker';
import SnekGame from './snek/Game';
import { dirFromKeyCode, dirFromTouch } from './snek/inputHandlers';

const root = document.getElementById('root');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const touchStart = { x: 0, y: 0 };

// canvas setup
const [width, height] = [300, 300];
canvas.width = width;
canvas.height = height;
window.canvas = canvas;
root.appendChild(canvas);
root.addEventListener('keydown', handleKey);
root.addEventListener('touchstart', handleTouchStart, false);
root.addEventListener('touchend', handleTouchEnd, false);

// gameInstance setup
const snekInstance = new SnekGame();
const { tilesX, tilesY } = snekInstance.getGameConfig();
const tileSize = {
  x: Math.floor(width / tilesX),
  y: Math.floor(width / tilesY),
};

snekInstance.on('statechange', () => {
  const gameState = snekInstance.getGameState();
  //console.log(gameState);

  drawGame(gameState);
});

/* ============================== */

registerServiceWorker();

function handleKey(e) {
  snekInstance.sendDirection(dirFromKeyCode(e.code));
}

function handleTouchStart(e) {
  touchStart.x = e.changedTouches[0].screenX;
  touchStart.y = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  const dX = e.changedTouches[0].screenX - touchStart.x;
  const dY = e.changedTouches[0].screenY - touchStart.y;
  const dir = dirFromTouch(dX, dY);
  if (dir) snekInstance.sendDirection(dir);
}

function drawSquare(pos, color) {
  const pad = 2;
  ctx.fillStyle = color;
  const [x, w] = [pos.x, 1].map(n => n * tileSize.x);
  const [y, h] = [pos.y, 1].map(n => n * tileSize.y);
  ctx.fillRect(x + pad, y + pad, w - pad, h - pad);
}

function drawGame(gameState) {
  const { apple, snakes } = gameState;

  // Draw Background
  ctx.fillStyle = '#212121';
  ctx.fillRect(0, 0, width, height);

  // Draw Snakes
  snakes.forEach((snake) => {
    drawSquare(snake.position, '#8BC34A');
    snake.body.forEach((part) => drawSquare(part, '#689F38'));
  });

  // Draw Apple
  drawSquare(apple.position, '#FF0000');
}
