import * as React from "react";
import { AudioListener } from "three";
import { useThree } from "@react-three/fiber";

export const useListener = () => {
  const [listener] = React.useState(() => new AudioListener());
  const camera = useThree(({ camera }) => camera);

  React.useEffect(() => {
    camera.add(listener);
    return () => {
      camera.remove(listener);
    };
  }, []);

  return listener;
};
