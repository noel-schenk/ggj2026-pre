import { Keyboard } from '@/entities/keyboard/traits'
import { Authority } from '@/multiplayer/traits'
import {
  Focused,
  Mesh,
  Position,
  RigidBody,
  SyncTrait,
  Velocity,
} from '@/shared/traits'
import { useGetSyncTraitsFromSyncTraitId } from '@/utils'

import { useEffect, useRef } from 'react'

import {
  MeshCollider,
  RapierRigidBody,
  RigidBody as RigidBodyComponent,
} from '@react-three/rapier'
import { Text } from '@react-three/uikit'
import { Label } from '@react-three/uikit-default'
import { useWorld } from 'koota/react'
import { Object3D, Vector3 } from 'three'

import { Controllable, Speed } from './traits'

export function Controller({
  children,
  position = new Vector3(0, 0, 0),
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
  const controllerRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<Object3D>(null)

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
      Mesh(meshRef.current as any),
      RigidBody(controllerRef.current as any),
      Position(syncedTraits.position ? syncedTraits.position : position),
      Speed({ value: speed }),
      Velocity
    )

    if (authority) entity.add(Authority({ clientId: authority }))

    return () => {
      entity.destroy()
    }
  }, [speed, world, position])

  return (
    <>
      <RigidBodyComponent
        canSleep={false}
        type="dynamic"
        colliders={false}
        linearDamping={4}
        angularDamping={5}
        mass={100}
        ref={controllerRef}
      >
        <MeshCollider type="ball">{children}</MeshCollider>
      </RigidBodyComponent>
      <group ref={meshRef}>
        <Label>
          <Text>{JSON.stringify(position)}</Text>
        </Label>
        {children}
      </group>
    </>
  )
}
