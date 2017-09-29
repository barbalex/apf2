// @flow
export default ({ tree, node }: { tree: Object, node: Object }) => {
  tree.openNodes.push(node.url)
  // automatically open zaehlFolder of tpopfeldkontr or tpopfreiwkontr
  if (['tpopfeldkontr', 'tpopfreiwkontr'].includes(node.menuType)) {
    tree.openNodes.push([...node.url, 'Zaehlungen'])
  }
  // automatically open zielberFolder of ziel
  if (node.menuType === 'ziel') {
    tree.openNodes.push([...node.url, 'Berichte'])
  }
}
