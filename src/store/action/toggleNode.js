// @flow
import clone from 'lodash/clone'
import union from 'lodash/union'
import { toJS } from 'mobx'

import isNodeOpen from '../../modules/isNodeOpen'

export default (store: Object, tree: Object, node: Object): any => {
  if (!node.url) return store.listError(new Error('passed node has no url'))

  const newActiveNodeArray = clone(node.url)
  if (isNodeOpen(toJS(tree.openNodes), node.url)) {
    // shorten activeNodeArray
    // but don't close node
    newActiveNodeArray.pop()
  } else {
    tree.openNodes = union([...tree.openNodes, node.url])
  }
  tree.setActiveNodeArray(newActiveNodeArray)
}
