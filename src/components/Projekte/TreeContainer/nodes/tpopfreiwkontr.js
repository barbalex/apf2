// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

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

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allTpopkontrs.nodes', [])
      // only show if parent node exists
      .filter(el =>
        nodesPassed.map(n => n.id).includes(`${el.tpopId}TpopfreiwkontrFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.tpopId === tpopId)
      .map(el => ({
        nodeType: 'table',
        menuType: 'tpopfreiwkontr',
        filterTable: 'tpopkontr',
        id: el.id,
        tableId: el.id,
        parentId: `${el.tpopId}TpopfreiwkontrFolder`,
        parentTableId: el.tpopId,
        urlLabel: el.id,
        label: el.labelEkf,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Freiwilligen-Kontrollen',
          el.id,
        ],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 4, index]
        return el
      }),
  )()

  return nodes
}
