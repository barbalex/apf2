// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'
import allParentNodesAreOpen from '../allParentNodesAreOpen'

export default ({
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  projId,
  apId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
}): Array<Object> => {
  const aparts = get(data, 'aparts.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.apart`)

  // map through all elements and create array of nodes
  const nodes = aparts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const apart =
          get(el, 'aeEigenschaftenByArtId.artname') || '(keine Art gewählt)'
        return apart.toLowerCase().includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'apart',
      filterTable: 'apart',
      id: el.id,
      parentId: apId,
      urlLabel: el.id,
      label: get(el, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)'),
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Arten', el.id],
      hasChildren: false,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 7, index]
      return el
    })

  return nodes
}
