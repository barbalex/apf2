// @flow
import isNodeOpen from './isNodeOpen'

export default async ({
  treeName,
  node,
  openNodes,
  mobxStore,
}: {
  treeName: string,
  node: Object,
  openNodes: Array<Array<string>>,
  mobxStore: Object,
}) => {
  const { setTreeKey, treeNodeLabelFilterResetExceptAp } = mobxStore
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

  setTreeKey({
    value: newOpenNodes,
    tree: treeName,
    key: 'openNodes',
  })

  if (node.menuType === 'ap') {
    // if ap is changed, need to empty nodeLabelFilter,
    // with exception of the ap key
    treeNodeLabelFilterResetExceptAp({ tree: treeName })
  }
}
