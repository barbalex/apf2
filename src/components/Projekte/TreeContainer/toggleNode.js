// @flow
import isNodeOpen from './isNodeOpen'
import openNode from './openNode'

export default ({
  treeName,
  node,
  mobxStore,
}: {
  treeName: string,
  node: Object,
  mobxStore: Object,
}): any => {
  if (!node.url) throw new Error('passed node has no url')
  const { nodeFilterSetActiveTable, nodeFilter } = mobxStore
  const { openNodes, setActiveNodeArray } = mobxStore[treeName]

  if (nodeFilter) {
    const show = !!nodeFilter[treeName].activeTable
    if (show) {
      nodeFilterSetActiveTable({ treeName: treeName, activeTable: null })
    }
  }

  if (!isNodeOpen(openNodes, node.url)) {
    openNode({ treeName, node, openNodes, mobxStore })
  }
  setActiveNodeArray([...node.url])
}
