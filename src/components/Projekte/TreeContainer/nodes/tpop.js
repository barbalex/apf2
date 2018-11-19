// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'
import filterNodesByNodeFilterArray from '../filterNodesByNodeFilterArray'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  popNodes,
  projId,
  apId,
  popId,
  nodeFilter,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  popNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  nodeFilter: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.tpop`)
  const nodeFilterArray = Object.entries(nodeFilter.tpop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  // map through all elements and create array of nodes
  const nodes = get(data, 'tpops.nodes', [])
    .filter(el => el.popId === popId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.nr || '(keine Nr)'}: ${el.flurname || '(kein Flurname)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    // filter by nodeFilter
    // TODO: would be much better to filter this in query
    // this is done
    // but unfortunately query does not immediatly update
    .filter(node =>
      filterNodesByNodeFilterArray({
        node,
        nodeFilterArray,
        table: 'tpop',
      }),
    )
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'tpop',
      filterTable: 'tpop',
      id: el.id,
      parentId: el.popId,
      urlLabel: el.id,
      label: `${el.nr || '(keine Nr)'}: ${el.flurname || '(kein Flurname)'}`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        el.popId,
        'Teil-Populationen',
        el.id,
      ],
      hasChildren: true,
      nr: el.nr,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    .filter(n => allParentNodesExist(nodesPassed, n))
    // sort again to sort (keine Nr) on top
    .sort((a, b) => a.nr - b.nr)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, index]
      return el
    })

  return nodes
}
