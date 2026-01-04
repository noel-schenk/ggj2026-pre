import { Mesh } from '@/shared/traits'

import { type ReactNode, useEffect } from 'react'

import { usePlane } from '@react-three/p2'
import { useWorld } from 'koota/react'

import { Land as LandTrait } from './traits'

export function Land({ children }: { children: ReactNode }) {
  const world = useWorld()
  const [refPhys] = usePlane(() => ({ mass: 0, position: [0, 0] }))

  useEffect(() => {
    if (!refPhys.current) {
      return
    }

    const entity = world.spawn(Mesh(refPhys.current), LandTrait)

    return () => {
      entity.destroy()
    }
  }, [world])

  return <group ref={refPhys}>{children}</group>
}
