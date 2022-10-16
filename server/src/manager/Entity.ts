import { Vec2 } from "./index.ts";

export default class Entity {
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
