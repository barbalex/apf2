import isNodeOpen from './isNodeOpen'
import openNode from './openNode'

export default ({ treeName, node, store }) => {
  if (!node.url) throw new Error('passed node has no url')
  const { dataFilterSetActiveTable } = store
  const { openNodes, setActiveNodeArray, dataFilter } = store[treeName]

  if (dataFilter) {
    const show = !!dataFilter.activeTable
    if (show) {
      dataFilterSetActiveTable({ treeName: treeName, activeTable: null })
    }
  }

  if (!isNodeOpen(openNodes, node.url)) {
    openNode({ treeName, node, openNodes, store })
  }
  setActiveNodeArray([...node.url])
}
