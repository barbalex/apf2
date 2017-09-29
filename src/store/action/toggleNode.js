// @flow
import clone from 'lodash/clone'
import { toJS } from 'mobx'

import isNodeOpen from '../../modules/isNodeOpen'
import isNodeInActiveNodePath from '../../modules/isNodeInActiveNodePath'
import openNode from './openNode'

export default (store: Object, tree: Object, node: Object): any => {
  if (!node.url) {
    return store.listError(new Error('passed node has no url'))
  }

  const newActiveNodeArray = clone(node.url)
  const nodeIsOpen = isNodeOpen(toJS(tree.openNodes), node.url)
  if (nodeIsOpen && isNodeInActiveNodePath(node, tree.activeNodeArray)) {
    // need to check if node is last in activeNodePath
    if (node.url.length === tree.activeNodeArray.length) {
      /**
       * dont do anything:
       * klicked node should always be / remain active
       */
      // newActiveNodeArray.pop()
    } else {
      // leave newActiveNodeArray as it is
    }
  } else if (!nodeIsOpen) {
    openNode({tree, node})
  }
  tree.setLastClickedNode(node.url)
  tree.setActiveNodeArray(newActiveNodeArray)
}
