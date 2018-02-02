import Entity from './Entity';

class Food extends Entity {
  constructor(position, value) {
    super(position);
    this.value = value || 1;
  }
}

export default Food;
