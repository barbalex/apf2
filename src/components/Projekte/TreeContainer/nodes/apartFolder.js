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
  const aparts = get(data, 'aparts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = get(tree.nodeLabelFilter.find(f => f.table === 'apart'), 'value')

  const apartNodesLength = aparts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return get(el, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)')
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = apartNodesLength
  if (tree.nodeLabelFilter.get('apart')) {
    message = `${apartNodesLength} gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'apArtFolder',
    id: apId,
    urlLabel: 'AP-Arten',
    label: `AP-Arten (${message})`,
    url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Arten'],
    sort: [projIndex, 1, apIndex, 7],
    hasChildren: apartNodesLength > 0,
  }, ]
}