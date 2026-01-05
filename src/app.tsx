import { Canvas } from '@react-three/fiber'

import { MenuLevel } from './levels/menu'
import { Multiplayer, MultiplayerSync } from './multiplayer'
import { KootaSystems } from './providers'

export function App() {
  return (
    <Canvas shadows>
      <KootaSystems>
        <MenuLevel />
        <Multiplayer />
        <MultiplayerSync />
      </KootaSystems>
    </Canvas>
  )
}
