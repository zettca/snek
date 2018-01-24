import { EventEmitter } from 'events';

import Vec2 from './Vec2';
import Food from './Food';
import Snake from './Snake';
import { tickTime, tileCount } from './gameConfig';
import { vecFromDirection } from './inputHandlers';

class Game extends EventEmitter {
  constructor() {
    super();
    this.ticks = 0;
    this.apple = new Food(this.getRandomPos());
    this.snakes = [new Snake(this.getRandomPos(), new Vec2(1, 0))];

    this.gameTimer = null;
    this.tick = this.tick.bind(this);

    // playing around
    window.addSnek = () => this.snakes.push(new Snake(this.getRandomPos()));
    window.resetApple = () => this.apple.position = this.getRandomPos();
    window.stopGame = this.stop.bind(this);

    this.start();
  }

  getGameConfig() {
    return {
      tilesX: tileCount.x,
      tilesY: tileCount.y,
    };
  }

  getGameState() {
    const { ticks, apple, snakes } = this;
    return {
      tileCount,
      ticks,
      apple,
      snakes
    };
  }

  sendDirection(dirCode) {
    console.log('Received direction ' + dirCode);
    this.snakes[0].setDirection(vecFromDirection(dirCode));
  }

  getRandomPos() {
    const { x, y } = tileCount;
    const pos = [x, y].map(i => Math.floor(i * Math.random()));
    return new Vec2(...pos);
  }

  handleMovement(snake) {
    snake.move();
  }

  handleWrapping(snake) {
    const { x, y } = tileCount;
    if (snake.position.x < 0) snake.position.x = x - 1;
    if (snake.position.y < 0) snake.position.y = y - 1;
    if (snake.position.x > x - 1) snake.position.x = 0;
    if (snake.position.y > y - 1) snake.position.y = 0;
  }

  handleCollisions(snake) {
    if (snake.isEatingItself()) snake.die();
    if (Vec2.equals(snake.position, this.apple.position)) {
      this.apple.position = this.getRandomPos();
      snake.grow();
    }
  }

  start() {
    this.gameTimer = setInterval(this.tick, tickTime);
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

export default Game;
