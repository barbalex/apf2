import findIndex from 'lodash/findIndex'

const ekzaehleinheitNodes = ({
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
  const nodes = (data?.allEkzaehleinheits?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.apId}Ekzaehleinheit`),
    )
    // only show nodes of this parent
    .filter((el) => el.apId === apId)
    .map((el) => ({
      nodeType: 'table',
      menuType: 'ekzaehleinheit',
      filterTable: 'ekzaehleinheit',
      id: el.id,
      parentId: el.apId,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten', el.id],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 10, index]
      return el
    })

  return nodes
}

export default ekzaehleinheitNodes
