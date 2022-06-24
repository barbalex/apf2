import findIndex from 'lodash/findIndex'

const idealbiotopFolderNode = ({
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

  const url = ['Projekte', projId, 'Arten', apId, 'Idealbiotop']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map((n) => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'idealbiotopFolder',
      id: apId,
      tableId: apId,
      urlLabel: 'Idealbiotop',
      label: 'Idealbiotop',
      url,
      sort: [projIndex, 1, apIndex, 6],
      hasChildren: false,
    },
  ]
}

export default idealbiotopFolderNode
