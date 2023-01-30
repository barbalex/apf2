import { gql } from '@apollo/client'

const aperfkritNodes = ({
  data,
  projId,
  apId,
}) => {

  // map through all elements and create array of nodes
  const nodes = (data?.allErfkrits?.nodes ?? [])
    .map((el) => ({
      nodeType: 'table',
      menuType: 'erfkrit',
      filterTable: 'erfkrit',
      id: el.id,
      parentId: el.apId,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', el.apId, 'AP-Erfolgskriterien', el.id],
      hasChildren: false,
    }))

  return nodes
}

export default aperfkritNodes
