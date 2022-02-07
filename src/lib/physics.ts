import { World, Body, Plane, NaiveBroadphase, Vec3 } from "cannon-es";
import { Mesh, Vector3, Quaternion } from "three";

const FIXED_TIME_STEP = 1.0 / 60.0; // seconds
const MAX_SUB_STEPS = 3;

export interface PhysicsObject {
  mesh: Mesh;
  body: Body;
}

export const init = (world: World) => {
  world.gravity.set(0, -9.82, 0); // m/s²
  world.broadphase = new NaiveBroadphase();
  // world.solver.iterations = 40;

  // Create a plane

  const groundShape = new Plane();
  const groundBody = new Body({
    type: Body.STATIC,
    shape: groundShape,
    // position: new Vec3(0, 0, 0),
  });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);
};

// Start the simulation loop
export const update = (world: World, delta: number) => {
  world.fixedStep();
};

export const updatePositions = (objects: PhysicsObject[]) => {
  objects.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position as unknown as Vector3);
    mesh.quaternion.copy(body.quaternion as unknown as Quaternion);
  });
};
