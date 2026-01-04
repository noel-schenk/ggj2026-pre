import { Canvas } from '@react-three/fiber'

import { DebugLevel } from './levels/debug'
import { Multiplayer } from './multiplayer'
import { KootaSystems } from './providers'

export function App() {
  return (
    <Canvas shadows>
      <KootaSystems>
        <DebugLevel />
        <Multiplayer />
      </KootaSystems>
    </Canvas>
  )
}
