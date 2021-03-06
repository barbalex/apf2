import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

const popberNodes = ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  popNodes,
  projId,
  apId,
  popId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allPopbers.nodes', [])
      // only show if parent node exists
      .filter((el) =>
        nodesPassed.map((n) => n.id).includes(`${el.popId}PopberFolder`),
      )
      // only show nodes of this parent
      .filter((el) => el.popId === popId)
      .map((el) => ({
        nodeType: 'table',
        menuType: 'popber',
        filterTable: 'popber',
        id: el.id,
        parentId: el.popId,
        parentTableId: el.popId,
        urlLabel: el.id,
        label: el.label,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          popId,
          'Kontroll-Berichte',
          el.id,
        ],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 1, popIndex, 2, index]
        return el
      }),
  )()

  return nodes
}

export default popberNodes
