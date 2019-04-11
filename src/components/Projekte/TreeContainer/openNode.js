// @flow
import isNodeOpen from './isNodeOpen'

export default async ({
  treeName,
  node,
  openNodes,
  store,
}: {
  treeName: string,
  node: Object,
  openNodes: Array<Array<string>>,
  store: Object,
}) => {
  const { treeNodeLabelFilterResetExceptAp } = store
  // make sure this node's url is not yet contained
  // otherwise same nodes will be added multiple times!
  if (isNodeOpen(openNodes, node.url)) return

  let newOpenNodes = [...openNodes, node.url]
  if (['tpopfeldkontr'].includes(node.menuType)) {
    // automatically open zaehlFolder of tpopfeldkontr or tpopfreiwkontr
    newOpenNodes.push([...node.url, 'Zaehlungen'])
  }
  if (node.menuType === 'ziel') {
    // automatically open zielberFolder of ziel
    newOpenNodes.push([...node.url, 'Berichte'])
  }

  store[treeName].setOpenNodes(newOpenNodes)

  if (node.menuType === 'ap') {
    // if ap is changed, need to empty nodeLabelFilter,
    // with exception of the ap key
    treeNodeLabelFilterResetExceptAp({ tree: treeName })
  }
}
