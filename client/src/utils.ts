export const DIRECTIONS = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

export function dirFromTouch(dX: number, dY: number) {
  if (dX === 0 && dY === 0) return null;
  if (Math.abs(dX) > Math.abs(dY)) {
    return dX > 0 ? "RIGHT" : "LEFT";
  } else {
    return dY > 0 ? "DOWN" : "UP";
  }
}

export function dirFromEvent(event: KeyboardEvent) {
  switch (event.code) {
    case "KeyA":
    case "ArrowLeft":
      return DIRECTIONS.LEFT;
    case "KeyW":
    case "ArrowUp":
      return DIRECTIONS.UP;
    case "KeyD":
    case "ArrowRight":
      return DIRECTIONS.RIGHT;
    case "KeyS":
    case "ArrowDown":
      return DIRECTIONS.DOWN;
    default:
      return null;
  }
}
