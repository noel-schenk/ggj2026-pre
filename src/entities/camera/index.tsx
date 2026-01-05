import { Mesh, Position } from '@/shared/traits'
import { mainState } from '@/state'
import { arrayToVector3 } from '@/utils'

import { useEffect, useRef } from 'react'

import { OrthographicCamera } from '@react-three/drei'
import { useWorld } from 'koota/react'
import { type OrthographicCamera as OrthographicCameraImpl } from 'three'
import { useSnapshot } from 'valtio'

import { Camera as CameraTrait } from './traits'

export function Camera() {
  const world = useWorld()
  const mainStateSnap = useSnapshot(mainState)

  const cameraRef = useRef<OrthographicCameraImpl>(null)

  useEffect(() => {
    if (!cameraRef.current) {
      return
    }

    const entity = world.spawn(
      CameraTrait(),
      Position(arrayToVector3(mainStateSnap.cameraPosition)),
      Mesh(cameraRef.current)
    )

    return () => {
      entity.destroy()
    }
  }, [world, mainStateSnap.cameraPosition])

  return (
    <OrthographicCamera
      makeDefault
      ref={cameraRef}
      rotation={mainStateSnap.cameraRotation}
      zoom={100}
    />
  )
}
