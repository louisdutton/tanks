import { Body, Box, Vec3 } from "cannon-es";
import * as THREE from "three";
import { PhysicsObject } from "./physics";

const SHELL_OFFSET = new THREE.Vector3(0, 1.3, 1.6);
const SHELL_SPEED = 20;

export const create = ({ mesh: tank }: PhysicsObject): PhysicsObject => {
  const mesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.2, 0.2, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xffd700 })
  );

  mesh.position.copy(tank.position);
  mesh.rotation.copy(tank.rotation);
  mesh.translateZ(SHELL_OFFSET.z);
  mesh.translateY(SHELL_OFFSET.y);

  // physics
  const mass = 5;
  const shape = new Box(new Vec3(0.1, 0.1, 0.25));
  const body = new Body({ mass, shape });
  body.position.copy(mesh.position as unknown as Vec3);
  body.applyImpulse(new Vec3(0, 0, 1));

  return { mesh, body };
};

// export const update = (shells: PhysicsObject[], delta: number) => {
//   shells.forEach(({body}) => {
//     body.(SHELL_SPEED * delta);
//   });
// };
