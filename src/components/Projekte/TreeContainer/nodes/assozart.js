import findIndex from 'lodash/findIndex'

const assozartNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
  apNodes,
  projId,
  apId,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })

  // map through all elements and create array of nodes
  const nodes = (data?.allAssozarts?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.apId}AssozartFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.apId === apId)
    .map((el) => ({
      nodeType: 'table',
      menuType: 'assozart',
      filterTable: 'assozart',
      id: el.id,
      parentId: el.apId,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'assoziierte-Arten',
        el.id,
      ],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 8, index]
      return el
    })

  return nodes
}

export default assozartNodes
