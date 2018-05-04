// @flow
import isEqual from 'lodash/isEqual'

export default (
  openNodes: Array<Array<String>>,
  url: Array<String>
): boolean => {
  if (!url) return false
  if (!openNodes) return false

  const sameNodeInOpenNodes = openNodes.find(n => isEqual(n, url))
  return !!sameNodeInOpenNodes
}
