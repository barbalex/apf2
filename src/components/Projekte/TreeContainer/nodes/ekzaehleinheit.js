import { gql } from '@apollo/client'

const ekzaehleinheitNodes = ({
  data,
  projId,
  apId,
}) => {

  // map through all elements and create array of nodes
  const nodes = (data?.allEkzaehleinheits?.nodes ?? [])
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

  return nodes
}

export default ekzaehleinheitNodes
