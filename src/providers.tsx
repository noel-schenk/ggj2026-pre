import { cameraFollowFocused } from '@/entities/camera/systems'
import { useVelocityTowardsTarget } from '@/entities/controller/systems'
import { useCursorPositionFromLand } from '@/entities/land/systems'
import { meshFromPosition, positionFromVelocity } from '@/shared/systems'

import { type ReactNode, createContext, use } from 'react'

import { useFrame } from '@react-three/fiber'
import { createWorld } from 'koota'
import { WorldProvider, useWorld } from 'koota/react'

import { keyboardVelocitySystem } from './entities/keyboard/systems'

export const world = createWorld()

export function RootProviders({ children }: { children: ReactNode }) {
  return <WorldProvider world={world}>{children}</WorldProvider>
}

const NestedCheckContext = createContext(false)

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
  const isNested = use(NestedCheckContext)
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

  return <NestedCheckContext value>{children}</NestedCheckContext>
}
