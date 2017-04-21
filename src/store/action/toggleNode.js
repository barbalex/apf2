// @flow
import clone from 'lodash/clone'
import { toJS } from 'mobx'

import isNodeOpen from '../../modules/isNodeOpen'
import isNodeInActiveNodePath from '../../modules/isNodeInActiveNodePath'

export default (store: Object, tree: Object, node: Object): any => {
  if (!node.url) return store.listError(new Error('passed node has no url'))

  const newActiveNodeArray = clone(node.url)
  if (
    isNodeOpen(toJS(tree.openNodes), node.url) &&
    isNodeInActiveNodePath(node, tree.activeNodeArray)
  ) {
    // shorten activeNodeArray
    // but don't close node
    newActiveNodeArray.pop()
  } else {
    if (!isNodeOpen(toJS(tree.openNodes), node.url)) {
      tree.openNodes.push(node.url)
    }
  }
  tree.setLastClickedNode(node.url)
  tree.setActiveNodeArray(newActiveNodeArray)
}
