import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

import { navigateObjectAtom, store } from '../../JotaiStore/index.ts'

export const NavigateSetter = () => {
  const navigate = useNavigate()
  const navigateSet = useRef(false)

  useEffect(() => {
    // prevent setting navigate twice
    // only because of strict mode?
    if (navigateSet.current) return

    store.set(navigateObjectAtom, navigate)
    navigateSet.current = true
  }, [navigate])

  return null
}
