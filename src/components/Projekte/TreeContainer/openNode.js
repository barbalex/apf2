import isNodeOpen from './isNodeOpen'

const openNode = async ({ node, openNodes, store }) => {
  const { treeNodeLabelFilterResetExceptAp } = store
  // make sure this node's url is not yet contained
  // otherwise same nodes will be added multiple times!
  if (isNodeOpen({ openNodes, url: node.url })) return

  let newOpenNodes = [...openNodes, node.url]
  if (['tpopfeldkontr', 'tpopfreiwkontr'].includes(node.menuType)) {
    // automatically open zaehlFolder of tpopfeldkontr or tpopfreiwkontr
    newOpenNodes.push([...node.url, 'Zaehlungen'])
  }
  if (node.menuType === 'ziel') {
    // automatically open zielberFolder of ziel
    newOpenNodes.push([...node.url, 'Berichte'])
  }

  store.tree.setOpenNodes(newOpenNodes)

  if (node.menuType === 'ap') {
    // if ap is changed, need to empty nodeLabelFilter,
    // with exception of the ap key
    treeNodeLabelFilterResetExceptAp()
  }
}

export default openNode
