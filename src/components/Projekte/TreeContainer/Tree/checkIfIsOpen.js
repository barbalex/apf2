import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

export const checkIfIsOpen = ({ store, menu }) => {
  const isOpen =
    menu.alwaysOpen ??
    store.tree.openNodes.some((n) =>
      isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
    )
  console.log('checkIfIsOpen', {
    isOpen,
    openNodes: getSnapshot(store.tree.openNodes),
    menu,
    treeUrl: menu.treeUrl,
  })

  return isOpen
}
