import findIndex from 'lodash/findIndex'

const ekfrequenzNodes = ({
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
  const nodes = (data?.allEkfrequenzs?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.apId}Ekfrequenz`),
    )
    // only show nodes of this parent
    .filter((el) => el.apId === apId)
    .map((el) => ({
      nodeType: 'table',
      menuType: 'ekfrequenz',
      filterTable: 'ekfrequenz',
      id: el.id,
      parentId: el.apId,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.code || '(kein Code)',
      url: ['Projekte', projId, 'Aktionspläne', apId, 'EK-Frequenzen', el.id],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 9, index]
      return el
    })

  return nodes
}

export default ekfrequenzNodes
