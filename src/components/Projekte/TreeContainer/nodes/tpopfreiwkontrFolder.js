import findIndex from 'lodash/findIndex'

const tpopfreiwkontrFolderNode = ({
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
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopkontr ?? ''

  let children = (data?.allTpopfreiwkontrs?.nodes ?? []).filter(
    (el) => el.tpopId === tpopId,
  )

  const childrenLength = children.length
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
    'Freiwilligen-Kontrollen',
  ]

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(tpopId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopfreiwkontrFolder',
      filterTable: 'tpopkontr',
      id: `${tpopId}TpopfreiwkontrFolder`,
      tableId: tpopId,
      urlLabel: 'Freiwilligen-Kontrollen',
      label: `Freiwilligen-Kontrollen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 4],
      hasChildren: childrenLength > 0,
    },
  ]
}

export default tpopfreiwkontrFolderNode
