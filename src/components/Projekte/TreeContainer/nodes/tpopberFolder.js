import findIndex from 'lodash/findIndex'

const tpopberFolderNode = ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const nodeLabelFilterString =
    store?.[treeName]?.nodeLabelFilter?.tpopber ?? ''

  const childrenLength = (data?.allTpopbers?.nodes ?? []).filter(
    (el) => el.tpopId === tpopId,
  ).length

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${childrenLength} gefiltert`
    : childrenLength

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

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(tpopId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopberFolder',
      filterTable: 'tpopber',
      id: `${tpopId}TpopberFolder`,
      tableId: tpopId,
      urlLabel: 'Kontroll-Berichte',
      label: `Kontroll-Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 5],
      hasChildren: childrenLength > 0,
    },
  ]
}

export default tpopberFolderNode
