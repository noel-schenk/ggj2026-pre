import { isNil } from "lodash-es";
import { damp } from "../../shared/math";
import { Focused, Position, Velocity } from "../../shared/traits";
import { type ECSSystem  } from "../../types";
import { Keyboard } from "./traits";
import { Vector3 } from "three";

const keyDown = new Set() as Set<string>;

/**
 * Updates the camera entities position trait based on the focused entity
 * position. If there is no focused entity or camera entity no changes are
 * made.
 */
export const keyboardVelocitySystem: ECSSystem = (world, delta) => {
    const controllables = world.query(Keyboard, Position, Velocity);


    if (controllables.length === 0) {
        return;
    }
    
    for(const controllable of controllables){

        const oldVelocity = controllable.get(Velocity)!;

        const newVelocity = new Vector3(0, 0, 0);
        newVelocity.add(oldVelocity);
        newVelocity.multiplyScalar(0.9);

        const step = 1;

        if (keyDown.has("w"))
            newVelocity.add(new Vector3(0, 0, -step));
        if (keyDown.has("s"))
            newVelocity.add(new Vector3(0, 0, step));
        if (keyDown.has("a"))
            newVelocity.add(new Vector3(-step, 0, 0));
        if (keyDown.has("d"))
            newVelocity.add(new Vector3(step, 0, 0));

        controllable.set(Velocity, newVelocity);
    }

};

const onKeydown = (event: KeyboardEvent) => {
    console.log(event.key, "onKeydown");
    keyDown.add(event.key);
};

const onKeyup = (event: KeyboardEvent) => {
    console.log(event.key, "onKeyup", keyDown);
    keyDown.delete(event.key);
};

document.addEventListener("keydown", onKeydown);
document.addEventListener("keyup", onKeyup);