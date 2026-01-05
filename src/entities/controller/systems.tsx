import { Mesh, Position, RigidBody } from '@/shared/traits'
import { ECSSystemHook } from '@/types'

import { useCallback } from 'react'

import { useThree } from '@react-three/fiber'

import { Controllable } from './traits'

/**
 * Sets the velocity of controllable entities towards the direction of the
 * target position. When the entity is close to the target, it slows down and
 * eventually stops.
 */
export const useVelocityTowardsTarget: ECSSystemHook = () => {
  const raycaster = useThree(state => state.raycaster)

  return useCallback(
    world => {
      const entities = world.query(Controllable, Position, Mesh, RigidBody)
      for (const entity of entities) {
        const mesh = entity.get(Mesh)
        const rigidBody = entity.get(RigidBody)
        if (!mesh || !rigidBody) continue
        const pos = rigidBody.translation()
        entity.set(Position, {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        })
      }
    },
    [raycaster]
  )
}
