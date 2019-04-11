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
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.erfkrit`) || ''

  const erfkritNodesLength = memoizeOne(
    () =>
      get(data, 'allErfkrits.nodes', []).filter(el => el.apId === apId).length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${erfkritNodesLength} gefiltert`
    : erfkritNodesLength

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'AP-Erfolgskriterien']

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'erfkritFolder',
      filterTable: 'erfkrit',
      id: `${apId}Erfkrit`,
      tableId: apId,
      urlLabel: 'AP-Erfolgskriterien',
      label: `AP-Erfolgskriterien (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 3],
      hasChildren: erfkritNodesLength > 0,
    },
  ]
}
