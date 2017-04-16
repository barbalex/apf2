// @flow
import isEqual from 'lodash/isEqual'

export default (node: Object, openNodes: Array<string | number>) => {
  if (!node) return false
  if (!node.url) return false
  if (!openNodes) return false
  const sameNodeInOpenNodes = openNodes.find(n => isEqual(n, node.url))
  return !!sameNodeInOpenNodes
}
