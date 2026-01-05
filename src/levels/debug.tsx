import { Camera } from '@/entities/camera'
import { Cursor } from '@/entities/cursor'
import { Land } from '@/entities/land'
import { MultiplayerPortal, updateMultiplayerPortal } from '@/multiplayer'
import { Authority } from '@/multiplayer/traits'
import { SyncTrait } from '@/shared/traits'
import { mainState } from '@/state'
import { uuid } from '@/utils'

import { useRef, useState } from 'react'

import { Html } from '@react-three/drei'
import '@react-three/p2'
import { Physics } from '@react-three/p2'
import { useWorld } from 'koota/react'
import { random } from 'lodash-es'
import { Vector3 } from 'three'

export function DebugLevel() {
  const world = useWorld()

  const PLAYER_SPAWNER_ID = 'player-spawner' as const

  const playerId = useRef(uuid())
  const [playerGroup, setPlayerGroup] = useState(``)
  const [playerNameToSpawn, setPlayerNameToSpawn] = useState(
    `${random(0, 99, false)}`
  )

  const updateAuthorityOnPlayerGroup = () => {
    setTimeout(() => {
      world
        .query(SyncTrait)
        .find(entity => entity.get(SyncTrait)?.id === playerId.current)
        ?.add(Authority)
    }, 1000)
  }

  const onUpdatePlayerGroup = (data: string) => {
    setPlayerGroup(data)
    updateAuthorityOnPlayerGroup()
  }

  const joinPlayer = () => {
    const newPlayerGroup = `
            ${playerGroup}
            <Controller speed={5} authority={"${mainState.cliendId}"} syncId={"${playerId.current}"}>
              <mesh castShadow position={[0, 0.5, 0]} receiveShadow>
                <boxGeometry args={[0.3, 1, 0.3]} />
                <meshStandardMaterial color="blue" />
              </mesh>
            </Controller>`

    updateMultiplayerPortal(PLAYER_SPAWNER_ID, newPlayerGroup) // Update remote Clients
    setPlayerGroup(newPlayerGroup) // Update this client
    updateAuthorityOnPlayerGroup()
  }

  return (
    <Physics normalIndex={2}>
      <Camera position={[0, 3, 0]} rotation={[-0.87, -0.56, -0.57]} />

      {/* UI */}

      <Html position={new Vector3(0, 0, 0)} center>
        <input
          onChange={ev => setPlayerNameToSpawn(ev.target.value)}
          value={playerNameToSpawn}
        />
        <button
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
          }}
          onClick={() => joinPlayer()}
        >
          Join
        </button>
      </Html>

      <MultiplayerPortal id={PLAYER_SPAWNER_ID} onUpdate={onUpdatePlayerGroup}>
        {playerGroup}
      </MultiplayerPortal>

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
