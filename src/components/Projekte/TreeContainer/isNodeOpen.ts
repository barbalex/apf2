import { isEqual } from 'es-toolkit'

export const isNodeOpen = ({
  openNodes,
  url,
}: {
  openNodes?: (string | number)[][] | null | undefined
  url?: (string | number)[] | null | undefined
}) => {
  if (!url) return false
  if (!openNodes) return false

  return openNodes.some((n) => isEqual(n, url))
}
