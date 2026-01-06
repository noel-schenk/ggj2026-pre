import PartySocket from 'partysocket'
import { proxy } from 'valtio'

interface MainState {
  client: PartySocket | null
  partyData: MessageLayout<keyof MessageTypes> | null
  clientId: string
  authorityId: string
  connectedSince: number

  cameraFollowPlayer: boolean
  cameraPosition: [x: number, y: number, z: number]
  cameraRotation: [x: number, y: number, z: number]
}

export const mainState = proxy<MainState>({
  authorityId: '',
  cameraFollowPlayer: false,
  cameraPosition: [0, 0, 0],
  cameraRotation: [0, 0, 0],
  client: null,
  clientId: '',
  connectedSince: 0,
  partyData: null,
})

export const isAuthority = (): boolean => {
  return mainState.clientId === mainState.authorityId
}
