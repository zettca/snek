import GameObject from './GameObject';

class Food extends GameObject {
  constructor(position, value) {
    super(position);
    this.value = value || 1;
  }
}

export default Food;
