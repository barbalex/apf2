// @flow
import { toJS } from 'mobx'
import isEqual from 'lodash/isEqual'

import isNodeOpen from '../../modules/isNodeOpen'

export default (store: Object, tree: Object, node: Object) => {
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!node) return store.listError(new Error('no node passed'))
  if (!node.url) return store.listError(new Error('node has no url'))

  if (isNodeOpen(toJS(tree.openNodes), node.url)) {
    tree.openNodes = toJS(tree.openNodes).filter(n => !isEqual(n, node.url))
  } else {
    tree.openNodes.push(node.url)
  }
}
