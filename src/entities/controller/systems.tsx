import { Land } from '@/entities/land/traits'
import { distance, multiply, normalize, subtract } from '@/shared/math'
import { Mesh, Position, Target, Velocity } from '@/shared/traits'
import { ECSSystemHook } from '@/types'

import { useCallback } from 'react'

import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

import { Controllable, Speed } from './traits'

/**
 * Sets the velocity of controllable entities towards the direction of the
 * target position. When the entity is close to the target, it slows down and
 * eventually stops.
 */
export const useVelocityTowardsTarget: ECSSystemHook = () => {
  const raycaster = useThree(state => state.raycaster)

  return useCallback(
    (world, delta: number) => {
      const entities = world.query(Controllable, Position, Velocity)
      const target = world.queryFirst(Position, Target)

      const lands = world.query(Land, Mesh)
      const objects = lands.map(land => land.get(Mesh)).filter(mesh => !!mesh)

      const targetPosition = target?.get(Position)
      for (const entity of entities) {
        const position = entity.get(Position)
        const speed = entity.get(Speed)?.value || 1

        if (position) {
          if (targetPosition) {
            const distanceToTarget = distance(position, targetPosition)
            const stoppingDistance = delta * 3

            // Calculate a speed factor that gradually approaches zero as we near the target
            const speedFactor = Math.max(
              0,
              Math.min(
                1,
                (distanceToTarget - stoppingDistance) / stoppingDistance
              )
            )

            // Apply the speed factor to smoothly transition to zero velocity
            const targetVelocity = multiply(
              normalize(subtract(targetPosition, position)),
              // Square for more natural deceleration
              speed * speedFactor * speedFactor
            )

            entity.set(Velocity, targetVelocity)
          }

          // snap to ground
          raycaster.set(
            new Vector3(position.x, position.y + 2, position.z),
            new Vector3(0, -1, 0)
          )

          const intersects = raycaster.intersectObjects(objects).at(0)

          if (intersects)
            entity.set(Position, {
              x: intersects.point.x,
              y: intersects.point.y,
              z: intersects.point.z,
            })
        }
      }
    },
    [raycaster]
  )
}
