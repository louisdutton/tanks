import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import { PhysicsObject } from "../lib/physics";
import useKeyboard from "../lib/useKeyboard";
import { useListener } from "../lib/useListener";
import { throttle } from "../lib/utils";
import { PositionalAudio } from "./PositionalAudio";
import * as Shell from "../lib/shell";
import { Object3D } from "three";

const MOVEMENT_SPEED = 500;
const ROTATION_SPEED = 1;
const FIRE_RATE = 1000; // ms
const MODEL_URL = "/model/tank.glb";
const CREDITS =
  '"Stylized Tank" (https://skfb.ly/6G86x) by makcutka250 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).';

// export const update = (
//   { body, mesh }: PhysicsObject,
//   movement: number,
//   rotation: number,
//   delta: number
// ) => {
//   if (movement) {
//     mesh.translateZ(1 * delta);
//     // body.applyForce(new Vec3(0, 0, 1000));
//   }
//   //   if (rotation) body.applyTorque(new Vec3(0, -rotation * ROTATION_SPEED, 0));
// };

const Tank = () => {
  const ref = useRef<Object3D>();
  //   const [, api] = useBox(() => ({ mass: 10, position: [0, 1, 0] }));
  const shellsRef = useRef<PhysicsObject[]>([]);
  //   const gltf = useGLTF(MODEL_URL);
  //   const { scene: obj } = gltf;
  //   const { scene } = useThree().scene;
  const listener = useListener();
  const shotSound = useRef<THREE.PositionalAudio>(null);
  const { axis } = useKeyboard({
    down: {
      Space: () => handleFire(),
    },
  });

  // throttled fire
  const handleFire = throttle(() => {
    // const tank = tankRef.current;
    // if (!tank) return;
    // const shell = Shell.create(tank);
    // shellsRef.current?.push(shell);
    // // objects.current.push(shell);
    // add(shell);
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
    // const tank = ref;
    // const shells = shellsRef.current;
    // if (!tank || !shells) return;
    // // input
    // const rotation = axis("KeyA", "KeyD");
    // const movement = axis("KeyS", "KeyW");
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

  //@ts-ignore
  //TODO: PR fix
  const { nodes, materials } = useGLTF("/model/tank.glb");

  useEffect(() => {
    const ctx = listener.context;
    const filter = new BiquadFilterNode(ctx, { type: "bandpass" });
    listener.setFilter(filter);
  }, []);

  return (
    <group ref={ref} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={nodes.mesh_1.geometry}
          material={materials.material_0}
        />
        {/* <mesh
          geometry={nodes.mesh_0.geometry}
          material={materials.material_1}
        /> */}
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
      </group>
    </group>
  );
  //   return (
  //     <primitive
  //       ref={ref}
  //       object={obj}
  //       scale={0.5}
  //       onClick={() => {
  //         listener.context.resume();
  //       }}
  //     >
  //
  //     </primitive>
  //   );
};

useGLTF.preload(MODEL_URL);
export default Tank;
