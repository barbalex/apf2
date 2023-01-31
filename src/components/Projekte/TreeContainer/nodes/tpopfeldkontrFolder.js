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
  }
}

export default tpopfeldkontrFolderNode
