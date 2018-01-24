import Vec2 from './Vec2';

class Food {
  constructor(pos) {
    this.position = pos ? pos : new Vec2(0, 0);
  }

  setPosition(pos) {
    this.position = pos;
  }
}

export default Food;
