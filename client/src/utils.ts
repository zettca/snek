// import type { Direction } from "../../server/src/snek/mod.ts";

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export function dirFromTouch(dX: number, dY: number): Direction | null {
  if (dX === 0 && dY === 0) return null;
  if (Math.abs(dX) > Math.abs(dY)) {
    return dX > 0 ? "RIGHT" : "LEFT";
  } else {
    return dY > 0 ? "DOWN" : "UP";
  }
}

export function dirFromEvent(event: KeyboardEvent): Direction | null {
  switch (event.code) {
    case "KeyA":
    case "ArrowLeft":
      return "LEFT";
    case "KeyW":
    case "ArrowUp":
      return "UP";
    case "KeyD":
    case "ArrowRight":
      return "RIGHT";
    case "KeyS":
    case "ArrowDown":
      return "DOWN";
    default:
      return null;
  }
}
