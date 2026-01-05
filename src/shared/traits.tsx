// import { RapierRigidBody } from '@react-three/rapier'
import { RapierRigidBody } from '@react-three/rapier'
import { Trait, trait } from 'koota'
import { Object3D } from 'three'

export const Position = trait({ x: 0, y: 0, z: 0 })

export const Velocity = trait({ x: 0, y: 0, z: 0 })

export const Mesh = trait(() => new Object3D())

export const RigidBody = trait(() => null) as unknown as Trait<
  () => RapierRigidBody
>

export const Focused = trait()

export const Target = trait()

export const SyncTrait = trait({ id: '' })

export const SyncedTraits = {
  position: Position,
  sync: SyncTrait,
  // velocity: Velocity,
}
