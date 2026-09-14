import { isEqual } from 'es-toolkit'

export const menuIsInActiveNodePath = ({
  menuUrl,
  activeNodeArray,
}: {
  menuUrl: (string | number)[]
  activeNodeArray?: (string | number)[] | undefined
}) => {
  if (!menuUrl) return false
  if (!activeNodeArray) return false
  const activeNodeArrayPartWithEqualLength = activeNodeArray.slice(
    0,
    menuUrl.length,
  )
  return isEqual(activeNodeArrayPartWithEqualLength, menuUrl)
}
