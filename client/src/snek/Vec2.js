class Vec2 {
  constructor(x, y) {
    this.x = Number.isInteger(x) ? x : 0;
    this.y = Number.isInteger(y) ? y : 0;
  }

  static equals(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y;
  }

  static opposites(v1, v2) {
    return v1.x === -v2.x || v1.y === -v2.y;
  }

  copy() {
    return new Vec2(this.x, this.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  add(vec) {
    return new Vec2(this.x + vec.x, this.y + vec.y);
  }

  addTo(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }
}

export default Vec2;
