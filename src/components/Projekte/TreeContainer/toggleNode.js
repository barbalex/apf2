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
  const {openNodes}=mobxStore[treeName]

  if (nodeFilter) {
    const show = !!nodeFilter[treeName].activeTable
    if (show) {
      nodeFilterSetActiveTable({ treeName: treeName, activeTable: null })
    }
  }

  const newActiveNodeArray = [...node.url]
  const nodeIsOpen = isNodeOpen(openNodes, node.url)
  if (!nodeIsOpen) {
    openNode({ treeName, node, openNodes, mobxStore })
  }
  mobxStore[treeName].setActiveNodeArray(newActiveNodeArray)
}
