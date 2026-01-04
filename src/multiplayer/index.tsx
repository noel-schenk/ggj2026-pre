import { useWorld } from 'koota/react'

import { Authority } from './traits'

class _MultiplayerProperty {
  ownedBy: number = -1
  property: unknown = null
}

export const Multiplayer = () => {
  const world = useWorld()

  world.onChange(Authority, () => {
    console.log('something changed with the Authority')
  })

  console.log(import.meta.env.VITE_MULTIPLAYER_SERVER)

  return <></>
}
