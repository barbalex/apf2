import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useSetAtom, useAtomValue, useAtom } from 'jotai'

import { navigateAtom } from '../../JotaiStore/index.ts'

export const NavigateSetter = () => {
  const navigate = useNavigate()
  const [navigateInStore, setNavigate] = useAtom(navigateAtom)
  const navigateSet = useRef(false)

  useEffect(() => {
    if (navigateInStore) return
    // prevent setting navigate twice
    // only because of strict mode?
    if (navigateSet.current) return

    // console.log('NavigateSetter setting navigate')
    setNavigate(navigate)
    navigateSet.current = true
  }, [navigate, navigateInStore, setNavigate])

  return null
}
