import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  setTreeLastTouchedNodeAtom,
  treeActiveNodeArrayAtom,
} from '../store/index.ts'

export const LastTouchedNodeSetter = () => {
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const setLastTouchedNode = useSetAtom(setTreeLastTouchedNodeAtom)

  useEffect(() => {
    // set last touched node in case project is directly opened on it
    setLastTouchedNode(activeNodeArray)
  }, [activeNodeArray, setLastTouchedNode])

  return null
}
