import isNodeOpen from './isNodeOpen'

const openNode = async ({ node, openNodes, store }) => {
  const { treeNodeLabelFilterResetExceptAp } = store
  // make sure this node's url is not yet contained
  // otherwise same nodes will be added multiple times!
  if (isNodeOpen({ openNodes, url: node.data.url })) return

  let newOpenNodes = [...openNodes, node.data.url]
  if (['tpopfeldkontr', 'tpopfreiwkontr'].includes(node.data.menuType)) {
    // automatically open zaehlFolder of tpopfeldkontr or tpopfreiwkontr
    newOpenNodes.push([...node.data.url, 'Zaehlungen'])
  }
  if (node.data.menuType === 'ziel') {
    // automatically open zielberFolder of ziel
    newOpenNodes.push([...node.data.url, 'Berichte'])
  }

  store.tree.setOpenNodes(newOpenNodes)

  if (node.data.menuType === 'ap') {
    // if ap is changed, need to empty nodeLabelFilter,
    // with exception of the ap key
    treeNodeLabelFilterResetExceptAp()
  }
}

export default openNode
