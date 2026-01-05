import { Mesh } from '@/shared/traits'

import { type ReactNode, useEffect, useRef } from 'react'

import { useWorld } from 'koota/react'
import { Object3D } from 'three'

import { Land as LandTrait } from './traits'

export function Land({ children }: { children: ReactNode }) {
  const world = useWorld()
  const landRef = useRef<Object3D>(null)

  useEffect(() => {
    if (!landRef.current) {
      return
    }

    const entity = world.spawn(Mesh(landRef.current), LandTrait)

    return () => {
      entity.destroy()
    }
  }, [world])

  return <group ref={landRef}>{children}</group>
}
