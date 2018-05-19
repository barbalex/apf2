// @flow
import { toJS } from 'mobx'
import isNodeOpen from './isNodeOpen'

export default ({ tree, node }: { tree: Object, node: Object }) => {
  // make sure this node's url is not yet contained
  // otherwise same nodes will be added multiple times!
  if (isNodeOpen(toJS(tree.openNodes), toJS(node.url))) return
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
