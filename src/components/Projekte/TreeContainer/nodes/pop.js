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
  projId,
  apId,
  nodeFilterState,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
  nodeFilterState: Object,
}): Array<Object> => {
  const pops = get(data, 'pops.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.pop`)
  const nodeFilter = nodeFilterState.state[treeName]
  const nodeFilterArray = Object.entries(nodeFilter.pop).filter(
    ([key, value]) => value || value === 0,
  )

  // map through all elements and create array of nodes
  const nodes = pops
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.nr || '(keine Nr)'}: ${el.name || '(kein Name)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    // filter by nodeFilter
    // TODO: would be much better to filter this in query
    // this is done
    // but unfortunately query does not immediatly update
    .filter(node => filterNodesByNodeFilterArray({ node, nodeFilterArray }))
    .map(el => ({
      nodeType: 'table',
      menuType: 'pop',
      filterTable: 'pop',
      id: el.id,
      parentId: el.apId,
      urlLabel: el.id,
      label: `${el.nr || '(keine Nr)'}: ${el.name || '(kein Name)'}`,
      url: ['Projekte', projId, 'Aktionspläne', el.apId, 'Populationen', el.id],
      hasChildren: true,
      nr: el.nr || 0,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    .filter(n => allParentNodesExist(nodesPassed, n))
    // sort again to sort (keine Nr) on top
    .sort((a, b) => a.nr - b.nr)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, index]
      return el
    })

  return nodes
}
