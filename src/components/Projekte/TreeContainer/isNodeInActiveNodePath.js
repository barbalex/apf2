import isEqual from 'lodash/isEqual'

export default (node, activeNodeArray) => {
  if (!node) return false
  if (!node.url) return false
  if (!activeNodeArray) return false
  const activeNodeArrayPartWithEqualLength = activeNodeArray.slice(
    0,
    node.url.length,
  )
  return isEqual(activeNodeArrayPartWithEqualLength, node.url)
}
