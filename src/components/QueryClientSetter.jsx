// This is the entry file for the application
import { useContext, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from '@tanstack/react-query'

import storeContext from '../storeContext'

const QueryClientSetter = () => {
  const queryClient = useQueryClient()
  const store = useContext(storeContext)
  const { setQueryClient } = store

  const wasSet = useRef(false)

  useEffect(() => {
    if (store.queryClient) return
    // prevent setting navigate twice
    // only because of strict mode?
    if (wasSet.current) return

    // console.log('NavigateSetter setting navigate')
    setQueryClient(queryClient)
    wasSet.current = true
  }, [queryClient, setQueryClient, store.queryClient])

  return null
}

export default observer(QueryClientSetter)
