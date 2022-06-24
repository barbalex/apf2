import findIndex from 'lodash/findIndex'

const popberNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
  apNodes,
  popNodes,
  projId,
  apId,
  popId,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })

  // map through all elements and create array of nodes
  const nodes = (data?.allPopbers?.nodes ?? [])
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
        'Arten',
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
    })

  return nodes
}

export default popberNodes
