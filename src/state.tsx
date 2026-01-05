import PartySocket from 'partysocket'
import { proxy } from 'valtio'

interface MainState {
  party: PartySocket | null
  partyData: string
  cliendId: string

  cameraFollowPlayer: boolean
  cameraPosition: [x: number, y: number, z: number]
  cameraRotation: [x: number, y: number, z: number]
}

export const mainState = proxy<MainState>({
  cameraFollowPlayer: false,
  cameraPosition: [0, 0, 0],
  cameraRotation: [0, 0, 0],
  cliendId: '',
  party: null,
  partyData: '',
})
