import findIndex from 'lodash/findIndex'

const tpopfeldkontrNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })

  // map through all elements and create array of nodes
  let nodes = (data?.allTpopfeldkontrs?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.tpopId}TpopfeldkontrFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.tpopId === tpopId)
    .map((el) => ({
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
        'Arten',
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

export default tpopfeldkontrNodes
