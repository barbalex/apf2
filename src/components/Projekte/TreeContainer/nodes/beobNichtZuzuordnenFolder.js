// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import format from 'date-fns/format'

export default ({
  data,
  tree,
  projektNodes,
  projId,
  apNodes,
  apId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array < Object > ,
  projId: String,
  apNodes: Array < Object > ,
  apId: String,
}): Array < Object > => {
  const beobNichtZuzuordnens = get(data, 'beobNichtZuzuordnens.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = get(tree.nodeLabelFilter
    .find(f => f.table === 'beobNichtZuzuordnen'), 'value')

  const beobNichtZuzuordnenNodesLength = beobNichtZuzuordnens
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
  let message = beobNichtZuzuordnenNodesLength
  if (tree.nodeLabelFilter.get('beobNichtZuzuordnen')) {
    message = `${beobNichtZuzuordnenNodesLength} gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'beobNichtZuzuordnenFolder',
    id: apId,
    urlLabel: 'nicht-zuzuordnende-Beobachtungen',
    label: `Beobachtungen nicht zuzuordnen (${message})`,
    url: [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'nicht-zuzuordnende-Beobachtungen',
    ],
    sort: [projIndex, 1, apIndex, 10],
    hasChildren: beobNichtZuzuordnenNodesLength > 0,
  }, ]
}