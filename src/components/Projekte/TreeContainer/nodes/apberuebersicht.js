// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesExist from '../allParentNodesExist'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  projId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
  mobxStore: Object,
}): Array<Object> => {
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.apberuebersicht`,
  )
  const apberuebersichts = get(data, 'allApberuebersichts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })

  // map through all elements and create array of nodes
  const nodes = apberuebersichts
    // filter by projekt
    .filter(el => el.projId === projId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return el.jahr.toString().includes(nodeLabelFilterString)
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'apberuebersicht',
      filterTable: 'apberuebersicht',
      id: el.id,
      parentId: el.projId,
      urlLabel: el.jahr,
      label: el.jahr,
      url: ['Projekte', el.projId, 'AP-Berichte', el.id],
      hasChildren: false,
    }))
    .filter(n => allParentNodesExist(nodesPassed, n))
    // sort by Jahr
    //.sort((a, b) => (a.jahr || 0) - (b.jahr || 0))
    .map((el, index) => {
      el.sort = [projIndex, 2, index]
      return el
    })
  return nodes
}
