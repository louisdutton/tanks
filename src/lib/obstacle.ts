import { Mesh, MeshStandardMaterial, BoxBufferGeometry } from "three";
import { Body, Shape, Box, Vec3 } from "cannon-es";
import { PhysicsObject } from "./physics";

const scale = 2;

export const create = (x: number, y: number, z: number): PhysicsObject => {
  // visual
  const geometry = new BoxBufferGeometry(scale, scale, scale);
  const material = new MeshStandardMaterial({ color: "red" });
  const mesh = new Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.position.set(x, y, z);

  // physics
  const mass = 5;
  const shape = new Box(new Vec3(scale / 2, scale / 2, scale / 2));
  const body = new Body({ mass, shape });
  body.position.set(x, y, z);

  return { mesh, body };
};
