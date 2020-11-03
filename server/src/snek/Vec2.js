class Vec2 {
  constructor(x, y) {
    if (x instanceof Vec2) {
      this.x = x.x;
      this.y = x.y;
    } else if (x == null || typeof x === "number") {
      this.x = Number.isInteger(x) ? x : 0;
      this.y = Number.isInteger(y) ? y : 0;
    } else {
      throw new TypeError("args must be Vec2 or integer");
    }
  }

  static equals(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y;
  }

  static opposites(v1, v2) {
    return v1.x === -v2.x || v1.y === -v2.y;
  }

  static add(v1, v2) {
    return new Vec2(v1.x + v2.x, v1.y + v2.y);
  }

  copy() {
    return new Vec2(this.x, this.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  addTo(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }
}

export default Vec2;
