import isEqual from 'lodash/isEqual'

export const isNodeOpen = ({ openNodes, url }) => {
  if (!url) return false
  if (!openNodes) return false

  return openNodes.some((n) => isEqual(n, url))
}
