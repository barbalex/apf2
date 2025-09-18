// This is the entry file for the application
import { memo, useContext, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from '@tanstack/react-query'

import { MobxContext } from '../../mobxContext.js'

export const QueryClientSetter = memo(
  observer(() => {
    const tsQueryClient = useQueryClient()
    const store = useContext(MobxContext)
    const { setQueryClient } = store

    const wasSet = useRef(false)

    useEffect(() => {
      if (store.queryClient) return
      // prevent setting navigate twice
      // only because of strict mode?
      if (wasSet.current) return

      // console.log('NavigateSetter setting navigate')
      setQueryClient(tsQueryClient)
      wasSet.current = true
    }, [tsQueryClient, setQueryClient, store.queryClient])

    return null
  }),
)
