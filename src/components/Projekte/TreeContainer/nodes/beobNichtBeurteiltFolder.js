// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import format from 'date-fns/format'

export default ({
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
}: {
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
}): Array<Object> => {
  const beobNichtBeurteilts = get(data, 'beobNichtBeurteilts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.beobNichtBeurteilt`)

  const beobNichtBeurteiltNodesLength = beobNichtBeurteilts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${
          el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
        }: ${el.autor || '(kein Autor)'} (${el.quelle})`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = (loading && !beobNichtBeurteiltNodesLength) ? '...' : beobNichtBeurteiltNodesLength
  if (nodeLabelFilterString) {
    message = `${beobNichtBeurteiltNodesLength} gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'beobNichtBeurteiltFolder',
    id: apId,
    urlLabel: 'nicht-beurteilte-Beobachtungen',
    label: `Beobachtungen nicht beurteilt (${message})`,
    url: [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'nicht-beurteilte-Beobachtungen',
    ],
    sort: [projIndex, 1, apIndex, 9],
    hasChildren: beobNichtBeurteiltNodesLength > 0,
  }, ]
}