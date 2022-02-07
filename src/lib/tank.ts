import { Body, Box, Vec3 } from "cannon-es";
import { Group, Mesh } from "three";
import { PhysicsObject } from "./physics";

const MOVEMENT_SPEED = 500;
const ROTATION_SPEED = 1;

export const create = (scene: Group): PhysicsObject => {
  // physics
  const mass = 10;
  const shape = new Box(new Vec3(0.5, 0.5, 0.5));
  const body = new Body({ mass, shape });
  body.position.copy(scene.position as unknown as Vec3);

  return { mesh: scene, body };
};

export const update = (
  { body }: PhysicsObject,
  movement: number,
  rotation: number,
  delta: number
) => {
  if (movement) body.applyForce(new Vec3(0, 0, 1000));
  if (rotation) body.applyTorque(new Vec3(0, -rotation * ROTATION_SPEED, 0));
};
