import findIndex from 'lodash/findIndex'

const tpopFolderNode = ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  apNodes,
  popNodes,
  projId,
  apId,
  popId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const nodeLabelFilterString = store?.[treeName]?.nodeLabelFilter?.tpop ?? ''

  const children = (data?.allTpops?.nodes ?? []).filter(
    (el) => el.popId === popId,
  )

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${children.length} gefiltert`
    : children.length

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'Populationen',
    popId,
    'Teil-Populationen',
  ]

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(popId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopFolder',
      filterTable: 'tpop',
      id: `${popId}TpopFolder`,
      tableId: popId,
      parentTableId: popId,
      urlLabel: 'Teil-Populationen',
      label: `Teil-Populationen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1],
      hasChildren: children.length > 0,
    },
  ]
}

export default tpopFolderNode
