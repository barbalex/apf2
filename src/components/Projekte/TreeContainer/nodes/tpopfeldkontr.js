// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import filterNodesByNodeFilterArray from '../filterNodesByNodeFilterArray'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  tpopNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  tpopId: String,
  mobxStore: Object,
}): Array<Object> => {
  const nodeFilter = get(mobxStore, `nodeFilter.${treeName}`)
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.tpopfeldkontr`,
  )
  const nodeFilterArray = Object.entries(nodeFilter.tpopfeldkontr).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  // map through all elements and create array of nodes
  let nodes = get(data, 'allTpopkontrs.nodes', [])
    // only show if parent node exists
    .filter(el =>
      nodesPassed.map(n => n.id).includes(`${el.tpopId}TpopfeldkontrFolder`),
    )
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
      parentId: `${tpopId}TpopfeldkontrFolder`,
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
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3, index]
      return el
    })

  return nodes
}
