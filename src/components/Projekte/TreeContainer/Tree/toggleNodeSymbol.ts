import { isEqual } from 'es-toolkit'

import { isNodeOpen } from '../isNodeOpen.ts'
import { isNodeInActiveNodePath } from '../isNodeInActiveNodePath.ts'
import {
  store,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  treeActiveNodeArrayAtom,
} from '../../../../store/index.ts'

export const toggleNodeSymbol = ({
  node,
  search,
  doNotSwitchToNodesParent = false,
}) => {
  if (!node.url) throw new Error('passed node has no url')

  const navigate = store.get(navigateAtom)
  const openNodes = store.get(treeOpenNodesAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)

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
  store.set(setTreeLastTouchedNodeAtom, node.url)
  store.set(treeSetOpenNodesAtom, newOpenNodes)
}
