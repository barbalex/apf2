// @flow
import findIndex from 'lodash/findIndex'

export default ({
  projektNodes,
  projId,
  apNodes,
  apId,
}: {
  projektNodes: Array < Object > ,
  projId: String,
  apNodes: Array < Object > ,
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
    menuType: 'idealbiotopFolder',
    id: apId,
    urlLabel: 'Idealbiotop',
    label: 'Idealbiotop',
    url: ['Projekte', projId, 'Aktionspläne', apId, 'Idealbiotop'],
    sort: [projIndex, 1, apIndex, 6],
    hasChildren: false,
  }, ]
}