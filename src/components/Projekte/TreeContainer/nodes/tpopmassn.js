// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

import compareLabel from './compareLabel'
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
    `${treeName}.nodeLabelFilter.tpopmassn`,
  )
  const nodeFilterArray = Object.entries(nodeFilter.tpopmassn).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allTpopmassns.nodes', [])
      // only show if parent node exists
      .filter(el =>
        nodesPassed.map(n => n.id).includes(`${el.tpopId}TpopmassnFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.tpopId === tpopId)
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          return `${el.jahr || '(kein Jahr)'}: ${get(
            el,
            'tpopmassnTypWerteByTyp.text',
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
          table: 'tpopmassn',
        }),
      )
      .map((el, index) => ({
        nodeType: 'table',
        menuType: 'tpopmassn',
        filterTable: 'tpopmassn',
        id: el.id,
        parentId: el.tpopId,
        parentTableId: el.tpopId,
        urlLabel: el.id,
        label: `${el.jahr || '(kein Jahr)'}: ${get(
          el,
          'tpopmassnTypWerteByTyp.text',
          '(kein Typ)',
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
          'Massnahmen',
          el.id,
        ],
        hasChildren: false,
      }))
      // sort by label
      .sort(compareLabel)
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1, index]
        return el
      }),
  )()

  return nodes
}
