import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import isEqual from 'lodash/isEqual'
import { useLocation } from 'react-router-dom'

import { StoreContext } from '../../storeContext.js'
import { getActiveNodeArrayFromPathname } from '../../modules/getActiveNodeArrayFromPathname.js'

const ActiveNodeArraySetter = () => {
  const store = useContext(StoreContext)
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
}

export default observer(ActiveNodeArraySetter)
