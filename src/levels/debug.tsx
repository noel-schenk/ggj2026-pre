import { Camera } from '@/entities/camera'
import { Controller } from '@/entities/controller'
import { Cursor } from '@/entities/cursor'
import { Land } from '@/entities/land'

import '@react-three/p2'
import { Physics } from '@react-three/p2'

export function DebugLevel() {
  return (
    <Physics normalIndex={2}>
      <Camera position={[0, 3, 0]} rotation={[-0.87, -0.56, -0.57]} />
      <Controller speed={5}>
        <mesh castShadow position={[0, 0.5, 0]} receiveShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </Controller>
      <Controller speed={5} position={[1, 0, 0]}>
        <mesh castShadow position={[0, 0.5, 0]} receiveShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </Controller>
      <Cursor />
      <Land>
        <mesh
          position={[-5.55, 1.09, 0]}
          receiveShadow
          rotation={[0, 0, -0.43633231299858244]}
        >
          <boxGeometry args={[6, 0.1, 6]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, -0.06, 0]} receiveShadow>
          <boxGeometry args={[6, 0.1, 6]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 0, -3.41]} receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </Land>
      <ambientLight />
      <directionalLight
        castShadow
        intensity={1}
        position={[-2.97, 3.17, 0]}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
    </Physics>
  )
}
