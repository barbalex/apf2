const tpopmassnberFolderNode = ({
  count,
  loading,
  projId,
  apId,
  popId,
  tpopId,
  store,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopmassnber ?? ''

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
    'Massnahmen-Berichte',
  ]

  const node = {
    nodeType: 'folder',
    menuType: 'tpopmassnberFolder',
    filterTable: 'tpopmassnber',
    id: `${tpopId}TpopmassnberFolder`,
    tableId: tpopId,
    urlLabel: 'Massnahmen-Berichte',
    label: `Massnahmen-Berichte (${message})`,
    url,
    hasChildren: count > 0,
  }

  return node
}

export default tpopmassnberFolderNode
