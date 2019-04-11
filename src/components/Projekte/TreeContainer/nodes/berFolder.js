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
    get(store, `${treeName}.nodeLabelFilter.ber`) || ''

  const berNodesLength = memoizeOne(
    () => get(data, 'allBers.nodes', []).filter(el => el.apId === apId).length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${berNodesLength} gefiltert`
    : berNodesLength

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Berichte']

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'berFolder',
      filterTable: 'ber',
      id: `${apId}Ber`,
      tableId: apId,
      urlLabel: 'Berichte',
      label: `Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 5],
      hasChildren: berNodesLength > 0,
    },
  ]
}
