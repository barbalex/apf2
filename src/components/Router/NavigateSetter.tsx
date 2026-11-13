import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import type { Store } from 'jotai'

import { navigateObjectAtom, store } from '../../store/index.ts'

// writes the router's navigate function into a store's navigateObjectAtom.
// Without a store prop this targets the root store (pane 1); the tree2
// pane passes its own store (see src/components/Projekte/Tree2)
export const NavigateSetter = ({ store: targetStore }: { store?: Store }) => {
  const navigate = useNavigate()
  const navigateSet = useRef(false)

  useEffect(() => {
    // prevent setting navigate twice
    // only because of strict mode?
    if (navigateSet.current) return

    ;(targetStore ?? store).set(navigateObjectAtom, navigate)
    navigateSet.current = true
  }, [navigate, targetStore])

  return null
}
