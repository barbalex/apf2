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
    get(data, 'allPopmassnbers.nodes', [])
      // only show if parent node exists
      .filter(el =>
        nodesPassed.map(n => n.id).includes(`${el.popId}PopmassnberFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.popId === popId)
      .map(el => ({
        nodeType: 'table',
        menuType: 'popmassnber',
        filterTable: 'popmassnber',
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
          'Massnahmen-Berichte',
          el.id,
        ],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 1, popIndex, 3, index]
        return el
      }),
  )()

  return nodes
}
