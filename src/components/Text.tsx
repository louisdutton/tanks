import * as THREE from "three";
import React, { useMemo, useRef, useLayoutEffect } from "react";
import { extend, useLoader } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// import { useBox } from

extend({ TextGeometry });

export default function Text({
  //@ts-ignore
  children,
  vAlign = "center",
  hAlign = "center",
  size = 1.5,
  color = "#333",
  ...props
}) {
  const font = useLoader(FontLoader, "Anton_Regular.json");
  const config = useMemo(
    () => ({
      font,
      size: 40,
      height: 30,
      curveSegments: 32,
      bevelEnabled: false,
      bevelThickness: 3,
      bevelSize: 2,
      bevelOffset: 0,
      bevelSegments: 8,
    }),
    [font]
  );
  const mesh = useRef();
  //   useLayoutEffect(() => {
  //     const size = new THREE.Vector3();
  //     mesh.current.geometry.computeBoundingBox();
  //     mesh.current.geometry.boundingBox.getSize(size);
  //     mesh.current.position.x =
  //       hAlign === "center" ? -size.x / 2 : hAlign === "right" ? 0 : -size.x;
  //     mesh.current.position.y =
  //       vAlign === "center" ? -size.y / 2 : vAlign === "top" ? 0 : -size.y;
  //   }, [children]);
  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        //@ts-ignore
        <textGeometry args={[children, config]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
