// @flow
import isEqual from 'lodash/isEqual'

import isNodeOpen from './isNodeOpen'

export default ({
  tree,
  node,
  mobxStore,
}: {
  tree: Object,
  node: Object,
  mobxStore: Object,
}): any => {
  if (!node.url) throw new Error('passed node has no url')
  const { setTreeKey } = mobxStore

  let newOpenNodes = [...tree.openNodes]
  if (isNodeOpen(tree.openNodes, node.url)) {
    newOpenNodes = newOpenNodes.filter(n => !isEqual(n, node.url))
  } else {
    newOpenNodes.push(node.url)
  }
  setTreeKey({
    value: newOpenNodes,
    tree: tree.name,
    key: 'openNodes',
  })
}
