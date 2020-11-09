import { EventEmitter } from "events";

import GameManager, { Vec2 } from "../manager/index.js";
import Food from "./Food.js";
import Snake from "./Snake.js";
import { vecFromDirection } from "./utils.js";

export default class SnekManager extends EventEmitter {
  constructor({ tiles = { x: 20, y: 20 }, tickTime = 100 }) {
    super();
    this.manager = new GameManager({
      tickTime: tickTime,
      onStart: this.start,
      onStop: this.stop,
      onTick: this.tick,
    });

    this.tileCount = tiles;

    this.apple = new Food(this.getRandomPos(this.tileCount));
    this.snakes = {};
  }

  getConfig = () => {
    return {
      tilesX: this.tileCount.x,
      tilesY: this.tileCount.y,
    };
  };

  getGameState = () => {
    const { ticks, apple, snakes } = this;
    return {
      ticks,
      apple,
      snakes: Object.values(snakes),
    };
  };

  sendDirection = (id, dirCode) => {
    const snake = this.snakes[id];
    snake.setDirection(vecFromDirection(dirCode));
  };

  addSnake = (id) => {
    const snake = new Snake(this.getRandomPos(this.tileCount), new Vec2(1, 0));
    this.snakes[id] = snake;
  };

  removeSnake = (id) => {
    delete this.snakes[id];
  };

  getRandomPos = (tileCount) => {
    const { x, y } = tileCount;
    const pos = [x, y].map((i) => Math.floor(i * Math.random()));
    return new Vec2(...pos);
  };

  handleMovement = (snake) => {
    snake.move();
  };

  handleWrapping = (snake) => {
    const { position } = snake;
    const { x, y } = this.tileCount;
    if (position.x < 0) position.x = x - 1;
    if (position.y < 0) position.y = y - 1;
    if (position.x > x - 1) position.x = 0;
    if (position.y > y - 1) position.y = 0;
  };

  handleCollisions = (snake) => {
    for (const sid in this.snakes) {
      if (snake.isEatingSnake(this.snakes[sid])) {
        snake.die();
      }
    }

    if (Vec2.equals(snake.position, this.apple.position)) {
      this.apple.position = this.getRandomPos(this.tileCount);
      snake.grow();
    }
  };

  start = () => {
    this.emit("start");
    return this;
  };

  stop = () => {
    this.emit("stop");
    return this;
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
