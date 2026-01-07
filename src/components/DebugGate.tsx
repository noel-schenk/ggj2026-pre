import { mainState } from '@/state'

import { type ReactNode } from 'react'

export function DebugGate({ children }: { children: ReactNode }) {
  return mainState.debug ?? children
}
