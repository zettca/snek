import './index.css';
import registerServiceWorker from './serviceWorker';
import { dirFromKeyCode, dirFromTouch } from './inputHandlers';
import io from 'socket.io-client';

const root = document.getElementById('root');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// canvas setup
const touchStart = { x: 0, y: 0 };
const [width, height] = [300, 300];
canvas.width = width;
canvas.height = height;
window.canvas = canvas;
root.appendChild(canvas);
root.addEventListener('keydown', handleKeyDown);
root.addEventListener('touchstart', handleTouchStart, false);
root.addEventListener('touchend', handleTouchEnd, false);

// Game setup
const tileSize = { x: 20, y: 20 };
const socket = io('http://localhost:8080');

socket.on('gamestart', (gameConfig) => {
  const { tilesX, tilesY } = gameConfig;
  tileSize.x = Math.floor(width / tilesX);
  tileSize.y = Math.floor(width / tilesY);
});

socket.on('statechange', (gameState) => {
  drawGame(gameState);
});

/* ============================== */

registerServiceWorker();

function handleKeyDown(e) {
  const dir = dirFromKeyCode(e.code);
  socket.emit('input', dir);
}

function handleTouchStart(e) {
  touchStart.x = e.changedTouches[0].screenX;
  touchStart.y = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  const dX = e.changedTouches[0].screenX - touchStart.x;
  const dY = e.changedTouches[0].screenY - touchStart.y;
  const dir = dirFromTouch(dX, dY);
  if (dir) socket.emit('input', dir);
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
  for (const sid in snakes) {
    const snake = snakes[sid];
    drawSquare(snake.position, '#8BC34A');
    snake.body.forEach((part) => drawSquare(part, '#689F38'));
  }

  // Draw Apple
  drawSquare(apple.position, '#FF0000');
}
