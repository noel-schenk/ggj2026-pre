import { SyncTrait, SyncedTraits } from '@/shared/traits'
import { mainState } from '@/state'
import { assertTrue } from '@/utils'

import { useEffect } from 'react'

import { useWorld } from 'koota/react'
import { attempt, isError, isNil } from 'lodash-es'
import usePartySocket from 'partysocket/react'
import { subscribeKey } from 'valtio/utils'

import { Parse } from './parse'
import { Owner } from './traits'

type SyncedTraitsData = {
  [K in keyof typeof SyncedTraits]: any
}[]

export const encode = <T extends keyof MessageTypes>(
  object: MessageLayout<T>
) => btoa(JSON.stringify(object))

export const decode = (message: any) => JSON.parse(atob(message))

export const getDecodedClientData = (
  clientData: string
): MessageLayout<keyof MessageTypes> => {
  const result = attempt(decode, clientData)
  assertTrue(!isError(result), 'error decoding clientData')
  return result // encoded by other clients
}

export const Multiplayer = () => {
  mainState.client = usePartySocket({
    host: import.meta.env.VITE_MULTIPLAYER_SERVER,

    onClose() {
      console.log('closed')
    },

    onError(e) {
      console.log('error', e)
    },

    onMessage(e) {
      mainState.partyData = getDecodedClientData(e.data)
    },
    // TODO: make use of rooms
    onOpen(ev) {
      console.log('connected as:', (ev!.target! as any).id)
      console.log('ev:', ev)

      assertTrue(!isNil(mainState.client))

      mainState.clientId = mainState.client.id
      mainState.connectedSince = Date.now()
    },
    room: 'my-room2',
  })

  // console.log('server ip: ', import.meta.env.VITE_MULTIPLAYER_SERVER)
  // console.log('client id: ', mainState.party.id)

  return <></>
}

export const MultiplayerSync = () => {
  const world = useWorld()

  // On Client Sync received
  useEffect(() => {
    const unsubscribe = subscribeKey(mainState, 'partyData', () => {
      const syncData = mainState.partyData
      if (
        !syncData ||
        syncData.type !== 'multiplayer-sync' ||
        isNil(syncData.data)
      )
        return

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
        .query(Owner)
        .map(entity =>
          Object.fromEntries(
            Object.entries(SyncedTraits).map(([key, trait]) => [
              key,
              entity.get(trait),
            ])
          )
        )

      if (isNil(mainState.client)) return
      mainState.client.send(
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
    if (isNil(mainState.client)) return

    const unsubscribe = subscribeKey(mainState, 'partyData', () => {
      const spawnData = mainState.partyData
      if (!spawnData || spawnData.type !== 'multiplayer-spawn') return

      console.log(spawnData)

      const childrenData = spawnData.data

      if (childrenData.id === id) onUpdate(childrenData.children)
    })

    return unsubscribe
  }, [mainState.client])

  return <Parse tsx={children} />
}

export const updateMultiplayerPortal = (id: string, children: string) => {
  if (isNil(mainState.client)) return

  mainState.client.send(
    encode({
      data: {
        children: children,
        id: id,
      },
      type: 'multiplayer-spawn',
    })
  )
}
