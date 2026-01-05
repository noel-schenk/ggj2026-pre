import { Controllable } from '@/entities/controller/traits'
import { Authority } from '@/multiplayer/traits'
import { multiply } from '@/shared/math'
import { type ECSSystem } from '@/types'

import { Vector3 } from 'three'

import { Mesh, Position, RigidBody, Velocity } from './traits'

/** Copies the position trait value to the Three.js mesh position. */
export const meshFromPosition: ECSSystem = world => {
  const entities = world.query(Position, Mesh)

  for (const entity of entities) {
    const mesh = entity.get(Mesh)
    const position = entity.get(Position)
    const controllable = entity.get(Controllable)
    const authority = entity.get(Authority)
    const rb = entity.get(RigidBody)

    if (mesh && position && !controllable) {
      mesh.position.set(position.x, position.y, position.z)
    }
    if (mesh && position && controllable) {
      if (authority) {
        const pos = mesh.getWorldPosition(new Vector3(0, 0, 0))
        entity.set(Position, pos)
      } else {
        rb?.setTranslation(position, false)
      }
    }
  }

  const entitiesR = world.query(Velocity, RigidBody)
  for (const entity of entitiesR) {
    const rb = entity.get(RigidBody)
    const velocity = multiply(
      entity.get(Velocity) ?? { x: 0, y: 0, z: 0 },
      0.02
    )

    if (rb && velocity) {
      // rb.setLinvel(velocity, true);
      rb.applyImpulse(velocity, true)
    }
  }
}
