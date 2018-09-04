// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'
import allParentNodesExist from '../allParentNodesExist'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  projId,
  nodeFilter,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
  nodeFilter: Object,
}): Array<Object> => {
  const apFilter = get(data, `${treeName}.apFilter`)
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.ap`)
  const aps = get(data, 'aps.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })

  // map through all elements and create array of nodes
  const nodes = aps
    // filter by projekt
    .filter(el => el.projId === projId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const artname = get(el, 'aeEigenschaftenByArtId.artname') || ''
        return artname
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    // filter by apFilter
    .filter(el => {
      if (apFilter) {
        return [1, 2, 3].includes(el.bearbeitung)
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'ap',
      filterTable: 'ap',
      id: el.id,
      parentId: el.projId,
      urlLabel: el.id,
      label: get(el, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)'),
      url: ['Projekte', el.projId, 'Aktionspläne', el.id],
      hasChildren: true,
    }))
    .filter(n => allParentNodesExist(nodesPassed, n))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, index]
      return el
    })
  console.log('nodes, ap, length:', nodes.length)
  return nodes
}
