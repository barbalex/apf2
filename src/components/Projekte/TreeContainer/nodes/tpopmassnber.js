import findIndex from 'lodash/findIndex'

const tpopmassnberNodes = ({
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
  const nodes = (data?.allTpopmassnbers?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.tpopId}TpopmassnberFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.tpopId === tpopId)
    .map((el) => ({
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
        'Arten',
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
    })

  return nodes
}

export default tpopmassnberNodes
