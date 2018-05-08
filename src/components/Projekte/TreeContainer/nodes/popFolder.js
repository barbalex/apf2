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
  const pops = get(data, 'pops.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = tree.nodeLabelFilter.get('pop')

  const popNodesLength = pops
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.nr || '(keine Nr)'}: ${el.name || '(kein Name)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = popNodesLength
  if (tree.nodeLabelFilter.get('pop')) {
    message = `${popNodesLength} gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'popFolder',
    id: apId,
    urlLabel: 'Populationen',
    label: `Populationen (${message})`,
    url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen'],
    sort: [projIndex, 1, apIndex, 1],
    hasChildren: popNodesLength > 0,
  }, ]
}