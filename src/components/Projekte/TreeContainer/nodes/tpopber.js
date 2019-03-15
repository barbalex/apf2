// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

import compareLabel from './compareLabel'

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
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.tpopber`) || ''

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allTpopbers.nodes', [])
      // only show if parent node exists
      .filter(el =>
        nodesPassed.map(n => n.id).includes(`${el.tpopId}TpopberFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.tpopId === tpopId)
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          return `${el.jahr || '(kein Jahr)'}: ${get(
            el,
            'tpopEntwicklungWerteByEntwicklung.text',
          ) || '(nicht beurteilt)'}`
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      })
      .map((el, index) => ({
        nodeType: 'table',
        menuType: 'tpopber',
        filterTable: 'tpopber',
        parentId: `${el.tpopId}TpopberFolder`,
        parentTableId: el.tpopId,
        id: el.id,
        urlLabel: el.id,
        label: `${el.jahr || '(kein Jahr)'}: ${get(
          el,
          'tpopEntwicklungWerteByEntwicklung.text',
          '(nicht beurteilt)',
        )}`,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Kontroll-Berichte',
          el.id,
        ],
        hasChildren: false,
      }))
      // sort by label
      .sort(compareLabel)
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 5, index]
        return el
      }),
  )()

  return nodes
}
