import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  store as jotaiStore,
  tsQueryClientAtom,
} from '../../JotaiStore/index.ts'

export const QueryClientSetter = () => {
  const tsQueryClient = useQueryClient()
  const tsQueryClientInJotaiStore = jotaiStore.get(tsQueryClientAtom)

  const wasSet = useRef(false)

  useEffect(() => {
    if (tsQueryClientInJotaiStore) return
    // prevent setting navigate twice
    // only because of strict mode?
    if (wasSet.current) return

    jotaiStore.set(tsQueryClientAtom, tsQueryClient)
    wasSet.current = true
  }, [tsQueryClient, tsQueryClientInJotaiStore])

  return null
}
