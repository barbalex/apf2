import tpopfreiwkontr from './tpopfreiwkontr'

const tpopfreiwkontrFolderNode = async ({
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
    'Freiwilligen-Kontrollen',
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
        n[8] === 'Freiwilligen-Kontrollen',
    ).length > 0

  const children = isOpen
    ? await tpopfreiwkontr({
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
    menuType: 'tpopfreiwkontrFolder',
    id: `${tpopId}TpopfreiwkontrFolder`,
    tableId: tpopId,
    urlLabel: 'Freiwilligen-Kontrollen',
    label: `Freiwilligen-Kontrollen (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default tpopfreiwkontrFolderNode
