import GameObject from './GameObject';
import Vec2 from './Vec2';

class Snake extends GameObject {
  constructor(position, direction, size) {
    super(position, direction);
    this.body = [];
    this.size = size || 3;
  }

  move() {
    this.body.push(this.position.copy());
    super.move();
    this.slice();
  }

  die() {
    this.size = 3;
    this.slice();
  }

  slice() {
    this.body = this.body.slice(this.body.length - this.size);
  }

  grow() {
    this.size++;
  }

  isEatingItself() {
    for (let bodyPart of this.body) {
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
