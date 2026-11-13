import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useStore } from 'jotai'

import { navigateObjectAtom } from '../../store/index.ts'

// writes the surrounding router's navigate function into the surrounding
// jotai store (useStore resolves to the tree2 pane's store inside the
// pane's Provider, to the app's store in the main tree). Pane and main
// tree MUST NOT share one navigate: ProtectedRoute renders this setter in
// both, and a shared value would navigate one tree's router from the other
export const NavigateSetter = () => {
  const navigate = useNavigate()
  const store = useStore()
  const navigateSet = useRef(false)

  useEffect(() => {
    // prevent setting navigate twice
    // only because of strict mode?
    if (navigateSet.current) return

    store.set(navigateObjectAtom, navigate)
    navigateSet.current = true
  }, [navigate, store])

  return null
}
