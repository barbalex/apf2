import findIndex from 'lodash/findIndex'

const assozartFolderNode = ({
  nodes: nodesPassed,
  data,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.assozart ?? ''

  const assozartNodesLength = (data?.allAssozarts?.nodes ?? []).filter(
    (el) => el.apId === apId,
  ).length
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${assozartNodesLength} gefiltert`
    : assozartNodesLength

  const url = ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map((n) => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'assozartFolder',
      filterTable: 'assozart',
      id: `${apId}AssozartFolder`,
      tableId: apId,
      urlLabel: 'assoziierte-Arten',
      label: `assoziierte Arten (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 8],
      hasChildren: assozartNodesLength > 0,
    },
  ]
}

export default assozartFolderNode
