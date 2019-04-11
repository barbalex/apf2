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
  nodeFilter,
  store,
}) => {
  const pops = get(data, 'allPops.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.pop`) || ''

  const popNodesLength = memoizeOne(
    () => pops.filter(el => el.apId === apId).length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${popNodesLength} gefiltert`
    : popNodesLength

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Populationen']

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(apId)) return []

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
