// @flow
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'

import isNodeOpen from './isNodeOpen'

export default ({
  treeName,
  node,
  openNodes,
  mobxStore,
}: {
  treeName: string,
  node: Object,
  openNodes: Array<Array<string>>,
  mobxStore: Object,
}): any => {
  if (!node.url) throw new Error('passed node has no url')
  const { setTreeKey } = mobxStore

  let newOpenNodes = [...openNodes]
  if (isNodeOpen(openNodes, node.url)) {
    newOpenNodes = newOpenNodes.filter(n => !isEqual(n, node.url))
  } else {
    newOpenNodes.push(node.url)
  }
  setTreeKey({
    value: newOpenNodes,
    tree: treeName,
    key: 'openNodes',
  })
}
