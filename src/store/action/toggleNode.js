// @flow
import clone from 'lodash/clone'
import union from 'lodash/union'

import isNodeOpen from '../../modules/isNodeOpen'

export default (store: Object, tree: Object, node: Object) => {
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!node) return store.listError(new Error('no node passed'))
  if (!node.url) return store.listError(new Error('node has no url'))

  const newActiveNodeArray = clone(node.url)
  if (isNodeOpen(tree.openNodes, node.url)) {
    // shorten activeNodeArray
    // but don't close node
    newActiveNodeArray.pop()
  } else {
    tree.openNodes = union([...tree.openNodes, node.url])
  }
  tree.setActiveNodeArray(newActiveNodeArray)
}
