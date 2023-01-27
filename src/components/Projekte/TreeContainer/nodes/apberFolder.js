import findIndex from 'lodash/findIndex'

const apberFolderNode = ({
  nodes: nodesPassed,
  data,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  store,
}) => {
  //console.log('apberFolderNode')
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.apber ?? ''
  const apbers = (data?.allApbers?.nodes ?? []).filter((n) => n.apId === apId)
  const count = apbers.length

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'AP-Berichte']

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'apberFolder',
      filterTable: 'apber',
      id: `${apId}ApberFolder`,
      tableId: apId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 4],
      hasChildren: count > 0,
    },
  ]
}

export default apberFolderNode
