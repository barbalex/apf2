// @flow
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
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
  store: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.assozart`) || ''

  const assozartNodesLength = memoizeOne(
    () =>
      get(data, 'allAssozarts.nodes', []).filter(el => el.apId === apId).length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${assozartNodesLength} gefiltert`
    : assozartNodesLength

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'assoziierte-Arten']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map(n => n.id)
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
