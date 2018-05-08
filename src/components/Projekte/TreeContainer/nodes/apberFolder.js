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
  const apbers = get(data, 'apbers.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = tree.nodeLabelFilter.get('apber')

  const apberNodesLength = apbers
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return (el.jahr || '(kein Jahr)').includes(
          nodeLabelFilterString.toLowerCase()
        )
      }
      return true
    }).length
  let message = apberNodesLength
  if (tree.nodeLabelFilter.get('apber')) {
    message = `${apberNodesLength} gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'apberFolder',
    id: apId,
    urlLabel: 'AP-Berichte',
    label: `AP-Berichte (${message})`,
    url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte'],
    sort: [projIndex, 1, apIndex, 4],
    hasChildren: apberNodesLength > 0,
  }, ]
}