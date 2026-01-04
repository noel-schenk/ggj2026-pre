import { SyncTrait, SyncedTraits } from '@/shared/traits'

import { useEffect } from 'react'

import { useWorld } from 'koota/react'
import { attempt, isError, isNil } from 'lodash-es'
import usePartySocket from 'partysocket/react'

import { Authority } from './traits'

type SyncedTraitsData = {
  [K in keyof typeof SyncedTraits]: any
}[]

const encode = (object: any) => btoa(JSON.stringify(object))

const decode = (message: any) => JSON.parse(atob(message))

export const Multiplayer = () => {
  const world = useWorld()

  const onPartyData = (message: string) => {
    if (isError(attempt(decode, message))) return

    const data = decode(message) // encoded by server

    if (isNil(data.message)) return

    const syncData = decode(data.message) // encoded by other clients

    if (syncData.type !== 'multiplayer-sync' || isNil(syncData.data)) return

    // only type multiplayer-sync

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
  }

  const party = usePartySocket({
    host: import.meta.env.VITE_MULTIPLAYER_SERVER,

    onClose() {
      console.log('closed')
    },

    onError(e) {
      console.log('error', e)
    },

    onMessage(e) {
      onPartyData(e.data)
      console.log('message', e.data)
    },
    // TODO: make use of rooms
    onOpen() {
      console.log('connected')
    },
    room: 'my-room',
  })

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

      party.send(
        encode({
          data: entityWithSyncedTraitsData,
          type: 'multiplayer-sync',
        })
      )
    }, 1) // this is how often the state gets syncd

    return () => clearInterval(interval)
  }, [])

  console.log(import.meta.env.VITE_MULTIPLAYER_SERVER)

  return <></>
}
