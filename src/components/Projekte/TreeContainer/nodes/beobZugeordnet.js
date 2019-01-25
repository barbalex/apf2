// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import isValid from 'date-fns/isValid'
import format from 'date-fns/format'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'
import compareLabel from './compareLabel'

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
  mobxStore,
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
  mobxStore: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.beob`,
  )

  // map through all elements and create array of nodes
  const nodes = get(data, 'allVApbeobs.nodes', [])
    .filter(el => el.tpopId === tpopId)
    // filter by nodeLabelFilter
    .filter(el => {
      // some dates are not valid
      // need to account for that
      let datum = '(kein Datum)'
      if (!isValid(new Date(el.datum))) {
        datum = '(ungültiges Datum)'
      } else if (!!el.datum) {
        datum = format(new Date(el.datum), 'yyyy.MM.dd')
      }

      if (nodeLabelFilterString) {
        return `${datum}: ${el.autor || '(kein Autor)'} (${el.quelle})`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map((el, index) => {
      // some dates are not valid
      // need to account for that
      let datum = '(kein Datum)'
      if (!isValid(new Date(el.datum))) {
        datum = '(ungültiges Datum)'
      } else if (!!el.datum) {
        datum = format(new Date(el.datum), 'yyyy.MM.dd')
      }

      return {
        nodeType: 'table',
        menuType: 'beobZugeordnet',
        filterTable: 'beob',
        id: el.id,
        parentId: tpopId,
        urlLabel: el.id,
        label: `${datum}: ${el.autor || '(kein Autor)'} (${el.quelle})`,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Beobachtungen',
          el.id,
        ],
        hasChildren: false,
      }
    })
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    .filter(n => allParentNodesExist(nodesPassed, n))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6, index]
      return el
    })

  return nodes
}
