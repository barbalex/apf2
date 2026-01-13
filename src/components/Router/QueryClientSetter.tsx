import { useContext, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from '@tanstack/react-query'

import { MobxContext } from '../../mobxContext.js'

export const QueryClientSetter = observer(() => {
  const tsQueryClient = useQueryClient()
  const store = useContext(MobxContext)
  const { setTsQueryClient } = store

  const wasSet = useRef(false)

  useEffect(() => {
    if (store.tsQueryClient) return
    // prevent setting navigate twice
    // only because of strict mode?
    if (wasSet.current) return

    // console.log('NavigateSetter setting navigate')
    setTsQueryClient(tsQueryClient)
    wasSet.current = true
  }, [tsQueryClient, setTsQueryClient, store.tsQueryClient])

  return null
})
