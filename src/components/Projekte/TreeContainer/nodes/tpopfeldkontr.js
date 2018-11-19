// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

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
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
  nodeFilter,
}: {
  nodes: Array<Object>,
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
  nodeFilter: Object,
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
    `${treeName}.nodeLabelFilter.tpopfeldkontr`,
  )
  const nodeFilterArray = Object.entries(nodeFilter.tpopfeldkontr).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  // map through all elements and create array of nodes
  let nodes = get(data, 'tpopfeldkontrs.nodes', [])
    .filter(el => el.tpopId === tpopId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${get(
          el,
          'tpopkontrTypWerteByTyp.text',
        ) || '(kein Typ)'}`
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
        table: 'tpopfeldkontr',
      }),
    )
  nodes = sortBy(nodes, n => {
    if (n.datum) return n.datum
    if (n.jahr) return `${n.jahr}-01-01`
    return '(kein Jahr)'
  })
    .map(el => ({
      nodeType: 'table',
      menuType: 'tpopfeldkontr',
      filterTable: 'tpopkontr',
      id: el.id,
      parentId: tpopId,
      urlLabel: el.id,
      label: `${el.jahr || '(kein Jahr)'}: ${get(
        el,
        'tpopkontrTypWerteByTyp.text',
      ) || '(kein Typ)'}`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Feld-Kontrollen',
        el.id,
      ],
      hasChildren: true,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    .filter(n => allParentNodesExist(nodesPassed, n))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3, index]
      return el
    })

  return nodes
}
