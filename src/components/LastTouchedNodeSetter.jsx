import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { StoreContext } from '../storeContext.js'

export const LastTouchedNodeSetter = observer(() => {
  const store = useContext(StoreContext)
  const { activeNodeArray, setLastTouchedNode } = store.tree

  useEffect(() => {
    // set last touched node in case project is directly opened on it
    setLastTouchedNode(getSnapshot(activeNodeArray))
  }, [activeNodeArray, setLastTouchedNode])

  return null
})
