import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'

import { MenuLevel } from './levels/menu'
import { Multiplayer, MultiplayerSync } from './multiplayer'
import { KootaSystems } from './providers'

export function App() {
  return (
    <Canvas shadows>
      <Physics debug>
        <KootaSystems>
          <MenuLevel />
          <Multiplayer />
          <MultiplayerSync />
        </KootaSystems>
      </Physics>
    </Canvas>
  )
}
