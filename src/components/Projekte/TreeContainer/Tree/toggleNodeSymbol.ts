import { isEqual } from 'es-toolkit'
import { getSnapshot } from 'mobx-state-tree'

import { isNodeOpen } from '../isNodeOpen.ts'
import { isNodeInActiveNodePath } from '../isNodeInActiveNodePath.ts'
import {
  store as jotaiStore,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
} from '../../../../JotaiStore/index.js'

export const toggleNodeSymbol = ({
  node,
  store,
  search,
  doNotSwitchToNodesParent = false,
}) => {
  if (!node.url) throw new Error('passed node has no url')

  const navigate = jotaiStore.get(navigateAtom)
  const { openNodes: openNodesRaw, setOpenNodes, activeNodeArray } = store.tree

  const openNodes = getSnapshot(openNodesRaw)

  let newOpenNodes = [...openNodes]
  if (isNodeOpen({ openNodes, url: node.url })) {
    // remove all children of this url
    newOpenNodes = newOpenNodes.filter(
      (n) => !isEqual(n.slice(0, node.url.length), node.url),
    )
    if (
      isNodeInActiveNodePath({ node, activeNodeArray }) &&
      !doNotSwitchToNodesParent
    ) {
      // when a user closes a folder in the active node path
      // the active node should switch to the node's parent
      const newActiveNodeArray = node.url.toSpliced(-1)
      navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
    }
  } else {
    newOpenNodes.push(node.url)
  }
  jotaiStore.set(setTreeLastTouchedNodeAtom, node.url)
  setOpenNodes(newOpenNodes)
}
