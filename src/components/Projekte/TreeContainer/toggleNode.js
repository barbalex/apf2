// @flow
import isNodeOpen from './isNodeOpen'
import isNodeInActiveNodePath from './isNodeInActiveNodePath'
import openNode from './openNode'

export default ({
  treeName,
  node,
  openNodes,
  activeNodeArray,
  nodeFilter,
  mobxStore,
}: {
  treeName: string,
  node: Object,
  openNodes: Array<Array<string>>,
  activeNodeArray: Array<string>,
  nodeFilter: Object,
  mobxStore: Object,
}): any => {
  if (!node.url) throw new Error('passed node has no url')
  const { setTreeKey, nodeFilterSetActiveTable } = mobxStore

  // TODO: always set showFilter false if is true
  if (nodeFilter) {
    const show = !!nodeFilter[treeName].activeTable
    if (show) {
      nodeFilterSetActiveTable({ treeName: treeName, activeTable: null })
    }
  }

  const newActiveNodeArray = [...node.url]
  const nodeIsOpen = isNodeOpen(openNodes, node.url)
  if (nodeIsOpen && isNodeInActiveNodePath(node, activeNodeArray)) {
    // need to check if node is last in activeNodePath
    if (node.url.length === activeNodeArray.length) {
      /**
       * dont do anything:
       * klicked node should always be / remain active
       */
      // newActiveNodeArray.pop()
    } else {
      // leave newActiveNodeArray as it is
    }
  } else if (!nodeIsOpen) {
    openNode({ treeName, node, openNodes, mobxStore })
  }

  setTreeKey({
    value: newActiveNodeArray,
    tree: treeName,
    key: 'activeNodeArray',
  })
}
