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
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.beob`) || ''

  const beobNichtZuzuordnenNodesLength = memoizeOne(
    () =>
      get(data, 'allVApbeobs.nodes', []).filter(el => el.apId === apId).length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${beobNichtZuzuordnenNodesLength} gefiltert`
    : beobNichtZuzuordnenNodesLength

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'nicht-zuzuordnende-Beobachtungen',
  ]

  // only show if parent node exists
  const apNodesIds = nodesPassed.map(n => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'beobNichtZuzuordnenFolder',
      filterTable: 'beob',
      id: `${apId}BeobNichtZuzuordnenFolder`,
      tableId: apId,
      urlLabel: 'nicht-zuzuordnende-Beobachtungen',
      label: `Beobachtungen nicht zuzuordnen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 11],
      hasChildren: beobNichtZuzuordnenNodesLength > 0,
    },
  ]
}
