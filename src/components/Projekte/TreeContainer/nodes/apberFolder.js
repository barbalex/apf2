import findIndex from 'lodash/findIndex'

const apberFolderNode = ({
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
  //console.log('apberFolderNode')
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = store?.[treeName]?.nodeLabelFilter?.apber ?? ''

  const apberNodesLength = data.filter((el) => el.apId === apId).length

  /*
  let message = loading && !apberNodesLength ? '...' : apberNodesLength
  if (nodeLabelFilterString) {
    message = `${apberNodesLength} gefiltert`
  }*/
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${apberNodesLength} gefiltert`
    : apberNodesLength

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
      hasChildren: apberNodesLength > 0,
    },
  ]
}

export default apberFolderNode
