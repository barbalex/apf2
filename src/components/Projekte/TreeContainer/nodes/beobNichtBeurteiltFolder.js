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
    get(store, `${treeName}.nodeLabelFilter.beob`) || ''

  const beobNichtBeurteiltNodesLength = memoizeOne(
    () =>
      get(data, 'allVApbeobsNichtBeurteilt.nodes', []).filter(
        el => el.apId === apId,
      ).length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${beobNichtBeurteiltNodesLength} gefiltert`
    : beobNichtBeurteiltNodesLength

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'nicht-beurteilte-Beobachtungen',
  ]

  // only show if parent node exists
  const apNodesIds = nodesPassed.map(n => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'beobNichtBeurteiltFolder',
      filterTable: 'beob',
      id: `${apId}BeobNichtBeurteiltFolder`,
      tableId: apId,
      urlLabel: 'nicht-beurteilte-Beobachtungen',
      label: `Beobachtungen nicht beurteilt (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 11],
      hasChildren: beobNichtBeurteiltNodesLength > 0,
    },
  ]
}
