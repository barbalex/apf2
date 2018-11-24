// @flow
import isNodeOpen from './isNodeOpen'
import isNodeInActiveNodePath from './isNodeInActiveNodePath'
import openNode from './openNode'

export default ({
  tree,
  node,
  nodeFilter,
  nodeFilterSetActiveTable,
  mobxStore,
}: {
  tree: Object,
  node: Object,
  nodeFilter: Object,
  nodeFilterSetActiveTable: () => void,
  mobxStore: Object,
}): any => {
  if (!node.url) throw new Error('passed node has no url')
  const { setTreeKey } = mobxStore

  // TODO: always set showFilter false if is true
  if (nodeFilter) {
    const show = !!nodeFilter[tree.name].activeTable
    if (show) {
      nodeFilterSetActiveTable({ treeName: tree.name, activeTable: null })
    }
  }

  const newActiveNodeArray = [...node.url]
  const nodeIsOpen = isNodeOpen(tree.openNodes, node.url)
  if (nodeIsOpen && isNodeInActiveNodePath(node, tree.activeNodeArray)) {
    // need to check if node is last in activeNodePath
    if (node.url.length === tree.activeNodeArray.length) {
      /**
       * dont do anything:
       * klicked node should always be / remain active
       */
      // newActiveNodeArray.pop()
    } else {
      // leave newActiveNodeArray as it is
    }
  } else if (!nodeIsOpen) {
    openNode({ tree, node, mobxStore })
  }

  setTreeKey({
    value: newActiveNodeArray,
    tree: tree.name,
    key: 'activeNodeArray',
  })
}
