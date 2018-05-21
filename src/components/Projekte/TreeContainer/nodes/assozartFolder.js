// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  treeName,
  projektNodes,
  projId,
  apNodes,
  apId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
}): Array<Object> => {
  const assozarts = get(data, 'assozarts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.assozart`)

  const assozartNodesLength = assozarts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return get(el, 'aeEigenschaftenByAeId.artname', '(keine Art gewählt)')
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = assozartNodesLength
  if (nodeLabelFilterString) {
    message = `${assozartNodesLength} gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'assozartFolder',
    id: apId,
    urlLabel: 'assoziierte-Arten',
    label: `assoziierte Arten (${message})`,
    url: ['Projekte', projId, 'Aktionspläne', apId, 'assoziierte-Arten'],
    sort: [projIndex, 1, apIndex, 8],
    hasChildren: assozartNodesLength > 0,
  }, ]
}