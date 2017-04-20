// @flow
import isEqual from 'lodash/isEqual'

export default (node: Object, activeNodeArray: Array<string>): boolean => {
  if (!node) return false
  if (!node.url) return false
  if (!activeNodeArray) return false
  const activeNodeArrayPartWithEqualLength = activeNodeArray.slice(
    0,
    node.url.length
  )
  return isEqual(activeNodeArrayPartWithEqualLength, node.url)
}
