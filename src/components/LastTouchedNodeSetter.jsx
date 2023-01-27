import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import storeContext from '../storeContext'

const LastTouchedNodeSetter = () => {
  const store = useContext(storeContext)
  const { activeNodeArray, setLastTouchedNode } = store.tree

  useEffect(() => {
    // set last touched node in case project is directly opened on it
    setLastTouchedNode(getSnapshot(activeNodeArray))
  }, [activeNodeArray, setLastTouchedNode])

  return null
}

export default observer(LastTouchedNodeSetter)
