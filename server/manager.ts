export class Vec2 {
  x = 0;
  y = 0;

  constructor(x: number | Vec2, y = 0) {
    if (x instanceof Vec2) {
      this.x = x.x;
      this.y = x.y;
    } else {
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

export class Entity {
  position: Vec2;
  direction: Vec2;

  constructor(position = new Vec2(0, 0), direction = new Vec2(0, 0)) {
    this.position = position;
    this.direction = direction;
  }

  static equalPos = (e1: Entity, e2: Entity) =>
    e1.position.x === e2.position.x && e1.position.y === e2.position.y;

  static equalDir = (e1: Entity, e2: Entity) =>
    e1.direction.x === e2.direction.x && e1.direction.y === e2.direction.y;

  equalPosTo = (e2: Entity) => Entity.equalPos(this, e2);

  equalDirTo = (e2: Entity) => Entity.equalDir(this, e2);

  move() {
    this.position.addTo(this.direction);
  }
}

export class GameManager {
  ticks: number;
  tickTime: number;
  isPaused: boolean;
  gameInterval: number;
  onTick: () => void;

  constructor({ tickTime = 100, onTick = () => {} }) {
    this.ticks = 0;
    this.tickTime = tickTime;
    this.isPaused = false;
    this.gameInterval = 0;
    this.onTick = onTick;
  }

  init = () => {
    this.ticks = 0;
    this.isPaused = false;
  };

  start = () => {
    this.gameInterval = setInterval(this.tick, this.tickTime);

    this.init();
    return this;
  };

  pause = () => {
    this.isPaused = true;
    return this;
  };

  resume = () => {
    this.isPaused = false;
    return this;
  };

  stop = () => {
    clearInterval(this.gameInterval);
    this.gameInterval = 0;
    return this;
  };

  restart = () => {
    this.stop();
    this.start();
    return this;
  };

  tick = () => {
    if (this.isPaused) return this;

    this.ticks++;
    this.onTick();
    return this;
  };
}
