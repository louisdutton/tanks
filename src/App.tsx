import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import * as THREE from "three";
import {
  Box,
  Html,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";

import Tank from "./components/Tank";
import Block from "./components/Block";
import Ground from "./components/Ground";
import * as FollowCam from "./lib/camera";

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
          <Tank />
          <Physics>
            <Ground />
            <Block />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
