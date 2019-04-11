import isNodeOpen from './isNodeOpen'
import openNode from './openNode'

export default ({ treeName, node, store }) => {
  if (!node.url) throw new Error('passed node has no url')
  const { nodeFilterSetActiveTable, nodeFilter } = store
  const { openNodes, setActiveNodeArray } = store[treeName]

  if (nodeFilter) {
    const show = !!nodeFilter[treeName].activeTable
    if (show) {
      nodeFilterSetActiveTable({ treeName: treeName, activeTable: null })
    }
  }

  if (!isNodeOpen(openNodes, node.url)) {
    openNode({ treeName, node, openNodes, store })
  }
  setActiveNodeArray([...node.url])
}
