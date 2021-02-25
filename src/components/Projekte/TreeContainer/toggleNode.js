import isNodeOpen from './isNodeOpen'
import openNode from './openNode'

const toggleNode = ({ treeName, node, store }) => {
  if (!node.url) throw new Error('passed node has no url')
  const { dataFilterSetActiveTable } = store
  const {
    openNodes,
    setActiveNodeArray,
    activeNodeArray,
    dataFilter,
    setLastTouchedNode,
  } = store[treeName]

  if (dataFilter) {
    const show = !!dataFilter.activeTable
    if (show) {
      dataFilterSetActiveTable({ treeName: treeName, activeTable: null })
    }
  }

  if (!isNodeOpen({ openNodes, url: node.url })) {
    // node is closed
    // open it and make it the active node
    openNode({ treeName, node, openNodes, store })
    const newActiveNodeArray = [...node.url]
    setActiveNodeArray(newActiveNodeArray)
    setLastTouchedNode(node.url)
    // some elements are numbers but they are contained in url as text
    // eslint-disable-next-line eqeqeq
  } else if (node.urlLabel == activeNodeArray.slice(-1)[0]) {
    // the node is open
    // AND it is the active node
    // make it's parent the new active node
    const newActiveNodeArray = [...node.url]
    newActiveNodeArray.pop()
    setActiveNodeArray(newActiveNodeArray)
    setLastTouchedNode(node.url)
  } else {
    // the node is open
    // but not the active node
    // make it the new active node
    const newActiveNodeArray = [...node.url]
    setActiveNodeArray(newActiveNodeArray)
    setLastTouchedNode(node.url)
  }
}

export default toggleNode
