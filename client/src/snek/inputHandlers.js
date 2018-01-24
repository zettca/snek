import Vec2 from './Vec2';

export function dirFromTouch(dX, dY) {
  if (dX === 0 && dY === 0) return null;
  if (Math.abs(dX) > Math.abs(dY)) {
    return dX > 0 ? 'RIGHT' : 'LEFT';
  } else {
    return dY > 0 ? 'DOWN' : 'UP';
  }
}

export function dirFromKeyCode(keyCode) {
  switch (keyCode) {
    case 'KeyA':
    case 'ArrowLeft':
      return 'LEFT';
    case 'KeyW':
    case 'ArrowUp':
      return 'UP';
    case 'KeyD':
    case 'ArrowRight':
      return 'RIGHT';
    case 'KeyS':
    case 'ArrowDown':
      return 'DOWN';
    default:
      return 'RIGHT';
  }
}

export function vecFromDirection(direction) {
  switch (direction) {
    case 'LEFT':
      return new Vec2(-1, 0);
    case 'UP':
      return new Vec2(0, -1);
    case 'RIGHT':
      return new Vec2(1, 0);
    case 'DOWN':
      return new Vec2(0, 1);
    default:
      return new Vec2(1, 0);
  }
}
