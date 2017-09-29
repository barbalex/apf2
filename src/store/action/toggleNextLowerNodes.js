// @flow
import { toJS } from 'mobx'
import isEqual from 'lodash/isEqual'

import isNodeOpen from '../../modules/isNodeOpen'
import openNode from './openNode'

const openLowerNodes = ({ tree, node }: { tree: Object, node: Object }) => {
  const nodes = tree.openNodes.filter(n => {
    const isSameLevel = n.length === node.url.length + 1
    if (!isSameLevel) return false
    const activeNodeArrayPartWithEqualLength = n.slice(0, node.url.length)
    return isEqual(activeNodeArrayPartWithEqualLength, node.url)
  })
  nodes.forEach(n => openNode({ tree, node: n }))
}

export default ({ tree, node }: { tree: Object, node: Object }) => {
  // if node is not open, toggle it
  if (!isNodeOpen(toJS(tree.openNodes), node.url)) {
    openNode({ tree, node })
    // wait a while for
    setTimeout(() => openLowerNodes({ tree, node }), 1000)
  } else {
    openLowerNodes({ tree, node })
  }
}
