// @flow
import remove from 'lodash/remove'
import isEqual from 'lodash/isEqual'

import nodeIsOpen from '../../modules/nodeIsOpen'

export default (store: Object, tree: Object, node: Object) => {
  console.log('toggling node symbol')
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!node) return store.listError(new Error('no node passed'))
  if (!node.url) return store.listError(new Error('node has no url'))

  if (nodeIsOpen(tree, node.url)) {
    tree.openNodes.push(node.url)
  } else {
    remove(tree.openNodes, n => isEqual(n, node.url))
  }
}
