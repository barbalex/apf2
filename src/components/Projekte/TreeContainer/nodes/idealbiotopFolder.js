// @flow
import findIndex from 'lodash/findIndex'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

export default ({
  data,
  treeName,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  apId: String,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Idealbiotop']
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [{
    nodeType: 'folder',
    menuType: 'idealbiotopFolder',
    id: apId,
    urlLabel: 'Idealbiotop',
    label: 'Idealbiotop',
    url,
    sort: [projIndex, 1, apIndex, 6],
    hasChildren: false,
  }, ]
}