import { memo, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../mobxContext.js'

export const LastTouchedNodeSetter = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const { activeNodeArray, setLastTouchedNode } = store.tree

    useEffect(() => {
      // set last touched node in case project is directly opened on it
      setLastTouchedNode(getSnapshot(activeNodeArray))
    }, [activeNodeArray, setLastTouchedNode])

    return null
  }),
)
