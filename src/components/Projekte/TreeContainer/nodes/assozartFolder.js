// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

export default ({
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
}: {
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
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
        const artname = get(el, 'aeEigenschaftenByAeId.artname') || '(keine Art gewählt)'
        return artname
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = (loading && !assozartNodesLength) ? '...' : assozartNodesLength
  if (nodeLabelFilterString) {
    message = `${assozartNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'assoziierte-Arten']
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [{
    nodeType: 'folder',
    menuType: 'assozartFolder',
    id: apId,
    urlLabel: 'assoziierte-Arten',
    label: `assoziierte Arten (${message})`,
    url,
    sort: [projIndex, 1, apIndex, 8],
    hasChildren: assozartNodesLength > 0,
  }, ]
}