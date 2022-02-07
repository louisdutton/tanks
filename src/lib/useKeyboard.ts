import { useEffect, useRef } from "react";
import Key from "./Key";

type Handler = Partial<Record<Key, () => void>>;

interface Handlers {
  down: Handler;
  up: Handler;
}

interface Options {
  down?: Handler;
  up?: Handler;
}

/** Provides a method of querying the list of currently pressed keys. */
const useKeyboard = (options: Options = { down: {}, up: {} }) => {
  const keys = useRef<Record<string, boolean>>({});
  const down = options.down ?? ({} as Handler);
  const up = options.up ?? ({} as Handler);

  const handleDown = ({ code }: KeyboardEvent) => {
    if (!keys.current[code]) keys.current[code] = true;
    if (code in down) {
      down[code as Key]!();
    }
  };

  const handleUp = ({ code }: KeyboardEvent) => {
    if (keys.current[code]) keys.current[code] = false;
    if (code in up) {
      up[code as Key]!();
    }
  };

  /** Returns true if all supplied keys are currently pressed. */
  const pressed = (...codes: Key[]) => {
    return codes.every((c) => keys.current[c]) ?? false;
  };

  /** Returns the sum of the supplied axis definition. */
  const axis = (negative: Key, positive: Key): -1 | 0 | 1 => {
    return (+pressed(positive) - +pressed(negative)) as -1 | 0 | 1;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  });

  return { pressed, axis };
};

export default useKeyboard;
