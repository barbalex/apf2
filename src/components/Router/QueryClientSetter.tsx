import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  store,
  tsQueryClientAtom,
} from '../../store/index.ts'

export const QueryClientSetter = () => {
  const tsQueryClient = useQueryClient()
  const tsQueryClientInstore = store.get(tsQueryClientAtom)

  const wasSet = useRef(false)

  useEffect(() => {
    if (tsQueryClientInstore) return
    // prevent setting navigate twice
    // only because of strict mode?
    if (wasSet.current) return

    store.set(tsQueryClientAtom, tsQueryClient)
    wasSet.current = true
  }, [tsQueryClient, tsQueryClientInstore])

  return null
}
