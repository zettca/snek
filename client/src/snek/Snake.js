import Vec2 from './Vec2';

class Snake {
  constructor(pos, vel, size) {
    this.head = pos ? pos : new Vec2(0, 0);
    this.direction = vel ? vel : new Vec2(1, 0);
    this.body = [];
    this.size = size || 3;
  }

  crawl() {
    this.body.push(this.head.copy());
    this.head.addTo(this.direction);

    this.shave();
    return this;
  }

  die() {
    this.size = 3;
    this.shave();
  }

  shave() {
    while (this.body.length > this.size) this.body.shift();
  }

  grow() {
    this.size++;
  }

  isEatingItself() {
    for (let bodyPart of this.body) {
      if (Vec2.equals(bodyPart, this.head)) {
        return true;
      }
    }
    return false;
  }

  setDirection(x, y) {
    const newDir = new Vec2(x, y);
    if (!Vec2.opposites(this.direction, newDir)) {
      this.direction = newDir;
    }
    return this.direction;
  }

}

export default Snake;
