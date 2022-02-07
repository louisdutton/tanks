import { Camera, Mesh, Quaternion, Vector3 } from "three";

const OFFSET = new Vector3(0, 7, -5);
const MOVEMENT_SPEED = 0.01;
const ROTATION_SPEED = 0.01;

export const update = (
  camera: Camera,
  target: Mesh,
  shake: number,
  delta: number
) => {
  const targetPosition = new Vector3().addVectors(target.position, OFFSET);
  camera.position.lerp(targetPosition, MOVEMENT_SPEED);

  //   const currentRotation = target.quaternion.clone();
  camera.lookAt(target.position);
  //   const targetRotation = camera.quaternion.clone();
  //   camera.quaternion.slerp(targetRotation, ROTATION_SPEED);
};
