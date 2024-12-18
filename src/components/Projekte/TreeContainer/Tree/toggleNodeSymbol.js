import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

import { isNodeOpen } from '../isNodeOpen.js'
import { isNodeInActiveNodePath } from '../isNodeInActiveNodePath.js'

export const toggleNodeSymbol = ({ node, store, search, navigate, doNotSwitchToNodesParent = false }) => {
  if (!node.url) throw new Error('passed node has no url')
  const {
    openNodes: openNodesRaw,
    setOpenNodes,
    activeNodeArray,
    setLastTouchedNode,
  } = store.tree

  const openNodes = getSnapshot(openNodesRaw)

  console.log('toggleNodeSymbol', {
    node,
    activeNodeArray: getSnapshot(activeNodeArray),
    openNodes,
  })

  let newOpenNodes = [...openNodes]
  if (isNodeOpen({ openNodes, url: node.url })) {
    // remove all children of this url
    newOpenNodes = newOpenNodes.filter(
      (n) => !isEqual(n.slice(0, node.url.length), node.url),
    )
    if (isNodeInActiveNodePath({ node, activeNodeArray })&&!doNotSwitchToNodesParent) {
      // when a user closes a folder in the active node path
      // the active node should switch to the node's parent
      const newActiveNodeArray = [...node.url]
      newActiveNodeArray.pop()
      navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
    }
  } else {
    newOpenNodes.push(node.url)
  }
  setLastTouchedNode(node.url)
  setOpenNodes(newOpenNodes)
}
