import findIndex from 'lodash/findIndex'

export default ({
  nodes: nodesPassed,
  projektNodes,
  projId,
  apNodes,
  apId,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Qualitaetskontrollen']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map(n => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'qkFolder',
      id: apId,
      tableId: apId,
      parentTableId: apId,
      urlLabel: 'Qualitaetskontrollen',
      label: 'Qualitätskontrollen',
      url,
      sort: [projIndex, 1, apIndex, 13],
      hasChildren: false,
    },
  ]
}
