import { Entity, Vec2 } from "../manager";

class Snake extends Entity {
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

  isColliding = (positions: Vec2[]) => positions.some((pos) => this.position.equalTo(pos));

  setDirection = (dir: Vec2) => {
    if (!Vec2.opposites(this.direction, dir)) {
      this.direction = dir;
    }
  };
}

export default Snake;
