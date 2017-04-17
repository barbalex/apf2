// @flow
import isEqual from 'lodash/isEqual'

export default (tree: Object, url: Object) => {
  if (!url) return false
  if (!tree) return false

  const sameNodeInOpenNodes = tree.openNodes.find(n => isEqual(n, url))
  return !!sameNodeInOpenNodes
}
