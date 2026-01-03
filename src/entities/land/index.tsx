import { useWorld } from "koota/react";
import { useEffect, useRef, type ReactNode } from "react";
import { type Object3D } from "three";
import { Mesh } from "../../shared/traits";
import { Land as LandTrait } from "./traits";
import { usePlane, Physics } from "@react-three/p2";

export function Land({ children }: { children: ReactNode }) {
  const world = useWorld();
  const [refPhys] = usePlane(() => ({ mass: 0, position: [0, 0] }));

  useEffect(() => {
    if (!refPhys.current) {
      return;
    }

    const entity = world.spawn(Mesh(refPhys.current), LandTrait);

    return () => {
      entity.destroy();
    };
  }, [world]);

  return <group ref={refPhys}>
      {children}
  </group>;
}
