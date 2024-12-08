import { memo, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import isEqual from 'lodash/isEqual'
import { useLocation } from 'react-router'

import { MobxContext } from '../../storeContext.js'
import { getActiveNodeArrayFromPathname } from '../../modules/getActiveNodeArrayFromPathname.js'

export const ActiveNodeArraySetter = memo(
  observer(() => {
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
  }),
)
