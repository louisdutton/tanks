const MOVEMENT_SPEED = 5;
const ROTATION_SPEED = 1;

export const update = (
  tank: THREE.Mesh,
  movement: number,
  rotation: number,
  delta: number
) => {
  if (movement) tank.translateZ(movement * MOVEMENT_SPEED * delta);
  if (rotation) tank.rotateY(-rotation * ROTATION_SPEED * delta);
};
