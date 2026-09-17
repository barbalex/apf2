import { isEqual } from 'es-toolkit'

import type { TreeMenu } from './types.ts'

export const checkIfIsOpen = ({
  menu,
  openNodes,
}: {
  menu: TreeMenu
  openNodes: (string | number)[][]
}) => {
  // menus rendered as tree nodes always provide treeUrl
  const treeUrl = menu.treeUrl as (string | number)[]

  const isOpen =
    menu.alwaysOpen ??
    openNodes?.some((n) => isEqual(n.slice(0, treeUrl.length), treeUrl)) ??
    false

  return isOpen
}
