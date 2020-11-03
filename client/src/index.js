import io from 'socket.io-client';
import './index.css';
import registerServiceWorker from './serviceWorker';
import { dirFromKeyCode, dirFromTouch } from './inputHandlers';

const root = document.getElementById('root');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// canvas setup
const touchStart = { x: 0, y: 0 };
root.appendChild(canvas);
root.addEventListener('keydown', handleKeyDown);
root.addEventListener('touchstart', handleTouchStart, false);
root.addEventListener('touchend', handleTouchEnd, false);
window.addEventListener('resize', resizeWindow);

// Game setup
const tileSize = { x: 20, y: 20 };
const numTiles = { x: 20, y: 20 };
const socket = io();
const colors = [
  { light: '#9c27b0', dark: '#6a0080' }, // purple
  { light: '#3f51b5', dark: '#002984' }, // blue
  { light: '#00bcd4', dark: '#008ba3' }, // cyan
  { light: '#4caf50', dark: '#087f23' }, // green
  { light: '#ffeb3b', dark: '#c8b900' }, // yellow
  { light: '#ff9800', dark: '#c66900' }, // orange
];

socket.on('gamestart', handleGameStart);
socket.on('statechange', handleGameChange);

/* ============================== */

resizeWindow();
registerServiceWorker();

function handleGameStart(gameConfig) {
  numTiles.x = gameConfig.tilesX;
  numTiles.y = gameConfig.tilesY;
}

function handleGameChange(state) {
  requestAnimationFrame(() => {
    drawGame(state);
  });
}

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

function resizeWindow() {
  const body = document.body;
  const size = Math.min(body.clientWidth, body.clientHeight);
  canvas.width = size;
  canvas.height = size;

  tileSize.x = Math.floor(size / numTiles.x);
  tileSize.y = Math.floor(size / numTiles.y);
}

/* ============================== */

function drawCircle(pos, color) {
  ctx.beginPath();
  ctx.ellipse(
    (pos.x + 0.5) * tileSize.x,
    (pos.y + 0.5) * tileSize.y,
    tileSize.x / 2, tileSize.y / 2,
    0, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSquare(pos, color) {
  const pad = 2;
  const [x, w] = [pos.x, 1].map(n => n * tileSize.x);
  const [y, h] = [pos.y, 1].map(n => n * tileSize.y);
  ctx.fillStyle = color;
  ctx.fillRect(x + pad, y + pad, w - pad, h - pad);
}

function drawGame(gameState) {
  const { apple, snakes } = gameState;

  // Draw Background
  ctx.fillStyle = '#212121';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Snakes
  snakes.forEach((snake, i) => {
    const color = colors[i % colors.length];
    drawSquare(snake.position, color.light);
    snake.body.forEach((part) => drawSquare(part, color.dark));
  });

  // Draw Apple
  drawCircle(apple.position, '#FF0000');
}
