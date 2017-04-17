// @flow
import clone from 'lodash/clone'

import isNodeOpen from '../../modules/isNodeOpen'

export default (store: Object, tree: Object, node: Object) => {
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!node) return store.listError(new Error('no node passed'))
  if (!node.url) return store.listError(new Error('node has no url'))

  const newActiveNodeArray = clone(node.url)
  if (isNodeOpen(tree, node.url)) {
    // shorten activeNodeArray
    newActiveNodeArray.pop()
    // but don't close node
  } else {
    tree.openNodes.push(node.url)
  }
  tree.setActiveNodeArray(newActiveNodeArray)
}
