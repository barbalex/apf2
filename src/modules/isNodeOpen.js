// @flow
import isEqual from 'lodash/isEqual'

export default (
  openNodes: Array<Array<string | number>>,
  url: Array<string | number>
) => {
  if (!url) return false
  if (!openNodes) return false

  const sameNodeInOpenNodes = openNodes.find(n => isEqual(n, url))
  return !!sameNodeInOpenNodes
}
