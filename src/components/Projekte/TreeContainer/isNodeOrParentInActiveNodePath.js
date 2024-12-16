import isEqual from 'lodash/isEqual'

import { isNodeInActiveNodePath } from './isNodeInActiveNodePath.js'

export const isNodeOrParentInActiveNodePath = ({ node, activeNodeArray }) => {
  if (!node) return false
  if (!node.url) return false
  if (!activeNodeArray) return false

  const selfIsInActiveNodePath = isNodeInActiveNodePath({
    node,
    activeNodeArray,
  })

  // return true on top level but only return own top level node
  if (activeNodeArray.length === 1 && node.urlLabel === activeNodeArray[0])
    return true

  if (selfIsInActiveNodePath) return true

  if (node.url.length <= activeNodeArray.length) return false

  return isEqual(node.url.slice(0, activeNodeArray.length), activeNodeArray)
}
