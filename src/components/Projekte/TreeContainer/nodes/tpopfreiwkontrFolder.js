const tpopfreiwkontrFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  popId,
  tpopId,
  store,
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

  return {
    nodeType: 'folder',
    menuType: 'tpopfreiwkontrFolder',
    filterTable: 'tpopkontr',
    id: `${tpopId}TpopfreiwkontrFolder`,
    tableId: tpopId,
    urlLabel: 'Freiwilligen-Kontrollen',
    label: `Freiwilligen-Kontrollen (${message})`,
    url,
    hasChildren: count > 0,
  }
}

export default tpopfreiwkontrFolderNode
