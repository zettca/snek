import Vec2 from './Vec2';

export function getVelocityFromKey(keyCode) {
  switch (keyCode) {
    case 'ArrowLeft':
      return new Vec2(-1, 0);
    case 'ArrowUp':
      return new Vec2(0, -1);
    case 'ArrowRight':
      return new Vec2(1, 0);
    case 'ArrowDown':
      return new Vec2(0, 1);
    default:
      return new Vec2(0, 0);
  }
}
