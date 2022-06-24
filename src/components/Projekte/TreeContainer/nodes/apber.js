import findIndex from 'lodash/findIndex'

const apberNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
  apNodes,
  projId,
  apId,
}) => {
  const apbers = data?.allApbers?.nodes ?? []
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })

  // map through all elements and create array of nodes
  let nodes = apbers
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.apId}ApberFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.apId === apId)
    .map((el) => ({
      nodeType: 'table',
      menuType: 'apber',
      filterTable: 'apber',
      id: el.id,
      parentId: el.apId,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', el.apId, 'AP-Berichte', el.id],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 4, index]
      return el
    })

  return nodes
}

export default apberNodes
