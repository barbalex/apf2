import findIndex from 'lodash/findIndex'

const popNodes = ({
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
  const nodes = (data?.allPops?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.apId}PopFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.apId === apId)
    .map((el) => ({
      nodeType: 'table',
      menuType: 'pop',
      filterTable: 'pop',
      id: el.id,
      parentId: `${el.apId}PopFolder`,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', el.apId, 'Populationen', el.id],
      hasChildren: true,
      nr: el.nr || 0,
    }))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, index]
      return el
    })

  return nodes
}

export default popNodes
