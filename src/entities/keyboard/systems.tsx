import { Controllable } from '@/entities/controller/traits'
import { Owner } from '@/multiplayer/traits'
import { world } from '@/providers'
import { Position, Target, Velocity } from '@/shared/traits'
import { type ECSSystem } from '@/types'

import { Vector3 } from 'three'

const keyDown = new Set() as Set<string>

/**
 * Updates the camera entities position trait based on the focused entity
 * position. If there is no focused entity or camera entity no changes are
 * made.
 */
export const keyboardVelocitySystem: ECSSystem = (world, _delta) => {
  const controllables = world.query(Owner, Controllable)

  if (controllables.length === 0) {
    return
  }

  for (const controllable of controllables) {
    const oldVelocity = controllable.get(Velocity)!

    const newVelocity = new Vector3(0, 0, 0)
    newVelocity.add(oldVelocity)
    newVelocity.multiplyScalar(0.9)

    const step = 1

    if (keyDown.has('w')) newVelocity.add(new Vector3(0, 0, -step))
    if (keyDown.has('s')) newVelocity.add(new Vector3(0, 0, step))
    if (keyDown.has('a')) newVelocity.add(new Vector3(-step, 0, 0))
    if (keyDown.has('d')) newVelocity.add(new Vector3(step, 0, 0))

    controllable.set(Velocity, newVelocity)
  }
}

const onKeydown = (event: KeyboardEvent) => {
  world.query(Target).forEach(entity => entity.remove(Position))
  keyDown.add(event.key)
}

const onKeyup = (event: KeyboardEvent) => keyDown.delete(event.key)

document.addEventListener('keydown', onKeydown)
document.addEventListener('keyup', onKeyup)
