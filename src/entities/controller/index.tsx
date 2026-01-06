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
import { mainState } from '@/state'
import { useGetSyncTraitsFromSyncTraitId } from '@/utils'

import { useEffect, useRef } from 'react'

import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody as RigidBodyComponent,
} from '@react-three/rapier'
import { Text } from '@react-three/uikit'
import { Label } from '@react-three/uikit-default'
import { useWorld } from 'koota/react'
import { Object3D, Vector3 } from 'three'

import { Controllable, Speed } from './traits'

export function Controller({
  position = new Vector3(0, 0, 0),
  speed = 1,
  authority,
  syncId = '',
  color = 'hsl(0, 100%, 50%)',
}: {
  position?: Vector3
  speed?: number
  authority?: string
  syncId?: string
  color?: string
}) {
  const world = useWorld()
  const controllerRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<Object3D>(null)

  const syncedTraits = useGetSyncTraitsFromSyncTraitId(syncId)

  useEffect(() => {
    if (!meshRef.current) {
      return
    }

    const entity = world.spawn(
      SyncTrait({ id: syncId }),
      Controllable,
      Keyboard,
      Focused,
      Mesh(meshRef.current as any),
      Position(syncedTraits.position ? syncedTraits.position : position),
      Speed({ value: speed }),
      Velocity
    )

    if (authority === mainState.cliendId) {
      entity.add(Authority({ clientId: authority }))
      entity.add(RigidBody(controllerRef.current as any))
    }

    return () => {
      entity.destroy()
    }
  }, [speed, world, position, authority])

  return (
    <>
      {authority === mainState.cliendId && (
        <RigidBodyComponent
          canSleep={false}
          type="dynamic"
          colliders={false}
          linearDamping={4}
          angularDamping={4}
          enabledRotations={[false, false, false]}
          mass={100}
          ref={controllerRef}
        >
          <CapsuleCollider args={[0.4, 0.3]}></CapsuleCollider>
        </RigidBodyComponent>
      )}

      <group ref={meshRef}>
        <Label>
          <Text>{JSON.stringify(position)}</Text>
        </Label>
        <mesh castShadow position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </>
  )
}
