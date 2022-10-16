import { lighten } from "color2k";
import { Dims, GameState, Vec2 } from "./types";

export const DEFAULT_SIZE = { width: 600, height: 600 };
export const DEFAULT_TILE_NUM = { x: 20, y: 20 };

// COLORS: blue purple yellow green cyan orange
const DEFAULT_COLORS = [
  "#002984",
  "#9c27b0",
  "#ffeb3b",
  "#4caf50",
  "#00bcd4",
  "#c66900",
];
const COLORS = DEFAULT_COLORS.map((c) => ({ dark: c, light: lighten(c, 0.2) }));

function calcTileSize(size: Dims, numTiles: Vec2): Vec2 {
  const { x, y } = numTiles;
  return {
    x: Math.floor(size.width / x),
    y: Math.floor(size.height / y),
  };
}

export class GameRenderer {
  ctx: CanvasRenderingContext2D;
  tileSize: Vec2;
  numTiles = DEFAULT_TILE_NUM;
  size = DEFAULT_SIZE;

  constructor(
    ctx: CanvasRenderingContext2D,
    { numTiles = DEFAULT_TILE_NUM, size = DEFAULT_SIZE }
  ) {
    this.ctx = ctx;
    this.numTiles = numTiles;
    this.size = size;
    this.tileSize = calcTileSize(size, numTiles);
  }

  setNumTiles(numTiles: Vec2) {
    this.numTiles = numTiles;
    this.tileSize = calcTileSize(this.size, this.numTiles);
  }

  setSize(size: Dims) {
    this.size = size;
    this.tileSize = calcTileSize(this.size, this.numTiles);
  }

  drawCircle(pos: Vec2, color: string) {
    const { x, y } = this.tileSize;

    this.ctx.beginPath();
    this.ctx.ellipse(
      (pos.x + 0.5) * x,
      (pos.y + 0.5) * y,
      x / 2,
      y / 2,
      0,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawSquare(pos: Vec2, color: string) {
    const { x: w, y: h } = this.tileSize;

    const pad = 2;
    const x = pos.x * w;
    const y = pos.y * h;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + pad, y + pad, w - pad, h - pad);
  }

  draw(gameState: GameState) {
    const { width, height } = this.size;
    const { snakes = [], apples = [], obstacles = [] } = gameState;

    // Draw Background
    this.ctx.fillStyle = "#212121";
    this.ctx.fillRect(0, 0, width, height);

    // Draw Snakes
    snakes.forEach((snake, i) => {
      const color = COLORS[i % COLORS.length];
      snake.body.forEach((part) => this.drawSquare(part, color.dark));
      this.drawSquare(snake.position, color.light);
    });

    // Draw Apples
    apples.forEach((apple) => {
      this.drawCircle(apple.position, "#FF0000");
    });

    // Draw Obstacles
    obstacles.forEach((obstacle) => {
      this.drawSquare(obstacle.position, "#CCCCCC");
    });
  }
}
