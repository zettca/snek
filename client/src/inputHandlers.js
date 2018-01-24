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
