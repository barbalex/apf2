import { isEqual } from 'es-toolkit'
import {
  store as jotaiStore,
  treeOpenNodesAtom,
} from '../../../../JotaiStore/index.ts'

export const checkIfIsOpen = ({ menu }) => {
  const openNodes = jotaiStore.get(treeOpenNodesAtom)
  const isOpen =
    menu.alwaysOpen ??
    openNodes.some((n) =>
      isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
    )

  return isOpen
}
