import EventEmitter from "https://deno.land/x/eventemitter@1.2.4/mod.ts";
import { Entity, GameManager, Vec2 } from "./manager.ts";

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export function vecFromDirection(direction: Direction) {
  switch (direction) {
    case "LEFT":
      return new Vec2(-1, 0);
    case "UP":
      return new Vec2(0, -1);
    case "RIGHT":
      return new Vec2(1, 0);
    case "DOWN":
      return new Vec2(0, 1);
    default:
      return new Vec2(0, 0);
  }
}

export function randInt(max: number, min = 0) {
  return Math.floor((max - min) * Math.random()) + min;
}

export class Food extends Entity {
  value: number;

  constructor(position: Vec2, value: number = 1) {
    super(position);
    this.value = value;
  }
}

export class Snake extends Entity {
  body: Vec2[];
  size: number;
  nextDirection: Vec2 | null;
  constructor(position: Vec2, direction: Vec2, size: number = 2) {
    super(position, direction);
    this.body = [];
    this.size = size;
    this.nextDirection = null;
  }

  override move() {
    if (this.nextDirection) {
      this.direction = this.nextDirection;
      this.nextDirection = null;
    }
    this.body.push(this.position.copy());
    this.slice();
    super.move();
  }

  die = () => {
    this.size = 2;
    this.slice();
  };

  slice = () => {
    this.body = this.body.slice(this.body.length - this.size);
  };

  grow = () => {
    this.size += 1;
  };

  isColliding = (positions: Vec2[]) =>
    positions.some((pos) => this.position.equalTo(pos));

  setNextDirection = (dir: Vec2) => {
    if (this.direction.oppositeTo(dir)) return;
    this.nextDirection = dir;
  };
}

export type SnakeId = string;

export interface GameOptions {
  tiles: { x: number; y: number };
  tickTime: number;
  apples?: number;
  obstacles?: number;
}

type SnekEvents = {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  tick: () => void;
};

export class SnekManager extends EventEmitter<SnekEvents> {
  manager: GameManager;
  tileCount: { x: number; y: number };
  apples: Food[];
  obstacles: Entity[];
  snakes: Map<SnakeId, Snake>;

  constructor(options: GameOptions) {
    super();
    const {
      tiles = { x: 20, y: 20 },
      tickTime = 100,
      apples = 1,
      obstacles = 1,
    } = options;
    this.manager = new GameManager({
      tickTime: tickTime,
      onTick: this.tick,
    });

    this.tileCount = tiles;

    this.apples = [];
    this.obstacles = Array.isArray(obstacles) ? obstacles : [];
    this.snakes = new Map<SnakeId, Snake>();

    for (let i = 0; i < apples; i++) this.addApple();
    for (let i = 0; i < obstacles; i++) this.addObstacle();
  }

  getConfig = () => {
    const { tileCount } = this;
    return {
      tileCount,
    };
  };

  getGameState = () => {
    const { apples, obstacles, snakes } = this;
    return {
      apples,
      obstacles,
      snakes: snakes.values().toArray(),
    };
  };

  sendDirection = (id: SnakeId, dirCode: Direction) => {
    const snake = this.snakes.get(id);
    snake?.setNextDirection(vecFromDirection(dirCode));
  };

  addSnake = (id: SnakeId) => {
    const snake = new Snake(this.getRandomEmptyPos(), new Vec2(1, 0));
    this.snakes.set(id, snake);
  };

  removeSnake = (id: SnakeId) => {
    this.snakes.delete(id);
  };

  addApple = () => {
    const apple = new Food(this.getRandomEmptyPos());
    this.apples.push(apple);
  };

  removeApple = (idx: number) => {
    this.apples.splice(idx, 1);
  };

  addObstacle = () => {
    const obstacle = new Entity(this.getRandomEmptyPos());
    this.obstacles.push(obstacle);
  };

  isEmpty = (pos: Vec2) => {
    if (this.apples.some((apple) => apple.position.equalTo(pos))) return false;
    if (this.obstacles.some((obs) => obs.position.equalTo(pos))) return false;

    for (const [, snake] of this.snakes) {
      if (pos.equalTo(snake.position)) return false;
      for (const b of snake.body) {
        if (pos.equalTo(b)) return false;
      }
    }

    return true;
  };

  getRandomPos = () => {
    const { x, y } = this.tileCount;
    return new Vec2(randInt(x), randInt(y));
  };

  getRandomEmptyPos = (): Vec2 => {
    const pos = this.getRandomPos();
    return this.isEmpty(pos) ? pos : this.getRandomEmptyPos();
  };

  getCollidables = () => {
    const collidables: Vec2[] = [];

    this.obstacles.forEach((obs) => collidables.push(obs.position));
    this.snakes.values().forEach((snake) => collidables.push(...snake.body));

    return collidables;
  };

  handleWrapping = (snake: Snake) => {
    const { position } = snake;
    const { x, y } = this.tileCount;
    if (position.x < 0) position.x = x - 1;
    if (position.y < 0) position.y = y - 1;
    if (position.x > x - 1) position.x = 0;
    if (position.y > y - 1) position.y = 0;
  };

  handleCollisions = (snake: Snake) => {
    const collidables = this.getCollidables();
    if (snake.isColliding(collidables)) {
      snake.die();
    }

    const ai = this.apples.findIndex((apple) => apple.equalPosTo(snake));
    if (ai !== -1) {
      this.removeApple(ai);
      snake.grow();
      this.addApple();
    }
  };

  start = () => {
    this.manager.start();
    this.emit("start");
  };

  stop = () => {
    this.manager.stop();
    this.emit("stop");
  };

  pause = () => {
    this.manager.pause();
    this.emit("pause");
  };

  resume = () => {
    this.manager.resume();
    this.emit("resume");
  };

  tick = () => {
    for (const [, snake] of this.snakes) {
      snake.move();
      this.handleWrapping(snake);
      this.handleCollisions(snake);
    }
    this.emit("tick");
  };
}
