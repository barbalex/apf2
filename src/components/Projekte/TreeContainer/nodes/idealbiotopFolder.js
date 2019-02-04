// @flow
import findIndex from 'lodash/findIndex'

export default ({
  nodes: nodesPassed,
  projektNodes,
  projId,
  apNodes,
  apId,
}: {
  nodes: Array<Object>,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Idealbiotop']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map(n => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'idealbiotopFolder',
      id: apId,
      urlLabel: 'Idealbiotop',
      label: 'Idealbiotop',
      url,
      sort: [projIndex, 1, apIndex, 6],
      hasChildren: false,
    },
  ]
}
