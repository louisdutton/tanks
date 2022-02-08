import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Body, Box, Vec3 } from "cannon-es";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh } from "three";
import { PhysicsObject } from "../lib/physics";
import useKeyboard from "../lib/useKeyboard";
import { useListener } from "../lib/useListener";
import { throttle } from "../lib/utils";
import { PositionalAudio } from "./PositionalAudio";
import * as Shell from "../lib/shell";

const MOVEMENT_SPEED = 500;
const ROTATION_SPEED = 1;
const FIRE_RATE = 1000; // ms
const MODEL_URL = "/model/tank.glb";
const CREDITS =
  '"Stylized Tank" (https://skfb.ly/6G86x) by makcutka250 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).';

export const update = (
  { body, mesh }: PhysicsObject,
  movement: number,
  rotation: number,
  delta: number
) => {
  if (movement) {
    mesh.translateZ(1 * delta);
    body.applyForce(new Vec3(0, 0, 1000));
  }
  if (rotation) body.applyTorque(new Vec3(0, -rotation * ROTATION_SPEED, 0));
};

const Tank = () => {
  const tankRef = useRef<PhysicsObject>();
  const shellsRef = useRef<PhysicsObject[]>([]);
  const gltf = useGLTF(MODEL_URL);
  const { scene: obj } = gltf;
  const { scene } = useThree();
  const listener = useListener();
  const shotSound = useRef<THREE.PositionalAudio>(null);
  const { axis } = useKeyboard({
    down: {
      Space: () => handleFire(),
    },
  });

  const add = (obj: PhysicsObject) => {
    scene.add(obj.mesh);
  };

  // const objects = useRef<PhysicsObject[]>([]);

  // throttled fire
  const handleFire = throttle(() => {
    const tank = tankRef.current;
    if (!tank) return;

    const shell = Shell.create(tank);
    shellsRef.current?.push(shell);
    // objects.current.push(shell);
    add(shell);
    // shell.body.addEventListener("collide", () => {
    //   objects.current.filter((i) => i.body.id != shell.body.id);
    //   // world.removeBody(shell.body); FIXME causes freeze
    // });

    // audio
    const sound = shotSound.current;
    if (sound) {
      if (!sound.isPlaying) {
        sound.play();
      }
    }
  }, FIRE_RATE);

  useFrame(({ camera }, delta) => {
    // guard
    const tank = tankRef.current;
    const shells = shellsRef.current;
    if (!tank || !shells) return;

    // input
    const rotation = axis("KeyA", "KeyD");
    const movement = axis("KeyS", "KeyW");

    // console.log(rotation);

    // systems
    // Tank.update(tank, movement, rotation, delta);
    // Shell.update(shells, delta);
    // FollowCam.update(camera, tank.mesh, 0, delta);
  });

  useFrame(() => {
    // Physics.update(world);
    // if (objects.current) Physics.updatePositions(objects.current);
  });

  useEffect(() => {
    // const _objects = objects.current;
    // if (!objects) throw "objects array is undefined.";

    // const tank = Tank.create(obj);
    // tankRef.current = tank;
    // _objects.push(tank);

    // init
    // Physics.init(world);

    // const block = Obstacle.create(0, 5, 0);
    // scene.add(block.mesh);
    // world.addBody(block.body);
    // objects.push(block);

    const ctx = listener.context;
    const filter = new BiquadFilterNode(ctx, { type: "bandpass" });
    listener.setFilter(filter);
  }, []);

  return (
    <primitive
      object={obj}
      scale={0.5}
      onClick={() => {
        listener.context.resume();
      }}
    >
      <PositionalAudio
        listener={listener}
        url={"/audio/tank-engine.wav"}
        loop
        autoplay
      />
      <PositionalAudio
        ref={shotSound}
        listener={listener}
        url={"/audio/tank-shot.flac"}
        loop={false}
        autoplay={false}
      />
    </primitive>
  );
};

useGLTF.preload(MODEL_URL);
export default Tank;
