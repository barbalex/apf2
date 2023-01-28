import isEqual from 'lodash/isEqual'

const isNodeInActiveNodePath = ({ node, activeNodeArray }) => {
  if (!node) return false
  if (!node.data.url) return false
  if (!activeNodeArray) return false
  const activeNodeArrayPartWithEqualLength = activeNodeArray.slice(
    0,
    node.data.url.length,
  )
  return isEqual(activeNodeArrayPartWithEqualLength, node.data.url)
}

export default isNodeInActiveNodePath
