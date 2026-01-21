import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

import {
  navigateAtom,
  store,
  navigateObjectAtom,
} from '../../JotaiStore/index.ts'

export const NavigateSetter = () => {
  const navigate = useNavigate()
  const navigateSet = useRef(false)

  useEffect(() => {
    // prevent setting navigate twice
    // only because of strict mode?
    if (navigateSet.current) return

    store.set(navigateObjectAtom, { fn: navigate })
    navigateSet.current = true
  }, [navigate])

  return null
}
