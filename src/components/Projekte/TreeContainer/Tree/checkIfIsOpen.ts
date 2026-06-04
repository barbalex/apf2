import { isEqual } from 'es-toolkit'

export const checkIfIsOpen = ({ menu, openNodes }) => {
  const isOpen =
    menu.alwaysOpen ??
    openNodes?.some((n) =>
      isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
    ) ??
    false

  return isOpen
}
