import { useWorld } from "koota/react";
import { RefObject, useEffect, useRef, useState } from "react";
import { Vector3, type Object3D, type Vector3Tuple } from "three";
import { Mesh, Position, Target } from "../../shared/traits";
import { Keyboard as KeyboardTrait } from "./traits";
import { Controllable } from "../controller/traits";
import { isNil } from "lodash-es";
import { useFrame } from "@react-three/fiber";

export function Keyboard() {
  const world = useWorld();
  const ref = useRef<Object3D>(null);
  const [target, setTarget] = useState<Vector3>();

  const keyDown = useRef([]) as RefObject<Array<string>>;

  useFrame((_, delta) => {
    if (keyDown.current.length === 0) return;

    const currentPosition = world.queryFirst(Controllable);
    const currentControllablePosition = currentPosition?.get(Position);

    if (isNil(currentControllablePosition)) return;

    const newControllablePosition = new Vector3(0, 0, 0);
    newControllablePosition.add(currentControllablePosition);

    const step = 0.3 * delta * 60;

    if (keyDown.current.includes("w"))
      newControllablePosition.add(new Vector3(0, 0, -step));
    if (keyDown.current.includes("s"))
      newControllablePosition.add(new Vector3(0, 0, step));
    if (keyDown.current.includes("a"))
      newControllablePosition.add(new Vector3(-step, 0, 0));
    if (keyDown.current.includes("d"))
      newControllablePosition.add(new Vector3(step, 0, 0));

    if (!newControllablePosition.equals(currentControllablePosition))
      setTarget(newControllablePosition);
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const entity = world.spawn(Mesh(ref.current), KeyboardTrait, Position);

    const onKeydown = (event: KeyboardEvent) => {
      console.log(event.key, "onKeydown");
      if (isNil(keyDown.current)) keyDown.current = [event.key];
      keyDown.current.push(event.key);
    };

    const onKeyup = (event: KeyboardEvent) => {
      console.log(event.key, "onKeyup", keyDown.current);
      keyDown.current = keyDown.current.filter((k) => k !== event.key);
    };

    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    return () => {
      entity.destroy();
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
    };
  }, [world]);

  useEffect(() => {
    if (!target) return;

    const entity = world.spawn(Target, Position(target));

    return () => {
      entity.destroy();
    };
  }, [target, world]);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1]} />
      <meshBasicMaterial
        color="red"
        depthTest={false}
        opacity={0.5}
        transparent
      />
    </mesh>
  );
}
