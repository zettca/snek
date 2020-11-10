import { Vec2 } from "../manager";

export enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

export function vecFromDirection(direction: Direction) {
  switch (direction) {
    case Direction.Left:
      return new Vec2(-1, 0);
    case Direction.Up:
      return new Vec2(0, -1);
    case Direction.Right:
      return new Vec2(1, 0);
    case Direction.Down:
      return new Vec2(0, 1);
    default:
      return new Vec2(0, 0);
  }
}

export function randInt(max: number, min: number = 0) {
  return Math.floor((max - min) * Math.random()) + min;
}
