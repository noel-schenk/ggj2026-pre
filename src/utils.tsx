import { useWorld } from 'koota/react'
import { Vector3, Vector3Like } from 'three'
import * as THREE from 'three'
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator'
import { v7 } from 'uuid'

import { SyncTrait, SyncedTraits } from './shared/traits'

export const vector3LikeToArray = (data: Vector3Like) => [
  data.x,
  data.y,
  data.z,
]
export const arrayToVector3 = (
  data: readonly [x: number, y: number, z: number]
) => new Vector3(data[0], data[1], data[2])

export function assertTrue(
  condition: boolean,
  message?: string
): asserts condition {
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

export const getNewUsername = () =>
  uniqueNamesGenerator({
    dictionaries: [colors, adjectives, animals],
    separator: '',
    style: 'capital',
  })

/**
 * Imperatively interpolates a Vector3 from one position to another over a given time.
 * Calls the callback every 'delay' ms with the current value and a boolean indicating if it's the last call.
 *
 * @param from THREE.Vector3 - starting position
 * @param to THREE.Vector3 - target position
 * @param durationMs number - total interpolation time in ms
 * @param cb (value: THREE.Vector3, isLast: boolean) => void - callback on each step
 * @param delayMs number - delay between callbacks (default 10ms)
 */
export function lerpVector3(
  from: THREE.Vector3,
  to: THREE.Vector3,
  durationMs: number,
  cb: (value: THREE.Vector3, isLast: boolean) => void,
  delayMs = 10
) {
  const start = performance.now()
  const diff = to.clone().sub(from)
  let rafId: number

  function step() {
    const now = performance.now()
    const elapsed = now - start
    const t = Math.min(elapsed / durationMs, 1)
    const current = from.clone().add(diff.clone().multiplyScalar(t))
    const isLast = t >= 1

    cb(current, isLast)

    if (!isLast) {
      rafId = window.setTimeout(step, delayMs)
    }
  }
  step()

  // Return a cancel function if the caller needs it
  return () => rafId && clearTimeout(rafId)
}

export const numberToColor = (value: number): string => {
  const clamped = Math.max(0, Math.min(100, value))
  const hue = (clamped / 100) * 120 // 0° = red, 120° = green
  return `hsl(${hue}, 100%, 50%)`
}
