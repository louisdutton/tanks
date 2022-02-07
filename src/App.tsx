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
import * as Obstacle from "./lib/obstacle";
import { PhysicsObject } from "./lib/physics";

const FIRE_RATE = 1000; // ms
const MODEL_URL = "/model/tank.glb";
const CREDITS =
  '"Stylized Tank" (https://skfb.ly/6G86x) by makcutka250 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).';

function Model() {
  const tankRef = useRef<THREE.Mesh>(null);
  const shellsRef = useRef<THREE.Mesh[]>([]);
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

  const obstacles = useRef<PhysicsObject[]>([]);

  // throttled fire
  const handleFire = throttle(() => {
    const tank = tankRef.current;
    if (!tank) return;

    const shell = Shell.spawn(tank);
    shellsRef.current?.push(shell);
    scene.add(shell);

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
    const objects = obstacles.current;
    if (!tank || !shells || !obstacles) return;

    // input
    const rotation = axis("KeyA", "KeyD");
    const movement = axis("KeyS", "KeyW");

    // systems
    Tank.update(tank, movement, rotation, delta);
    Shell.update(shells, delta);
    FollowCam.update(camera, tank, 0, delta);
    Physics.update(world, delta);
    Physics.updatePositions(objects);
  });

  useEffect(() => {
    console.log(gltf.scene);

    gltf.scene.traverse((node) => {
      if (node.name === "mesh_0") {
        console.log(node.material);

        node.material.flatShading = true;
        node.material.flatShading = true;
      }
    });

    // init
    Physics.init(world);
    console.log("gravity: ", world.gravity);

    const obj = Obstacle.create(0, 5, 0);
    scene.add(obj.mesh);
    world.addBody(obj.body);
    obstacles.current?.push(obj);

    const ctx = listener.context;
    const filter = new BiquadFilterNode(ctx, { type: "bandpass" });
    listener.setFilter(filter);
  }, []);

  return (
    <primitive
      object={obj}
      ref={tankRef}
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
        {/* <OrbitControls /> */}w
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
