import isEqual from 'lodash/isEqual'

export const menuIsInActiveNodePath = ({ menuUrl, activeNodeArray }) => {
  if (!menuUrl) return false
  if (!activeNodeArray) return false
  const activeNodeArrayPartWithEqualLength = activeNodeArray.slice(
    0,
    menuUrl.length,
  )
  return isEqual(activeNodeArrayPartWithEqualLength, menuUrl)
}
