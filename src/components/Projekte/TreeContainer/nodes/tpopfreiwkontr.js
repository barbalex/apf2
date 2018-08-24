// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

export default ({
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  popNodes,
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  popNodes: Array<Object>,
  tpopNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  tpopId: String,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const nodeLabelFilterString = get(
    data,
    `${treeName}.nodeLabelFilter.tpopfreiwkontr`,
  )

  // map through all elements and create array of nodes
  let nodes = get(data, 'tpopfreiwkontrs.nodes', [])
    .filter(el => el.tpopId === tpopId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
  nodes = sortBy(nodes, n => {
    if (n.datum) return n.datum
    if (n.jahr) return `${n.jahr}-01-01`
    return '(kein Jahr)'
  })
    .map(el => ({
      nodeType: 'table',
      menuType: 'tpopfreiwkontr',
      filterTable: 'tpopkontr',
      id: el.id,
      parentId: tpopId,
      urlLabel: el.id,
      label: `${el.jahr || '(kein Jahr)'}`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Freiwilligen-Kontrollen',
        el.id,
      ],
      hasChildren: false,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 4, index]
      return el
    })

  return nodes
}
