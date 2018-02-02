import os from 'os';
import io from 'socket.io-client';
import './index.css';
import registerServiceWorker from './serviceWorker';
import { dirFromKeyCode, dirFromTouch } from './inputHandlers';

const root = document.getElementById('root');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// canvas setup
const touchStart = { x: 0, y: 0 };
const [width, height] = [400, 400];
canvas.width = width;
canvas.height = height;
root.appendChild(canvas);
root.addEventListener('keydown', handleKeyDown);
root.addEventListener('touchstart', handleTouchStart, false);
root.addEventListener('touchend', handleTouchEnd, false);

// Game setup
const tileSize = { x: 20, y: 20 };
const socket = io(os.hostname() + ':8080');
const colors = [
  { light: '#9c27b0', dark: '#6a0080' }, // purple
  { light: '#3f51b5', dark: '#002984' }, // blue
  { light: '#00bcd4', dark: '#008ba3' }, // cyan
  { light: '#4caf50', dark: '#087f23' }, // green
  { light: '#8bc34a', dark: '#5a9216' }, // green2
  { light: '#ffeb3b', dark: '#c8b900' }, // yellow
  { light: '#ff9800', dark: '#c66900' }, // orange
];

socket.on('gamestart', (gameConfig) => {
  const { tilesX, tilesY } = gameConfig;
  tileSize.x = Math.floor(width / tilesX);
  tileSize.y = Math.floor(height / tilesY);
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
  snakes.forEach((snake, i) => {
    const color = colors[i % colors.length];
    drawSquare(snake.position, color.light);
    snake.body.forEach((part) => drawSquare(part, color.dark));
  });

  // Draw Apple
  drawSquare(apple.position, '#FF0000');
}
