// @flow
import clone from 'lodash/clone'

import nodeIsOpen from '../../modules/nodeIsOpen'

export default (store: Object, tree: Object, node: Object) => {
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!node) return store.listError(new Error('no node passed'))
  if (!node.url) return store.listError(new Error('node has no url'))

  const isNodeOpen = nodeIsOpen(tree, node.url)

  const newActiveNodeArray = clone(node.url)
  if (isNodeOpen) {
    newActiveNodeArray.pop()
  } else {
    tree.openNodes.push(node.url)
  }
  tree.setActiveNodeArray(newActiveNodeArray)
}
