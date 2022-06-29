import findIndex from 'lodash/findIndex'

const apartFolderNode = ({
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
  // return empty if ap is not a real ap and apFilter is set
  const ap = (data?.allAps?.nodes ?? []).find((n) => n.id === apId)
  const isAp = ap && [1, 2, 3].includes(ap.bearbeitung) //@485
  const apFilter = store?.[treeName]?.apFilter
  if (!!apFilter && !isAp) return []

  const aparts = data?.allAparts?.nodes ?? []

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = store?.[treeName]?.nodeLabelFilter?.apart ?? ''

  const apartNodesLength = aparts.filter((el) => el.apId === apId).length
  /*let message = loading && !apartNodesLength ? '...' : apartNodesLength
  if (nodeLabelFilterString) {
    message = `${apartNodesLength} gefiltert`
  }*/
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${apartNodesLength} gefiltert`
    : apartNodesLength

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
      hasChildren: apartNodesLength > 0,
    },
  ]
}

export default apartFolderNode
