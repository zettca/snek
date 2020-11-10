import Entity from "../manager/Entity.js";
import Vec2 from "../manager/Vec2.js";

class Snake extends Entity {
  constructor(position, direction, size) {
    super(position, direction);
    this.body = [];
    this.size = size || 2;
  }

  move() {
    this.body.push(this.position.copy());
    super.move();
    this.slice();
  }

  die() {
    this.size = 2;
    this.slice();
  }

  slice() {
    this.body = this.body.slice(this.body.length - this.size);
  }

  grow() {
    this.size++;
  }

  isEatingSnake(snake) {
    // head bumps are friendly?
    for (let bodyPart of snake.body) {
      if (Vec2.equals(bodyPart, this.position)) {
        return true;
      }
    }
    return false;
  }

  setDirection(dir) {
    if (!Vec2.opposites(this.direction, dir)) {
      this.direction = dir;
    }
    return this.direction;
  }
}

export default Snake;
