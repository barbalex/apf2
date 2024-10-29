import { getSnapshot } from 'mobx-state-tree'

import isNodeOpen from '../isNodeOpen'
import openNode from '../openNode'

export const toggleNode = ({ node, store, navigate, search }) => {
  if (!node.url) throw new Error('passed node has no url')
  const {
    openNodes: openNodesRaw,
    activeNodeArray,
    setLastTouchedNode,
  } = store.tree
  const aNA = getSnapshot(activeNodeArray)
  const openNodes = getSnapshot(openNodesRaw)

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
    // make it's parent the new active node
    newActiveNodeArray = [...node.url]
    newActiveNodeArray.pop()
  } else {
    // the node is open
    // but not the active node
    // make it the new active node
    newActiveNodeArray = [...node.url]
  }
  navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
  setLastTouchedNode(node.url)
}
