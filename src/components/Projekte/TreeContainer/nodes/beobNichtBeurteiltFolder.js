// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  const beobNichtBeurteilts = get(data, 'allVApbeobs.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.beob`,
  )

  const beobNichtBeurteiltNodesLength = beobNichtBeurteilts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        // some dates are not valid
        // need to account for that
        let datum = '(kein Datum)'
        if (!isValid(new Date(el.datum))) {
          datum = '(ungültiges Datum)'
        } else if (!!el.datum) {
          datum = format(new Date(el.datum), 'yyyy.MM.dd')
        }
        return `${datum}: ${el.autor || '(kein Autor)'} (${el.quelle})`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message =
    loading && !beobNichtBeurteiltNodesLength
      ? '...'
      : beobNichtBeurteiltNodesLength
  if (nodeLabelFilterString) {
    message = `${beobNichtBeurteiltNodesLength} gefiltert`
  }

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'nicht-beurteilte-Beobachtungen',
  ]
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'beobNichtBeurteiltFolder',
      filterTable: 'beob',
      id: apId,
      urlLabel: 'nicht-beurteilte-Beobachtungen',
      label: `Beobachtungen nicht beurteilt (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 10],
      hasChildren: beobNichtBeurteiltNodesLength > 0,
    },
  ].filter(n => allParentNodesExist(nodesPassed, n))
}
