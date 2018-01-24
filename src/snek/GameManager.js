import { EventEmitter } from 'events';

import Vec2 from './Vec2';
import Food from './Food';
import Snake from './Snake';

class GameManager extends EventEmitter {
  constructor(tickTime, tileCount) {
    super();
    this.ticks = 0;
    this.tickTime = tickTime || 100;
    this.tileCount = tileCount || { x: 20, y: 20 };

    this.apple = new Food(this.getRandomPos(this.tileCount));
    this.snakes = [];

    this.gameTimer = null;
    this.tick = this.tick.bind(this);
  }

  getGameConfig() {
    return {
      tilesX: this.tileCount.x,
      tilesY: this.tileCount.y,
    };
  }

  getGameState() {
    const { ticks, apple, snakes } = this;
    return {
      ticks,
      apple,
      snakes
    };
  }

  vecFromDirection(direction) {
    switch (direction) {
      case 'LEFT':
        return new Vec2(-1, 0);
      case 'UP':
        return new Vec2(0, -1);
      case 'RIGHT':
        return new Vec2(1, 0);
      case 'DOWN':
        return new Vec2(0, 1);
      default:
        return new Vec2(1, 0);
    }
  }

  sendDirection(dirCode) {
    // TODO: implement multiple snakes movement (ID:Socket)
    this.snakes[0].setDirection(this.vecFromDirection(dirCode));
  }

  addSnake() {
    const snake = new Snake(this.getRandomPos(this.tileCount), new Vec2(1, 0));
    this.snakes.push(snake);
  }

  getRandomPos(tileCount) {
    const { x, y } = tileCount;
    const pos = [x, y].map(i => Math.floor(i * Math.random()));
    return new Vec2(...pos);
  }

  handleMovement(snake) {
    snake.move();
  }

  handleWrapping(snake) {
    const { x, y } = this.tileCount;
    if (snake.position.x < 0) snake.position.x = x - 1;
    if (snake.position.y < 0) snake.position.y = y - 1;
    if (snake.position.x > x - 1) snake.position.x = 0;
    if (snake.position.y > y - 1) snake.position.y = 0;
  }

  handleCollisions(snake) {
    if (snake.isEatingItself()) snake.die();
    if (Vec2.equals(snake.position, this.apple.position)) {
      this.apple.position = this.getRandomPos(this.tileCount);
      snake.grow();
    }
  }

  start() {
    this.gameTimer = setInterval(this.tick, this.tickTime);
  }

  stop() {
    clearInterval(this.gameTimer);
    this.gameTimer = null;
  }

  tick() {
    this.ticks++;
    for (let snake of this.snakes) {
      this.handleMovement(snake);
      this.handleWrapping(snake);
      this.handleCollisions(snake);
    }

    this.emit('statechange');
  }
}

export default GameManager;
