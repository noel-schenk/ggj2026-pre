import { Mesh, Position } from '@/shared/traits'

import { useEffect, useRef } from 'react'

import { OrthographicCamera } from '@react-three/drei'
import { useWorld } from 'koota/react'
import { type OrthographicCamera as OrthographicCameraImpl } from 'three'

import { Camera as CameraTrait } from './traits'

export function Camera({
  position = [0, 0, 0],
  rotation,
}: {
  position?: [x: number, y: number, z: number]
  rotation?: [x: number, y: number, z: number]
}) {
  const world = useWorld()
  const cameraRef = useRef<OrthographicCameraImpl>(null)
  const [x, y, z] = position

  useEffect(() => {
    if (!cameraRef.current) {
      return
    }

    const entity = world.spawn(
      CameraTrait,
      Position({ x, y, z }),
      Mesh(cameraRef.current)
    )

    return () => {
      entity.destroy()
    }
  }, [world, x, y, z])

  return (
    <OrthographicCamera
      makeDefault
      ref={cameraRef}
      rotation={rotation}
      zoom={100}
    />
  )
}
