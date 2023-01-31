import tpopfeldkontr from './tpopfeldkontr'

const tpopfeldkontrFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopkontr ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = [
    'Projekte',
    projId,
    'Arten',
    apId,
    'Populationen',
    popId,
    'Teil-Populationen',
    tpopId,
    'Feld-Kontrollen',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'Populationen' &&
        n[5] === popId &&
        n[6] === 'Teil-Populationen' &&
        n[7] === tpopId &&
        n[8] === 'Feld-Kontrollen',
    ).length > 0

  const children = isOpen
    ? await tpopfeldkontr({
        treeQueryVariables,
        projId,
        apId,
        popId,
        tpopId,
        store,
      })
    : []

  return {
    nodeType: 'folder',
    menuType: 'tpopfeldkontrFolder',
    filterTable: 'tpopkontr',
    id: `${tpopId}TpopfeldkontrFolder`,
    tableId: tpopId,
    urlLabel: 'Feld-Kontrollen',
    label: `Feld-Kontrollen (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default tpopfeldkontrFolderNode
