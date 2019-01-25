// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

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
  projId,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  const beobNichtZuzuordnens = get(data, 'allVApbeobs.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.beob`,
  )

  // map through all elements and create array of nodes
  const nodes = beobNichtZuzuordnens
    .filter(el => el.apId === apId)
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
    .map(el => {
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
        menuType: 'beobNichtZuzuordnen',
        filterTable: 'beob',
        id: el.id,
        parentId: apId,
        urlLabel: el.id,
        label: `${datum}: ${el.autor || '(kein Autor)'} (${el.quelle})`,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'nicht-zuzuordnende-Beobachtungen',
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
      el.sort = [projIndex, 1, apIndex, 11, index]
      return el
    })

  return nodes
}
