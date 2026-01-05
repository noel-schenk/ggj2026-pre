import PartySocket from 'partysocket'
import { proxy } from 'valtio'

interface MainState {
  party: PartySocket | null
  partyData: string
  cliendId: string
}

export const mainState = proxy<MainState>({
  cliendId: '',
  party: null,
  partyData: '',
})
