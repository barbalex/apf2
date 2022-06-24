import findIndex from 'lodash/findIndex'

const popmassnberNodes = ({
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
  const nodes = (data?.allPopmassnbers?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.popId}PopmassnberFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.popId === popId)
    .map((el) => ({
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
        'Arten',
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
    })

  return nodes
}

export default popmassnberNodes
