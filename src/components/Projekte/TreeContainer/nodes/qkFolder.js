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

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Qualitaetskontrollen']
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [{
    nodeType: 'folder',
    menuType: 'qkFolder',
    id: apId,
    urlLabel: 'Qualitaetskontrollen',
    label: 'Qualitätskontrollen',
    url,
    sort: [projIndex, 1, apIndex, 11],
    hasChildren: false,
  }]
}