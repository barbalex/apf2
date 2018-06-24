// @flow
import findIndex from 'lodash/findIndex'

export default ({
  projektNodes,
  projId,
  apNodes,
  apId,
}: {
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
}): Array < Object > => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })

  return [{
    nodeType: 'folder',
    menuType: 'qkFolder',
    id: apId,
    urlLabel: 'Qualitaetskontrollen',
    label: 'Qualitätskontrollen',
    url: ['Projekte', projId, 'Aktionspläne', apId, 'Qualitaetskontrollen'],
    sort: [projIndex, 1, apIndex, 11],
    hasChildren: false,
  }, ]
}