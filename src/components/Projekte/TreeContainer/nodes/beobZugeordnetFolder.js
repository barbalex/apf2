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
  loading: Boolean,
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

  const childrenLength = get(data, 'allVApbeobs.nodes', [])
    .filter(el => el.tpopId === tpopId)
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

  let message = loading && !childrenLength ? '...' : childrenLength
  if (nodeLabelFilterString) {
    message = `${childrenLength} gefiltert`
  }

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'Populationen',
    popId,
    'Teil-Populationen',
    tpopId,
    'Beobachtungen',
  ]
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'beobZugeordnetFolder',
      filterTable: 'beob',
      id: tpopId,
      urlLabel: 'Beobachtungen',
      label: `Beobachtungen zugeordnet (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6],
      hasChildren: childrenLength > 0,
    },
  ].filter(n => allParentNodesExist(nodesPassed, n))
}
