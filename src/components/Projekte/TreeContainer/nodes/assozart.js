import { gql } from '@apollo/client'

const assozartNodes = ({
  data,
  projId,
  apId,
}) => {
  // map through all elements and create array of nodes
  const nodes = (data?.allAssozarts?.nodes ?? [])
    .map((el) => ({
      nodeType: 'table',
      menuType: 'assozart',
      filterTable: 'assozart',
      id: el.id,
      parentId: el.apId,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten', el.id],
      hasChildren: false,
    }))

  return nodes
}

export default assozartNodes
