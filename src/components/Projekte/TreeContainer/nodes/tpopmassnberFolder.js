import findIndex from 'lodash/findIndex'

const tpopmassnberFolderNode = ({
  nodes: nodesPassed,
  data,
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
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopmassnber ?? ''

  const childrenLength = (data?.allTpopmassnbers?.nodes ?? []).filter(
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
    'Massnahmen-Berichte',
  ]

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(tpopId)) return []

  const nodes = [
    {
      nodeType: 'folder',
      menuType: 'tpopmassnberFolder',
      filterTable: 'tpopmassnber',
      id: `${tpopId}TpopmassnberFolder`,
      tableId: tpopId,
      urlLabel: 'Massnahmen-Berichte',
      label: `Massnahmen-Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 2],
      hasChildren: childrenLength > 0,
    },
  ]
  return nodes
}

export default tpopmassnberFolderNode
