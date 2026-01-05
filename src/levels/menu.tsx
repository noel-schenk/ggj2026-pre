import { Camera } from '@/entities/camera'
import { Cursor } from '@/entities/cursor'
import { Land } from '@/entities/land'
import { MultiplayerPortal, updateMultiplayerPortal } from '@/multiplayer'
import { Authority } from '@/multiplayer/traits'
import { SyncTrait } from '@/shared/traits'
import { mainState } from '@/state'
import { arrayToVector3, getNewUsername, lerpVector3, px, uuid } from '@/utils'

import { useEffect, useRef, useState } from 'react'

import '@react-three/p2'
import { Physics } from '@react-three/p2'
import { Container, Text } from '@react-three/uikit'
import { Button, Input } from '@react-three/uikit-default'
import { useWorld } from 'koota/react'

export const MenuLevel = () => {
  const world = useWorld()

  const PLAYER_SPAWNER_ID = 'player-spawner' as const

  const playerIdRef = useRef(uuid())
  const [playerGroup, setPlayerGroup] = useState(``)
  const [playerNameToSpawn, setPlayerNameToSpawn] = useState(() =>
    getNewUsername()
  )

  useEffect(() => {
    mainState.cameraPosition = [-10.07, 20, -9.2]
    mainState.cameraRotation = [-Math.PI / 2, 0, 0]
  }, [])

  const updateAuthorityOnPlayerGroup = () => {
    setTimeout(() => {
      world
        .query(SyncTrait)
        .find(entity => entity.get(SyncTrait)?.id === playerIdRef.current)
        ?.add(Authority)
    }, 1000)
  }

  const onUpdatePlayerGroup = (data: string) => {
    setPlayerGroup(data)
    updateAuthorityOnPlayerGroup()
  }

  const joinPlayer = () => {
    mainState.cameraFollowPlayer = false
    lerpVector3(
      arrayToVector3(mainState.cameraPosition),
      arrayToVector3([-7.57, 16.16, 11.8]),
      500,
      newPosition => {
        mainState.cameraPosition = newPosition.toArray()
      }
    )
    lerpVector3(
      arrayToVector3(mainState.cameraRotation),
      arrayToVector3([
        -0.9332755459863794, -0.28903323954036725, -0.4631507365545853,
      ]),
      500,
      (newRotation, isLast) => {
        if (isLast)
          setTimeout(() => (mainState.cameraFollowPlayer = true), 1000)
        mainState.cameraRotation = newRotation.toArray()
      }
    )

    const newPlayerGroup = `
            ${playerGroup}
            <Controller speed={5} authority={"${mainState.cliendId}"} syncId={"${playerIdRef.current}"}>
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
      {/* <Camera position={[0, 20, 0]} rotation={[-Math.PI / 2, 0, 0]} /> */}
      <Camera />

      {/* UI */}

      <mesh position={[-10, 0, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <Container
          backgroundColor="lightGray"
          width={px(600)}
          height={px(400)}
          alignItems="center"
          justifyContent="center"
        >
          <Container flexDirection="column" gap={px(20)}>
            <Input
              value={playerNameToSpawn}
              onValueChange={setPlayerNameToSpawn}
              width={200}
              placeholder="Username"
            />
            <Button onClick={() => joinPlayer()}>
              <Text>Join</Text>
            </Button>
          </Container>
        </Container>
      </mesh>

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
