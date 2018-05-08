// @flow
import {
  toJS
} from 'mobx'
import isEqual from 'lodash/isEqual'

import isNodeOpen from '../../modules/isNodeOpen'
import openNode from './openNode'

const openLowerNodes = ({
  tree,
  node,
  nodes
}: {
  tree: Object,
  node: Object,
  nodes: Array < Object >
}) => {
  const lowerNodes = nodes.filter(n => {
    const levelNeeded = n.url.length === node.url.length + 1
    if (!levelNeeded) return false
    const activeNodeArrayPartWithEqualLength = n.url.slice(0, node.url.length)
    return isEqual(activeNodeArrayPartWithEqualLength, node.url)
  })
  lowerNodes.forEach(n => openNode({
    tree,
    node: n
  }))
}

export default ({
  tree,
  node
}: {
  tree: Object,
  node: Object
}) => {
  // if node is not open, toggle it
  if (!isNodeOpen(toJS(tree.openNodes), node.url)) {
    openNode({
      tree,
      node
    })
    // wait a while for node to load
    setTimeout(() => openLowerNodes({
      tree,
      node
    }), 1000)
  } else {
    openLowerNodes({
      tree,
      node
    })
  }
}