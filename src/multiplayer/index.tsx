import { SyncTrait, SyncedTraits } from '@/shared/traits'
import { mainState } from '@/state'
import { assertTrue } from '@/utils'

import { useEffect } from 'react'

import { useWorld } from 'koota/react'
import { attempt, isError, isNil } from 'lodash-es'
import usePartySocket from 'partysocket/react'
import { subscribeKey } from 'valtio/utils'

import { Parse } from './parse'
import { Authority } from './traits'

type SyncedTraitsData = {
  [K in keyof typeof SyncedTraits]: any
}[]

export const encode = (object: any) => btoa(JSON.stringify(object))

export const decode = (message: any) => JSON.parse(atob(message))

export const getDecodedClientData = (): { data: any; type: string } => {
  assertTrue(
    !isError(attempt(decode, mainState.partyData)),
    'error decoding serverData'
  )

  const clientData = decode(mainState.partyData).message // encoded by server

  assertTrue(!isError(attempt(decode, clientData)), 'error decoding clientData')

  return decode(clientData) // encoded by other clients
}

export const Multiplayer = () => {
  mainState.party = usePartySocket({
    host: import.meta.env.VITE_MULTIPLAYER_SERVER,

    onClose() {
      console.log('closed')
    },

    onError(e) {
      console.log('error', e)
    },

    onMessage(e) {
      mainState.partyData = e.data
    },
    // TODO: make use of rooms
    onOpen() {
      console.log('connected')
    },
    room: 'my-room',
  })

  console.log('server ip: ', import.meta.env.VITE_MULTIPLAYER_SERVER)
  console.log('client id: ', mainState.party.id)

  return <></>
}

export const MultiplayerSync = () => {
  const world = useWorld()

  // On Client Sync received
  useEffect(() => {
    const unsubscribe = subscribeKey(mainState, 'partyData', () => {
      const syncData = getDecodedClientData()

      if (syncData.type !== 'multiplayer-sync' || isNil(syncData.data)) return

      const entityWithSyncedTraitsData = syncData.data as SyncedTraitsData

      entityWithSyncedTraitsData.forEach(syncEntity => {
        const entityToSync = world
          .query(SyncTrait)
          .find(entity => entity.get(SyncTrait)?.id === syncEntity.sync.id)
        if (isNil(entityToSync)) return

        Object.entries(syncEntity).forEach(syncTrait => {
          const syncName = syncTrait[0] as keyof typeof SyncedTraits
          const syncData = syncTrait[1]
          const traitToSync = SyncedTraits[syncName]
          entityToSync.set(traitToSync, syncData) // this syncs the trait data
        })
      })
    })

    return unsubscribe
  }, [])

  // Sync Interval
  useEffect(() => {
    const interval = setInterval(() => {
      world.query()

      const entityWithSyncedTraitsData = world
        .query(Authority)
        .map(entity =>
          Object.fromEntries(
            Object.entries(SyncedTraits).map(([key, trait]) => [
              key,
              entity.get(trait),
            ])
          )
        )

      if (isNil(mainState.party)) return
      mainState.party.send(
        encode({
          data: entityWithSyncedTraitsData,
          type: 'multiplayer-sync',
        })
      )
    }, 1) // this is how often the state gets synct

    return () => clearInterval(interval)
  }, [])

  return <></>
}

interface MultiplayerPortalProps {
  children: string
  id: string
  onUpdate: (data: string) => void
}
/**
 * Behaves like a portal between two instances
 * Will sync everything you pass into it
 * @param children
 * @param id unique and static id to identify the Portal on the other side
 * @param onUpdate when other Clients try to update this Client
 * @returns
 */
export const MultiplayerPortal = ({
  children,
  id,
  onUpdate,
}: MultiplayerPortalProps) => {
  useEffect(() => {
    if (isNil(mainState.party)) return

    const unsubscribe = subscribeKey(mainState, 'partyData', () => {
      const spawnData = getDecodedClientData()

      if (spawnData.type !== 'multiplayer-spawn') return

      const childrenData = spawnData.data

      if (childrenData.id === id) onUpdate(childrenData.children)
    })

    return unsubscribe
  }, [mainState.party])

  return <Parse tsx={children} />
}

export const updateMultiplayerPortal = (id: string, children: string) => {
  if (isNil(mainState.party)) return

  mainState.party.send(
    encode({
      data: {
        children: children,
        id: id,
      },
      type: 'multiplayer-spawn',
    })
  )
}
