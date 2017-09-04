// @flow
import clone from 'lodash/clone'
import { toJS } from 'mobx'

import isNodeOpen from '../../modules/isNodeOpen'
import isNodeInActiveNodePath from '../../modules/isNodeInActiveNodePath'

export default (store: Object, tree: Object, node: Object): any => {
  if (!node.url) {
    return store.listError(new Error('passed node has no url'))
  }

  const newActiveNodeArray = clone(node.url)
  const nodeIsOpen = isNodeOpen(toJS(tree.openNodes), node.url)
  if (nodeIsOpen && isNodeInActiveNodePath(node, tree.activeNodeArray)) {
    // need to check if node is last in activeNodePath
    if (node.url.length === tree.activeNodeArray.length) {
      // shorten activeNodeArray
      // but don't close node
      newActiveNodeArray.pop()
    } else {
      // leave newActiveNodeArray as it is
    }
  } else if (!nodeIsOpen) {
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
  tree.setLastClickedNode(node.url)
  tree.setActiveNodeArray(newActiveNodeArray)
}
