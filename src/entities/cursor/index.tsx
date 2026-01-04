import { Controllable } from '@/entities/controller/traits'
import { Authority } from '@/multiplayer/traits'
import { Mesh, Position, Target } from '@/shared/traits'

import { useEffect, useRef, useState } from 'react'

import { useWorld } from 'koota/react'
import { type Object3D, type Vector3Tuple } from 'three'

import { Cursor as CursorTrait } from './traits'

export function Cursor() {
  const world = useWorld()
  const cursorRef = useRef<Object3D>(null)
  const [target, setTarget] = useState<Vector3Tuple>()

  useEffect(() => {
    if (!cursorRef.current) {
      return
    }

    const entity = world.spawn(Mesh(cursorRef.current), CursorTrait, Position)

    return () => {
      entity.destroy()
    }
  }, [world])

  useEffect(() => {
    if (!target) {
      return
    }

    const entity = world.spawn(
      Target,
      Position({ x: target[0], y: target[1], z: target[2] })
    )

    return () => {
      entity.destroy()
    }
  }, [target, world])

  const handleCursorClick = () => {
    const cursorPosition = world.queryFirst(CursorTrait)?.get(Position)
    if (!cursorPosition) {
      return
    }

    setTarget([cursorPosition.x, cursorPosition.y, cursorPosition.z])

    const controllable = world.query(Controllable)
    controllable?.forEach(controllableEntity =>
      controllableEntity.add(Authority)
    ) // TODO: remove only to test authority
  }

  return (
    <mesh onClick={handleCursorClick} ref={cursorRef}>
      <sphereGeometry args={[0.1]} />
      <meshBasicMaterial
        color="white"
        depthTest={false}
        opacity={0.5}
        transparent
      />
    </mesh>
  )
}
