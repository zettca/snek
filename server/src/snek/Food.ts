import { Entity, Vec2 } from "../manager/index.ts";

export default class Food extends Entity {
  value: number;

  constructor(position: Vec2, value: number = 1) {
    super(position);
    this.value = value;
  }
}
