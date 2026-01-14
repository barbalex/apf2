import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { isEqual } from 'es-toolkit'
import { useLocation } from 'react-router'

import { MobxContext } from '../../mobxContext.js'
import { getActiveNodeArrayFromPathname } from '../../modules/getActiveNodeArrayFromPathname.ts'

export const ActiveNodeArraySetter = observer(() => {
  const store = useContext(MobxContext)
  const { activeNodeArray, setActiveNodeArray } = store.tree

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
})
