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
  constructor(position: Vec2, direction: Vec2, size: number = 2) {
    super(position, direction);
    this.body = [];
    this.size = size;
  }

  move() {
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

  setDirection = (dir: Vec2) => {
    if (!Vec2.opposites(this.direction, dir)) {
      this.direction = dir;
    }
  };
}

export type SnakeId = string;

export interface GameOptions {
  tiles: { x: number; y: number };
  tickTime: number;
  apples?: number;
  obstacles?: Entity[] | number;
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
  snakes: Record<SnakeId, Snake>;

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
    this.snakes = {};

    for (let i = 0; i < apples; i++) this.addApple();

    if (Number.isInteger(obstacles)) {
      for (let i = 0; i < obstacles; i++) this.addObstacle();
    }
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
      snakes: Object.values(snakes),
    };
  };

  sendDirection = (id: SnakeId, dirCode: Direction) => {
    const snake = this.snakes[id];
    snake.setDirection(vecFromDirection(dirCode));
  };

  addSnake = (id: SnakeId) => {
    const snake = new Snake(this.getRandomEmptyPos(), new Vec2(1, 0));
    this.snakes[id] = snake;
  };

  removeSnake = (id: SnakeId) => {
    delete this.snakes[id];
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

    for (const sid in this.snakes) {
      const snake = this.snakes[sid];
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
    const { snakes, obstacles } = this;
    const collidables: Vec2[] = [];

    obstacles.forEach((obs) => collidables.push(obs.position));
    Object.values(snakes).forEach((snake) =>
      snake.body.forEach((part) => collidables.push(part))
    );

    return collidables;
  };

  handleMovement = (snake: Snake) => {
    snake.move();
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
    for (const sid in this.snakes) {
      const snake = this.snakes[sid];
      this.handleMovement(snake);
      this.handleWrapping(snake);
      this.handleCollisions(snake);
    }
    this.emit("tick");
  };
}
