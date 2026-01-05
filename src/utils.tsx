import { useWorld } from 'koota/react'
import { Vector3, Vector3Like } from 'three'
import { v7 } from 'uuid'

import { SyncTrait, SyncedTraits } from './shared/traits'

export const vector3LikeToArray = (data: Vector3Like) => [
  data.x,
  data.y,
  data.z,
]
export const arrayToVector3 = (data: [x: number, y: number, z: number]) =>
  new Vector3(data[0], data[1], data[2])

type AssertTrue = (
  condition: boolean,
  message?: string
) => asserts condition is true

export const assertTrue: AssertTrue = (condition, message?) => {
  if (!condition) throw new Error(message || 'Assertion failed: expected true')
}

export const uuid = () => v7()

export const useGetSyncTraitsFromSyncTraitId = (
  syncId: string
): {
  [K in keyof typeof SyncedTraits]: any
} => {
  const world = useWorld()

  return Object.fromEntries(
    Object.entries(SyncedTraits).map(([key, trait]) => [
      key,
      world
        .query(SyncTrait)
        .find(entity => entity.get(SyncTrait)?.id === syncId)
        ?.get(trait),
    ])
  ) as any
}
