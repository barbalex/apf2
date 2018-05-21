// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

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
  const bers = get(data, 'bers.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = get(tree.nodeLabelFilter
    .find(f => f.table === 'ber'), 'value')

  const berNodesLength = bers
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${el.titel || '(kein Titel)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = berNodesLength
  if (tree.nodeLabelFilter.get('ber')) {
    message = `${berNodesLength} gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'berFolder',
    id: apId,
    urlLabel: 'Berichte',
    label: `Berichte (${message})`,
    url: ['Projekte', projId, 'Aktionspläne', apId, 'Berichte'],
    sort: [projIndex, 1, apIndex, 5],
    hasChildren: berNodesLength > 0,
  }, ]
}