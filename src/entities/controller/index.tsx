import { Keyboard } from '@/entities/keyboard/traits'
import { Authority } from '@/multiplayer/traits'
import { Focused, Mesh, Position, SyncTrait, Velocity } from '@/shared/traits'
import { useGetSyncTraitsFromSyncTraitId } from '@/utils'

import { useEffect, useRef } from 'react'

import { useWorld } from 'koota/react'
import { type Object3D, Vector3 } from 'three'

import { Controllable, Speed } from './traits'

export function Controller({
  children,
  position = new Vector3(0, 0, 2),
  speed = 1,
  authority,
  syncId = '',
}: {
  children: React.ReactNode
  position?: Vector3
  speed?: number
  authority?: string
  syncId?: string
}) {
  const world = useWorld()
  const controllerRef = useRef<Object3D>(null)

  const syncedTraits = useGetSyncTraitsFromSyncTraitId(syncId)

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
      Position(syncedTraits.position ? syncedTraits.position : position),
      Speed({ value: speed }),
      Velocity
    )

    if (authority) entity.add(Authority({ clientId: authority }))

    return () => {
      entity.destroy()
    }
  }, [speed, world, position])

  return <group ref={controllerRef}>{children}</group>
}
