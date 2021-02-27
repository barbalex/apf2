import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

const tpopmassnberNodes = ({
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
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allTpopmassnbers.nodes', [])
      // only show if parent node exists
      .filter((el) =>
        nodesPassed.map((n) => n.id).includes(`${el.tpopId}TpopmassnberFolder`),
      )
      // only show nodes of this parent
      .filter((el) => el.tpopId === tpopId)
      .map((el, index) => ({
        nodeType: 'table',
        menuType: 'tpopmassnber',
        filterTable: 'tpopmassnber',
        parentId: el.tpopId,
        parentTableId: el.tpopId,
        id: el.id,
        urlLabel: el.id,
        label: el.label,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Massnahmen-Berichte',
          el.id,
        ],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 2, index]
        return el
      }),
  )()

  return nodes
}

export default tpopmassnberNodes
