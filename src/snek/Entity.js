import Vec2 from './Vec2';

class Entity {
  constructor(position, direction) {
    this.position = this.initVecArg(position);
    this.direction = this.initVecArg(direction);
  }

  initVecArg(arg) {
    return (arg instanceof Vec2) ? arg : new Vec2(0, 0);
  }

  move() {
    this.position.addTo(this.direction);
  }

}

export default Entity;
