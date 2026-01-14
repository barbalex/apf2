import { isEqual } from 'es-toolkit'

export const checkIfIsOpen = ({ store, menu }) => {
  const isOpen =
    menu.alwaysOpen ??
    store.tree.openNodes.some((n) =>
      isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
    )

  return isOpen
}
