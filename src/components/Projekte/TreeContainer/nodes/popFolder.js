import findIndex from 'lodash/findIndex'

const popFolderNode = ({
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
  const pops = data?.allPops?.nodes ?? []

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = store?.[treeName]?.nodeLabelFilter?.pop ?? ''

  const popNodesLength = pops.filter((el) => el.apId === apId).length
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${popNodesLength} gefiltert`
    : popNodesLength

  const url = ['Projekte', projId, 'Arten', apId, 'Populationen']

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'popFolder',
      filterTable: 'pop',
      id: `${apId}PopFolder`,
      tableId: apId,
      urlLabel: 'Populationen',
      label: `Populationen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1],
      hasChildren: popNodesLength > 0,
    },
  ]
}

export default popFolderNode
