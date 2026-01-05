import PartySocket from 'partysocket'
import { proxy } from 'valtio'

interface MainState {
  party: PartySocket | null
  partyData: string
}

export const mainState = proxy<MainState>({ party: null, partyData: '' })
