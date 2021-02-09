import isEqual from 'lodash/isEqual'

import isNodeOpen from './isNodeOpen'
import isNodeInActiveNodePath from './isNodeInActiveNodePath'

export default ({ treeName, node, store }) => {
  if (!node.url) throw new Error('passed node has no url')
  const {
    openNodes,
    setOpenNodes,
    activeNodeArray,
    setActiveNodeArray,
    setLastTouchedNode,
  } = store[treeName]

  let newOpenNodes = [...openNodes]
  if (isNodeOpen({ openNodes, url: node.url })) {
    newOpenNodes = newOpenNodes.filter((n) => !isEqual(n, node.url))
    if (isNodeInActiveNodePath({ node, activeNodeArray })) {
      // when a user closes a folder in the active node path
      // the active node should swith to the node's parent
      const newActiveNodeArray = [...node.url]
      newActiveNodeArray.pop()
      setActiveNodeArray(newActiveNodeArray)
    }
  } else {
    newOpenNodes.push(node.url)
  }
  setOpenNodes(newOpenNodes)
  setLastTouchedNode(node.url)
}
