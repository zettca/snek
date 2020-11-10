import { Vec2 } from "../manager/index.js";

export function vecFromDirection(direction) {
  switch (direction) {
    case "LEFT":
      return new Vec2(-1, 0);
    case "UP":
      return new Vec2(0, -1);
    case "RIGHT":
      return new Vec2(1, 0);
    case "DOWN":
      return new Vec2(0, 1);
    default:
      return new Vec2(0, 0);
  }
}
