import { getSnapshot } from 'mobx-state-tree'

import { isNodeOpen } from '../isNodeOpen.js'
import { openNode } from '../openNode.js'

export const toggleNode = ({ node, store, navigate, search }) => {
  if (!node.url) throw new Error('passed node has no url')
  const {
    openNodes: openNodesRaw,
    activeNodeArray,
    setLastTouchedNode,
  } = store.tree
  const aNA = getSnapshot(activeNodeArray)
  const openNodes = getSnapshot(openNodesRaw)

  console.log('toggleNode', { node, openNodes, aNA })

  let newActiveNodeArray = []
  if (!isNodeOpen({ openNodes, url: node.url })) {
    // node is closed
    // open it and make it the active node
    openNode({ node, openNodes, store })
    newActiveNodeArray = [...node.url]
    // some elements are numbers but they are contained in url as text
  } else if (node.urlLabel == aNA.slice(-1)[0]) {
    // the node is open
    // AND it is the active node
    // BEFORE 2024.12.12:
    // make it's parent the new active node
    // newActiveNodeArray = [...node.url]
    // newActiveNodeArray.pop()
    // AFTER 2024.12.12:
    // don't do anything
    return
  } else {
    // the node is open
    // but not the active node
    // make it the new active node
    newActiveNodeArray = [...node.url]
  }
  navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
  setLastTouchedNode(node.url)
}
