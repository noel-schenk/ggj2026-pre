import { mainState } from '@/state'

import { trait } from 'koota'

export const Owner = trait({ clientId: mainState.clientId })
