import tpopber from './tpopber'

const tpopberFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopber ?? ''

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
    'Kontroll-Berichte',
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
        n[8] === 'Kontroll-Berichte',
    ).length > 0

  const children = isOpen
    ? await tpopber({
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
    menuType: 'tpopberFolder',
    id: `${tpopId}TpopberFolder`,
    tableId: tpopId,
    urlLabel: 'Kontroll-Berichte',
    label: `Kontroll-Berichte (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default tpopberFolderNode
