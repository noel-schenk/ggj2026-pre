import { type ReactNode, createContext, use, useMemo } from 'react'

import { useFrame } from '@react-three/fiber'
import { createWorld } from 'koota'
import { WorldProvider, useWorld } from 'koota/react'

import { cameraFollowFocused } from '../src/entities/camera/systems'
import { useVelocityTowardsTarget } from '../src/entities/controller/systems'
import { useCursorPositionFromLand } from '../src/entities/land/systems'
import { meshFromPosition, positionFromVelocity } from '../src/shared/systems'
import { keyboardVelocitySystem } from './entities/keyboard/systems'

export function RootProviders({ children }: { children: ReactNode }) {
  const world = useMemo(() => createWorld(), [])

  return <WorldProvider world={world}>{children}</WorldProvider>
}

const NestedCheck = createContext(false)

export function KootaSystems({
  cameraFollowFocusedSystem = true,
  children,
  cursorPositionFromLandSystem = true,
  positionFromVelocitySystem = true,
  velocityTowardsTargetSystem = true,
}: {
  cameraFollowFocusedSystem?: boolean
  children: ReactNode
  cursorPositionFromLandSystem?: boolean
  positionFromVelocitySystem?: boolean
  velocityTowardsTargetSystem?: boolean
}) {
  const isNested = use(NestedCheck)
  const world = useWorld()
  const cursorPositionFromLand = useCursorPositionFromLand()
  const velocityTowardsTarget = useVelocityTowardsTarget()

  useFrame((_, delta) => {
    if (isNested) {
      // This turns off the systems if they are already running in a parent component.
      // This can happen when running inside Triplex as the systems are running in the CanvasProvider.
      return
    }

    if (cursorPositionFromLandSystem) {
      cursorPositionFromLand(world, delta)
    }

    keyboardVelocitySystem(world, delta)

    if (velocityTowardsTargetSystem) {
      velocityTowardsTarget(world, delta)
    }

    if (positionFromVelocitySystem) {
      positionFromVelocity(world, delta)
    }

    meshFromPosition(world, delta)

    if (cameraFollowFocusedSystem) {
      cameraFollowFocused(world, delta)
    }
  })

  return <NestedCheck value>{children}</NestedCheck>
}
