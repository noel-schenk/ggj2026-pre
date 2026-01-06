import { Controllable } from '@/entities/controller/traits'
import { Owner } from '@/multiplayer/traits'
import { damp } from '@/shared/math'
import { Position, RigidBody } from '@/shared/traits'
import { mainState } from '@/state'
import { type ECSSystem, type Vector3 } from '@/types'

import { Camera } from './traits'

/**
 * Updates the camera entities position trait based on the focused entity
 * position. If there is no focused entity or camera entity no changes are
 * made.
 */
export const cameraFollowFocused: ECSSystem = (world, delta) => {
  const focused = world.queryFirst(Owner, Controllable, RigidBody)
  const camera = world.queryFirst(Camera, Position)

  const focusedRigidBody = focused?.get(RigidBody)
  const cameraPosition = camera?.get(Position)

  if (!camera || !cameraPosition || !focusedRigidBody) return

  if (!mainState.cameraFollowPlayer) return

  const pos = focusedRigidBody.translation()
  // const pos = focusedMesh.getWorldPosition(new v3(0,0,0));

  const lambda = 5
  const offset = { x: 6, z: 12 }
  const target: Vector3 = {
    x: pos.x - offset.x,
    y: cameraPosition.y,
    z: pos.z + offset.z,
  }

  if (cameraPosition.x === 0 && cameraPosition.z === 0) {
    // If we're setting the camera for the first time we skip damping to the target position.
    camera.set(Position, target)
  } else {
    camera.set(Position, damp(cameraPosition, target, lambda, delta))
  }
}
