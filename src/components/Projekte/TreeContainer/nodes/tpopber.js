import findIndex from 'lodash/findIndex'

const tpopberNodes = ({
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
  const nodes = (data?.allTpopbers?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.tpopId}TpopberFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.tpopId === tpopId)
    .map((el) => ({
      nodeType: 'table',
      menuType: 'tpopber',
      filterTable: 'tpopber',
      parentId: `${el.tpopId}TpopberFolder`,
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
        'Kontroll-Berichte',
        el.id,
      ],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 5, index]
      return el
    })

  return nodes
}

export default tpopberNodes
