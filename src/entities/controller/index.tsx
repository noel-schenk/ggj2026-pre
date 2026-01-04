import { Keyboard } from '@/entities/keyboard/traits'
import { Focused, Mesh, Position, SyncTrait, Velocity } from '@/shared/traits'

import { useEffect, useRef } from 'react'

import { useWorld } from 'koota/react'
import { type Object3D } from 'three'

import { Controllable, Speed } from './traits'

export function Controller({
  children,
  position = [0, 0, 0],
  speed = 1,
  syncId = 42,
}: {
  children: React.ReactNode
  position?: [x: number, y: number, z: number]
  speed?: number
  syncId?: number
}) {
  const world = useWorld()
  const controllerRef = useRef<Object3D>(null)
  const [x, y, z] = position

  useEffect(() => {
    if (!controllerRef.current) {
      return
    }

    const entity = world.spawn(
      SyncTrait({ id: syncId }),
      Controllable,
      Keyboard,
      Focused,
      Mesh(controllerRef.current),
      Position({ x, y, z }),
      Speed({ value: speed }),
      Velocity
    )

    return () => {
      entity.destroy()
    }
  }, [speed, world, x, y, z])

  return <group ref={controllerRef}>{children}</group>
}
