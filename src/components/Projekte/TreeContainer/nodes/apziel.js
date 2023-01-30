import { gql } from '@apollo/client'

const apzielNodes = ({
  data,
  projId,
  apId,
  jahr,
}) => {
  // map through all elements and create array of nodes
  const nodes = (data?.allZiels?.nodes ?? [])
    .filter((el) => el.apId === apId)
    .filter((el) => el.jahr === jahr)
    .map((el) => ({
      nodeType: 'table',
      menuType: 'ziel',
      filterTable: 'ziel',
      id: el.id,
      parentId: el.apId,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', el.apId, 'AP-Ziele', el.jahr, el.id],
      hasChildren: true,
    }))

  return nodes
}

export default apzielNodes
