// @flow
import isEqual from 'lodash/isEqual'

export default (openNodes: Array<Object>, url: Object) => {
  if (!url) return false
  if (!openNodes) return false

  const sameNodeInOpenNodes = openNodes.find(n => isEqual(n, url))
  return !!sameNodeInOpenNodes
}
