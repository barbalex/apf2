import findIndex from 'lodash/findIndex'

const ekfrequenzFolderNode = ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  store,
}) => {
  const ekfrequenzs = data?.allEkfrequenzs?.nodes ?? []

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    store?.[treeName]?.nodeLabelFilter?.ekfrequenz ?? ''

  const ekfrequenzNodesLength = ekfrequenzs.filter(
    (el) => el.apId === apId,
  ).length
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${ekfrequenzNodesLength} gefiltert`
    : ekfrequenzNodesLength

  const url = ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map((n) => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'ekfrequenzFolder',
      filterTable: 'ekfrequenz',
      id: `${apId}Ekfrequenz`,
      tableId: apId,
      urlLabel: 'EK-Frequenzen',
      label: `EK-Frequenzen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 9],
      hasChildren: ekfrequenzNodesLength > 0,
    },
  ]
}

export default ekfrequenzFolderNode
