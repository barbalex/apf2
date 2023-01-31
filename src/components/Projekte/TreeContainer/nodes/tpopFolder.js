const tpopFolderNode = async ({ count, loading, projId, apId, popId, store }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpop ?? ''

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
  ]

  return {
      nodeType: 'folder',
      menuType: 'tpopFolder',
      filterTable: 'tpop',
      id: `${popId}TpopFolder`,
      tableId: popId,
      parentTableId: popId,
      urlLabel: 'Teil-Populationen',
      label: `Teil-Populationen (${message})`,
      url,
      hasChildren: count > 0,
    }
}

export default tpopFolderNode
