import { useBox } from "@react-three/cannon";
import { Box } from "@react-three/drei";

const Block = (props: any) => {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], ...props }));
  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color={"red"} />
    </mesh>
  );
};

export default Block;
