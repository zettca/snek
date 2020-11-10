import { EventEmitter } from "events";

import GameManager, { Entity, Vec2 } from "../manager";
import { Food, Snake, Direction, vecFromDirection, randInt } from ".";

export type SnakeId = string;

export default class SnekManager extends EventEmitter {
  manager: GameManager;
  tileCount: { x: number; y: number };
  apples: Food[];
  snakes: Record<SnakeId, Snake>;

  constructor({ tiles = { x: 20, y: 20 }, tickTime = 100, numApples = 1 }) {
    super();
    this.manager = new GameManager({
      tickTime: tickTime,
      onStart: this.start,
      onStop: this.stop,
      onTick: this.tick,
    });

    this.tileCount = tiles;

    this.apples = [];
    this.snakes = {};

    for (let i = 0; i < numApples; i++) this.addApple();
  }

  getConfig = () => {
    const { tileCount } = this;
    return {
      tileCount,
    };
  };

  getGameState = () => {
    const { apples, snakes } = this;
    return {
      apples: apples,
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

  isEmpty = (pos: Vec2) => {
    const apple = this.apples?.[0];
    for (const apple of this.apples) if (pos.equalTo(apple.position)) return false;

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
    for (const sid in this.snakes) {
      if (snake.isEatingSnake(this.snakes[sid])) {
        snake.die();
      }
    }

    const ai = this.apples.findIndex((apple) => apple.equalPosTo(snake));
    if (ai !== -1) {
      this.removeApple(ai);
      this.addApple();
      snake.grow();
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
