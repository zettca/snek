export default class Vec2 {
  x: number;
  y: number;

  constructor(x: number | Vec2, y: number) {
    if (x instanceof Vec2) {
      this.x = x.x;
      this.y = x.y;
    } else if (x == null || typeof x === "number") {
      this.x = Number.isInteger(x) ? x : 0;
      this.y = Number.isInteger(y) ? y : 0;
    }
  }

  static equals = (v1: Vec2, v2: Vec2) => v1.x === v2.x && v1.y === v2.y;

  static opposites = (v1: Vec2, v2: Vec2) => v1.x === -v2.x || v1.y === -v2.y;

  static add = (v1: Vec2, v2: Vec2) => new Vec2(v1.x + v2.x, v1.y + v2.y);

  equalTo = (v2: Vec2) => Vec2.equals(this, v2);

  copy = () => new Vec2(this.x, this.y);

  toString = () => `(${this.x}, ${this.y})`;

  addTo = (vec: Vec2) => {
    this.x += vec.x;
    this.y += vec.y;
  };
}
