import { gql } from '@apollo/client'

const apberNodes = ({
  data,
  projId,
  apId,
}) => {
  const apbers = data?.allApbers?.nodes ?? []
  // map through all elements and create array of nodes
  let nodes = apbers
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

  return nodes
}

export default apberNodes
