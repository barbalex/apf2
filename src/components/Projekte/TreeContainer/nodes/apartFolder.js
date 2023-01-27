import findIndex from 'lodash/findIndex'

const apartFolderNode = ({
  nodes: nodesPassed,
  data,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  store,
}) => {
  const count = (data?.allAparts?.nodes ?? []).filter(
    (n) => n.apId === apId,
  ).length

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.apart ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  // only show if parent node exists
  const apNodesIds = nodesPassed.map((n) => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'apartFolder',
      filterTable: 'apart',
      id: `${apId}Apart`,
      tableId: apId,
      urlLabel: 'Taxa',
      label: `Taxa (${message})`,
      url: ['Projekte', projId, 'Arten', apId, 'Taxa'],
      sort: [projIndex, 1, apIndex, 7],
      hasChildren: count > 0,
    },
  ]
}

export default apartFolderNode
