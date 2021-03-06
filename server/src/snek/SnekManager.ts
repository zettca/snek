import { EventEmitter } from "events";

import GameManager, { Entity, Vec2 } from "../manager";
import { Food, Snake, Direction, vecFromDirection, randInt } from ".";

export type SnakeId = string;

export interface GameOptions {
  tiles: { x: number; y: number };
  tickTime: number;
  apples?: number;
  obstacles?: Entity[];
}

export default class SnekManager extends EventEmitter {
  manager: GameManager;
  tileCount: { x: number; y: number };
  apples: Food[];
  obstacles: Entity[];
  snakes: Record<SnakeId, Snake>;

  constructor(options: GameOptions) {
    super();
    const { tiles = { x: 20, y: 20 }, tickTime = 100, apples = 1, obstacles = [] } = options;
    this.manager = new GameManager({
      tickTime: tickTime,
      onStart: this.start,
      onStop: this.stop,
      onTick: this.tick,
    });

    this.tileCount = tiles;

    this.apples = [];
    this.obstacles = obstacles;
    this.snakes = {};

    for (let i = 0; i < apples; i++) this.addApple();
    for (let i = 0; i < 4; i++) this.addObstacle();
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

  getRandomEmptyPos = () => {
    const pos = this.getRandomPos();
    return this.isEmpty(pos) ? pos : this.getRandomEmptyPos();
  };

  getCollidables = () => {
    const { snakes, obstacles } = this;
    const collidables: Vec2[] = [];

    obstacles.forEach((obs) => collidables.push(obs.position));
    Object.values(snakes).forEach((snake) => snake.body.forEach((part) => collidables.push(part)));

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
    this.emit("start");
  };

  stop = () => {
    this.emit("stop");
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
