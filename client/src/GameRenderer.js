export const DEFAULT_SIZE = { width: 600, height: 600 };
export const DEFAULT_TILE_NUM = { x: 20, y: 20 };

export const COLORS = [
  { light: "#9c27b0", dark: "#6a0080" }, // purple
  { light: "#3f51b5", dark: "#002984" }, // blue
  { light: "#00bcd4", dark: "#008ba3" }, // cyan
  { light: "#4caf50", dark: "#087f23" }, // green
  { light: "#ffeb3b", dark: "#c8b900" }, // yellow
  { light: "#ff9800", dark: "#c66900" }, // orange
];

function calcTileSize(size, numTiles) {
  const { x, y } = numTiles;
  return {
    x: Math.floor(size.width / x),
    y: Math.floor(size.height / y),
  };
}

export class GameRenderer {
  constructor(ctx, { numTiles = DEFAULT_TILE_NUM, size = DEFAULT_SIZE }) {
    this.ctx = ctx;
    this.numTiles = numTiles;
    this.size = size;
    this.tileSize = calcTileSize(size, numTiles);
  }

  setNumTiles(numTiles) {
    this.numTiles = numTiles;
    this.tileSize = calcTileSize(this.size, this.numTiles);
  }

  setSize(size) {
    this.size = size;
    this.tileSize = calcTileSize(this.size, this.numTiles);
  }

  drawCircle(pos, color) {
    const { x, y } = this.tileSize;

    this.ctx.beginPath();
    this.ctx.ellipse((pos.x + 0.5) * x, (pos.y + 0.5) * y, x / 2, y / 2, 0, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawSquare(pos, color) {
    const { x: w, y: h } = this.tileSize;

    const pad = 2;
    const x = pos.x * w;
    const y = pos.y * h;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + pad, y + pad, w - pad, h - pad);
  }

  draw(gameState) {
    const { width, height } = this.size;
    const { apples, snakes } = gameState;

    // Draw Background
    this.ctx.fillStyle = "#212121";
    this.ctx.fillRect(0, 0, width, height);

    // Draw Snakes
    snakes.forEach((snake, i) => {
      const color = COLORS[i % COLORS.length];
      this.drawSquare(snake.position, color.light);
      snake.body.forEach((part) => this.drawSquare(part, color.dark));
    });

    // Draw Apples
    apples.forEach((apple) => {
      this.drawCircle(apple.position, "#FF0000");
    });
  }
}
