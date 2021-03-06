import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

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
  const ap = get(data, 'allAps.nodes', []).find((n) => n.id === apId)
  const isAp = ap && [1, 2, 3].includes(ap.bearbeitung)
  const apFilter = get(store, `${treeName}.apFilter`)
  if (!!apFilter && !isAp) return []

  const aparts = get(data, 'allAparts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.apart`) || ''

  const apartNodesLength = memoizeOne(
    () => aparts.filter((el) => el.apId === apId).length,
  )()
  /*let message = loading && !apartNodesLength ? '...' : apartNodesLength
  if (nodeLabelFilterString) {
    message = `${apartNodesLength} gefiltert`
  }*/
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
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
      urlLabel: 'AP-Arten',
      label: `AP-Arten (${message})`,
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Arten'],
      sort: [projIndex, 1, apIndex, 7],
      hasChildren: apartNodesLength > 0,
    },
  ]
}

export default apartFolderNode
