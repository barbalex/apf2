import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
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
  const ekfrequenzs = get(data, 'allEkfrequenzs.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.ekfrequenz`) || ''

  const ekfrequenzNodesLength = memoizeOne(
    () => ekfrequenzs.filter(el => el.apId === apId).length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${ekfrequenzNodesLength} gefiltert`
    : ekfrequenzNodesLength

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'EK-Frequenzen']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map(n => n.id)
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
