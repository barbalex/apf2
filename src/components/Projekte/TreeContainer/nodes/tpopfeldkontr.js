// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

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
  store,
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
  store: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })

  // map through all elements and create array of nodes
  let nodes = get(data, 'allTpopkontrs.nodes', [])
    // only show if parent node exists
    .filter(el =>
      nodesPassed.map(n => n.id).includes(`${el.tpopId}TpopfeldkontrFolder`),
    )
    // only show nodes of this parent
    .filter(el => el.tpopId === tpopId)
    .map(el => ({
      nodeType: 'table',
      menuType: 'tpopfeldkontr',
      filterTable: 'tpopkontr',
      id: el.id,
      parentId: `${el.tpopId}TpopfeldkontrFolder`,
      parentTableId: el.tpopId,
      urlLabel: el.id,
      label: el.labelEk,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Feld-Kontrollen',
        el.id,
      ],
      hasChildren: true,
    }))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3, index]
      return el
    })

  return nodes
}
