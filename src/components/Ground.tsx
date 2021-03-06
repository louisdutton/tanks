import { usePlane } from "@react-three/cannon";

const Ground = (props: any) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial />
    </mesh>
  );
};

export default Ground;
