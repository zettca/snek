import Vec2 from './Vec2';
import Food from './Food';
import Snake from './Snake';
import { gameSettings } from '../settings';

class Game {
  constructor() {
    this.apple = new Food(this.getRandomPos());
    this.snakes = [new Snake(this.getRandomPos())];

    window.addSnek = this.addSnake.bind(this);
  }

  getRandomPos() {
    const { x, y } = gameSettings.tileCount;
    const pos = [x, y].map(i => Math.floor(i * Math.random()));
    return new Vec2(...pos);
  }

  addSnake(pos) {
    this.snakes.push(new Snake(pos || this.getRandomPos()));
  }

  handleMovement(snake) {
    snake.crawl();
  }

  handleWrapping(snake) {
    const { x, y } = gameSettings.tileCount;
    if (snake.head.x < 0) snake.head.x = x - 1;
    if (snake.head.y < 0) snake.head.y = y - 1;
    if (snake.head.x > x - 1) snake.head.x = 0;
    if (snake.head.y > y - 1) snake.head.y = 0;
  }

  handleCollisions(snake) {
    if (snake.isEatingItself()) snake.die();
    if (Vec2.equals(snake.head, this.apple.position)) {
      this.apple.position = this.getRandomPos();
      snake.grow();
    }
  }

  tick() {
    for (let i = 0; i < this.snakes.length; i++) {
      this.handleMovement(this.snakes[i]);
      this.handleWrapping(this.snakes[i]);
      this.handleCollisions(this.snakes[i]);
    }
  }

}

export default Game;
