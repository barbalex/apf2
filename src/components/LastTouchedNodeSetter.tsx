import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useSetAtom } from 'jotai'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../mobxContext.ts'
import { setTreeLastTouchedNodeAtom } from '../JotaiStore/index.ts'

export const LastTouchedNodeSetter = observer(() => {
  const store = useContext(MobxContext)
  const activeNodeArray = store.tree.activeNodeArray
  const setLastTouchedNode = useSetAtom(setTreeLastTouchedNodeAtom)

  useEffect(() => {
    // set last touched node in case project is directly opened on it
    const nodeArray = getSnapshot(activeNodeArray)
    setLastTouchedNode(nodeArray)
  }, [activeNodeArray, setLastTouchedNode])

  return null
})
