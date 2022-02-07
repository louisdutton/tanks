import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  ContactShadows,
  Html,
  OrbitControls,
  Plane,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { useListener } from "./lib/useListener";
import { PositionalAudio } from "./components/PositionalAudio";
import useKeyboard from "./lib/useKeyboard";
import { throttle } from "./lib/utils";
import * as Shell from "./lib/shell";
import * as Tank from "./lib/tank";
import * as FollowCam from "./lib/camera";
import * as Physics from "./lib/physics";
import { World } from "cannon-es";
import * as Obstacle from "./lib/block";
import { PhysicsObject } from "./lib/physics";

const FIRE_RATE = 1000; // ms
const MODEL_URL = "/model/tank.glb";
const CREDITS =
  '"Stylized Tank" (https://skfb.ly/6G86x) by makcutka250 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).';

function Model() {
  const tankRef = useRef<PhysicsObject>();
  const shellsRef = useRef<PhysicsObject[]>([]);
  const gltf = useGLTF(MODEL_URL);
  const { scene: obj } = gltf;
  const { scene } = useThree();
  const [world] = useState<World>(new World());
  const listener = useListener();
  const shotSound = useRef<THREE.PositionalAudio>(null);
  const { axis } = useKeyboard({
    down: {
      Space: () => handleFire(),
    },
  });

  const add = (obj: PhysicsObject) => {
    scene.add(obj.mesh);
    world.addBody(obj.body);
  };

  const objects = useRef<PhysicsObject[]>([]);

  // throttled fire
  const handleFire = throttle(() => {
    const tank = tankRef.current;
    if (!tank) return;

    const shell = Shell.create(tank);
    shellsRef.current?.push(shell);
    objects.current.push(shell);
    add(shell);
    shell.body.addEventListener("collide", () => {
      objects.current.filter((i) => i.body.id != shell.body.id);
      // world.removeBody(shell.body); FIXME causes freeze
    });

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

    // systems
    Tank.update(tank, movement, rotation, delta);
    // Shell.update(shells, delta);
    // FollowCam.update(camera, tank.mesh, 0, delta);
  });

  useFrame(() => {
    Physics.update(world);
    if (objects.current) Physics.updatePositions(objects.current);
  });

  useEffect(() => {
    const _objects = objects.current;
    if (!objects) throw "objects array is undefined.";

    const tank = Tank.create(obj);
    tankRef.current = tank;
    _objects.push(tank);

    // init
    Physics.init(world);
    console.log("gravity: ", world.gravity);

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
}

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center className="text-green-100">
      {progress} % loaded
    </Html>
  );
};

const App = () => {
  return (
    <div className="w-screen, h-screen bg-gradient-to-tl from-orange-500 to-orange-300">
      <Canvas
        dpr={window.devicePixelRatio}
        gl={{ antialias: true }}
        camera={{ position: [0, 10, -5] }}
      >
        <OrbitControls />
        <ambientLight color={0xfed7aa} intensity={0.5} />
        <directionalLight position={[10, 10, 10]} rotation={[0, 0, 0]} />
        {/* <Text color={"white"}>Hello</Text> */}
        <Suspense fallback={<Loader />}>
          <Model />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
useGLTF.preload(MODEL_URL);
