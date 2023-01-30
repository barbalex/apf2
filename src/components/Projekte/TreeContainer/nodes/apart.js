import { gql } from '@apollo/client'

const apartNodes = ({
  data,
  projId,
  apId,
}) => {
  // map through all elements and create array of nodes
  const nodes = (data?.allAparts?.nodes ?? [])
    .map((el) => ({
      nodeType: 'table',
      menuType: 'apart',
      filterTable: 'apart',
      id: el.id,
      parentId: el.apId,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', apId, 'Taxa', el.id],
      hasChildren: false,
    }))

  return nodes
}

export default apartNodes
