import { mainState } from '@/state'

import { useEffect } from 'react'

import { isNil } from 'lodash-es'
import { subscribeKey } from 'valtio/utils'

export const HandleMultiplayerInit = () => {
  useEffect(() => {
    if (isNil(mainState.client)) return

    const unsubscribe = subscribeKey(mainState, 'partyData', () => {
      const data = mainState.partyData as MessageLayout<'authority-sync'>
      if (!data || data.type !== 'authority-sync') return

      mainState.authorityId = data.data.authority

      console.log('as authority:', mainState.authorityId === mainState.clientId)
    })

    return unsubscribe
  }, [mainState.client])

  return null
}
