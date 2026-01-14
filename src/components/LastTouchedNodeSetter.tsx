import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../mobxContext.ts'

export const LastTouchedNodeSetter = observer(() => {
  const store = useContext(MobxContext)
  const { activeNodeArray, setLastTouchedNode } = store.tree

  useEffect(() => {
    // set last touched node in case project is directly opened on it
    const nodeArray = getSnapshot(store.tree.activeNodeArray)
    setLastTouchedNode(nodeArray)
  }, [store.tree.activeNodeArray, setLastTouchedNode])

  return null
})
