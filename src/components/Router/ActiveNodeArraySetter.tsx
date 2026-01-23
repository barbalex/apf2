import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { isEqual } from 'es-toolkit'
import { useLocation } from 'react-router'

import { treeActiveNodeArrayAtom, treeSetActiveNodeArrayAtom } from '../../store/index.ts'
import { getActiveNodeArrayFromPathname } from '../../modules/getActiveNodeArrayFromPathname.ts'

export const ActiveNodeArraySetter = () => {
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const setActiveNodeArray = useSetAtom(treeSetActiveNodeArrayAtom)

  const { pathname } = useLocation()

  // when pathname changes, update activeNodeArray
  useEffect(() => {
    const newAna = getActiveNodeArrayFromPathname(pathname)
    if (!isEqual(newAna, activeNodeArray.slice())) {
      // console.log('ActiveNodeArraySetter setting activeNodeArray to: ', newAna)
      // user pushed back button > update activeNodeArray
      setActiveNodeArray(newAna)
    }
  }, [activeNodeArray, pathname, setActiveNodeArray])

  return null
}
