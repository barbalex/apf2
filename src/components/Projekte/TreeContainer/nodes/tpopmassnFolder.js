import findIndex from 'lodash/findIndex'

const tpopmassnFolderNode = ({
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
    store?.[treeName]?.nodeLabelFilter?.tpopmassn ?? ''

  let children = (data?.allTpopmassns?.nodes ?? []).filter(
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
    'Massnahmen',
  ]

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(tpopId)) return []

  const nodes = [
    {
      nodeType: 'folder',
      menuType: 'tpopmassnFolder',
      filterTable: 'tpopmassn',
      id: `${tpopId}TpopmassnFolder`,
      tableId: tpopId,
      urlLabel: 'Massnahmen',
      label: `Massnahmen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1],
      hasChildren: childrenLength > 0,
    },
  ]
  return nodes
}

export default tpopmassnFolderNode
